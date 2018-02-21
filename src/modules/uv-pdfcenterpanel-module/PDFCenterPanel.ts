import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";

declare var PDFJS: any;

export class PDFCenterPanel extends CenterPanel {

    private _$canvas: JQuery;
    private _canvas: HTMLCanvasElement;
    private _$previousButton: JQuery;
    private _$nextButton: JQuery;
    private _ctx: any;
    private _pdfDoc: any = null;
    private _pageNum: number = 1;
    private _pageRendering: boolean = false;
    private _pageNumPending: number | null = null;
    private _viewport: any;
    private _renderTask: any;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('pdfCenterPanel');

        super.create();

        this._$canvas = $('<canvas></canvas>');
        this._canvas = (<HTMLCanvasElement>this._$canvas[0]);
        this._ctx = this._canvas.getContext('2d');

        this.$content.append(this._$canvas);

        this._$previousButton = $(`
          <button class="btn imageBtn previous" title="${this.content.previous}">
            <i class="uv-icon-previous" aria-hidden="true"></i>${this.content.previous}
          </button>
        `);

        this.$content.append(this._$previousButton);
        
        this._$nextButton = $(`
          <button class="btn imageBtn next" title="${this.content.next}">
            <i class="uv-icon-next" aria-hidden="true"></i>${this.content.next}
          </button>
        `);

        this.$content.append(this._$nextButton);

        this._$previousButton.on('click', (e: any) => {
            e.preventDefault();

            if (this._pageNum <= 1) {
                return;
            }
            
            this._pageNum--;

            this._queueRenderPage(this._pageNum);
        });

        this._$nextButton.on('click', (e: any) => {
            e.preventDefault();

            if (this._pageNum >= this._pdfDoc.numPages) {
                return;
            }

            this._pageNum++;

            this._queueRenderPage(this._pageNum);
        });

        $.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (e: any, resources: Manifesto.IExternalResource[]) => {
            this.openMedia(resources);
        });

    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {

            let mediaUri: string | null = null;
            let canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();
            const formats: Manifesto.IAnnotationBody[] | null = this.extension.getMediaFormats(canvas);

            if (formats && formats.length) {
                mediaUri = formats[0].id;
            } else {
                mediaUri = canvas.id;
            }

            PDFJS.disableWorker = true;

            PDFJS.getDocument(mediaUri).then((pdfDoc: any) => {
                this._pdfDoc = pdfDoc;
                this._render(this._pageNum);

                // this._pdfDoc.getMetadata().then((data: any) => {
                //     console.log('metadata', data);
                // });

                // this._pdfDoc.getData().then((data: any) => {
                //     console.log('data', data);
                // });

                // this._pdfDoc.getOutline().then((data: any) => {
                //     console.log('outline', data);
                // });

                // this._pdfDoc.getStats().then((data: any) => {
                //     console.log('stats', data);
                // });
            });

            //window.PDFObject.embed(mediaUri, '#content', { id: "PDF" });
        });
    }

    // whenResized(cb: () => void): void {
    //     Utils.Async.waitFor(() => {
    //         return this.isResized;
    //     }, cb);
    // }

    private _render(num: number): void {

        this._pageRendering = true;
        // Using promise to fetch the page
        this._pdfDoc.getPage(num).then((page: any) => {

            if (this._renderTask) {
                this._renderTask.cancel();
            }

            const height: number = this.$content.height();
            this._canvas.height = height;
            this._viewport = page.getViewport(this._canvas.height / page.getViewport(1.0).height);
            const width: number = this._viewport.width;
            this._canvas.width = width;

            this._$canvas.css({
                left: (this.$content.width() / 2) - (width / 2)
            });

            // Render PDF page into canvas context
            const renderContext = {
                canvasContext: this._ctx,
                viewport: this._viewport
            };

            this._renderTask = page.render(renderContext);

            // Wait for rendering to finish
            this._renderTask.promise.then(() => {
                this._pageRendering = false;
                if (this._pageNumPending !== null) {
                    // New page rendering is pending
                    this._render(this._pageNumPending);
                    this._pageNumPending = null;
                }
            }).catch((err: any) => {
                //console.log(err);
            });

        });
    }

    private _queueRenderPage(num: number) {
        if (this._pageRendering) {
            this._pageNumPending = num;
        } else {
            this._render(num);
        }
    }

    resize() {
        super.resize();

        if (!this._viewport) {
            return;
        }

        // const ratio: number = this._$canvas.width() / this._$canvas.height();

        // const height: number = this.$content.height();
        // const width: number = height * ratio;

        // this._canvas.height = height;
        // this._canvas.width = width;

        // this._$canvas.css({
        //     left: (this.$content.width() / 2) - (width / 2)
        // });

        //this._viewport.width = width;
        //this._viewport.height = height;

        this._render(this._pageNum);
        
    }
}