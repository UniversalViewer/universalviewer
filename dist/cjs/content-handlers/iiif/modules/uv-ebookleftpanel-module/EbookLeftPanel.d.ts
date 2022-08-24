import { LeftPanel } from "../uv-shared-module/LeftPanel";
export declare class EbookLeftPanel extends LeftPanel {
    private _ebookTOC;
    private _$container;
    private _$ebookTOC;
    constructor($element: JQuery);
    create(): Promise<void>;
    expandFullStart(): void;
    expandFullFinish(): void;
    collapseFullStart(): void;
    collapseFullFinish(): void;
    resize(): void;
}
