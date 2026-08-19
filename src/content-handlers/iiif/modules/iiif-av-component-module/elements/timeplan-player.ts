import { TimePlan } from "../types/time-plan";
import { CompositeMediaElement } from "./composite-media-element";
import { TimeStop } from "../types/time-stop";
import {
  addTime,
  annotationTime,
  AnnotationTime,
  minusTime,
  timelineTime,
  TimelineTime,
} from "../helpers/relative-time";
import { Logger } from "../helpers/logger";

export class TimePlanPlayer {
  plan: TimePlan;
  fullPlan: TimePlan;
  media: CompositeMediaElement;
  currentStop: TimeStop;
  currentRange: string;
  continuous = true;
  playing = false;
  _time: TimelineTime = timelineTime(0);
  notifyRangeChange: (
    rangeId: string,
    stops: { from: TimeStop; to: TimeStop }
  ) => void;
  notifyTimeChange: (time: TimelineTime) => void;
  notifyPlaying: (playing: boolean) => void;
  notifyBuffering: () => void;
  logging: boolean;

  constructor(
    media: CompositeMediaElement,
    plan: TimePlan,
    notifyRangeChange?: (
      rangeId: string,
      stops: { from: TimeStop; to: TimeStop }
    ) => void,
    notifyTimeChange?: (time: TimelineTime) => void,
    notifyPlaying?: (playing: boolean) => void,
    notifyBuffering?: () => void
  ) {
    Logger.log("TimePlanPlayer", { media, plan });
    this.media = media;
    this.plan = plan;
    this.fullPlan = plan;
    this.currentStop = plan.stops[0];
    const noop = () => {
      // no-op.
    };
    this.notifyRangeChange = notifyRangeChange || noop;
    this.notifyTimeChange = notifyTimeChange || noop;
    this.notifyPlaying = notifyPlaying || noop;
    this.notifyBuffering = notifyBuffering || noop;
    this.logging = true;
    this.currentRange = this.currentStop.rangeStack[0];

    this.setTime(this.currentStop.start);

    media.onPlay((canvasId, time, el) => {
      // Playing the right thing...
      if (canvasId === this.currentStop.canvasId) {
        if (!this.playing) {
          this.notifyPlaying(true);
        }
      } else {
        // el.pause();
      }
    });

    media.onBuffering(() => {
      this.notifyBuffering();
    });

    media.onPause((canvasId, time, el) => {
      if (el.isBuffering()) {
        return;
      }

      if (canvasId === this.currentStop.canvasId) {
        if (this.playing) {
          this.notifyPlaying(false);
        }
      }
    });
  }

  selectPlan({ reset, rangeId }: { reset?: boolean; rangeId?: string } = {}) {
    if (reset) {
      return this.initialisePlan(this.fullPlan);
    }
    if (rangeId) {
      let foundStack: string[] = [];
      for (const plan of this.fullPlan.stops) {
        const idx = plan.rangeStack.indexOf(rangeId);
        if (plan.rangeStack.indexOf(rangeId) !== -1) {
          foundStack = plan.rangeStack.slice(1, idx + 1);
        }
      }

      let plan = this.fullPlan;
      for (const id of foundStack) {
        for (const item of plan.items) {
          if (item.type === "time-plan" && item.rangeId === id) {
            plan = item;
            break;
          }
        }
      }
      if (plan) {
        return this.initialisePlan(plan);
      }
    }
  }

  initialisePlan(plan: TimePlan) {
    this.plan = plan;
  }

  getCurrentRange() {
    const rangeId = this.currentRange;
    const isRangeWithStop = this.currentRange === this.currentStop.rangeId;
    const stopsToCheck = isRangeWithStop
      ? this.plan.stops
      : this.fullPlan.stops;
    const starting: number[] = [];
    const ending: number[] = [];
    for (const stop of stopsToCheck) {
      if (stop.rangeStack.indexOf(rangeId) !== -1) {
        starting.push(stop.start);
        ending.push(stop.end);
      }
      if (isRangeWithStop) {
        if (stop.rangeId === rangeId) {
          starting.push(stop.start);
          ending.push(stop.end);
        }
      }
    }
    const start = Math.min(...starting);
    const end = Math.max(...ending);

    Logger.log("Range duration", {
      starting,
      ending,
      rangeId,
      isRangeWithStop,
      stopsToCheck,
      start: start - this.plan.start,
      end: end - this.plan.start,
      planStart: this.plan.start,
      duration: end - start,
      currentStop: this.currentStop,
    });

    return {
      start: start - this.plan.start,
      end: end - this.plan.start,
      duration: end - start,
    };
  }

