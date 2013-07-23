/// <reference path="../../js/jquery.d.ts" />
import baseApp = module("app/BaseApp");
import baseView = module("app/BaseView");
import utils = module("app/Utils");

export class Header extends baseView.BaseView {

    $centerOptions: JQuery;
    $rightOptions: JQuery;
    $helpButton: JQuery;

    constructor($element: JQuery) {
        super($element, true, false);
    }

    create(): void {
        super.create();

        this.$centerOptions = utils.Utils.createDiv('centerOptions');
        this.$element.append(this.$centerOptions);

        this.$rightOptions = utils.Utils.createDiv('rightOptions');
        this.$element.append(this.$rightOptions);

        this.$helpButton = $('<a href="#" class="action help">' + this.content.header.help + '</a>');
        this.$rightOptions.append(this.$helpButton);

        // initialise ui.

        // ui event handlers.
        this.$helpButton.click(function (e) {
            e.preventDefault();

            $.publish(baseApp.BaseApp.SHOW_HELP_DIALOGUE);
        });
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