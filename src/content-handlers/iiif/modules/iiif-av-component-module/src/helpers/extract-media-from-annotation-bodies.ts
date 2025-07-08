import { AnnotationBody, Annotation } from "manifesto.js";
import { MediaType } from "@iiif/vocabulary";
import { isHLSFormat } from "./is-hls-format";
import { isMpegDashFormat } from "./is-mpeg-dash-format";
import { canPlayHls } from "./can-play-hls";
import { isSafari } from "./is-safari";

export function extractMediaFromAnnotationBodies(annotation: Annotation) {
  const bodies = annotation.getBody();
  if (!bodies.length) {
    return null;
  }

  // if there's an HLS format and HLS is supported in this browser
  for (let i = 0; i < bodies.length; i++) {
    const body: AnnotationBody = bodies[i];
    const format: MediaType | null = body.getFormat();

    if (format) {
      if (isHLSFormat(format) && canPlayHls()) {
        return body;
      }
    }
  }

  // if there's a Dash format and the browser isn't Safari
  for (let i = 0; i < bodies.length; i++) {
    const body: AnnotationBody = bodies[i];
    const format: MediaType | null = body.getFormat();

    if (format) {
      if (isMpegDashFormat(format) && !isSafari()) {
        return body;
      }
    }
  }

  // otherwise, return the first format that isn't HLS or Dash
  for (let i = 0; i < bodies.length; i++) {
    const body: AnnotationBody = bodies[i];
    const format: MediaType | null = body.getFormat();

    if (format) {
      if (!isHLSFormat(format) && !isMpegDashFormat(format)) {
        return body;
      }
    }
  }

  // couldn't find a suitable format
  return null;
}
