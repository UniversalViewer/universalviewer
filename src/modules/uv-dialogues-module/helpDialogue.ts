import BaseExtension = require("../uv-shared-module/BaseExtension");
import Dialogue = require("../uv-shared-module/Dialogue");
import Extension = require("../../extensions/uv-seadragon-extension/Extension");
import Shell = require("../uv-shared-module/Shell");
import Utils = require("../../Utils");

class HelpDialogue extends Dialogue {

    $message: JQuery;
    $scroll: JQuery;
    $title: JQuery;

    static HIDE_HELP_DIALOGUE: string = 'onHideHelpDialogue';
    static SHOW_HELP_DIALOGUE: string = 'onShowHelpDialogue';

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
        this.$message.targetBlank();

        this.$element.hide();
    }

    resize(): void {
        super.resize();

    }
}

export = HelpDialogue;