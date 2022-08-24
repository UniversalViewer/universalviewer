import { BaseExpandPanel } from "./BaseExpandPanel";
export declare class RightPanel extends BaseExpandPanel {
    constructor($element: JQuery);
    create(): void;
    init(): void;
    getTargetWidth(): number;
    getTargetLeft(): number;
    toggleFinish(): void;
    resize(): void;
}
