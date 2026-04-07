import { BaseConfig } from "../../BaseConfig";
import { IIIFEvents } from "../../IIIFEvents";
import { Dialogue } from "../uv-shared-module/Dialogue";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { Shell } from "../uv-shared-module/Shell";

export class ChoiceSwitchDialogue extends Dialogue<
  BaseConfig["modules"]["choiceSwitchDialogue"]
> {
  $choiceList: JQuery;
  shell: Shell;

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

    this.$choiceList = $(
      '<div class="choiceList" role="radiogroup" aria-label="Image choices"></div>'
    );
    this.$content.append(this.$choiceList);

    this.$closeButton.hide();

    this.$element.hide();
  }

  open(): void {
    this.$choiceList.empty();

    const choices = (<OpenSeadragonExtension>(
      this.extension
    )).helper.getChoices();

    choices.forEach((choice, index) => {
      const label = choice.getLabel().getValue() ?? `Choice ${index + 1}`;
      const isActive =
        index === (<OpenSeadragonExtension>this.extension).helper.choiceIndex;

      const $item = $(`
        <label class="choiceItem">
          <input type="radio" name="choice" value="${index}" ${isActive ? "checked" : ""} />
          ${label}
        </label>
      `);

      $item.find("input").on("change", () => {
        this.extensionHost.publish(IIIFEvents.CHOICE_CHANGE, index);
        this.close();
      });

      this.$choiceList.append($item);
    });

    const $button = (<OpenSeadragonExtension>this.extension).centerPanel
      .$choiceSwitchButton;
    super.open($button[0]);
    this.shell.$overlays.css("background", "none");
  }

  close(): void {
    this.shell.$overlays.css("background", "");
    super.close();
  }

  resize(): void {
    super.resize();
    this.setDockedPosition();
  }
}
