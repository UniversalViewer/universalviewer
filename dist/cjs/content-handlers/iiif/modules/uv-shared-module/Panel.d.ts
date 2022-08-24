import { IIIFExtensionHost } from "../../IIIFExtensionHost";
export declare class Panel {
    extensionHost: IIIFExtensionHost;
    $element: JQuery;
    fitToParentWidth: boolean;
    fitToParentHeight: boolean;
    isResized: boolean;
    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean);
    create(): void;
    whenResized(cb: () => void): void;
    onAccessibleClick(el: JQuery, callback: (e: JQueryEventObject) => void, withClick?: boolean): void;
    resize(): void;
}
