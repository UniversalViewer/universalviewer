import BaseCommands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");

class ExternalContentDialogue extends Dialogue {

    $iframe: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('externalContentDialogue');

        super.create();

        $.subscribe(BaseCommands.SHOW_EXTERNALCONTENT_DIALOGUE, (e, params) => {
            this.open();
            this.$iframe.prop('src', params.uri);
        });

        $.subscribe(BaseCommands.HIDE_EXTERNALCONTENT_DIALOGUE, (e) => {
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