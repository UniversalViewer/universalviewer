import { BaseView } from "../uv-shared-module/BaseView";
import { Config } from "../../extensions/uv-openseadragon-extension/config/Config";

export class OpenSeadragonBackgroundPanel extends BaseView<
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
