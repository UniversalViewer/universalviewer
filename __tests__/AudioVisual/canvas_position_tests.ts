import { getCanvasPosition } from "../../src/content-handlers/iiif/modules/iiif-av-component-module/helpers/get-canvas-position";
import { TimeStop } from "../../src/content-handlers/iiif/modules/iiif-av-component-module/types/time-stop";
import {
  canvasTime,
  timelineTime,
} from "../../src/content-handlers/iiif/modules/iiif-av-component-module/helpers/relative-time";

describe("getCanvasPosition", () => {
  // The second of two canvases on a timeline: timeline 100-160 plays canvas
  // 2 from 30s to 90s.
  const stop = {
    type: "time-stop",
    canvasIndex: 1,
    canvasId: "https://example.org/canvas/2",
    start: timelineTime(100),
    end: timelineTime(160),
    duration: timelineTime(60),
    canvasTime: { start: canvasTime(30), end: canvasTime(90) },
  } as TimeStop;

  it("maps a timeline time onto the stop's canvas", () => {
    expect(getCanvasPosition(stop, timelineTime(100))).toEqual({
      canvasId: "https://example.org/canvas/2",
      time: 30,
    });
    expect(getCanvasPosition(stop, timelineTime(125.5))).toEqual({
      canvasId: "https://example.org/canvas/2",
      time: 55.5,
    });
  });

  it("keeps a clock that has drifted past the stop's edges on its part of the canvas", () => {
    // e.g. after seeking to the stop, the clock reads 99.99999992
    expect(getCanvasPosition(stop, timelineTime(99.99999992)).time).toBe(30);
    expect(getCanvasPosition(stop, timelineTime(160.0000001)).time).toBe(90);
  });
});
