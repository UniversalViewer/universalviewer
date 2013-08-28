/// <reference path="../../js/jquery.d.ts" />

import baseFooter = require("../shared/footerPanel");
import baseApp = require("../shared/baseApp");
import app = require("../../extensions/seadragon/app");
import utils = require("../../utils");
import embed = require("../dialogues/embedDialogue");

export class ExtendedFooterPanel extends baseFooter.FooterPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

        this.$embedBtn = $('<a href="#" class="imageButton embed"></a>');
        this.$options.prepend(this.$embedBtn);

        // hide embed button if some assets require authentication.
        /*
        if (this.provider.pkg.extensions && !this.provider.pkg.extensions.isAllOpen) {
            this.$embedBtn.hide();
        }
        */

        this.$embedBtn.on('click', (e) => {
            e.preventDefault();

            $.publish(embed.EmbedDialogue.SHOW_EMBED_DIALOGUE);
        });
    }

    resize(): void {
        super.resize();
    }
}