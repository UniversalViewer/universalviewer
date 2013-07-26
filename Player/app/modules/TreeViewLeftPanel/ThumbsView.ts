/// <reference path="../../../js/jquery.d.ts" />
import utils = module("app/Utils");
import baseApp = module("app/BaseApp");
import shell = module("app/shared/Shell");
import baseView = module("app/BaseView");

export class ThumbsView extends baseView.BaseView {

    constructor($element: JQuery) {
        super($element, true, false);
    }

    create(): void {
        super.create();

        this.$element.append('thumbsview');
    }

    resize(): void {
        super.resize();

    }
}