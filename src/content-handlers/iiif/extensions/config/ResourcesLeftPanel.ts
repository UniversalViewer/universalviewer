import { ModuleConfig } from "../../BaseConfig";
import { ExpandPanelContent, ExpandPanelOptions } from "./ExpandPanel";

type ResourcesLeftPanelOptions = ExpandPanelOptions & {
  /** Determines if full expansion is enabled */
  expandFullEnabled: boolean;
  /** Duration of the panel animation */
  panelAnimationDuration: number;
  /** Width of the panel when collapsed */
  panelCollapsedWidth: number;
  /** Width of the panel when expanded */
  panelExpandedWidth: number;
  /** Determines if the panel is open */
  panelOpen: boolean;
  /** Width of the thumbnail in two column view */
  twoColThumbWidth: number;
  /** Height of the thumbnail in two column view */
  twoColThumbHeight: number;
  /** Width of the thumbnail in one column view */
  oneColThumbWidth: number;
  /** Height of the thumbnail in one column view */
  oneColThumbHeight: number;
};

type ResourcesLeftPanelContent = ExpandPanelContent & {
  title: string;
};

export type ResourcesLeftPanel = ModuleConfig & {
  options: ResourcesLeftPanelOptions;
  content: ResourcesLeftPanelContent;
};
