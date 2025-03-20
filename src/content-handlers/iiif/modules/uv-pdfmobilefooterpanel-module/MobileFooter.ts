const $ = require("jquery");
import { Config } from "../../extensions/uv-pdf-extension/config/Config";
import { PDFExtensionEvents } from "../../extensions/uv-pdf-extension/Events";
import { FooterPanel as BaseFooterPanel } from "../uv-shared-module/FooterPanel";

export class FooterPanel extends BaseFooterPanel<
  Config["modules"]["mobileFooterPanel"]
> {
  $fullScreenBtn: JQuery;
  $zoomInButton: JQuery;
  $zoomOutButton: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("mobileFooterPanel");

    super.create();

    this.$zoomOutButton = $(`
      <button class="btn imageBtn zoomOut" title="${this.content.zoomOut}">
          <i class="uv-icon-zoom-out" aria-hidden="true"></i>${this.content.zoomOut}
      </button>
  `);
    if ($('iframe.pdfobject').length === 0) {
      this.$mainOptions.prepend(this.$zoomOutButton);
    }

    this.$zoomInButton = $(`
      <button class="btn imageBtn zoomIn" title="${this.content.zoomIn}">
          <i class="uv-icon-zoom-in" aria-hidden="true"></i>${this.content.zoomIn}
      </button>
  `);
    this.$mainOptions.prepend(this.$zoomInButton);

    if ($('.pdfobject').length === 0) {
      this.$zoomInButton.hide();
      this.$zoomOutButton.hide();
    }

    this.$zoomInButton.onPressed(() => {
      this.extensionHost.publish(PDFExtensionEvents.ZOOM_IN);
    });

    this.$zoomOutButton.onPressed(() => {
      this.extensionHost.publish(PDFExtensionEvents.ZOOM_OUT);
    });
    
  }

  resize(): void {
    super.resize();

    this.$options.css(
      "left",
      Math.floor(this.$element.width() / 2 - this.$options.width() / 2)
    );
  }
}
