import { Dimensions } from "../../Utils";

const $ = require("jquery");
import { IIIFEvents } from "../../IIIFEvents";
import { MediaElementExtensionEvents } from "../../extensions/uv-mediaelement-extension/Events";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { IMediaElementExtension } from "../../extensions/uv-mediaelement-extension/IMediaElementExtension";
import { sanitize } from "../../../../Utils";
import { MediaType, RenderingFormat } from "@iiif/vocabulary/dist-commonjs/";
import {
  AnnotationBody,
  Canvas,
  IExternalResource,
  Rendering,
} from "manifesto.js";
import "mediaelement/build/mediaelement-and-player";
import "mediaelement/build/mediaelementplayer.min.css";
import "./js/source-chooser-fixed.js";
import "mediaelement-plugins/dist/source-chooser/source-chooser.css";
import { TFragment } from "../uv-shared-module/TFragment";
import { Events } from "../../../../Events";
import { Config } from "../../extensions/uv-mediaelement-extension/config/Config";

type TextTrackDescriptor = {
  language?: string;
  label?: string;
  id: string;
};

const captionTypes = new Set<String>(["text/vtt", "text/srt"]);

// A label in raw annotation JSON may be a plain string or a language map.
const captionLabel = (label: any): string | undefined => {
  if (!label || typeof label === "string") {
    return label || undefined;
  }
  const values = label[Object.keys(label)[0]];
  return Array.isArray(values) ? values[0] : undefined;
};

type MediaSourceDescriptor = {
  label: string;
  type: string;
  src: string;
};

export class MediaElementCenterPanel extends CenterPanel<
  Config["modules"]["mediaElementCenterPanel"]
