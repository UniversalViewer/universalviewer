/// <reference path="../../js/jquery.d.ts" />
import main = module("app/shared/Main");
import baseView = module("app/BaseView");
import utils = module("app/Utils");

export class Center extends baseView.BaseView {

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
            'left': main.Main.$leftPanel.width(),
            'width': this.$element.parent().width() - main.Main.$leftPanel.width() - main.Main.$rightPanel.width()
        });

        this.$content.height(this.$element.height() - this.$title.outerHeight());
    }
}