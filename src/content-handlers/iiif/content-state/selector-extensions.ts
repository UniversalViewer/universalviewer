export type BoxSelector = {
  type: "BoxSelector";
  unit?: "percent" | "pixel";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TemporalSelector = {
  type: "TemporalSelector";
  startTime: number;
  endTime?: number; // optional end time.
};

export type TemporalBoxSelector = {
  type: "TemporalBoxSelector";
  x: number;
  y: number;
  width: number;
  height: number;
  startTime: number;
  endTime?: number;
};

export type SupportedSelectors =
  | TemporalSelector
  | BoxSelector
  | TemporalBoxSelector;
