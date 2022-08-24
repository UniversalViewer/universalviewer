const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { Dialogue } from "../uv-shared-module/Dialogue";
import { sanitize } from "../../../../Utils";
import { Service } from "manifesto.js";

export class AuthDialogue extends Dialogue {
  closeCallback: any;
  confirmCallback: any;
  cancelCallback: any;
  $cancelButton: JQuery;
  $confirmButton: JQuery;
  $message: JQuery;
  $title: JQuery;
  service: Service;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("authDialogue");

    super.create();

    this.openCommand = IIIFEvents.SHOW_AUTH_DIALOGUE;
    this.closeCommand = IIIFEvents.HIDE_AUTH_DIALOGUE;

    this.extensionHost.subscribe(this.openCommand, (_e: any) => {
      const e = Array.isArray(_e) ? _e[0] : _e;
      this.closeCallback = e.closeCallback;
      this.confirmCallback = e.confirmCallback;
      this.cancelCallback = e.cancelCallback;
      this.service = e.service;
      this.open();
    });

    this.extensionHost.subscribe(this.closeCommand, () => {
      this.close();
    });

    this.$title = $(`<div role="heading" class="heading"></div>`);
    this.$content.append(this.$title);

    this.$content.append(
      '\
            <div>\
                <p class="message scroll"></p>\
            </div>'
    );

    this.$buttons.prepend(this._buttonsToAdd());

    this.$message = this.$content.find(".message");

    this.$confirmButton = this.$buttons.find(".confirm");
    this.$confirmButton.text(this.content.confirm);

    this.$cancelButton = this.$buttons.find(".close");
    this.$cancelButton.text(this.content.cancel);

    this.$element.hide();

    this.$confirmButton.on("click", (e: any) => {
      e.preventDefault();
      if (this.confirmCallback) {
        this.confirmCallback();
      }
      this.close();
    });

    this.$cancelButton.on("click", (e: any) => {
      e.preventDefault();
      if (this.cancelCallback) {
        this.cancelCallback();
      }
      this.close();
    });
  }

  open(): void {
    if (!this.service) {
      console.error("NO SERVICE");
      return;
    }

    super.open();

    let header: string | null = this.service.getHeader();
    let description: string | null = this.service.getDescription();
    let confirmLabel: string | null = this.service.getConfirmLabel();

    if (header) {
      this.$title.text(sanitize(header));
    }

    if (description) {
      this.$message.html(sanitize(description));
      this.$message.targetBlank();

      this.$message.find("a").on("click", function() {
        const url: string = $(this).attr("href");
        this.extensionHost.publish(IIIFEvents.EXTERNAL_LINK_CLICKED, url);
      });
    }

    if (confirmLabel) {
      this.$confirmButton.text(sanitize(confirmLabel));
    }

    this.resize();
  }

  resize(): void {
    super.resize();
  }

  _buttonsToAdd(): string {
    var buttonsToAdd =
      '<a class="confirm btn btn-primary" href="#" target="_parent"></a>';
    // If the top button is enabled, add an additional close button for consistency.
    if (this.config.topCloseButtonEnabled) {
      buttonsToAdd += '<button class="close btn btn-default"></button>';
    }
    return buttonsToAdd;
  }
}
