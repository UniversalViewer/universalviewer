const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { Dialogue } from "./Dialogue";

export class GenericDialogue extends Dialogue {
  acceptCallback: any;
  $acceptButton: JQuery;
  $message: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("genericDialogue");

    super.create();

    this.openCommand = IIIFEvents.SHOW_GENERIC_DIALOGUE;
    this.closeCommand = IIIFEvents.HIDE_GENERIC_DIALOGUE;

    this.extensionHost.subscribe(this.openCommand, (params: any) => {
      this.acceptCallback = params.acceptCallback;
      this.showMessage(params);
    });

    this.extensionHost.subscribe(this.closeCommand, () => {
      this.close();
    });

    this.$message = $("<p></p>");
    this.$content.append(this.$message);

    this.$acceptButton = $(`
          <button class="btn btn-primary accept default">
            ${this.content.ok}
          </button>
        `);
    this.$buttons.append(this.$acceptButton);
    // Hide the redundant close button
    this.$buttons.find(".close").hide();

    this.$acceptButton.onPressed(() => {
      this.accept();
    });

    this.returnFunc = () => {
      if (this.isActive) {
        this.accept();
      }
    };

    this.$element.hide();
  }

  accept(): void {
    this.extensionHost.publish(IIIFEvents.CLOSE_ACTIVE_DIALOGUE);
    if (this.acceptCallback) this.acceptCallback();
  }

  showMessage(params: any): void {
    this.$message.html(params.message);

    if (params.buttonText) {
      this.$acceptButton.text(params.buttonText);
    } else {
      this.$acceptButton.text(this.content.ok);
    }

    if (params.allowClose === false) {
      this.disableClose();
    }

    this.open();
  }

  resize(): void {
    super.resize();
  }
}
