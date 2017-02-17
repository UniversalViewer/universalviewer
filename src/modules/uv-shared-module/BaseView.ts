import {Panel} from "./Panel";
import Bootstrapper from "../../Bootstrapper";
import {IExtension} from "./IExtension";

export class BaseView extends Panel{

    bootstrapper: any;
    config: any;
    content: any;
    extension: IExtension;
    modules: string[];
    options: any;

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        super($element, fitToParentWidth, fitToParentHeight);
    }

    create(): void {

        this.bootstrapper = $("body > #app").data("bootstrapper");

        super.create();
        
        this.extension = (<Bootstrapper>this.bootstrapper).extension;

        this.config = {};
        this.config.content = {};
        this.config.options = {};
        this.content = this.config.content;
        this.options = this.config.options;

        var that = this;

        // build config inheritance chain
        if (that.modules && that.modules.length) {
            that.modules = that.modules.reverse();
            $.each(that.modules, (index: number, moduleName: string) => {
                that.config = $.extend(true, that.config, that.extension.config.modules[moduleName]);
            });
        }
    }

    init(): void{

    }

    setConfig(moduleName: string): void {
        if (!this.modules) {
            this.modules = [];
        }
        this.modules.push(moduleName);
    }

    resize(): void {
        super.resize();
    }
}