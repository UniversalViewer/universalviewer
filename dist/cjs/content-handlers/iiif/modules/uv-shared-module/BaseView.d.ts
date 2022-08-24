import { Panel } from "./Panel";
import { IExtension } from "./IExtension";
export declare class BaseView extends Panel {
    config: any;
    content: any;
    extension: IExtension;
    modules: string[];
    options: any;
    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean);
    create(): void;
    init(): void;
    setConfig(moduleName: string): void;
    resize(): void;
}
