import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {CenterPanel} from "../uv-shared-module/CenterPanel";

export class AVCenterPanel extends CenterPanel {

    $avcomponent: JQuery;
    avcomponent: IIIFComponents.AVComponent;
    title: string | null;
    private _canvasReady: boolean = false;
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

        $.subscribe(BaseEvents.RANGE_CHANGED, (e: any, range: Manifesto.IRange) => {
            that.viewRange(range);
        });

        this.$avcomponent = $('<div class="iiif-av-component"></div>');
        this.$content.append(this.$avcomponent);

        this.title = this.extension.helper.getLabel();

        this.avcomponent = new IIIFComponents.AVComponent({
            target: this.$avcomponent[0]
        });

        this.avcomponent.on('canvasready', () => {
            this._canvasReady = true;
        }, false);
    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {

            this.avcomponent.set({
                helper: this.extension.helper,
                autoPlay: this.config.options.autoPlay,
                defaultAspectRatio: 0.56,
                content: <IIIFComponents.IAVComponentContent> {
                    play: this.content.play,
                    pause: this.content.pause,
                    currentTime: this.content.currentTime,
                    duration: this.content.duration
                }
            });

            this.resize();
        });
    }

    viewRange(range: Manifesto.IRange): void {

        if (!range.canvases || !range.canvases.length) return;

        const canvasId: string = range.canvases[0];
        const canvas: Manifesto.ICanvas | null = this.extension.helper.getCanvasById(canvasId);

        if (canvas) {

            Utils.Async.waitFor(() => {
                return this._canvasReady;
            }, () => {
                this.avcomponent.play(canvasId);
                this.resize();
            });
            
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