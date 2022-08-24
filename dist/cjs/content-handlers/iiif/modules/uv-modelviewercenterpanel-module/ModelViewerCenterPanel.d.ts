import "@google/model-viewer/dist/model-viewer";
import { IExternalResource } from "manifesto.js";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
export declare class ModelViewerCenterPanel extends CenterPanel {
    $modelviewer: JQuery;
    $spinner: JQuery;
    isLoaded: boolean;
    constructor($element: JQuery);
    create(): void;
    whenLoaded(cb: () => void): void;
    private overlayAnnotations;
    private clearAnnotations;
    private getCameraOrbit;
    openMedia(resources: IExternalResource[]): Promise<void>;
    resize(): void;
}
