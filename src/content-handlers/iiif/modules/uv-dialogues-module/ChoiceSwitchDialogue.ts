import { BaseConfig } from "../../BaseConfig";
import { IIIFEvents } from "../../IIIFEvents";
import { Dialogue } from "../uv-shared-module/Dialogue";
import { Shell } from "../uv-shared-module/Shell";

export class ChoiceSwitchDialogue extends Dialogue<
  BaseConfig["modules"]["choiceSwitchDialogue"]
> {
  $choiceList!: JQuery;
  shell: Shell;
  $anchor!: JQuery;

  constructor($element: JQuery, shell: Shell) {
    super($element);
    this.shell = shell;
  }

  create(): void {
    this.setConfig("choiceSwitchDialogue");
    super.create();

    this.extensionHost.subscribe(IIIFEvents.SHOW_CHOICE_SWITCH_DIALOGUE, () => {
      this.open();
    });

    this.$choiceList = $('<div class="choiceList"></div>');
    this.$content.append(this.$choiceList);
    this.$closeButton.hide();
    this.$element.hide();
  }

  open(): void {
    super.open(this.$anchor[0] as HTMLElement);
    this.shell.$overlays.css({ background: "none" });
    $(".viewer").addClass("choice-dialogue-open");
  }

  close(): void {
    this.shell.$overlays.off("click.choiceSwitch");
    this.shell.$overlays.css({ background: "" });
    $(".viewer").removeClass("choice-dialogue-open");
    super.close();
  }

  resize(): void {
    super.resize();
    this.setDockedPosition("below");
  }
}
