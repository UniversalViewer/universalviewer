export declare class Tagged<N extends string> {
  protected _nominal_: N;
}
export type Nominal<T, N extends string> = T & Tagged<N>;

export type TimelineTime = Nominal<number, "TimelineTime">;
export type TimelineTimeMs = Nominal<number, "TimelineTimeMs">;
export type CanvasTime = Nominal<number, "CanvasTime">;
export type AnnotationTime = Nominal<number, "AnnotationTime">;

export function timelineTime(num: number) {
  return num as TimelineTime;
}

export function canvasTime(num: number) {
  return num as CanvasTime;
}

export function annotationTime(num: number) {
  return num as AnnotationTime;
}

export function addTime(a: TimelineTime, b: TimelineTime): TimelineTime;
export function addTime(a: CanvasTime, b: CanvasTime): CanvasTime;
export function addTime(a: AnnotationTime, b: AnnotationTime): AnnotationTime;
export function addTime(a: TimelineTimeMs, b: TimelineTimeMs): TimelineTimeMs;
export function addTime(a, b) {
  return a + b;
}

export function minusTime(a: TimelineTime, b: TimelineTime): TimelineTime;
export function minusTime(a: CanvasTime, b: CanvasTime): CanvasTime;
export function minusTime(a: AnnotationTime, b: AnnotationTime): AnnotationTime;
export function minusTime(a: TimelineTimeMs, b: TimelineTimeMs): TimelineTimeMs;
export function minusTime(a, b) {
  return a - b;
}

export function multiplyTime(time: TimelineTime, b: number): TimelineTime;
export function multiplyTime(time: CanvasTime, b: number): CanvasTime;
export function multiplyTime(time: AnnotationTime, b: number): AnnotationTime;
export function multiplyTime(time: TimelineTimeMs, b: number): TimelineTimeMs;
export function multiplyTime(time, factor: number) {
  return time * factor;
}

export function toMs(a: TimelineTime): TimelineTimeMs {
  return multiplyTime(a, 1000) as any;
}

export function fromMs(a: TimelineTimeMs): TimelineTime {
  return ((a as any) / 1000) as TimelineTime;
}
