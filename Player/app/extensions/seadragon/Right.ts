/// <reference path="../../../js/jquery.d.ts" />
import baseRight = module("app/shared/RightPanel");

export class Right extends baseRight.RightPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

    }

    resize(): void {
        super.resize();

    }
}