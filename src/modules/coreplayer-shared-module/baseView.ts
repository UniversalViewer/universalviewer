/// <reference path="../../js/jquery.d.ts" />
import panel = require("./panel");
import IProvider = require("./iProvider");
import IExtension = require("./iExtension");

export class BaseView extends panel.Panel{

    extension: IExtension;
    provider: IProvider;
    config: any;
    content: any;
    options: any;
    moduleName: string;

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        super($element, fitToParentWidth, fitToParentHeight);
    }

    create(): void {
        super.create();

        this.extension = window.extension;
        this.provider = this.extension.provider;

        // config.
        if (this.moduleName) {
            this.config = this.provider.config.modules[this.moduleName];
            if (!this.config) this.config = {};
            this.content = this.config.content || {};
            this.options = this.config.options || {};
        }
    }

    init(): void{

    }

    setConfig(moduleName: string): void {
        // the top-most class in the inheritance chain of views
        // overrides all other sub classes in that
        // it is the first to set the module name.
        if (!this.moduleName) {
            this.moduleName = moduleName;
        }
    }

    resize(): void {
        super.resize();
    }
}