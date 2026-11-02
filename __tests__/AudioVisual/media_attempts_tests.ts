import { parseManifest, AnnotationBody, Manifest } from "manifesto.js";
import { MediaType } from "@iiif/vocabulary";
import {
  mediaAttempts,
  isBlockedByCors,
} from "../../src/content-handlers/iiif/modules/iiif-av-component-module/helpers/media-attempts";
import { isHLSFormat } from "../../src/content-handlers/iiif/modules/iiif-av-component-module/helpers/is-hls-format";
import { isMpegDashFormat } from "../../src/content-handlers/iiif/modules/iiif-av-component-module/helpers/is-mpeg-dash-format";

// The order the players try the versions of the media a canvas offers, so
// that something plays wherever it can:
// 1. HLS: with hls.js where the browser can play it (e.g. Chrome, Firefox),
//    and natively in Safari, unless the page has provided its own hls.js,
//    which is then tried first there too.
// 2. Then MPEG-DASH (except in Safari), then any other format, then a body
//    with no format.
// 3. Then HLS again, with whichever of the browser's own player and hls.js
//    step 1 didn't use. A browser without its own player (e.g. Firefox) has
//    no second way to try.
// hls.js comes first in Chrome, though it has its own player, because that
// player stalls for about 30 seconds on a stream from another site whose
// segments it can't tell are media (e.g. served as
// application/octet-stream, which Chrome's Opaque Response Blocking then
// blocks) before it fails; hls.js fails straight away on a stream it can't
// load (one whose server sends no CORS headers), which Chrome's own player
// can then play.
describe("mediaAttempts", () => {
  const MP4 = { id: "https://example.org/media.mp4", format: "video/mp4" };
  const WEBM = { id: "https://example.org/media.webm", format: "video/webm" };
  const DASH = {
    id: "https://example.org/media.mpd",
    format: "application/dash+xml",
  };
  const HLS = {
    id: "https://example.org/media.m3u8",
    format: "application/vnd.apple.mpegurl",
  };
  const NO_FORMAT = { id: "https://example.org/media" };

  // A manifest with one canvas, painted with the given body.
  const paintedWith = (body: object): AnnotationBody[] => {
    const manifest = parseManifest({
      "@context": "http://iiif.io/api/presentation/3/context.json",
      id: "https://example.org/manifest",
      type: "Manifest",
      items: [
        {
          id: "https://example.org/canvas",
          type: "Canvas",
          duration: 60,
          items: [
            {
              id: "https://example.org/canvas/page",
              type: "AnnotationPage",
              items: [
                {
                  id: "https://example.org/canvas/page/annotation",
                  type: "Annotation",
                  motivation: "painting",
                  target: "https://example.org/canvas",
                  body,
                },
              ],
            },
          ],
        },
      ],
    }) as Manifest;
    return manifest
      .getSequenceByIndex(0)
      .getCanvases()[0]
      .getContent()[0]
      .getBody();
  };

  // A Choice of these versions (as many AV manifests give them).
  const choice = (...items: object[]) =>
    paintedWith({
      type: "Choice",
      items: items.map((item) => ({ type: "Video", ...item })),
    });

  // What each browser can do.
  const CHROME = {
    nativeHls: true,
    hlsJs: true,
    pageHlsJs: false,
    safari: false,
  };
  const SAFARI = { ...CHROME, safari: true };
  // Firefox has no HLS player of its own, only hls.js.
  const FIREFOX = { ...CHROME, nativeHls: false };
  const NO_HLS = { ...FIREFOX, hlsJs: false };

  // Each attempt, as its id and how it's played.
  const attempts = (browser: typeof CHROME, bodies: AnnotationBody[]) =>
    mediaAttempts(bodies, (body) => body.getFormat(), browser).map(
      ({ item, via }) => [item.id, via]
    );

  it("tries HLS with hls.js first, then the other formats, then HLS natively", () => {
    expect(attempts(CHROME, choice(MP4, DASH, HLS))).toEqual([
      [HLS.id, "hls.js"],
      [DASH.id, "dash"],
      [MP4.id, "direct"],
      [HLS.id, "native"],
    ]);
  });

  it("tries HLS natively first in Safari, and with hls.js last", () => {
    expect(attempts(SAFARI, choice(MP4, HLS))).toEqual([
      [HLS.id, "native"],
      [MP4.id, "direct"],
      [HLS.id, "hls.js"],
    ]);
  });

  it("tries HLS with the page's own hls.js first, even in Safari, and natively last", () => {
    expect(
      attempts({ ...SAFARI, pageHlsJs: true }, choice(MP4, HLS))
    ).toEqual([
      [HLS.id, "hls.js"],
      [MP4.id, "direct"],
      [HLS.id, "native"],
    ]);
  });

  it("tries HLS natively where the browser can't use hls.js", () => {
    expect(attempts({ ...CHROME, hlsJs: false }, choice(HLS, MP4))).toEqual([
      [HLS.id, "native"],
      [MP4.id, "direct"],
    ]);
  });

  it("tries HLS only with hls.js in a browser without its own HLS player", () => {
    expect(attempts(FIREFOX, choice(HLS, WEBM, MP4))).toEqual([
      [HLS.id, "hls.js"],
      [WEBM.id, "direct"],
      [MP4.id, "direct"],
    ]);
  });

  it("leaves out MPEG-DASH in Safari", () => {
    expect(attempts(SAFARI, choice(DASH, HLS, MP4))).toEqual([
      [HLS.id, "native"],
      [MP4.id, "direct"],
      [HLS.id, "hls.js"],
    ]);
  });

  it("leaves out HLS where the browser can't play it at all", () => {
    expect(attempts(NO_HLS, choice(HLS, MP4))).toEqual([[MP4.id, "direct"]]);
  });

  it("tries a body with no format after those with one", () => {
    expect(attempts(FIREFOX, choice(NO_FORMAT, MP4))).toEqual([
      [MP4.id, "direct"],
      [NO_FORMAT.id, "direct"],
    ]);
  });

  it("keeps the manifest's order when there's no HLS", () => {
    expect(attempts(CHROME, choice(WEBM, MP4))).toEqual([
      [WEBM.id, "direct"],
      [MP4.id, "direct"],
    ]);
  });

  it("has nothing to try when nothing can be played", () => {
    expect(attempts(NO_HLS, choice(HLS))).toEqual([]);
    expect(attempts(SAFARI, choice(DASH))).toEqual([]);
  });

  // A single painting body, not a Choice (as most of the IIIF Cookbook's AV
  // recipes, e.g. 0003, give it, and HLS-only collections do), so there's
  // nothing else to fall back to but HLS the other way.
  it("tries a single HLS body both ways", () => {
    const single = paintedWith({ type: "Sound", ...HLS });
    expect(attempts(CHROME, single)).toEqual([
      [HLS.id, "hls.js"],
      [HLS.id, "native"],
    ]);
    expect(attempts(SAFARI, single)).toEqual([
      [HLS.id, "native"],
      [HLS.id, "hls.js"],
    ]);
    expect(attempts(FIREFOX, single)).toEqual([[HLS.id, "hls.js"]]);
  });

  it("tries a single MP4 body once", () => {
    expect(
      attempts(FIREFOX, paintedWith({ type: "Video", ...MP4 }))
    ).toEqual([[MP4.id, "direct"]]);
  });

  // The MediaElement extension plays a canvas' renderings instead of its
  // painting bodies when it has any: plain versions, each with its format.
  it("orders plain versions, such as a canvas' renderings, the same way", () => {
    const renderings = [
      { src: MP4.id, type: MP4.format },
      { src: HLS.id, type: HLS.format },
    ];
    expect(
      mediaAttempts(renderings, (rendering) => rendering.type, FIREFOX).map(
        ({ item, via }) => [item.src, via]
      )
    ).toEqual([
      [HLS.id, "hls.js"],
      [MP4.id, "direct"],
    ]);
  });

  // However the manifest writes it: servers often give HLS as
  // application/x-mpegURL.
  it("recognises HLS and MPEG-DASH formats in any case", () => {
    const single = paintedWith({
      type: "Sound",
      id: HLS.id,
      format: "application/x-mpegURL",
    });
    expect(attempts(FIREFOX, single)).toEqual([[HLS.id, "hls.js"]]);
  });
});

