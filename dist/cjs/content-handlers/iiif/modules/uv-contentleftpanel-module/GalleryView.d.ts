import { BaseView } from "../uv-shared-module/BaseView";
export declare class GalleryView extends BaseView {
    isOpen: boolean;
    galleryComponent: any;
    galleryData: any;
    $gallery: JQuery;
    constructor($element: JQuery);
    create(): void;
    setup(): void;
    databind(): void;
    show(): void;
    hide(): void;
    resize(): void;
}
