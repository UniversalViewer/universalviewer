import baseApp = require("app/modules/shared/baseApp");
import app = require("app/extensions/seadragon/app");
import shell = require("app/modules/shared/shell");
import utils = require("app/utils");
import dialogue = require("app/modules/shared/dialogue");

export class HelpDialogue extends dialogue.Dialogue {

    $title: JQuery;
    $scroll: JQuery;
    $message: JQuery;

    static SHOW_HELP_DIALOGUE: string = 'onShowHelpDialogue';
    static HIDE_HELP_DIALOGUE: string = 'onHideHelpDialogue';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('helpDialogue');
        
        super.create();

        $.subscribe(HelpDialogue.SHOW_HELP_DIALOGUE, (e, params) => {
            this.open();
        });

        $.subscribe(HelpDialogue.HIDE_HELP_DIALOGUE, (e) => {
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
        this.$message.find('a').prop('target', '_blank');

        this.$element.hide();
    }

    resize(): void {
        super.resize();

    }
}