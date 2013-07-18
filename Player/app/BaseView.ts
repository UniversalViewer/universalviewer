/// <reference path="../js/jquery.d.ts" />
import baseApp = module("app/BaseApp");
import panel = module("app/Panel");
import bp = module("app/BaseProvider");

export class BaseView extends panel.Panel{

    options: any;
    content: any;
    provider: bp.BaseProvider;

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        super($element, fitToParentWidth, fitToParentHeight);
    }

    create() {
        super.create();

        // shortcuts for derived views.
        this.provider = baseApp.BaseApp.provider;
        this.options = this.provider.config.options;
        this.content = this.provider.config.content;
    }

    resize(): void {
        super.resize();
    }
}