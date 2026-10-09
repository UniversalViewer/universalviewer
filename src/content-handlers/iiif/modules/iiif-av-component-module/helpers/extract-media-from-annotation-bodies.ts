import { AnnotationBody, Annotation } from "manifesto.js";
import { MediaType } from "@iiif/vocabulary";
import { isHLSFormat } from "./is-hls-format";
import { isMpegDashFormat } from "./is-mpeg-dash-format";
import { canPlayHls } from "./can-play-hls";
import { isSafari } from "./is-safari";

// The version of the media to play, of those a painting annotation offers
// (e.g. a Choice of formats), or null if none can be played. In order:
// 1. HLS, where the browser can play it (natively or with hls.js).
// 2. MPEG-DASH, except in Safari, which plays HLS instead.
// 3. The first of any other format (e.g. MP4).
// 4. The first body with no format, as a last resort.
export function extractMediaFromAnnotationBodies(
  annotation: Annotation
): AnnotationBody | null {
  const bodies: AnnotationBody[] = annotation.getBody();
  const withFormat = (test: (format: MediaType) => boolean) =>
    bodies.find((body) => {
      const format = body.getFormat();
      return !!format && test(format);
    });

  return (
    (canPlayHls() && withFormat(isHLSFormat)) ||
    (!isSafari() && withFormat(isMpegDashFormat)) ||
    withFormat((format) => !isHLSFormat(format) && !isMpegDashFormat(format)) ||
    bodies.find((body) => !body.getFormat()) ||
    null
  );
}
