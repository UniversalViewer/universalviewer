import { MediaType } from "@iiif/vocabulary";
import { hlsMimeTypes } from "./hls-media-types";

// However the manifest writes it: servers often give HLS as
// application/x-mpegURL.
export function isHLSFormat(format: MediaType) {
  return hlsMimeTypes.includes(format.toString().toLowerCase());
}
