import { RightPanel } from "../uv-shared-module/RightPanel";
export declare class MoreInfoRightPanel extends RightPanel {
    metadataComponent: any;
    $metadata: JQuery;
    limitType: any;
    limit: number;
    constructor($element: JQuery);
    create(): void;
    toggleFinish(): void;
    databind(): void;
    private _getCurrentRange;
    private _getData;
    resize(): void;
}
