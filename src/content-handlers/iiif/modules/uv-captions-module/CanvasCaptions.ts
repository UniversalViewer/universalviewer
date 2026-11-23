const $ = require("jquery");
import { Canvas } from "manifesto.js";
import {
  CaptionsContent,
  CaptionsControl,
  CaptionsEvents,
} from "./CaptionsControl";
import {
  CaptionStyle,
  captionStyleId,
  captionStyles,
  chooseCaptionStyle,
} from "./CaptionStyle";
import { CaptionLibrary, LoadedCaptionTrack } from "./CaptionLibrary";
import { chooseCaptionTrack } from "./CaptionTrack";
import { getActiveCueText } from "./Cues";

const NO_TRACKS: LoadedCaptionTrack[] = [];

// Whether captions that target part of a canvas apply at a time on it.
const appliesAt = ({ start = 0, end }: LoadedCaptionTrack, time: number) =>
  time >= start && (end === undefined || time < end);

// A point in time on a particular canvas.
export interface CanvasPosition {
  canvasId: string;
  // Seconds from the start of the canvas.
  time: number;
}

// The captions for a player. As playback moves, it offers the tracks of the
// canvas being played in the captions menu, and shows the cue of the chosen
// track for the current time in the overlay. The player places `$control` in
// its controls and `$overlay` over its media, and reports where playback is
// with update(). A player may play several canvases in turn (e.g. the AV
// component's timeline), each with its own tracks.
export class CanvasCaptions {
  public readonly $control: JQuery = $('<div class="captions"></div>');
  public readonly $overlay: JQuery = $('<div class="captions-overlay"></div>');
  private _control: CaptionsControl;
  private _tracks = new Map<string, LoadedCaptionTrack[]>();
  private _position: CanvasPosition | null = null;
  private _offered: LoadedCaptionTrack[] | null = null;
  private _shown: LoadedCaptionTrack | undefined;
  private _styles: CaptionStyle[];
  private _style: CaptionStyle | undefined;
  private _text: string | null = null;

  // `content` gives the control's (localised) text, and `configuredStyles`
  // the colours to offer (the player's captionStyles option), if not UV's.
  constructor(
    private _library: CaptionLibrary,
    content: CaptionsContent,
    configuredStyles?: unknown
  ) {
    this._styles = captionStyles(configuredStyles, content);
    this._control = new CaptionsControl({
      target: this.$control[0] as HTMLElement,
      data: { content },
    });
    this.$overlay.hide();

    this._control.on(
      CaptionsEvents.CAPTION_TRACK_CHOSEN,
      (id: string | null) => {
        this._library.chosen =
          (this._offered || NO_TRACKS).find((track) => track.id === id) || null;
        this.update(this._position);
      },
      false
    );

    this._control.on(
      CaptionsEvents.CAPTION_STYLE_CHOSEN,
      (styleId: string) => {
        this._library.styleId = styleId;
        this.update(this._position);
      },
      false
    );
  }

  // Loads the caption tracks of the canvases this instance plays.
  public async load(canvases: Canvas[]): Promise<void> {
    await Promise.all(
      canvases.map(async (canvas) => {
        this._tracks.set(canvas.id, await this._library.tracksFor(canvas));
      })
    );
    this.update(this._position);
  }

  // Shows the captions for a point in playback, or none without one.
  public update(position: CanvasPosition | null): void {
    this._position = position;

    const tracks =
      (position && this._tracks.get(position.canvasId)) || NO_TRACKS;
    const shown = chooseCaptionTrack(tracks, this._library.chosen);
    const style = chooseCaptionStyle(this._styles, this._library.styleId);

    if (
      tracks !== this._offered ||
      shown !== this._shown ||
      style !== this._style
    ) {
      this._offered = tracks;
      this._shown = shown;
      this._style = style;
      this._control.set({
        tracks,
        shownId: shown ? shown.id : null,
        styles: this._styles,
        styleId: captionStyleId(style),
      });
      this.$overlay.css({
        backgroundColor: style.background,
        color: style.color,
      });
    }

    const text =
      shown && position && appliesAt(shown, position.time)
        ? getActiveCueText(shown.cues, position.time - (shown.start || 0))
        : null;

    if (text !== this._text) {
      this._text = text;
      this.$overlay.text(text || "").toggle(!!text);
    }
  }

  public destroy(): void {
    this._control.destroy();
  }
}
