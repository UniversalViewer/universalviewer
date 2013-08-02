/// <reference path="../../../js/jquery.d.ts" />
import baseFooter = module("app/shared/FooterPanel");
import baseApp = module("app/BaseApp");
import app = module("app/extensions/seadragon/App");
import utils = module("app/Utils");
import embed = module("app/modules/Dialogues/EmbedDialogue");

export class ExtendedFooterPanel extends baseFooter.FooterPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

        // load css.
        utils.Utils.loadCss('app/modules/ExtendedFooterPanel/css/styles.css');

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