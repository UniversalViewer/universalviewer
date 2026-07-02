import { TimeStop } from "./time-stop";
import { TimelineTime } from "../helpers/relative-time";

export type TimePlan = {
  type: "time-plan";
  duration: TimelineTime;
  start: TimelineTime;
  end: TimelineTime;
  stops: TimeStop[];
  rangeId: string;
  canvases: any[];
  rangeStack: string[];
  rangeOrder: string[];
  items: Array<TimeStop | TimePlan>;
  noNav?: boolean;
};
