const $ = window.$;
// import "@webcomponents/webcomponentsjs/webcomponents-bundle.js";
// import "@google/model-viewer/dist/model-viewer-legacy";
import "@google/model-viewer/dist/model-viewer";
import { AnnotationBody, Canvas, IExternalResource } from "manifesto.js";
import { sanitize, debounce } from "../../../../Utils";
import { IIIFEvents } from "../../IIIFEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { ModelViewerExtensionEvents } from "../../extensions/uv-model-viewer-extension/Events";
import { Orbit } from "../../extensions/uv-model-viewer-extension/Orbit";
import { Async } from "@edsilv/utils";
import { AnnotationGroup } from "@iiif/manifold";
import ModelViewerExtension from "../../extensions/uv-model-viewer-extension/Extension";
import { Events } from "../../../../Events";

export class ModelViewerCenterPanel extends CenterPanel {
  $modelviewer: JQuery;
  $spinner: JQuery;

  isLoaded: boolean = false;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("modelViewerCenterPanel");

    super.create();

    const that = this;

    this.extensionHost.subscribe(
      IIIFEvents.OPEN_EXTERNAL_RESOURCE,
      (resources: IExternalResource[]) => {
        that.openMedia(resources);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.SET_TARGET, (target: Orbit) => {
      this.whenLoaded(() => {
        (that.$modelviewer[0] as any).cameraOrbit = target.toAttributeString();
      });
    });

    this.extensionHost.subscribe(IIIFEvents.ANNOTATIONS, (args: any) => {
      this.overlayAnnotations();
      // this.zoomToInitialAnnotation();
    });

    this.title = this.extension.helper.getLabel();

    this.$spinner = $('<div class="spinner"></div>');
    this.$content.prepend(this.$spinner);

    this.$modelviewer = $(
      `<model-viewer 
        ${this.config.options.autoRotateEnabled ? "auto-rotate" : ""} 
        ${
          this.config.options.interactionPromptEnabled
            ? 'interaction-prompt="auto"'
            : 'interaction-prompt="none"'
        }
        camera-controls 
        style="background-color: unset;"></model-viewer>`
    );

    this.$content.prepend(this.$modelviewer);

    this.$modelviewer[0].addEventListener("model-visibility", () => {
      this.isLoaded = true;
      this.$content.removeClass("loading");
      this.$spinner.hide();
      this.extensionHost.publish(Events.LOAD);
      this.extensionHost.publish(
        ModelViewerExtensionEvents.CAMERA_CHANGE,
        this.getCameraOrbit()
      );
    });

    const debouncedCameraChange = debounce((obj: any) => {
      if (this.isLoaded) {
        //if (obj.detail.source === "user-interaction") {
        this.extensionHost.publish(
          ModelViewerExtensionEvents.CAMERA_CHANGE,
          this.getCameraOrbit()
        );
        //}
      }
    }, this.config.options.cameraChangeDelay);

    this.$modelviewer[0].addEventListener(
      "camera-change",
      debouncedCameraChange
    );

    this.$modelviewer[0].addEventListener("dblclick", (e: any) => {
      if (this.config.options.doubleClickAnnotationEnabled) {
        const point = (this.$modelviewer[0] as any).positionAndNormalFromPoint(
          e.clientX,
          e.clientY
        );
        const canvas: Canvas = that.extension.helper.getCurrentCanvas();
        this.extensionHost.publish(ModelViewerExtensionEvents.DOUBLECLICK, {
          target: `${canvas.id}#xyz=${point.position.x},${point.position.y},${point.position.z}&nxyz=${point.normal.x},${point.normal.y},${point.normal.z}`,
        });
      }
    });
  }

  whenLoaded(cb: () => void): void {
    Async.waitFor(() => {
      return this.isLoaded;
    }, cb);
  }

  private overlayAnnotations(): void {
    // clear existing annotations
    this.clearAnnotations();

    const annotationGroups: AnnotationGroup[] | null = (this
      .extension as ModelViewerExtension).annotations;

    annotationGroups.forEach((annoGroup) => {
      annoGroup.points3D.forEach((point, index) => {
        const div = document.createElement("DIV");
        div.id = "annotation-" + point.canvasIndex + "-" + index;

        div.title = sanitize(point.bodyValue);
        div.className = "annotationPin";
        div.setAttribute("slot", `hotspot-${index}`);
        div.setAttribute("data-position", `${point.x} ${point.y} ${point.z}`);
        div.setAttribute("data-normal", `${point.nx} ${point.ny} ${point.nz}`);
        div.onclick = (e: any) => {
          e.preventDefault();
          this.extensionHost.publish(
            IIIFEvents.PINPOINT_ANNOTATION_CLICKED,
            index
          );
        };
        const span: HTMLSpanElement = document.createElement("SPAN");
        span.innerText = String(index + 1);
        div.appendChild(span);
        this.$modelviewer[0].appendChild(div);
      });
    });
  }

  private clearAnnotations(): void {
    const nodes = this.$modelviewer[0].querySelectorAll(".annotationPin");
    [].forEach.call(nodes, (node) => {
      node.parentNode.removeChild(node);
    });
  }

  private getCameraOrbit(): Orbit | null {
    if (this.$modelviewer) {
      const orbit: any = (this.$modelviewer[0] as any).getCameraOrbit();
      const tpr: Orbit = new Orbit(orbit.theta, orbit.phi, orbit.radius);
      return tpr;
    }
    return null;
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

    this.$modelviewer.attr("src", mediaUri);

    // todo: look for choice of usdz, if found, add ar attribute or hide ar button using --ar-button-display
    // use choice for this? https://github.com/edsilv/biiif/issues/13#issuecomment-383504734
    // mediaUri = mediaUri.substr(0, mediaUri.lastIndexOf(".")) + ".usdz";
    // this.$modelviewer.attr("ios-src", mediaUri);
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

    if (this.$modelviewer) {
      this.$modelviewer.width(this.$content.width());
      this.$modelviewer.height(this.$content.height());
    }
  }
}
