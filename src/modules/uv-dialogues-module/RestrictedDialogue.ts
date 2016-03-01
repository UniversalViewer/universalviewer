import BaseCommands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");

class RestrictedDialogue extends Dialogue {

    acceptCallback: any;
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
                    <a class="nextvisible btn btn-primary" href="#" target="_parent"></a>\
                </div>\
            </div>'
        );

        this.$message = this.$content.find('.message');
        this.$message.targetBlank();

        this.$nextVisibleButton = this.$content.find('.nextvisible');
        // TODO: get from config   this.$nextVisibleButton.text(this.content.nextVisible); // figure out config
        this.$nextVisibleButton.text("Next visible item");

        this.$element.hide();

        this.$nextVisibleButton.on('click', (e) => {
            e.preventDefault();
            this.close();
            if (this.acceptCallback) this.acceptCallback();
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

    resize(): void {
        super.resize();
    }
}

export = RestrictedDialogue;