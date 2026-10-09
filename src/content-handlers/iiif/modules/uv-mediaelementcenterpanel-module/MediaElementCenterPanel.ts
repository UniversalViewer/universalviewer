import { Dimensions } from "../../Utils";

const $ = require("jquery");
import { IIIFEvents } from "../../IIIFEvents";
import { MediaElementExtensionEvents } from "../../extensions/uv-mediaelement-extension/Events";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { IMediaElementExtension } from "../../extensions/uv-mediaelement-extension/IMediaElementExtension";
import { sanitize } from "../../../../Utils";
import { MediaType } from "@iiif/vocabulary/dist-commonjs/";
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
import { getCanvasCaptions } from "../uv-captions-module/Captions";
import { CaptionLibrary } from "../uv-captions-module/CaptionLibrary";
import { CanvasCaptions } from "../uv-captions-module/CanvasCaptions";
import { PosterImages } from "../uv-shared-module/PosterImages";
import { mediaKind } from "../uv-shared-module/MediaKind";
import { loadDash, loadHls } from "../uv-shared-module/StreamingLibraries";
import { isHLSFormat } from "../iiif-av-component-module/helpers/is-hls-format";
import { isMpegDashFormat } from "../iiif-av-component-module/helpers/is-mpeg-dash-format";

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
  // Shared by the canvases this panel plays, so the caption track chosen
  // carries over from one to the next.
  private _captionLibrary = new CaptionLibrary(
    () => (canvas: Canvas) =>
      getCanvasCaptions(canvas, this.extension.getLocale())
  );
  private _captions: CanvasCaptions | undefined;

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

    if (this._captions) {
      this._captions.destroy();
    }
    this.$container.empty();

    const canvas: Canvas = this.extension.helper.getCurrentCanvas();

    this.mediaHeight = this.options.defaultHeight;
    this.mediaWidth = this.options.defaultWidth;

    const posterImages: PosterImages = (<IMediaElementExtension>(
      this.extension
    )).getPosterImages();
    const poster: string = posterImages.beforePlay
      ? posterImages.beforePlay.id
      : "";

    const sources: Array<MediaSourceDescriptor> = [];

    const renderings: Rendering[] = canvas.getRenderings();

    // Media may be supplied as renderings on the canvas (IIIF cookbook recipe
    // 0046 covers the rendering property), otherwise as the bodies of its
    // painting annotation.
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
        });
      }
    }

    // MediaElement plays HLS and MPEG-DASH with hls.js and dash.js, which it
    // would fetch from a CDN unless they're already loaded.
    if (sources.some((source) => isHLSFormat(source.type as MediaType))) {
      await loadHls();
    }
    if (sources.some((source) => isMpegDashFormat(source.type as MediaType))) {
      await loadDash();
    }

    if (this.isVideo()) {
      this.$media = $(
        '<video controls="controls" preload="none" style="width:100%;height:100%;" width="100%" height="100%"></video>'
      );

      this.appendMediaSources(sources);

      this.$container.append(this.$media);

      this.player = new MediaElementPlayer($("video")[0], {
        iconSprite: this.config.options.iconSprite,
        poster: poster,
        features: [
          "playpause",
          "current",
          "progress",
          "volume",
          "sourcechooser",
          "fullscreen",
        ],
        success: function (mediaElement: any, originalNode: any, player: any) {
          that._reportMediaErrors(mediaElement);
          that._showCaptions(canvas, mediaElement, player);

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

      this.appendMediaSources(sources);

      this.$container.append(this.$media);

      this.player = new MediaElementPlayer($("audio")[0], {
        poster: poster,
        defaultAudioWidth: "auto",
        features: [
          "playpause",
          "current",
          "progress",
          "volume",
          "sourcechooser",
        ],
        stretching: "responsive",
        defaultAudioHeight: "auto",
        hideVolumeOnTouchDevices: false,
        showPosterWhenPaused: true,
        showPosterWhenEnded: true,
        success: function (mediaElement: any, originalNode: any, player: any) {
          that._reportMediaErrors(mediaElement);
          that._showPosterWhilePlaying(mediaElement, player, posterImages);
          that._showCaptions(canvas, mediaElement, player);

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

  // Shows the image for audio while it plays (e.g. its accompanyingCanvas,
  // as in IIIF Cookbook recipe 0014), in place of the one shown before (e.g.
  // its placeholderCanvas, recipe 0013). mediaelement hides its poster on
  // play, as video takes its place.
  private _showPosterWhilePlaying(
    mediaElement: any,
    player: any,
    posterImages: PosterImages
  ): void {
    const image = posterImages.whilePlaying;
    const $poster = $(player.layers).find(".mejs__poster");
    ["play", "playing"].forEach((event) =>
      mediaElement.addEventListener(event, () => {
        if (!image) {
          return;
        }
        if (image.id !== player.options.poster) {
          player.setPoster(image.id);
          player.options.poster = image.id;
        }
        $poster.show();
      })
    );
  }

  // Tells the user when the media can't be played (e.g. its file is missing),
  // unless configured not to (hideMediaError).
  // The browser then also rejects requests to play it, which mediaelement
  // leaves unhandled, so they're caught here.
  private _reportMediaErrors(mediaElement: any): void {
    const play = mediaElement.play.bind(mediaElement);
    mediaElement.play = () =>
      Promise.resolve(play()).catch((err) => console.log("err", err));

    mediaElement.addEventListener("error", () => {
      if (!this.config.options.hideMediaError) {
        this.extensionHost.publish(IIIFEvents.SHOW_MESSAGE, [
          this.content.mediaUnavailable,
        ]);
      }
    });
  }

  // Shows the captions control among the player's controls (before the
  // fullscreen button) and the captions overlay over the media, following
  // playback. Called once the player is ready, from within its constructor,
  // so it's given the player rather than reading this.player.
  private _showCaptions(canvas: Canvas, mediaElement: any, player: any): void {
    const captions = new CanvasCaptions(
      this._captionLibrary,
      this.content,
      this.options.captionStyles
    );
    this._captions = captions;

    const $controls = $(player.controls);
    const $fullscreen = $controls.find(".mejs__fullscreen-button");
    if ($fullscreen.length) {
      captions.$control.insertBefore($fullscreen);
    } else {
      $controls.append(captions.$control);
    }
    $(player.container).append(captions.$overlay);

    const update = () =>
      captions.update({
        canvasId: canvas.id,
        time: mediaElement.currentTime || 0,
      });
    ["loadedmetadata", "timeupdate", "seeked"].forEach((event) =>
      mediaElement.addEventListener(event, update)
    );
    update();
    captions.load([canvas]);
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
  // Whether a rendering or body is audio or video (see mediaKind), with a
  // format to offer the player.
  isTypeMedia(element: Rendering | AnnotationBody) {
    return element.getFormat() !== null && mediaKind(element.__jsonld) !== null;
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
