/// <reference path="../../js/jquery.d.ts" />

import baseView = module("app/BaseView");

export class BaseDialogue extends baseView.BaseView {
    constructor($element: JQuery) {
        super($element, false, false);
    }
}

/*
import baseApp = module("app/BaseApp");
import shell = module("app/shared/Shell");
import utils = module("app/Utils");
import baseView = module("app/BaseView");

export class Dialogue extends baseView.BaseView {

    isActive: bool = false;
    allowClose: bool = true;

    $top: JQuery;
    $closeButton: JQuery;
    $middle: JQuery;
    $content: JQuery;
    $bottom: JQuery;

    static CLOSE: string = 'dialogue.onClose';

    constructor($element: JQuery) {
        super($element, false, false);
    }

    create(): void {
        super.create();
        
        // events.
        $.subscribe(baseApp.BaseApp.CLOSE_ACTIVE_DIALOGUE, () => {
            if (this.isActive) {
                if (this.allowClose) {
                    this.close();
                }
            }
        });

        this.$top = utils.Utils.createDiv('top');
        this.$element.append(this.$top);

        this.$closeButton = utils.Utils.createDiv('close');
        this.$element.append(this.$closeButton);

        this.$middle = utils.Utils.createDiv('middle');
        this.$element.append(this.$middle);

        this.$content = utils.Utils.createDiv('content');
        this.$element.append(this.$content);

        this.$bottom = utils.Utils.createDiv('bottom');
        this.$element.append(this.$bottom);

        this.$closeButton.on('click', (e) => {
            e.preventDefault();

            this.close();
        });
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
        var pos = baseApp.BaseApp.mouseX - paddingLeft - 10;
        if (pos < 0) pos = 0;
        this.$bottom.css('backgroundPosition', pos + 'px 0px');
    }

    open(): void {
        this.$element.show();
        this.setArrowPosition();
        this.isActive = true;
    }

    close(): void {
        if (this.isActive) {
            this.$element.hide();
            this.isActive = false;

            $.publish(Dialogue.CLOSE);
        }
    }

    resize(): void {
        super.resize();

        
    }
}
*/