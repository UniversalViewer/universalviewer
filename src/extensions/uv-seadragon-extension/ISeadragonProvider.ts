import IProvider = require("../../modules/uv-shared-module/IProvider");
import Resource = require("../../modules/uv-shared-module/Resource");
import SearchResult = require("./SearchResult");

interface ISeadragonProvider extends IProvider{
    getAutoCompleteService(): Manifesto.IService;
    getAutoCompleteUri(): string;
    getConfinedImageUri(canvas: Manifesto.ICanvas, width: number, height?: number): string;
    getCroppedImageUri(canvas: Manifesto.ICanvas, viewer: any, download?: boolean, relativeUri?: boolean): string;
    getEmbedScript(canvasIndex: number, zoom: string, width: number, height: number, rotation: number, embedTemplate: string): string;
    getImages(clickThrough: (resource: Manifesto.IExternalResource) => void,
              login: (loginService: string) => Promise<void>,
              getAccessToken: (tokenServiceUrl: string) => Promise<Manifesto.IAccessToken>,
              storeAccessToken: (resource: Manifesto.IExternalResource, token: Manifesto.IAccessToken) => Promise<void>,
              getStoredAccessToken: (tokenService: string) => Promise<Manifesto.IAccessToken>,
              handleResourceResponse: (resource: Manifesto.IExternalResource) => Promise<any>): Promise<Resource[]>;
    getInfoUri(canvas: Manifesto.ICanvas): string;
    getSearchResultByCanvasIndex(index: number): SearchResult;
    getSearchWithinService(): Manifesto.IService;
    getSearchWithinServiceUri(): string;
    images: Manifesto.IExternalResource[];
    isSearchWithinEnabled(): boolean;
    parseSearchWithinResults(results: any);
    searchResults: SearchResult[];
    searchWithin(terms: string, callback: (results: any) => void): void;
}

export = ISeadragonProvider;