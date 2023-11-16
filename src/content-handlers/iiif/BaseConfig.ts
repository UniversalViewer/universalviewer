import { StorageType } from "@edsilv/utils";
export { StorageType } from "@edsilv/utils";

export type MetricType = string | "sm" | "md" | "lg" | "xl";

export class Metric {
  constructor(public type: MetricType, public minWidth: number) {}
}

export type Options = {
  /** Determines if the focus can be stolen */
  allowStealFocus?: boolean;

  /** Version of the authentication API */
  authAPIVersion: number;

  /** Height of the bookmark thumbnail */
  bookmarkThumbHeight?: number;

  /** Width of the bookmark thumbnail */
  bookmarkThumbWidth?: number;

  /** Determines if drop is enabled */
  dropEnabled?: boolean;

  /** Determines if the footer panel is enabled */
  footerPanelEnabled?: boolean;

  /** Determines if the header panel is enabled */
  headerPanelEnabled?: boolean;

  /** Determines if the left panel is enabled */
  leftPanelEnabled?: boolean;

  /** Determines if locales are limited */
  limitLocales?: boolean;

  /** Determines if double click annotation is enabled */
  doubleClickAnnotationEnabled?: boolean;

  /** Metrics array */
  metrics: Metric[];

  /** MIME type for multi selection */
  multiSelectionMimeType: string;

  /** Determines if the navigator is enabled */
  navigatorEnabled?: boolean;

  /** Template for opening */
  openTemplate: string;

  /** Determines if full screen is overridden */
  overrideFullScreen: boolean;

  /** Determines if paging is enabled */
  pagingEnabled?: boolean;

  /** Determines if paging option is enabled */
  pagingOptionEnabled?: boolean;

  /** Determines if access control is pessimistic */
  pessimisticAccessControl?: boolean;

  /** Determines if viewport is preserved */
  preserveViewport?: boolean;

  /** Determines if the right panel is enabled */
  rightPanelEnabled?: boolean;

  /** Determines if user settings are saved */
  saveUserSettings?: boolean;

  /** Determines if click to zoom is enabled */
  clickToZoomEnabled?: boolean;

  /** Determines if search within is enabled */
  searchWithinEnabled?: boolean;

  /** Determines if seealso content is enabled */
  seeAlsoEnabled?: boolean;

  /** Determines if terms of use are enabled */
  termsOfUseEnabled: boolean;

  /** Theme string */
  theme: string;

  /** Storage for tokens */
  tokenStorage: string | StorageType;

  /** Determines if arrow keys can be used to navigate */
  useArrowKeysToNavigate?: boolean;

  /** Determines if zoom to search result is enabled */
  zoomToSearchResultEnabled?: boolean;

  /** Determines if zoom to bounds is enabled */
  zoomToBoundsEnabled?: boolean;
};

type Locale = {
  name: string;
  label: string;
};

export type ModuleOptions = {};

export type ModuleContent = {};

export type ModuleConfig = {
  options: ModuleOptions;
  content: ModuleContent;
};

export type Localisation = {
  label: string;
  locales: Locale[];
};

export type HeaderPanelOptions = {
  /** Determines if center options are enabled */
  centerOptionsEnabled: boolean;
  /** Determines if locale toggle is enabled */
  localeToggleEnabled: boolean;
  /** Determines if settings button is enabled */
  settingsButtonEnabled: boolean;
};

export type HeaderPanelContent = {
  close: string;
  settings: string;
};

type HeaderPanel = ModuleConfig & {
  options: HeaderPanelOptions;
  content: HeaderPanelContent;
};

export type LeftPanelOptions = {
  /** Determines if expand full is enabled */
  expandFullEnabled: boolean;
  /** Determines the duration of the panel expand/collapse animation */
  panelAnimationDuration: number;
  /** Width of the collapsed panel */
  panelCollapsedWidth: number;
  /** Width of the expanded panel */
  panelExpandedWidth: number;
  /** Determines if the panel is open */
  panelOpen: boolean;
};

export type LeftPanelContent = {
  collapse: string;
  collapseFull: string;
  expand: string;
  expandFull: string;
};

type LeftPanel = ModuleConfig & {
  options: LeftPanelOptions;
  content: LeftPanelContent;
};

export type FooterPanelOptions = {
  /** Determines if bookmarking is enabled */
  bookmarkEnabled: boolean;
  /** Determines if downloading is enabled */
  downloadEnabled: boolean;
  /** Determines if embedding is enabled */
  embedEnabled: boolean;
  /** Determines if feedback is enabled */
  feedbackEnabled: boolean;
  /** Determines if fullscreen mode is enabled */
  fullscreenEnabled: boolean;
  /** Determines if buttons are minimised */
  minimiseButtons: boolean;
  /** Determines if more information is enabled */
  moreInfoEnabled: boolean;
  /** Determines if opening is enabled */
  openEnabled: boolean;
  /** Determines if printing is enabled */
  printEnabled: boolean;
  /** Determines if sharing is enabled */
  shareEnabled: boolean;
};

