import { EPubData } from "./content-handlers/iiif/EPubData";
import { IIIFData } from "./content-handlers/iiif/IIIFData";
import { YouTubeData } from "./content-handlers/youtube/YouTubeData";
import { ILocale } from "./content-handlers/iiif/modules/uv-shared-module/ILocale";
export interface IUVData extends IIIFData, EPubData, YouTubeData {
    config?: any;
    debug?: boolean;
    embedded?: boolean;
    isReload?: boolean;
    locales?: ILocale[];
    target?: string;
}
