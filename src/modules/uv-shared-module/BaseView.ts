import Panel = require("./Panel");
import Bootstrapper = require("../../Bootstrapper");
import IExtension = require("./IExtension");
import IProvider = require("./IProvider");

class BaseView extends Panel{

    bootstrapper: any;
    config: any;
    content: any;
    extension: IExtension;
    modules: string[];
    options: any;
    provider: IProvider;

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        this.modules = [];
        this.bootstrapper = $("body > #app").data("bootstrapper");
        super($element, fitToParentWidth, fitToParentHeight);
    }

    create(): void {

        super.create();

        this.extension = (<Bootstrapper>this.bootstrapper).extension;
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

export = BaseView;