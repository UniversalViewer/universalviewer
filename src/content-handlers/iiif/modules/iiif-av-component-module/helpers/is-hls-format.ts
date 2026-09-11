import { MediaType } from "@iiif/vocabulary";
import { hlsMimeTypes } from "./hls-media-types";

export function isHLSFormat(format: MediaType) {
  return hlsMimeTypes.includes(format.toString());
}
