import baseApp = require("../../modules/coreplayer-shared-module/baseApp");
import app = require("./app");
import utils = require("../../utils");
import embed = require("../../modules/coreplayer-dialogues-module/embedDialogue");

export class EmbedDialogue extends embed.EmbedDialogue {

    create(): void {
        
        this.setConfig('embedDialogue');
        
        super.create();
    }

    formatCode(): void {

        this.code = this.provider.getEmbedScript(
            this.currentWidth,
            this.currentHeight,
            null,
            this.options.embedTemplate);

        this.$code.val(this.code);        
    }

    resize(): void {
        super.resize();

    }
}