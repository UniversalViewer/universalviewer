import Shell = require("./Shell");
import BaseView = require("./BaseView");

class CenterPanel extends BaseView {

    $content: JQuery;
    $title: JQuery;

    constructor($element: JQuery) {
        super($element, false, true);
    }

    create(): void {
        super.create();

        this.$title = $('<div class="title"></div>');
        this.$element.append(this.$title);

        this.$content = $('<div id="content" class="content"></div>');
        this.$element.append(this.$content);

        if (this.options.titleEnabled === false){
            this.$title.hide();
        }
    }

    resize(): void {
        super.resize();

        this.$element.css({
            'left': Shell.$leftPanel.width(),
            'width': this.$element.parent().width() - Shell.$leftPanel.width() - Shell.$rightPanel.width()
        });

        var titleHeight;

        if (this.options && this.options.titleEnabled === false){
            titleHeight = 0;
        } else {
            titleHeight = this.$title.height();
        }

        this.$content.height(this.$element.height() - titleHeight);
        this.$content.width(this.$element.width());
    }
}

export = CenterPanel;