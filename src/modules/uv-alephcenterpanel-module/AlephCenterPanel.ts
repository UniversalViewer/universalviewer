import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Position } from "../uv-shared-module/Position";
import { DisplayMode } from "./DisplayMode";
import { Events } from "../../extensions/uv-aleph-extension/Events";
import { Orientation } from "./Orientation";

export class AlephCenterPanel extends CenterPanel {
  //alephContainer: HTMLElement;
  aleph: any;
  private _src: string;
  private _displayMode: DisplayMode;

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
          //const format: Manifesto.MediaType | null = media.getFormat();
          //this._display = (format && format.toString() === "application/gltf") ? DisplayMode.MESH : DisplayMode.SLICES;

          this._render();
        }
      }

      $.publish(BaseEvents.RESIZE);
    });
  }

  private _render(): void {
    this.aleph = document.createElement('uv-aleph');
    this.$content.prepend(this.aleph);
    this.aleph.setAttribute('width', '100%');
    this.aleph.setAttribute('height', '100%');
    const dracoDecoderPath: string = (window.self !== window.top)? 'lib/' : 'uv/lib/';
    this.aleph.setAttribute('draco-decoder-path', dracoDecoderPath);

    this.aleph.addEventListener('changed', (e: any) => {
      this._displayMode = e.detail.displayMode;
    }, false);

    this.aleph.addEventListener('loaded', (e: any) => {
      $.publish(Events.LOADED, [{
        stackhelper: (this._displayMode !== DisplayMode.MESH) ? e.detail : null,
        displayMode: this._displayMode
      }]);
    }, false);

    this.aleph.componentOnReady().then(() => {
      this.aleph.load(this._src);
    });

    $.subscribe(Events.DISPLAY_MODE_CHANGED, (e: any, displayMode: DisplayMode) => {
      this.aleph.setDisplayMode(displayMode);          
    });

    $.subscribe(Events.GRAPH_ENABLED_CHANGED, (e: any, enabled: boolean) => {
      this.aleph.setGraphEnabled(enabled);          
    });

    $.subscribe(Events.BOUNDING_BOX_VISIBLE_CHANGED, (e: any, visible: boolean) => {
      this.aleph.setBoundingBoxVisible(visible);          
    });
    
    $.subscribe(Events.SLICES_INDEX_CHANGED, (e: any, index: number) => {
      this.aleph.setSlicesIndex(index);          
    });

    $.subscribe(Events.ORIENTATION_CHANGED, (e: any, orientation: Orientation) => {
        this.aleph.setOrientation(orientation);         
    });

    $.subscribe(Events.SLICES_WINDOW_CENTER_CHANGED, (e: any, center: number) => {
        this.aleph.setSlicesWindowCenter(center);         
    });

    $.subscribe(Events.SLICES_WINDOW_WIDTH_CHANGED, (e: any, width: number) => {
        this.aleph.setSlicesWindowWidth(width);         
    });

    $.subscribe(Events.VOLUME_STEPS_CHANGED, (e: any, steps: number) => {
        this.aleph.setVolumeSteps(steps);         
    });
    
    $.subscribe(Events.VOLUME_WINDOW_CENTER_CHANGED, (e: any, center: number) => {
        this.aleph.setVolumeWindowCenter(center);         
    });

    $.subscribe(Events.VOLUME_WINDOW_WIDTH_CHANGED, (e: any, width: number) => {
        this.aleph.setVolumeWindowWidth(width);         
    });
  }

  resize() {

    super.resize();
    
    if (this.aleph && this.aleph.resize) {
      this.aleph.resize();
    }
  }
}
