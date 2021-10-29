import { ShareDialogue as BaseShareDialogue } from "../../modules/uv-dialogues-module/ShareDialogue";
import { IModelViewerExtension } from "./IModelViewerExtension";

export class ShareDialogue extends BaseShareDialogue {
  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("shareDialogue");

    super.create();
  }

  update(): void {
    super.update();

    this.code = (<IModelViewerExtension>this.extension).getEmbedScript(
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
