import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Events } from "../../extensions/uv-pdf-extension/Events"; 

declare var PDFJS: any;

export class PDFCenterPanel extends CenterPanel {

    private _$canvas: JQuery;
    private _$spinner: JQuery;
    private _canvas: HTMLCanvasElement;
    private _ctx: any;
    private _pdfDoc: any = null;
    private _pageIndex: number = 1;
    private _pageRendering: boolean = false;
    private _pageIndexPending: number | null = null;
    private _viewport: any;
    private _renderTask: any;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('pdfCenterPanel');

        super.create();

        this._$spinner = $('<div class="spinner"></div>');
        this.$content.append(this._$spinner);
        this._$canvas = $('<canvas></canvas>');
        this._canvas = (<HTMLCanvasElement>this._$canvas[0]);
        this._ctx = this._canvas.getContext('2d');

        this.$content.prepend(this._$canvas);

        $.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (e: any, resources: Manifesto.IExternalResource[]) => {
            this.openMedia(resources);
        });

        $.subscribe(BaseEvents.FIRST, () => {

            if (!this._pdfDoc) {
                return;
            }

            this._pageIndex = 1;

            this._queueRenderPage(this._pageIndex);
        });

        $.subscribe(BaseEvents.PREV, () => {

            if (!this._pdfDoc) {
                return;
            }

            if (this._pageIndex <= 1) {
                return;
            }
            
            this._pageIndex--;

            this._queueRenderPage(this._pageIndex);
        });

        $.subscribe(BaseEvents.NEXT, () => {

            if (!this._pdfDoc) {
                return;
            }

            if (this._pageIndex >= this._pdfDoc.numPages) {
                return;
            }

            this._pageIndex++;

            this._queueRenderPage(this._pageIndex);
        });

        $.subscribe(BaseEvents.LAST, () => {

            if (!this._pdfDoc) {
                return;
            }

            this._pageIndex = this._pdfDoc.numPages;

            this._queueRenderPage(this._pageIndex);
        });

        $.subscribe(Events.SEARCH, (e: any, pageIndex: number) => {

            if (!this._pdfDoc) {
                return;
            }

            if (pageIndex < 1 || pageIndex > this._pdfDoc.numPages) {
                return;
            }

            this._pageIndex = pageIndex;

            this._queueRenderPage(this._pageIndex);
        });

    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this._$spinner.show();
        
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
                this._render(this._pageIndex);

                $.publish(Events.PDF_LOADED, [pdfDoc]);
                this._$spinner.hide();
            });

            //window.PDFObject.embed(mediaUri, '#content', { id: "PDF" });
        });

    }

    private _render(num: number): void {

        this._pageRendering = true;

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

                $.publish(Events.PAGE_INDEX_CHANGED, [this._pageIndex]);

                this._pageRendering = false;

                if (this._pageIndexPending !== null) {
                    // New page rendering is pending
                    this._render(this._pageIndexPending);
                    this._pageIndexPending = null;
                }
                
            }).catch((err: any) => {
                //console.log(err);
            });

        });
    }

    private _queueRenderPage(num: number) {
        if (this._pageRendering) {
            this._pageIndexPending = num;
        } else {
            this._render(num);
        }
    }

    resize() {
        super.resize();

        this._$spinner.css('top', (this.$content.height() / 2) - (this._$spinner.height() / 2));
        this._$spinner.css('left', (this.$content.width() / 2) - (this._$spinner.width() / 2));

        if (!this._viewport) {
            return;
        }

        this._render(this._pageIndex);
    }
}