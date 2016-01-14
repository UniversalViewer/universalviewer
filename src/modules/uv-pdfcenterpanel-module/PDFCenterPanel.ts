import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseProvider = require("../uv-shared-module/BaseProvider");
import CenterPanel = require("../uv-shared-module/CenterPanel");
import IPDFProvider = require("../../extensions/uv-pdf-extension/IPDFProvider");
import Params = require("../../Params");

declare var PDFView: any;

class PDFCenterPanel extends CenterPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('pdfCenterPanel');

        super.create();

        $.subscribe(BaseCommands.OPEN_EXTERNAL_RESOURCE, (e, resources: Manifesto.IExternalResource[]) => {
            this.openMedia(resources);
        });
    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        var that = this;

        this.extension.getExternalResources(resources).then(() => {
            var canvas: Manifesto.ICanvas = this.provider.getCurrentCanvas();

            var pdfUri = canvas.id;
            var browser = window.browserDetect.browser;
            var version = window.browserDetect.version;

            if ((browser === 'Explorer' && version < 10) || !this.config.options.usePdfJs) {

                // create pdf object
                new PDFObject({
                    url: pdfUri,
                    id: "PDF"
                }).embed('content');

            } else {

                var viewerPath;

                // todo: use compiler conditional
                if (window.DEBUG){
                    viewerPath = 'modules/uv-pdfcenterpanel-module/html/viewer.html';
                } else {
                    viewerPath = 'html/uv-pdfcenterpanel-module/viewer.html';
                }

                // load viewer.html
                this.$content.load(viewerPath, () => {
                    if (window.DEBUG){
                        PDFJS.workerSrc = 'extensions/uv-pdf-extension/lib/pdf.worker.min.js';
                    } else {
                        PDFJS.workerSrc = 'lib/pdf.worker.min.js';
                    }

                    PDFJS.DEFAULT_URL = pdfUri;

                    var anchorIndex = (1 + parseInt(that.extension.getParam(Params.anchor))) || 0;

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

export = PDFCenterPanel;