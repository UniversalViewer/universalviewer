const $ = require("jquery");
import { IIIFEvents } from "../../IIIFEvents";
import { LeftPanel } from "../uv-shared-module/LeftPanel";
import { EbookExtensionEvents } from "../../extensions/uv-ebook-extension/Events";
import { Async } from "../../Utils";
import {
  applyPolyfills,
  defineCustomElements,
} from "@universalviewer/uv-ebook-components/loader";
import { Config } from "../../extensions/uv-ebook-extension/config/Config";

export class EbookLeftPanel extends LeftPanel<
  Config["modules"]["ebookLeftPanel"]
> {
  private _ebookTOC: any;
  private _$container: JQuery;
  private _$ebookTOC: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  async create(): Promise<void> {
    this.setConfig("ebookLeftPanel");
    super.create();

    this._$container = $('<div class="container"></div>');

    await applyPolyfills();
    defineCustomElements(window);

    this._ebookTOC = document.createElement("uv-ebook-toc");
    this._$ebookTOC = $(this._ebookTOC);
    //this._ebookTOC.setAttribute("src-tab-enabled", this.config.options.srcTabEnabled);
    this.$main.addClass("disabled");
    this.$main.append(this._$container);
    this._$container.append(this._$ebookTOC);

    this.setTitle(this.content.title);

    this.extensionHost.subscribe(
      EbookExtensionEvents.LOADED_NAVIGATION,
      (navigation: any) => {
        this.$main.removeClass("disabled");
        this._ebookTOC.toc = navigation.toc;
      }
    );

    this.extensionHost.subscribe(
      EbookExtensionEvents.RELOCATED,
      (location: any) => {
        this._ebookTOC.selected = location.start.href;
      }
    );

    this._ebookTOC.addEventListener("itemClicked", (e: any) => {
      this.extensionHost.publish(EbookExtensionEvents.ITEM_CLICKED, e.detail);
      if (this.extension.isMetric("sm")) {
        this.toggle(true);
      }
      false;
    });

    Async.waitFor(
      () => {
        return window.customElements !== undefined;
      },
      () => {
        customElements.whenDefined("uv-ebook-toc").then(() => {
          this.extensionHost.publish(EbookExtensionEvents.TOC_READY);
        });
      }
    );
  }

  expandFullStart(): void {
    super.expandFullStart();
    this.extensionHost.publish(IIIFEvents.LEFTPANEL_EXPAND_FULL_START);
  }

  expandFullFinish(): void {
    super.expandFullFinish();
    this.extensionHost.publish(IIIFEvents.LEFTPANEL_EXPAND_FULL_FINISH);
  }

  collapseFullStart(): void {
    super.collapseFullStart();
    this.extensionHost.publish(IIIFEvents.LEFTPANEL_COLLAPSE_FULL_START);
  }

  collapseFullFinish(): void {
    super.collapseFullFinish();
    this.extensionHost.publish(IIIFEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
  }

  resize(): void {
    super.resize();
    this._$container.height(
      this.$main.height() - this._$container.verticalPadding()
    );
  }
}
