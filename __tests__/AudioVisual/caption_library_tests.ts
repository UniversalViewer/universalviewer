import { Canvas } from "manifesto.js";
import {
  CaptionLibrary,
  CaptionProvider,
} from "../../src/content-handlers/iiif/modules/uv-captions-module/CaptionLibrary";

const canvas = (id: string) => ({ id }) as Canvas;
const VTT = "WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nHello";

// Serves caption files by URL: a string is the file's text, a number an HTTP
// error status, and a missing URL can't be fetched at all.
const serve = (files: { [url: string]: string | number }) =>
  jest.spyOn(globalThis, "fetch").mockImplementation((async (url: string) => {
    const file = files[url];
    if (file === undefined) {
      throw new TypeError("Failed to fetch");
    }
    return typeof file === "number"
      ? { ok: false, status: file, statusText: "Not Found" }
      : { ok: true, text: async () => file };
  }) as any);

// Libraries here don't remember choices, unless given storage of their own.
const libraryWith = (provider?: CaptionProvider) =>
  new CaptionLibrary(() => provider, memoryStorage());

// A stand-in for localStorage.
const memoryStorage = (initial: { [key: string]: string } = {}) => {
  const items = { ...initial };
  return {
    getItem: (key: string) => (key in items ? items[key] : null),
    setItem: (key: string, value: string) => {
      items[key] = value;
    },
  };
};

beforeEach(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("CaptionLibrary", () => {
  it("starts with no caption track or colours chosen", () => {
    const library = libraryWith();
    expect(library.chosen).toBeNull();
    expect(library.styleId).toBeNull();
  });

  it("starts with the captions and colours the user chose last time", () => {
    const storage = memoryStorage({
      "uv-caption-preferences": JSON.stringify({
        chosen: { id: "cy.srt", language: "cy" },
        styleId: "#5c0f2e on #d4f5e4",
      }),
    });
    const library = new CaptionLibrary(() => undefined, storage);

    expect(library.chosen).toEqual({ id: "cy.srt", language: "cy" });
    expect(library.styleId).toBe("#5c0f2e on #d4f5e4");
  });

  it("remembers the captions and colours chosen", () => {
    const storage = memoryStorage();
    const library = new CaptionLibrary(() => undefined, storage);

    library.chosen = { id: "cy.srt", language: "cy", label: "Welsh captions" };
    library.styleId = "#3b1453 on #fff6c2";

    expect(new CaptionLibrary(() => undefined, storage).chosen).toEqual({
      id: "cy.srt",
      language: "cy",
    });
    expect(new CaptionLibrary(() => undefined, storage).styleId).toBe(
      "#3b1453 on #fff6c2"
    );

    library.chosen = null;
    expect(new CaptionLibrary(() => undefined, storage).chosen).toBeNull();
  });

  it("loads a canvas' tracks with their cues", async () => {
    serve({ "en.vtt": VTT });
    const library = libraryWith(async () => [
      { id: "en.vtt", label: "English", language: "en", start: 5 },
    ]);

    await expect(library.tracksFor(canvas("c1"))).resolves.toEqual([
      {
        id: "en.vtt",
        label: "English",
        language: "en",
        start: 5,
        cues: [{ start: 0, end: 2, text: "Hello" }],
      },
    ]);
  });

  it("finds and loads each canvas' tracks once", async () => {
    const fetch = serve({ "en.vtt": VTT });
    const provider = jest.fn(async () => [{ id: "en.vtt" }]);
    const library = libraryWith(provider);

    const first = await library.tracksFor(canvas("c1"));
    const again = await library.tracksFor(canvas("c1"));
    await library.tracksFor(canvas("c2"));

    expect(again).toBe(first);
    expect(provider).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("omits tracks that can't be fetched, fail, or have no cues", async () => {
    serve({ "en.vtt": VTT, "missing.vtt": 404, "empty.vtt": "WEBVTT\n" });
    const library = libraryWith(async () => [
      { id: "unreachable.vtt" },
      { id: "missing.vtt" },
      { id: "empty.vtt" },
      { id: "en.vtt" },
    ]);

    const tracks = await library.tracksFor(canvas("c1"));
    expect(tracks.map((track) => track.id)).toEqual(["en.vtt"]);
    expect(console.warn).toHaveBeenCalledTimes(3);
  });

  it("finds no tracks without a caption provider", async () => {
    await expect(libraryWith().tracksFor(canvas("c1"))).resolves.toEqual([]);
  });

  it("finds no tracks when the caption provider fails", async () => {
    const library = libraryWith(async () => {
      throw new Error("Annotation page unavailable");
    });

    await expect(library.tracksFor(canvas("c1"))).resolves.toEqual([]);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("Annotation page unavailable")
    );
  });
});
