import { parseManifest, Annotation, Manifest } from "manifesto.js";
import { extractMediaFromAnnotationBodies } from "../src/content-handlers/iiif/modules/iiif-av-component-module/helpers/extract-media-from-annotation-bodies";
import { canPlayHls } from "../src/content-handlers/iiif/modules/iiif-av-component-module/helpers/can-play-hls";
import { isSafari } from "../src/content-handlers/iiif/modules/iiif-av-component-module/helpers/is-safari";

// The browser checks, set per test.
jest.mock(
  "../src/content-handlers/iiif/modules/iiif-av-component-module/helpers/can-play-hls",
  () => ({ canPlayHls: jest.fn() })
);
jest.mock(
  "../src/content-handlers/iiif/modules/iiif-av-component-module/helpers/is-safari",
  () => ({ isSafari: jest.fn() })
);

// The version of the media the AV component plays, of those a painting
// annotation offers (e.g. a Choice of formats): HLS where the browser can
// play it, else MPEG-DASH except in Safari, else the first of any other
// format, else the first body with no format.
describe("extractMediaFromAnnotationBodies", () => {
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

  // The painting annotation of a canvas whose body is a Choice of these.
  const annotation = (...items: object[]): Annotation => {
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
                  body: {
                    type: "Choice",
                    items: items.map((item) => ({ type: "Video", ...item })),
                  },
                },
              ],
            },
          ],
        },
      ],
    }) as Manifest;
    return manifest.getSequenceByIndex(0).getCanvases()[0].getContent()[0];
  };

  const chosen = (...items: object[]) =>
    extractMediaFromAnnotationBodies(annotation(...items))?.id;

  const browser = ({ hls = false, safari = false }) => {
    (canPlayHls as jest.Mock).mockReturnValue(hls);
    (isSafari as jest.Mock).mockReturnValue(safari);
  };

  it("plays HLS where the browser can", () => {
    browser({ hls: true });
    expect(chosen(MP4, DASH, HLS)).toBe(HLS.id);
  });

  it("plays MPEG-DASH where it can't play HLS, except in Safari", () => {
    browser({});
    expect(chosen(MP4, HLS, DASH)).toBe(DASH.id);
    browser({ safari: true });
    expect(chosen(MP4, HLS, DASH)).toBe(MP4.id);
  });

  it("otherwise plays the first of any other format", () => {
    browser({});
    expect(chosen(HLS, WEBM, MP4)).toBe(WEBM.id);
  });

  it("plays a body with no format as a last resort", () => {
    browser({});
    expect(chosen(NO_FORMAT, MP4)).toBe(MP4.id);
    expect(chosen(HLS, NO_FORMAT)).toBe(NO_FORMAT.id);
  });

  it("plays nothing when none can be played", () => {
    browser({});
    expect(chosen(HLS)).toBeUndefined();
    browser({ safari: true });
    expect(chosen(DASH)).toBeUndefined();
  });
});