  getTime(): TimelineTime {
    return this._time;
  }

  setInternalTime(time: TimelineTime): TimelineTime {
    this._time = time;
    this.notifyTimeChange(time);
    return this._time;
  }

  log(...content: any[]) {
    if (this.logging) {
      Logger.log("TimePlanPlayer", ...content);
    }
  }

  setContinuousPlayback(continuous: boolean) {
    this.continuous = continuous;
  }

  setIsPlaying(playing: boolean) {
    this.playing = playing;
  }

  play(): TimelineTime {
    this.log("Play", this.getTime());
    if (!this.playing) {
      this.setIsPlaying(true);
      this.media.play(this.currentStop.canvasId).catch((err) => {
        console.log("Err", err);
        this.setIsPlaying(false);
        this.notifyPlaying(false);
      });
    }

    return this.getTime();
  }

  currentTimelineTime(): TimelineTime {
    return this.getTime();
  }

  currentMediaTime(): AnnotationTime {
    Logger.log(
      `Current media time:
  - Current start: ${this.currentStop.start}
  - Current canvas: ${this.currentStop.canvasTime.start}
  - Current time: ${this.getTime()}
    `,
      this
    );

    const time = minusTime(this.getTime(), this.currentStop.start);
    return annotationTime(
      addTime(time, timelineTime(this.currentStop.canvasTime.start))
    );
  }

  validateExternalTime(time: TimelineTime): TimelineTime {
    // The time externally may be rounded.
    // For example, a track with a duration of 1200.51 seconds may be rounded to 1200
    // This means that the time may be slightly off the intention is to skip forward to the next stop.
    // We need to check if the time is within 1 second of the next stop.
    // If it is, we should skip to the next stop.
    const currentStop = this.findStop(time);
    const nextStop = this.findStop(time + 1);
    if (nextStop && currentStop !== nextStop) {
      Logger.log("Skipping to next stop", { nextStop, currentStop });
      return nextStop?.start;
    }
    return time;
  }

  pause(): TimelineTime {
    this.log("Pause", this.getTime());
    this.setIsPlaying(false);
    this.media.pause();

    return this.getTime();
  }

  setVolume(volume: number) {
    this.media.setVolume(volume);
  }

  findStop(time: number) {
    // // First check current stop.
    // if ((this.currentStop.start - 0.0001) <= time && (this.currentStop.end + 0.0001) > time) {
    //     return this.currentStop;
    // }
    //
    // // Then check next stop.
    // const idx = this.plan.stops.indexOf(this.currentStop);
    // const nextStop = idx !== -1 ? this.plan.stops[idx + 1] : undefined ;
    // if (nextStop && nextStop.start <= time && nextStop.end > time) {
    //     return nextStop;
    // }

    // Fallback to checking all stops.
    for (const stop of this.plan.stops) {
      if (stop.start - 0.001 <= time && stop.end - 0.001 > time) {
        return stop;
      }
    }

    if (this.plan.stops[this.plan.stops.length - 1].end === time) {
      return this.plan.stops[this.plan.stops.length - 1];
    }

    return;
  }

  // Time that is set by the user.
  async setTime(time: TimelineTime, setRange = true) {
    Logger.groupCollapsed(
      `TimeplanPlayer.setTime(${time}, ${setRange ? "true" : "false"})`
    );

    // Early exit?
    const start = this.getTime();
    if (start !== time) {
      this.log("set time", { from: this.getTime(), to: time });
      this.setInternalTime(time);

      const stop = this.findStop(time);
      if (stop && stop !== this.currentStop) {
        if (setRange) {
          this.currentRange = stop.rangeId;
        }
        await this.advanceToStop(
          this.currentStop,
          stop,
          undefined,
          time,
          !this.playing
        );
      }
    }
    Logger.groupEnd();
  }

