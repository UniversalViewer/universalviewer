import {
  BaseConfig,
  HeaderPanelContent,
  HeaderPanelOptions,
  Options,
} from "@/content-handlers/iiif/BaseConfig";

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

type Modules = {
  pdfHeaderPanel: PDFHeaderPanel;
};

type PDFOptions = Options & {
  /** Determines if PDF.js should be used for PDF rendering */
  usePdfJs?: boolean;
};

export type Config = BaseConfig & {
  options: PDFOptions;
  modules: Modules;
};
