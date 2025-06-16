import { ModuleConfig } from "../../BaseConfig";
import { ExpandPanelContent, ExpandPanelOptions } from "./ExpandPanel";

type ThumbsCacheInvalidation = {
  /** Determines if cache invalidation is enabled */
  enabled: boolean;
  /** Type of the parameter for cache invalidation */
  paramType: string;
};

type ContentLeftPanelOptions = ExpandPanelOptions & {
  /** Determines if tree should expand automatically */
  autoExpandTreeEnabled: boolean;
  /** Number of items to auto expand tree */
  autoExpandTreeIfFewerThan: number;
  /** Determines if branch nodes expand on click */
  branchNodesExpandOnClick: boolean;
  /** Determines if branch nodes are selectable */
  branchNodesSelectable: boolean;
  /** Determines if tree is the default view */
  defaultToTreeEnabled: boolean;
  /** Number of items to default to tree view (when defaultToTreeEnabled = true; defaults to 0) */
  defaultToTreeIfGreaterThan: number;
  /** Determines if collection should default to tree view (even if defaultToTreeEnabled = false) */
  defaultToTreeIfCollection: boolean;
  /** Threshold for gallery thumb chunked resizing */
  galleryThumbChunkedResizingThreshold: number;
  /** Height of the gallery thumbnail */
  galleryThumbHeight: number;
  /** Padding for gallery thumb load */
  galleryThumbLoadPadding: number;
  /** Width of the gallery thumbnail */
  galleryThumbWidth: number;
  /** Height of the one column thumbnail */
  oneColThumbHeight: number;
  /** Width of the one column thumbnail */
  oneColThumbWidth: number;
  /** Determines if page mode is enabled */
  pageModeEnabled: boolean;
  /** Order of the tabs */
  tabOrder: string;
  /** Configuration for thumbs cache invalidation */
  thumbsCacheInvalidation: ThumbsCacheInvalidation;
  /** Determines if thumbnails are enabled */
  thumbsEnabled: boolean;
  /** Extra height for thumbnails */
  thumbsExtraHeight: number;
  /** Duration for thumbnails image fade in */
  thumbsImageFadeInDuration: number;
  /** Load range for thumbnails */
  thumbsLoadRange: number;
  /** Determines if tree is enabled */
  treeEnabled: boolean;
  /** Height of the two column thumbnail */
  twoColThumbHeight: number;
  /** Width of the two column thumbnail */
  twoColThumbWidth: number;
};

type ContentLeftPanelContent = ExpandPanelContent & {
  date: string;
  index: string;
  manifestRanges: string;
  searchResult: string;
  searchResults: string;
  sortBy: string;
  thumbnails: string;
  title: string;
  volume: string;
};

export type ContentLeftPanel = ModuleConfig & {
  options: ContentLeftPanelOptions;
  content: ContentLeftPanelContent;
};