  async next(): Promise<TimelineTime> {
    const currentRangeIndex = this.plan.rangeOrder.indexOf(this.currentRange);
    const isLast =
      currentRangeIndex >= 0 &&
      currentRangeIndex === this.plan.rangeOrder.length - 1;
    const nextRangeIdx = !isLast
      ? this.plan.rangeOrder.indexOf(this.currentRange) + 1
      : undefined;
    let nextRange =
      typeof nextRangeIdx !== "undefined"
        ? this.plan.rangeOrder[nextRangeIdx]
        : undefined;

    const idx = this.plan.stops.indexOf(this.currentStop);
    let offset = 0;
    let nextStop: undefined | TimeStop = undefined;
    let running = true;
    while (running) {
      offset++;
      nextStop = this.plan.stops[idx + offset];
      if (!nextStop) {
        running = false;
        break;
      }
      if (!nextStop.noNav && nextStop.rangeId !== this.currentStop.rangeId) {
        running = false;
        break;
      }
    }

    if (this.playing && nextStop) {
      nextRange = nextStop.rangeId;
    }

    if (nextRange && nextStop && nextStop.rangeId !== nextRange) {
      if (
        this.playing ||
        (this.currentStop.rangeStack.indexOf(nextRange) === -1 &&
          nextStop.rangeStack.indexOf(nextRange) !== -1)
      ) {
        this.currentRange = this.playing ? nextStop.rangeId : nextRange;
        this.setInternalTime(nextStop.start);
        await this.advanceToStop(
          this.currentStop,
          nextStop,
          this.playing ? nextStop.rangeId : nextRange
        );
      } else {
        this.currentRange = nextRange;
        this.setInternalTime(this.currentStop.start);
        await this.advanceToStop(this.currentStop, this.currentStop, nextRange);
      }
      return this.getTime();
    }

    if (nextStop) {
      this.setInternalTime(nextStop.start);
      this.currentRange = nextStop.rangeId;
      await this.advanceToStop(this.currentStop, nextStop, nextStop.rangeId);
    } else {
      await this.goToEndOfRange(this.currentStop.rangeId);
    }

    setTimeout(() => {
      if (this.playing) {
        this.play();
      }
    }, 100);

    return this.getTime();
  }

  async goToEndOfRange(rangeId: string) {
    let state: TimeStop | undefined = undefined;

    for (let i = 0; i < this.plan.stops.length; i++) {
      const stop = this.plan.stops[i];
      if (
        stop.rangeId === rangeId &&
        (!state ||
          (stop.canvasIndex >= state.canvasIndex && stop.end > state.end))
      ) {
        state = stop;
      }
    }

    if (state) {
      await this.advanceToStop(this.currentStop, state, rangeId);
      this.setInternalTime(state.end);
    }
  }
  goToStartOfRange(rangeId: string) {
    let state: TimeStop | undefined = undefined;
    const length = this.plan.stops.length;
    for (let i = length - 1; i >= 0; i--) {
      const stop = this.plan.stops[i];
      if (
        stop.rangeId === rangeId &&
        (!state ||
          (stop.canvasIndex <= state.canvasIndex && stop.start < state.start))
      ) {
        state = stop;
      }
    }

    if (state) {
      if (state !== this.currentStop) {
        this.advanceToStop(this.currentStop, state, rangeId);
      }
      this.setInternalTime(state.start);
    }
  }

  /**
   * This is a contextual helper. It's intended to change the time of the current range, at each
   * level of the range stack. It will never switch ranges.
   */
  async setRangeTime(rangeId: string, time: number, external = false) {
    let plan;
    if (this.plan.rangeId === rangeId) {
      plan = this.plan;
    } else if (this.fullPlan.rangeId === rangeId) {
      plan = this.fullPlan;
    } else if (this.currentStop.rangeId === rangeId) {
      plan = this.currentStop;
    }
    if (plan) {
      // Only handle current range changes for now.
      let newTime = timelineTime(plan.start + time);
      if (external) {
        newTime = this.validateExternalTime(newTime);
      }
      await this.setTime(newTime, false);
    }
  }

