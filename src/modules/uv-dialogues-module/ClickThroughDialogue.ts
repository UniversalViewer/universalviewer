import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {Dialogue} from "../uv-shared-module/Dialogue";

export class ClickThroughDialogue extends Dialogue {

    acceptCallback: any;
    $acceptTermsButton: JQuery;
    $message: JQuery;
    $title: JQuery;
    resource: Manifesto.IExternalResource;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('clickThroughDialogue');

        super.create();

        this.openCommand = BaseEvents.SHOW_CLICKTHROUGH_DIALOGUE;
        this.closeCommand = BaseEvents.HIDE_CLICKTHROUGH_DIALOGUE;

        $.subscribe(this.openCommand, (e: any, params: any) => {
            this.acceptCallback = params.acceptCallback;
            this.resource = params.resource;
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
                    <a class="acceptTerms btn btn-primary" href="#" target="_parent"></a>\
                </div>\
            </div>'
        );

        this.$message = this.$content.find(".message");

        this.$acceptTermsButton = this.$content.find(".acceptTerms");
        // TODO: get from config this.$acceptTermsButton.text(this.content.acceptTerms); // figure out config
        this.$acceptTermsButton.text("Accept Terms and Open");

        this.$element.hide();

        this.$acceptTermsButton.on('click', (e) => {
            e.preventDefault();
            this.close();
            $.publish(BaseEvents.ACCEPT_TERMS);
            if (this.acceptCallback) this.acceptCallback();
        });
    }

    open(): void {
        super.open();

        if (this.resource.clickThroughService) {
            this.$title.text(this.resource.clickThroughService.getProperty('label'));
            this.$message.html(this.resource.clickThroughService.getProperty('description'));
            this.$message.targetBlank();
        }

        this.$message.find('a').on('click', function() {
            var url: string = $(this).attr('href');
            $.publish(BaseEvents.EXTERNAL_LINK_CLICKED, [url]);
        });

        this.resize();
    }

    resize(): void {
        super.resize();
    }
}