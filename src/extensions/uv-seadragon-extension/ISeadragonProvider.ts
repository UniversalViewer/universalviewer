import IProvider = require("../../modules/uv-shared-module/IProvider");
import ExternalResource = require("../../modules/uv-shared-module/ExternalResource");
import SearchResult = require("./SearchResult");

interface ISeadragonProvider extends IProvider{
    getAutoCompleteService(): Manifesto.IService;
    getAutoCompleteUri(): string;
    getConfinedImageUri(canvas: Manifesto.ICanvas, width: number, height?: number): string;
    getCroppedImageUri(canvas: Manifesto.ICanvas, viewer: any, download?: boolean, relativeUri?: boolean): string;
    getEmbedScript(template: string, width: number, height: number, zoom: string, rotation: number): string;
    getImageBaseUri(canvas: Manifesto.ICanvas): string;
    getImageId(canvas: Manifesto.ICanvas): string;
    getSearchResultByCanvasIndex(index: number): SearchResult;
    getSearchWithinService(): Manifesto.IService;
    getSearchWithinServiceUri(): string;
    isSearchWithinEnabled(): boolean;
    parseSearchWithinResults(results: any);
    searchResults: SearchResult[];
    searchWithin(terms: string, callback: (results: any) => void): void;
}

export = ISeadragonProvider;