/// <reference path="../js/jquery.d.ts" />
import baseApp = module("app/BaseApp");
import panel = module("app/Panel");

export class BaseView extends panel.Panel{

    options: any;

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        super($element, fitToParentWidth, fitToParentHeight);

        this.options = baseApp.BaseApp.dataProvider.options;
    }

    create() {
        super.create();
    }

    resize(): void {
        super.resize();
    }
}