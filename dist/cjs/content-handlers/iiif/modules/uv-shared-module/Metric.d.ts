export declare type MetricType = "sm" | "md" | "lg" | "xl";
export declare class Metric {
    type: MetricType;
    minWidth: number;
    constructor(type: MetricType, minWidth: number);
}
