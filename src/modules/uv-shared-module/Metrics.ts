import Metric = require("./Metric");

class Metrics {
    static MOBILE_LANDSCAPE: Metric = new Metric(0, 568);
    static LAPTOP: Metric = new Metric(568, Infinity);
}

export = Metrics;