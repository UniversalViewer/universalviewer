/// <reference path="../../js/jquery.d.ts" />

import shell = require("./shell");
import baseView = require("./baseView");
import utils = require("../../utils");

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

        if (this.options.titleEnabled === false){
            this.$title.hide();
        }
    }

    resize(): void {
        super.resize();

        this.$element.css({
            'left': shell.Shell.$leftPanel.width(),
            'width': this.$element.parent().width() - shell.Shell.$leftPanel.width() - shell.Shell.$rightPanel.width()
        });

        var titleHeight;

        if (this.options.titleEnabled === false){
            titleHeight = 0;
        } else {
            titleHeight = this.$title.height();
        }

        this.$content.height(this.$element.height() - titleHeight);
    }
}