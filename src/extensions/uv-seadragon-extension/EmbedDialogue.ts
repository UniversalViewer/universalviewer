import BaseCommands = require("../../modules/uv-shared-module/BaseCommands");
import BaseEmbedDialogue = require("../../modules/uv-dialogues-module/EmbedDialogue");
import Commands = require("./Commands");
import ISeadragonExtension = require("./ISeadragonExtension");
import ISeadragonProvider = require("./ISeadragonProvider");
import SeadragonCenterPanel = require("../../modules/uv-seadragoncenterpanel-module/SeadragonCenterPanel");

class EmbedDialogue extends BaseEmbedDialogue {

    constructor($element: JQuery) {
        super($element);

        $.subscribe(Commands.SEADRAGON_OPEN, (viewer) => {
            this.update();
        });

        $.subscribe(Commands.SEADRAGON_ANIMATION_FINISH, (viewer) => {
            this.update();
        });
    }

    create(): void {
        this.setConfig('embedDialogue');
        super.create();
    }

    update(): void {

        super.update();

        var zoom = (<ISeadragonExtension>this.extension).getViewerBounds();
        var rotation = (<ISeadragonExtension>this.extension).getViewerRotation();

        this.code = (<ISeadragonProvider>this.provider).getEmbedScript(
            this.options.embedTemplate,
            this.currentWidth,
            this.currentHeight,
            zoom,
            rotation);

        this.$code.val(this.code);
    }

    resize(): void {
        super.resize();
    }
}

export = EmbedDialogue;