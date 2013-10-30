import baseExtension = require("../../modules/coreplayer-shared-module/baseExtension");
import extension = require("./extension");
import utils = require("../../utils");
import embed = require("../../modules/coreplayer-dialogues-module/embedDialogue");
import center = require("../../modules/coreplayer-seadragoncenterpanel-module/seadragonCenterPanel");
import ISeadragonProvider = require("./iSeadragonProvider");

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

        var assetSequenceIndex = this.extension.currentAssetIndex;
        var zoom = (<extension.Extension>this.extension).getViewerBounds();

        this.code = (<ISeadragonProvider>this.provider).getEmbedScript(
            this.extension.currentAssetIndex,
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