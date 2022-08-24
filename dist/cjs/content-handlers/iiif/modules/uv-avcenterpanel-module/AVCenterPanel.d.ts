import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { IExternalResource } from "manifesto.js";
export declare class AVCenterPanel extends CenterPanel {
    $avcomponent: JQuery;
    avcomponent: any;
    private _lastCanvasIndex;
    private _mediaReady;
    private _isThumbsViewOpen;
    constructor($element: JQuery);
    create(): void;
    _mediaReadyQueue: Function[];
    private _flushMediaReadyQueue;
    private _createAVComponent;
    private _observeRangeChanges;
    private _setTitle;
    private _isCurrentResourceAccessControlled;
    openMedia(resources: IExternalResource[]): void;
    private _limitToRange;
    private _autoAdvanceRanges;
    private _whenMediaReady;
    private _viewRange;
    private _viewCanvas;
    resize(resizeAVComponent?: boolean): void;
}
