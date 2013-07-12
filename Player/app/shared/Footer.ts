/// <reference path="../../js/jquery.d.ts" />
import utils = module("app/Utils");
import baseApp = module("app/BaseApp");
import shell = module("app/shared/Shell");
import baseView = module("app/BaseView");

export class Footer extends baseView.BaseView {

    $fullScreenBtn: JQuery;

    constructor($element: JQuery) {
        super($element, true, false);
    }

    create(): void {
        super.create();

        // event handlers.
        $.subscribe(baseApp.BaseApp.TOGGLE_FULLSCREEN, () => {
            this.toggleFullScreen();
        });

        this.$fullScreenBtn = $('<a href="#">' + baseApp.BaseApp.provider.content.footer.fullScreen + '</a>');
        this.$element.append(this.$fullScreenBtn);

        this.$fullScreenBtn.on('click', (e) => {
            e.preventDefault();
            $.publish(baseApp.BaseApp.TOGGLE_FULLSCREEN);
        });
    }

    toggleFullScreen(): void {
        if (baseApp.BaseApp.isFullScreen) {
            this.$fullScreenBtn.text(baseApp.BaseApp.provider.content.footer.exitFullScreen);
        } else {
            this.$fullScreenBtn.text(baseApp.BaseApp.provider.content.footer.fullScreen);
        }
    }

    resize(): void {
        super.resize();

        this.$element.css({
            'top': shell.Shell.$headerPanel.height() + shell.Shell.$mainPanel.height()
        });
    }
}