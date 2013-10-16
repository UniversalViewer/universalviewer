/// <reference path="../../js/jquery.d.ts" />

import baseFooter = require("../coreplayer-shared-module/footerPanel");
import baseApp = require("../coreplayer-shared-module/baseApp");
import app = require("../../extensions/coreplayer-seadragon-extension/app");
import utils = require("../../utils");
import embed = require("../coreplayer-dialogues-module/embedDialogue");

export class ExtendedFooterPanel extends baseFooter.FooterPanel {

    $embedButton: JQuery;
    $saveButton: JQuery;
    $downloadButton: JQuery;
    
    static DOWNLOAD: string = 'footer.onDownload';
    static SAVE: string = 'footer.onSave';
    static EMBED: string = 'footer.onEmbed';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

        this.$downloadButton = $('<a class="imageButton download"></a>');
        this.$options.append(this.$downloadButton);

        this.$saveButton = $('<a class="imageButton save"></a>');
        this.$options.append(this.$saveButton);

        this.$embedButton = $('<a href="#" class="imageButton embed"></a>');
        this.$options.append(this.$embedButton);        

        this.$embedButton.on('click', (e) => {
            e.preventDefault();

            $.publish(ExtendedFooterPanel.EMBED);
        });

        this.$downloadButton.on('click', (e) => {
            e.preventDefault();

            $.publish(ExtendedFooterPanel.DOWNLOAD);
        });

        this.$saveButton.on('click', (e) => {
            e.preventDefault();

            $.publish(ExtendedFooterPanel.SAVE);
        });

        this.$embedButton.hide();
        this.$downloadButton.hide();
        this.$saveButton.hide();
    }

    resize(): void {
        super.resize();
    }
}