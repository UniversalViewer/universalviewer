import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {Dialogue} from "../uv-shared-module/Dialogue";
import {UVUtils} from "../uv-shared-module/Utils";

export class AuthDialogue extends Dialogue {

    closeCallback: any;
    confirmCallback: any;
    cancelCallback: any;
    $cancelButton: JQuery;
    $confirmButton: JQuery;
    $message: JQuery;
    $title: JQuery;
    service: Manifesto.IService;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('authDialogue');

        super.create();

        this.openCommand = BaseEvents.SHOW_AUTH_DIALOGUE;
        this.closeCommand = BaseEvents.HIDE_AUTH_DIALOGUE;

        $.subscribe(this.openCommand, (s: any, e: any) => {
            this.closeCallback = e.closeCallback;
            this.confirmCallback = e.confirmCallback;
            this.cancelCallback = e.cancelCallback;
            this.service = e.service;
            this.open();
        });

        $.subscribe(this.closeCommand, () => {
            this.close();
        });

        this.$title = $('<h1></h1>');
        this.$content.append(this.$title);

        this.$content.append('\
            <div>\
                <p class="message scroll"></p>\
            </div>'
        );

        this.$buttons.prepend(this._buttonsToAdd());

        this.$message = this.$content.find('.message');

        this.$confirmButton = this.$buttons.find('.confirm');
        this.$confirmButton.text(this.content.confirm);

        this.$cancelButton = this.$buttons.find('.close');
        this.$cancelButton.text(this.content.cancel);

        this.$element.hide();

        this.$confirmButton.on('click', (e: any) => {
            e.preventDefault();
            if (this.confirmCallback) {
                this.confirmCallback();
            }
            this.close();
        });

        this.$cancelButton.on('click', (e: any) => {
            e.preventDefault();
            if (this.cancelCallback) {
                this.cancelCallback();
            }
            this.close();
        });

    }

    open(): void {
        super.open();

        let header: string | null = this.service.getHeader();
        let description: string | null = this.service.getDescription();
        let confirmLabel: string | null = this.service.getConfirmLabel();

        if (header) {
            this.$title.text(UVUtils.sanitize(header));
        }

        if (description) {
            this.$message.html(UVUtils.sanitize(description));
            this.$message.targetBlank();

            this.$message.find('a').on('click', function() {
                const url: string = $(this).attr('href');
                $.publish(BaseEvents.EXTERNAL_LINK_CLICKED, [url]);
            });
        }

        if (confirmLabel) {
            this.$confirmButton.text(UVUtils.sanitize(confirmLabel));
        }

        this.resize();
    }

    resize(): void {
        super.resize();
    }

    _buttonsToAdd() : string {
      var buttonsToAdd = '<a class="confirm btn btn-primary" href="#" target="_parent"></a>';
      // If the top button is enabled, add an additional close button for consistency.
      if (this.config.topCloseButtonEnabled) {
        buttonsToAdd += '<button class="close btn btn-default"></button>';
      }
      return buttonsToAdd;
    }
}
