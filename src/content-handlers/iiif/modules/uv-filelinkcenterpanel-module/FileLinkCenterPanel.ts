const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { sanitize } from "../../../../Utils";
import {
  Annotation,
  AnnotationBody,
  Canvas,
  IExternalResource,
  LanguageMap,
} from "manifesto.js";
import { Events } from "../../../../Events";

export class FileLinkCenterPanel extends CenterPanel {
  $scroll: JQuery;
  $downloadItems: JQuery;
  $downloadItemTemplate: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("fileLinkCenterPanel");

    super.create();

    this.extensionHost.subscribe(
      IIIFEvents.OPEN_EXTERNAL_RESOURCE,
      (resources: IExternalResource[]) => {
        this.openMedia(resources);
      }
    );

    this.$scroll = $('<div class="scroll"></div>');
    this.$content.append(this.$scroll);

    this.$downloadItems = $("<ol></ol>");
    this.$scroll.append(this.$downloadItems);

    this.$downloadItemTemplate = $(
      '<li><img/><div class="col2"><a class="filename" target="_blank" download=""></a><span class="label"></span><a class="description" target="_blank" download=""></a></div></li>'
    );

    this.title = this.extension.helper.getLabel();
  }

  async openMedia(resources: IExternalResource[]) {
    await this.extension.getExternalResources(resources);

    const canvas: Canvas = this.extension.helper.getCurrentCanvas();
    const annotations: Annotation[] = canvas.getContent();

    let $item: JQuery;

    for (let i = 0; i < annotations.length; i++) {
      const annotation: Annotation = annotations[i];

      if (!annotation.getBody().length) {
        continue;
      }

      $item = this.$downloadItemTemplate.clone();
      const $fileName: JQuery = $item.find(".filename");
      const $label: JQuery = $item.find(".label");
      const $thumb: JQuery = $item.find("img");
      const $description: JQuery = $item.find(".description");

      const annotationBody: AnnotationBody = annotation.getBody()[0];

      const id: string | null = annotationBody.getProperty("id");

      if (id) {
        $fileName.prop("href", id);
        $fileName.text(id.substr(id.lastIndexOf("/") + 1));
      }

      let label: string | null = LanguageMap.getValue(
        annotationBody.getLabel()
      );

      if (label) {
        $label.text(sanitize(label));
      }

      const thumbnail: string = annotation.getProperty("thumbnail");

      if (thumbnail) {
        $thumb.prop("src", thumbnail);
      } else {
        $thumb.hide();
      }

      let description: string | null = annotationBody.getProperty(
        "description"
      );

      if (description) {
        $description.text(sanitize(description));

        if (id) {
          $description.prop("href", id);
        }
      }

      this.$downloadItems.append($item);
    }

    this.extensionHost.publish(Events.EXTERNAL_RESOURCE_OPENED);
    this.extensionHost.publish(Events.LOAD);
  }

  resize() {
    super.resize();

    if (this.title) {
      this.$title.text(sanitize(this.title));
    }

    this.$scroll.height(
      this.$content.height() - this.$scroll.verticalMargins()
    );
  }
}
