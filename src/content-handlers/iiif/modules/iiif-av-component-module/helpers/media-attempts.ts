import { MediaType } from "@iiif/vocabulary";
import { isHLSFormat } from "./is-hls-format";
import { isMpegDashFormat } from "./is-mpeg-dash-format";

// How a version of the media is played: by the browser's own HLS player, by
// hls.js, by dash.js, or by the media element itself (e.g. an MP4 file).
export type MediaVia = "native" | "hls.js" | "dash" | "direct";

export interface MediaAttempt<T> {
  item: T;
  via: MediaVia;
}

// What the browser can do: play HLS itself (e.g. Chrome, Safari), or with
// hls.js (where it has Media Source Extensions), or with an hls.js the page
// has provided (which is then preferred), and whether it's Safari (which
// plays HLS rather than MPEG-DASH).
export interface MediaSupport {
  nativeHls: boolean;
  hlsJs: boolean;
  pageHlsJs: boolean;
  safari: boolean;
}

// The ways to play HLS, in the order to try them: hls.js where the browser
// can use it (e.g. Chrome, Firefox), and natively in Safari, unless the page
// has provided its own hls.js, which is then tried first there too; then the
// other way, where the browser has it. hls.js comes first in Chrome, though
// it has its own player, because that player stalls for about 30 seconds on
// a stream from another site whose segments it can't tell are media (e.g.
// served as application/octet-stream, which Chrome's Opaque Response
// Blocking then blocks) before it fails, whereas hls.js fails straight away
// on a stream it can't load (one whose server sends no CORS headers), which
// Chrome's own player can then play.
export function hlsWays(support: MediaSupport): ("native" | "hls.js")[] {
  const hlsJsFirst =
    support.pageHlsJs || (support.hlsJs && !(support.safari && support.nativeHls));
  const ways: ("native" | "hls.js")[] = [];
  if (hlsJsFirst) {
    ways.push("hls.js");
  }
  if (support.nativeHls) {
    ways.push("native");
  }
  if (support.hlsJs && !hlsJsFirst) {
    ways.push("hls.js");
  }
  return ways;
}

// The order to try the versions of the media a canvas offers (e.g. a Choice
// of formats, or its renderings), so that something plays wherever it can:
// 1. HLS, the first way hlsWays gives.
// 2. Then MPEG-DASH (except in Safari), then any other format, then a version
//    with no format.
// 3. Then HLS again, the other way. A browser without its own player (e.g.
//    Firefox) has no second way to try.
// `formatOf` gives a version's format.
export function mediaAttempts<T>(
  items: T[],
  formatOf: (item: T) => string | null | undefined,
  support: MediaSupport
): MediaAttempt<T>[] {
  const format = (item: T): string => String(formatOf(item) || "");
  const hls = items.filter(
    (item) => !!format(item) && isHLSFormat(format(item) as MediaType)
  );
  const dash = items.filter(
    (item) => !!format(item) && isMpegDashFormat(format(item) as MediaType)
  );
  const other = items.filter(
    (item) => !!format(item) && !hls.includes(item) && !dash.includes(item)
  );
  const noFormat = items.filter((item) => !format(item));

  const [firstWay, ...laterWays] = hlsWays(support);

  const attempts = (list: T[], via: MediaVia) =>
    list.map((item) => ({ item, via }));
  return [
    ...(firstWay ? attempts(hls, firstWay) : []),
    ...(support.safari ? [] : attempts(dash, "dash")),
    ...attempts(other, "direct"),
    ...attempts(noFormat, "direct"),
    ...laterWays.flatMap((via) => attempts(hls, via)),
  ];
}

// The parts of an hls.js error that tell why it happened.
export interface HlsErrorData {
  fatal?: boolean;
  type?: string;
  details?: string;
  response?: { code?: number };
}

// Whether hls.js failed to load a stream because its server sends no CORS
// headers: the browser blocks the request, so hls.js gets no response
// (code 0), for a stream from another site than `pageOrigin`.
export function isBlockedByCors(
  data: HlsErrorData | undefined,
  source: string,
  pageOrigin: string
): boolean {
  if (
    !data ||
    !data.fatal ||
    data.type !== "networkError" ||
    data.details !== "manifestLoadError" ||
    !data.response ||
    data.response.code !== 0
  ) {
    return false;
  }
  try {
    return new URL(source, pageOrigin).origin !== new URL(pageOrigin).origin;
  } catch (e) {
    return false;
  }
}
