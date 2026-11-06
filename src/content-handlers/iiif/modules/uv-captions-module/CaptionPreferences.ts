import { CaptionTrack } from "./CaptionTrack";

// What the user chose, remembered in the browser for their next visit: the
// caption track (by id and language, so the same language is chosen on other
// canvases and manifests), or null for captions off, and the colours (by
// captionStyleId), or null for none chosen.
export interface CaptionPreferences {
  chosen: Pick<CaptionTrack, "id" | "language"> | null;
  styleId: string | null;
}

// The parts of localStorage used here.
export type PreferenceStorage = Pick<Storage, "getItem" | "setItem">;

const KEY = "uv-caption-preferences";

const DEFAULTS: CaptionPreferences = {
  chosen: null,
  styleId: null,
};

// localStorage, where the browser allows it; reading it can throw (e.g. when
// site data is blocked).
const browserStorage = (): PreferenceStorage | undefined => {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

// The remembered preferences, or the defaults (captions off, no colours
// chosen) for whatever can't be read.
export const loadCaptionPreferences = (
  storage: PreferenceStorage | undefined = browserStorage()
): CaptionPreferences => {
  try {
    const stored = JSON.parse((storage && storage.getItem(KEY)) || "{}");
    const chosen = stored.chosen;
    const isTrack =
      !!chosen &&
      typeof chosen.id === "string" &&
      (chosen.language === undefined || typeof chosen.language === "string");

    return {
      chosen: isTrack ? { id: chosen.id, language: chosen.language } : null,
      styleId: typeof stored.styleId === "string" ? stored.styleId : null,
    };
  } catch {
    return { ...DEFAULTS };
  }
};

// Remembers the preferences, where the browser allows it.
export const saveCaptionPreferences = (
  { chosen, styleId }: { chosen: CaptionTrack | null; styleId: string | null },
  storage: PreferenceStorage | undefined = browserStorage()
): void => {
  try {
    if (storage) {
      storage.setItem(
        KEY,
        JSON.stringify({
          chosen: chosen ? { id: chosen.id, language: chosen.language } : null,
          styleId,
        })
      );
    }
  } catch {
    // Not remembered; the choice still applies until the page is closed.
  }
};
