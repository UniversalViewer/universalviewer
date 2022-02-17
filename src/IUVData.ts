import { EPubData } from "./content-handlers/iiif/EPubData";
import { IIIFData } from "./content-handlers/iiif/IIIFData";
import { YouTubeData } from "./content-handlers/youtube/YouTubeData";
import { ILocale } from "./ILocale";

export interface IUVData extends IIIFData, EPubData, YouTubeData {
  config?: any; // do not pass this on initialisation, internal use only
  debug?: boolean;
  embedded?: boolean;
  isReload?: boolean;
  locales?: ILocale[];
  target?: string;
}
