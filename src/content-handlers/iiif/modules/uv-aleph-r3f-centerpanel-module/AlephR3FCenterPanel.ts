const $ = require("jquery");
import { AnnotationBody, Canvas, IExternalResource } from "manifesto.js";
import { sanitize } from "../../../../Utils";
import { IIIFEvents } from "../../IIIFEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Position } from "../uv-shared-module/Position";
import { Async } from "@edsilv/utils";
import { Events } from "../../../../Events";
import { Config } from "../../extensions/uv-model-viewer-extension/config/Config";
import { createRoot, Root } from "react-dom/client";
import { createElement } from "react";
import { Viewer } from "aleph-r3f";

export class AlephR3FCenterPanel extends CenterPanel<
  Config["modules"]["centerPanel"]
> {
  $viewerContainer: JQuery;
  viewerRoot: Root;

  isLoaded: boolean = false;

  constructor($element: JQuery) {
    super($element);
    this.attributionPosition = Position.BOTTOM_RIGHT;
  }

  create(): void {
    this.setConfig("centerPanel");

    super.create();

    const that = this;

    this.$viewerContainer = $('<div id="viewer"></div>');
    this.$viewerContainer.css("width", "100%");
    this.$viewerContainer.css("height", "100%");
    this.$content.prepend(this.$viewerContainer);

    this.viewerRoot = createRoot(this.$viewerContainer[0]);

    this.extensionHost.subscribe(
      IIIFEvents.OPEN_EXTERNAL_RESOURCE,
      (resources: IExternalResource[]) => {
        that.openMedia(resources);
      }
    );

    this.title = this.extension.helper.getLabel();
  }

  whenLoaded(cb: () => void): void {
    Async.waitFor(() => {
      return this.isLoaded;
    }, cb);
  }

  async openMedia(resources: IExternalResource[]) {
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
    this.extensionHost.publish(Events.LOAD);
  }

  resize() {
    super.resize();

    if (this.title) {
      this.$title.text(sanitize(this.title));
    }
  }
}
