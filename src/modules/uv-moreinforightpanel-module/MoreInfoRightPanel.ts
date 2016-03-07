import BaseCommands = require("../uv-shared-module/BaseCommands");
import IMetadataItem = require("../uv-shared-module/IMetadataItem");
import RightPanel = require("../uv-shared-module/RightPanel");

class MoreInfoRightPanel extends RightPanel {

    limitType = "lines";
    limit = 4;
    $items: JQuery;
    $canvasItems: JQuery;
    $noData: JQuery;
    moreInfoItemTemplate: JQuery;
    manifestData: any[];
    canvasData: any[];

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('moreInfoRightPanel');

        super.create();

        if (this.config.options.textLimitType) {
            this.limitType = this.config.options.textLimitType;
        }
        if (this.limitType === "lines") {
            this.limit = this.config.options.textLimit ? this.config.options.textLimit : 4;
        } else if (this.limitType === "chars") {
            this.limit = this.config.options.textLimit ? this.config.options.textLimit : 130;
        }

        this.moreInfoItemTemplate = $('<div class="item">\
                                           <div class="header"></div>\
                                           <div class="text"></div>\
                                       </div>');

        this.$items = $('<div class="items"></div>');
        this.$main.append(this.$items);

        this.$canvasItems = $('<div class="items"></div>');
        this.$main.append(this.$canvasItems);

        this.$noData = $('<div class="noData">' + this.content.noData + '</div>');
        this.$main.append(this.$noData);

        this.$expandButton.attr('tabindex', '4');
        this.$collapseButton.attr('tabindex', '4');

        this.setTitle(this.content.title);

        this.manifestData = this.provider.getMetadata();
        this.canvasData = [];

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, canvasIndex) => {
            var canvas: Manifesto.ICanvas = this.provider.getCanvasByIndex(canvasIndex);

            this.canvasData = canvas.getMetadata();
            this.displayInfo();
        });
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
        this.displayInfo();
    }

    displayInfo(): void {
        this.$main.removeClass('loading');

        if (this.manifestData.length == 0 && this.canvasData.length == 0){
            this.$noData.show();
            return;
        }

        this.$noData.hide();

        var manifestRenderData = $.extend(true, [], this.manifestData);
        var canvasRenderData = $.extend(true, [], this.canvasData);
        
        var displayOrderConfig: string = this.options.displayOrder;

        if (displayOrderConfig){

            displayOrderConfig = displayOrderConfig.toLowerCase();
            displayOrderConfig = displayOrderConfig.replace(/ /g,"");
            var displayOrder: string[] = displayOrderConfig.split(',');

            // sort items
            var sorted = [];

            _.each(displayOrder, (item: string) => {
                var match: IMetadataItem = manifestRenderData.en().where((x => x.label.toLowerCase() === item)).first();
                if (match){
                    sorted.push(match);
                    manifestRenderData.remove(match);
                }
            });

            // add remaining items that were not in the displayOrder.
            _.each(manifestRenderData, (item: IMetadataItem) => {
                sorted.push(item);
            });

            manifestRenderData = sorted;
        }

        // Exclusions

        var excludeConfig: string = this.options.exclude;

        if (excludeConfig) {
            excludeConfig = excludeConfig.toLowerCase();
            excludeConfig = excludeConfig.replace(/ /g,"");
            var exclude: string[] = excludeConfig.split(',');

            _.each(exclude, (item: string) => {
                var match: IMetadataItem = manifestRenderData.en().where((x => x.label.toLowerCase() === item)).first();
                if (match){
                    manifestRenderData.remove(match);
                }
            });
        }

        // flatten metadata into array.
        var flattened: IMetadataItem[] = [];

        _.each(manifestRenderData, (item: IMetadataItem) => {
            if (_.isArray(item.value)){
                flattened = flattened.concat(<IMetadataItem[]>item.value);
            } else {
                flattened.push(item);
            }
        });

        manifestRenderData = flattened;
        
        if (this.config.options.aggregateValues) {
            this.aggregateValues(manifestRenderData, canvasRenderData);
        }
        
        this.renderElement(this.$items, manifestRenderData, this.content.manifestHeader, canvasRenderData.length !== 0);
        this.renderElement(this.$canvasItems, canvasRenderData, this.content.canvasHeader, true);
    }

    aggregateValues(fromData: any[], toData: any[]) {
        var values: string[] = this.config.options.aggregateValues.split(",");

        _.each(toData, item => {
            _.each(values, value => {
                value = value.trim();

                if (item.label.toLowerCase() == value.toLowerCase()) {
                    var manifestIndex = _.findIndex(fromData, x => x.label.toLowerCase() == value.toLowerCase());

                    if (manifestIndex != -1) {
                        var data = fromData.splice(manifestIndex, 1)[0];
                        item.value = data.value + item.value;
                    }
                }
            });
        });
    }

    renderElement(element: JQuery, data: any, header: string, renderHeader: boolean) {
        element.empty();

        if (data.length !== 0) {
            if (renderHeader && header)
                element.append(this.buildHeader(header));

            _.each(data, (item: any) => {
                var built = this.buildItem(item);
                element.append(built);
                if (this.limitType === "lines") {
                    built.find('.text').toggleExpandTextByLines(this.limit, this.content.less, this.content.more);
                } else if (this.limitType === "chars") {
                    built.find('.text').ellipsisHtmlFixed(this.limit, null);
                }
            });
        }
    }

    buildHeader(label: string): JQuery {
        var $header = $('<div class="header"></div>');
        $header.html(this.provider.sanitize(label));

        return $header;
    }

    buildItem(item: IMetadataItem): any {
        var $elem = this.moreInfoItemTemplate.clone();
        var $header = $elem.find('.header');
        var $text = $elem.find('.text');

        item.label = this.provider.sanitize(item.label);
        item.value = this.provider.sanitize(<string>item.value);

        if (item.isRootLevel) {
            switch (item.label.toLowerCase()) {
                case "attribution":
                    item.label = this.content.attribution;
                    break;
                case "description":
                    item.label = this.content.description;
                    break;
                case "license":
                    item.label = this.content.license;
                    break;
                case "logo":
                    item.label = this.content.logo;
                    break;
            }
        }

        // replace \n with <br>
        item.value = (<string>item.value).replace('\n', '<br>');

        $header.html(item.label);
        $text.html(<string>item.value);
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