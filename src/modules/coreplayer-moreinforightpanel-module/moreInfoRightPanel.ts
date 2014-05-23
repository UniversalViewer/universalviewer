/// <reference path="../../js/jquery.d.ts" />

import baseRight = require("../coreplayer-shared-module/rightPanel");

export class MoreInfoRightPanel extends baseRight.RightPanel {

    moreInfoItemTemplate: JQuery;
    $conditionsLink: JQuery;

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
    }

    toggleComplete(): void {
        super.toggleComplete();

        if (this.isUnopened) {
            this.getInfo();
        }
    }

    getInfo(): void {

        // show loading icon.
        this.$main.addClass('loading');

        this.provider.getMetaData((data: any) => {
            this.displayInfo(data);
        });
    }

    displayInfo(data: any): void {
        this.$main.removeClass('loading');

        if (!data){
            this.$main.append(this.content.holdingText);
            return;
        }

        _.each(data, (item: any) => {
            this.$main.append(this.buildItem(item, 130));
        });
    }

    buildItem(item: any, trimChars: number): any {
        var $elem = this.moreInfoItemTemplate.clone();
        var $header = $elem.find('.header');
        var $text = $elem.find('.text');

        item = _.values(item);

        var name = item[0];
        var value = item[1];

        // replace \n with <br>
        value = value.replace('\n', '<br>');

        $header.text(name);
        $text.text(value);

        //$text.toggleExpandText(trimChars);

        return $elem;
    }

    resize(): void {
        super.resize();

    }
}
