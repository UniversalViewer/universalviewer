/// <reference path="../../js/jquery.d.ts" />
import baseHeader = module("app/shared/Header");

export class Header extends baseHeader.Header {

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