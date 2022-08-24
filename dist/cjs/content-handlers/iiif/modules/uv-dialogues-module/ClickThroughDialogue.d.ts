import { Dialogue } from "../uv-shared-module/Dialogue";
import { IExternalResource } from "manifesto.js";
export declare class ClickThroughDialogue extends Dialogue {
    acceptCallback: any;
    $acceptTermsButton: JQuery;
    $message: JQuery;
    $title: JQuery;
    resource: IExternalResource;
    constructor($element: JQuery);
    create(): void;
    open(): void;
    resize(): void;
}