describe("isHLSFormat and isMpegDashFormat", () => {
  it.each([
    "application/vnd.apple.mpegurl",
    "application/x-mpegURL",
    "Application/X-MpegUrl",
    "audio/mpegurl",
  ])("recognise %s as HLS", (format) => {
    expect(isHLSFormat(format as MediaType)).toBe(true);
  });

  it.each(["application/dash+xml", "Application/DASH+XML"])(
    "recognise %s as MPEG-DASH",
    (format) => {
      expect(isMpegDashFormat(format as MediaType)).toBe(true);
    }
  );

  it("recognise neither in other formats", () => {
    expect(isHLSFormat("video/mp4" as MediaType)).toBe(false);
    expect(isMpegDashFormat("video/mp4" as MediaType)).toBe(false);
  });
});

// Whether hls.js failed to load a stream because its server sends no CORS
// headers: the browser blocks the request, so hls.js gets no response
// (code 0), for a stream from another site.
describe("isBlockedByCors", () => {
  const PAGE = "http://localhost:4444";
  const OTHER_SITE = "http://127.0.0.1:4444/stream.m3u8";
  const BLOCKED = {
    fatal: true,
    type: "networkError",
    details: "manifestLoadError",
    response: { code: 0 },
  };

  it("is true when the browser blocked a stream from another site", () => {
    expect(isBlockedByCors(BLOCKED, OTHER_SITE, PAGE)).toBe(true);
  });

  it("is false for a stream from the page's own site", () => {
    expect(isBlockedByCors(BLOCKED, `${PAGE}/stream.m3u8`, PAGE)).toBe(false);
    expect(isBlockedByCors(BLOCKED, "/stream.m3u8", PAGE)).toBe(false);
  });

  it("is false when the server answered, e.g. 404 Not Found", () => {
    expect(
      isBlockedByCors({ ...BLOCKED, response: { code: 404 } }, OTHER_SITE, PAGE)
    ).toBe(false);
  });

  it("is false for other failures", () => {
    expect(
      isBlockedByCors({ ...BLOCKED, fatal: false }, OTHER_SITE, PAGE)
    ).toBe(false);
    expect(
      isBlockedByCors({ ...BLOCKED, type: "mediaError" }, OTHER_SITE, PAGE)
    ).toBe(false);
    expect(
      isBlockedByCors({ ...BLOCKED, details: "fragLoadError" }, OTHER_SITE, PAGE)
    ).toBe(false);
    expect(isBlockedByCors(undefined, OTHER_SITE, PAGE)).toBe(false);
  });
});
