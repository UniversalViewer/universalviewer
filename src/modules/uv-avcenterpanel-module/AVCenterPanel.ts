import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {Events} from "../../extensions/uv-av-extension/Events";
import {CenterPanel} from "../uv-shared-module/CenterPanel";

export class AVCenterPanel extends CenterPanel {

    $avcomponent: JQuery;
    avcomponent: IIIFComponents.AVComponent;
    title: string | null;
    private _resourceOpened: boolean = false;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('avCenterPanel');

        super.create();

        const that = this;

        $.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (e: any, resources: Manifesto.IExternalResource[]) => {
            if (!this._resourceOpened) {
                that.openMedia(resources);
                this._resourceOpened = true;
            }
        });

        $.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, (e: any, canvasIndex: number) => {
            const canvas: Manifesto.ICanvas | null = this.extension.helper.getCanvasByIndex(canvasIndex);

            if (canvas) {
                this.avcomponent.showCanvas(canvas.id);
            }
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

        if (!range.canvases || !range.canvases.length) return;

        const canvasId: string = range.canvases[0];
        const canvas: Manifesto.ICanvas | null = this.extension.helper.getCanvasById(canvasId);

        if (canvas) {
            this.avcomponent.playCanvas(canvasId);
        }
    }

    viewCanvas(canvasIndex: number): void {
        const canvas: Manifesto.ICanvas | null = this.extension.helper.getCanvasByIndex(canvasIndex);
        
        if (canvas) {
            this.avcomponent.showCanvas(canvas.id);
        }
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