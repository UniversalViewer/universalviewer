/// <reference path="../../js/jquery.d.ts" />
import baseApp = module("app/BaseApp");
import shell = module("app/shared/Shell");
import utils = module("app/Utils");
import baseView = module("app/BaseView");

export class Left extends baseView.BaseView {

    isExpanded: bool = false;

    constructor($element: JQuery) {
        super($element, false, true);
    }

    create(): void {
        super.create();
        
        this.$element.width(this.options.leftPanelCollapsedWidth);

        this.$element.on('click', (e) => {
            e.preventDefault();

            this.toggle();
        });
    }

    toggle(): void {
        $.publish(baseApp.BaseApp.TOGGLE_LEFTPANEL_START, [this.isExpanded]);

        var width = this.isExpanded ? this.options.leftPanelCollapsedWidth : this.options.leftPanelExpandedWidth;

        this.isExpanded = !this.isExpanded;

        this.$element.stop().animate(
            {
                width: width
            },
            this.options.panelAnimationDuration,
            function () {
                $.publish(baseApp.BaseApp.TOGGLE_LEFTPANEL_END, [this.isExpanded]);
                $.publish(baseApp.BaseApp.RESIZE);
            }
        );
    }

    resize(): void {
        super.resize();

        this.$element.actualHeight(this.$element.parent().height());
    }
}