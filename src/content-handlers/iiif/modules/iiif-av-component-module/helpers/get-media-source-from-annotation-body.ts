import { Utils, Annotation, AnnotationBody } from "manifesto.js";
import { getSpatialComponent } from "./get-spatial-component";
import { MediaSource } from "../types/media-source";
import { annotationTime, canvasTime } from "./relative-time";

export function getMediaSourceFromAnnotationBody(
  annotation: Annotation,
  body: AnnotationBody,
  canvasDimensions: {
    id: string;
    width: number;
    height: number;
    duration: number;
  }
): MediaSource {
  const type = body.getType();
  const format = body.getFormat() || undefined;
  const mediaSource = body.id.split("#")[0];
  const target = annotation.getTarget();

  if (!target) {
    throw new Error("No target");
  }

  if (!type) {
    throw new Error("Unknown media type");
  }

  const [x, y, width, height] = getSpatialComponent(target) || [
    0,
    0,
    canvasDimensions.width || 0,
    canvasDimensions.height || 0,
  ];
  const [start, end]: any[] = Utils.getTemporalComponent(target) || [
    0,
    canvasDimensions.duration,
  ];

  const [, bodyId, offsetStart, offsetEnd] = body.id.match(
    /(.*)#t=([0-9.]+),?([0-9.]+)?/
  ) || [undefined, body.id, undefined, undefined];

  return {
    type,
    format,
    mediaSource,
    canvasId: canvasDimensions.id,
    x,
    y,
    width:
      typeof width === "undefined" ? undefined : parseInt(String(width), 10),
    height:
      typeof height === "undefined" ? undefined : parseInt(String(height), 10),
    start: annotationTime(Number(Number(start).toFixed(2))),
    end: annotationTime(Number(Number(end).toFixed(2))),
    bodyId: bodyId as string,
    offsetStart:
      typeof offsetStart === "undefined"
        ? undefined
        : canvasTime(parseFloat(offsetStart)),
    offsetEnd:
      typeof offsetEnd === "undefined"
        ? undefined
        : canvasTime(parseFloat(offsetEnd)),
  };
}
