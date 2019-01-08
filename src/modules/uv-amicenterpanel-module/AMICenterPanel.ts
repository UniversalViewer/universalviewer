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
        this.$amicomponent = $('<ami-viewer files="36444280,36444294,36444308,36444322,36444336,36444350,36444364,36444378,36444392,36444406,36444434,36444448,36444462,36444476,36444490,36444504,36444518,36444532,36746856"></ami-viewer>');
        this.$content.prepend(this.$amicomponent);
        this.$content.prepend(this.$guiContainer);

        this.$amicomponent[0].addEventListener('onLoaded', (e: any) => {
            const stackhelper = e.detail;
            this._createGUI(stackhelper);
        });
    }

    private _createGUI(stackHelper: any): void {

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

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {
            this.resize();
        });
    }

    resize() {

        super.resize();

        this.$amicomponent.height(this.$content.height());
        this.$amicomponent.width(this.$content.width());
    
    }
}