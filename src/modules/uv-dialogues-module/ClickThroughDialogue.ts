import BaseCommands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");

class ClickThroughDialogue extends Dialogue {

    acceptCallback: any;
    $acceptTermsButton: JQuery;
    $message: JQuery;
    $title: JQuery;
    $viewTermsButton: JQuery;
    resource: Manifesto.IExternalResource;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('clickThroughDialogue');

        super.create();

        this.openCommand = BaseCommands.SHOW_CLICKTHROUGH_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_CLICKTHROUGH_DIALOGUE;

        $.subscribe(this.openCommand, (e, params) => {
            this.acceptCallback = params.acceptCallback;
            this.resource = params.resource;
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
                    <a class="viewTerms" href="#"></a>\
                    <a class="acceptTerms btn btn-primary" href="#" target="_parent"></a>\
                </div>\
            </div>'
        );

        this.$message = this.$content.find(".message");
        this.$message.targetBlank();

        this.$viewTermsButton = this.$content.find(".viewTerms");
        this.$viewTermsButton.text(this.content.viewTerms);

        this.$acceptTermsButton = this.$content.find(".acceptTerms");

        this.$element.hide();

        this.$viewTermsButton.on('click', (e) => {
            e.preventDefault();

            this.$message.empty();
            this.$message.addClass('loading');
            this.$message.load(this.resource.clickThroughService.getProperty('fullTermsSimple'), () => {
                this.$message.removeClass('loading');
                this.$message.targetBlank();
                this.$viewTermsButton.hide();
            });

            $.publish(BaseCommands.VIEW_FULL_TERMS);
        });

        this.$acceptTermsButton.on('click', (e) => {
            e.preventDefault();
            this.close();
            $.publish(BaseCommands.ACCEPT_TERMS);
            if (this.acceptCallback) this.acceptCallback();

            //var redirectUrl = this.service.id + escape(parent.document.URL);
            //this.extension.redirect(redirectUrl);
        });
    }

    open(): void {
        super.open();

        this.$title.text(this.resource.clickThroughService.getProperty('label'));
        this.$message.html(this.resource.clickThroughService.getProperty('description'));
        this.$acceptTermsButton.text(this.resource.clickThroughService.getProperty('actionLabel'));

        this.resize();
    }

    resize(): void {
        super.resize();
    }
}

export = ClickThroughDialogue;