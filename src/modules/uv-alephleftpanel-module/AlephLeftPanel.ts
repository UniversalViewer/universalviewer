import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {LeftPanel} from "../uv-shared-module/LeftPanel";
import { Events } from "../../extensions/uv-aleph-extension/Events";

export class AlephLeftPanel extends LeftPanel {

    private _$controlPanel: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        this.setConfig('alephLeftPanel');
        super.create();

        this._$controlPanel = $('<al-control-panel></al-control-panel>');
        const alControlPanel: any = this._$controlPanel[0];
        this.$main.addClass('disabled');
        this.$main.append(this._$controlPanel);
        this.setTitle(this.content.title);

        this.component.subscribe(Events.LOADED, (args: any) => {
            alControlPanel.stackhelper = args.stackhelper;
            alControlPanel.displayMode = args.displayMode;
            this.$main.removeClass('disabled');
        });

        alControlPanel.addEventListener("boundingBoxEnabledChanged", (e: any) => {
            this.component.publish(Events.BOUNDING_BOX_ENABLED_CHANGED, e.detail);
        }, false);

        alControlPanel.addEventListener("controlsTypeChanged", (e: any) => {
            this.component.publish(Events.CONTROLS_TYPE_CHANGED, e.detail);
        }, false);

        alControlPanel.addEventListener("displayModeChanged", (e: any) => {
            this.component.publish(Events.DISPLAY_MODE_CHANGED, e.detail);
        }, false);

        alControlPanel.addEventListener("graphEnabledChanged", (e: any) => {
            this.component.publish(Events.GRAPH_ENABLED_CHANGED, e.detail);
        }, false);

        alControlPanel.addEventListener("orientationChanged", (e: any) => {
            this.component.publish(Events.ORIENTATION_CHANGED, e.detail);
        }, false);

        alControlPanel.addEventListener("recenter", (e: any) => {
            this.component.publish(Events.RECENTER, e.detail);
        }, false);

        alControlPanel.addEventListener("slicesIndexChanged", (e: any) => {
            this.component.publish(Events.SLICES_INDEX_CHANGED, e.detail);
        }, false);

        alControlPanel.addEventListener("slicesWindowCenterChanged", (e: any) => {
            this.component.publish(Events.SLICES_WINDOW_CENTER_CHANGED, e.detail);
        }, false);

        alControlPanel.addEventListener("slicesWindowWidthChanged", (e: any) => {
            this.component.publish(Events.SLICES_WINDOW_WIDTH_CHANGED, e.detail);
        }, false);

        alControlPanel.addEventListener("unitsChanged", (e: any) => {
            this.component.publish(Events.UNITS_CHANGED, e.detail);
        }, false);

        alControlPanel.addEventListener("volumeStepsChanged", (e: any) => {
            this.component.publish(Events.VOLUME_STEPS_CHANGED, e.detail);
        }, false);

        alControlPanel.addEventListener("volumeWindowCenterChanged", (e: any) => {
            this.component.publish(Events.VOLUME_WINDOW_CENTER_CHANGED, e.detail);
        }, false);

        alControlPanel.addEventListener("volumeWindowWidthChanged", (e: any) => {
            this.component.publish(Events.VOLUME_WINDOW_WIDTH_CHANGED, e.detail);
        }, false);
    }

    expandFullStart(): void {
        super.expandFullStart();
        this.component.publish(BaseEvents.LEFTPANEL_EXPAND_FULL_START);
    }

    expandFullFinish(): void {
        super.expandFullFinish();
        this.component.publish(BaseEvents.LEFTPANEL_EXPAND_FULL_FINISH);
    }

    collapseFullStart(): void {
        super.collapseFullStart();
        this.component.publish(BaseEvents.LEFTPANEL_COLLAPSE_FULL_START);
    }

    collapseFullFinish(): void {
        super.collapseFullFinish();
        this.component.publish(BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
    }

    resize(): void {
        super.resize();
    }
}