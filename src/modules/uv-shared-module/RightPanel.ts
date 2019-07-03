import {BaseEvents} from "./BaseEvents";
import {BaseExpandPanel} from "./BaseExpandPanel";

export class RightPanel extends BaseExpandPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();
        this.$element.width(this.options.panelCollapsedWidth);
    }

    init(): void{
        super.init();

        const shouldOpenPanel: boolean = Utils.Bools.getBool(this.extension.getSettings().rightPanelOpen, this.options.panelOpen);
        
        if (shouldOpenPanel) {
            this.toggle(true);
        }

        this.component.subscribe(BaseEvents.TOGGLE_EXPAND_RIGHT_PANEL, () => {
            if (this.isFullyExpanded) {
                this.collapseFull();
            } else {
                this.expandFull();
            }
        });
    }

    getTargetWidth(): number {
        return this.isExpanded ? this.options.panelCollapsedWidth : this.options.panelExpandedWidth;
    }

    getTargetLeft(): number {
        return this.isExpanded ? this.$element.parent().width() - this.options.panelCollapsedWidth : this.$element.parent().width() - this.options.panelExpandedWidth;
    }

    toggleFinish(): void {
        super.toggleFinish();

        if (this.isExpanded) {
            this.component.publish(BaseEvents.OPEN_RIGHT_PANEL);
        } else {            
            this.component.publish(BaseEvents.CLOSE_RIGHT_PANEL);
        }
        this.extension.updateSettings({rightPanelOpen: this.isExpanded});
    }

    resize(): void {
        super.resize();

        this.$element.css({
            'left': Math.floor(this.$element.parent().width() - this.$element.outerWidth())
        });
    }
}