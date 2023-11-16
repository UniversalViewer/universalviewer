import { BaseConfig, Options } from "@/content-handlers/iiif/BaseConfig";

type Modules = {};

type PDFOptions = Options & {
  /** Determines if PDF.js should be used for PDF rendering */
  usePdfJs?: boolean;
};

export type Config = BaseConfig & {
  options: PDFOptions;
  modules: Modules;
};
