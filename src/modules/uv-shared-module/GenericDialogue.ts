import BaseCommands = require("./BaseCommands");
import Dialogue = require("./Dialogue");

class GenericDialogue extends Dialogue {

    acceptCallback: any;
    $acceptButton: JQuery;
    $message: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('genericDialogue');

        super.create();

        this.openCommand = BaseCommands.SHOW_GENERIC_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_GENERIC_DIALOGUE;

        $.subscribe(this.openCommand, (e, params) => {
            this.acceptCallback = params.acceptCallback;
            this.showMessage(params);
        });

        $.subscribe(this.closeCommand, (e) => {
            this.close();
        });

        this.$message = $('<p></p>');
        this.$content.append(this.$message);

        this.$acceptButton = $('<a href="#" class="btn btn-primary accept default"></a>');
        this.$content.append(this.$acceptButton);
        this.$acceptButton.text(this.content.ok);

        this.$acceptButton.onPressed(() => {
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

        $.publish(BaseCommands.CLOSE_ACTIVE_DIALOGUE);

        if (this.acceptCallback) this.acceptCallback();
    }

    showMessage(params): void {

        this.$message.html(params.message);

        if (params.buttonText) {
            this.$acceptButton.text(params.buttonText);
        } else {
            this.$acceptButton.text(this.content.ok);
        }

        if (params.allowClose === false) {
            this.disableClose();
        }

        this.open();
    }

    resize(): void {
        super.resize();
    }
}

export = GenericDialogue;