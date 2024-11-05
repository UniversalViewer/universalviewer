import { IIIFEvents } from "../../IIIFEvents";
import { LeftPanel } from "../uv-shared-module/LeftPanel";
import { AlephExtensionEvents } from "../../extensions/uv-aleph-extension/Events";
import {
  applyPolyfills,
  defineCustomElements,
} from "@universalviewer/aleph/loader";
import { Config } from "../../extensions/uv-aleph-extension/config/Config";

export class AlephLeftPanel extends LeftPanel<
  Config["modules"]["alephLeftPanel"]
> {
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

    this.extensionHost.subscribe(AlephExtensionEvents.LOADED, (args: any) => {
      this.$main.removeClass("disabled");
    });

    this.extensionHost.subscribe(
      AlephExtensionEvents.VIEWER_CHANGE,
      (state: any) => {
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
      }
    );

    this._alControlPanel.addEventListener(
      "boundingBoxEnabledChange",
      (e: any) => {
        this.extensionHost.publish(
          AlephExtensionEvents.BOUNDING_BOX_ENABLED_CHANGE,
          e.detail
        );
      },
      false
    );

    this._alControlPanel.addEventListener(
      "controlsTypeChange",
      (e: any) => {
        this.extensionHost.publish(
          AlephExtensionEvents.CONTROLS_TYPE_CHANGE,
          e.detail
        );
      },
      false
    );

    this._alControlPanel.addEventListener(
      "deleteAngle",
      (e: any) => {
        this.extensionHost.publish(AlephExtensionEvents.DELETE_ANGLE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "deleteEdge",
      (e: any) => {
        this.extensionHost.publish(AlephExtensionEvents.DELETE_EDGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "deleteNode",
      (e: any) => {
        this.extensionHost.publish(AlephExtensionEvents.DELETE_NODE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "displayModeChange",
      (e: any) => {
        this.extensionHost.publish(
          AlephExtensionEvents.DISPLAY_MODE_CHANGE,
          e.detail
        );
      },
      false
    );

    this._alControlPanel.addEventListener(
      "graphEnabledChange",
      (e: any) => {
        this.extensionHost.publish(
          AlephExtensionEvents.GRAPH_ENABLED_CHANGE,
          e.detail
        );
      },
      false
    );

    this._alControlPanel.addEventListener(
      "graphSubmitted",
      (e: any) => {
        const graph = JSON.parse(e.detail);
        if (graph) {
          this.extensionHost.publish(AlephExtensionEvents.CLEAR_GRAPH);
          this.extensionHost.publish(AlephExtensionEvents.SET_GRAPH, graph);
        }
      },
      false
    );

    this._alControlPanel.addEventListener(
      "orientationChange",
      (e: any) => {
        this.extensionHost.publish(
          AlephExtensionEvents.ORIENTATION_CHANGE,
          e.detail
        );
      },
      false
    );

    this._alControlPanel.addEventListener(
      "recenter",
      (e: any) => {
        this.extensionHost.publish(AlephExtensionEvents.RECENTER, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "saveNode",
      (e: any) => {
        this.extensionHost.publish(AlephExtensionEvents.SET_NODE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "selectedChange",
      (e: any) => {
        this.extensionHost.publish(AlephExtensionEvents.SELECT_NODE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "slicesIndexChange",
      (e: any) => {
        this.extensionHost.publish(
          AlephExtensionEvents.SLICES_INDEX_CHANGE,
          e.detail
        );
      },
      false
    );

    this._alControlPanel.addEventListener(
      "slicesBrightnessChange",
      (e: any) => {
        this.extensionHost.publish(
          AlephExtensionEvents.VOLUME_BRIGHTNESS_CHANGE,
          e.detail
        );
      },
      false
    );

    this._alControlPanel.addEventListener(
      "slicesContrastChange",
      (e: any) => {
        this.extensionHost.publish(
          AlephExtensionEvents.VOLUME_CONTRAST_CHANGE,
          e.detail
        );
      },
      false
    );

    this._alControlPanel.addEventListener(
      "unitsChange",
      (e: any) => {
        this.extensionHost.publish(AlephExtensionEvents.UNITS_CHANGE, e.detail);
      },
      false
    );

    this._alControlPanel.addEventListener(
      "volumeStepsChange",
      (e: any) => {
        this.extensionHost.publish(
          AlephExtensionEvents.VOLUME_STEPS_CHANGE,
          e.detail
        );
      },
      false
    );

    this._alControlPanel.addEventListener(
      "volumeBrightnessChange",
      (e: any) => {
        this.extensionHost.publish(
          AlephExtensionEvents.VOLUME_BRIGHTNESS_CHANGE,
          e.detail
        );
      },
      false
    );

    this._alControlPanel.addEventListener(
      "volumeContrastChange",
      (e: any) => {
        this.extensionHost.publish(
          AlephExtensionEvents.VOLUME_CONTRAST_CHANGE,
          e.detail
        );
      },
      false
    );
  }

  expandFullStart(): void {
    super.expandFullStart();
    this.extensionHost.publish(IIIFEvents.LEFTPANEL_EXPAND_FULL_START);
  }

  expandFullFinish(): void {
    super.expandFullFinish();
    this.extensionHost.publish(IIIFEvents.LEFTPANEL_EXPAND_FULL_FINISH);
  }

  collapseFullStart(): void {
    super.collapseFullStart();
    this.extensionHost.publish(IIIFEvents.LEFTPANEL_COLLAPSE_FULL_START);
  }

  collapseFullFinish(): void {
    super.collapseFullFinish();
    this.extensionHost.publish(IIIFEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
  }

  resize(): void {
    super.resize();

    if (this._alControlPanel) {
      this._alControlPanel.tabContentHeight = this.$main.height() - 68 + "px";
    }
  }
}
