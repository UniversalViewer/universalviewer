import { Dialogue } from "../uv-shared-module/Dialogue";
import { Service } from "manifesto.js";
export declare class AuthDialogue extends Dialogue {
    closeCallback: any;
    confirmCallback: any;
    cancelCallback: any;
    $cancelButton: JQuery;
    $confirmButton: JQuery;
    $message: JQuery;
    $title: JQuery;
    service: Service;
    constructor($element: JQuery);
    create(): void;
    open(): void;
    resize(): void;
    _buttonsToAdd(): string;
}
