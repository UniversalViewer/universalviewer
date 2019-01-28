import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Position } from "../uv-shared-module/Position";
import { AMIViewerReducer } from "./Reducer";
import { changeMode, modelLoaded } from "./ActionCreators";
import { Mode } from "./Mode";

declare var Redux: any; // todo: type

export class AMICenterPanel extends CenterPanel {
  amiviewerContainer: HTMLElement;
  amiviewer: any;
  guiContainer: any;
  initialState: any;
  meshGUI: HTMLElement;
  mode: any;
  modeSelect: any;
  slicesGUI: HTMLElement;
  store: any; //todo: type
  volumeGUI: HTMLElement;

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
    this.guiContainer = document.createElement('div');
    this.guiContainer.id = 'gui-container';
    this.guiContainer.innerHTML = `
          <ion-app>
            <ion-item id="mode">
              <ion-label>Mode</ion-label>
              <ion-select id="modeSelect" value="slices" ok-text="OK" cancel-text="Cancel">
                <ion-select-option value="slices">Slices</ion-select-option>
                <ion-select-option value="volume">Volume</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-view id="slices">
              <ion-content>
                <ion-item>
                  <ion-label>Index</ion-label>
                  <ion-range id="slicesIndexRange" pin="true"></ion-range>
                </ion-item>
                <ion-item>
                  <ion-label>Orientation</ion-label>
                  <ion-select id="slicesOrientationSelect" value="0" ok-text="OK" cancel-text="Cancel">
                    <ion-select-option value="0">Coronal (x)</ion-select-option>
                    <ion-select-option value="1">Saggital (y)</ion-select-option>
                    <ion-select-option value="2">Axial (z)</ion-select-option>
                  </ion-select>
                </ion-item>
                <ion-item>
                  <ion-label>Window Width</ion-label>
                  <ion-range id="slicesWindowWidthRange" pin="true"></ion-range>
                </ion-item>
                <ion-item>
                  <ion-label>Window Center</ion-label>
                  <ion-range id="slicesWindowCenterRange" pin="true"></ion-range>
                </ion-item>
              </ion-content>
            </ion-view>
            <ion-view id="volume">
              <ion-content>
                <ion-item>
                  <ion-label>Steps</ion-label>
                  <ion-range id="volumeStepsRange" pin="true"></ion-range>
                </ion-item>
                <ion-item>
                  <ion-label>LUT</ion-label>
                  <ion-select id="volumeLUTSelect" value="0" ok-text="OK" cancel-text="Cancel">
                  </ion-select>
                </ion-item>
                <ion-item>
                  <ion-label>Window Width</ion-label>
                  <ion-range id="volumeWindowWidthRange" pin="true"></ion-range>
                </ion-item>
                <ion-item>
                  <ion-label>Window Center</ion-label>
                  <ion-range id="volumeWindowCenterRange" pin="true"></ion-range>
                </ion-item>
              </ion-content>
            </ion-view>
            <ion-view id="mesh">
              <ion-content>

              </ion-content>
            </ion-view>
          </ion-app>`;

    this.$content[0].appendChild(this.guiContainer);    

    this.slicesGUI = this.guiContainer.querySelector("#slices");
    this.volumeGUI = this.guiContainer.querySelector("#volume");
    this.meshGUI = this.guiContainer.querySelector("#mesh");
    this.mode = this.guiContainer.querySelector("#mode");
    this.modeSelect = this.guiContainer.querySelector("#modeSelect");

    this.initialState = {};

    this.store = Redux.createStore(AMIViewerReducer, this.initialState);
    this.store.subscribe(this._render.bind(this));

