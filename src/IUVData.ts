import { ILocale } from "./ILocale";

export interface IUVData {
  annotations?: string;
  assetsDir?: string;
  canvasIndex?: number;
  collectionIndex?: number;
  config?: any; // do not pass this on initialisation, internal use only
  configUri?: string;
  embedded?: boolean;
  isReload?: boolean;
  locales?: ILocale[];
  manifestIndex?: number;
  manifestUri?: string;
  readOnlyDataProvider?: boolean;
  rangeId?: string;
  target?: string;
}
