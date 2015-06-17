import BaseExpandPanel = require("./BaseExpandPanel");
import Utils = require("../../Utils");

class RightPanel extends BaseExpandPanel {

    static CLOSE_RIGHT_PANEL: string = 'onCloseRightPanel';
    static OPEN_RIGHT_PANEL: string = 'onOpenRightPanel';

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
        return this.isExpanded ? this.options.panelCollapsedWidth : this.options.panelExpandedWidth;
    }

    getTargetLeft(): number {
        return this.isExpanded ? this.$element.parent().width() - this.options.panelCollapsedWidth : this.$element.parent().width() - this.options.panelExpandedWidth;
    }

    toggleFinish(): void {
        super.toggleFinish();

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

export = RightPanel;