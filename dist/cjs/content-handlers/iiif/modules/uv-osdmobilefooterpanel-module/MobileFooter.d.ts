import { FooterPanel as BaseFooterPanel } from "../uv-shared-module/FooterPanel";
export declare class FooterPanel extends BaseFooterPanel {
    $rotateButton: JQuery;
    $zoomInButton: JQuery;
    $zoomOutButton: JQuery;
    constructor($element: JQuery);
    create(): void;
    resize(): void;
}
