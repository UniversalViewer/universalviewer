export type MetricType = "sm" | "md" | "lg" | "xl";

export class Metric {
  type: MetricType;
  minWidth: number;

  constructor(type: MetricType, minWidth: number) {
    this.type = type;
    this.minWidth = minWidth;
  }
}
