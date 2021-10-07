import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { Events } from "../../extensions/uv-mediaelement-extension/Events";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { IMediaElementExtension } from "../../extensions/uv-mediaelement-extension/IMediaElementExtension";
import { sanitize } from "../../Utils";
import { Dimensions, Size } from "@edsilv/utils";
import { MediaType } from "@iiif/vocabulary/dist-commonjs/";
import {
  AnnotationBody,
  Canvas,
  IExternalResource,
  Rendering
} from "manifesto.js";
import "mediaelement/build/mediaelement-and-player";
import "mediaelement-plugins/dist/source-chooser/source-chooser";
import "mediaelement-plugins/dist/source-chooser/source-chooser.css";
import { TFragment } from "../../extensions/uv-openseadragon-extension/TFragment";

export class MediaElementCenterPanel extends CenterPanel {
  _$mejsContainer: JQuery;
  _$mejsLayers: JQuery;
  $container: JQuery;
  $media: JQuery;
  mediaHeight: number;
  mediaWidth: number;
  player: any;
  title: string | null;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("mediaelementCenterPanel");

    super.create();

    const that = this;

    // events.

    this.component.subscribe(BaseEvents.SET_TARGET, (target: TFragment) => {
      that.player.setCurrentTime(target.t);
      that.player.play();
    });

    // only full screen video
    if (this.isVideo()) {
      this.component.subscribe(BaseEvents.TOGGLE_FULLSCREEN, () => {
        if (that.component.isFullScreen) {
          that.player.enterFullScreen(false);
        } else {
          that.player.exitFullScreen(false);
        }
      });
    }

    this.component.subscribe(
      BaseEvents.OPEN_EXTERNAL_RESOURCE,
      (resources: IExternalResource[]) => {
        that.openMedia(resources);
      }
    );

    this.$container = $('<div class="container"></div>');
    this.$content.append(this.$container);

