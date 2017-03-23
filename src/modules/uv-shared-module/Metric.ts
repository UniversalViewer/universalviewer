import {MetricType} from "./MetricType";

class Metric {

    constructor(public type: MetricType, public minWidth: number, public maxWidth: number) {

    }
}

export = Metric;