/// <reference path="../../../js/jquery.d.ts" />
import baseLeft = module("app/shared/LeftPanel");

export class TreeViewLeftPanel extends baseLeft.LeftPanel {

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