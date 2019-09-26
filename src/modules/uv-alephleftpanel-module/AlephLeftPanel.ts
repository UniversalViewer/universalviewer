import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {LeftPanel} from "../uv-shared-module/LeftPanel";
import { Events } from "../../extensions/uv-aleph-extension/Events";

export class AlephLeftPanel extends LeftPanel {

    private _alControlPanel: any;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        this.setConfig("alephLeftPanel");
        super.create();

        this._alControlPanel = document.createElement("al-control-panel");
        this._alControlPanel.setAttribute("src-tab-enabled", this.config.options.srcTabEnabled);
        this._alControlPanel.setAttribute("settings-tab-enabled", this.config.options.settingsTabEnabled);
        this._alControlPanel.setAttribute("graph-tab-enabled", this.config.options.graphTabEnabled);
        this._alControlPanel.setAttribute("console-tab-enabled", this.config.options.consoleTabEnabled);
        this._alControlPanel.setAttribute("height", "100%");
        this.$main.addClass("disabled");
        this.$main.append(this._alControlPanel);

        this.setTitle(this.content.title);

        this.component.subscribe(Events.LOADED, (args: any) => {
            this.$main.removeClass("disabled");
        });

        this.component.subscribe(Events.VIEWER_CHANGED, (state: any) => {
            this._alControlPanel.angles = state.angles;
            this._alControlPanel.boundingBoxEnabled =  state.boundingBoxEnabled;
            this._alControlPanel.controlsType = state.controlsType;
            this._alControlPanel.displayMode = state.displayMode;
            this._alControlPanel.edges = state.edges;
            this._alControlPanel.graphEnabled = state.graphEnabled;
            this._alControlPanel.nodes = state.nodes;
            this._alControlPanel.selected = state.selected;
            this._alControlPanel.units = state.units;
            this._alControlPanel.slicesIndex = state.slicesIndex;
            this._alControlPanel.slicesBrightness = state.slicesWindowCenter;
            this._alControlPanel.slicesContrast = state.slicesWindowWidth;
            this._alControlPanel.volumeBrightness = state.volumeWindowCenter;
            this._alControlPanel.volumeContrast = state.volumeWindowWidth;
        });

        this._alControlPanel.addEventListener("boundingBoxEnabledChanged", (e: any) => {
            this.component.publish(Events.BOUNDING_BOX_ENABLED_CHANGED, e.detail);
        }, false);

        this._alControlPanel.addEventListener("controlsTypeChanged", (e: any) => {
            this.component.publish(Events.CONTROLS_TYPE_CHANGED, e.detail);
        }, false);

        this._alControlPanel.addEventListener("deleteAngle", (e: any) => {
            this.component.publish(Events.DELETE_ANGLE, e.detail);
        },false);

        this._alControlPanel.addEventListener("deleteEdge", (e: any) => {
            this.component.publish(Events.DELETE_EDGE, e.detail);
        },false);

        this._alControlPanel.addEventListener("deleteNode", (e: any) => {
            this.component.publish(Events.DELETE_NODE, e.detail);
        },false);

        this._alControlPanel.addEventListener("displayModeChanged", (e: any) => {
            this.component.publish(Events.DISPLAY_MODE_CHANGED, e.detail);
        }, false);

        this._alControlPanel.addEventListener("graphEnabledChanged", (e: any) => {
            this.component.publish(Events.GRAPH_ENABLED_CHANGED, e.detail);
        }, false);

        this._alControlPanel.addEventListener("graphSubmitted", (e: any) => {
            const graph = JSON.parse(e.detail);
            if (graph) {
                this.component.publish(Events.CLEAR_GRAPH);
                this.component.publish(Events.SET_GRAPH, graph);
            }
        }, false);

        this._alControlPanel.addEventListener("orientationChanged", (e: any) => {
            this.component.publish(Events.ORIENTATION_CHANGED, e.detail);
        }, false);

        this._alControlPanel.addEventListener("recenter", (e: any) => {
            this.component.publish(Events.RECENTER, e.detail);
        }, false);

        this._alControlPanel.addEventListener("saveNode", (e: any) => {
            this.component.publish(Events.SET_NODE, e.detail);
        }, false);

        this._alControlPanel.addEventListener("selectedChanged", (e: any) => {
            this.component.publish(Events.SELECT_NODE, e.detail);
        }, false);

        this._alControlPanel.addEventListener("slicesIndexChanged", (e: any) => {
            this.component.publish(Events.SLICES_INDEX_CHANGED, e.detail);
        }, false);

        this._alControlPanel.addEventListener("slicesBrightnessChanged", (e: any) => {
            this.component.publish(Events.SLICES_BRIGHTNESS_CHANGED, e.detail);
        }, false);

        this._alControlPanel.addEventListener("slicesContrastChanged", (e: any) => {
            this.component.publish(Events.SLICES_CONTRAST_CHANGED, e.detail);
        }, false);

        this._alControlPanel.addEventListener("unitsChanged", (e: any) => {
            this.component.publish(Events.UNITS_CHANGED, e.detail);
        }, false);

        this._alControlPanel.addEventListener("volumeBrightnessChanged", (e: any) => {
            this.component.publish(Events.VOLUME_BRIGHTNESS_CHANGED, e.detail);
        }, false);

        this._alControlPanel.addEventListener("volumeContrastChanged", (e: any) => {
            this.component.publish(Events.VOLUME_CONTRAST_CHANGED, e.detail);
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
        this._alControlPanel.tabContentHeight = this.$main.height() - 68 + "px";
    }
}