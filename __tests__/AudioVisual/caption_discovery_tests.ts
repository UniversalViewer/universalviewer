import { Canvas, Manifest, parseManifest } from "manifesto.js";
import {
  captionLabel,
  captionTrack,
  getCanvasCaptions,
  isCaptionFormat,
  resolveCaptionSource,
  targetTime,
} from "../../src/content-handlers/iiif/modules/uv-captions-module/Captions";

const CANVAS = "https://example.org/canvas";
const VIDEO = {
  id: "https://example.org/video.mp4",
  type: "Video",
  format: "video/mp4",
};
const vtt = (name: string, extra: object = {}) => ({
  id: `https://example.org/${name}.vtt`,
  type: "Text",
  format: "text/vtt",
  ...extra,
});

// A canvas parsed by manifesto from a one-canvas IIIF v3 manifest.
const canvasWith = ({
  rendering,
  painting = [VIDEO],
  paintingTarget = CANVAS,
  annotations,
}: {
  rendering?: object[];
  painting?: object[];
  paintingTarget?: any;
  annotations?: object[];
}): Canvas =>
  (
    parseManifest({
      "@context": "http://iiif.io/api/presentation/3/context.json",
      id: "https://example.org/manifest",
      type: "Manifest",
      label: { en: ["Test"] },
      items: [
        {
          id: CANVAS,
          type: "Canvas",
          duration: 60,
          rendering,
          items: [
            {
              id: `${CANVAS}/page`,
              type: "AnnotationPage",
              items: [
                {
                  id: `${CANVAS}/painting`,
                  type: "Annotation",
                  motivation: "painting",
                  body: painting,
                  target: paintingTarget,
                },
              ],
            },
          ],
          annotations,
        },
      ],
    }) as Manifest
  )
    .getSequences()[0]
    .getCanvases()[0];

const supplementing = (body: object, target: any = CANVAS, extra = {}) => ({
  id: `${CANVAS}/captions`,
  type: "AnnotationPage",
  items: [
    {
      id: `${CANVAS}/captions/annotation`,
      type: "Annotation",
      motivation: "supplementing",
      body,
      target,
      ...extra,
    },
  ],
});

// Responds to fetch() as a server would: caption files are readable at their
// own URL unless listed in `unreadable`, `redirects` maps a URL to where it
// ends up, and `pages` serves annotation pages as JSON.
const mockFetch = ({
  unreadable = [] as string[],
  redirects = {} as { [url: string]: string },
  pages = {} as { [url: string]: object },
} = {}) =>
  jest.spyOn(globalThis, "fetch").mockImplementation((async (url: string) => {
    if (unreadable.includes(url)) {
      throw new TypeError("Failed to fetch");
    }
    return {
      ok: true,
      url: redirects[url] || url,
      json: async () => pages[url],
    };
  }) as any);

afterEach(() => {
  jest.restoreAllMocks();
});

describe("isCaptionFormat", () => {
  it("accepts WebVTT and SRT, in any case", () => {
    expect(isCaptionFormat("text/vtt")).toBe(true);
    expect(isCaptionFormat("text/srt")).toBe(true);
    expect(isCaptionFormat("TEXT/VTT")).toBe(true);
  });

  it("rejects other formats and missing ones", () => {
    expect(isCaptionFormat("text/plain")).toBe(false);
    expect(isCaptionFormat("video/mp4")).toBe(false);
    expect(isCaptionFormat(undefined)).toBe(false);
  });
});

