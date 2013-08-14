import baseApp = require("app/modules/shared/baseApp");
import app = require("app/extensions/seadragon/app");
import utils = require("app/utils");
import embed = require("app/modules/dialogues/embedDialogue");
import center = require("app/modules/seadragonCenterPanel/seadragonCenterPanel");

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

        var assetSequenceIndex = this.app.currentAssetIndex;
        var zoom = (<app.App>this.app).getViewerBounds();

        this.code = this.provider.getEmbedScript(
            this.app.currentAssetIndex,
            zoom,
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