/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseApp = require("./baseApp");
import shell = require("./shell");
import utils = require("../../utils");
import baseExpandPanel = require("./baseExpandPanel");

export class LeftPanel extends baseExpandPanel.BaseExpandPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        super.create();

        this.$element.width(this.options.panelCollapsedWidth);

    }

    init(): void{
        super.init();

        if (this.options.panelOpen) {
            this.toggle();
        }
    }

    getTargetWidth(): number {
        return this.isExpanded ? this.options.panelCollapsedWidth : this.options.panelExpandedWidth;
    }

    toggleComplete(): void {
        super.toggleComplete();

    }

    resize(): void {
        super.resize();

    }
}