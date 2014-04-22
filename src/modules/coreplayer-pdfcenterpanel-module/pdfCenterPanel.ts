/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../coreplayer-shared-module/baseExtension");
import baseProvider = require("../coreplayer-shared-module/baseProvider");
import IPDFProvider = require("../../extensions/coreplayer-pdf-extension/iPDFProvider");
import extension = require("../../extensions/coreplayer-pdf-extension/extension");
import baseCenter = require("../coreplayer-shared-module/centerPanel");
import utils = require("../../utils");

export class PDFCenterPanel extends baseCenter.CenterPanel {

    $container: JQuery;
    $media: JQuery;
    mediaHeight: number;
    mediaWidth: number;
    $canvas: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('pdfCenterPanel');

        super.create();

        var that = this;

        // events.
        $.subscribe(extension.Extension.OPEN_MEDIA, (e, asset) => {
            that.viewMedia(asset);
        });

        this.$canvas = $('<canvas id="pdf-canvas" style="border:1px solid black;"/>');
        this.$content.append(this.$canvas);
    }

    viewMedia(asset) {

        /*
        // create pdf object
        var myPDF = new PDFObject({
            url: asset.fileUri,
            id: "PDF",
        }).embed('content');
        */

        PDFJS.workerSrc = 'extensions/coreplayer-pdf-extension/js/pdf.worker.js';

        PDFJS.getDocument(asset.fileUri).then(function(pdf) {
            // Using promise to fetch the page
            pdf.getPage(1).then(function(page) {
                var scale = 1.5;
                var viewport = page.getViewport(scale);

                // Prepare canvas using PDF page dimensions
                var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('pdf-canvas');
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                page.render(renderContext);
            });
        });

        this.resize();
    }

    resize() {

        super.resize();


        // if (this.$media){
        //     this.$media.width(this.$content.width());
        //     this.$media.height(this.$content.height());
        // }
    }
}