/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../uv-shared-module/baseExtension");
import baseProvider = require("../uv-shared-module/baseProvider");
import IPDFProvider = require("../../extensions/uv-pdf-extension/iPDFProvider");
import extension = require("../../extensions/uv-pdf-extension/extension");
import baseCenter = require("../uv-shared-module/centerPanel");
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

        var browser = window.browserDetect.browser;
        var version = window.browserDetect.version;

        if (browser == 'Explorer' && version < 10) {

            // create pdf object
            var myPDF = new PDFObject({
                url: canvas.mediaUri,
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
                    PDFJS.workerSrc = 'extensions/uv-pdf-extension/js/pdf.worker.min.js';
                } else {
                    PDFJS.workerSrc = 'js/pdf.worker.min.js';
                }

                PDFJS.DEFAULT_URL = canvas.mediaUri;

                window.webViewerLoad();

                this.resize();
            });
        }
    }

    resize() {
        super.resize();
    }
}