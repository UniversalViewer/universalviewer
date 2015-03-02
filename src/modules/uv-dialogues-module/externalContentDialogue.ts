import baseExtension = require("../uv-shared-module/baseExtension");
import extension = require("../../extensions/uv-seadragon-extension/extension");
import shell = require("../uv-shared-module/shell");
import utils = require("../../utils");
import dialogue = require("../uv-shared-module/dialogue");

export class ExternalContentDialogue extends dialogue.Dialogue {

    static SHOW_EXTERNALCONTENT_DIALOGUE: string = 'onShowExternalContentDialogue';
    static HIDE_EXTERNALCONTENT_DIALOGUE: string = 'onHideExternalContentDialogue';

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