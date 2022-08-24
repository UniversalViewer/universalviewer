import { Dialogue } from "./Dialogue";
export declare class GenericDialogue extends Dialogue {
    acceptCallback: any;
    $acceptButton: JQuery;
    $message: JQuery;
    constructor($element: JQuery);
    create(): void;
    accept(): void;
    showMessage(params: any): void;
    resize(): void;
}
