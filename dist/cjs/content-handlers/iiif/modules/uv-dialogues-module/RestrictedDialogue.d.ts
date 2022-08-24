import { Dialogue } from "../uv-shared-module/Dialogue";
import { IExternalResource } from "manifesto.js";
export declare class RestrictedDialogue extends Dialogue {
    $cancelButton: JQuery;
    $message: JQuery;
    $nextVisibleButton: JQuery;
    $title: JQuery;
    acceptCallback: any;
    isAccepted: boolean;
    resource: IExternalResource;
    constructor($element: JQuery);
    create(): void;
    open(): void;
    close(): void;
    resize(): void;
}
