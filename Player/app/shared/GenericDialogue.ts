/// <reference path="../../js/jquery.d.ts" />
import dialogue = module("app/shared/Dialogue");

export class GenericDialogue extends dialogue.BaseDialogue {
    constructor($element: JQuery) {
        super($element);
        console.log($element);
    }
}


/*
import baseApp = module("app/BaseApp");
import shell = module("app/shared/Shell");
import utils = module("app/Utils");
import dialogue = module("app/shared/Dialogue");

export class GenericDialogue extends dialogue.Dialogue {

    acceptCallback: any;

    $message: JQuery;
    $acceptButton: JQuery;

    static ACCEPT: string = 'genericDialogue.onAccept';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

        $.subscribe(baseApp.BaseApp.SHOW_GENERIC_DIALOGUE, (e, params) => {
            this.open();
            this.acceptCallback = params.acceptCallback;

            if (params.allowClose === false) {
                this.disableClose();
            }
            
            this.showMessage(params.message, params.buttonText);
        });

        $.subscribe(baseApp.BaseApp.HIDE_GENERIC_DIALOGUE, (e) => {
            this.close();
        });

        this.$message = $('<p></p>');

        this.$acceptButton = $('<a class="button accept"></a>');
        this.$content.append(this.$acceptButton);
        this.$acceptButton.text(this.content.genericDialogue.ok);

        this.$acceptButton.on('click', (e) => {
            e.preventDefault();

            this.accept();
        });

        this.$element.hide();
    }

    accept(): void {

        $.publish(GenericDialogue.ACCEPT);

        if (this.acceptCallback) this.acceptCallback();
    }

    showMessage(message: string, buttonText: string): void {
        
        this.$message.html(message);

        if (buttonText) {
            this.$acceptButton.text(buttonText);
        } else {
            this.$acceptButton.text(this.content.genericDialogue.ok);
        }
    }

    resize(): void {
        super.resize();

    }
}
*/