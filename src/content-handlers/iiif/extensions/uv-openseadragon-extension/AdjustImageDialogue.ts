import { AdjustImageDialogue as BaseAdjustImageDialogue } from "../../modules/uv-dialogues-module/AdjustImageDialogue";
import { Shell } from "../../modules/uv-shared-module/Shell";

export class AdjustImageDialogue extends BaseAdjustImageDialogue {
  constructor($element: JQuery, shell: Shell) {
    super($element, shell);
  }

  create(): void {
    this.setConfig("shareDialogue");
    super.create();
  }

  resize(): void {
    super.resize();
  }
}
