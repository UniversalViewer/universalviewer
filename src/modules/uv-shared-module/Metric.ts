export type MetricType = "sm" | "md" | "lg" | "xl";

export class Metric {
  constructor(public type: MetricType, public minWidth: number) {}
}
