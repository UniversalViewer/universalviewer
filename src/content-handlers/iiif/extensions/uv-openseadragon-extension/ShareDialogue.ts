import { OpenSeadragonExtensionEvents } from "./Events";
import OpenSeadragonExtension from "./Extension";
import { ShareDialogue as BaseShareDialogue } from "../../modules/uv-dialogues-module/ShareDialogue";
import { Config } from "../uv-openseadragon-extension/config/Config";

export class ShareDialogue extends BaseShareDialogue<
  Config["modules"]["shareDialogue"]
> {
  constructor($element: JQuery) {
    super($element);

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.OPENSEADRAGON_OPEN,
      () => {
        this.update();
      }
    );

    this.extensionHost.subscribe(
      OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION_FINISH,
      () => {
        this.update();
      }
    );
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

    this.embedCode = (<OpenSeadragonExtension>this.extension).getEmbedScript(
      this.options.embedTemplate,
      this.currentWidth,
      this.currentHeight,
      xywh,
      rotation
    );

    this.$embedCode.val(this.embedCode);
  }

  resize(): void {
    super.resize();
  }
}
