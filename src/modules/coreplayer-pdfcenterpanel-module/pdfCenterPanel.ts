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

        //var that = this;

        // events.
        $.subscribe(extension.Extension.OPEN_MEDIA, (e, asset) => {
            this.viewMedia(asset);
        });
    }

    viewMedia(asset) {

        // load viewer.html
        this.$content.load('modules/coreplayer-pdfcenterpanel-module/viewer.html', () => {
            if (window.DEBUG){
                PDFJS.workerSrc = 'extensions/coreplayer-pdf-extension/js/pdfworker.js';
            } else {
                PDFJS.workerSrc = 'js/pdfworker.js';
            }

            PDFJS.DEFAULT_URL = asset.fileUri;

            window.webViewerLoad();

            this.resize();
        });

        /*
        // create pdf object
        var myPDF = new PDFObject({
            url: asset.fileUri,
            id: "PDF",
        }).embed('content');
        */
    }

    resize() {

        super.resize();

    }
}