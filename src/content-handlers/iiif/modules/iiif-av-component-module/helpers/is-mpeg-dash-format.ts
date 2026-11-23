import { MediaType } from "@iiif/vocabulary";

// However the manifest writes it (formats aren't case-sensitive).
export function isMpegDashFormat(format: MediaType) {
  return format.toString().toLowerCase() === "application/dash+xml";
}
