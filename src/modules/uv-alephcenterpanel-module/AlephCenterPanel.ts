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

    this.component.subscribe(
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
          const format: Manifesto.MediaType | null = media.getFormat();
          this._displayMode = (format && format.toString() === "model/gltf+json") ? DisplayMode.MESH : DisplayMode.SLICES;

          this._render();
        }
      }

      this.component.publish(BaseEvents.RESIZE);
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
      this.component.publish(Events.LOADED, {
        stackhelper: (this._displayMode !== DisplayMode.MESH) ? e.detail : null,
        displayMode: this._displayMode
      });
    }, false);

    this.aleph.componentOnReady().then((al: any) => {
      al.load(this._src, this._displayMode);
    });

    this.component.subscribe(Events.DISPLAY_MODE_CHANGED, (displayMode: DisplayMode) => {
      this.aleph.setDisplayMode(displayMode);          
    });

    this.component.subscribe(Events.GRAPH_ENABLED_CHANGED, (enabled: boolean) => {
      this.aleph.setGraphEnabled(enabled);          
    });

    this.component.subscribe(Events.BOUNDING_BOX_ENABLED_CHANGED, (enabled: boolean) => {
      this.aleph.setBoundingBoxEnabled(enabled);          
    });
    
    this.component.subscribe(Events.SLICES_INDEX_CHANGED, (index: number) => {
      this.aleph.setSlicesIndex(index);          
    });

    this.component.subscribe(Events.ORIENTATION_CHANGED, (orientation: Orientation) => {
      this.aleph.setOrientation(orientation);         
    });

    this.component.subscribe(Events.SLICES_WINDOW_CENTER_CHANGED, (center: number) => {
      this.aleph.setSlicesWindowCenter(center);         
    });

    this.component.subscribe(Events.SLICES_WINDOW_WIDTH_CHANGED, (width: number) => {
      this.aleph.setSlicesWindowWidth(width);         
    });

    this.component.subscribe(Events.VOLUME_STEPS_CHANGED, (steps: number) => {
      this.aleph.setVolumeSteps(steps);         
    });
    
    this.component.subscribe(Events.VOLUME_WINDOW_CENTER_CHANGED, (center: number) => {
      this.aleph.setVolumeWindowCenter(center);         
    });

    this.component.subscribe(Events.VOLUME_WINDOW_WIDTH_CHANGED, (width: number) => {
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
