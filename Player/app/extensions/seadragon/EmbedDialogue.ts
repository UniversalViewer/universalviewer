import baseApp = module("app/BaseApp");
import app = module("app/extensions/seadragon/App");
import utils = module("app/Utils");
import embed = module("app/modules/Dialogues/EmbedDialogue");
import center = module("app/modules/SeadragonCenterPanel/SeadragonCenterPanel");

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
        super.create();

    }

    formatCode(): void {

        var assetSequenceIndex = this.app.currentAssetIndex;
        var zoom = (<app.App>this.app).getViewerBounds();

        this.code = this.provider.getEmbedScript(this.app.currentAssetIndex,
            zoom,
            this.currentWidth,
            this.currentHeight);

        this.$code.val(this.code);        
    }

    resize(): void {
        super.resize();

    }
}