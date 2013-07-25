/// <reference path="../../js/jquery.d.ts" />
import baseApp = module("app/BaseApp");
import shell = module("app/shared/Shell");
import utils = module("app/Utils");
import baseExpandPanel = module("app/shared/BaseExpandPanel");

export class RightPanel extends baseExpandPanel.BaseExpandPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

        this.$element.width(this.options.rightPanelCollapsedWidth);
    }

    getTargetWidth(): number {
        return this.isExpanded ? this.options.rightPanelCollapsedWidth : this.options.rightPanelExpandedWidth;
    }

    getTargetLeft(): number {
        return this.isExpanded ? this.$element.parent().width() - this.options.rightPanelCollapsedWidth : this.$element.parent().width() - this.options.rightPanelExpandedWidth;
    }

    toggleComplete(): void {

    }

    resize(): void {
        super.resize();

        this.$element.css({
            'left': this.$element.parent().width() - this.$element.outerWidth()
        });
    }
}