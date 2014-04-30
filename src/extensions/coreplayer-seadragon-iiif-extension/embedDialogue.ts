import utils = require("../../utils");
import embed = require("../../modules/coreplayer-dialogues-module/embedDialogue");
import center = require("../../modules/coreplayer-seadragoncenterpanel-module/seadragonCenterPanel");
import ISeadragonIIIFExtension = require("./iSeadragonIIIFExtension");
import ISeadragonIIIFProvider = require("./iSeadragonIIIFProvider");

export class EmbedDialogue extends embed.EmbedDialogue {

    constructor($element: JQuery) {
        super($element);

        $.subscribe(center.SeadragonCenterPanel.SEADRAGON_OPEN, (viewer) => {
            this.formatCode();
        });

        $.subscribe(center.SeadragonCenterPanel.SEADRAGON_ANIMATION_FINISH, (viewer) => {
            this.formatCode();
        });
    }

    create(): void {

        this.setConfig('embedDialogue');

        super.create();

    }

    formatCode(): void {

        var zoom = (<ISeadragonIIIFExtension>this.extension).getViewerBounds();

        this.code = (<ISeadragonIIIFProvider>this.provider).getEmbedScript(
            this.extension.currentCanvasIndex,
            zoom,
            this.currentWidth,
            this.currentHeight,
            this.options.embedTemplate);

        this.$code.val(this.code);
    }

    resize(): void {
        super.resize();

    }
}