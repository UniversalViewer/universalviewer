import BaseCommands = require("../uv-shared-module/Commands");
import BaseProvider = require("../uv-shared-module/BaseProvider");
import CenterPanel = require("../uv-shared-module/CenterPanel");
import IPDFProvider = require("../../extensions/uv-pdf-extension/IPDFProvider");

class PDFCenterPanel extends CenterPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('pdfCenterPanel');

        super.create();

        $.subscribe(BaseCommands.OPEN_MEDIA, (e, canvas) => {
            this.viewMedia(canvas);
        });
    }

    viewMedia(canvas) {
        var pdfUri = this.provider.getRenderings(canvas)[0]['@id'];
        var browser = window.browserDetect.browser;
        var version = window.browserDetect.version;

        if (browser === 'Explorer' && version < 10) {

            // create pdf object
            var myPDF = new PDFObject({
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

                window.webViewerLoad();

                this.resize();
            });
        }
    }

    resize() {
        super.resize();
    }
}

export = PDFCenterPanel;