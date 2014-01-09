/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseExtension = require("./baseExtension");
import shell = require("./shell");
import utils = require("../../utils");
import baseExpandPanel = require("./baseExpandPanel");

export class LeftPanel extends baseExpandPanel.BaseExpandPanel {

    static OPEN_LEFT_PANEL: string = 'onOpenLeftPanel';
    static CLOSE_LEFT_PANEL: string = 'onCloseLeftPanel';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        super.create();

        this.$element.width(this.options.panelCollapsedWidth);

    }

    init(): void{
        super.init();

        if (this.options.panelOpen && this.provider.isHomeDomain) {
            this.toggle();
        }
    }

    getTargetWidth(): number {
        return this.isExpanded ? this.options.panelCollapsedWidth : this.options.panelExpandedWidth;
    }

    toggleComplete(): void {
        super.toggleComplete();

        if (this.isExpanded){
            $.publish(LeftPanel.OPEN_LEFT_PANEL);
        } else {
            $.publish(LeftPanel.CLOSE_LEFT_PANEL);
        }
    }

    resize(): void {
        super.resize();

    }
}