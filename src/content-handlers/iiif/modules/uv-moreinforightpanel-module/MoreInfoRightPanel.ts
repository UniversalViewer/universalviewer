const $ = require("jquery");
import { IIIFEvents } from "../../IIIFEvents";
import { RightPanel } from "../uv-shared-module/RightPanel";
import { sanitize } from "../../../../Utils";
import { Bools, Urls } from "../../Utils";
import { Range } from "manifesto.js";
import { UriLabeller } from "@iiif/manifold";
import {
  MetadataComponent,
  LimitType,
} from "../uv-shared-module/MetadataComponent";
import { MoreInfoRightPanel as MoreInfoRightPanelConfig } from "../../BaseConfig";

export class MoreInfoRightPanel extends RightPanel<MoreInfoRightPanelConfig> {
  metadataComponent: any;
  $metadata: JQuery;
  limitType: any;
  limit: number;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("moreInfoRightPanel");

    super.create();

    this.extensionHost.subscribe(IIIFEvents.CANVAS_INDEX_CHANGE, () => {
      this.databind();
    });

    this.extensionHost.subscribe(IIIFEvents.RANGE_CHANGE, () => {
      this.databind();
    });

    this.setTitle(this.config.content.title);

    this.$metadata = $('<article class="iiif-metadata-component"></article>');
    this.$main.append(this.$metadata);

    this.metadataComponent = new MetadataComponent({
      target: <HTMLElement>this.$metadata[0],
      data: this._getData(),
    });

    this.metadataComponent.on(
      "iiifViewerLinkClicked",
      (href: string) => {
        // Range change.
        const rangeId: string | null = Urls.getHashParameterFromString(
          "rid",
          href
        );
        // Time change.
        const time: string | null = Urls.getHashParameterFromString("t", href);

        if (rangeId && time === null) {
          const range: Range | null =
            this.extension.helper.getRangeById(rangeId);

          if (range) {
            this.extensionHost.publish(IIIFEvents.RANGE_CHANGE, range);
          }
        }

        if (time !== null) {
          const timeAsNumber = Number(time);
          if (!Number.isNaN(timeAsNumber)) {
            if (rangeId) {
              // We want to make the time change RELATIVE to the start of the range.
              const range: Range | null =
                this.extension.helper.getRangeById(rangeId);
              if (range) {
                this.extensionHost.publish(IIIFEvents.RANGE_TIME_CHANGE, {
                  rangeId: range.id,
                  time: timeAsNumber,
                });
              }
            } else {
              this.extensionHost.publish(
                IIIFEvents.CURRENT_TIME_CHANGE,
                timeAsNumber
              );
            }
          }
        }
      },
      false
    );
  }

  toggleFinish(): void {
    super.toggleFinish();
    this.databind();
  }

  databind(): void {
    this.metadataComponent.set(this._getData());
  }

  private _getCurrentRange(): Range | null {
    const range: Range | null = this.extension.helper.getCurrentRange();
    return range;
  }

  private _getData() {
    const canvases = this.extension.getCurrentCanvases();

    return {
      canvasDisplayOrder: this.config.options.canvasDisplayOrder,
      canvases: canvases,
      canvasExclude: this.config.options.canvasExclude,
      canvasLabels: this.extension.getCanvasLabels(this.content.page),
      content: this.config.content,
      copiedMessageDuration: 2000,
      copyToClipboardEnabled: Bools.getBool(
        this.config.options.copyToClipboardEnabled,
        false
      ),
      helper: this.extension.helper,
      licenseFormatter: new UriLabeller(
        this.content.license ? this.content.license : {}
      ),
      limit: this.config.options.textLimit || 4,
      limitType: LimitType.LINES,
      limitToRange: Bools.getBool(this.config.options.limitToRange, false),
      manifestDisplayOrder: this.config.options.manifestDisplayOrder,
      manifestExclude: this.config.options.manifestExclude,
      range: this._getCurrentRange(),
      rtlLanguageCodes: this.config.options.rtlLanguageCodes,
      sanitizer: (html: string) => {
        return sanitize(html);
      },
      showAllLanguages: this.config.options.showAllLanguages,
    };
  }

  resize(): void {
    super.resize();

    this.$main.height(
      this.$element.height() - this.$top.height() - this.$main.verticalMargins()
    );

    // always put tabindex on, so the main is focusable,
    // just in case there's something wrong with the height
    // comparison below
    this.$main.attr("tabindex", 0);
    this.$main.attr("aria-label", this.config.content.title);

    // if metadata's height lte main's, no scroll, so no focus needed
    // and no aria label either
    if (this.$metadata.height() <= this.$main.height()) {
      this.$main.removeAttr("tabindex");
      this.$main.removeAttr("aria-label");
    }
  }
}
