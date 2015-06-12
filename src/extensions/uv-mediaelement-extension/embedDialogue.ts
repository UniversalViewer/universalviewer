import baseExtension = require("../../modules/uv-shared-module/baseExtension");
import extension = require("./extension");
import utils = require("../../utils");
import embed = require("../../modules/uv-dialogues-module/embedDialogue");
import IMediaElementProvider = require("./iMediaElementProvider");

export class EmbedDialogue extends embed.EmbedDialogue {

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