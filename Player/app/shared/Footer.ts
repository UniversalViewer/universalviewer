/// <reference path="../../js/jquery.d.ts" />
import utils = module("app/Utils");
import baseApp = module("app/BaseApp");
import shell = module("app/shared/Shell");
import baseView = module("app/BaseView");

export class Footer extends baseView.BaseView {

    $options: JQuery;
    $fullScreenBtn: JQuery;

    constructor($element: JQuery) {
        super($element, false, false);
    }

    create(): void {
        super.create();

        // events.
        $.subscribe(baseApp.BaseApp.TOGGLE_FULLSCREEN, () => {
            this.toggleFullScreen();
        });

        this.$options = utils.Utils.createDiv('options');
        this.$element.append(this.$options);

        this.$fullScreenBtn = $('<a href="#" class="imageButton fullScreen"></a>');
        this.$options.append(this.$fullScreenBtn);

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
            'top': shell.Shell.$headerPanel.height() + shell.Shell.$mainPanel.height()
        });
    }
}