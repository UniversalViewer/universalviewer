import { Canvas } from "manifesto.js";
import { CaptionTrack } from "./CaptionTrack";
import { CaptionCue, parseCaptionCues } from "./Cues";
import {
  loadCaptionPreferences,
  PreferenceStorage,
  saveCaptionPreferences,
} from "./CaptionPreferences";

// Finds the caption tracks for a canvas.
export type CaptionProvider = (canvas: Canvas) => Promise<CaptionTrack[]>;

export interface LoadedCaptionTrack extends CaptionTrack {
  cues: CaptionCue[];
}

async function loadTrack(
  track: CaptionTrack
): Promise<LoadedCaptionTrack | null> {
  try {
    const response = await fetch(track.id);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const cues = parseCaptionCues(await response.text());
    if (cues.length) {
      return { ...track, cues };
    }
    console.warn(`Captions at ${track.id} have no cues; omitting the track.`);
  } catch (error) {
    console.warn(
      `Captions at ${track.id} could not be read (${error}); omitting the track.`
    );
  }
  return null;
}

// The captions shared by a player's views of its canvases: each canvas'
// tracks, loaded once, and what the user chose (a caption track, or null for
// none, and the colours), which carries over to other canvases and ranges and
// is remembered for their next visit.
export class CaptionLibrary {
  private _tracks = new Map<string, Promise<LoadedCaptionTrack[]>>();
  private _chosen: CaptionTrack | null;
  private _styleId: string | null;

  // `storage` is where choices are remembered: localStorage by default.
  constructor(
    private _getProvider: () => CaptionProvider | undefined,
    private _storage?: PreferenceStorage
  ) {
    const { chosen, styleId } = loadCaptionPreferences(_storage);
    this._chosen = chosen;
    this._styleId = styleId;
  }

  public get chosen(): CaptionTrack | null {
    return this._chosen;
  }

  public set chosen(track: CaptionTrack | null) {
    this._chosen = track;
    this._remember();
  }

  // The colours chosen (by captionStyleId), or null for none.
  public get styleId(): string | null {
    return this._styleId;
  }

  public set styleId(id: string) {
    this._styleId = id;
    this._remember();
  }

  private _remember(): void {
    saveCaptionPreferences(
      { chosen: this._chosen, styleId: this._styleId },
      this._storage
    );
  }

  // A canvas' caption tracks, with their cues. Tracks that can't be read or
  // have no cues are left out, so they're never offered.
  public tracksFor(canvas: Canvas): Promise<LoadedCaptionTrack[]> {
    let tracks = this._tracks.get(canvas.id);
    if (!tracks) {
      tracks = this._load(canvas);
      this._tracks.set(canvas.id, tracks);
    }
    return tracks;
  }

  private async _load(canvas: Canvas): Promise<LoadedCaptionTrack[]> {
    const provider = this._getProvider();
    if (!provider) {
      return [];
    }

    try {
      const loaded = await Promise.all((await provider(canvas)).map(loadTrack));
      return loaded.filter((track): track is LoadedCaptionTrack => !!track);
    } catch (error) {
      console.warn(`Captions for ${canvas.id} could not be found (${error}).`);
      return [];
    }
  }
}
