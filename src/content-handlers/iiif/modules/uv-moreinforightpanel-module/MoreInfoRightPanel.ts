const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { RightPanel } from "../uv-shared-module/RightPanel";
import { sanitize } from "../../../../Utils";
import { Bools, Urls } from "@edsilv/utils";
import { Range } from "manifesto.js";
import { UriLabeller } from "@iiif/manifold";
import { MetadataComponent, LimitType } from "@iiif/iiif-metadata-component";

export class MoreInfoRightPanel extends RightPanel {
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

    this.$metadata = $('<div class="iiif-metadata-component"></div>');
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

        if (rangeId) {
          const range: Range | null = this.extension.helper.getRangeById(
            rangeId
          );

          if (range) {
            this.extensionHost.publish(IIIFEvents.RANGE_CHANGE, range);
          }
        }

        // Time change.
        const time: string | null = Urls.getHashParameterFromString(
          "t",
          href
        );

        if (time !== null) {
          const timeAsNumber = Number(time);
          if (!Number.isNaN(timeAsNumber)) {
            this.extensionHost.publish(IIIFEvents.CURRENT_TIME_CHANGE, timeAsNumber);
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
        this.config.license ? this.config.license : {}
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
  }
}
