import BaseCommands = require("./BaseCommands");
import BaseExpandPanel = require("./BaseExpandPanel");

class LeftPanel extends BaseExpandPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        super.create();

        this.$element.width(this.options.panelCollapsedWidth);

        $.subscribe(BaseCommands.TOGGLE_EXPAND_LEFT_PANEL, () => {
            if (this.isFullyExpanded){
                this.collapseFull();
            } else {
                this.expandFull();
            }
        });
    }

    init(): void{
        super.init();

        var panelOpenSaved = Utils.Bools.GetBool(this.provider.getSettings().panelOpenLeftPanel, true);
        if (this.options.panelOpen && panelOpenSaved) {
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
        var settings: ISettings = this.provider.getSettings();

        if (this.isExpanded) {
            settings.panelOpenLeftPanel = true;
            $.publish(BaseCommands.OPEN_LEFT_PANEL);
        } else {           
            settings.panelOpenLeftPanel = false;            
            $.publish(BaseCommands.CLOSE_LEFT_PANEL);
        }
        this.provider.updateSettings(settings);
    }

    resize(): void {
        super.resize();

        if (this.isFullyExpanded){
            this.$element.width(this.$element.parent().width());
        }
    }
}

export = LeftPanel;