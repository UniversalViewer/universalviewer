import BaseCommands = require("../../modules/uv-shared-module/BaseCommands");
import BaseShareDialogue = require("../../modules/uv-dialogues-module/ShareDialogue");
import Commands = require("./Commands");
import ISeadragonExtension = require("./ISeadragonExtension");
import SeadragonCenterPanel = require("../../modules/uv-seadragoncenterpanel-module/SeadragonCenterPanel");

class ShareDialogue extends BaseShareDialogue {

    constructor($element: JQuery) {
        super($element);

        $.subscribe(Commands.SEADRAGON_OPEN, () => {
            this.update();
        });

        $.subscribe(Commands.SEADRAGON_ANIMATION_FINISH, () => {
            this.update();
        });
    }

    create(): void {
        this.setConfig('shareDialogue');
        super.create();
    }

    update(): void {

        super.update();

        var xywh: string = (<ISeadragonExtension>this.extension).getViewportBounds();
        var rotation: number = (<ISeadragonExtension>this.extension).getViewerRotation();

        this.code = (<ISeadragonExtension>this.extension).getEmbedScript(
            this.options.embedTemplate,
            this.currentWidth,
            this.currentHeight,
            xywh,
            rotation);

        this.$code.val(this.code);
    }

    resize(): void {
        super.resize();
    }
}

export = ShareDialogue;