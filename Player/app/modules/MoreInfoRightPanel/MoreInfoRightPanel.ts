/// <reference path="../../../js/jquery.d.ts" />
import baseRight = module("app/shared/RightPanel");
import utils = module("app/Utils");

export class MoreInfoRightPanel extends baseRight.RightPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

        // load css.
        utils.Utils.loadCss('app/modules/MoreInfoRightPanel/css/styles.css');
    }

    resize(): void {
        super.resize();

    }
}