import BaseCommands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");

class RestrictedDialogue extends Dialogue {

    acceptCallback: any;
    $cancelButton: JQuery;
    $nextVisibleButton: JQuery;
    $message: JQuery;
    $title: JQuery;
    resource: Manifesto.IExternalResource;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('restrictedDialogue');

        super.create();

        this.openCommand = BaseCommands.SHOW_RESTRICTED_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_RESTRICTED_DIALOGUE;

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
                    <a class="cancel btn btn-primary" href="#" target="_parent"></a>\
                </div>\
            </div>'
        );

        this.$message = this.$content.find('.message');
        this.$message.targetBlank();

        // todo: revisit?
        //this.$nextVisibleButton = this.$content.find('.nextvisible');
        //this.$nextVisibleButton.text(this.content.nextVisibleItem);

        this.$cancelButton = this.$content.find('.cancel');
        this.$cancelButton.text(this.content.cancel);

        this.$element.hide();

        this.$cancelButton.on('click', (e) => {
            e.preventDefault();
            this.close();
        });
    }

    open(): void {
        super.open();

        this.$title.text(this.resource.restrictedService.getProperty('label'));

        var message: string = this.resource.restrictedService.getProperty('description');

        this.$message.html(message);
        this.$message.targetBlank();

        this.$message.find('a').on('click', function() {
            var url: string = $(this).attr('href');
            $.publish(BaseCommands.EXTERNAL_LINK_CLICKED, [url]);
        });

        this.resize();
    }

    close(): void {
        super.close();

        if (this.acceptCallback){
            this.acceptCallback();
        }
    }

    resize(): void {
        super.resize();
    }
}

export = RestrictedDialogue;