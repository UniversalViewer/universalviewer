import BaseEmbedDialogue = require("../../modules/uv-dialogues-module/EmbedDialogue");
import IPDFProvider = require("./IPDFProvider");

class EmbedDialogue extends BaseEmbedDialogue {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('embedDialogue');

        super.create();
    }

    update(): void {

        super.update();

        this.code = (<IPDFProvider>this.provider).getEmbedScript(
            this.options.embedTemplate,
            this.currentWidth,
            this.currentHeight);

        this.$code.val(this.code);
    }

    resize(): void {
        super.resize();

    }
}

export = EmbedDialogue;