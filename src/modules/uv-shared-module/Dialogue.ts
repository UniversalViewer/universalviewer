import BaseView = require("./BaseView");
import Commands = require("./BaseCommands");

class Dialogue extends BaseView {

    allowClose: boolean = true;
    isActive: boolean = false;
    isUnopened: boolean = true;
    openCommand: string;
    closeCommand: string;
    returnFunc: any;

    $bottom: JQuery;
    $triggerButton: JQuery;
    $closeButton: JQuery;
    $content: JQuery;
    $middle: JQuery;
    $top: JQuery;

    constructor($element: JQuery) {
        super($element, false, false);
    }

    create(): void {

        this.setConfig('dialogue');

        super.create();

        // events.
        $.subscribe(Commands.CLOSE_ACTIVE_DIALOGUE, () => {
            if (this.isActive) {
                if (this.allowClose) {
                    this.close();
                }
            }
        });

        $.subscribe(Commands.ESCAPE, () => {
            if (this.isActive) {
                if (this.allowClose) {
                    this.close();
                }
            }
        });

        this.$top = $('<div class="top"></div>');
        this.$element.append(this.$top);

        this.$closeButton = $('<a href="#" class="close" tabindex="0">' + this.content.close + '</a>');
        this.$top.append(this.$closeButton);

        this.$middle = $('<div class="middle"></div>');
        this.$element.append(this.$middle);

        this.$content = $('<div class="content"></div>');
        this.$middle.append(this.$content);

        this.$bottom = $('<div class="bottom"></div>');
        this.$element.append(this.$bottom);

        this.$closeButton.on('click', (e) => {
            e.preventDefault();

            this.close();
        });

        this.returnFunc = this.close;
    }

    enableClose(): void {
        this.allowClose = true;
        this.$closeButton.show();
    }

    disableClose(): void {
        this.allowClose = false;
        this.$closeButton.hide();
    }

    setDockedPosition(): void {

        var top: number = Math.floor(this.extension.height() - this.$element.outerHeight(true));
        var left: number = 0;
        var arrowLeft: number = 0;

        if (this.$triggerButton) {
            // get the normalised position of the button
            var buttonPos: number = Math.normalise(this.$triggerButton.offset().left, 0, this.extension.width());
            left = Math.floor((this.extension.width() * buttonPos) - (this.$element.width() * buttonPos));
            arrowLeft = (this.$element.width() * buttonPos);
        }

        this.$bottom.css('backgroundPosition', arrowLeft + 'px 0px');

        this.$element.css({
            'top': top,
            'left': left
        });
    }

    open($triggerButton?: JQuery): void {
        this.$element.show();

        if ($triggerButton && $triggerButton.length) {
            this.$triggerButton = $triggerButton;
            this.$bottom.show();
        } else {
            this.$bottom.hide();
        }
        
        this.isActive = true;

        // set the focus to the default button.
        setTimeout(() => {
            var $defaultButton = this.$element.find('.default');
            if ($defaultButton.length){
                $defaultButton.focus();
            } else {
                // if there's no default button, focus on the first visible input
                var $input = this.$element.find('input:visible').first();

                if ($input.length){
                    $input.focus();
                } else {
                    // if there's no visible first input, focus on the close button
                    this.$closeButton.focus();
                }
            }
        }, 1);

        $.publish(Commands.SHOW_OVERLAY);

        if (this.isUnopened){
            this.isUnopened = false;
            this.afterFirstOpen();
        }

        this.resize();
    }

    afterFirstOpen(): void {

    }

    close(): void {
        if (!this.isActive) return;

        this.$element.hide();
        this.isActive = false;

        $.publish(this.closeCommand);
        $.publish(Commands.HIDE_OVERLAY);
    }

    resize(): void {
        super.resize();

        this.$element.css({
            'top': Math.floor((this.extension.height() / 2) - (this.$element.height() / 2)),
            'left': Math.floor((this.extension.width() / 2) - (this.$element.width() / 2))
        });
    }
}

export = Dialogue;