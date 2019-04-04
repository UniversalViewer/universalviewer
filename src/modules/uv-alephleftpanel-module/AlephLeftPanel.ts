import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {LeftPanel} from "../uv-shared-module/LeftPanel";

export class AlephLeftPanel extends LeftPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('alephLeftPanel');

        super.create();

        this.$main.append('<al-control-panel nodes-visible="false" options-enabled="true"></al-control-panel>');

        this.setTitle(this.content.title);
    }

    expandFullStart(): void {
        super.expandFullStart();
        $.publish(BaseEvents.LEFTPANEL_EXPAND_FULL_START);
    }

    expandFullFinish(): void {
        super.expandFullFinish();

        $.publish(BaseEvents.LEFTPANEL_EXPAND_FULL_FINISH);
    }

    collapseFullStart(): void {
        super.collapseFullStart();

        $.publish(BaseEvents.LEFTPANEL_COLLAPSE_FULL_START);
    }

    collapseFullFinish(): void {
        super.collapseFullFinish();

        $.publish(BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
    }

    resize(): void {
        super.resize();
    }
}