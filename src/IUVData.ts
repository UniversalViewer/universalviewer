import {ILocale} from "./ILocale";

export interface IUVData {
    assetRoot: string | null;
    canvasIndex: number;
    collectionIndex: number;
    config: any;
    configUri: string | null;
    domain: string | null;
    embedDomain: string | null;
    embedScriptUri: string | null;
    iiifResourceUri: string;
    isHomeDomain: boolean;
    isLightbox: boolean;
    isOnlyInstance: boolean;
    isReload: boolean;
    locales: ILocale[];
    manifestIndex: number;
    sequenceIndex: number;
}