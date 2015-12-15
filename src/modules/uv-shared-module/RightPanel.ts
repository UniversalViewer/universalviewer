import BaseCommands = require("./BaseCommands");
import BaseExpandPanel = require("./BaseExpandPanel");

class RightPanel extends BaseExpandPanel {

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
            $.publish(BaseCommands.OPEN_RIGHT_PANEL);
        } else {
            $.publish(BaseCommands.CLOSE_RIGHT_PANEL);
        }
    }

    resize(): void {
        super.resize();

        this.$element.css({
            'left': Math.floor(this.$element.parent().width() - this.$element.outerWidth())
        });
    }
}

export = RightPanel;