/// <reference path="../../js/jquery.d.ts" />
import baseRight = module("app/shared/Right");

export class Right extends baseRight.Right {

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