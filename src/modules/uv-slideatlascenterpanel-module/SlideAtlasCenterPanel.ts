import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import {
  IExternalResource,
  Canvas,
  Annotation,
  AnnotationBody,
  Service
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

    const that = this;

    this.component.subscribe(
      BaseEvents.OPEN_EXTERNAL_RESOURCE,
      (e: any, resources: IExternalResource[]) => {
        that.openMedia(resources);
      }
    );
  }

  async loadTilesource(id: string) {
    await loadCSS(["https://unpkg.com/slideatlas-viewer@4.4.1/dist/sa.css"]);

    await loadScripts([
      "https://unpkg.com/slideatlas-viewer@4.4.1/dist/sa-lib.js",
      "https://unpkg.com/slideatlas-viewer@4.4.1/dist/sa.max.js"
    ]);

    let tileDescriptor = id;
    if (!tileDescriptor.endsWith("/")) {
      tileDescriptor += "/";
    }
    tileDescriptor += "tiles";

    if (id.endsWith("/")) {
      id = id.substr(0, id.length - 1);
    }

    $.getJSON(tileDescriptor, info => {
      const tileSource = {
        height: info.sizeY,
        width: info.sizeX,
        tileWidth: info.tileWidth,
        tileHeight: info.tileHeight,
        minLevel: 0,
        maxLevel: info.levels - 1,
        units: "mm",
        spacing: [info.mm_x, info.mm_y],
        getTileUrl: function(level, x, y, query) {
          var url = tileDescriptor + "/zxy/" + level + "/" + x + "/" + y;
          if (query) {
            url += "?" + $.param(query);
          }
          return url;
        }
      };

      if (!info.mm_x) {
        tileSource.units = "pixels";
        tileSource.spacing = [1, 1];
      }

      SA.SAViewer(this.$content, {
        zoomWidget: true,
        drawWidget: true,
        navigationWidget: true,
        prefixUrl: "https://unpkg.com/slideatlas-viewer@4.4.1/dist/img/",
        tileSource: tileSource
      });

      // Create the annotation GUI
      // new SAM.LayerPanel(viewer, this.itemId);
      // this.$content.css({position: 'relative'});

      SA.SAFullScreenButton(this.$content).css({
        position: "absolute",
        left: "2px",
        top: "2px"
      });
    });
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
            this.loadTilesource(service.id);
            break;
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
