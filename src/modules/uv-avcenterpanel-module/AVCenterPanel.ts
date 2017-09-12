import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {Events} from "../../extensions/uv-av-extension/Events";
import {CenterPanel} from "../uv-shared-module/CenterPanel";

export class AVCenterPanel extends CenterPanel {

    $avcomponent: JQuery;
    avcomponent: IIIFComponents.AVComponent;
    title: string | null;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('avCenterPanel');

        super.create();

        const that = this;

        $.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (e: any, resources: Manifesto.IExternalResource[]) => {
            that.openMedia(resources);
        });

        $.subscribe(Events.RANGE_CHANGED, (e: any, range: Manifesto.IRange) => {
            that.viewRange(range);
        });

        this.$avcomponent = $('<div class="iiif-av-component"></div>');
        this.$content.append(this.$avcomponent);

        this.title = this.extension.helper.getLabel();

        this.avcomponent = new IIIFComponents.AVComponent({
            target: this.$avcomponent[0]
        });
    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {

            this.avcomponent.set({
                helper: this.extension.helper,
                defaultAspectRatio: 0.56
            });

            this.resize();
        });
    }

    viewRange(range: Manifesto.IRange): void {
        let r = range;
        console.log(r);
        // const canvasId = node.data.canvases[0];
        // const canvas = helper.getCanvasById(canvasId);

        // if (canvas) {
            
        //     showCanvas(canvas.id);

        //     const canvasInstance = getCanvasInstanceByID(canvasId);

        //     const temporal = /t=([^&]+)/g.exec(canvasId);
            
        //     if (temporal && temporal[1]) {
        //         const rangeTiming = temporal[1].split(',');
        //         canvasInstance.setCurrentTime(rangeTiming[0]);
        //         canvasInstance.playCanvas();
        //     }

        //     //logMessage('SELECT RANGE: '+ node.label);
        // } else {
        //     //logMessage('ERROR: Could not find canvas for range '+ node.label);
        // }
    }

    resize() {

        super.resize();

        if (this.title) {
            this.$title.ellipsisFill(this.title);
        }

        this.$avcomponent.height(this.$content.height());
        this.avcomponent.resize();       
    }
}