/// <reference path="../../js/jquery.d.ts" />
import shell = module("app/shared/Shell");
import baseView = module("app/BaseView");
import utils = module("app/Utils");

export class CenterPanel extends baseView.BaseView {

    $title: JQuery;
    $content: JQuery;

    constructor($element: JQuery) {
        super($element, false, true);
    }

    create(): void {
        super.create();

        this.$title = utils.Utils.createDiv('title');
        this.$element.append(this.$title);

        this.$content = utils.Utils.createDiv('content');
        this.$element.append(this.$content);
    }

    resize(): void {
        super.resize();

        this.$element.css({
            'left': shell.Shell.$leftPanel.width(),
            'width': this.$element.parent().width() - shell.Shell.$leftPanel.width() - shell.Shell.$rightPanel.width()
        });

        this.$content.height(this.$element.height() - this.$title.height());
    }
}