describe("captionLabel", () => {
  const label = {
    en: ["Welsh captions"],
    cy: ["Capsiynau Cymraeg"],
    "cy-GB": ["Capsiynau Cymraeg (Prydain)"],
  };

  it("prefers an exact match for the locale", () => {
    expect(captionLabel(label, "cy-GB")).toBe("Capsiynau Cymraeg (Prydain)");
  });

  it("falls back to the locale's base language", () => {
    expect(
      captionLabel({ en: ["Welsh captions"], cy: ["Capsiynau"] }, "cy-GB")
    ).toBe("Capsiynau");
  });

  it("falls back to the first value when nothing matches", () => {
    expect(captionLabel(label, "sv-SE")).toBe("Welsh captions");
    expect(captionLabel(label, "")).toBe("Welsh captions");
  });

  it("prefers values without a language when no language matches, as IIIF requires", () => {
    expect(captionLabel({ none: ["Captions"], cy: ["Capsiynau"] }, "sv")).toBe(
      "Captions"
    );
  });

  it("reads plain strings", () => {
    expect(captionLabel("English captions", "cy")).toBe("English captions");
  });

  it("returns undefined for a malformed label, rather than failing", () => {
    expect(captionLabel({ en: "Not an array" }, "en")).toBeUndefined();
  });

  it("reads IIIF v2 language values", () => {
    const v2 = [
      { "@value": "English captions", "@language": "en" },
      { "@value": "Capsiynau Cymraeg", "@language": "cy" },
    ];
    expect(captionLabel(v2, "cy-GB")).toBe("Capsiynau Cymraeg");
    expect(captionLabel(v2, "fr")).toBe("English captions");
    expect(captionLabel(["Captions"], "cy")).toBe("Captions");
  });

  it("returns undefined when there is no label", () => {
    expect(captionLabel(undefined, "en")).toBeUndefined();
    expect(captionLabel("", "en")).toBeUndefined();
    expect(captionLabel({}, "en")).toBeUndefined();
  });
});

describe("targetTime", () => {
  it("covers the whole canvas for a target without a temporal fragment", () => {
    const whole = { start: 0, end: undefined };
    expect(targetTime(CANVAS)).toEqual(whole);
    expect(targetTime(`${CANVAS}#xywh=0,0,10,10`)).toEqual(whole);
    expect(targetTime(undefined)).toEqual(whole);
  });

  it("reads a #t fragment on a target URL", () => {
    expect(targetTime(`${CANVAS}#t=5.5,10`)).toEqual({ start: 5.5, end: 10 });
    expect(targetTime(`${CANVAS}#t=npt:3,4`)).toEqual({ start: 3, end: 4 });
    expect(targetTime(`${CANVAS}#xywh=0,0,10,10&t=2,3`)).toEqual({
      start: 2,
      end: 3,
    });
  });

  it("reads a #t fragment with either end left open", () => {
    expect(targetTime(`${CANVAS}#t=5`)).toEqual({ start: 5, end: undefined });
    expect(targetTime(`${CANVAS}#t=,10`)).toEqual({ start: 0, end: 10 });
  });

  it("reads a target object's id, FragmentSelector or PointSelector", () => {
    expect(targetTime({ id: `${CANVAS}#t=8,9` })).toEqual({ start: 8, end: 9 });
    expect(
      targetTime({
        type: "SpecificResource",
        source: CANVAS,
        selector: { type: "FragmentSelector", value: "t=7,9" },
      })
    ).toEqual({ start: 7, end: 9 });
    expect(
      targetTime({
        type: "SpecificResource",
        source: CANVAS,
        selector: [{ type: "PointSelector", t: 4 }],
      })
    ).toEqual({ start: 4, end: undefined });
  });
});

describe("captionTrack", () => {
  it("reads the id, a localised label, the language and the start", () => {
    expect(
      captionTrack(
        vtt("cy", {
          label: { en: ["Welsh"], cy: ["Cymraeg"] },
          language: "cy",
        }),
        "cy-GB",
        { start: 12, end: 42 }
      )
    ).toEqual({
      id: "https://example.org/cy.vtt",
      label: "Cymraeg",
      language: "cy",
      start: 12,
      end: 42,
    });
  });

  it("falls back to the format as the label, and to the whole canvas", () => {
    expect(captionTrack(vtt("plain"), "en")).toEqual({
      id: "https://example.org/plain.vtt",
      label: "text/vtt",
      language: undefined,
      start: 0,
      end: undefined,
    });
  });

  it("reads IIIF v2 ids and the first of several languages", () => {
    expect(
      captionTrack(
        { "@id": "https://example.org/v2.vtt", language: ["cy", "en"] },
        "en"
      )
    ).toMatchObject({ id: "https://example.org/v2.vtt", language: "cy" });
  });
});

