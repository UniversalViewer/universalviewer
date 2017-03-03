import {ILocale} from "./ILocale";

export interface IUVData extends Manifold.IManifoldOptions {
    configUri: string | null;
    config: any;
    domain: string | null;
    embedDomain: string | null;
    embedScriptUri: string | null;
    isHomeDomain: boolean;
    isLightbox: boolean;
    isOnlyInstance: boolean;
    isReload: boolean;
    locales: ILocale[];
    paramMap: string[];
}