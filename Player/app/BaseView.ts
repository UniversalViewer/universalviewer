/// <reference path="../js/jquery.d.ts" />
import baseApp = module("app/BaseApp");
import panel = module("app/Panel");

export class BaseView extends panel.Panel{

    options: any;
    content: any;

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        super($element, fitToParentWidth, fitToParentHeight);
    }

    create() {
        super.create();

        this.options = baseApp.BaseApp.provider.options;
        this.content = baseApp.BaseApp.provider.content;
    }

    resize(): void {
        super.resize();
    }
}