    this.modeSelect.addEventListener("ionChange", (e: any) => {
      this.store.dispatch(changeMode(e.detail.value));
    });
  }

  private _createAMIViewer(series: string, mode: string): void {

    if (this.amiviewer && (this.amiviewer.series === series && this.amiviewer.mode === mode)) {
      return;
    }

    this.amiviewerContainer.innerHTML = '';
    this.amiviewer = document.createElement('ami-viewer');
    this.amiviewer.setAttribute('series', series);
    this.amiviewer.setAttribute('mode', mode);
    this.amiviewerContainer.appendChild(this.amiviewer);

    this.amiviewer.addEventListener("onSlicesLoaded", (e: any) => {
      this.store.dispatch(modelLoaded(e.detail));
    });

    this.amiviewer.addEventListener("onVolumeLoaded", (e: any) => {
      this.store.dispatch(modelLoaded(e.detail));
    });

    this.amiviewer.addEventListener("onMeshLoaded", (e: any) => {
      this.store.dispatch(modelLoaded(e.detail));
    });
  }

  private _render(): void {

    // hide gui
    this.slicesGUI.classList.add("hidden");
    this.volumeGUI.classList.add("hidden");
    this.meshGUI.classList.add("hidden");
    this._controlsDisabled(true);

    const state = this.store.getState();

    switch (state.mode) {
      case Mode.SLICES:
        this._createAMIViewer(state.series, Mode.SLICES);
        break;
      case Mode.VOLUME:
      this._createAMIViewer(state.series, Mode.VOLUME);
        break;
      case Mode.MESH:
        this.mode.classList.add("hidden");
        this._createAMIViewer(state.series, Mode.MESH);
        break;
    }

    // if modeldata received, initialise GUI
    if (state.modeldata) {
      this._controlsDisabled(false);

      switch (state.mode) {
        case Mode.SLICES:
          this.slicesGUI.classList.remove("hidden");
          this._initSlicesGUI(state.modeldata);
          break;
        case Mode.VOLUME:
          this.volumeGUI.classList.remove("hidden");
          this._initVolumeGUI(state.modeldata);
          break;
        case Mode.MESH:
          this.meshGUI.classList.remove("hidden");
          this._initMeshGUI(state.modeldata);
          break;
      }
    }
  }

  openMedia(resources: Manifesto.IExternalResource[]) {
    this.extension.getExternalResources(resources).then(() => {
      let canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

      const annotations: Manifesto.IAnnotation[] = canvas.getContent();

      if (annotations.length) {
        const annotation: Manifesto.IAnnotation = annotations[0];
        const body: Manifesto.IAnnotationBody[] = annotation.getBody();

        if (body.length) {
          //const type: Manifesto.ResourceType | null = body[0].getType();
          const media = body[0];
          this.initialState.series = media.id;
          const format: Manifesto.MediaType | null = media.getFormat();
          this.initialState.mode = (format && format.toString() === "model/stl") ? Mode.MESH : Mode.SLICES;
          this._render();
        }
      }

      this.resize();
    });
  }

  private _initSlicesGUI(params: any) {

    const stackHelper = params.stackHelper;
    const stack = stackHelper.stack;

    // slice index range
    const slicesIndexRange: any = document.getElementById('slicesIndexRange');
    slicesIndexRange.max = stack.dimensionsIJK.z - 1;
    // slicesIndexRange.querySelector('ion-label[slot="start"]').innerText = 0;
    // slicesIndexRange.querySelector('ion-label[slot="end"]').innerText = slicesIndexRange.max;
    slicesIndexRange.value = stackHelper.index;
    slicesIndexRange.addEventListener('ionChange', function (ev: any) {
      const i = ev.detail.value;
      stackHelper.index = i;
    });

    // orientation selectbox
    const slicesOrientationSelect: any = document.getElementById('slicesOrientationSelect');
    slicesOrientationSelect.addEventListener('ionChange', function (ev: any) {
      stackHelper.orientation = Number(ev.detail.value);
      slicesIndexRange.max = stackHelper.orientationMaxIndex;
      const mid = Math.floor(slicesIndexRange.max / 2);
      stackHelper.index = mid;
      slicesIndexRange.value = mid;
    });

    // slice window width range
    const slicesWindowWidthRange: any = document.getElementById('slicesWindowWidthRange');
    slicesWindowWidthRange.min = 1;
    slicesWindowWidthRange.max = stack.minMax[1] - stack.minMax[0];
    slicesWindowWidthRange.value = slicesWindowWidthRange.max / 2;
    slicesWindowWidthRange.addEventListener('ionChange', function (ev: any) {
      stackHelper.slice.windowWidth = ev.detail.value;
    });

    // slice window center range
    const slicesWindowCenterRange: any = document.getElementById('slicesWindowCenterRange');
    slicesWindowCenterRange.min = stack.minMax[0];
    slicesWindowCenterRange.max = stack.minMax[1];
    slicesWindowCenterRange.value = slicesWindowCenterRange.max / 2;
    slicesWindowCenterRange.addEventListener('ionChange', function (ev: any) {
      stackHelper.slice.windowCenter = ev.detail.value;
    });
  }

  private _initVolumeGUI(params: any) {

    const stackHelper = params.stackHelper;
    const stack = stackHelper.stack;

    // steps range
    const volumeStepsRange: any = document.getElementById('volumeStepsRange');
    volumeStepsRange.max = 512;
    volumeStepsRange.value = 64; // todo: make configurable?
    volumeStepsRange.addEventListener('ionChange', function (ev: any) {
      if (stackHelper.uniforms) {
        stackHelper.uniforms.uSteps.value = ev.detail.value;
        params.modifiedCallback();
      }
    });

    // LUT selectbox
    const volumeLUTSelect: any = document.getElementById('volumeLUTSelect');
    volumeLUTSelect.addEventListener('ionChange', function (ev: any) {
      const value = ev.detail.value;
      params.lut.lut = value;
      stackHelper.uniforms.uTextureLUT.value.dispose();
      stackHelper.uniforms.uTextureLUT.value = params.lut.texture;
      params.modifiedCallback();
    });

    // add available LUTs to select box
    const availableLUTs = params.lut.lutsAvailable();

    for (let i = 0; i < availableLUTs.length; i++) {
      const lut = availableLUTs[i];
      const option: any = document.createElement('ion-select-option');
      option.value = lut;
      option.innerText = lut;
      volumeLUTSelect.appendChild(option);
    }

    // init LUT
    params.lut.lut = 'random';
    stackHelper.uniforms.uTextureLUT.value.dispose();
    stackHelper.uniforms.uTextureLUT.value = params.lut.texture;
    volumeLUTSelect.value = 'random';
    //volumeLUTSelect.forceUpdate(); // todo: random not appearing as selected

    // volume window width range
    const volumeWindowWidthRange: any = document.getElementById('volumeWindowWidthRange');
    volumeWindowWidthRange.min = 1;
    volumeWindowWidthRange.max = stack.minMax[1] - stack.minMax[0];
    volumeWindowWidthRange.value = volumeWindowWidthRange.max / 2;
    volumeWindowWidthRange.addEventListener('ionChange', function (ev: any) {
      stackHelper.windowWidth = ev.detail.value;
      params.modifiedCallback();
    });

    // volume window center range
    const volumeWindowCenterRange: any = document.getElementById('volumeWindowCenterRange');
    volumeWindowCenterRange.min = stack.minMax[0];
    volumeWindowCenterRange.max = stack.minMax[1];
    volumeWindowCenterRange.value = volumeWindowCenterRange.max / 2;
    volumeWindowCenterRange.addEventListener('ionChange', function (ev: any) {
      stackHelper.windowCenter = ev.detail.value;
      params.modifiedCallback();
    });
  }

  private _initMeshGUI(params: any) {
    console.log('init mesh gui');
  }

  private _getAllControls() {
	  return this.guiContainer.querySelectorAll('ion-select, ion-range, ion-toggle');
  }

  private _controlsDisabled(disabled: boolean) {
	  this._getAllControls().forEach(function(control: any) {
      control.disabled = disabled;
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
