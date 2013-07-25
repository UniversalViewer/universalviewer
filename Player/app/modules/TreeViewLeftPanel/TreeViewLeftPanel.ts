/// <reference path="../../../js/jquery.d.ts" />
import baseLeft = module("app/shared/LeftPanel");
import utils = module("app/Utils");

export class TreeViewLeftPanel extends baseLeft.LeftPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

        // load css.
        utils.Utils.loadCss('app/modules/TreeViewLeftPanel/css/styles.css');
    }

    resize(): void {
        super.resize();

    }
}