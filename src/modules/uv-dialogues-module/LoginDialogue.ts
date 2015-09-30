import BaseCommands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");

class LoginDialogue extends Dialogue {

    acceptCallback: any;
    $loginButton: JQuery;
    $message: JQuery;
    $title: JQuery;
    resource: Manifesto.IExternalResource;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('loginDialogue');

        super.create();

        $.subscribe(BaseCommands.SHOW_LOGIN_DIALOGUE, (e, params) => {
            this.acceptCallback = params.acceptCallback;
            this.resource = params.resource;
            this.open();
        });

        this.$title = $('<h1></h1>');
        this.$content.append(this.$title);

        this.$content.append('\
            <div>\
                <p class="message scroll"></p>\
                <div class="buttons">\
                    <a class="login btn btn-primary" href="#" target="_parent"></a>\
                </div>\
            </div>'
        );

        this.$message = this.$content.find(".message");

        this.$loginButton = this.$content.find(".login");
        this.$loginButton.text(this.content.login);

        this.$element.hide();

        this.$loginButton.on('click', (e) => {
            e.preventDefault();
            this.close();
            if (this.acceptCallback) this.acceptCallback();
        });
    }

    open(): void {
        super.open();

        this.$title.text(this.resource.loginService.getProperty('label'));
        this.$message.html(this.resource.loginService.getProperty('description'));
        this.$message.targetBlank();

        this.resize();
    }

    resize(): void {
        super.resize();
    }
}

export = LoginDialogue;