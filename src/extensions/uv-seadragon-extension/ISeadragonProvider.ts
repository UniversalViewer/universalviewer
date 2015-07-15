import IProvider = require("../../modules/uv-shared-module/IProvider");
import Resource = require("../../modules/uv-shared-module/Resource");
import SearchResult = require("./SearchResult");

interface ISeadragonProvider extends IProvider{
    getAutoCompleteService(): string;
    getAutoCompleteUri(): string;
    getConfinedImageUri(canvas: any, width: number, height?: number): string;
    getCroppedImageUri(asset: any, viewer: any, download?: boolean, relativeUri?: boolean): string;
    getEmbedScript(canvasIndex: number, zoom: string, width: number, height: number, rotation: number, embedTemplate: string): string;
    getImages(loginMethod: (loginService: string) => Promise<void>): Promise<Resource[]>;
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