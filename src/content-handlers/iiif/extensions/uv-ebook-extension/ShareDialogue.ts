import { ShareDialogue as BaseShareDialogue } from "../../modules/uv-dialogues-module/ShareDialogue";
import { Config } from "../uv-ebook-extension/config/Config";
import { IEbookExtension } from "./IEbookExtension";

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

    this.code = (<IEbookExtension>this.extension).getEmbedScript(
      this.options.embedTemplate,
      this.currentWidth,
      this.currentHeight
    );

    this.$code.val(this.code);
  }

  resize(): void {
    super.resize();
  }
}
