import { FooterPanel as BaseFooterPanel } from "../uv-shared-module/FooterPanel";
export declare class FooterPanel extends BaseFooterPanel {
    $fullScreenBtn: JQuery;
    constructor($element: JQuery);
    create(): void;
    resize(): void;
}
