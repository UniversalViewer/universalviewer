import baseApp = module("app/BaseApp");
import shell = module("app/shared/Shell");
import utils = module("app/Utils");
import dialogue = module("app/shared/Dialogue");

export class HelpDialogue extends dialogue.Dialogue {

    $title: JQuery;
    $scroll: JQuery;
    $message: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

        $.subscribe(baseApp.BaseApp.SHOW_HELP_DIALOGUE, (e, params) => {
            this.open();
        });

        $.subscribe(baseApp.BaseApp.HIDE_HELP_DIALOGUE, (e) => {
            this.close();
        });

        this.$title = $('<h1></h1>');
        this.$content.append(this.$title);

        this.$scroll = $('<div class="scroll"></div>');
        this.$content.append(this.$scroll);

        this.$message = $('<p></p>');
        this.$scroll.append(this.$message);

        // initialise ui.
        this.$title.text(this.content.helpDialogue.title);
        this.$message.html(this.content.helpDialogue.text);

        // ensure anchor tags link to _blank.
        this.$message.find('a').prop('target', '_blank');

        this.$element.hide();
    }

    resize(): void {
        super.resize();

    }
}