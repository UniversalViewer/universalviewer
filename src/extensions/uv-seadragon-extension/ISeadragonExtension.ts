import {CroppedImageDimensions} from "./CroppedImageDimensions";
import {IExtension} from "../../modules/uv-shared-module/IExtension";
import {Mode} from "./Mode";
import AnnotationGroup = Manifold.AnnotationGroup;
import AnnotationRect = Manifold.AnnotationRect;
import Size = Utils.Measurements.Size;

export interface ISeadragonExtension extends IExtension{
    annotations: AnnotationGroup[] | null;
    currentAnnotationRect: AnnotationRect | null;
    getAnnotationRects(): AnnotationRect[];
    getAutoCompleteUri(): string | null;
    getConfinedImageDimensions(canvas: Manifesto.ICanvas, width: number): Size;
    getConfinedImageUri(canvas: Manifesto.ICanvas, width: number, height?: number): string | null;
    getCroppedImageDimensions(canvas: Manifesto.ICanvas, viewer: any): CroppedImageDimensions | null;
    getCroppedImageUri(canvas: Manifesto.ICanvas, viewer: any): string | null;
    getCurrentAnnotationRectIndex(): number;
    getEmbedScript(template: string, width: number, height: number, zoom: string, rotation: number): string;
    getImageBaseUri(canvas: Manifesto.ICanvas): string;
    getImageId(canvas: Manifesto.ICanvas): string | null;
    getLastAnnotationRectIndex(): number;
    getMode(): Mode;
    getNextPageIndex(index?: number): number;
    getPrevPageIndex(index?: number): number;
    getSearchServiceUri(): string | null;
    getTotalAnnotationRects(): number;
    getViewer(): any;
    getViewerRotation(): number | null;
    getViewportBounds(): string | null;
    isFirstAnnotationRect(): boolean;
    isPagingSettingEnabled(): boolean;
    isSearchEnabled(): boolean;
    previousAnnotationRect: AnnotationRect | null;
    search(terms: string, callback: (results: any) => void): void;
}