/// <reference path="../../../js/jquery.d.ts" />
import baseRight = require("app/modules/Shared/RightPanel");
import utils = require("app/Utils");

export class MoreInfoRightPanel extends baseRight.RightPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('moreInfoRightPanel');
        
        super.create();

        // load css.
        utils.Utils.loadCss('app/modules/MoreInfoRightPanel/css/styles.css');
    }

    resize(): void {
        super.resize();

    }
}