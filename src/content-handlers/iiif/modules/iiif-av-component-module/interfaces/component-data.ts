import { Helper } from "@iiif/manifold";
import { IAVComponentContent } from "./component-content";
import { CaptionProvider } from "../../uv-captions-module/CaptionLibrary";
import { CaptionStyle } from "../../uv-captions-module/CaptionStyle";

export interface IAVComponentData {
  [key: string]: any;
  adaptiveAuthEnabled?: boolean;
  autoPlay?: boolean;
  autoSelectRange?: boolean;
  canvasId?: string;
  constrainNavigationToRange?: boolean;
  content?: IAVComponentContent;
  defaultAspectRatio?: number;
  doubleClickMS?: number;
  // Finds the caption tracks for a canvas; without it, no captions are shown.
  getCaptions?: CaptionProvider;
  // The colours offered for captions, in place of UV's own.
  captionStyles?: CaptionStyle[];
  helper?: Helper;
  halveAtWidth?: number;
  limitToRange?: boolean;
  autoAdvanceRanges?: boolean;
  posterImageRatio?: number;
  // Whether the image accompanying audio starts expanded to fill the player.
  posterImageExpanded?: boolean;
  rangeId?: string;
  virtualCanvasEnabled?: boolean;
  waveformBarSpacing?: number;
  waveformBarWidth?: number;
  waveformColor?: string;
  enableFastForward?: boolean;
  enableFastRewind?: boolean;
}
