import { IIIFEvents } from "../../IIIFEvents";
import { LeftPanel } from "../uv-shared-module/LeftPanel";
import { Config } from "../../extensions/uv-aleph-extension/config/Config";
import { createRoot, Root } from "react-dom/client";
import { createElement } from "react";
import { ControlPanel } from "aleph-r3f";
import "aleph-r3f/dist/style.css";

export class AlephR3FLeftPanel extends LeftPanel<
  Config["modules"]["leftPanel"]
> {
  controlPanelRoot: Root;

  constructor($element: JQuery) {
    super($element);
  }

  async create(): Promise<void> {
    this.setConfig("leftPanel");
    super.create();

    this.setTitle("CONTROLS");

    this.controlPanelRoot = createRoot(this.$main[0]);
    // this.buttonRoot.render(createElement(Button, { getStore }));
    this.controlPanelRoot.render(createElement(ControlPanel, {}));
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
  }
}
