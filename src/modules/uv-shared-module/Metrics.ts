import {Metric} from "./Metric";

export class Metrics {
    static MOBILE_LANDSCAPE: Metric = new Metric(0, 640);
    static LAPTOP: Metric = new Metric(640, Infinity);
}