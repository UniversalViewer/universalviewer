/// <reference path="../../js/jquery.d.ts" />
import baseApp = module("app/BaseApp");
import shell = module("app/views/Shell");
import baseView = module("app/BaseView");

export class Main extends baseView.BaseView {

    constructor($element: JQuery) {
        super($element, true, false);
    }

    create(): void {
        super.create();
        this.$element.append(baseApp.BaseApp.dataProvider.data.hello);
    }

    resize(): void {
        super.resize();

        var height = shell.Shell.$element.height() - shell.Shell.$headerPanel.height() - shell.Shell.$footerPanel.height();
        this.$element.height(height);

        this.$element.css({
            'top': shell.Shell.$headerPanel.height()
        });
    }
}