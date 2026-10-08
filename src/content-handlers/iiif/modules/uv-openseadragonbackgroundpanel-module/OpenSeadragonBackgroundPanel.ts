import { BackgroundPanel } from "../uv-shared-module/BackgroundPanel";
import { Config } from "../../extensions/uv-openseadragon-extension/config/Config";

export class OpenSeadragonBackgroundPanel extends BackgroundPanel<
  // todo: add config
  Config["modules"]["openSeadragonCenterPanel"]
> {
  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    super.create();
  }

  resize(): void {
    super.resize();
  }
}
