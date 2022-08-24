const $ = window.$;
import { FooterPanel as BaseFooterPanel } from "../uv-shared-module/FooterPanel";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";

export class FooterPanel extends BaseFooterPanel {
  $rotateButton: JQuery;
  //$spacer: JQuery;
  $zoomInButton: JQuery;
  $zoomOutButton: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("mobileFooterPanel");

    super.create();

    // this.$spacer = $('<div class="spacer"></div>');
    // this.$options.prepend(this.$spacer);

    this.$rotateButton = $(`
            <button class="btn imageBtn rotate" title="${this.content.rotateRight}">
                <i class="uv-icon-rotate" aria-hidden="true"></i>${this.content.rotateRight}
            </button>
        `);
    this.$options.prepend(this.$rotateButton);

    this.$zoomOutButton = $(`
            <button class="btn imageBtn zoomOut" title="${this.content.zoomOut}">
                <i class="uv-icon-zoom-out" aria-hidden="true"></i>${this.content.zoomOut}
            </button>
        `);
    this.$options.prepend(this.$zoomOutButton);

    this.$zoomInButton = $(`
            <button class="btn imageBtn zoomIn" title="${this.content.zoomIn}">
                <i class="uv-icon-zoom-in" aria-hidden="true"></i>${this.content.zoomIn}
            </button>
        `);
    this.$options.prepend(this.$zoomInButton);

    this.$zoomInButton.onPressed(() => {
      this.extensionHost.publish(OpenSeadragonExtensionEvents.ZOOM_IN);
    });

    this.$zoomOutButton.onPressed(() => {
      this.extensionHost.publish(OpenSeadragonExtensionEvents.ZOOM_OUT);
    });

    this.$rotateButton.onPressed(() => {
      this.extensionHost.publish(OpenSeadragonExtensionEvents.ROTATE);
    });
  }

  resize(): void {
    super.resize();

    setTimeout(() => {
      this.$options.css(
        "left",
        Math.floor(this.$element.width() / 2 - this.$options.width() / 2)
      );
    }, 1);
  }
}
