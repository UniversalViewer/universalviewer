import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { IExternalResource } from "manifesto.js";
export declare class FileLinkCenterPanel extends CenterPanel {
    $scroll: JQuery;
    $downloadItems: JQuery;
    $downloadItemTemplate: JQuery;
    constructor($element: JQuery);
    create(): void;
    openMedia(resources: IExternalResource[]): Promise<void>;
    resize(): void;
}
