/// <reference path="../../js/jquery.d.ts" />

import baseExtension = require("./baseExtension");
import shell = require("./shell");
import utils = require("../../utils");
import baseExpandPanel = require("./baseExpandPanel");

export class RightPanel extends baseExpandPanel.BaseExpandPanel {

    static OPEN_RIGHT_PANEL: string = 'onOpenRightPanel';
    static CLOSE_RIGHT_PANEL: string = 'onCloseRightPanel';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        super.create();

        this.$element.width(this.options.panelCollapsedWidth);
    }

    getTargetWidth(): number {
        return this.isExpanded ? this.options.panelCollapsedWidth : this.options.panelExpandedWidth;
    }

    getTargetLeft(): number {
        return this.isExpanded ? this.$element.parent().width() - this.options.panelCollapsedWidth : this.$element.parent().width() - this.options.panelExpandedWidth;
    }

    toggleComplete(): void {
        super.toggleComplete();

        if (this.isExpanded){
            $.publish(RightPanel.OPEN_RIGHT_PANEL);
        } else {
            $.publish(RightPanel.CLOSE_RIGHT_PANEL);
        }
    }

    resize(): void {
        super.resize();

        this.$element.css({
            'left': this.$element.parent().width() - this.$element.outerWidth()
        });
    }
}