  previous(): TimelineTime {
    const currentRangeIndex = this.plan.rangeOrder.indexOf(this.currentRange);
    const isFirst = currentRangeIndex === 0;
    const prevRangeIdx = !isFirst
      ? this.plan.rangeOrder.indexOf(this.currentRange) - 1
      : undefined;
    let prevRange =
      typeof prevRangeIdx !== "undefined"
        ? this.plan.rangeOrder[prevRangeIdx]
        : undefined;
    let currentStopHead = this.currentStop;
    const idx = this.plan.stops.indexOf(this.currentStop);
    let newIdx = idx;
    let prevStop = this.plan.stops[idx - 1];
    const firstStop = this.plan.stops[0];
    let running = true;
    const isValidNav = (plan: TimeStop) => {
      return !plan.noNav || plan === firstStop;
    };
    while (running) {
      const nextPrevStop = this.plan.stops[newIdx - 1];
      if (!nextPrevStop) {
        running = false;
        break;
      }
      if (isValidNav(nextPrevStop) && isValidNav(prevStop)) {
        if (nextPrevStop.rangeId === this.currentRange) {
          currentStopHead = nextPrevStop;
        }
        if (prevStop.rangeId !== nextPrevStop.rangeId) {
          running = false;
          break;
        }
      }

      if (nextPrevStop) {
        if (isValidNav(nextPrevStop)) {
          prevStop = nextPrevStop;
        }
        newIdx = newIdx - 1;
      }
    }

    const goBackToStartOfRange = this._time - (currentStopHead.start + 2) > 0;
    const isPreviousRangeDifferent =
      this.playing && prevStop && prevStop.rangeId !== this.currentStop.rangeId;
    const isDefinitelyFirstRange = idx === 0 || (!prevRange && newIdx === 0);
    const isPreviousRangeNotAParent =
      prevRange &&
      this.currentStop.rangeStack.indexOf(prevRange) === -1 &&
      // But it is in the previous.
      (prevStop.rangeStack.indexOf(prevRange) !== -1 ||
        prevStop.rangeId === prevRange);
    const isPreviousRangeInStack =
      prevRange && this.currentStop.rangeStack.indexOf(prevRange) !== -1;

    Logger.log("TimePlanPlayer.previous() => variables", {
      goBackToStartOfRange,
      isPreviousRangeDifferent,
      isDefinitelyFirstRange,
      isPreviousRangeNotAParent,
      isPreviousRangeInStack,
      prevStop,
    });

    if (goBackToStartOfRange) {
      Logger.log("TimePlanPlayer.previous() => goBackToStartOfRange", {
        currentStopHead,
      });
      if (currentStopHead !== this.currentStop) {
        this.advanceToStop(
          this.currentStop,
          currentStopHead,
          currentStopHead.rangeId
        );
      }
      this.setInternalTime(currentStopHead.start);

      return this.getTime();
    }

    if (isPreviousRangeDifferent) {
      prevRange = prevStop.rangeId;
    }

    // Case 1, at the start, but parent ranges possible.
    if (isDefinitelyFirstRange) {
      // Set the time to the start.
      this.goToStartOfRange(prevRange ? prevRange : this.currentStop.rangeId);
      // We are on the first item.
      if (prevRange && this.currentStop.rangeId !== prevRange) {
        // But we still want to change the range.
        this.currentRange = prevRange;
        this.advanceToStop(this.currentStop, currentStopHead, prevRange);
      }

      // And return the time.
      return this.getTime();
    }

    // Case 2, in the middle, but previous is a parent.
    if (prevRange && (isPreviousRangeNotAParent || prevStop === firstStop)) {
      // Then we navigate to the previous.
      this.setInternalTime(prevStop.start);
      this.currentRange = prevRange;
      this.advanceToStop(this.currentStop, prevStop, prevRange);
      // And time.
      return this.getTime();
    }

    // If the previous range is in the current ranges stack (i.e. a parent)
    if (prevRange && isPreviousRangeInStack) {
      this.setInternalTime(this.currentStop.start);
      this.currentRange = prevRange;
      this.advanceToStop(this.currentStop, currentStopHead, prevRange);
      // And time.
      return this.getTime();
    }

    return this.getTime();
  }

