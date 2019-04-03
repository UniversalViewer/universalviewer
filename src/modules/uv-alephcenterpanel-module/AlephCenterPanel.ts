import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Position } from "../uv-shared-module/Position";
//import { Mode } from "./Mode";

export class AlephCenterPanel extends CenterPanel {
  //alephContainer: HTMLElement;
  aleph: any;
  private _src: string;
  //private _display: string;

  constructor($element: JQuery) {
    super($element);
    this.attributionPosition = Position.BOTTOM_RIGHT;
  }

  create(): void {
    this.setConfig("alephCenterPanel");

    super.create();

    const that = this;

    $.subscribe(
      BaseEvents.OPEN_EXTERNAL_RESOURCE,
      (e: any, resources: Manifesto.IExternalResource[]) => {
        that.openMedia(resources);
      }
    );

    //this.alephContainer = document.createElement('div');
    //this.alephContainer.id = 'container';
    //this.$content.prepend(this.alephContainer);
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
          // const format: Manifesto.MediaType | null = media.getFormat();
          // this._display = (format && format.toString() === "model/stl" || 
          //                  format && format.toString() === "application/gltf") ? Mode.MESH : Mode.SLICES;

          this._render();
        }
      }

      $.publish(BaseEvents.RESIZE);
    });
  }

  private _render(): void {
    //this.alephContainer.innerHTML = '';
    this.aleph = document.createElement('uv-aleph');
    this.$content.prepend(this.aleph);
    this.aleph.setAttribute('width', '100%');
    this.aleph.setAttribute('height', '100%');
    //this.aleph.setAttribute('draco-decoder-path', this.config.options.dracoDecoderPath);
    const dracoDecoderPath: string = (window.self !== window.top)? 'lib/' : 'uv/lib/';
    this.aleph.setAttribute('draco-decoder-path', dracoDecoderPath);
    //this.alephContainer.appendChild(this.aleph);

    this.aleph.addEventListener('onChanged', () => {
      //this.aleph.setToolsVisible(true); // can only show them after src loaded
      //this.aleph.setOptionsVisible(true); // can only show them after src loaded
    }, false);

    this.aleph.componentOnReady().then((aleph: any) => {
      //aleph.setDisplay(this._display);
      aleph.load(this._src);
    });
  }

  resize() {

    super.resize();
    
    if (this.aleph && this.aleph.resize) {
      this.aleph.resize();
    }
  }
}
