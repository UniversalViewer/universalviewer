import { MediaType } from "@iiif/vocabulary";

export function isMpegDashFormat(format: MediaType) {
  return format.toString() === "application/dash+xml";
}
