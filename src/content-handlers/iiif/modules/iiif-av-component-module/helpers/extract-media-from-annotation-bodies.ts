import { AnnotationBody, Annotation } from "manifesto.js";
import { canPlayHls } from "./can-play-hls";
import { isSafari } from "./is-safari";
import { mediaAttempts } from "./media-attempts";

// The version of the media to play first, of those a painting annotation
// offers (e.g. a Choice of formats), or null if none can be played. In
// order (see mediaAttempts):
// 1. HLS, where the browser can play it (natively or with hls.js).
// 2. MPEG-DASH, except in Safari, which plays HLS instead.
// 3. The first of any other format (e.g. MP4).
// 4. The first body with no format, as a last resort.
export function extractMediaFromAnnotationBodies(
  annotation: Annotation
): AnnotationBody | null {
  const hls = canPlayHls();
  const [first] = mediaAttempts(
    annotation.getBody(),
    (body) => body.getFormat(),
    { nativeHls: hls, hlsJs: hls, pageHlsJs: false, safari: isSafari() }
  );
  return first ? first.item : null;
}
