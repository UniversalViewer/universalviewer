import IAccessToken = require("../../modules/uv-shared-module/IAccessToken");
import IProvider = require("../../modules/uv-shared-module/IProvider");
import Resource = require("../../modules/uv-shared-module/Resource");
import SearchResult = require("./SearchResult");

interface ISeadragonProvider extends IProvider{
    getAutoCompleteService(): string;
    getAutoCompleteUri(): string;
    getConfinedImageUri(canvas: any, width: number, height?: number): string;
    getCroppedImageUri(asset: any, viewer: any, download?: boolean, relativeUri?: boolean): string;
    getEmbedScript(canvasIndex: number, zoom: string, width: number, height: number, rotation: number, embedTemplate: string): string;
    getImages(login: (loginService: string) => Promise<void>,
              getAccessToken: (tokenServiceUrl: string) => Promise<IAccessToken>,
              storeAccessToken: (resource: Resource, token: IAccessToken) => Promise<void>,
              getStoredAccessToken: (tokenService: string) => Promise<IAccessToken>,
              handleResourceResponse: (resource: Resource) => Promise<any>): Promise<Resource[]>;
    getImageUri(canvas: any): string;
    getSearchResultByCanvasIndex(canvasIndex: number): SearchResult;
    getSearchWithinService(): string;
    getSearchWithinServiceUri(): string;
    images: Resource[];
    isSearchWithinEnabled(): boolean;
    parseSearchWithinResults(results: any);
    searchResults: SearchResult[];
    searchWithin(terms: string, callback: (results: any) => void): void;
}

export = ISeadragonProvider;