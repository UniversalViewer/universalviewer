import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Position } from "../uv-shared-module/Position";

declare var dat: any;

export class AMICenterPanel extends CenterPanel {

    $guiContainer: JQuery;
    $amicomponent: JQuery;

    constructor($element: JQuery) {
        super($element);
        this.attributionPosition = Position.BOTTOM_RIGHT;
    }

    create(): void {

        this.setConfig('amiCenterPanel');

        super.create();

        const that = this;

        $.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (e: any, resources: Manifesto.IExternalResource[]) => {
            that.openMedia(resources);
        });

        this._createAMIComponent();
    }

    private _createAMIComponent(): void {

        this.$guiContainer = $('<div id="my-gui-container"></div>');
        this.$amicomponent = $('<ami-viewer mode="volume"></ami-viewer>');
        this.$content.prepend(this.$amicomponent);
        this.$content.prepend(this.$guiContainer);

        this.$amicomponent[0].addEventListener('onSlicesLoaded', (e: any) => {
            this._createSlicesGUI(e.detail);
        });

        this.$amicomponent[0].addEventListener('onVolumeLoaded', (e: any) => {
            this._createVolumeGUI(e.detail);
        });
    }

    private _createSlicesGUI(params: any): void {

        const stackHelper = params.stackHelper;
        const stack = stackHelper.stack;

        const gui = new dat.GUI({
          autoPlace: false,
        });

        this.$guiContainer.append(gui.domElement);

        // stack
        const stackFolder = gui.addFolder('Stack');
        // index range depends on stackHelper orientation.
        const index = stackFolder
          .add(stackHelper, 'index', 0, stack.dimensionsIJK.z - 1)
          .step(1)
          .listen();
        const orientation = stackFolder
          .add(stackHelper, 'orientation', 0, 2)
          .step(1)
          .listen();
        orientation.onChange(() => {
          index.__max = stackHelper.orientationMaxIndex;
          stackHelper.index = Math.floor(index.__max / 2);
        });
        stackFolder.open();

        // slice
        const sliceFolder = gui.addFolder('Slice');
        sliceFolder
          .add(stackHelper.slice, 'windowWidth', 1, stack.minMax[1] - stack.minMax[0])
          .step(1)
          .listen();
        sliceFolder
          .add(stackHelper.slice, 'windowCenter', stack.minMax[0], stack.minMax[1])
          .step(1)
          .listen();
        sliceFolder.add(stackHelper.slice, 'intensityAuto').listen();
        sliceFolder.add(stackHelper.slice, 'invert');
        sliceFolder.open();

        // bbox
        const bboxFolder = gui.addFolder('Bounding Box');
        bboxFolder.add(stackHelper.bbox, 'visible');
        bboxFolder.addColor(stackHelper.bbox, 'color');
        bboxFolder.open();

        // border
        const borderFolder = gui.addFolder('Border');
        borderFolder.add(stackHelper.border, 'visible');
        borderFolder.addColor(stackHelper.border, 'color');
        borderFolder.open();
    }

    _createVolumeGUI(params: any) {

        let myStack = {
          algorithm: 'ray marching',
          lut: 'random',
          opacity: 'random',
          steps: 128,
          alphaCorrection: 0.5,
          frequence: 0,
          amplitude: 0,
          interpolation: 1,
        };
  
        const stackHelper = params.stackHelper;
  
        let gui = new dat.GUI({
          autoPlace: false,
        });
  
        this.$guiContainer.append(gui.domElement);
  
        let stackFolder = gui.addFolder('Settings');
        let algorithmUpdate = stackFolder.add(myStack, 'algorithm', ['ray marching', 'mip']);
        algorithmUpdate.onChange((value: any) => {
          stackHelper.algorithm = value === 'mip' ? 1 : 0;
          params.modified = true;
        });
  
        let lutUpdate = stackFolder.add(myStack, 'lut', params.lut.lutsAvailable());
        lutUpdate.onChange((value: any) => {
          params.lut.lut = value;
          stackHelper.uniforms.uTextureLUT.value.dispose();
          stackHelper.uniforms.uTextureLUT.value = params.lut.texture;
          params.modified = true;
        });
        // init LUT
        params.lut.lut = myStack.lut;
        stackHelper.uniforms.uTextureLUT.value.dispose();
        stackHelper.uniforms.uTextureLUT.value = params.lut.texture;
  
        let opacityUpdate = stackFolder.add(myStack, 'opacity', params.lut.lutsAvailable('opacity'));
        opacityUpdate.onChange((value: any) => {
          params.lut.lutO = value;
          stackHelper.uniforms.uTextureLUT.value.dispose();
          stackHelper.uniforms.uTextureLUT.value = params.lut.texture;
          params.modified = true;
        });
  
        let stepsUpdate = stackFolder.add(myStack, 'steps', 0, 512).step(1);
        stepsUpdate.onChange((value: any) => {
          if (stackHelper.uniforms) {
            stackHelper.uniforms.uSteps.value = value;
            params.modified = true;
          }
        });
  
        let alphaCorrrectionUpdate = stackFolder.add(myStack, 'alphaCorrection', 0, 1).step(0.01);
        alphaCorrrectionUpdate.onChange((value: any) => {
          if (stackHelper.uniforms) {
            stackHelper.uniforms.uAlphaCorrection.value = value;
            params.modified = true;
          }
        });
  
        let interpolationUpdate = stackFolder.add(stackHelper, 'interpolation', 0, 1).step(1);
        interpolationUpdate.onChange(() => {
          if (stackHelper.uniforms) {
            params.modified = true;
          }
        });
  
        let shadingUpdate = stackFolder.add(stackHelper, 'shading', 0, 1).step(1);
        shadingUpdate.onChange(() => {
          if (stackHelper.uniforms) {
            params.modified = true;
          }
        });
  
        let shininessUpdate = stackFolder.add(stackHelper, 'shininess', 0, 20).step(0.1);
        shininessUpdate.onChange(() => {
          if (stackHelper.uniforms) {
            params.modified = true;
          }
        });
  
        stackFolder.open();
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
                    (<any>this.$amicomponent[0]).series = body[0].id;
                }
            }

            this.resize();
        });
    }

    resize() {

        super.resize();

        this.$amicomponent.height(this.$content.height());
        this.$amicomponent.width(this.$content.width());

        if (this.$amicomponent[0] && (<any>this.$amicomponent[0]).resize) {
            (<any>this.$amicomponent[0]).resize();
        }
        
    }
}