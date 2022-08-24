import { BaseView } from "./BaseView";
export declare class Shell extends BaseView {
    $centerPanel: JQuery;
    $element: JQuery;
    $footerPanel: JQuery;
    $genericDialogue: JQuery;
    $headerPanel: JQuery;
    $leftPanel: JQuery;
    $mainPanel: JQuery;
    $mobileFooterPanel: JQuery;
    $overlays: JQuery;
    $rightPanel: JQuery;
    constructor($element: JQuery);
    create(): void;
    resize(): void;
}
