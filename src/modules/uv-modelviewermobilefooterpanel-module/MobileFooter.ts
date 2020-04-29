import { FooterPanel as BaseFooterPanel } from "../uv-shared-module/FooterPanel";
import { BaseEvents } from "../uv-shared-module/BaseEvents";

export class FooterPanel extends BaseFooterPanel {
  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("mobileFooterPanel");

    super.create();

    this.component.subscribe(BaseEvents.TOGGLE_FULLSCREEN, (data) => {
      if (!data.isFullScreen)
        setTimeout(() => {
          this.resize();
        }, 1100);
    });
  }

  resize(): void {
    super.resize();

    console.log("resize");

    this.$options.css(
      "left",
      Math.floor(this.$element.width() / 2 - this.$options.width() / 2)
    );
  }
}
