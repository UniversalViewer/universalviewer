import { ILocale } from "./ILocale";

export interface IUVData extends IIIFData, EPubData, YouTubeData {
  config?: any; // do not pass this on initialisation, internal use only
  debug?: boolean;
  embedded?: boolean;
  isReload?: boolean;
  locales?: ILocale[];
  target?: string;
}

export interface IIIFData {
  annotations?: string;
  canvasIndex?: number;
  collectionIndex?: number;
  manifest?: string;
  rotation?: number;
  manifestIndex?: number;
  rangeId?: string;
  xywh?: string;
}

export interface EPubData {
  cfi?: string;
}

export interface YouTubeData {
  videoId?: string;
}
