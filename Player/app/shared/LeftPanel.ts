/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseApp = module("app/BaseApp");
import shell = module("app/shared/Shell");
import utils = module("app/Utils");
import baseExpandPanel = module("app/shared/BaseExpandPanel");

export class LeftPanel extends baseExpandPanel.BaseExpandPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

        this.$element.width(this.options.leftPanelCollapsedWidth);
    }

    getTargetWidth(): number {
        return this.isExpanded ? this.options.leftPanelCollapsedWidth : this.options.leftPanelExpandedWidth;
    }

    getTargetLeft(): number {
        return 0;
    }
    
    toggleComplete(): void {

    }

    resize(): void {
        super.resize();

    }
}