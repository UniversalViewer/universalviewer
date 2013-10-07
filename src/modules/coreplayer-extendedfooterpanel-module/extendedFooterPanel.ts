/// <reference path="../../js/jquery.d.ts" />

import baseFooter = require("../coreplayer-shared-module/footerPanel");
import baseApp = require("../coreplayer-shared-module/baseApp");
import app = require("../../extensions/coreplayer-seadragon-extension/app");
import utils = require("../../utils");
import embed = require("../coreplayer-dialogues-module/embedDialogue");

export class ExtendedFooterPanel extends baseFooter.FooterPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

        this.$embedBtn = $('<a href="#" class="imageButton embed"></a>');
        this.$options.prepend(this.$embedBtn);

        this.$embedBtn.on('click', (e) => {
            e.preventDefault();

            $.publish(embed.EmbedDialogue.SHOW_EMBED_DIALOGUE);
        });
    }

    resize(): void {
        super.resize();
    }
}