import CroppedImageDimensions = require("./CroppedImageDimensions");
import IExtension = require("../../modules/uv-shared-module/IExtension");
import Mode = require("./Mode");
import SearchResult = require("./SearchResult");
import Size = Utils.Measurements.Size;

interface ISeadragonExtension extends IExtension{
    getAutoCompleteUri(): string;
    getConfinedImageDimensions(canvas: Manifesto.ICanvas, width: number): Size;
    getConfinedImageUri(canvas: Manifesto.ICanvas, width: number, height?: number): string;
    getCroppedImageDimensions(canvas: Manifesto.ICanvas, viewer: any): CroppedImageDimensions;
    getCroppedImageUri(canvas: Manifesto.ICanvas, viewer: any): string;
    getEmbedScript(template: string, width: number, height: number, zoom: string, rotation: number): string;
    getImageBaseUri(canvas: Manifesto.ICanvas): string;
    getImageId(canvas: Manifesto.ICanvas): string;
    getMode(): Mode;
    getNextPageIndex(index?: number): number;
    getPrevPageIndex(index?: number): number;
    getSearchResultByCanvasIndex(index: number): SearchResult;
    getSearchWithinServiceUri(): string;
    getViewer(): any;
    getViewerBounds(): string;
    getViewerRotation(): number;
    isPagingSettingEnabled(): boolean;
    isSearchWithinEnabled(): boolean;
    parseSearchWithinResults(results: any);
    searchResults: SearchResult[];
    searchWithin(terms: string, callback: (results: any) => void): void;
}

export = ISeadragonExtension;