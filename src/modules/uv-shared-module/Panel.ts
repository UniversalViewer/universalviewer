import {BaseEvents} from "./BaseEvents";
import { IUVComponent } from "../../IUVComponent";

export class Panel {

    component: IUVComponent;
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
        this.component.subscribe(BaseEvents.RESIZE, () => {
            this.resize();
        });
    }

    whenResized(cb: () => void): void {
        Utils.Async.waitFor(() => {
            return this.isResized;
        }, cb);
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