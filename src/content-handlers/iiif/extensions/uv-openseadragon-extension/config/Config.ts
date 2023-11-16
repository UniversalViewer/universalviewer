import {
  BaseConfig,
  FooterPanelContent,
  FooterPanelOptions,
  HeaderPanelContent,
  HeaderPanelOptions,
  LeftPanelContent,
  LeftPanelOptions,
} from "@/content-handlers/iiif/BaseConfig";

/**
 * Type for Thumbs Cache Invalidation
 */
type ThumbsCacheInvalidation = {
  /** Determines if cache invalidation is enabled */
  enabled: boolean;
  /** Type of the parameter for cache invalidation */
  paramType: string;
};

type ContentLeftPanelOptions = LeftPanelOptions & {
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
  /** Number of items to default to tree view */
  defaultToTreeIfGreaterThan: number;
  /** Number of characters to elide at */
  elideCount: number;
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

type ContentLeftPanelContent = LeftPanelContent & {
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

type ContentLeftPanel = {
  options: ContentLeftPanelOptions;
  content: ContentLeftPanelContent;
};

type HelpDialogueContent = {
  text: string;
  title: string;
};

type HelpDialogue = {
  content: HelpDialogueContent;
};

type MultiSelectDialogueOptions = {
  /** Determines if chunked resizing is enabled for gallery thumbnails */
  galleryThumbChunkedResizingEnabled: boolean;
  /** Threshold for chunked resizing of gallery thumbnails */
  galleryThumbChunkedResizingThreshold: number;
  /** Height of the gallery thumbnail */
  galleryThumbHeight: number;
  /** Padding for loading gallery thumbnails */
  galleryThumbLoadPadding: number;
  /** Width of the gallery thumbnail */
  galleryThumbWidth: number;
  /** Determines if page mode is enabled */
  pageModeEnabled: boolean;
};

type MultiSelectDialogueContent = {
  select: string;
  selectAll: string;
  title: string;
};

type MultiSelectDialogue = {
  options: MultiSelectDialogueOptions;
  content: MultiSelectDialogueContent;
};

type PagingHeaderPanelOptions = HeaderPanelOptions & {
  /** Determines if autocomplete for words is allowed */
  autocompleteAllowWords: boolean;
  /** Determines if autocomplete box is enabled */
  autoCompleteBoxEnabled: boolean;
  /** Determines if gallery button is enabled */
  galleryButtonEnabled: boolean;
  /** Determines if help is enabled */
  helpEnabled: boolean;
  /** Determines if image selection box is enabled */
  imageSelectionBoxEnabled: boolean;
  /** Determines if mode options is enabled */
  modeOptionsEnabled: boolean;
  /** Determines if page mode is enabled */
  pageModeEnabled: boolean;
  /** Determines if paging toggle is enabled */
  pagingToggleEnabled: boolean;
};

type PagingHeaderPanelContent = HeaderPanelContent & {
  emptyValue: string;
  first: string;
  firstImage: string;
  firstPage: string;
  folio: string;
  gallery: string;
  go: string;
  help: string;
  image: string;
  last: string;
  lastImage: string;
  lastPage: string;
  next: string;
  nextImage: string;
  nextPage: string;
  of: string;
  oneUp: string;
  page: string;
  pageSearchLabel: string;
  previous: string;
  previousImage: string;
  previousPage: string;
  twoUp: string;
};

type PagingHeaderPanel = {
  options: PagingHeaderPanelOptions;
  content: PagingHeaderPanelContent;
};

type OpenSeadragonCenterPanelOptions = {
  /** Duration of the animation */
  animationTime: number;
  /** Determines if controls are hidden automatically */
  autoHideControls: boolean;
  /** Determines if required statement is enabled */
  requiredStatementEnabled: boolean;
  /** Time taken to blend images */
  blendTime: number;
  /** Determines if panning is constrained */
  constrainDuringPan: boolean;
  /** Time after which controls fade after inactivity */
  controlsFadeAfterInactive: number;
  /** Delay before controls start to fade */
  controlsFadeDelay: number;
  /** Duration of controls fade */
  controlsFadeLength: number;
  /** Default zoom level */
  defaultZoomLevel: number;
  /** Determines if rendering is immediate */
  immediateRender: boolean;
  /** Maximum pixel ratio for zoom */
  maxZoomPixelRatio: number;
  /** Position of the navigator */
  navigatorPosition: string;
  /** Gap between pages */
  pageGap: number;
  /** Determines if home control is shown */
  showHomeControl: boolean;
  /** Number of attributions to trim */
  trimAttributionCount: number;
  /** Ratio of visibility */
  visibilityRatio: number;
};

type OpenSeadragonCenterPanelContent = {
  attribution: string;
  goHome: string;
  imageUnavailable: string;
  next: string;
  previous: string;
  rotateRight: string;
  zoomIn: string;
  zoomOut: string;
};

type OpenSeadragonCenterPanel = {
  options: OpenSeadragonCenterPanelOptions;
  content: OpenSeadragonCenterPanelContent;
};

type SearchFooterPanelOptions = FooterPanelOptions & {
  /** Determines if autocomplete for words is allowed */
  autocompleteAllowWords: boolean;
  /** Number of terms to elide in details */
  elideDetailsTermsCount: number;
  /** Number of terms to elide in results */
  elideResultsTermsCount: number;
  /** Determines if image mode is forced */
  forceImageMode: boolean;
  /** Determines if page mode is enabled */
  pageModeEnabled: boolean;
  /** Determines if position marker is enabled */
  positionMarkerEnabled: boolean;
};

type SearchFooterPanelContent = FooterPanelContent & {
  clearSearch: string;
  defaultLabel: string;
  displaying: string;
  enterKeyword: string;
  image: string;
  imageCaps: string;
  instanceFound: string;
  instancesFound: string;
  nextResult: string;
  page: string;
  pageCaps: string;
  previousResult: string;
  print: string;
  resultFoundFor: string;
  resultsFoundFor: string;
  searchWithin: string;
};

type SearchFooterPanel = {
  options: SearchFooterPanelOptions;
  content: SearchFooterPanelContent;
};

type SettingsDialogueContent = {
  locale: string;
  navigatorEnabled: string;
  clickToZoomEnabled: string;
  pagingEnabled: string;
  reducedMotion: string;
  preserveViewport: string;
  title: string;
  website: string;
};

type SettingsDialogue = {
  content: SettingsDialogueContent;
};

type ShareDialogueOptions = {
  /** Template for embedding */
  embedTemplate: string;
  /** Determines if instructions are enabled */
  instructionsEnabled: boolean;
  /** Determines if sharing frame is enabled */
  shareFrameEnabled: boolean;
  /** Determines if sharing manifests is enabled */
  shareManifestsEnabled: boolean;
};

type ShareDialogueContent = {
  customSize: string;
  embed: string;
  embedInstructions: string;
  height: string;
  iiif: string;
  share: string;
  shareInstructions: string;
  size: string;
  width: string;
};

type ShareDialogue = {
  options: ShareDialogueOptions;
  content: ShareDialogueContent;
};

type AuthDialogueContent = {
  cancel: string;
  confirm: string;
};

type AuthDialogue = {
  content: AuthDialogueContent;
};

type ClickThroughDialogueContent = {
  viewTerms: string;
};

type ClickThroughDialogue = {
  content: ClickThroughDialogueContent;
};

type LoginDialogueContent = {
  login: string;
  logout: string;
  cancel: string;
};

type LoginDialogue = {
  content: LoginDialogueContent;
};

type MobileFooterPanelContent = {
  rotateRight: string;
  moreInfo: string;
  zoomIn: string;
  zoomOut: string;
};

type MobileFooterPanel = {
  content: MobileFooterPanelContent;
};

type RestrictedDialogueContent = {
  cancel: string;
};

type RestrictedDialogue = {
  content: RestrictedDialogueContent;
};

type Modules = {
  contentLeftPanel: ContentLeftPanel;
  helpDialogue: HelpDialogue;
  multiSelectDialogue: MultiSelectDialogue;
  pagingHeaderPanel: PagingHeaderPanel;
  openSeadragonCenterPanel: OpenSeadragonCenterPanel;
  searchFooterPanel: SearchFooterPanel;
  settingsDialogue: SettingsDialogue;
  shareDialogue: ShareDialogue;
  authDialogue: AuthDialogue;
  clickThroughDialogue: ClickThroughDialogue;
  loginDialogue: LoginDialogue;
  mobileFooterPanel: MobileFooterPanel;
  restrictedDialogue: RestrictedDialogue;
};

export type Config = BaseConfig & {
  modules: Modules;
};
