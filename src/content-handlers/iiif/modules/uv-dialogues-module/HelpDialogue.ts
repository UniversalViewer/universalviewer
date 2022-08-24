const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { Dialogue } from "../uv-shared-module/Dialogue";

export class HelpDialogue extends Dialogue {
  $message: JQuery;
  $scroll: JQuery;
  $title: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("helpDialogue");

    super.create();

    this.openCommand = IIIFEvents.SHOW_HELP_DIALOGUE;
    this.closeCommand = IIIFEvents.HIDE_HELP_DIALOGUE;

    this.extensionHost.subscribe(this.openCommand, () => {
      this.open();
    });

    this.extensionHost.subscribe(this.closeCommand, () => {
      this.close();
    });

    this.$title = $(`<div role="heading" class="heading"></div>`);
    this.$content.append(this.$title);

    this.$scroll = $('<div class="scroll"></div>');
    this.$content.append(this.$scroll);

    this.$message = $("<p></p>");
    this.$scroll.append(this.$message);

    // initialise ui.
    this.$title.text(this.content.title);
    this.$message.html(this.content.text);

    // ensure anchor tags link to _blank.
    this.$message.targetBlank();

    this.$element.hide();
  }

  resize(): void {
    super.resize();
  }
}
