import {CroppedImageDimensions} from "./CroppedImageDimensions";
import {IExtension} from "../../modules/uv-shared-module/IExtension";
import {Mode} from "./Mode";
import SearchResult = Manifold.SearchResult;
import SearchResultRect = Manifold.SearchResultRect;
import Size = Utils.Measurements.Size;

export interface ISeadragonExtension extends IExtension{
    currentSearchResultRect: SearchResultRect | null;
    getAutoCompleteUri(): string | null;
    getConfinedImageDimensions(canvas: Manifesto.ICanvas, width: number): Size;
    getConfinedImageUri(canvas: Manifesto.ICanvas, width: number, height?: number): string;
    getCroppedImageDimensions(canvas: Manifesto.ICanvas, viewer: any): CroppedImageDimensions | null;
    getCroppedImageUri(canvas: Manifesto.ICanvas, viewer: any): string | null;
    getCurrentSearchResultRectIndex(): number;
    getEmbedScript(template: string, width: number, height: number, zoom: string, rotation: number): string;
    getImageBaseUri(canvas: Manifesto.ICanvas): string;
    getImageId(canvas: Manifesto.ICanvas): string;
    getLastSearchResultRectIndex(): number;
    getMode(): Mode;
    getNextPageIndex(index?: number): number;
    getPrevPageIndex(index?: number): number;
    getSearchResultRects(): SearchResultRect[];
    getSearchWithinServiceUri(): string | null;
    getTotalSearchResultRects(): number;
    getViewer(): any;
    getViewerRotation(): number | null;
    getViewportBounds(): string | null;
    isFirstSearchResultRect(): boolean;
    isPagingSettingEnabled(): boolean;
    isSearchWithinEnabled(): boolean;
    previousSearchResultRect: SearchResultRect | null;
    searchResults: SearchResult[] | null;
    searchWithin(terms: string, callback: (results: any) => void): void;
}