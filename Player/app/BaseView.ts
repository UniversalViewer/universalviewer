/// <reference path="../js/jquery.d.ts" />
import panel = module("app/Panel");

export class BaseView extends panel.Panel{

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        super($element, fitToParentWidth, fitToParentHeight);
    }

    create() {
        super.create();
    }

    resize(): void {
        super.resize();
    }
}