import { TimeStop } from "../types/time-stop";
import { TimelineTime } from "./relative-time";
import { CanvasPosition } from "../../uv-captions-module/CanvasCaptions";

// Where a time on a virtual canvas' timeline falls on the canvas that the
// time stop containing it plays. The player's clock can drift by fractions
// of a millisecond either side of a stop (findStop allows for this), so the
// time is kept within the stop's part of the canvas.
export function getCanvasPosition(
  stop: TimeStop,
  time: TimelineTime
): CanvasPosition {
  const { start, end } = stop.canvasTime;

  return {
    canvasId: stop.canvasId,
    time: Math.min(Math.max(start + (time - stop.start), start), end),
  };
}