export type FooterPanelContent = {
  bookmark: string;
  download: string;
  embed: string;
  exitFullScreen: string;
  feedback: string;
  fullScreen: string;
  moreInfo: string;
  open: string;
  share: string;
};

type FooterPanel = ModuleConfig & {
  options: FooterPanelOptions;
  content: FooterPanelContent;
};

type DialogueOptions = {
  topCloseButtonEnabled: boolean;
};

type DialogueContent = {
  close: string;
};

type Dialogue = ModuleConfig & {
  options?: DialogueOptions;
  content: DialogueContent;
};

/**
 * Type for Download Dialogue Options
 */
type DownloadDialogueOptions = {
  /** Size of the confined image */
  confinedImageSize: number;
  /** Percentage of the current view that is disabled */
  currentViewDisabledPercentage: number;
  /** Determines if download of current view is enabled */
  downloadCurrentViewEnabled: boolean;
  /** Determines if download of whole image in high resolution is enabled */
  downloadWholeImageHighResEnabled: boolean;
  /** Determines if download of whole image in low resolution is enabled */
  downloadWholeImageLowResEnabled: boolean;
  /** Maximum width of the image */
  maxImageWidth: number;
  /** Determines if explanatory text for options is enabled */
  optionsExplanatoryTextEnabled: boolean;
  /** Determines if selection is enabled */
  selectionEnabled: boolean;
};

type DownloadDialogueContent = {
  allPages: string;
  currentViewAsJpg: string;
  currentViewAsJpgExplanation: string;
  download: string;
  downloadSelection: string;
  downloadSelectionExplanation: string;
  editSettings: string;
  entireDocument: string;
  entireFileAsOriginal: string;
  individualPages: string;
  noneAvailable: string;
  pagingNote: string;
  preview: string;
  selection: string;
  termsOfUse: string;
  title: string;
  wholeImageHighRes: string;
  wholeImageHighResExplanation: string;
  wholeImageLowResAsJpg: string;
  wholeImageLowResAsJpgExplanation: string;
  wholeImagesHighRes: string;
  wholeImagesHighResExplanation: string;
};

type DownloadDialogue = {
  options?: DownloadDialogueOptions;
  content: DownloadDialogueContent;
};

/**
 * Type for Generic Dialogue Options
 */
type GenericDialogueOptions = {};

type GenericDialogueContent = {
  emptyValue: string;
  invalidNumber: string;
  noMatches: string;
  ok: string;
  pageNotFound: string;
  refresh: string;
};

type GenericDialogue = {
  options?: GenericDialogueOptions;
  content: GenericDialogueContent;
};

type MoreInfoRightPanelOptions = {
  /** Order in which canvases are displayed */
  canvasDisplayOrder: string;
  /** Canvases to exclude from display */
  canvasExclude: string;
  /** Determines if copying to clipboard is enabled */
  copyToClipboardEnabled: boolean;
  /** Order in which manifests are displayed */
  manifestDisplayOrder: string;
  /** Manifests to exclude from display */
  manifestExclude: string;
  /** Duration of the panel animation */
  panelAnimationDuration: number;
  /** Width of the collapsed panel */
  panelCollapsedWidth: number;
  /** Width of the expanded panel */
  panelExpandedWidth: number;
  /** Determines if the panel is open */
  panelOpen: boolean;
  /** Language codes for right-to-left languages */
  rtlLanguageCodes: string;
  /** Determines if all languages should be shown */
  showAllLanguages: boolean;
  /** Limit for the text */
  textLimit: number;
  /** Type of the text limit */
  textLimitType: string;
};

type MoreInfoRightPanelContent = {
  attribution: string;
  canvasHeader: string;
  collapse: string;
  collapseFull: string;
  copiedToClipboard: string;
  copyToClipboard: string;
  description: string;
  expand: string;
  expandFull: string;
  holdingText: string;
  less: string;
  license: string;
  logo: string;
  manifestHeader: string;
  more: string;
  noData: string;
  page: string;
  rangeHeader: string;
  title: string;
};

type MoreInfoRightPanel = {
  options: MoreInfoRightPanelOptions;
  content: MoreInfoRightPanelContent;
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

export type BaseConfig = {
  uri?: string;
  options: Options;
  modules: {
    dialogue: Dialogue;
    downloadDialogue: DownloadDialogue;
    footerPanel: FooterPanel;
    genericDialogue: GenericDialogue;
    headerPanel: HeaderPanel;
    leftPanel: LeftPanel;
    moreInfoRightPanel: MoreInfoRightPanel;
  };
  localisation: Localisation;
  content: Content;
};
