/// <reference path="../../js/jquery.d.ts" />
import baseApp = module("app/BaseApp");
import shell = module("app/shared/Shell");
import utils = module("app/Utils");
import baseView = module("app/BaseView");
import center = module("app/shared/Center");
import left = module("app/shared/Left");
import right = module("app/shared/Right");

export class Main extends baseView.BaseView {
    static $centerPanel: JQuery;
    static $leftPanel: JQuery;
    static $rightPanel: JQuery;

    constructor($element: JQuery) {
        super($element, false, false);
    }

    create(): void {
        super.create();

        Main.$centerPanel = utils.Utils.createDiv('centerPanel');
        this.$element.append(Main.$centerPanel);

        Main.$leftPanel = utils.Utils.createDiv('leftPanel');
        this.$element.append(Main.$leftPanel);

        Main.$rightPanel = utils.Utils.createDiv('rightPanel');
        this.$element.append(Main.$rightPanel);
    }

    resize(): void {
        super.resize();

        var height = shell.Shell.$element.height() - shell.Shell.$headerPanel.height() - shell.Shell.$footerPanel.height();

        this.$element.absHeight(height);
    }
}