import { ChoiceSwitchDialogue as BaseChoiceSwitchDialogue } from "../../modules/uv-dialogues-module/ChoiceSwitchDialogue";
import { Shell } from "../../modules/uv-shared-module/Shell";

export class ChoiceSwitchDialogue extends BaseChoiceSwitchDialogue {
  constructor($element: JQuery, shell: Shell) {
    super($element, shell);
  }

  create(): void {
    this.setConfig("choiceSwitchDialogue");
    super.create();
  }

  resize(): void {
    super.resize();
  }
}
