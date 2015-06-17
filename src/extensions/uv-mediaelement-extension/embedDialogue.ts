import BaseExtension = require("../../modules/uv-shared-module/BaseExtension");
import BaseEmbedDialogue = require("../../modules/uv-dialogues-module/EmbedDialogue");
import Extension = require("./Extension");
import IMediaElementProvider = require("./IMediaElementProvider");
import Utils = require("../../Utils");

class EmbedDialogue extends BaseEmbedDialogue {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('embedDialogue');
        
        super.create();
    }

    formatCode(): void {

        this.code = (<IMediaElementProvider>this.provider).getEmbedScript(
            this.currentWidth,
            this.currentHeight,
            this.options.embedTemplate);

        this.$code.val(this.code);        
    }

    resize(): void {
        super.resize();

    }
}

export = EmbedDialogue;