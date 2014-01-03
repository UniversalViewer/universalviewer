/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../../modules/coreplayer-shared-module/baseExtension");
import utils = require("../../utils");
import baseProvider = require("../../modules/coreplayer-shared-module/baseProvider");
import IProvider = require("../../modules/coreplayer-shared-module/iProvider");
import IPDFProvider = require("./iPDFProvider");
import shell = require("../../modules/coreplayer-shared-module/shell");

export class Extension extends baseExtension.BaseExtension{

    $pdfLink: JQuery;

    constructor(provider: IProvider) {
        super(provider);
    }

    create(): void {
        super.create();

        this.$pdfLink = $('<a class="pdfLink" href="' + (<IPDFProvider>this.provider).getPDFUri() + '" target="_blank">Open PDF</a>');
        shell.Shell.$element.append(this.$pdfLink);
    }

}
