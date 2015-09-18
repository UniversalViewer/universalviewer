import RightPanel = require("../uv-shared-module/RightPanel");

class MoreInfoRightPanel extends RightPanel {

    $items: JQuery;
    $noData: JQuery;
    moreInfoItemTemplate: JQuery;

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

        var data = this.provider.getMetadata();
        this.displayInfo(data);
    }

    displayInfo(data: any): void {
        this.$main.removeClass('loading');

        if (!data){
            this.$noData.show();
            return;
        }

        this.$noData.hide();

        var limitType = "lines";
        if (this.config.options.textLimitType) {
            limitType = this.config.options.textLimitType;
        }
        var limit;
        if (limitType === "lines") {
            limit = this.config.options.textLimit ? this.config.options.textLimit : 4;
        } else if (limitType === "chars") {
            limit = this.config.options.textLimit ? this.config.options.textLimit : 130;
        }

        _.each(data, (item: any) => {
            var built = this.buildItem(item);
            this.$items.append(built);
            if (limitType === "lines") {
                built.find('.text').toggleExpandTextByLines(limit, this.content.less, this.content.more);
            } else if (limitType === "chars") {
                built.find('.text').ellipsisHtmlFixed(limit, null);
            }
        });
    }

    buildItem(item: any): any {
        var $elem = this.moreInfoItemTemplate.clone();
        var $header = $elem.find('.header');
        var $text = $elem.find('.text');

        item.label = this.provider.sanitize(item.label);
        item.value = this.provider.sanitize(item.value);

        switch(item.label.toLowerCase()){
            case "attribution":
                item.label = this.content.attribution;
                break;
            case "description":
                item.label = this.content.description;
                break;
            case "license":
                item.label = this.content.license;
                break;
        }

        // replace \n with <br>
        item.value = item.value.replace('\n', '<br>');

        $header.html(item.label);
        $text.html(item.value);
        $text.targetBlank();

        item.label = item.label.trim();
        item.label = item.label.toLowerCase();

        $elem.addClass(item.label.toCssClass());

        return $elem;
    }

    resize(): void {
        super.resize();

        this.$main.height(this.$element.height() - this.$top.height() - this.$main.verticalMargins());
    }
}

export = MoreInfoRightPanel;