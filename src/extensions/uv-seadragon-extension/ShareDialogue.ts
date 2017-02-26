import {Commands} from "./Commands";
import {ISeadragonExtension} from "./ISeadragonExtension";
import {ShareDialogue as BaseShareDialogue} from "../../modules/uv-dialogues-module/ShareDialogue";

export class ShareDialogue extends BaseShareDialogue {

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

        const xywh: string = <string>(<ISeadragonExtension>this.extension).getViewportBounds();
        const rotation: number = <number>(<ISeadragonExtension>this.extension).getViewerRotation();

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