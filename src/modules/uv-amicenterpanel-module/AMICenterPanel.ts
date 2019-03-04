import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Position } from "../uv-shared-module/Position";
import { Mode } from "./Mode";

export class AMICenterPanel extends CenterPanel {
  amiviewerContainer: HTMLElement;
  amiviewer: any;
  private _src: string;
  private _display: string;

  constructor($element: JQuery) {
    super($element);
    this.attributionPosition = Position.BOTTOM_RIGHT;
  }

  create(): void {
    this.setConfig("amiCenterPanel");

    super.create();

    const that = this;

    $.subscribe(
      BaseEvents.OPEN_EXTERNAL_RESOURCE,
      (e: any, resources: Manifesto.IExternalResource[]) => {
        that.openMedia(resources);
      }
    );

    this.amiviewerContainer = document.createElement('div');
    this.$content[0].appendChild(this.amiviewerContainer);
  }

  openMedia(resources: Manifesto.IExternalResource[]) {
    this.extension.getExternalResources(resources).then(() => {
      let canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

      const annotations: Manifesto.IAnnotation[] = canvas.getContent();

      if (annotations.length) {
        const annotation: Manifesto.IAnnotation = annotations[0];
        const body: Manifesto.IAnnotationBody[] = annotation.getBody();

        if (body.length) {
          const media: Manifesto.IAnnotationBody = body[0];
          this._src = media.id;
          const format: Manifesto.MediaType | null = media.getFormat();
          this._display = (format && format.toString() === "model/stl" || 
                           format && format.toString() === "application/gltf") ? Mode.MESH : Mode.SLICES;

          this._render();
        }
      }

      $.publish(BaseEvents.RESIZE);
    });
  }

  private _render(): void {
    this.amiviewerContainer.innerHTML = '';
    this.amiviewer = document.createElement('ami-viewer');
    //this.amiviewer.setAttribute('draco-decoder-path', this.config.options.dracoDecoderPath);
    const dracoDecoderPath: string = (window.self !== window.top)? 'lib/' : 'uv/lib/';
    this.amiviewer.setAttribute('draco-decoder-path', dracoDecoderPath);
    this.amiviewerContainer.appendChild(this.amiviewer);

    this.amiviewer.addEventListener('onLoaded', () => {
      this.amiviewer.setToolsVisible(true); // can only show them after src loaded
      this.amiviewer.setOptionsVisible(true); // can only show them after src loaded
    }, false);

    this.amiviewer.componentOnReady().then((component: any) => {
      component.setDisplay(this._display);
      component.setSrc(this._src);
    });
  }

  resize() {
    super.resize();

    const $amiviewer: JQuery = $(this.amiviewer);

    $amiviewer.height(this.$content.height());
    $amiviewer.width(this.$content.width());

    if (this.amiviewer && this.amiviewer.resize) {
      this.amiviewer.resize();
    }
  }
}
