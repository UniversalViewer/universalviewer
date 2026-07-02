import { Helper } from "@iiif/manifold";
import { IAVComponentContent } from "./component-content";

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
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
  helper?: Helper;
  halveAtWidth?: number;
  limitToRange?: boolean;
  autoAdvanceRanges?: boolean;
  posterImageRatio?: number;
  rangeId?: string;
  virtualCanvasEnabled?: boolean;
  waveformBarSpacing?: number;
  waveformBarWidth?: number;
  waveformColor?: string;
  enableFastForward?: boolean;
  enableFastRewind?: boolean;
}
