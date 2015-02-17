/// <reference path="../../js/jquery.d.ts" />
import panel = require("./panel");
//import IProvider = require("./iProvider");
//import IExtension = require("./iExtension");

export class BaseView extends panel.Panel{

    extension: any;
    provider: any;
    config: any;
    content: any;
    options: any;
    modules: string[];

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        this.modules = [];
        super($element, fitToParentWidth, fitToParentHeight);
    }

    create(): void {

        super.create();

        this.extension = window.extension;
        this.provider = this.extension.provider;

        this.config = {};
        this.config.content = {};
        this.config.options = {};
        this.content = this.config.content;
        this.options = this.config.options;

        // build config inheritance chain
        if (this.modules.length) {
            this.modules = this.modules.reverse();
            _.each(this.modules, (moduleName: string) => {
                this.config = $.extend(true, this.config, this.provider.config.modules[moduleName]);
            });
        }
    }

    init(): void{

    }

    setConfig(moduleName: string): void {
        this.modules.push(moduleName);
    }

    resize(): void {
        super.resize();
    }
}