> {
  $wrapper: JQuery;
  $container: JQuery;
  $media: JQuery;
  mediaHeight: number;
  mediaWidth: number;
  player: any;
  title: string | null;
  pauseTimeoutId: any = null;
  muted: boolean = false;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("mediaElementCenterPanel");

    super.create();

    const that = this;

    this.extensionHost.subscribe(Events.TOGGLE_FULLSCREEN, () => {
      this.resize();
    });

    this.extensionHost.subscribe(IIIFEvents.SET_TARGET, (target: TFragment) => {
      // Clear any existing timeout
      if (that.pauseTimeoutId !== null) {
        clearTimeout(that.pauseTimeoutId);
        that.pauseTimeoutId = null;
      }

      let t: number | [number, number] = target.t;

      if (Array.isArray(t)) {
        if ((t as [number] | [number, number]).length === 1) {
          t = t[0];
        } else {
          const [startTime, endTime] = t;

          if (endTime <= startTime) {
            console.error("endTime must be greater than startTime");
            return;
          }

          that.player.setCurrentTime(startTime);

          if (that.config.options.autoPlayOnSetTarget) {
            const duration = (endTime - startTime) * 1000;

            that.pauseTimeoutId = setTimeout(() => {
              that.player.pause();
              that.pauseTimeoutId = null; // Clear the timeout ID after execution
            }, duration);

            that.player.play();
          }

          return;
        }
      }

      that.player.setCurrentTime(t);

      if (that.config.options.autoPlayOnSetTarget) {
        that.player.play();
      }
    });

    this.extensionHost.subscribe(IIIFEvents.SET_MUTED, (muted: boolean) => {
      if (that.player) {
        that.player.setMuted(muted);
        that.updateMutedAttribute(muted);
      }
    });

    this.extensionHost.subscribe(
      IIIFEvents.OPEN_EXTERNAL_RESOURCE,
      (resources: IExternalResource[]) => {
        that.openMedia(resources);
      }
    );

    this.$wrapper = $('<div class="wrapper"></div>');
    this.$content.append(this.$wrapper);

    this.$container = $('<div class="container"></div>');
    this.$wrapper.append(this.$container);

    this.title = this.extension.helper.getLabel();
  }

  updateMutedAttribute(muted: boolean) {
    if (muted) {
      this.$media.attr("muted", "");
    } else {
      this.$media.removeAttr("muted");
    }
  }

  async openMedia(resources: IExternalResource[]) {
    const that = this;

    await this.extension.getExternalResources(resources);

    this.$container.empty();

    const canvas: Canvas = this.extension.helper.getCurrentCanvas();

    this.mediaHeight = this.options.defaultHeight;
    this.mediaWidth = this.options.defaultWidth;

    const poster: string | null = (<IMediaElementExtension>(
      this.extension
    )).getPosterImageUri();

    const sources: Array<MediaSourceDescriptor> = [];
    const subtitles: Array<TextTrackDescriptor> = [];

    const renderings: Rendering[] = canvas.getRenderings();

    if (renderings && renderings.length) {
      canvas.getRenderings().forEach((rendering: Rendering) => {
        if (this.isTypeMedia(rendering)) {
          sources.push({
            label:
              rendering.getLabel().getValue() ??
              rendering.getFormat().toString(),
            type: rendering.getFormat().toString(),
            src: rendering.id,
          });
        }

        if (this.isTypeCaption(rendering)) {
          subtitles.push({
            label:
              rendering.getLabel().getValue() ??
              rendering.getFormat().toString(),
            id: rendering.id,
          });
        }
      });
    } else {
      const formats: AnnotationBody[] | null = this.extension.getMediaFormats(
        this.extension.helper.getCurrentCanvas()
      );

      if (formats && formats.length) {
        formats.forEach((format: AnnotationBody) => {
          const type = format.getFormat();

          if (type === null) {
            return;
          }

          if (this.isTypeMedia(format)) {
            sources.push({
              label: format.__jsonld.label ? format.__jsonld.label : "",
              type: type.toString(),
              src: format.id,
            });
          }

          if (this.isTypeCaption(format)) {
            subtitles.push(format.__jsonld);
          }
        });
      }
    }

    // Captions may also be supplied as supplementing annotations on the
    // canvas (IIIF cookbook recipe 0219).
    const supplementing = await this.getSupplementingCaptions(canvas);
    for (const caption of supplementing) {
      if (!subtitles.some((subtitle) => subtitle.id === caption.id)) {
        subtitles.push(caption);
      }
    }

    if (subtitles.length > 0) {
      // Resolve caption URLs to ones the player's XHR will be able to read.
      for (const subtitle of subtitles) {
        if (subtitle.id) {
          subtitle.id = await this.resolveCaptionSource(subtitle.id);
        }
      }

      // Show captions options popover for better interface feedback
      subtitles.unshift({ id: "none" });
    }

    if (this.isVideo()) {
      this.$media = $(
        '<video controls="controls" preload="none" style="width:100%;height:100%;" width="100%" height="100%"></video>'
      );

      // Add VTT subtitles/captions.
      this.appendTextTracks(subtitles);
      this.appendMediaSources(sources);

      this.$container.append(this.$media);

      this.player = new MediaElementPlayer($("video")[0], {
        iconSprite: this.config.options.iconSprite,
        poster: poster,
        toggleCaptionsButtonWhenOnlyOne: true,
        features: [
          "playpause",
          "current",
          "progress",
          "tracks",
          "volume",
          "sourcechooser",
          "fullscreen",
        ],
        success: function (mediaElement: any, originalNode: any) {
          mediaElement.addEventListener("loadstart", () => {
            // console.log("loadstart");
            that.resize();
          });

          mediaElement.addEventListener("play", () => {
            that.extensionHost.publish(
              MediaElementExtensionEvents.MEDIA_PLAYED,
              Math.floor(mediaElement.currentTime)
            );
          });

          mediaElement.addEventListener("pause", () => {
            if (this.pauseTimeoutId !== null) {
              clearTimeout(this.pauseTimeoutId);
              this.pauseTimeoutId = null;
            }
            // mediaelement creates a pause event before the ended event. ignore this.
            if (
              Math.floor(mediaElement.currentTime) !=
              Math.floor(mediaElement.duration)
            ) {
              that.extensionHost.publish(
                MediaElementExtensionEvents.MEDIA_PAUSED,
                Math.floor(mediaElement.currentTime)
              );
            }
          });

          mediaElement.addEventListener("ended", () => {
            that.extensionHost.publish(
              MediaElementExtensionEvents.MEDIA_ENDED,
              Math.floor(mediaElement.duration)
            );
          });

          mediaElement.addEventListener("timeupdate", () => {
            that.extensionHost.publish(
              MediaElementExtensionEvents.MEDIA_TIME_UPDATE,
              Math.floor(mediaElement.currentTime)
            );
          });

          mediaElement.addEventListener("volumechange", (volume) => {
            const muted: boolean = volume.detail.target.getMuted();

            if (that.muted === false && muted === true) {
              that.muted = true;
              that.extensionHost.fire(MediaElementExtensionEvents.MEDIA_MUTED);
            }

            if (that.muted === true && muted === false) {
              that.muted = false;

              that.extensionHost.fire(
                MediaElementExtensionEvents.MEDIA_UNMUTED
              );
            }

            that.updateMutedAttribute(that.muted);
          });
        },
      });
    } else {
      // audio

      this.$media = $(
        '<audio controls="controls" preload="none" style="width:100%;height:100%;" width="100%" height="100%"></audio>'
      );

      // Add VTT subtitles/captions.
      this.appendTextTracks(subtitles);
      this.appendMediaSources(sources);

      this.$container.append(this.$media);

      this.player = new MediaElementPlayer($("audio")[0], {
        poster: poster,
        defaultAudioWidth: "auto",
        features: [
          "playpause",
          "current",
          "progress",
          "tracks",
          "volume",
          "sourcechooser",
        ],
        stretching: "responsive",
        defaultAudioHeight: "auto",
        hideVolumeOnTouchDevices: false,
        showPosterWhenPaused: true,
        showPosterWhenEnded: true,
        success: function (mediaElement: any, originalNode: any) {
          mediaElement.addEventListener("play", () => {
            that.extensionHost.publish(
              MediaElementExtensionEvents.MEDIA_PLAYED,
              Math.floor(mediaElement.currentTime)
            );
          });

          mediaElement.addEventListener("pause", () => {
            if (this.pauseTimeoutId !== null) {
              clearTimeout(this.pauseTimeoutId);
              this.pauseTimeoutId = null;
            }
            // mediaelement creates a pause event before the ended event. ignore this.
            if (
              Math.floor(mediaElement.currentTime) !=
              Math.floor(mediaElement.duration)
            ) {
              that.extensionHost.publish(
                MediaElementExtensionEvents.MEDIA_PAUSED,
                Math.floor(mediaElement.currentTime)
              );
            }
          });

          mediaElement.addEventListener("ended", () => {
            that.extensionHost.publish(
              MediaElementExtensionEvents.MEDIA_ENDED,
              Math.floor(mediaElement.duration)
            );
          });

          mediaElement.addEventListener("timeupdate", () => {
            that.extensionHost.publish(
              MediaElementExtensionEvents.MEDIA_TIME_UPDATE,
              Math.floor(mediaElement.currentTime)
            );
          });

          mediaElement.addEventListener("volumechange", (volume) => {
            const muted: boolean = volume.detail.target.getMuted();

            if (that.muted === false && muted === true) {
              that.muted = true;
              that.extensionHost.fire(MediaElementExtensionEvents.MEDIA_MUTED);
            }

            if (that.muted === true && muted === false) {
              that.muted = false;
              that.extensionHost.fire(
                MediaElementExtensionEvents.MEDIA_UNMUTED
              );
            }

            that.updateMutedAttribute(that.muted);
          });
        },
      });
    }

    this.extensionHost.publish(Events.EXTERNAL_RESOURCE_OPENED);
    this.extensionHost.publish(Events.LOAD);
  }

  // Captions/transcriptions supplied as supplementing annotations in the
  // canvas' annotations pages (IIIF cookbook recipe 0219). Inline
  // annotation pages are read directly; pages referenced by id alone are
  // fetched.
  async getSupplementingCaptions(
    canvas: Canvas
  ): Promise<TextTrackDescriptor[]> {
    const captions: TextTrackDescriptor[] = [];
    const pages: any[] = canvas.getProperty("annotations") || [];

    for (const page of pages) {
      let items: any[] = page.items;

      if (!items && page.id) {
        try {
          const response = await fetch(page.id);
          if (response.ok) {
            items = (await response.json()).items;
          }
        } catch {
          console.warn(
            `Annotation page ${page.id} could not be read (CORS headers are required); any captions it contains will be unavailable.`
          );
        }
      }

      if (!items) {
        continue;
      }

      for (const annotation of items) {
        const motivations = Array.isArray(annotation.motivation)
          ? annotation.motivation
          : [annotation.motivation];

        if (!motivations.includes("supplementing")) {
          continue;
        }

        const bodies = Array.isArray(annotation.body)
          ? annotation.body
          : [annotation.body];

        for (const body of bodies) {
          if (body && body.id && captionTypes.has(body.format)) {
            captions.push({
              id: body.id,
              label: captionLabel(body.label),
              language: body.language,
            });
          }
        }
      }
    }

    return captions;
  }

  // Captions are fetched with XHR by the player, so a cross-origin URL is
  // only readable when every response hop carries CORS headers. Follow any
  // CORS-friendly redirect to its final URL, and retry plain-http sources
  // over https — an http -> https upgrade redirect whose 301 response lacks
  // CORS headers is blocked by the browser even though its destination is
  // readable.
  async resolveCaptionSource(src: string): Promise<string> {
    const attempts: string[] = [src];

    if (src.startsWith("http://")) {
      attempts.push(src.replace(/^http:\/\//, "https://"));
    }

    for (const attempt of attempts) {
      try {
        const response = await fetch(attempt);
        if (response.ok) {
          return response.url;
        }
      } catch {
        // expected when the attempt is blocked by CORS or mixed content;
        // fall through to the next candidate
      }
    }

    console.warn(
      `Captions at ${src} could not be read (CORS headers are required on every response, including redirects); the player will omit this track.`
    );

    return src;
  }

  appendTextTracks(subtitles: Array<TextTrackDescriptor>) {
    for (const subtitle of subtitles) {
      this.$media.append(
        $(`<track label="${subtitle.label}" kind="subtitles" srclang="${
          subtitle.language
        }" src="${subtitle.id}" ${
          subtitles.indexOf(subtitle) === 0 ? "default" : ""
        }>
`)
      );
    }
  }

  appendMediaSources(sources: Array<MediaSourceDescriptor>) {
    for (const source of sources) {
      this.$media.append(
        $(
          `<source src="${source.src}" type="${source.type}" title="${source.label}">`
        )
      );
    }
  }

  // audio/video
  isTypeMedia(element: Rendering | AnnotationBody) {
    const type: RenderingFormat | MediaType | null = element.getFormat();

    if (type === null) {
      return false;
    }

    const typeStr = type.toString();
    const typeGroup = typeStr.split("/")[0];

    return typeGroup === "audio" || typeGroup === "video";
  }

  // vtt, srt
  isTypeCaption(element: Rendering | AnnotationBody) {
    const type: RenderingFormat | MediaType | null = element.getFormat();

    if (type === null) {
      return false;
    }

    return captionTypes.has(type.toString());
  }

  isVideo(): boolean {
    return (<IMediaElementExtension>this.extension).isVideo();
  }

  resize() {
    super.resize();

    if (!this.mediaWidth || !this.mediaHeight) {
      return;
    }

    if (this.title) {
      this.$title.text(sanitize(this.title));
    }

    const size = Dimensions.fitRect(
      this.mediaWidth,
      this.mediaHeight,
      this.$content.width(),
      this.$content.height()
    );

    this.$container.height(size.height);
    this.$container.width(size.width);

    if (this.player) {
      this.$media.width(size.width);
      this.$media.height(size.height);
    }

    if (this.player) {
      this.player.setPlayerSize();
      this.player.setControlsSize();
    }
  }
}
