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

        $.subscribe(Events.LOADED, (e: any, args: any) => {
            alControlPanel.stackhelper = args.stackhelper;
            alControlPanel.displayMode = args.displayMode;
            this.$main.removeClass('disabled');
        });

        alControlPanel.componentOnReady().then(function() {

            alControlPanel.addEventListener("displayModeChanged", function(e: any) {
                $.publish(Events.DISPLAY_MODE_CHANGED, [e.detail]);
            }, false);
  
            alControlPanel.addEventListener("graphEnabledChanged", function(e: any) {
                $.publish(Events.GRAPH_ENABLED_CHANGED, [e.detail]);
            }, false);
  
            alControlPanel.addEventListener("boundingBoxVisibleChanged", function(e: any) {
                $.publish(Events.BOUNDING_BOX_VISIBLE_CHANGED, [e.detail]);
            }, false);
  
            alControlPanel.addEventListener("slicesIndexChanged", function(e: any) {
                $.publish(Events.SLICES_INDEX_CHANGED, [e.detail]);
            }, false);
  
            alControlPanel.addEventListener("orientationChanged", function(e: any) {
                $.publish(Events.ORIENTATION_CHANGED, [e.detail]);
            }, false);
  
            alControlPanel.addEventListener("slicesWindowCenterChanged", function(e: any) {
                $.publish(Events.SLICES_WINDOW_CENTER_CHANGED, [e.detail]);
            }, false);
  
            alControlPanel.addEventListener("slicesWindowWidthChanged", function(e: any) {
                $.publish(Events.SLICES_WINDOW_WIDTH_CHANGED, [e.detail]);
            }, false);
  
            alControlPanel.addEventListener("volumeStepsChanged", function(e: any) {
                $.publish(Events.VOLUME_STEPS_CHANGED, [e.detail]);
            }, false);
  
            alControlPanel.addEventListener("volumeWindowCenterChanged", function(e: any) {
                $.publish(Events.VOLUME_WINDOW_CENTER_CHANGED, [e.detail]);
            }, false);
  
            alControlPanel.addEventListener("volumeWindowWidthChanged", function(e: any) {
                $.publish(Events.VOLUME_WINDOW_WIDTH_CHANGED, [e.detail]);
            }, false);
        });
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