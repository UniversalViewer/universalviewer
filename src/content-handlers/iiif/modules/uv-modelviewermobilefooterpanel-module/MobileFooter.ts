import { BaseConfig } from "../../BaseConfig";
import { FooterPanel as BaseFooterPanel } from "../uv-shared-module/FooterPanel";

export class FooterPanel<
  T extends BaseConfig["modules"]["footerPanel"],
> extends BaseFooterPanel<T> {
  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("mobileFooterPanel");

    super.create();
  }

  resize(): void {
    super.resize();

    setTimeout(() => {
      this.$options.css(
        "left",
        Math.floor(this.$element.width() / 2 - this.$options.width() / 2)
      );
    }, 100);
  }
}
