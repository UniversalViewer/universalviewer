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
    }

    viewMedia(asset) {

        // create pdf object

        // this.$media = $('<object data="' + asset.fileUri + '" type="application/pdf">\
        //                     <p>It appears you don\'t have a PDF plugin for this browser.\
        //                     <a href="' + asset.fileUri + '">click here to download the PDF file.</a></p>\
        //                  </object>');

        // this.$content.append(this.$media);

        var myPDF = new PDFObject({
            url: asset.fileUri,
            id: "PDF",
        }).embed('content');

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