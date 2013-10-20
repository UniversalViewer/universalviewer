/// <reference path="../../js/jquery.d.ts" />
import baseExtension = require("./baseExtension");
import shell = require("./shell");
import utils = require("../../utils");
import baseView = require("./baseView");

export class Dialogue extends baseView.BaseView {

    isActive: boolean = false;
    allowClose: boolean = true;
    returnFunc: any;

    $top: JQuery;
    $closeButton: JQuery;
    $middle: JQuery;
    $content: JQuery;
    $bottom: JQuery;

    constructor($element: JQuery) {
        super($element, false, false);
    }

    create(): void {
        super.create();

        // events.
        $.subscribe(baseExtension.BaseExtension.CLOSE_ACTIVE_DIALOGUE, () => {
            if (this.isActive) {
                if (this.allowClose) {
                    this.close();
                }
            }
        });

        $.subscribe(baseExtension.BaseExtension.ESCAPE, () => {
            if (this.isActive) {
                if (this.allowClose) {
                    this.close();
                }
            }
        });

        // default behaviour on RETURN is to close.
        // can be overridden.
        $.subscribe(baseExtension.BaseExtension.RETURN, (e) => {
            this.returnFunc();
        });

        this.$top = utils.Utils.createDiv('top');
        this.$element.append(this.$top);

        this.$closeButton = utils.Utils.createDiv('close');
        this.$top.append(this.$closeButton);

        this.$middle = utils.Utils.createDiv('middle');
        this.$element.append(this.$middle);

        this.$content = utils.Utils.createDiv('content');
        this.$middle.append(this.$content);

        this.$bottom = utils.Utils.createDiv('bottom');
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

    setArrowPosition(): void {
        // set bottom background position to mouse x.
        var paddingLeft = parseInt(this.$element.css("padding-left"));
        var pos = this.extension.mouseX - paddingLeft - 10; // 10 = 1/2 arrow width.
        if (pos < 0) pos = 0;
        this.$bottom.css('backgroundPosition', pos + 'px 0px');
    }

    open(): void {
        this.$element.show();
        this.setArrowPosition();
        this.isActive = true;

        $.publish(shell.Shell.SHOW_OVERLAY);

        this.resize();
    }

    close(): void {
        if (this.isActive) {
            this.$element.hide();
            this.isActive = false;

            $.publish(shell.Shell.HIDE_OVERLAY);
        }
    }

    resize(): void {
        super.resize();

        this.$element.css({
            'top': (this.extension.height() / 2) - (this.$element.height() / 2),
            'left': (this.extension.width() / 2) - (this.$element.width() / 2)
        });
    }
}