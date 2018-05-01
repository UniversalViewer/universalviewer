import {ILocale} from "./ILocale";

export interface IUVData {
    annotations: string | null;
    canvasIndex: number;
    collectionIndex: number;
    config: any; // do not pass this on initialisation, internal use only
    configUri: string | null;
    embedded: boolean;
    iiifResourceUri: string;
    isLightbox: boolean;
    isReload: boolean;
    locales: ILocale[];
    manifestIndex: number;
    rangeId: string | null;
    root: string | null;
    sequenceIndex: number;
}