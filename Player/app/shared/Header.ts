/// <reference path="../../js/jquery.d.ts" />
import baseView = module("app/BaseView");

export class Header extends baseView.BaseView {

    constructor($element: JQuery) {
        super($element, true, false);
    }

    create(): void {
        super.create();
    }

    resize(): void {
        super.resize();
    }
}