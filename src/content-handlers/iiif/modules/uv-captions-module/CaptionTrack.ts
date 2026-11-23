import { Utils } from "manifesto.js";

// A WebVTT or SRT caption file for a canvas.
export interface CaptionTrack {
  // The caption file's URL.
  id: string;
  // A label for the track, already in the user's language where possible.
  label?: string;
  // The language of the captions (BCP 47), e.g. "cy".
  language?: string;
  // The part of the canvas the captions apply to, when they target only part
  // of it (#t=start,end): seconds from the start of the canvas. The caption
  // file's 0:00 falls at `start`, which defaults to 0; without an `end` they
  // apply to the rest of the canvas.
  start?: number;
  end?: number;
}

// The track to show for the caption track the user chose: that very track,
// otherwise one in the same language (exactly, then by base language, so a
// "cy" track for a "cy-GB" choice, as manifesto matches locales). None when
// captions are off or nothing matches, so a canvas without the chosen
// language shows no captions while the choice is kept for canvases that
// have it.
export function chooseCaptionTrack<T extends CaptionTrack>(
  tracks: T[],
  chosen: CaptionTrack | null
): T | undefined {
  if (!chosen) {
    return undefined;
  }

  const same = tracks.find((track) => track.id === chosen.id);
  if (same || !chosen.language) {
    return same;
  }

  const baseLanguage = Utils.getInexactLocale(chosen.language);
  return (
    tracks.find((track) => track.language === chosen.language) ||
    tracks.find(
      (track) =>
        !!track.language &&
        Utils.getInexactLocale(track.language) === baseLanguage
    )
  );
}

// The tracks in the order the captions menu offers them: those in the user's
// language first (exact matches for their locale, then the same base
// language, each in the manifest's order), then the rest alphabetically by
// label, as sorted in the user's locale. Tracks with the same label keep the
// manifest's order.
export function orderCaptionTracks<T extends CaptionTrack>(
  tracks: T[],
  locale: string
): T[] {
  const baseLanguage = locale ? Utils.getInexactLocale(locale) : "";
  const exact = tracks.filter((track) => !!locale && track.language === locale);
  const base = tracks.filter(
    (track) =>
      !exact.includes(track) &&
      !!baseLanguage &&
      !!track.language &&
      Utils.getInexactLocale(track.language) === baseLanguage
  );
  const collator = new Intl.Collator(locale || undefined, {
    sensitivity: "base",
  });
  const rest = tracks
    .filter((track) => !exact.includes(track) && !base.includes(track))
    .sort((a, b) => collator.compare(a.label || "", b.label || ""));

  return [...exact, ...base, ...rest];
}
