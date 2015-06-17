import BaseExpandPanel = require("./BaseExpandPanel");
import Utils = require("../../Utils");

class LeftPanel extends BaseExpandPanel {

    static CLOSE_LEFT_PANEL: string = 'onCloseLeftPanel';
    static OPEN_LEFT_PANEL: string = 'onOpenLeftPanel';

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
            this.toggle(true);
        }
    }

    getTargetWidth(): number {
        if (this.isFullyExpanded || !this.isExpanded){
            return this.options.panelExpandedWidth;
        } else {
            return this.options.panelCollapsedWidth;
        }
    }

    getFullTargetWidth(): number{
        return this.$element.parent().width();
    }

    toggleFinish(): void {
        super.toggleFinish();

        if (this.isExpanded){
            $.publish(LeftPanel.OPEN_LEFT_PANEL);
        } else {
            $.publish(LeftPanel.CLOSE_LEFT_PANEL);
        }
    }

    resize(): void {
        super.resize();

        if (this.isFullyExpanded){
            this.$element.width(this.$element.parent().width());
        }
    }
}

export = LeftPanel;