import IProvider = require("../../modules/uv-shared-module/iProvider");
import SearchResult = require("./SearchResult");

interface ISeadragonProvider extends IProvider{
    getEmbedScript(canvasIndex: number, zoom: string, width: number, height: number, rotation: number, embedTemplate: string): string;
    getImageUri(canvas: any): string;
    getTileSources(): any[];
    getCroppedImageUri(asset: any, viewer: any, download?: boolean, relativeUri?: boolean): string;
    getConfinedImageUri(canvas: any, width: number, height?: number): string;
    getAutoCompleteUri(): string;
    getSearchWithinService(): string;
    getSearchWithinServiceUri(): string;
    isSearchWithinEnabled(): boolean;
    searchWithin(terms: string, callback: (results: any) => void): void;
    searchResults: SearchResult[];
    parseSearchWithinResults(results: any);
    getSearchResultByCanvasIndex(canvasIndex: number): SearchResult;
}

export = ISeadragonProvider;