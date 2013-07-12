/// <reference path="../../js/jquery.d.ts" />
import baseLeft = module("app/shared/Left");

export class Left extends baseLeft.Left {

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