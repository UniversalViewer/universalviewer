import { StorageType } from "@edsilv/utils";
import {
  ExpandPanel,
  ExpandPanelContent,
  ExpandPanelOptions,
} from "./extensions/config/ExpandPanel";
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

type LeftPanel = ExpandPanel & {};

export type CenterPanelOptions = {
  titleEnabled: boolean;
  subtitleEnabled: boolean;
  mostSpecificRequiredStatement: boolean;
  requiredStatementEnabled: boolean;
};

export type CenterPanelContent = {
  attribution: string;
};

type CenterPanel = ModuleConfig & {
  options: CenterPanelOptions;
  content: CenterPanelContent;
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

export type DialogueOptions = {
  topCloseButtonEnabled: boolean;
};

export type DialogueContent = {
  close: string;
};

type Dialogue = ModuleConfig & {
  options?: DialogueOptions;
  content: DialogueContent;
};

export type SettingsDialogueOptions = DialogueOptions & {};

export type SettingsDialogueContent = DialogueContent & {
  locale: string;
  navigatorEnabled: string;
  clickToZoomEnabled: string;
  pagingEnabled: string;
  reducedMotion: string;
  preserveViewport: string;
  title: string;
  website: string;
};

type SettingsDialogue = ModuleConfig & {
  options: SettingsDialogueOptions;
  content: SettingsDialogueContent;
};

export type ShareDialogueOptions = DialogueOptions & {
  /** Determines if embed is enabled */
  embedEnabled: boolean;
  /** Template for embedding */
  embedTemplate: string;
  /** Determines if instructions are enabled */
  instructionsEnabled: boolean;
  /** Determines if sharing is enabled */
  shareEnabled: boolean;
  /** Determines if sharing frame is enabled */
  shareFrameEnabled: boolean;
  /** Determines if sharing manifests is enabled */
  shareManifestsEnabled: boolean;
};

export type ShareDialogueContent = DialogueContent & {
  customSize: string;
  embed: string;
  embedInstructions: string;
  height: string;
  iiif: string;
  share: string;
  shareInstructions: string;
  size: string;
  width: string;
  shareUrl: string;
};

type ShareDialogue = ModuleConfig & {
  options: ShareDialogueOptions;
  content: ShareDialogueContent;
};

type AuthDialogueOptions = DialogueOptions & {};

type AuthDialogueContent = DialogueContent & {
  cancel: string;
  confirm: string;
};

type AuthDialogue = ModuleConfig & {
  options: AuthDialogueOptions;
  content: AuthDialogueContent;
};

export type DownloadDialogueOptions = DialogueOptions & {};

export type DownloadDialogueContent = DialogueContent & {
  download: string;
  entireDocument: string;
  entireFileAsOriginal: string;
  entireFileAsOriginalWithFormat: string;
  noneAvailable: string;
  title: string;
};

export type DownloadDialogue = ModuleConfig & {
  options: DownloadDialogueOptions;
  content: DownloadDialogueContent;
};

type ClickThroughDialogueOptions = DialogueOptions & {};

type ClickThroughDialogueContent = DialogueContent & {
  viewTerms: string;
};

type ClickThroughDialogue = ModuleConfig & {
  options: ClickThroughDialogueOptions;
  content: ClickThroughDialogueContent;
};

type LoginDialogueOptions = DialogueOptions & {};

type LoginDialogueContent = DialogueContent & {
  login: string;
  logout: string;
  cancel: string;
};

type LoginDialogue = ModuleConfig & {
  options: LoginDialogueOptions;
  content: LoginDialogueContent;
};

type RestrictedDialogueOptions = DialogueOptions & {};

type RestrictedDialogueContent = DialogueContent & {
  cancel: string;
};

type RestrictedDialogue = ModuleConfig & {
  options: RestrictedDialogueOptions;
  content: RestrictedDialogueContent;
};

type GenericDialogueOptions = DialogueOptions & {};

type GenericDialogueContent = DialogueContent & {
  emptyValue: string;
  invalidNumber: string;
  noMatches: string;
  ok: string;
  pageNotFound: string;
  refresh: string;
};

type GenericDialogue = ModuleConfig & {
  options: GenericDialogueOptions;
  content: GenericDialogueContent;
};

type HelpDialogueOptions = DialogueOptions & {};

type HelpDialogueContent = DialogueContent & {
  text: string;
  title: string;
};

type HelpDialogue = ModuleConfig & {
  options: HelpDialogueOptions;
  content: HelpDialogueContent;
};

type MoreInfoRightPanelOptions = DialogueOptions &
  ExpandPanelOptions & {
    /** Order in which canvases are displayed */
    canvasDisplayOrder: string;
    /** Canvases to exclude from display */
    canvasExclude: string;
    /** Determines if copying to clipboard is enabled */
    copyToClipboardEnabled: boolean;
    /** Determines if download is enabled */
    limitToRange: boolean;
    /** Order in which manifests are displayed */
    manifestDisplayOrder: string;
    /** Manifests to exclude from display */
    manifestExclude: string;
    /** Language codes for right-to-left languages */
    rtlLanguageCodes: string;
    /** Determines if all languages should be shown */
    showAllLanguages: boolean;
    /** Limit for the text */
    textLimit: number;
    /** Type of the text limit */
    textLimitType: string;
  };

type MoreInfoRightPanelContent = DialogueContent &
  ExpandPanelContent & {
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

export type MoreInfoRightPanel = ModuleConfig & {
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
    authDialogue: AuthDialogue;
    centerPanel: CenterPanel;
    clickThroughDialogue: ClickThroughDialogue;
    dialogue: Dialogue;
    downloadDialogue: DownloadDialogue;
    footerPanel: FooterPanel;
    genericDialogue: GenericDialogue;
    headerPanel: HeaderPanel;
    helpDialogue: HelpDialogue;
    leftPanel: LeftPanel;
    loginDialogue: LoginDialogue;
    moreInfoRightPanel: MoreInfoRightPanel;
    restrictedDialogue: RestrictedDialogue;
    settingsDialogue: SettingsDialogue;
    shareDialogue: ShareDialogue;
  };
  localisation: Localisation;
  content: Content;
};
