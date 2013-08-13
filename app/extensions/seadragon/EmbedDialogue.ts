import baseApp = require("app/modules/Shared/BaseApp");
import app = require("app/extensions/seadragon/App");
import utils = require("app/Utils");
import embed = require("app/modules/Dialogues/EmbedDialogue");
import center = require("app/modules/SeadragonCenterPanel/SeadragonCenterPanel");

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