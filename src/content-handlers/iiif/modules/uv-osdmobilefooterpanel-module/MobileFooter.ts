const $ = require("jquery");
import { FooterPanel as BaseFooterPanel } from "../uv-shared-module/FooterPanel";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { Config } from "../../extensions/uv-openseadragon-extension/config/Config";

export class FooterPanel extends BaseFooterPanel<
  Config["modules"]["mobileFooterPanel"]
> {
  $rotateButton: JQuery;
  //$spacer: JQuery;
  $zoomInButton: JQuery;
  $zoomOutButton: JQuery;
  $helpButton: JQuery;

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

    this.$helpButton = $(`
      <a class="btn imageBtn help" tabindex="0" title="${this.content.help}" role="button">
        <i class="uv-icon-help" aria-hidden="true"></i>
      </a>
    `);
    this.$options.prepend(this.$helpButton);

    if (this.options.helpEnabled && this.options.helpUrl) {
      this.$helpButton.show();
    } else {
      this.$helpButton.hide();
    }

    this.$helpButton.onPressed(() => {
      window.open(this.options.helpUrl);
    });

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