  setRange(id: string): TimelineTime {
    Logger.group("setRange", id);

    if (id === this.currentRange) {
      Logger.log("id === this.currentRange");
      return this.getTime();
    }

    this.currentRange = id;

    if (id === this.currentStop.rangeId) {
      Logger.log("id === this.currentStop.rangeId");
      // Or the start of the range?
      return this.getTime();
    }

    Logger.log("Looking for stop", this.plan.stops);
    for (const stop of this.plan.stops) {
      if (stop.rangeId === id) {
        Logger.log("Found stop, setting internalTime", stop.start);
        this.setInternalTime(stop.start);
        this.advanceToStop(
          this.currentStop,
          stop,
          id,
          undefined,
          !this.playing
        );
        break;
      }
    }
    for (const stop of this.plan.stops) {
      if (stop.rangeStack.indexOf(id) !== -1) {
        Logger.log(
          "Found stop in rangeStack, setting internalTime",
          stop.start
        );
        this.setInternalTime(stop.start);
        this.advanceToStop(
          this.currentStop,
          stop,
          id,
          undefined,
          !this.playing
        );
        break;
      }
    }

    Logger.groupEnd();

    return this.getTime();
  }

  isBuffering() {
    return this.media.isBuffering();
  }

  // Time that has ticked over.
  advanceToTime(
    time: TimelineTime,
    paused?: boolean
  ): {
    paused?: boolean;
    buffering?: boolean;
    time: TimelineTime | undefined;
  } {
    Logger.groupCollapsed(
      `TimeplanPlayer.advanceToTime(${time}, ${paused ? "true" : "false"})`
    );

    const stop = this.findStop(time);
    if (stop && this.currentStop !== stop) {
      Logger.log("advanceToTime.a");

      this.setInternalTime(time);

      this.advanceToStop(this.currentStop, stop, undefined, time, paused);
      Logger.groupEnd();
      return { buffering: this.isBuffering(), time };
    }
    // User has selected top level range.
    if (this.playing && this.currentRange !== this.currentStop.rangeId) {
      this.currentRange = this.currentStop.rangeId;
      this.notifyRangeChange(this.currentStop.rangeId, {
        from: this.currentStop,
        to: this.currentStop,
      });
    }

    if (!stop) {
      Logger.log("advanceToTime.b");

      this.pause();
      this.setTime(this.currentStop.end);
      Logger.groupEnd();
      return {
        paused: true,
        buffering: this.isBuffering(),
        time: this.currentStop.end,
      };
    } else {
      Logger.log("advanceToTime.c", {
        time: this.getTime(),
      });

      this.setInternalTime(time);
      this.media.syncClock(this.currentMediaTime());
      Logger.groupEnd();
      return { time };
    }
  }

  hasEnded() {
    return this.currentStop.end === this.getTime();
  }

  async advanceToStop(
    from: TimeStop,
    to: TimeStop,
    rangeId?: string,
    time?: TimelineTime,
    paused?: boolean
  ) {
    Logger.log("TimeplanPlayer.advanceToStop", {
      from,
      to,
      rangeId,
    });
    if (from === to) {
      if (rangeId) {
        this.notifyRangeChange(rangeId ? rangeId : to.rangeId, {
          to,
          from,
        });
      }
      return;
    }

    let promise;

    this.log("advanceToStop", to.start);
    const changeCanvas = this.currentStop.canvasId !== to.canvasId;
    this.currentStop = to;
    this.setInternalTime(typeof time !== "undefined" ? time : to.start);

    if (changeCanvas && !paused) {
      promise = this.media.play(to.canvasId, this.currentMediaTime());
    } else {
      this.log(
        `advanceToStop -> seekToMediaTime(${this.currentMediaTime()}) ${paused ? "paused" : "playing"}`
      );
      promise = this.media.seekToMediaTime(
        this.currentMediaTime(),
        to.canvasId,
        paused
      );
    }

    this.notifyRangeChange(rangeId ? rangeId : to.rangeId, { to, from });

    await promise;
  }

  getStartTime(): TimelineTime {
    return this.plan.start;
  }

  getDuration(): TimelineTime {
    return this.plan.duration;
  }
}
