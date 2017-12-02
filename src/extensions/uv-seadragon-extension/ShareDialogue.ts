import {Events} from "./Events";
import {ISeadragonExtension} from "./ISeadragonExtension";
import {ShareDialogue as BaseShareDialogue} from "../../modules/uv-dialogues-module/ShareDialogue";

export class ShareDialogue extends BaseShareDialogue {

    constructor($element: JQuery) {
        super($element);

        $.subscribe(Events.SEADRAGON_OPEN, () => {
            this.update();
        });

        $.subscribe(Events.SEADRAGON_ANIMATION_FINISH, () => {
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