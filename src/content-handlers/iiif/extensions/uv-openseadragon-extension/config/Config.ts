import {
  AdjustImageDialogue,
  BaseConfig,
  CenterPanelContent,
  CenterPanelOptions,
  DialogueContent,
  DialogueOptions,
  DownloadDialogueContent,
  DownloadDialogueOptions,
  FooterPanelContent,
  FooterPanelOptions,
  HeaderPanelContent,
  HeaderPanelOptions,
  ModuleConfig,
  SettingsDialogueContent,
  SettingsDialogueOptions,
  ShareDialogueContent,
  ShareDialogueOptions,
} from "@/content-handlers/iiif/BaseConfig";

import { ContentLeftPanel } from "../../config/ContentLeftPanel";

type MultiSelectDialogueOptions = DialogueOptions & {
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

type MultiSelectDialogueContent = DialogueContent & {
  select: string;
  selectAll: string;
  title: string;
};

export type MultiSelectDialogue = ModuleConfig & {
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

type PagingHeaderPanel = ModuleConfig & {
  options: PagingHeaderPanelOptions;
  content: PagingHeaderPanelContent;
};

type OpenSeadragonCenterPanelOptions = CenterPanelOptions & {
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
  /** Determines if annotation is enabled */
  doubleClickAnnotationEnabled: boolean;
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
  /** Determines if adjust image control is shown */
  showAdjustImageControl: boolean;
  /** Ratio of visibility */
  visibilityRatio: number;
  /** The maximum amount of time in milliseconds an image operation can take */
  tileTimeout: number;
  /** Whether to zoom in to first annotation on load */
  zoomToInitialAnnotation: boolean;
};

type OpenSeadragonCenterPanelContent = CenterPanelContent & {
  attribution: string;
  goHome: string;
  imageUnavailable: string;
  nextImage: string;
  previousImage: string;
  rotateRight: string;
  zoomIn: string;
  zoomOut: string;
  adjustImage: string;
};

type OpenSeadragonCenterPanel = ModuleConfig & {
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

type SearchFooterPanel = ModuleConfig & {
  options: SearchFooterPanelOptions;
  content: SearchFooterPanelContent;
};

type MobileFooterPanelOptions = FooterPanelOptions & {
  helpEnabled: boolean;
  helpUrl: string;
};

type MobileFooterPanelContent = FooterPanelContent & {
  rotateRight: string;
  moreInfo: string;
  openLeftPanel: string;
  closeLeftPanel: string;
  openRightPanel: string;
  closeRightPanel: string;
  zoomIn: string;
  zoomOut: string;
  help: string;
};

type MobileFooterPanel = ModuleConfig & {
  options: MobileFooterPanelOptions;
  content: MobileFooterPanelContent;
};

type OSDDownloadDialogueOptions = DownloadDialogueOptions & {
  /** Size of the confined image */
  confinedImageSize: number;
  /** Determines if download of current view is enabled */
  downloadCurrentViewEnabled: boolean;
  /** Determines if download of whole image in high resolution is enabled */
  downloadWholeImageHighResEnabled: boolean;
  /** Determines if download of whole image in low resolution is enabled */
  downloadWholeImageLowResEnabled: boolean;
  /** Maximum width of the image */
  maxImageWidth: number;
  /** Determines if selection is enabled */
  selectionEnabled: boolean;
};

type OSDDownloadDialogueContent = DownloadDialogueContent & {
  allPages: string;
  currentViewAsJpg: string;
  currentViewAsJpgExplanation: string;
  download: string;
  downloadSelection: string;
  downloadSelectionExplanation: string;
  editSettings: string;
  entireDocument: string;
  entireFileAsOriginal: string;
  entireFileAsOriginalWithFormat: string;
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

type OSDDownloadDialogue = ModuleConfig & {
  options: OSDDownloadDialogueOptions;
  content: OSDDownloadDialogueContent;
};

type OSDShareDialogueOptions = ShareDialogueOptions & {};

type OSDShareDialogueContent = ShareDialogueContent & {};

type OSDShareDialogue = ModuleConfig & {
  options: OSDShareDialogueOptions;
  content: OSDShareDialogueContent;
};

type OSDSettingsDialogueOptions = SettingsDialogueOptions & {};

type OSDSettingsDialogueContent = SettingsDialogueContent & {};

type OSDSettingsDialogue = ModuleConfig & {
  options: OSDSettingsDialogueOptions;
  content: OSDSettingsDialogueContent;
};

type Modules = {
  contentLeftPanel: ContentLeftPanel;
  downloadDialogue: OSDDownloadDialogue;
  multiSelectDialogue: MultiSelectDialogue;
  pagingHeaderPanel: PagingHeaderPanel;
  openSeadragonCenterPanel: OpenSeadragonCenterPanel;
  searchFooterPanel: SearchFooterPanel;
  mobileFooterPanel: MobileFooterPanel;
  shareDialogue: OSDShareDialogue;
  settingsDialogue: OSDSettingsDialogue;
  adjustImageDialogue: AdjustImageDialogue;
};

export type Config = BaseConfig & {
  modules: Modules;
};
