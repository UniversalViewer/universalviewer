/// <reference path="../../../js/jquery.d.ts" />
import baseApp = module("app/modules/Shared/BaseApp");
import shell = module("app/modules/Shared/Shell");
import utils = module("app/Utils");
import baseExpandPanel = module("app/modules/Shared/BaseExpandPanel");

export class RightPanel extends baseExpandPanel.BaseExpandPanel {

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

    }

    resize(): void {
        super.resize();

        this.$element.css({
            'left': this.$element.parent().width() - this.$element.outerWidth()
        });
    }
}