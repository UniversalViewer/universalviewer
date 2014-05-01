/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../coreplayer-shared-module/baseExtension");
import baseProvider = require("../coreplayer-shared-module/baseProvider");
import IPDFProvider = require("../../extensions/coreplayer-pdf-extension/iPDFProvider");
import extension = require("../../extensions/coreplayer-pdf-extension/extension");
import baseCenter = require("../coreplayer-shared-module/centerPanel");
import utils = require("../../utils");

export class PDFCenterPanel extends baseCenter.CenterPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('pdfCenterPanel');

        super.create();

        // events.
        $.subscribe(extension.Extension.OPEN_MEDIA, (e, canvas) => {
            this.viewMedia(canvas);
        });
    }

    viewMedia(canvas) {

        var browser = window.BrowserDetect.browser;
        var version = window.BrowserDetect.version;

        if (browser == 'Chrome' ||
            browser == 'Firefox' ||
            browser == 'Opera' ||
            browser == 'Explorer' && version >= 10) {

            var viewerPath;

            if (window.DEBUG){
                viewerPath = 'modules/coreplayer-pdfcenterpanel-module/html/viewer.html';
            } else {
                viewerPath = 'html/coreplayer-pdfcenterpanel-module/viewer.html';
            }

            // load viewer.html
            this.$content.load(viewerPath, () => {
                if (window.DEBUG){
                    PDFJS.workerSrc = 'extensions/coreplayer-pdf-extension/js/pdf.worker.min.js';
                } else {
                    PDFJS.workerSrc = 'js/pdf.worker.min.js';
                }

                PDFJS.DEFAULT_URL = canvas.mediaUri;

                window.webViewerLoad();

                this.resize();
            });

        } else {
            // create pdf object
            var myPDF = new PDFObject({
                url: canvas.mediaUri,
                id: "PDF",
            }).embed('content');
        }
    }

    resize() {
        super.resize();
    }
}