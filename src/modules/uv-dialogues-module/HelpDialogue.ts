import BaseCommands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");

class HelpDialogue extends Dialogue {

    $message: JQuery;
    $scroll: JQuery;
    $title: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('helpDialogue');
        
        super.create();

        this.openCommand = BaseCommands.SHOW_HELP_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_HELP_DIALOGUE;

        $.subscribe(this.openCommand, (e, params) => {
            this.open();
        });

        $.subscribe(this.closeCommand, (e) => {
            this.close();
        });

        this.$title = $('<h1></h1>');
        this.$content.append(this.$title);

        this.$scroll = $('<div class="scroll"></div>');
        this.$content.append(this.$scroll);

        this.$message = $('<p></p>');
        this.$scroll.append(this.$message);

        // initialise ui.
        this.$title.text(this.content.title);
        this.$message.html(this.content.text);

        // ensure anchor tags link to _blank.
        this.$message.targetBlank();

        this.$element.hide();
    }

    resize(): void {
        super.resize();

    }
}

export = HelpDialogue;