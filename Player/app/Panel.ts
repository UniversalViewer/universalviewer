/// <reference path="../js/jquery.d.ts" />
import app = module("app/App");

export class Panel {
    $element: JQuery;
    fitToParentWidth: bool;
    fitToParentHeight: bool;

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        this.$element = $element;
        this.fitToParentWidth = fitToParentWidth || false;
        this.fitToParentHeight = fitToParentHeight || false;

        this.create();
    }

    create(): void {
        $.subscribe(app.App.RESIZE, () => {
            this.resize();
        });
    }

    resize(): void {
        var $parent = this.$element.parent();

        if (this.fitToParentWidth) {
            this.$element.width($parent.width());
        }

        if (this.fitToParentHeight) {
            this.$element.height($parent.height());
        }
    }
}