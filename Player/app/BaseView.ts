/// <reference path="../js/jquery.d.ts" />
import panel = module("app/Panel");
import baseApp = module("app/BaseApp");

export class BaseView extends panel.Panel{

    app: baseApp.BaseApp;
    provider: any;
    content: any;
    options: any;

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        super($element, fitToParentWidth, fitToParentHeight);
    }

    create() {
        super.create();

        this.app = window.app;
        this.provider = this.app.provider;
        this.content = this.provider.config.content;
        this.options = this.provider.config.options;
    }

    resize(): void {
        super.resize();
    }
}