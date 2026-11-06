import { MediaType } from "@iiif/vocabulary";
import { isHLSFormat } from "../iiif-av-component-module/helpers/is-hls-format";
import { isMpegDashFormat } from "../iiif-av-component-module/helpers/is-mpeg-dash-format";

// The painting annotations of a IIIF v3 canvas. Manifests from drafts of
// IIIF Presentation 3 (e.g. the British Library's early AV manifests) give a
// canvas' annotation pages as "content" rather than "items", as manifesto
// reads them.
export const paintingAnnotations = (canvas: any): any[] => {
  const pages = canvas && (canvas.items || canvas.content);
  return (Array.isArray(pages) ? pages : []).flatMap((page: any) =>
    Array.isArray(page.items) ? page.items : []
  );
};

const hasSize = (resource: any): boolean =>
  !!(resource && resource.width && resource.height);

// Whether media is audio or video (null for neither, e.g. an image or text),
// given the raw JSON-LD of an annotation body (or, in a IIIF v2 IxIF
// manifest, a media sequence's element) and, optionally, its canvas. In
// order:
// 1. The body's type: "Sound" or "Audio" is audio, "Video" or "MovingImage"
//    video, prefixed (e.g. "dctypes:") or not. It comes first as audio is
//    often in an MP4 file, whose format is video/mp4 (IIIF Cookbook recipe
//    0014).
// 2. Its format: audio/... is audio and video/... video.
// 3. Its size, for a format that may be either (HLS's
//    application/vnd.apple.mpegurl and the like, or MPEG-DASH's
//    application/dash+xml) or none: in IIIF Presentation 3, video has a width and height (on the body
//    or its canvas) as well as a duration, and audio only a duration.
// 4. Otherwise audio.
// Bodies of other types or formats (e.g. an image, or a PDF) are neither.
export const mediaKind = (
  body: any,
  canvas?: any
): "audio" | "video" | null => {
  if (!body) {
    return null;
  }

  const type = String(body.type || body["@type"] || "")
    .toLowerCase()
    .split(":")
    .pop();
  if (type === "sound" || type === "audio") {
    return "audio";
  }
  if (type === "video" || type === "movingimage") {
    return "video";
  }
  if (type) {
    return null;
  }

  const format = String(body.format || "").toLowerCase();
  if (format.startsWith("audio/")) {
    return "audio";
  }
  if (format.startsWith("video/")) {
    return "video";
  }
  if (
    format &&
    !isHLSFormat(format as MediaType) &&
    !isMpegDashFormat(format as MediaType)
  ) {
    return null;
  }

  return hasSize(body) || hasSize(canvas) ? "video" : "audio";
};

// Whether a canvas' media is audio or video (see mediaKind), or null for
// neither (e.g. an image). It's video if any body of the canvas' painting
// annotations (or of a Choice among them) is, otherwise audio if any is. In a IIIF v2 IxIF manifest, whose media are elements of a media
// sequence (offered by manifesto as canvases without painting annotations),
// it goes by the element itself.
export const canvasMediaKind = (canvas: any): "audio" | "video" | null => {
  if (!canvas) {
    return null;
  }
  const annotations = paintingAnnotations(canvas);
  if (!annotations.length) {
    return mediaKind(canvas);
  }
  const kinds = annotations
    .flatMap((annotation: any) =>
      Array.isArray(annotation.body) ? annotation.body : [annotation.body]
    )
    .filter(Boolean)
    .flatMap((body: any) => (Array.isArray(body.items) ? body.items : [body]))
    .map((body: any) => mediaKind(body, canvas));
  return kinds.includes("video")
    ? "video"
    : kinds.includes("audio")
      ? "audio"
      : null;
};

// Whether a canvas' media is video (see canvasMediaKind), which decides
// whether the MediaElement extension plays it in a video or an audio player,
// and which images the players show while it plays.
export const isVideoCanvas = (canvas: any): boolean =>
  canvasMediaKind(canvas) === "video";
