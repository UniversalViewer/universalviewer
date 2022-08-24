import { IExternalResource, IAccessToken, IManifestoOptions, Service } from "manifesto.js";
import { StorageType } from "@edsilv/utils";
export declare class Auth1 {
    static messages: any;
    static storageStrategy: StorageType;
    static publish: (event: string, args?: any) => void;
    static loadExternalResources(resourcesToLoad: IExternalResource[], storageStrategy: StorageType, options: IManifestoOptions): Promise<IExternalResource[]>;
    static getCookieServiceUrl(service: Service): string;
    static openContentProviderInteraction(service: Service): Window | null;
    static getOrigin(url?: string): string;
    static userInteractedWithContentProvider(contentProviderWindow: Window): Promise<boolean>;
    static handleMovedTemporarily(resource: IExternalResource): Promise<void>;
    static showDegradedMessage(resource: IExternalResource): void;
    static storeAccessToken(resource: IExternalResource, token: IAccessToken): Promise<void>;
    static getStoredAccessToken(resource: IExternalResource): Promise<IAccessToken | null>;
    static getContentProviderInteraction(resource: IExternalResource, service: Service): Promise<Window | null>;
    static openTokenService(resource: IExternalResource, tokenService: Service): Promise<any>;
    static receiveToken(event: any): void;
    static showOutOfOptionsMessages(resource: IExternalResource, service: Service): void;
}
