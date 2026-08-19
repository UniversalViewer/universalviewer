import { getHls } from "../helpers/get-hls";

const $ = require("jquery");
import { MediaFormat } from "../media-formats/abstract-media-format";
import { MediaOptions } from "../types/media-options";
import { DashFormat } from "../media-formats/dash-format";
import { HlsFormat } from "../media-formats/hls-format";
import { MpegFormat } from "../media-formats/mpeg-format";
import { DefaultFormat } from "../media-formats/default-format";
import { MediaSource } from "../types/media-source";
import { AnnotationTime } from "../helpers/relative-time";
import { Logger } from "../helpers/logger";

export class MediaElement {
  type: string;
  format?: string;
  mediaSource: string;
  source: MediaSource;
  private element: HTMLMediaElement;
  instance: MediaFormat;
  mediaSyncMarginSecs: number;
  constructor(source: MediaSource, mediaOptions: MediaOptions = {}) {
    this.source = source;
    this.mediaSource = source.mediaSource;
    this.type = source.type.toString().toLowerCase();
    this.format = source.format ? source.format.toString() : undefined;
    this.mediaSyncMarginSecs = mediaOptions.mediaSyncMarginSecs || 1;

    switch (this.type) {
      case "video":
        this.element = document.createElement("video");
        break;

      case "sound":
      case "audio":
        this.element = document.createElement("audio");
        break;
      default:
        return;
    }

    if (this.isDash()) {
      this.instance = new DashFormat(this.mediaSource, mediaOptions);
    } else if (this.isHls()) {
      this.instance = new HlsFormat(this.mediaSource, mediaOptions);
    } else if (this.isMpeg()) {
      this.instance = new MpegFormat(this.mediaSource, mediaOptions);
    } else {
      this.instance = new DefaultFormat(this.mediaSource, mediaOptions);
    }
    this.element.classList.add("anno");
    if (!mediaOptions.probed) {
      this.element.crossOrigin = "anonymous";
    }
    this.element.preload = "metadata";
    this.instance.attachTo(this.element);
    this.element.currentTime = this.source.start;

    this.element.addEventListener("play", () => {
      setTimeout(() => {
        this.playWasRequested = false;
        this.pauseWasRequested = false;
      }, 0);
    });
    this.element.addEventListener("pause", () => {
      setTimeout(() => {
        this.playWasRequested = false;
        this.pauseWasRequested = false;
      }, 0);
    });

    this._pauseElement();
  }

  playWasRequested = false;
  _playElement() {
    this.playWasRequested = true;
    if (this.pauseWasRequested) {
      this.pauseWasRequested = false;
    }
    Logger.log(`HTMLElement.play() request - ${this.element.src}`);
    return this.element.play();
  }

  pauseWasRequested = false;
  _pauseElement() {
    this.pauseWasRequested = true;
    if (this.playWasRequested) {
      this.playWasRequested = false;
    }
    Logger.log(`HTMLElement.pause() request - ${this.element.src}`);
    try {
      this.element.pause();
    } catch (e) {
      // ignore error.
    }
  }

  syncClock(time: AnnotationTime) {
    // time here is always annotation time, but the resource could start later on.
    // const time = minusTime(annotationTime, this.source.start);

    if (time > this.element.duration) {
      Logger.error(
        `Clock synced out of bounds (max: ${this.element.duration}, got: ${time})`
      );
      return;
    }

    if (Math.abs(this.element.currentTime - time) > this.mediaSyncMarginSecs) {
      this.element.currentTime = time;
    }
  }

  getElementTime() {
    return this.element.currentTime;
  }

  getCanvasId() {
    return this.source.canvasId;
  }

  isWithinRange(time: number) {
    return this.source.start <= time && this.source.end >= time;
  }

  async load(withAudio = false): Promise<void> {
    if (withAudio) {
      this.element.load();
    }
    await new Promise<void>((resolve) => {
      this.element.addEventListener("loadedmetadata", () => {
        resolve();
      });
    });
  }

  setSize(top: number, left: number, width: number, height: number) {
    $(this.element).css({
      top: `${top}%`,
      left: `${left}%`,
      width: `${width}%`,
      height: `${height}%`,
    });
  }

  isDash() {
    return (
      this.format &&
      this.format.toString() === "application/dash+xml" &&
      typeof dashjs !== "undefined"
    );
  }

  isHls() {
    const Hls = getHls();
    return (
      this.format &&
      this.format.toString() === "application/vnd.apple.mpegurl" &&
      typeof Hls !== "undefined" &&
      Hls !== null &&
      Hls.isSupported()
    );
  }

  isMpeg(): boolean {
    if (!this.element.canPlayType) {
      return true;
    }
    return this.element.canPlayType("application/vnd.apple.mpegurl") !== "";
  }

  stop() {
    this._pauseElement();
    this.element.currentTime = this.source.start;
  }

  play(time?: AnnotationTime): Promise<void> {
    Logger.log(`MediaElement.play(${time}) - ${this.element.src}`);

    if (typeof time !== "undefined") {
      this.element.currentTime = time;
    }
    return this._playElement();
  }

  lastPause = 0;
  isPausing = false;

  pause() {
    Logger.log(`MediaElement.pause() request - ${this.element.src}`);
    const now = Date.now();
    if (this.lastPause + 1000 > now) {
      if (this.isPausing) {
        return;
      }
      this.isPausing = true;
      setTimeout(() => {
        this._pauseElement();
        this.isPausing = false;
        this.lastPause = Date.now();
      }, 500);
      return;
    }

    this.lastPause = Date.now();
    this._pauseElement();
  }

  addEventListener(name: string, callback: any) {
    this.element.addEventListener(name, () => {
      if (name === "play") {
        if (this.playWasRequested) {
          callback();
        }
        return;
      }
      if (name === "pause") {
        if (this.pauseWasRequested) {
          callback();
        }
        return;
      }

      callback();
    });
  }

  getRawElement() {
    return this.element;
  }

  isPaused() {
    return this.element.paused;
  }

  setVolume(volume: number) {
    this.element.volume = volume;
  }

  isBuffering() {
    return this.element.readyState < 3;
  }
}
