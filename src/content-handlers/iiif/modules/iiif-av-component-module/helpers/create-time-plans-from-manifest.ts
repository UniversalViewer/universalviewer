import { Manifest, Range } from "manifesto.js";
import { TimePlan } from "../types/time-plan";
import { TimeStop } from "../types/time-stop";
import {
  addTime,
  canvasTime,
  minusTime,
  TimelineTime,
  timelineTime,
} from "./relative-time";

export function createTimePlansFromManifest(manifest: Manifest) {
  const parseRange = (
    range: Range,
    _rangeStack: string[] = [],
    startDuration: TimelineTime = timelineTime(0)
  ): TimePlan => {
    let rangeStack = _rangeStack;
    let rangeId = range.id;

    const behavior = range.getBehavior();
    const isNoNav = behavior === "no-nav";
    if (behavior === "no-nav") {
      rangeStack = rangeStack.slice(0, -1);
      rangeId = rangeStack[rangeStack.length - 1];
    }

    const timePlan: TimePlan = {
      type: "time-plan",
      canvases: [],
      duration: timelineTime(0),
      items: [],
      stops: [],
      rangeOrder: isNoNav ? [] : [rangeId],
      end: timelineTime(0),
      start: startDuration,
      rangeId: rangeId,
      rangeStack: rangeStack,
      noNav: isNoNav,
    };

    let runningDuration = startDuration;

    const rangeRanges = [...range.items, ...range.getCanvasIds()];

    for (let canvasIndex = 0; canvasIndex < rangeRanges.length; canvasIndex++) {
      const ro = rangeRanges[canvasIndex];

      if (typeof ro === "string") {
        const [, canvasId, start, end] = ro.match(
          /(.*)#t=([0-9.]+),?([0-9.]+)?/
        ) || [undefined, ro, "0", "0"];

        // Skip invalid ranges.
        if (
          !canvasId ||
          typeof start === "undefined" ||
          typeof end === "undefined"
        ) {
          continue;
        }

        const canvas = manifest.getSequenceByIndex(0).getCanvasById(canvasId);

        if (canvas === null) {
          throw new Error("Canvas not found..");
        }

        let canvasIdx = timePlan.canvases.indexOf(canvasId);
        if (canvasIdx === -1) {
          timePlan.canvases.push(canvasId);
          canvasIdx = timePlan.canvases.indexOf(canvasId);
        }

        const rStart = canvasTime(parseFloat(start || "0"));
        const rEnd = canvasTime(parseFloat(end || "0"));
        const rDuration = timelineTime(rEnd - rStart);

        runningDuration = addTime(rDuration, runningDuration);

        const timeStop: TimeStop = {
          type: "time-stop",
          canvasIndex: canvasIdx,
          start: minusTime(runningDuration, rDuration),
          end: runningDuration,
          duration: rDuration,
          rangeId: rangeId,
          canvasId: canvasId,
          rawCanvasSelector: ro,
          canvasTime: {
            start: rStart,
            end: rEnd,
          },
          rangeStack,
          noNav: isNoNav,
        };

        timePlan.stops.push(timeStop);
        timePlan.items.push(timeStop);
      } else {
        const rangeTimePlan = parseRange(
          ro as any,
          [...rangeStack, ro.id],
          runningDuration
        );

        runningDuration = addTime(runningDuration, rangeTimePlan.duration);

        for (const rangeTimePlanCanvasId of rangeTimePlan.canvases) {
          if (timePlan.canvases.indexOf(rangeTimePlanCanvasId) === -1) {
            timePlan.canvases.push(rangeTimePlanCanvasId);
          }
        }
        timePlan.stops.push(
          // ...rangeTimePlan.stops
          // Unsure what this does..
          ...rangeTimePlan.stops.map((stop) => ({
            ...stop,
            canvasIndex: timePlan.canvases.indexOf(stop.canvasId),
          }))
        );
        timePlan.items.push(rangeTimePlan);
        timePlan.rangeOrder.push(...rangeTimePlan.rangeOrder);
      }
    }

    timePlan.end = runningDuration;
    timePlan.duration = timelineTime(timePlan.end - timePlan.start);

    return timePlan;
  };

  let topLevels = manifest.getTopRanges();
  const plans: TimePlan[] = [];

  if (!topLevels) {
    topLevels = manifest.getAllRanges();
  }

  if (topLevels.length === 1 && !topLevels[0].id) {
    topLevels = topLevels[0].getRanges();
  }

  for (let range of topLevels) {
    const subRanges = range.getRanges();
    if (subRanges[0] && range.id === range.getRanges()[0].id) {
      range = range.getRanges()[0];
    }

    const rangeTimePlan = parseRange(range as Range, [range.id]);
    plans.push(rangeTimePlan);
  }

  return plans[0]; // @todo only one top level range.
}
