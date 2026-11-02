import { Bools, Dimensions } from "../../Utils";

const $ = require("jquery");
import { IIIFEvents } from "../../IIIFEvents";
import { MediaElementExtensionEvents } from "../../extensions/uv-mediaelement-extension/Events";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { IMediaElementExtension } from "../../extensions/uv-mediaelement-extension/IMediaElementExtension";
import { sanitize } from "../../../../Utils";
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
import {
  loadDash,
  loadHls,
  mediaSupport,
} from "../uv-shared-module/StreamingLibraries";
import {
  HlsErrorData,
  isBlockedByCors,
  MediaAttempt,
  mediaAttempts,
  MediaVia,
} from "../iiif-av-component-module/helpers/media-attempts";

type MediaSourceDescriptor = {
  label: string;
  type: string;
  src: string;
};

// The mediaelement renderer for each way of playing media: its HTML5
// renderer for the browser's own player, and its hls.js and dash.js ones.
const RENDERERS: { [via in MediaVia]: string } = {
  native: "html5",
  direct: "html5",
  "hls.js": "native_hls",
  dash: "native_dash",
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
  // Plays the version of the media the user chose (see _playInTurn).
  private _chooseVersion: ((src: string) => void) | null = null;
  // Stops it trying the versions in turn, when the player is let go of.
  private _stopPlayingInTurn: (() => void) | null = null;

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
    // Another canvas chosen while playing carries on playing, on that canvas
    // (as when choosing another track of an album).
    const wasPlaying =
      !!this.player && !!this.player.media && !this.player.media.paused;

    await this.extension.getExternalResources(resources);

    if (this._captions) {
      this._captions.destroy();
    }
    this._stopPlayer();
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

    // The versions to try, in turn, until one plays (see mediaAttempts).
    // mediaelement is given one at a time, so it plays them in this order,
    // rather than its renderers' own, and each the way it's meant to be
    // played; and so the browser doesn't load any it isn't meant to (it
    // would load every <source> it can play itself).
    const attempts = mediaAttempts(
      sources,
      (source) => source.type,
      mediaSupport()
    );
    await this._loadLibraryFor(attempts[0]);
    // HLS to be played with hls.js is given a format the browser's own HLS
    // player (e.g. Chrome's) doesn't know, but mediaelement's hls.js renderer
    // does, so the browser doesn't load the stream itself as well.
    const firstSources = !attempts.length
      ? sources
      : attempts[0].via === "hls.js"
      ? [
          {
            ...attempts[0].item,
            type: this.isVideo() ? "video/hls" : "audio/hls",
          },
        ]
      : [attempts[0].item];
    // Every version, for the user to choose from (see source-chooser-fixed.js),
    // in the order they're tried.
    const chooserOptions = {
      sourcechooserSources: attempts
        .map(({ item }) => item)
        .filter((item, i, items) => items.indexOf(item) === i)
        .map(({ src, label, type }) => ({ src, title: label, type })),
      sourcechooserChoose: (src: string) =>
        that._chooseVersion && that._chooseVersion(src),
    };

    if (this.isVideo()) {
      this.$media = $(
        '<video controls="controls" preload="metadata" style="width:100%;height:100%;" width="100%" height="100%"></video>'
      );

      this.appendMediaSources(firstSources);

      this.$container.append(this.$media);
      if (attempts.length) {
        this._letPlay(
          this.$media[0] as HTMLMediaElement,
          RENDERERS[attempts[0].via] === "html5"
        );
      }

      // This panel's own media element (not the page's first, which may be
      // another viewer's, or none, once this viewer's been replaced, when
      // mediaelement gives back a player it hasn't set up).
      this.player = new MediaElementPlayer(this.$media[0], {
        ...this._controlOptions(attempts[0]),
        ...chooserOptions,
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
          that._playInTurn(mediaElement, attempts);
          that._labelTimeline(canvas, mediaElement, player);
          that._labelVolume(mediaElement, player);
          that._showCaptions(canvas, mediaElement, player);
          if (wasPlaying) {
            mediaElement.play();
          }

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
        '<audio controls="controls" preload="metadata" style="width:100%;height:100%;" width="100%" height="100%"></audio>'
      );

      this.appendMediaSources(firstSources);

      this.$container.append(this.$media);
      if (attempts.length) {
        this._letPlay(
          this.$media[0] as HTMLMediaElement,
          RENDERERS[attempts[0].via] === "html5"
        );
      }

      // This panel's own media element (see the video player above).
      this.player = new MediaElementPlayer(this.$media[0], {
        ...this._controlOptions(attempts[0]),
        ...chooserOptions,
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
        showPosterWhenPaused: true,
        showPosterWhenEnded: true,
        success: function (mediaElement: any, originalNode: any, player: any) {
          that._playInTurn(mediaElement, attempts);
          that._labelTimeline(canvas, mediaElement, player);
          that._labelVolume(mediaElement, player);
          that._showPosterWhilePlaying(mediaElement, player, posterImages);
          that._showCaptions(canvas, mediaElement, player);
          if (wasPlaying) {
            mediaElement.play();
          }

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

  // The controls' options shared by the video and audio players, in place of
  // mediaelement's own:
  // - the buttons' names and tooltips in the user's language, from the
  //   panel's content, rather than in English;
  // - the volume slider always in the controls, as audio has it, rather than
  //   appearing only over the mute button;
  // - starting at full volume, rather than 80%;
  // - the volume controls shown on touch devices, unless configured not to
  //   be (hideVolumeOnTouchDevices);
  // - the arrow keys moving 5 seconds, as the AV component's do, rather than
  //   5% of the media;
  // - the renderer for how the first version is meant to be played before
  //   the others, so mediaelement doesn't start it another way (its html5
  //   renderer also claims HLS where the browser has its own HLS player);
  //   then the browser's own player before hls.js and dash.js (each version
  //   is then played the way mediaAttempts says: see _playInTurn);
  // - hls.js only fetching renditions the player is big enough to show.
  private _controlOptions(
    first?: MediaAttempt<MediaSourceDescriptor>
  ): object {
    const renderers = ["html5", "native_hls", "native_dash"];
    const firstRenderer = first ? RENDERERS[first.via] : "html5";
    return {
      renderers: [
        firstRenderer,
        ...renderers.filter((renderer) => renderer !== firstRenderer),
      ],
      hls: { capLevelToPlayerSize: true },
      playText: this.content.play,
      pauseText: this.content.pause,
      muteText: this.content.mute,
      unmuteText: this.content.unmute,
      fullscreenText: this.content.fullScreen,
      videoVolume: "horizontal",
      startVolume: 1,
      hideVolumeOnTouchDevices: Bools.getBool(
        this.config.options.hideVolumeOnTouchDevices,
        false
      ),
      defaultSeekForwardInterval: () => 5,
      defaultSeekBackwardInterval: () => 5,
    };
  }

  // Presents the timeline as a slider, named in the user's language, with its
  // value. mediaelement only gives it its role once it's focused or playing,
  // names it in English, and removes its name and value while it plays, so a
  // screen reader user reaching it then wouldn't know what it is or where
  // it's at. Its value is only written when it changes, which is once a
  // second while playing (it's in whole seconds), so it isn't announced more
  // often than that.
  private _labelTimeline(
    canvas: Canvas,
    mediaElement: any,
    player: any
  ): void {
    const timeline = player.controls.querySelector(".mejs__time-total");
    if (!timeline) {
      return;
    }

    timeline.setAttribute("role", "slider");
    timeline.tabIndex = 0;

    const timeCode = (seconds: number): string =>
      (window as any).mejs.Utils.secondsToTimeCode(
        seconds,
        player.options.alwaysShowHours,
        player.options.showTimecodeFrameCount,
        player.options.framesPerSecond,
        player.options.secondsDecimalLength,
        player.options.timeFormat
      );

    const label = () => {
      const duration = isFinite(mediaElement.duration)
        ? mediaElement.duration
        : canvas.getDuration() || 0;
      const valueText = this.content.positionOfDuration
        .replace("{0}", timeCode(mediaElement.currentTime || 0))
        .replace("{1}", timeCode(duration));

      // Each only when it differs, so the observer below isn't set off by
      // its own change.
      if (timeline.getAttribute("aria-label") !== this.content.playbackPosition) {
        timeline.setAttribute("aria-label", this.content.playbackPosition);
      }
      if (timeline.getAttribute("aria-valuetext") !== valueText) {
        timeline.setAttribute("aria-valuetext", valueText);
      }
    };

    label();
    ["loadedmetadata", "timeupdate", "seeked"].forEach((event) =>
      mediaElement.addEventListener(event, label)
    );
    // mediaelement rewrites (or removes) both as it plays and loads, so
    // they're put back whenever it changes them.
    new MutationObserver(label).observe(timeline, {
      attributes: true,
      attributeFilter: ["aria-label", "aria-valuetext"],
    });
  }

  // Presents the volume as a slider, named in the user's language, with its
  // value, that keyboard users can reach and change.
  private _labelVolume(mediaElement: any, player: any): void {
    const volume = player.controls.querySelector(
      ".mejs__horizontal-volume-slider"
    );
    if (!volume) {
      return;
    }

    // iOS and iPadOS don't let pages set the volume (only the device's
    // buttons can), so there the slider would do nothing: it's left out, and
    // the mute button kept. Since iPadOS 13, an iPad presents itself as a Mac,
    // so it's told apart by its touch screen.
    if (
      (window as any).mejs.Features.isiOS ||
      (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
    ) {
      volume.remove();
      return;
    }

    const valueText = (level: number): string => `${Math.round(level * 100)}%`;

    // mediaelement draws it as a link without an href, which keyboard users
    // can't reach.
    volume.tabIndex = 0;
    volume.setAttribute("aria-label", this.content.audioVolume);
    // mediaelement only writes it once the volume changes.
    volume.setAttribute("aria-valuetext", valueText(mediaElement.volume));

    // mediaelement gives the slider no keys of its own, so they're the AV
    // component's: up and down (or right and left) by 10%, home for silent
    // and end for full volume, rather than seeking the media.
    const steps: { [key: string]: (level: number) => number } = {
      ArrowUp: (level) => level + 0.1,
      ArrowRight: (level) => level + 0.1,
      ArrowDown: (level) => level - 0.1,
      ArrowLeft: (level) => level - 0.1,
      Home: () => 0,
      End: () => 1,
    };
    volume.addEventListener("keydown", (e: KeyboardEvent) => {
      const step = steps[e.key];
      if (!step) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      // Rounded to tenths, so ten steps down from full reach silent exactly.
      const level =
        Math.round(Math.min(1, Math.max(0, step(player.volume))) * 10) / 10;
      player.setVolume(level);
      player.setMuted(level === 0);
      // Straight away, rather than once the media's volumechange event comes,
      // so the new value is what's read out.
      volume.setAttribute("aria-valuetext", valueText(level));
    });
  }

  // Loads the library a version of the media is played with, if any:
  // mediaelement would otherwise fetch hls.js or dash.js from a CDN. Only
  // when it's needed, so a page whose HLS the browser plays itself doesn't
  // load hls.js at all.
  private async _loadLibraryFor(
    attempt: MediaAttempt<MediaSourceDescriptor> | undefined
  ): Promise<void> {
    if (attempt && attempt.via === "hls.js") {
      await loadHls();
    } else if (attempt && attempt.via === "dash") {
      await loadDash();
    }
  }

  // mediaelement plays with the browser's own player in the media element it
  // replaces, but keeps that element (hidden) when it plays with hls.js or
  // dash.js, and still sets its src, so the browser would load the media
  // there too. While it isn't the one playing, its src is kept where the
  // browser doesn't load from (mediaelement's hls.js still reads it).
  private _letPlay(node: HTMLMediaElement, plays: boolean): void {
    if (plays) {
      Reflect.deleteProperty(node, "src");
      return;
    }
    if (Object.getOwnPropertyDescriptor(node, "src")) {
      return;
    }
    let kept = node.getAttribute("src") || "";
    // Removing its src (without reloading, which would load its <source>s
    // instead) leaves it with the version it had, paused.
    if (node.hasAttribute("src")) {
      node.pause();
      node.removeAttribute("src");
    }
    Object.defineProperty(node, "src", {
      configurable: true,
      get: () => kept,
      set: (src: string) => {
        kept = src;
      },
    });
  }

  // Stops the media playing and loading, and lets go of its player and any
  // hls.js or dash.js it was playing with, when another canvas is opened.
  private _stopPlayer(): void {
    if (!this.player) {
      return;
    }
    const media = this.player.media;
    if (this._stopPlayingInTurn) {
      this._stopPlayingInTurn();
      this._stopPlayingInTurn = null;
    }
    try {
      // The browser's own player keeps loading, and telling the player being
      // let go of, until its media is emptied; and the media element
      // mediaelement puts back in the player's place would load it again.
      $(this.player.container)
        .find("audio, video")
        .each((_, element: HTMLMediaElement) => {
          element.pause();
          element.setAttribute("preload", "none");
          element.removeAttribute("src");
          element.load();
        });
      if (media && media.hlsPlayer) {
        media.hlsPlayer.destroy();
      }
      if (media && media.dashPlayer) {
        media.dashPlayer.reset();
      }
      this.player.remove();
    } catch (e) {
      // It's being let go of regardless.
    }
    this.player = null;
  }

  // Plays the versions of the media in turn (see mediaAttempts): mediaelement
  // is given the first, and when it can't be played, the next, each with the
  // renderer for how it's meant to be played, carrying on playing if the user
  // had pressed play. Only when none can be played is the user told, unless
  // configured not to (hideMediaError); and where hls.js couldn't load the
  // last because its server sends no CORS headers, in a browser without its
  // own HLS player to play it without them, the message says so.
  // The browser also rejects requests to play media that can't be played,
  // which mediaelement leaves unhandled, so they're caught here.
  private _playInTurn(
    mediaElement: any,
    attempts: MediaAttempt<MediaSourceDescriptor>[]
  ): void {
    const play = mediaElement.play.bind(mediaElement);
    mediaElement.play = () =>
      Promise.resolve(play()).catch((err) => console.log("err", err));

    let index = 0;
    let reported = false;
    let switching = false;
    // Whether the version being played has failed: the browser pauses it
    // then, which isn't the user stopping it.
    let failed = false;
    let playRequested = false;
    // From hls.js's own errors, which mediaelement doesn't pass on.
    let blockedByCors = false;
    let watchedHls: any = null;
    let cappedDash: any = null;

    // When the player is let go of: emptying its media makes it report an
    // error, which isn't a version failing.
    this._stopPlayingInTurn = () => {
      reported = true;
    };

    // Plays a version with the renderer for how it's meant to be played. The
    // first is already loading, so it only changes renderer if mediaelement
    // chose another.
    const use = (
      attempt: MediaAttempt<MediaSourceDescriptor>,
      first = false
    ) => {
      failed = false;
      this._letPlay(
        mediaElement.originalNode,
        RENDERERS[attempt.via] === "html5"
      );
      if (!first || mediaElement.rendererName !== RENDERERS[attempt.via]) {
        mediaElement.changeRenderer(RENDERERS[attempt.via], [
          { src: attempt.item.src, type: attempt.item.type },
        ]);
      }
    };

    // The version the user chose, from the source chooser: the first way
    // it's tried, then on as usual if it can't be played.
    this._chooseVersion = async (src: string) => {
      const chosen = attempts.findIndex(({ item }) => item.src === src);
      if (chosen < 0) {
        return;
      }
      switching = true;
      index = chosen;
      blockedByCors = false;
      await this._loadLibraryFor(attempts[index]);
      use(attempts[index]);
      setTimeout(watchStreams, 0);
      switching = false;
    };

    // Listens to the hls.js mediaelement plays with, once it has made one,
    // and has dash.js only fetch renditions the player is big enough to show.
    const watchStreams = () => {
      const hls = mediaElement.hlsPlayer;
      const Hls = (window as any).Hls;
      if (hls && Hls && hls !== watchedHls) {
        watchedHls = hls;
        hls.on(Hls.Events.ERROR, (_event: string, data: HlsErrorData) => {
          const attempt = attempts[index];
          if (data.fatal && attempt) {
            blockedByCors = isBlockedByCors(
              data,
              attempt.item.src,
              window.location.href
            );
          }
        });
      }
      const dash = mediaElement.dashPlayer;
      if (dash && dash !== cappedDash) {
        cappedDash = dash;
        dash.setLimitBitrateByPortal(true);
        dash.setUsePixelRatioInLimitBitrateByPortal(true);
      }
    };

    if (attempts.length) {
      use(attempts[0], true);
    }
    setTimeout(watchStreams, 0);
    mediaElement.addEventListener("loadstart", watchStreams);
    mediaElement.addEventListener("play", () => (playRequested = true));
    mediaElement.addEventListener("pause", () => {
      if (!switching && !failed) {
        playRequested = false;
      }
    });

    mediaElement.addEventListener("error", () => {
      if (reported || switching) {
        return;
      }
      failed = true;
      // Once hls.js's own error listeners (mediaelement's first, which
      // reports this error) have run.
      setTimeout(async () => {
        if (reported || switching) {
          return;
        }
        if (index + 1 < attempts.length) {
          switching = true;
          index++;
          blockedByCors = false;
          await this._loadLibraryFor(attempts[index]);
          use(attempts[index]);
          setTimeout(watchStreams, 0);
          switching = false;
          if (playRequested) {
            mediaElement.play();
          }
          return;
        }
        reported = true;
        if (!this.config.options.hideMediaError) {
          const attempt = attempts[index];
          const message =
            attempt &&
            attempt.via === "hls.js" &&
            blockedByCors &&
            !mediaSupport().nativeHls
              ? `${this.content.mediaUnavailable} ${this.content.mediaBlockedByCors}`
              : this.content.mediaUnavailable;
          this.extensionHost.publish(IIIFEvents.SHOW_MESSAGE, [message]);
        }
      }, 0);
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
