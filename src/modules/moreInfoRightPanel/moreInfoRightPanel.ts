/// <reference path="../../js/jquery.d.ts" />

import baseApp = require("../shared/baseApp");
import baseRight = require("../shared/rightPanel");
import utils = require("../../utils");
import conditions = require("../dialogues/conditionsDialogue");

export class MoreInfoRightPanel extends baseRight.RightPanel {

    moreInfoItemTemplate: JQuery;
    data: any;
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
            this.displayInfo();
        }
    }

    displayInfo(): void {

        // show loading icon.
        this.$main.addClass('loading');

        var uri = this.provider.getMoreInfoUri();

        var that = this;

        $.getJSON(uri, function (data) {
            that.data = data;

            that.$main.removeClass('loading');

            that.$main.empty();

            //data.Summary = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec hendrerit rutrum tortor at semper. Proin vel nulla eget risus gravida consectetur at at quam. Ut ac quam purus, eget sodales enim. Nam faucibus adipiscing massa, quis vehicula lacus eleifend non. Curabitur semper hendrerit rutrum. In semper augue a sapien iaculis ac suscipit lorem semper. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc venenatis cursus massa, vel condimentum augue blandit sit amet. Ut vel magna eu dui vulputate facilisis. Aenean urna neque, consequat quis cursus sit amet, lobortis in tellus.";

            $.each(data, function (name, value) {
                if (value && !value.startsWith('http:')) {
                    switch (name.toLowerCase()) {
                        case "bibdoctype":
                            break;
                        case "repositorylogo":
                            break;
                        default:
                            that.$main.append(that.buildItem(name, value, 130));
                            break;
                    }
                }
            });

            // logo
            var logoUri = data["RepositoryLogo"];

            if (logoUri) {
                that.$main.append('<img src="' + logoUri + '" />');
            }

            // full catalogue record.
            var catalogueRecordKey = "View full catalogue record";
            var url = data[catalogueRecordKey];

            if (url) {
                var $catalogueLink = $('<a href="' + url + '" target="_blank" class="action catalogue">' + catalogueRecordKey + '</a>');
                that.$main.append($catalogueLink);
            }

            // conditions.
            var $conditionsLink = $('<a href="#" class="action conditions">' + that.content.conditions + '</a>');
            that.$main.append($conditionsLink);

            $conditionsLink.on('click', (e) => {
                e.preventDefault();
                $.publish(conditions.ConditionsDialogue.SHOW_CONDITIONS_DIALOGUE);
            });
        });
    }

    buildItem(name, value, trimChars): any {
        var $elem = this.moreInfoItemTemplate.clone();
        var $header = $elem.find('.header');
        var $text = $elem.find('.text');

        $header.text(name);
        $text.text(value);

        $text.toggleExpandText(trimChars);

        return $elem;
    }

    resize(): void {
        super.resize();

    }
}
