import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { DisplayMode } from "./DisplayMode";
import { Events } from "../../extensions/uv-aleph-extension/Events";
import { Orientation } from "./Orientation";
import { Position } from "../uv-shared-module/Position";
import { Units } from "./Units";
import { ControlsType } from "./ControlsType";
import { Async } from "@edsilv/utils";
import {
  IExternalResource,
  Canvas,
  Annotation,
  AnnotationBody
} from "manifesto.js";
import { MediaType } from "@iiif/vocabulary";
import {
  applyPolyfills,
  defineCustomElements
} from "@universalviewer/aleph/loader";
import "@universalviewer/aleph/dist/collection/assets/aframe-1.0.3.min";
import "@universalviewer/aleph/dist/collection/assets/OrbitControls";
import "@universalviewer/aleph/dist/collection/assets/ami.min";

export class AlephCenterPanel extends CenterPanel {
  private _alViewer: any;
  private _alViewerReady: boolean = false;
  private _state: any = {};
  private _prevState: any = {};

  constructor($element: JQuery) {
    super($element);
    this.attributionPosition = Position.BOTTOM_RIGHT;
  }

  async create(): Promise<void> {
    this.setConfig("alephCenterPanel");

    super.create();

    await applyPolyfills();
    defineCustomElements(window);

    this._alViewer = document.createElement("al-viewer");
    this.$content.prepend(this._alViewer);
    this._alViewer.setAttribute("width", "100%");
    this._alViewer.setAttribute("height", "100%");
    const dracoDecoderPath: string =
      window.self !== window.top ? "lib/" : "uv/lib/";
    this._alViewer.setAttribute("draco-decoder-path", dracoDecoderPath);

    this._alViewer.addEventListener(
      "changed",
      (e: any) => {
        if (this._alViewerReady) {
          this._nextState(
            Object.assign({}, e.detail, {
              src: this._prevState.src
            })
          );
        }
      },
      false
    );

    this._alViewer.addEventListener(
      "loaded",
      (e: any) => {
        this.component.publish(Events.LOADED, {
          stackhelper:
            this._state.displayMode !== DisplayMode.MESH ? e.detail : null
        });
      },
      false
    );

    this.component.subscribe(
      Events.CONTROLS_TYPE_CHANGED,
      (controlsType: ControlsType) => {
        this._alViewer.setControlsType(controlsType);
      }
    );

    this.component.subscribe(Events.CLEAR_GRAPH, () => {
      this._alViewer.clearGraph();
    });

    this.component.subscribe(Events.DELETE_ANGLE, (id: string) => {
      this._alViewer.deleteAngle(id);
    });

    this.component.subscribe(Events.DELETE_EDGE, (id: string) => {
      this._alViewer.deleteEdge(id);
    });

    this.component.subscribe(Events.DELETE_NODE, (id: string) => {
      this._alViewer.deleteNode(id);
    });

    this.component.subscribe(
      Events.DISPLAY_MODE_CHANGED,
      (displayMode: DisplayMode) => {
        this._alViewer.setDisplayMode(displayMode);
      }
    );

    this.component.subscribe(
      Events.GRAPH_ENABLED_CHANGED,
      (enabled: boolean) => {
        this._alViewer.setGraphEnabled(enabled);
      }
    );

    this.component.subscribe(
      Events.BOUNDING_BOX_ENABLED_CHANGED,
      (enabled: boolean) => {
        this._alViewer.setBoundingBoxEnabled(enabled);
      }
    );

    this.component.subscribe(
      Events.ORIENTATION_CHANGED,
      (orientation: Orientation) => {
        this._alViewer.setOrientation(orientation);
      }
    );

    this.component.subscribe(Events.RECENTER, () => {
      this._alViewer.recenter();
    });

    this.component.subscribe(Events.SET_GRAPH, (graph: any) => {
      this._alViewer.setGraph(graph);
    });

    this.component.subscribe(Events.SET_NODE, (node: any) => {
      this._alViewer.setNode(node);
    });

    this.component.subscribe(Events.SELECT_NODE, (id: string) => {
      this._alViewer.selectNode(id);
    });

    this.component.subscribe(Events.SLICES_INDEX_CHANGED, (index: number) => {
      this._alViewer.setSlicesIndex(index);
    });

    this.component.subscribe(
      Events.SLICES_BRIGHTNESS_CHANGED,
      (brightness: number) => {
        this._alViewer.setVolumeBrightness(brightness);
      }
    );

    this.component.subscribe(
      Events.SLICES_CONTRAST_CHANGED,
      (contrast: number) => {
        this._alViewer.setVolumeContrast(contrast);
      }
    );

    this.component.subscribe(Events.UNITS_CHANGED, (units: Units) => {
      this._alViewer.setUnits(units);
    });

    this.component.subscribe(Events.VOLUME_STEPS_CHANGED, (steps: number) => {
      this._alViewer.setVolumeSteps(steps);
    });

    this.component.subscribe(
      Events.VOLUME_BRIGHTNESS_CHANGED,
      (brightness: number) => {
        this._alViewer.setVolumeBrightness(brightness);
      }
    );

    this.component.subscribe(
      Events.VOLUME_CONTRAST_CHANGED,
      (contrast: number) => {
        this._alViewer.setVolumeContrast(contrast);
      }
    );

    Async.waitFor(
      () => {
        return window.customElements !== undefined;
      },
      () => {
        customElements.whenDefined("al-viewer").then(() => {
          this._alViewerReady = true;
          this._alViewer.load(this._state.src, this._state.displayMode);
        });
      }
    );

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

      const annotations: Annotation[] = canvas.getContent();

      if (annotations.length) {
        const annotation: Annotation = annotations[0];
        const body: AnnotationBody[] = annotation.getBody();

        if (body.length) {
          const media: AnnotationBody = body[0];
          const format: MediaType | null = media.getFormat();

          const displayMode: DisplayMode =
            format && format.toString() === "model/gltf+json"
              ? DisplayMode.MESH
              : DisplayMode.SLICES;

          // todo: only load AMI if not DisplayMode.MESH
          // PDFJS = await import(
          //   /* webpackChunkName: "pdfjs" */ /* webpackMode: "lazy" */ "pdfjs-dist"
          // );

          this._nextState({
            src: media.id,
            displayMode: displayMode
          });
        }
      }

      this.component.publish(BaseEvents.OPENED_MEDIA);
    });
  }

  private _nextState(s: any) {
    this._state = Object.assign({}, this._state, s);

    if (this._state.src && this._state.src !== this._prevState.src) {
      Async.waitFor(
        () => {
          return this._alViewerReady;
        },
        () => {
          this._alViewer.load(this._state.src);
        }
      );
    }

    this.component.publish(Events.VIEWER_CHANGED, this._state);

    this._prevState = Object.assign({}, this._state);
  }

  resize() {
    super.resize();

    console.log("resize");

    if (this._alViewerReady && this._state.srcLoaded) {
      this._alViewer.resize();
    }
  }
}