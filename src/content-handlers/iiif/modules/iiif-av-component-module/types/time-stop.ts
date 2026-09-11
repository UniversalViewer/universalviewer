import { CanvasTime, TimelineTime } from "../helpers/relative-time";

export type TimeStop = {
  type: "time-stop";
  canvasIndex: number;
  start: TimelineTime;
  end: TimelineTime;
  duration: TimelineTime;
  rangeId: string;
  canvasId: string;
  rawCanvasSelector: string;
  rangeStack: string[];
  noNav?: boolean;
  canvasTime: {
    start: CanvasTime;
    end: CanvasTime;
  };
};
