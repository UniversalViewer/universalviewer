import baseExtension = require("./baseExtension");
import shell = require("./shell");
import utils = require("../../utils");
import dialogue = require("./dialogue");

export class GenericDialogue extends dialogue.Dialogue {

    acceptCallback: any;

    $message: JQuery;
    $acceptButton: JQuery;

    static SHOW_GENERIC_DIALOGUE: string = 'onShowGenericDialogue';
    static HIDE_GENERIC_DIALOGUE: string = 'onHideGenericDialogue';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('genericDialogue');
        
        super.create();

        $.subscribe(GenericDialogue.SHOW_GENERIC_DIALOGUE, (e, params) => {          
            this.showMessage(params);
        });

        $.subscribe(GenericDialogue.HIDE_GENERIC_DIALOGUE, (e) => {
            this.close();
        });

        this.$message = $('<p></p>');
        this.$content.append(this.$message);

        this.$acceptButton = $('<a href="#" class="button accept"></a>');
        this.$content.append(this.$acceptButton);
        this.$acceptButton.text(this.content.ok);

        this.$acceptButton.on('click', (e) => {
            e.preventDefault();

            this.accept();
        });

        this.returnFunc = () => {
            if (this.isActive){
                this.accept();
            }
        }

        this.$element.hide();
    }

    accept(): void {

        $.publish(baseExtension.BaseExtension.CLOSE_ACTIVE_DIALOGUE);

        if (this.acceptCallback) this.acceptCallback();
    }

    showMessage(params): void {

        this.$message.html(params.message);

        if (params.buttonText) {
            this.$acceptButton.text(params.buttonText);
        } else {
            this.$acceptButton.text(this.content.ok);
        }

        this.acceptCallback = params.acceptCallback;

        if (params.allowClose === false) {
            this.disableClose();
        }

        this.open();
    }

    resize(): void {
        super.resize();

    }
}