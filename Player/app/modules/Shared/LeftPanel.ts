/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/extensions.d.ts" />
import baseApp = module("app/modules/Shared/BaseApp");
import shell = module("app/modules/Shared/Shell");
import utils = module("app/Utils");
import baseExpandPanel = module("app/modules/Shared/BaseExpandPanel");

export class LeftPanel extends baseExpandPanel.BaseExpandPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        super.create();

        this.$element.width(this.options.panelCollapsedWidth);

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