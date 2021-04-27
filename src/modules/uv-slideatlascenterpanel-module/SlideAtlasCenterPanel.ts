import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import {
  IExternalResource,
  Canvas,
  Annotation,
  AnnotationBody,
  Service,
} from "manifesto.js";
import { loadCSS, loadScripts } from "../../Utils";

declare var SA: any;
export class SlideAtlasCenterPanel extends CenterPanel {
  constructor($element: JQuery) {
    super($element);
  }

  async create(): Promise<void> {
    this.setConfig("slideAtlasCenterPanel");
    super.create();
    this.$title.hide();

    await loadCSS([
      "https://unpkg.com/slideatlas-viewer@4.4.1/dist/sa.css"
    ]);

    await loadScripts([
      "https://unpkg.com/slideatlas-viewer@4.4.1/dist/sa-lib.js",
      "https://unpkg.com/slideatlas-viewer@4.4.1/dist/sa.max.js",
    ]);

    SA.SAViewer($("#content"), {
      zoomWidget: true,
      drawWidget: true,
      prefixUrl: "https://unpkg.com/slideatlas-viewer@4.4.1/dist/img/",
      tileSource: {
        height: 131072,
        width: 115074,
        bounds: [0, 115073, 60000, 131072],
        tileSize: 256,
        minLevel: 0,
        maxLevel: 9,
        getTileUrl: function(level, x, y, z) {
          var prefix =
            "https://slide-atlas.org/tile?img=5141c4094834a312d0b82d87&db=5074589002e31023d4292d83&name=";
          var name = prefix + "t";
          while (level > 0) {
            --level;
            var cx = (x >> level) & 1;
            var cy = (y >> level) & 1;
            var childIdx = cx + 2 * cy;
            if (childIdx === 0) {
              name += "q";
            } else if (childIdx === 1) {
              name += "r";
            } else if (childIdx === 2) {
              name += "t";
            } else if (childIdx === 3) {
              name += "s";
            }
          }
          name = name + ".jpg";
          return name;
        },
      },
    });

    const that = this;

    this.component.subscribe(
      BaseEvents.OPEN_EXTERNAL_RESOURCE,
      (e: any, resources: IExternalResource[]) => {
        that.openMedia(resources);
      }
    );
  }

  async openMedia(resources: IExternalResource[]) {
    this.extension.getExternalResources(resources).then(() => {
      let canvas: Canvas = this.extension.helper.getCurrentCanvas();
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
