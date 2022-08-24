import { BaseExpandPanel } from "./BaseExpandPanel";
export declare class LeftPanel extends BaseExpandPanel {
    constructor($element: JQuery);
    create(): void;
    init(): void;
    getTargetWidth(): number;
    getFullTargetWidth(): number;
    toggleFinish(): void;
    resize(): void;
}
