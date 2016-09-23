import Metric = require("./Metric");

class Metrics {
    static MOBILE_LANDSCAPE: Metric = new Metric(0, 480);
    static LAPTOP: Metric = new Metric(480, Infinity);
}

export = Metrics;