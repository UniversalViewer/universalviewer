import CroppedImageDimensions = require("./CroppedImageDimensions");
import ExternalResource = require("../../modules/uv-shared-module/ExternalResource");
import IProvider = require("../../modules/uv-shared-module/IProvider");
import SearchResult = require("./SearchResult");
import Size = Utils.Measurements.Size;
import TreeSortType = require("./TreeSortType");

interface ISeadragonProvider extends IProvider{
    getAutoCompleteService(): Manifesto.IService;
    getAutoCompleteUri(): string;
    getConfinedImageDimensions(canvas: Manifesto.ICanvas, width: number): Size;
    getConfinedImageUri(canvas: Manifesto.ICanvas, width: number, height?: number): string;
    getCroppedImageDimensions(canvas: Manifesto.ICanvas, viewer: any): CroppedImageDimensions;
    getCroppedImageUri(canvas: Manifesto.ICanvas, viewer: any): string;
    getEmbedScript(template: string, width: number, height: number, zoom: string, rotation: number): string;
    getImageBaseUri(canvas: Manifesto.ICanvas): string;
    getImageId(canvas: Manifesto.ICanvas): string;
    getSearchResultByCanvasIndex(index: number): SearchResult;
    getSearchWithinService(): Manifesto.IService;
    getSearchWithinServiceUri(): string;
    getSortedTree(sortType: TreeSortType): Manifesto.TreeNode;
    isSearchWithinEnabled(): boolean;
    parseSearchWithinResults(results: any);
    searchResults: SearchResult[];
    searchWithin(terms: string, callback: (results: any) => void): void;
}

export = ISeadragonProvider;