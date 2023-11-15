import { StorageType } from "@edsilv/utils";

export { StorageType } from "@edsilv/utils";

export type MetricType = "sm" | "md" | "lg" | "xl";

export class Metric {
  constructor(public type: MetricType, public minWidth: number) {}
}

export type Options = {
  /** Determines if the focus can be stolen */
  allowStealFocus: boolean;

  /** Version of the authentication API */
  authAPIVersion: number;

  /** Height of the bookmark thumbnail */
  bookmarkThumbHeight: number;

  /** Width of the bookmark thumbnail */
  bookmarkThumbWidth: number;

  /** Determines if drop is enabled */
  dropEnabled: boolean;

  /** Determines if the footer panel is enabled */
  footerPanelEnabled: boolean;

  /** Determines if the header panel is enabled */
  headerPanelEnabled: boolean;

  /** Determines if the left panel is enabled */
  leftPanelEnabled: boolean;

  /** Determines if locales are limited */
  limitLocales: boolean;

  /** Determines if double click annotation is enabled */
  doubleClickAnnotationEnabled: boolean;

  /** Metrics array */
  metrics: Metric[];

  /** MIME type for multi selection */
  multiSelectionMimeType: string;

  /** Determines if the navigator is enabled */
  navigatorEnabled: boolean;

  /** Template for opening */
  openTemplate: string;

  /** Determines if full screen is overridden */
  overrideFullScreen: boolean;

  /** Determines if paging is enabled */
  pagingEnabled: boolean;

  /** Determines if paging option is enabled */
  pagingOptionEnabled: boolean;

  /** Determines if access control is pessimistic */
  pessimisticAccessControl: boolean;

  /** Determines if viewport is preserved */
  preserveViewport: boolean;

  /** Determines if the right panel is enabled */
  rightPanelEnabled: boolean;

  /** Determines if user settings are saved */
  saveUserSettings: boolean;

  /** Determines if click to zoom is enabled */
  clickToZoomEnabled: boolean;

  /** Determines if search within is enabled */
  searchWithinEnabled: boolean;

  /** Determines if seealso content is enabled */
  seeAlsoEnabled: boolean;

  /** Determines if terms of use are enabled */
  termsOfUseEnabled: boolean;

  /** Theme string */
  theme: string;

  /** Storage for tokens */
  tokenStorage: StorageType;

  /** Determines if arrow keys can be used to navigate */
  useArrowKeysToNavigate: boolean;

  /** Determines if zoom to search result is enabled */
  zoomToSearchResultEnabled: boolean;

  /** Determines if zoom to bounds is enabled */
  zoomToBoundsEnabled: boolean;
};

type Locale = {
  name: string;
  label: string;
};

export type Localisation = {
  label: string;
  locales: Locale[];
};

export type Content = {
  authCORSError: string;
  authorisationFailedMessage: string;
  canvasIndexOutOfRange: string;
  fallbackDegradedLabel: string;
  fallbackDegradedMessage: string;
  forbiddenResourceMessage: string;
  mediaViewer: string;
  skipToDownload: string;
  termsOfUse: string;
};

export default interface BaseConfig {
  options: Options;
  localisation: Localisation;
  content: Content;
}
