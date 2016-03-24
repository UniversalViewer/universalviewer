import BaseCommands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");
import ILoginDialogueOptions = require("../uv-shared-module/ILoginDialogueOptions");

class LoginDialogue extends Dialogue {

    acceptCallback: any;
    $cancelButton: JQuery;
    $loginButton: JQuery;
    $message: JQuery;
    $title: JQuery;
    options: ILoginDialogueOptions;
    resource: Manifesto.IExternalResource;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('loginDialogue');

        super.create();

        this.openCommand = BaseCommands.SHOW_LOGIN_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_LOGIN_DIALOGUE;

        $.subscribe(this.openCommand, (s, e: any) => {
            this.acceptCallback = e.acceptCallback;
            this.options = e.options;
            this.resource = e.resource;
            this.open();
        });

        $.subscribe(this.closeCommand, (e) => {
            this.close();
        });

        this.$title = $('<h1></h1>');
        this.$content.append(this.$title);

        this.$content.append('\
            <div>\
                <p class="message scroll"></p>\
                <div class="buttons">\
                    <a class="login btn btn-primary" href="#" target="_parent"></a>\
                    <a class="cancel btn btn-primary" href="#"></a>\
                </div>\
            </div>'
        );

        this.$message = this.$content.find('.message');

        this.$loginButton = this.$content.find('.login');
        this.$loginButton.text(this.content.login);

        this.$cancelButton = this.$content.find('.cancel');
        this.$cancelButton.text(this.content.cancel);

        this.$element.hide();

        this.$loginButton.on('click', (e) => {
            e.preventDefault();
            this.close();
            if (this.acceptCallback) this.acceptCallback();
        });

        this.$cancelButton.on('click', (e) => {
            e.preventDefault();
            this.close();
        });
    }

    open(): void {
        super.open();

        this.$title.text(this.resource.loginService.getProperty('label'));

        var message: string = this.resource.loginService.getProperty('description');

        if (this.options.warningMessage){
            message = '<span class="warning">' + this.provider.config.content[this.options.warningMessage] + '</span><span class="description">' + message + '</span>';
        }

        this.$message.html(message);
        this.$message.targetBlank();

        this.$message.find('a').on('click', function() {
            var url: string = $(this).attr('href');
            $.publish(BaseCommands.EXTERNAL_LINK_CLICKED, [url]);
        });

        if (this.options.showCancelButton){
            this.$cancelButton.show();
        } else {
            this.$cancelButton.hide();
        }

        this.resize();
    }

    resize(): void {
        super.resize();
    }
}

export = LoginDialogue;