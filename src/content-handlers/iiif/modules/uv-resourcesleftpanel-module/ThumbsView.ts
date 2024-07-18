import { ThumbsView as BaseView } from "../uv-shared-module/ThumbsView";
import { ExtendedLeftPanel } from "../../extensions/config/ExtendedLeftPanel";

export class ThumbsView extends BaseView<ExtendedLeftPanel> {
  create(): void {
    this.setConfig("resourcesLeftPanel");
    super.create();
  }
}
