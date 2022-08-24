import { Dialogue } from "../uv-shared-module/Dialogue";
export declare class HelpDialogue extends Dialogue {
    $message: JQuery;
    $scroll: JQuery;
    $title: JQuery;
    constructor($element: JQuery);
    create(): void;
    resize(): void;
}
