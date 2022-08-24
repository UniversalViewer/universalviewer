import { BaseView } from "./BaseView";
import { Thumb } from "manifesto.js";
export declare class ThumbsView extends BaseView {
    private _$thumbsCache;
    $selectedThumb: JQuery;
    $thumbs: JQuery;
    isCreated: boolean;
    isOpen: boolean;
    lastThumbClickedIndex: number;
    thumbs: Thumb[];
    constructor($element: JQuery);
    create(): void;
    databind(): void;
    createThumbs(): void;
    scrollStop(): void;
    loadThumbs(index?: number): void;
    show(): void;
    hide(): void;
    isPDF(): boolean;
    setLabel(): void;
    addSelectedClassToThumbs(index: number): void;
    selectIndex(index: number): void;
    getAllThumbs(): JQuery;
    getThumbByIndex(canvasIndex: number): JQuery;
    scrollToThumb(canvasIndex: number): void;
    resize(): void;
}
