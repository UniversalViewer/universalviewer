/// <reference path="../../js/jquery.d.ts" />

import baseRight = require("../uv-shared-module/rightPanel");

export class MoreInfoRightPanel extends baseRight.RightPanel {

    moreInfoItemTemplate: JQuery;
    $items: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('moreInfoRightPanel');

        super.create();

        this.moreInfoItemTemplate = $('<div class="item">\
                                           <div class="header"></div>\
                                           <div class="text"></div>\
                                       </div>');

        this.$items = $('<div class="items"></div>');
        this.$main.append(this.$items);

        this.$expandButton.attr('tabindex', '4');
        this.$collapseButton.attr('tabindex', '4');

        this.$title.text(this.content.moreInformation);
        this.$closedTitle.text(this.content.moreInformation);
    }

    toggleFinish(): void {
        super.toggleFinish();

        if (this.isUnopened) {
            this.getInfo();
        }
    }

    getInfo(): void {

        // show loading icon.
        this.$main.addClass('loading');

        this.provider.getMetaData((data: any) => {
            this.displayInfo(data);
        }, true);
    }

    displayInfo(data: any): void {
        this.$main.removeClass('loading');

        if (!data){
            this.$main.append(this.content.noData);
            return;
        }

        _.each(data, (item: any) => {
            this.$items.append(this.buildItem(item, 130));
        });
    }

    buildItem(item: any, trimChars: number): any {
        var $elem = this.moreInfoItemTemplate.clone();
        var $header = $elem.find('.header');
        var $text = $elem.find('.text');

        item = _.values(item);

        var name = this.provider.sanitize(item[0]);
        var value = this.provider.sanitize(item[1]);

        name = name.trim();
        name = name.toLowerCase();

        $elem.addClass(name.toCssClass());

        // replace \n with <br>
        value = value.replace('\n', '<br>');

        $header.html(name);
        $text.html(value);
        $text.targetBlank();

        $text.toggleExpandText(trimChars);

        return $elem;
    }

    resize(): void {
        super.resize();

        this.$main.height(this.$element.height() - this.$top.height() - this.$main.verticalMargins());
    }
}
