/// <reference path="../../js/jquery.d.ts" />

export class Panel {
    $element: JQuery;
    fitToParentWidth: boolean;
    fitToParentHeight: boolean;

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        console.log("construct: " + (<any>this.constructor).name);

        this.$element = $element;
        this.fitToParentWidth = fitToParentWidth || false;
        this.fitToParentHeight = fitToParentHeight || false;

        this.create();
    }

    create(): void {
        console.log("create: " + (<any>this.constructor).name);

        // todo: can't use static baseExtension.RESIZE property here without breaking inheritance.
        // possible bug with TS 0.9
        $.subscribe('onResize', () => {
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