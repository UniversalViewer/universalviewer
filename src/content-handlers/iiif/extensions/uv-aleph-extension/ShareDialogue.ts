import { ShareDialogue as BaseShareDialogue } from "../../modules/uv-dialogues-module/ShareDialogue";
import { Config } from "../uv-aleph-extension/config/Config";
import { IAlephExtension } from "./IAlephExtension";

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

    this.embedCode = (<IAlephExtension>this.extension).getEmbedScript(
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
