import BaseCommands = require("../uv-shared-module/Commands");
import Dialogue = require("../uv-shared-module/Dialogue");

class ClickThroughDialogue extends Dialogue {

    $acceptTermsButton: JQuery;
    $message: JQuery;
    $title: JQuery;
    $viewTermsButton: JQuery;
    service: Manifesto.IService;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('clickThroughDialogue');

        super.create();

        $.subscribe(BaseCommands.SHOW_CLICKTHROUGH_DIALOGUE, (e, service: Manifesto.IService) => {
            this.service = service;
            this.open();
        });

        $.subscribe(BaseCommands.HIDE_EXTERNALCONTENT_DIALOGUE, (e) => {
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
            this.$message.load(this.service.getProperty('exp:fullTermsSimple'), () => {
                this.$message.removeClass('loading');
                this.$message.targetBlank();
                this.$viewTermsButton.hide();
            });

            $.publish(BaseCommands.VIEW_FULL_TERMS);
        });

        this.$acceptTermsButton.on('click', (e) => {
            e.preventDefault();

            var redirectUrl = this.service.id + escape(parent.document.URL);

            this.extension.redirect(redirectUrl);
        });
    }

    open(): void {
        super.open();

        this.$title.text(this.service.getLabel());
        this.$message.html(this.service.getProperty('description'));
        this.$acceptTermsButton.text(this.service.getProperty('exp:actionLabel'));

        this.resize();
    }

    resize(): void {
        super.resize();
    }
}

export = ClickThroughDialogue;