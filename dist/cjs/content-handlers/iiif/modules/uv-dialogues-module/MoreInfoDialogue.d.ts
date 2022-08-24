import { Dialogue } from "../uv-shared-module/Dialogue";
export declare class MoreInfoDialogue extends Dialogue {
    $title: JQuery;
    metadataComponent: any;
    $metadata: JQuery;
    constructor($element: JQuery);
    create(): void;
    open(triggerButton?: HTMLElement): void;
    private _getData;
    close(): void;
    resize(): void;
}
