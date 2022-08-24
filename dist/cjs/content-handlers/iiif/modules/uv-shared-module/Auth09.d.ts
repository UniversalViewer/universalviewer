import { IAccessToken, IExternalResource } from "manifesto.js";
import { StorageType } from "@edsilv/utils";
export declare class Auth09 {
    static publish: (event: string, args?: any) => void;
    static loadExternalResources(resourcesToLoad: IExternalResource[], storageStrategy: string): Promise<IExternalResource[]>;
    static clickThrough(resource: IExternalResource): Promise<void>;
    static restricted(resource: IExternalResource): Promise<void>;
    static login(resource: IExternalResource): Promise<void>;
    static getAccessToken(resource: IExternalResource, rejectOnError: boolean): Promise<IAccessToken>;
    static storeAccessToken(resource: IExternalResource, token: IAccessToken, storageStrategy: StorageType): Promise<void>;
    static getStoredAccessToken(resource: IExternalResource, storageStrategy: StorageType): Promise<IAccessToken>;
    static handleExternalResourceResponse(resource: IExternalResource): Promise<any>;
    static handleDegraded(resource: IExternalResource): void;
}
