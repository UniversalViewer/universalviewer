import { MediaElement } from "./media-element";
import { AnnotationTime, minusTime } from "../helpers/relative-time";
import { Logger } from "../helpers/logger";
// @ts-ignore
import { JQueryStatic } from "jquery";

export class CompositeMediaElement {
  elements: MediaElement[] = [];

  activeElement?: MediaElement;
  playing = false;
  canvasMap: {
    [id: string]: MediaElement[];
  } = {};

  private _onPlay: ((
    canvasId: string,
    time: number,
    el: MediaElement
  ) => void)[] = [];
  private _onPause: ((
    canvasId: string,
    time: number,
    el: MediaElement
  ) => void)[] = [];
  private _onBuffering: ((
    canvasId: string,
    time: number,
    el: MediaElement
  ) => void)[] = [];

  constructor(mediaElements: MediaElement[]) {
    Logger.log("Composite media element", mediaElements);
    // Add all elements.
    this.elements = mediaElements;
    for (const el of mediaElements) {
      const canvasId = el.getCanvasId();
      this.canvasMap[canvasId] = this.canvasMap[canvasId]
        ? this.canvasMap[canvasId]
        : [];
      this.canvasMap[canvasId].push(el);
      // Attach events.
      el.addEventListener("play", () => {
        if (el === this.activeElement) {
          Logger.log("HTMLElement.play() response", {
            paused: el.getRawElement().paused,
            readState: el.getRawElement().readyState,
          });
          this._onPlay.forEach((fn) => fn(canvasId, el.getElementTime(), el));
        }
      });
      el.addEventListener("pause", () => {
        if (el === this.activeElement) {
          Logger.log("HTMLElement.pause() response");
          this._onPause.forEach((fn) => fn(canvasId, el.getElementTime(), el));
        }
      });
      el.addEventListener("waiting", () => {
        if (el === this.activeElement) {
          this._onBuffering.forEach((fn) =>
            fn(canvasId, el.getElementTime(), el)
          );
        }
      });
    }
    this.activeElement = mediaElements[0];
  }

  syncClock(time: AnnotationTime, _toCanvas?: string) {
    Logger.group("CompositeMediaElement.syncClock");
    Logger.log(`syncClock: ${time}`);
    Logger.log({
      fromTime: time,
      toTime: time,
      instance: this,
    });

    if (this.activeElement) {
      const toCanvas = _toCanvas || this.activeElement.getCanvasId();
      this.updateActiveElement(toCanvas, time, this.playing);
      const realTime = minusTime(time, this.activeElement.source.start);
      this.activeElement.syncClock(realTime);
    }
    Logger.groupEnd();
  }

  updateActiveElement(canvasId: string, time: AnnotationTime, play?: boolean) {
    const newElement = this.findElementInRange(canvasId, time);

    if (this.activeElement && newElement && newElement !== this.activeElement) {
      Logger.log(
        `CompositeMediaElement.updateActiveElement(canvasId: ${canvasId}, time: ${time})`,
        {
          canvasId: newElement ? newElement.source.canvasId : null,
          newElement,
        }
      );

      // Moving track.
      // Stop the current track.
      this.activeElement.stop();

      // Set new current track.
      this.activeElement = newElement;

      if (play) {
        Logger.log("CompositeMediaElement play=true");
        newElement.play(time);
      } else {
        Logger.log("CompositeMediaElement play=false");
        // newElement.pause();
      }

      return newElement;
    }
    return null;
  }

  onPlay(func: (canvasId: string, time: number, el: MediaElement) => void) {
    this._onPlay.push(func);
  }

  onPause(func: (canvasId: string, time: number, el: MediaElement) => void) {
    this._onPause.push(func);
  }

  onBuffering(
    func: (canvasId: string, time: number, el: MediaElement) => void
  ) {
    this._onBuffering.push(func);
  }

  findElementInRange(canvasId: string, time: number) {
    if (!this.canvasMap[canvasId]) {
      return undefined;
    }
    for (const el of this.canvasMap[canvasId].reverse()) {
      if (el.isWithinRange(time)) {
        return el;
      }
    }
    return undefined;
  }

  appendTo($element: JQueryStatic) {
    $element.append(this.elements.map((media) => media.getRawElement()));
  }

  async load(): Promise<void> {
    await Promise.all(this.elements.map((element) => element.load()));
  }

  async seekToMediaTime(
    annotationTime: AnnotationTime,
    _toCanvas?: string,
    paused?: boolean
  ) {
    if (paused) {
      this.pause();
    }
    const prevActiveElement = this.activeElement;
    Logger.groupCollapsed("CompositeMediaElement.seekToMediaTime Buffering", {
      playing: this.playing,
    });

    if (this.activeElement) {
      const toCanvas = _toCanvas || this.activeElement.getCanvasId();
      const newElement = this.updateActiveElement(
        toCanvas,
        annotationTime,
        false
      );

      const realTime = minusTime(
        annotationTime,
        this.activeElement.source.start
      );

      let defer;
      const promise = new Promise((resolve) => (defer = resolve));

      if (this.playing) {
        Logger.log(`CompositeMediaElement.seekToMediaItem(${annotationTime})`);

        await this.activeElement.play(realTime).catch((e) => {
          console.log("ERROR", e);
          this.playing = false;
        });

        if (prevActiveElement !== this.activeElement && newElement) {
          Logger.log(`Active element changed...`);
          if (newElement.isBuffering() || newElement.isPaused()) {
            const cb = () => {
              if (!this.isBuffering()) {
                defer();
              }
            };
            const interval = setInterval(cb, 200);
            await promise;
            clearInterval(interval);
            Logger.log("ActiveElement nudge (play)");
            await newElement.play();
          }
        }
      } else {
        this.activeElement.syncClock(realTime);
      }
    }

    Logger.groupEnd();
  }

  async seekTo(canvasId: string, time: AnnotationTime) {
    this.updateActiveElement(canvasId, time);

    return this.seekToMediaTime(time);
  }

  async play(canvasId?: string, time?: AnnotationTime) {
    Logger.log(`CompositeMediaElement.play(${canvasId}, ${time})`, {
      hasActive: !!this.activeElement,
    });
    this.playing = true;
    if (canvasId && typeof time !== "undefined") {
      await this.seekTo(canvasId, time);
    }
    if (this.activeElement) {
      return this.activeElement.play(time).catch((err) => {
        console.log("err", err);
        this.playing = false;
      });
    }
  }

  pause() {
    Logger.log("Composite.pause()");
    this.playing = false;
    if (this.activeElement && !this.activeElement.isPaused()) {
      this.activeElement.pause();
    }
  }

  setVolume(volume: number) {
    for (const el of this.elements) {
      el.setVolume(volume);
    }
  }

  isBuffering() {
    return this.activeElement ? this.activeElement.isBuffering() : false;
  }
}
