import { EPubData } from "./content-handlers/iiif/EPubData";
import { IIIFData } from "./content-handlers/iiif/IIIFData";
import { YouTubeData } from "./content-handlers/youtube/YouTubeData";
import { ILocale } from "./content-handlers/iiif/modules/uv-shared-module/ILocale";
import { BaseConfig } from "./content-handlers/iiif/BaseConfig";

export interface IUVData<T extends BaseConfig>
  extends IIIFData,
    EPubData,
    YouTubeData {
  config?: T; // do not pass this on initialisation, internal use only
  debug?: boolean;
  embedded?: boolean;
  isReload?: boolean;
  locales?: ILocale[];
  target?: string;
}
