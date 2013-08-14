/// <reference path="../../../js/jquery.d.ts" />
import baseApp = require("app/modules/shared/baseApp");
import baseView = require("app/modules/shared/baseView");
import utils = require("app/utils");

export class HeaderPanel extends baseView.BaseView {

    $centerOptions: JQuery;
    $rightOptions: JQuery;
    $helpButton: JQuery;

    constructor($element: JQuery) {
        super($element, false, false);
    }

    create(): void {

        super.create();

        this.$centerOptions = utils.Utils.createDiv('centerOptions');
        this.$element.append(this.$centerOptions);

        this.$rightOptions = utils.Utils.createDiv('rightOptions');
        this.$element.append(this.$rightOptions);

        this.$helpButton = $('<a href="#" class="action help">' + this.content.help + '</a>');
        this.$rightOptions.append(this.$helpButton);
    }

    resize(): void {
        super.resize();

        var headerWidth = this.$element.width();
        var center = headerWidth / 2;
        var containerWidth = this.$centerOptions.outerWidth();
        var pos = center - (containerWidth / 2);

        this.$centerOptions.css({
            left: pos
        });
    }
}