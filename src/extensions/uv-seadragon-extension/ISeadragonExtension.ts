import CroppedImageDimensions = require("./CroppedImageDimensions");
import IExtension = require("../../modules/uv-shared-module/IExtension");
import Mode = require("./Mode");
import SearchResult = Manifold.SearchResult;
import SearchResultRect = Manifold.SearchResultRect;
import Size = Utils.Measurements.Size;

interface ISeadragonExtension extends IExtension{
    currentSearchResultRect: SearchResultRect;
    getAutoCompleteUri(): string;
    getConfinedImageDimensions(canvas: Manifesto.ICanvas, width: number): Size;
    getConfinedImageUri(canvas: Manifesto.ICanvas, width: number, height?: number): string;
    getCroppedImageDimensions(canvas: Manifesto.ICanvas, viewer: any): CroppedImageDimensions;
    getCroppedImageUri(canvas: Manifesto.ICanvas, viewer: any): string;
    getCurrentSearchResultRectIndex(): number;
    getEmbedScript(template: string, width: number, height: number, zoom: string, rotation: number): string;
    getImageBaseUri(canvas: Manifesto.ICanvas): string;
    getImageId(canvas: Manifesto.ICanvas): string;
    getLastSearchResultRectIndex(): number;
    getMode(): Mode;
    getNextPageIndex(index?: number): number;
    getPrevPageIndex(index?: number): number;
    getSearchResultRects(): SearchResultRect[];
    getSearchWithinServiceUri(): string;
    getTotalSearchResultRects(): number;
    getViewer(): any;
    getViewerRotation(): number;
    getViewportBounds(): string;
    isFirstSearchResultRect(): boolean;
    isPagingSettingEnabled(): boolean;
    isSearchWithinEnabled(): boolean;
    previousSearchResultRect: SearchResultRect;
    searchResults: SearchResult[];
    searchWithin(terms: string, callback: (results: any) => void): void;
}

export = ISeadragonExtension;