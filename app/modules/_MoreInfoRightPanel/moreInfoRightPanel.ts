/// <reference path="../../../js/jquery.d.ts" />
import baseRight = require("app/modules/shared/rightPanel");
import utils = require("app/utils");

export class MoreInfoRightPanel extends baseRight.RightPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('moreInfoRightPanel');
        
        super.create();
    }

    resize(): void {
        super.resize();

    }
}