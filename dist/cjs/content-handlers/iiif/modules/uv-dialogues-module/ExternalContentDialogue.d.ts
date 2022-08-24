import { Dialogue } from "../uv-shared-module/Dialogue";
export declare class ExternalContentDialogue extends Dialogue {
    $iframe: JQuery;
    constructor($element: JQuery);
    create(): void;
    resize(): void;
}
