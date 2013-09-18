/// <reference path="../../js/jquery.d.ts" />

import baseRight = require("../coreplayer-shared-module/rightPanel");

export class MoreInfoRightPanel extends baseRight.RightPanel {

    moreInfoItemTemplate: JQuery;
    data: any;
    $conditionsLink: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('moreInfoRightPanel');
        
        super.create();
    }

    toggleComplete(): void {
        super.toggleComplete();

        if (this.isUnopened) {
            this.displayInfo();
        }
    }

    displayInfo(): void {

        // show loading icon.
        this.$main.addClass('loading');

        this.$main.append(this.content.holdingText);
    }

    resize(): void {
        super.resize();

    }
}
