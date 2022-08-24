import { Dialogue } from "../uv-shared-module/Dialogue";
export declare class MultiSelectDialogue extends Dialogue {
    $title: JQuery;
    $gallery: JQuery;
    galleryComponent: any;
    data: any;
    constructor($element: JQuery);
    create(): void;
    isPageModeEnabled(): boolean;
    open(): void;
    close(): void;
    resize(): void;
}
