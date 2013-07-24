/// <reference path="../../../js/jquery.d.ts" />
import baseFooter = module("app/shared/Footer");

export class Footer extends baseFooter.Footer {

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