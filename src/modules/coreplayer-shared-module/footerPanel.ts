/// <reference path="../../js/jquery.d.ts" />

import utils = require("../../utils");
import baseApp = require("./baseApp");
import shell = require("./shell");
import baseView = require("./baseView");

export class FooterPanel extends baseView.BaseView {

    $options: JQuery;
    $embedButton: JQuery;
    $fullScreenBtn: JQuery;

    static EMBED: string = 'footer.onEmbed';

    constructor($element: JQuery) {
        super($element, true, false);
    }

    create(): void {
        super.create();

        // events.
        $.subscribe(baseApp.BaseApp.TOGGLE_FULLSCREEN, () => {
            this.toggleFullScreen();
        });

        this.$options = utils.Utils.createDiv('options');
        this.$element.append(this.$options);

        this.$embedButton = $('<a href="#" class="imageButton embed"></a>');
        this.$options.append(this.$embedButton);        

        this.$fullScreenBtn = $('<a href="#" class="imageButton fullScreen"></a>');
        this.$options.append(this.$fullScreenBtn);

        this.$embedButton.on('click', (e) => {
            e.preventDefault();

            $.publish(FooterPanel.EMBED);
        });

        this.$fullScreenBtn.on('click', (e) => {
            e.preventDefault();
            $.publish(baseApp.BaseApp.TOGGLE_FULLSCREEN);
        });
    }

    toggleFullScreen(): void {
        if (this.app.isFullScreen) {
            this.$fullScreenBtn.swapClass('fullScreen', 'normal');
        } else {
            this.$fullScreenBtn.swapClass('normal', 'fullScreen');
        }
    }

    resize(): void {
        super.resize();

        this.$element.css({
            'top': this.app.height() - this.$element.height()
        });
    }
}