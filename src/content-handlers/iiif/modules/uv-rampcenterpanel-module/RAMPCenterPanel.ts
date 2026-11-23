import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { IIIFEvents } from "../../IIIFEvents";
import { Config } from "../../extensions/uv-ramp-extension/config/Config";
export class RAMPCenterPanel extends CenterPanel<
  Config["modules"]["avCenterPanel"]
> {
  create(): void {
    this.setConfig("avCenterPanel");
    super.create();

    // VideoJS uses ResizeObserver internally so we don't need to
    // do anything here, but the subscriptions are useful if we later
    // need to notify RAMP of layout changes
    this.extensionHost.subscribe(IIIFEvents.OPEN_LEFT_PANEL, () =>
      this.resize()
    );
    this.extensionHost.subscribe(IIIFEvents.OPEN_RIGHT_PANEL, () =>
      this.resize()
    );
  }

  resize(): void {
    super.resize();
  }
}
