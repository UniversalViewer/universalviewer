import { Events } from "./Events";
import OpenSeadragonExtension from "./Extension";
import { ShareDialogue as BaseShareDialogue } from "../../modules/uv-dialogues-module/ShareDialogue";

export class ShareDialogue extends BaseShareDialogue {
  constructor($element: JQuery) {
    super($element);

    this.component.subscribe(Events.OPENSEADRAGON_OPEN, () => {
      this.update();
    });

    this.component.subscribe(Events.OPENSEADRAGON_ANIMATION_FINISH, () => {
      this.update();
    });
  }

  create(): void {
    this.setConfig("shareDialogue");
    super.create();
  }

  update(): void {
    super.update();

    const xywh: string = <string>(
      (<OpenSeadragonExtension>this.extension).getViewportBounds()
    );
    const rotation: number = <number>(
      (<OpenSeadragonExtension>this.extension).getViewerRotation()
    );

    this.code = (<OpenSeadragonExtension>this.extension).getEmbedScript(
      this.options.embedTemplate,
      this.currentWidth,
      this.currentHeight,
      xywh,
      rotation
    );

    this.$code.val(this.code);
  }

  resize(): void {
    super.resize();
  }
}
