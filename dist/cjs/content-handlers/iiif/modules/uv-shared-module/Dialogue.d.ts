import { BaseView } from "./BaseView";
export declare class Dialogue extends BaseView {
    allowClose: boolean;
    isActive: boolean;
    isUnopened: boolean;
    openCommand: string;
    closeCommand: string;
    returnFunc: any;
    $bottom: JQuery;
    $triggerButton: JQuery;
    $closeButton: JQuery;
    $content: JQuery;
    $buttons: JQuery;
    $middle: JQuery;
    $top: JQuery;
    constructor($element: JQuery);
    create(): void;
    enableClose(): void;
    disableClose(): void;
    setDockedPosition(): void;
    open(triggerButton?: HTMLElement): void;
    afterFirstOpen(): void;
    close(): void;
    resize(): void;
}
