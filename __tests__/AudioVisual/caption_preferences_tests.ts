import {
  loadCaptionPreferences,
  saveCaptionPreferences,
} from "../../src/content-handlers/iiif/modules/uv-captions-module/CaptionPreferences";

// A stand-in for localStorage.
const memoryStorage = (initial: { [key: string]: string } = {}) => {
  const items = { ...initial };
  return {
    getItem: (key: string) => (key in items ? items[key] : null),
    setItem: (key: string, value: string) => {
      items[key] = value;
    },
    items,
  };
};

// Storage the browser has blocked, as in some private browsing modes.
const blockedStorage = {
  getItem: () => {
    throw new Error("SecurityError");
  },
  setItem: () => {
    throw new Error("SecurityError");
  },
};

// No colours chosen: the player shows its first.
const DEFAULTS = { chosen: null, styleId: null };

describe("caption preferences", () => {
  it("are the defaults (captions off, no colours chosen) when nothing is stored", () => {
    expect(loadCaptionPreferences(memoryStorage())).toEqual(DEFAULTS);
  });

  it("are the defaults when storage is unavailable or blocked", () => {
    expect(loadCaptionPreferences(undefined)).toEqual(DEFAULTS);
    expect(loadCaptionPreferences(blockedStorage)).toEqual(DEFAULTS);
  });

  it("are the defaults when what's stored can't be read", () => {
    const storage = memoryStorage({ "uv-caption-preferences": "{not json" });
    expect(loadCaptionPreferences(storage)).toEqual(DEFAULTS);
  });

  it("are remembered: the chosen captions and colours", () => {
    const storage = memoryStorage();
    const preferences = {
      chosen: { id: "https://example.org/cy.srt", language: "cy" },
      styleId: "#0b2a5b on #ffe5d0",
    };

    saveCaptionPreferences(preferences, storage);

    expect(loadCaptionPreferences(storage)).toEqual(preferences);
  });

  it("remember captions turned off", () => {
    const storage = memoryStorage();
    saveCaptionPreferences(
      {
        chosen: { id: "https://example.org/cy.srt", language: "cy" },
        styleId: "#000000 on #ffffff",
      },
      storage
    );
    saveCaptionPreferences(
      { chosen: null, styleId: "#000000 on #ffffff" },
      storage
    );

    expect(loadCaptionPreferences(storage)).toEqual({
      chosen: null,
      styleId: "#000000 on #ffffff",
    });
  });

  it("keep only a track's id and language", () => {
    const storage = memoryStorage();
    saveCaptionPreferences(
      {
        chosen: {
          id: "https://example.org/cy.srt",
          language: "cy",
          label: "Welsh captions",
          start: 30,
        },
        styleId: "#ffffff on #000000",
      },
      storage
    );

    expect(loadCaptionPreferences(storage).chosen).toEqual({
      id: "https://example.org/cy.srt",
      language: "cy",
    });
  });

  it("ignore stored colours that aren't an id", () => {
    const storage = memoryStorage({
      "uv-caption-preferences": JSON.stringify({ styleId: 7 }),
    });
    expect(loadCaptionPreferences(storage).styleId).toBeNull();
  });

  it("ignore a stored track that isn't one", () => {
    const storage = memoryStorage({
      "uv-caption-preferences": JSON.stringify({ chosen: { language: 7 } }),
    });
    expect(loadCaptionPreferences(storage).chosen).toBeNull();
  });

  it("can't be saved to blocked storage, without failing", () => {
    expect(() =>
      saveCaptionPreferences(
        { chosen: null, styleId: "#ffffff on #000000" },
        blockedStorage
      )
    ).not.toThrow();
  });
});
