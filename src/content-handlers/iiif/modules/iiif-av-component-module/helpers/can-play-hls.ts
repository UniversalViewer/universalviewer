import { hlsMimeTypes } from "./hls-media-types";
import { getHls } from "./get-hls";

// Whether the browser can play HLS: natively (e.g. Safari), or with hls.js,
// which the page may provide and UV otherwise loads when it's needed. hls.js
// needs Media Source Extensions able to play MP4 (as hls.js's own
// isSupported() checks).
export function canPlayHls(): boolean {
  if (typeof document !== "object") {
    return false;
  }
  const video = document.createElement("video");
  if (
    hlsMimeTypes.some((type: string) =>
      /maybe|probably/i.test(video.canPlayType(type))
    )
  ) {
    return true;
  }
  const Hls = getHls();
  if (Hls) {
    return Hls.isSupported();
  }
  const MediaSource = (window as any).ManagedMediaSource || window.MediaSource;
  return (
    !!MediaSource &&
    MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')
  );
}
