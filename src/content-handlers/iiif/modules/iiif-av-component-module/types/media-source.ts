import { MediaType } from "@iiif/vocabulary";
import { AnnotationTime, CanvasTime } from "../helpers/relative-time";

export interface MediaSource {
  // "audio" or "video" (see mediaKind).
  type: string;
  format?: MediaType;
  mediaSource: string;
  canvasId: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  start: AnnotationTime;
  end: AnnotationTime;
  bodyId: string;
  offsetStart?: CanvasTime;
  offsetEnd?: CanvasTime;
}
