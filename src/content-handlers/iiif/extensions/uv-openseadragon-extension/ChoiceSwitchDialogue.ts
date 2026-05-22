import { ChoiceSwitchDialogue as BaseChoiceSwitchDialogue } from "../../modules/uv-dialogues-module/ChoiceSwitchDialogue";
import { IIIFEvents } from "../../IIIFEvents";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { Strings } from "../../Utils";

export class ChoiceSwitchDialogue extends BaseChoiceSwitchDialogue {
  open(): void {
    this.$choiceList.empty();

    const extension = <OpenSeadragonExtension>this.extension;
    const indices = extension.getPagedIndices();
    const isTwoUp = indices.length > 1;

    // we can use the OSD world as the source of the current view state
    const world = extension.centerPanel.viewer.world;

    indices.forEach((canvasIndex) => {
      const canvas = extension.helper.getCanvasByIndex(canvasIndex);
      const choices = canvas.getChoices();

      if (!choices.length) return;

      const isFirstCanvas = indices.indexOf(canvasIndex) === 0;

      // this is to update the radio buttons to reflect the current state of the OSD world

      // a canvas with "zero" choices has to be counted as one
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

      const locale = extension.getLocale();

      const canvasLabel =
        canvas.getLabel().getValue(locale) ||
        Strings.format(this.content.canvas, String(canvasIndex + 1));

      if (isTwoUp) {
        const $heading = $(`<div class="choiceHeading">${canvasLabel}</div>`);
        this.$choiceList.append($heading);
      }

      const $group = $(
        `<div role="radiogroup" aria-label="${canvasLabel}"></div>`
      );

      choices.forEach((choice, index) => {
        const label =
          choice.getLabel().getValue(locale) ||
          Strings.format(this.content.choice, String(index + 1));

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

    const mobileFooterButton = extension.mobileFooterPanel?.$choiceSwitchButton;
    this.$anchor =
      mobileFooterButton?.is(":visible") && mobileFooterButton?.length
        ? mobileFooterButton
        : extension.centerPanel.$choiceSwitchButton;

    super.open();
  }
}
