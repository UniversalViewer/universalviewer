import {BaseCommands} from "../uv-shared-module/BaseCommands";
import {CenterPanel} from "../uv-shared-module/CenterPanel";
import {Params} from "../../Params";

declare var PDFView: any;

export class PDFCenterPanel extends CenterPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('pdfCenterPanel');

        super.create();

        $.subscribe(BaseCommands.OPEN_EXTERNAL_RESOURCE, (e: any, resources: Manifesto.IExternalResource[]) => {
            this.openMedia(resources);
        });
    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        const that = this;

        this.extension.getExternalResources(resources).then(() => {
            const canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

            const pdfUri: string = canvas.id;
            const browser: string = window.browserDetect.browser;
            const version: number = window.browserDetect.version;

            if ((browser === 'Explorer' && version < 10) || !this.config.options.usePdfJs) {

                // create pdf object
                new PDFObject({
                    url: pdfUri,
                    id: "PDF"
                }).embed('content');

            } else {

                const viewerPath: string = 'html/uv-pdfcenterpanel-module/viewer.html';

                // load viewer.html
                this.$content.load(viewerPath, () => {
                    PDFJS.workerSrc = 'lib/pdf.worker.min.js';
                    PDFJS.DEFAULT_URL = pdfUri;

                    const anchorIndex: number = (1 + parseInt(that.extension.getParam(Params.anchor))) || 0;

                    PDFView.initialBookmark = "page=" + anchorIndex;

                    window.webViewerLoad();

                    this.resize();
                });
            }
        });
    }

    resize() {
        super.resize();
    }
}