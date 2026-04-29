import { BaseConfig } from "../../BaseConfig";
import { IIIFEvents } from "../../IIIFEvents";
import { Dialogue } from "../uv-shared-module/Dialogue";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { Shell } from "../uv-shared-module/Shell";

export class ChoiceSwitchDialogue extends Dialogue<
  BaseConfig["modules"]["choiceSwitchDialogue"]
> {
  $choiceList!: JQuery;
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

    this.$choiceList = $('<div class="choiceList"></div>');
    this.$content.append(this.$choiceList);
    this.$closeButton.hide();
    this.$element.hide();
  }

  open(): void {
    this.$choiceList.empty();

    const extension = <OpenSeadragonExtension>this.extension;
    const indices = extension.getPagedIndices();
    const isMultiCanvas = indices.length > 1;

    // we can use the OSD world as the source of the current view state
    const world = extension.centerPanel.viewer.world;

    indices.forEach((canvasIndex) => {
      const canvas = extension.helper.getCanvasByIndex(canvasIndex);
      const choices = canvas.getChoices();

      if (!choices.length) return;

      const isFirstCanvas = indices.indexOf(canvasIndex) === 0;

      // this is to update the radio buttons to reflect the current state of the OSD world
      const getWorldItemCount = (canvas) => {
        const numChoices = canvas.getChoices().length;
        return numChoices === 0 ? 1 : numChoices;
      };

      const worldOffset = isFirstCanvas
        ? 0
        : getWorldItemCount(extension.helper.getCanvasByIndex(indices[0]));

      let currentChoiceIndex = 0;
      for (let c = 0; c < choices.length; c++) {
        const item = world.getItemAt(worldOffset + c);
        if (item && item.getOpacity() === 1) {
          currentChoiceIndex = c;
          break;
        }
      }

      const canvasLabel =
        canvas.getLabel().getValue() || `Canvas ${canvasIndex + 1}`;

      if (isMultiCanvas) {
        const $heading = $(`<div class="choiceHeading">${canvasLabel}</div>`);
        this.$choiceList.append($heading);
      }

      const $group = $(
        `<div role="radiogroup" aria-label="${canvasLabel}"></div>`
      );

      choices.forEach((choice, index) => {
        const label = choice.getLabel().getValue() || `Choice ${index + 1}`;
        const isActive = index === currentChoiceIndex;

        const $item = $(`
          <label class="choiceItem">
            <input type="radio" name="choice-${canvas.id}" value="${index}" ${isActive ? "checked" : ""} />
            ${label}
          </label>
        `);

        $item.find("input").on("change", () => {
          this.extensionHost.publish(IIIFEvents.CHOICE_CHANGE, {
            canvasId: canvas.id,
            choiceIndex: index,
          });
        });

        $group.append($item);
      });

      this.$choiceList.append($group);
    });

    const $button = extension.centerPanel.$choiceSwitchButton;
    super.open($button[0]);
    this.shell.$overlays.css("background", "none");
  }

  close(): void {
    this.shell.$overlays.css("background", "");
    super.close();
  }

  resize(): void {
    super.resize();
    this.setDockedPosition("below");
  }
}
