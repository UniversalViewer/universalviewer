import {Panel} from "./Panel";
import {IExtension} from "./IExtension";
import UVComponent from "../../UVComponent";

export class BaseView extends Panel{

    component: UVComponent;
    config: any;
    content: any;
    extension: IExtension;
    modules: string[];
    options: any;

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        super($element, fitToParentWidth, fitToParentHeight);
    }

    create(): void {

        this.component = $("body > #app").data("component");

        super.create();
        
        this.extension = (<UVComponent>this.component).extension;

        this.config = {};
        this.config.content = {};
        this.config.options = {};

        var that = this;

        // build config inheritance chain
        if (that.modules && that.modules.length) {
            that.modules = that.modules.reverse();
            $.each(that.modules, (index: number, moduleName: string) => {
                that.config = $.extend(true, that.config, that.extension.getData().config.modules[moduleName]);
            });
        }

        this.content = this.config.content;
        this.options = this.config.options;
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