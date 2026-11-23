import { canPlayHls } from "./can-play-hls";
import { createTimePlansFromManifest } from "./create-time-plans-from-manifest";
import { debounce } from "./debounce";
import { diffData } from "./diff-data";
import { extractMediaFromAnnotationBodies } from "./extract-media-from-annotation-bodies";
import { formatTime } from "./format-time";
import { getFirstTargetedCanvasId } from "./get-first-targeted-canvas-id";
import { getMediaSourceFromAnnotationBody } from "./get-media-source-from-annotation-body";
import { getSpatialComponent } from "./get-spatial-component";
import { getTimestamp } from "./get-timestamp";
import { hlsMimeTypes } from "./hls-media-types";
import { isHLSFormat } from "./is-hls-format";
import { isIE } from "./is-ie";
import { isMpegDashFormat } from "./is-mpeg-dash-format";
import { isSafari } from "./is-safari";
import { isVirtual } from "./is-virtual";
import { normalise } from "./normalise-number";
import { retargetTemporalComponent } from "./retarget-temporal-component";

export const AVComponentUtils = {
  canPlayHls,
  createTimePlansFromManifest,
  debounce,
  diffData,
  diff: diffData,
  extractMediaFromAnnotationBodies,
  formatTime,
  getFirstTargetedCanvasId,
  getMediaSourceFromAnnotationBody,
  getSpatialComponent,
  getTimestamp,
  hlsMimeTypes,
  hlsMediaTypes: hlsMimeTypes,
  isHLSFormat,
  isIE,
  isMpegDashFormat,
  isSafari,
  isVirtual,
  normalise,
  normalize: normalise,
  normalizeNumber: normalise,
  normaliseNumber: normalise,
  retargetTemporalComponent,
};