    this.title = this.extension.helper.getLabel();
  }

  async openMedia(resources: IExternalResource[]) {
    const that = this;

    await this.extension.getExternalResources(resources);

    this.$container.empty();

    const canvas: Canvas = this.extension.helper.getCurrentCanvas();

    this.mediaHeight = this.config.defaultHeight;
    this.mediaWidth = this.config.defaultWidth;

    console.log("mediaHeight", this.mediaHeight);
    console.log("mediaWidth", this.mediaWidth);

    this.$container.height(this.mediaHeight);
    this.$container.width(this.mediaWidth);

    const poster: string = (<IMediaElementExtension>(
      this.extension
    )).getPosterImageUri();
    const sources: any[] = [];
    const subtitles: Array<{
      language?: string;
      label?: string;
      id: string;
    }> = [];

    const renderings: Rendering[] = canvas.getRenderings();

    if (renderings && renderings.length) {
      canvas.getRenderings().forEach((rendering: Rendering) => {
        sources.push({
          type: rendering.getFormat().toString(),
          src: rendering.id
        });
      });
    } else {
      const formats: AnnotationBody[] | null = this.extension.getMediaFormats(
        this.extension.helper.getCurrentCanvas()
      );

      if (formats && formats.length) {
        formats.forEach((format: AnnotationBody) => {
          const type: MediaType | null = format.getFormat();

          // Add any additional subtitle types if required.
          if (type && type.toString() === "text/vtt") {
            subtitles.push(format.__jsonld);
          } else if (type) {
            sources.push({
              label: format.__jsonld.label ? format.__jsonld.label : "",
              type: type.toString(),
              src: format.id
            });
          }
        });
      }
    }

    if (this.isVideo()) {
      this.$media = $(
        '<video controls="controls" preload="none" crossorigin=""></video>'
      );

      // Add VTT subtitles/captions.
      for (const subtitle of subtitles) {
        this.$media.append(
          $(`<track label="${subtitle.label}" kind="subtitles" srclang="${
            subtitle.language
          }" crossorigin="" src="${subtitle.id}" ${
            subtitles.indexOf(subtitle) === 0 ? "default" : ""
          }>
`)
        );
      }

      for (const source of sources) {
        this.$media.append(
          $(
            `<source src="${source.src}" type="${source.type}" title="${source.label}">`
          )
        );
      }

      this.$container.append(this.$media);

      this.player = new MediaElementPlayer($("video")[0], {
        poster: poster,
        toggleCaptionsButtonWhenOnlyOne: true,
        features: [
          "playpause",
          "current",
          "progress",
          "tracks",
          "volume",
          "sourcechooser"
        ],
        success: function(mediaElement: any, originalNode: any) {
          console.log("success");
          mediaElement.addEventListener("loadstart", () => {
            console.log("loadstart");
            that.resize();
          });

          mediaElement.addEventListener("play", () => {
            that.component.publish(
              Events.MEDIA_PLAYED,
              Math.floor(mediaElement.currentTime)
            );
          });

          mediaElement.addEventListener("pause", () => {
            // mediaelement creates a pause event before the ended event. ignore this.
            if (
              Math.floor(mediaElement.currentTime) !=
              Math.floor(mediaElement.duration)
            ) {
              that.component.publish(
                Events.MEDIA_PAUSED,
                Math.floor(mediaElement.currentTime)
              );
            }
          });

          mediaElement.addEventListener("ended", () => {
            that.component.publish(
              Events.MEDIA_ENDED,
              Math.floor(mediaElement.duration)
            );
          });

          mediaElement.addEventListener("timeupdate", () => {
            that.component.publish(
              Events.MEDIA_TIME_UPDATE,
              Math.floor(mediaElement.currentTime)
            );
          });
        }
      });
    } else {
      // audio

      this.$media = $('<audio controls="controls" preload="none"></audio>');
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
          "sourcechooser"
        ],
        defaultAudioHeight: "auto",
        showPosterWhenPaused: true,
        showPosterWhenEnded: true,
        success: function(mediaElement: any, originalNode: any) {
          mediaElement.addEventListener("loadedmetadata", () => {
            that.resize();
          });

          mediaElement.addEventListener("play", () => {
            that.component.publish(
              Events.MEDIA_PLAYED,
              Math.floor(mediaElement.currentTime)
            );
          });

          mediaElement.addEventListener("pause", () => {
            // mediaelement creates a pause event before the ended event. ignore this.
            if (
              Math.floor(mediaElement.currentTime) !=
              Math.floor(mediaElement.duration)
            ) {
              that.component.publish(
                Events.MEDIA_PAUSED,
                Math.floor(mediaElement.currentTime)
              );
            }
          });

          mediaElement.addEventListener("ended", () => {
            that.component.publish(
              Events.MEDIA_ENDED,
              Math.floor(mediaElement.duration)
            );
          });

          for (const source of sources) {
            mediaElement.append(
              $(
                `<source src="${source.src}" type="${source.type}" title="${source.label}">`
              )
            );
          }
        }
      });
    }

    this._$mejsContainer = this.$container.find(".mejs__container");
    this._$mejsLayers = this.$container.find(".mejs__layer");

    this.component.publish(BaseEvents.EXTERNAL_RESOURCE_OPENED);
    this.component.publish(BaseEvents.LOAD);
  }

  isVideo(): boolean {
    return (<IMediaElementExtension>this.extension).isVideo();
  }

  resize() {
    console.log("resize");
    super.resize();

    const that = this;

    if (!this.mediaWidth || !this.mediaHeight) {
      return;
    }

    // fit media to available space.
    const size: Size = Dimensions.fitRect(
      this.mediaWidth,
      this.mediaHeight,
      this.$content.width(),
      this.$content.height()
    );

    console.log(
      size,
      this.mediaWidth,
      this.mediaHeight,
      this.$content.width(),
      this.$content.height()
    );

    this.$container.height(size.height);
    this.$container.width(size.width);

    if (this.player && !this.extension.isFullScreen()) {
      this.$media.width(size.width);
      this.$media.height(size.height);
    }

    const left: number = Math.floor(
      (this.$content.width() - this.$container.width()) / 2
    );
    const top: number = Math.floor(
      (this.$content.height() - this.$container.height()) / 2
    );

    this.$container.css({
      left: left,
      top: top
    });

    if (this.title) {
      this.$title.text(sanitize(this.title));
    }

    if (this.player) {
      if (!this.isVideo() || (this.isVideo() && !this.component.isFullScreen)) {
        this.player.setPlayerSize();
        this.player.setControlsSize();

        this._$mejsContainer.height(this.$container.height());
        this._$mejsContainer.width(this.$container.width());

        this._$mejsLayers.each(function() {
          $(this).height(that.$container.height());
          $(this).width(that.$container.width());
        });
      }
    }
  }
}
