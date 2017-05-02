import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {Dialogue} from "../uv-shared-module/Dialogue";

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
                <div class="buttons">\
                    <a class="confirm btn btn-primary" href="#" target="_parent"></a>\
                    <a class="cancel btn btn-primary" href="#"></a>\
                </div>\
            </div>'
        );

        this.$message = this.$content.find('.message');

        this.$confirmButton = this.$content.find('.confirm');
        this.$confirmButton.text(this.content.confirm);

        this.$cancelButton = this.$content.find('.cancel');
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

        // let label: string = "";
        // let header: string = "";
        let description: string | null = this.service.getDescription();
        let confirmLabel: string | null = this.service.getConfirmLabel();

        console.log(description, confirmLabel);

        // if (this.resource.loginService) {
        //     this.$title.text(this.resource.loginService.getProperty('label'));
        //     message = this.resource.loginService.getProperty('description');
        // }

        // this.$message.html(message);
        // this.$message.targetBlank();

        // this.$message.find('a').on('click', function() {
        //     var url: string = $(this).attr('href');
        //     $.publish(BaseEvents.EXTERNAL_LINK_CLICKED, [url]);
        // });

        this.resize();
    }

    resize(): void {
        super.resize();
    }
}