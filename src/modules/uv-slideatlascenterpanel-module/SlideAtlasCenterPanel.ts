import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
// import { Position } from "../uv-shared-module/Position";
import {
  IExternalResource,
  Canvas,
  Annotation,
  AnnotationBody,
  Service
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

    const that = this;

    this.component.subscribe(
      BaseEvents.OPEN_EXTERNAL_RESOURCE,
      (e: any, resources: IExternalResource[]) => {
        that.openMedia(resources);
      }
    );
  }

  openMedia(resources: IExternalResource[]) {
    this.extension.getExternalResources(resources).then(() => {
      let canvas: Canvas = this.extension.helper.getCurrentCanvas();
      debugger;
      const annotations: Annotation[] = canvas.getContent();

      if (annotations.length) {
        const annotation: Annotation = annotations[0];
        const body: AnnotationBody[] = annotation.getBody();

        if (body.length) {
          const services: Service[] = body[0].getServices();

          for (let i = 0; i < services.length; i++) {
            const service: Service = services[i];
            let id = service.id;

            console.log(id);
          }
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