describe("resolveCaptionSource", () => {
  it("follows a readable redirect to its destination", async () => {
    mockFetch({
      redirects: {
        "https://example.org/a.vtt": "https://cdn.example.org/a.vtt",
      },
    });
    await expect(
      resolveCaptionSource("https://example.org/a.vtt")
    ).resolves.toBe("https://cdn.example.org/a.vtt");
  });

  it("retries an unreadable http URL over https", async () => {
    mockFetch({ unreadable: ["http://example.org/a.vtt"] });
    await expect(
      resolveCaptionSource("http://example.org/a.vtt")
    ).resolves.toBe("https://example.org/a.vtt");
  });

  it("keeps an unreadable URL, with a warning", async () => {
    mockFetch({ unreadable: ["https://example.org/a.vtt"] });
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    await expect(
      resolveCaptionSource("https://example.org/a.vtt")
    ).resolves.toBe("https://example.org/a.vtt");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("a.vtt"));
  });
});

describe("getCanvasCaptions", () => {
  beforeEach(() => {
    mockFetch();
  });

  it("finds no captions on a canvas without any", async () => {
    await expect(getCanvasCaptions(canvasWith({}), "en")).resolves.toEqual([]);
  });

  it("finds captions supplied as a canvas rendering, ignoring other renderings", async () => {
    const canvas = canvasWith({
      rendering: [
        vtt("rendering", { label: { en: ["Rendered"] }, language: "en" }),
        { id: "https://example.org/t.txt", type: "Text", format: "text/plain" },
        VIDEO,
      ],
    });

    await expect(getCanvasCaptions(canvas, "en")).resolves.toEqual([
      {
        id: "https://example.org/rendering.vtt",
        label: "Rendered",
        language: "en",
        start: 0,
      },
    ]);
  });

  it("finds captions alongside the media in the painting annotation", async () => {
    const canvas = canvasWith({
      painting: [VIDEO, vtt("painting", { language: "en" })],
      paintingTarget: `${CANVAS}#t=10,70`,
    });

    await expect(getCanvasCaptions(canvas, "en")).resolves.toEqual([
      {
        id: "https://example.org/painting.vtt",
        label: "text/vtt",
        language: "en",
        start: 10,
        end: 70,
      },
    ]);
  });

  it("finds captions in an inline supplementing annotation (recipe 0219)", async () => {
    const canvas = canvasWith({
      annotations: [supplementing(vtt("supplementing"), `${CANVAS}#t=3`)],
    });

    await expect(getCanvasCaptions(canvas, "en")).resolves.toEqual([
      expect.objectContaining({
        id: "https://example.org/supplementing.vtt",
        start: 3,
      }),
    ]);
  });

  it("finds each caption file in a Choice (recipe 0074)", async () => {
    const canvas = canvasWith({
      annotations: [
        supplementing({
          type: "Choice",
          items: [
            vtt("en", { label: { en: ["English"] }, language: "en" }),
            vtt("cy", { label: { cy: ["Cymraeg"] }, language: "cy" }),
          ],
        }),
      ],
    });

    const tracks = await getCanvasCaptions(canvas, "cy-GB");
    // Both are found; for a Welsh user, the Welsh one is listed first.
    expect(tracks.map(({ label, language }) => ({ label, language }))).toEqual([
      { label: "Cymraeg", language: "cy" },
      { label: "English", language: "en" },
    ]);
  });

  it("accepts several motivations, but ignores annotations not supplementing the canvas", async () => {
    const canvas = canvasWith({
      annotations: [
        supplementing(vtt("both"), CANVAS, {
          motivation: ["commenting", "supplementing"],
        }),
        supplementing(vtt("comment"), CANVAS, { motivation: "commenting" }),
      ],
    });

    const tracks = await getCanvasCaptions(canvas, "en");
    expect(tracks.map((track) => track.id)).toEqual([
      "https://example.org/both.vtt",
    ]);
  });

  it("fetches an annotation page referenced by id", async () => {
    const page = "https://example.org/page.json";
    jest.restoreAllMocks();
    mockFetch({ pages: { [page]: supplementing(vtt("external")) } });

    const canvas = canvasWith({
      annotations: [{ id: page, type: "AnnotationPage" }],
    });

    const tracks = await getCanvasCaptions(canvas, "en");
    expect(tracks.map((track) => track.id)).toEqual([
      "https://example.org/external.vtt",
    ]);
  });

  it("keeps the other captions when an annotation page can't be fetched", async () => {
    const page = "https://example.org/unreadable-page.json";
    jest.restoreAllMocks();
    mockFetch({ unreadable: [page] });
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    const canvas = canvasWith({
      painting: [VIDEO, vtt("painting")],
      annotations: [{ id: page, type: "AnnotationPage" }],
    });

    const tracks = await getCanvasCaptions(canvas, "en");
    expect(tracks.map((track) => track.id)).toEqual([
      "https://example.org/painting.vtt",
    ]);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(page));
  });

  it("lists a caption file declared in several places once, from its first source", async () => {
    const canvas = canvasWith({
      rendering: [vtt("shared", { label: "From the rendering" })],
      painting: [VIDEO, vtt("shared", { label: "From the painting" })],
      annotations: [supplementing(vtt("shared", { label: "Supplementing" }))],
    });

    await expect(getCanvasCaptions(canvas, "en")).resolves.toEqual([
      expect.objectContaining({
        id: "https://example.org/shared.vtt",
        label: "From the rendering",
      }),
    ]);
  });

  it("lists captions from every source in order: renderings, painting, supplementing", async () => {
    const canvas = canvasWith({
      rendering: [vtt("rendering")],
      painting: [VIDEO, vtt("painting")],
      annotations: [supplementing(vtt("supplementing"))],
    });

    const tracks = await getCanvasCaptions(canvas, "en");
    expect(tracks.map((track) => track.id)).toEqual([
      "https://example.org/rendering.vtt",
      "https://example.org/painting.vtt",
      "https://example.org/supplementing.vtt",
    ]);
  });

  it("lists the user's language first, then the rest alphabetically", async () => {
    const canvas = canvasWith({
      annotations: [
        supplementing({
          type: "Choice",
          items: [
            vtt("en", { label: "English captions", language: "en" }),
            vtt("sv", { label: "Swedish captions", language: "sv" }),
            vtt("cy", { label: "Welsh captions", language: "cy" }),
            vtt("fr", { label: "French captions", language: "fr" }),
          ],
        }),
      ],
    });

    const tracks = await getCanvasCaptions(canvas, "cy-GB");
    expect(tracks.map((track) => track.label)).toEqual([
      "Welsh captions",
      "English captions",
      "French captions",
      "Swedish captions",
    ]);
  });

  it("resolves each caption URL to one the browser can read", async () => {
    jest.restoreAllMocks();
    mockFetch({
      redirects: {
        "https://example.org/moved.vtt": "https://cdn.example.org/moved.vtt",
      },
    });

    const canvas = canvasWith({ painting: [VIDEO, vtt("moved")] });

    const tracks = await getCanvasCaptions(canvas, "en");
    expect(tracks.map((track) => track.id)).toEqual([
      "https://cdn.example.org/moved.vtt",
    ]);
  });
});
