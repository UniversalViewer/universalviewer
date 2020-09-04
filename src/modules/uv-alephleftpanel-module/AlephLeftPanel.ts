import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { LeftPanel } from "../uv-shared-module/LeftPanel";
import { Events } from "../../extensions/uv-aleph-extension/Events";
import {
  applyPolyfills,
  defineCustomElements
} from "@universalviewer/aleph/loader";

export class AlephLeftPanel extends LeftPanel {
  private _alControlPanel: any;

  constructor($element: JQuery) {
    super($element);
  }

  async create(): Promise<void> {
    this.setConfig("alephLeftPanel");
    super.create();

    await applyPolyfills();
    defineCustomElements(window);

    this._alControlPanel = document.createElement("al-control-panel");
    this._alControlPanel.setAttribute(
      "src-tab-enabled",
      this.config.options.srcTabEnabled
    );
    this._alControlPanel.setAttribute(
      "settings-tab-enabled",
      this.config.options.settingsTabEnabled
    );
    this._alControlPanel.setAttribute(
      "graph-tab-enabled",
      this.config.options.graphTabEnabled
    );
    this._alControlPanel.setAttribute(
      "console-tab-enabled",
      this.config.options.consoleTabEnabled
    );
    this._alControlPanel.setAttribute("height", "100%");
    this.$main.addClass("disabled");
    this.$main.append(this._alControlPanel);

    this.setTitle(this.content.title);

    this.component.subscribe(Events.LOADED, (args: any) => {
      this.$main.removeClass("disabled");
    });

    this.component.subscribe(Events.VIEWER_CHANGE, (state: any) => {
      this._alControlPanel.angles = state.angles;
      this._alControlPanel.boundingBoxEnabled = state.boundingBoxEnabled;
      this._alControlPanel.controlsType = state.controlsType;
      this._alControlPanel.displayMode = state.displayMode;
      this._alControlPanel.edges = state.edges;
      this._alControlPanel.graphEnabled = state.graphEnabled;
      this._alControlPanel.nodes = state.nodes;
      this._alControlPanel.selected = state.selected;
      this._alControlPanel.units = state.units;
      this._alControlPanel.slicesIndex = state.slicesIndex;
      this._alControlPanel.slicesBrightness = state.volumeWindowCenter;
      this._alControlPanel.slicesContrast = state.volumeWindowWidth;
      this._alControlPanel.volumeSteps = state.volumeSteps;
      this._alControlPanel.volumeBrightness = state.volumeWindowCenter;
      this._alControlPanel.volumeContrast = state.volumeWindowWidth;
    });

    this._alControlPanel.addEventListener(
      "boundingBoxEnabledChange",
      (e: any) => {
        this.component.publish(Events.BOUNDING_BOX_ENABLED_CHANGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "controlsTypeChange",
      (e: any) => {
        this.component.publish(Events.CONTROLS_TYPE_CHANGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "deleteAngle",
      (e: any) => {
        this.component.publish(Events.DELETE_ANGLE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "deleteEdge",
      (e: any) => {
        this.component.publish(Events.DELETE_EDGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "deleteNode",
      (e: any) => {
        this.component.publish(Events.DELETE_NODE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "displayModeChange",
      (e: any) => {
        this.component.publish(Events.DISPLAY_MODE_CHANGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "graphEnabledChange",
      (e: any) => {
        this.component.publish(Events.GRAPH_ENABLED_CHANGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "graphSubmitted",
      (e: any) => {
        const graph = JSON.parse(e.detail);
        if (graph) {
          this.component.publish(Events.CLEAR_GRAPH);
          this.component.publish(Events.SET_GRAPH, graph);
        }
      },
      false
    );

    this._alControlPanel.addEventListener(
      "orientationChange",
      (e: any) => {
        this.component.publish(Events.ORIENTATION_CHANGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "recenter",
      (e: any) => {
        this.component.publish(Events.RECENTER, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "saveNode",
      (e: any) => {
        this.component.publish(Events.SET_NODE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "selectedChange",
      (e: any) => {
        this.component.publish(Events.SELECT_NODE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "slicesIndexChange",
      (e: any) => {
        this.component.publish(Events.SLICES_INDEX_CHANGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "slicesBrightnessChange",
      (e: any) => {
        this.component.publish(Events.VOLUME_BRIGHTNESS_CHANGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "slicesContrastChange",
      (e: any) => {
        this.component.publish(Events.VOLUME_CONTRAST_CHANGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "unitsChange",
      (e: any) => {
        this.component.publish(Events.UNITS_CHANGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "volumeStepsChange",
      (e: any) => {
        this.component.publish(Events.VOLUME_STEPS_CHANGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "volumeBrightnessChange",
      (e: any) => {
        this.component.publish(Events.VOLUME_BRIGHTNESS_CHANGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "volumeContrastChange",
      (e: any) => {
        this.component.publish(Events.VOLUME_CONTRAST_CHANGE, e.detail);
      },
      false
    );
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

    if (this._alControlPanel) {
      this._alControlPanel.tabContentHeight = this.$main.height() - 68 + "px";
    }
  }
}
