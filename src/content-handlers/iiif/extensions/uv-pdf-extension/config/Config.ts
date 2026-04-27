import {
  BaseConfig,
  CenterPanelContent,
  CenterPanelOptions,
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

type PDFCenterPanelOptions = CenterPanelOptions & {
  /** Minimum scale value when using PDF.js */
  minScale: number;
  /** Maximum scale value when using PDF.js */
  maxScale: number;
  /** Determines if PDF.js should be used for PDF rendering */
  usePdfJs: boolean;
};

type PDFCenterPanelContent = CenterPanelContent & {
  next: string;
  previous: string;
  zoomIn: string;
  zoomOut: string;
};

type PDFCenterPanel = {
  options: PDFCenterPanelOptions;
  content: PDFCenterPanelContent;
};

type PDFHeaderPanelOptions = HeaderPanelOptions & {};

type PDFHeaderPanelContent = HeaderPanelContent & {
  emptyValue: string;
  first: string;
  go: string;
  last: string;
  next: string;
  of: string;
  pageSearchLabel: string;
  previous: string;
};

type PDFHeaderPanel = {
  options: PDFHeaderPanelOptions;
  content: PDFHeaderPanelContent;
};

type PDFDownloadDialogueOptions = DownloadDialogueOptions & {};

type PDFDownloadDialogueContent = DownloadDialogueContent & {};

type PDFDownloadDialogue = ModuleConfig & {
  options: PDFDownloadDialogueOptions;
  content: PDFDownloadDialogueContent;
};

type PDFShareDialogueOptions = ShareDialogueOptions & {};

type PDFShareDialogueContent = ShareDialogueContent & {};

type PDFShareDialogue = ModuleConfig & {
  options: PDFShareDialogueOptions;
  content: PDFShareDialogueContent;
};

type PDFSettingsDialogueOptions = SettingsDialogueOptions & {};

type PDFSettingsDialogueContent = SettingsDialogueContent & {};

type PDFSettingsDialogue = {
  options: PDFSettingsDialogueOptions;
  content: PDFSettingsDialogueContent;
};

type MobileFooterPanelOptions = FooterPanelOptions & {};

type MobileFooterPanelContent = FooterPanelContent & {
  rotateRight: string;
  moreInfo: string;
  openLeftPanel: string;
  closeLeftPanel: string;
  openRightPanel: string;
  closeRightPanel: string;
  zoomIn: string;
  zoomOut: string;
};

type MobileFooterPanel = ModuleConfig & {
  options: MobileFooterPanelOptions;
  content: MobileFooterPanelContent;
};

type Modules = {
  pdfCenterPanel: PDFCenterPanel;
  pdfHeaderPanel: PDFHeaderPanel;
  settingsDialogue: PDFSettingsDialogue;
  downloadDialogue: PDFDownloadDialogue;
  shareDialogue: PDFShareDialogue;
  mobileFooterPanel: MobileFooterPanel;
};

export type Config = BaseConfig & {
  modules: Modules;
};
