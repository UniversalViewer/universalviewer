import { Canvas } from 'manifesto.js';
import { AnnotationGroup, AnnotationRect } from '@iiif/manifold';
import {CroppedImageDimensions} from "./CroppedImageDimensions";
import {IExtension} from "../../modules/uv-shared-module/IExtension";
import {Mode} from "./Mode";
import Size = Utils.Size;

export interface ISeadragonExtension extends IExtension{
    annotations: AnnotationGroup[] | null;
    currentAnnotationRect: AnnotationRect | null;
    getAnnotationRects(): AnnotationRect[];
    getAutoCompleteUri(): string | null;
    getConfinedImageDimensions(canvas: Canvas, width: number): Size;
    getConfinedImageUri(canvas: Canvas, width: number, height?: number): string | null;
    getCroppedImageDimensions(canvas: Canvas, viewer: any): CroppedImageDimensions | null;
    getCroppedImageUri(canvas: Canvas, viewer: any): string | null;
    getCurrentAnnotationRectIndex(): number;
    getEmbedScript(template: string, width: number, height: number, zoom: string, rotation: number): string;
    getImageBaseUri(canvas: Canvas): string;
    getImageId(canvas: Canvas): string | null;
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
