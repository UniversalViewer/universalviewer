import BaseExtension = require("../uv-shared-module/BaseExtension");
import Dialogue = require("../uv-shared-module/Dialogue");
import Extension = require("../../extensions/uv-seadragon-extension/Extension");
import Shell = require("../uv-shared-module/Shell");
import Utils = require("../../Utils");

class ExternalContentDialogue extends Dialogue {

    static HIDE_EXTERNALCONTENT_DIALOGUE: string = 'onHideExternalContentDialogue';
    static SHOW_EXTERNALCONTENT_DIALOGUE: string = 'onShowExternalContentDialogue';

    $iframe: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('externalContentDialogue');

        super.create();

        $.subscribe(ExternalContentDialogue.SHOW_EXTERNALCONTENT_DIALOGUE, (e, params) => {
            this.open();
            this.$iframe.prop('src', params.uri);
        });

        $.subscribe(ExternalContentDialogue.HIDE_EXTERNALCONTENT_DIALOGUE, (e) => {
            this.close();
        });

        this.$iframe = $('<iframe></iframe>');
        this.$content.append(this.$iframe);

        this.$element.hide();
    }

    resize(): void {
        super.resize();

        this.$iframe.width(this.$content.width());
        this.$iframe.height(this.$content.height());
    }
}

export = ExternalContentDialogue;