import {CroppedImageDimensions} from "./CroppedImageDimensions";
import {IExtension} from "../../modules/uv-shared-module/IExtension";
import {Mode} from "./Mode";
import { Size } from "@edsilv/utils";

export interface ISeadragonExtension extends IExtension{
    annotations: manifold.AnnotationGroup[] | null;
    currentAnnotationRect: manifold.AnnotationRect | null;
    getAnnotationRects(): manifold.AnnotationRect[];
    getAutoCompleteUri(): string | null;
    getConfinedImageDimensions(canvas: manifesto.Canvas, width: number): Size;
    getConfinedImageUri(canvas: manifesto.Canvas, width: number, height?: number): string | null;
    getCroppedImageDimensions(canvas: manifesto.Canvas, viewer: any): CroppedImageDimensions | null;
    getCroppedImageUri(canvas: manifesto.Canvas, viewer: any): string | null;
    getCurrentAnnotationRectIndex(): number;
    getEmbedScript(template: string, width: number, height: number, zoom: string, rotation: number): string;
    getImageBaseUri(canvas: manifesto.Canvas): string;
    getImageId(canvas: manifesto.Canvas): string | null;
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
    previousAnnotationRect: manifold.AnnotationRect | null;
    search(terms: string, callback: (results: any) => void): void;
}