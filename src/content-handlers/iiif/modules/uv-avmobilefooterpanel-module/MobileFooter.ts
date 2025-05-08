import { Config } from "../../extensions/uv-av-extension/config/Config";
import { FooterPanel as BaseFooterPanel } from "../uv-shared-module/FooterPanel";

export class FooterPanel extends BaseFooterPanel<
  Config["modules"]["mobileFooterPanel"]
> {
  $fullScreenBtn: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("mobileFooterPanel");

    super.create();
  }

  resize(): void {
    super.resize();

    this.$options.css(
      "left",
      Math.floor(this.$element.width() / 2 - this.$options.width() / 2)
    );
  }
}
