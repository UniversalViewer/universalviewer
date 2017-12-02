import {BaseEvents} from "./BaseEvents";

export class Panel {

    $element: JQuery;
    fitToParentWidth: boolean;
    fitToParentHeight: boolean;
    isResized: boolean = false;

    constructor($element: JQuery, fitToParentWidth?: boolean, fitToParentHeight?: boolean) {
        this.$element = $element;
        this.fitToParentWidth = fitToParentWidth || false;
        this.fitToParentHeight = fitToParentHeight || false;

        this.create();
    }

    create(): void {
        $.subscribe(BaseEvents.RESIZE, () => {
            this.resize();
        });
    }

    resize(): void {
        const $parent: JQuery = this.$element.parent();

        if (this.fitToParentWidth) {
            this.$element.width($parent.width());
        }

        if (this.fitToParentHeight) {
            this.$element.height($parent.height());
        }

        this.isResized = true;
    }
}