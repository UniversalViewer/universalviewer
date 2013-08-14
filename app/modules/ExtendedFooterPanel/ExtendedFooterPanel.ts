/// <reference path="../../../js/jquery.d.ts" />
import baseFooter = require("app/modules/Shared/FooterPanel");
import baseApp = require("app/modules/Shared/BaseApp");
import app = require("app/extensions/seadragon/App");
import utils = require("app/Utils");
import embed = require("app/modules/Dialogues/EmbedDialogue");

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