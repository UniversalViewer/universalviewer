/// <reference path="../../js/jquery.d.ts" />

import baseRight = require("../uv-shared-module/rightPanel");

export class MoreInfoRightPanel extends baseRight.RightPanel {

    moreInfoItemTemplate: JQuery;
    $items: JQuery;
    $noData: JQuery;

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

        this.$noData = $('<div class="noData">' + this.content.noData + '</div>');
        this.$main.append(this.$noData);

        this.$expandButton.attr('tabindex', '4');
        this.$collapseButton.attr('tabindex', '4');

        this.$title.text(this.content.title);
        this.$closedTitle.text(this.content.title);
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
            this.$noData.show();
            return;
        }

        this.$noData.hide();

        _.each(data, (item: any) => {
            this.$items.append(this.buildItem(item, 130));
        });
    }

    buildItem(item: any, trimChars: number): any {
        var $elem = this.moreInfoItemTemplate.clone();
        var $header = $elem.find('.header');
        var $text = $elem.find('.text');

        var label = this.provider.getLocalisedValue(item.label);
        var value  = this.provider.getLocalisedValue(item.value);

        label = this.provider.sanitize(label);
        value = this.provider.sanitize(value);

        // replace \n with <br>
        value = value.replace('\n', '<br>');

        $header.html(label);
        $text.html(value);
        $text.targetBlank();

        $text.toggleExpandText(trimChars);

        label = label.trim();
        label = label.toLowerCase();

        $elem.addClass(label.toCssClass());

        return $elem;
    }

    resize(): void {
        super.resize();

        this.$main.height(this.$element.height() - this.$top.height() - this.$main.verticalMargins());
    }
}
