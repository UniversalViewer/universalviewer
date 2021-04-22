import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
// import { Position } from "../uv-shared-module/Position";
import {
  IExternalResource,
  Canvas,
  Annotation,
  AnnotationBody
} from "manifesto.js";

export class SlideAtlasCenterPanel extends CenterPanel {

  constructor($element: JQuery) {
    super($element);
    // this.attributionPosition = Position.BOTTOM_RIGHT;
  }

  async create(): Promise<void> {
    this.setConfig("slideAtlasCenterPanel");
    console.log("slide atlas center panel");
    super.create();
    this.$title.hide();
  }

  openMedia(resources: IExternalResource[]) {
    this.extension.getExternalResources(resources).then(() => {
      let canvas: Canvas = this.extension.helper.getCurrentCanvas();

      const annotations: Annotation[] = canvas.getContent();

      if (annotations.length) {
        const annotation: Annotation = annotations[0];
        const body: AnnotationBody[] = annotation.getBody();

        if (body.length) {
          const media: AnnotationBody = body[0];
          //const format: MediaType | null = media.getFormat();

          console.log("loaded", media.id);
        }
      }

      this.component.publish(BaseEvents.EXTERNAL_RESOURCE_OPENED);
      this.component.publish(BaseEvents.LOAD);
    });
  }

  resize() {
    super.resize();
  }
}
