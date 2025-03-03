import { ShareDialogue as BaseShareDialogue } from "../../modules/uv-dialogues-module/ShareDialogue";
import { Config } from "../uv-av-extension/config/Config";
import { IAVExtension } from "./IAVExtension";

export class ShareDialogue extends BaseShareDialogue<
  Config["modules"]["shareDialogue"]
> {
  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("shareDialogue");

    super.create();
  }

  update(): void {
    super.update();

    this.embedCode = (<IAVExtension>this.extension).getEmbedScript(
      this.options.embedTemplate,
      this.currentWidth,
      this.currentHeight
    );

    this.$embedCode.val(this.embedCode);
  }

  resize(): void {
    super.resize();
  }
}
