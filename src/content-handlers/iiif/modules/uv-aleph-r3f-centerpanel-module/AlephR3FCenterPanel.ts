const $ = require("jquery");
import { AnnotationBody, Canvas, IExternalResource } from "manifesto.js";
import { sanitize } from "../../../../Utils";
import { IIIFEvents } from "../../IIIFEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Async } from "@edsilv/utils";
import { Events } from "../../../../Events";
import { Config } from "../../extensions/uv-model-viewer-extension/config/Config";
import { createRoot, Root } from "react-dom/client";
import { createElement } from "react";
import { Viewer } from "aleph-r3f";
import "aleph-r3f/dist/style.css";

export class AlephR3FCenterPanel extends CenterPanel<
  Config["modules"]["centerPanel"]
> {
  $modelviewer: JQuery;
  $spinner: JQuery;
  viewerRoot: Root;

  isLoaded: boolean = false;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("centerPanel");

    super.create();

    const that = this;

    this.viewerRoot = createRoot(this.$content[0]);

    this.extensionHost.subscribe(
      IIIFEvents.OPEN_EXTERNAL_RESOURCE,
      (resources: IExternalResource[]) => {
        that.openMedia(resources);
      }
    );

    this.title = this.extension.helper.getLabel();

    this.$spinner = $('<div class="spinner"></div>');
    this.$content.prepend(this.$spinner);
  }

  whenLoaded(cb: () => void): void {
    Async.waitFor(() => {
      return this.isLoaded;
    }, cb);
  }

  async openMedia(resources: IExternalResource[]) {
    this.$spinner.show();
    await this.extension.getExternalResources(resources);

    let mediaUri: string | null = null;
    let canvas: Canvas = this.extension.helper.getCurrentCanvas();
    const formats: AnnotationBody[] | null = this.extension.getMediaFormats(
      canvas
    );

    if (formats && formats.length) {
      mediaUri = formats[0].id;
    } else {
      mediaUri = canvas.id;
    }

    this.viewerRoot.render(
      createElement(Viewer, {
        src: mediaUri,
        onLoad: (e) => {
          this.resize();
        },
      })
    );

    this.extensionHost.publish(Events.EXTERNAL_RESOURCE_OPENED);
  }

  resize() {
    super.resize();

    this.$spinner.css(
      "top",
      this.$content.height() / 2 - this.$spinner.height() / 2
    );
    this.$spinner.css(
      "left",
      this.$content.width() / 2 - this.$spinner.width() / 2
    );

    if (this.title) {
      this.$title.text(sanitize(this.title));
    }
  }
}
