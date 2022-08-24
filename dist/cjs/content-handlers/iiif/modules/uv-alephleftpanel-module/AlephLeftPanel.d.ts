import { LeftPanel } from "../uv-shared-module/LeftPanel";
export declare class AlephLeftPanel extends LeftPanel {
    private _alControlPanel;
    constructor($element: JQuery);
    create(): Promise<void>;
    expandFullStart(): void;
    expandFullFinish(): void;
    collapseFullStart(): void;
    collapseFullFinish(): void;
    resize(): void;
}
