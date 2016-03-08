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
    manifestData: IMetadataItem[];
    canvasData: IMetadataItem[];
    aggregateValuesConfig: string[];
    canvasExcludeConfig: string[];

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
        
        this.aggregateValuesConfig = this.readConfig(this.options.aggregateValues);
        this.canvasExcludeConfig = this.readConfig(this.options.canvasExclude);
        this.manifestData = this.getManifestData();
        this.canvasData = [];

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

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, canvasIndex) => {
            this.canvasData = this.getCanvasData(this.provider.getCanvasByIndex(canvasIndex));
            this.displayInfo();
        });
    }
    
    getManifestData() {
        var data = this.provider.getMetadata();
        
        if (this.options.displayOrder) {
            data = this.sort(data, this.readConfig(this.options.displayOrder));
        }
        
        if (this.options.manifestExclude) {
            data = this.exclude(data, this.readConfig(this.options.manifestExclude));
        }
        
        return this.flatten(data);
    }
    
    getCanvasData(canvas: Manifesto.ICanvas) {
        var data = this.provider.getCanvasMetadata(canvas);
            
        if (this.canvasExcludeConfig.length !== 0) {
            data = this.exclude(data, this.canvasExcludeConfig);
        }
        
        return this.flatten(data);
    }
    
    readConfig(config: string) {
        if (config) {
            return config
                .toLowerCase()
                .replace(/ /g,"")
                .split(',');
        }
        else {
            return [];
        }
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
       
        this.aggregateValues(manifestRenderData, canvasRenderData);
        this.renderElement(this.$items, manifestRenderData, this.content.manifestHeader, canvasRenderData.length !== 0);
        this.renderElement(this.$canvasItems, canvasRenderData, this.content.canvasHeader, manifestRenderData.length !== 0);
    }
    
    sort(data: IMetadataItem[], displayOrder: string[]) {
         // sort items
        var sorted: IMetadataItem[] = [];

        _.each(displayOrder, (item: string) => {
            var match: IMetadataItem = data.en().where((x => x.label.toLowerCase() === item)).first();
            if (match){
                sorted.push(match);
                data.remove(match);
            }
        });

        // add remaining items that were not in the displayOrder.
        _.each(data, (item: IMetadataItem) => {
            sorted.push(item);
        });

        return sorted;
    }
    
    exclude(data: IMetadataItem[], excludeConfig: string[]) {
        var excluded: IMetadataItem[] = $.extend(true, [], data);
        
        _.each(excludeConfig, (item: string) => {
            var match: IMetadataItem = excluded.en().where((x => x.label.toLowerCase() === item)).first();
            if (match){
                excluded.remove(match);
            }
        });
        
        return excluded;
    }
    
    flatten(data: IMetadataItem[]) {
        // flatten metadata into array.
        var flattened: IMetadataItem[] = [];

        _.each(data, item => {
            if (_.isArray(item.value)){
                flattened = flattened.concat(<IMetadataItem[]>item.value);
            } else {
                flattened.push(item);
            }
        });

        return flattened;
    }

    aggregateValues(fromData: any[], toData: any[]) {
        if (this.aggregateValuesConfig.length !== 0) {
            _.each(toData, item => {
                _.each(this.aggregateValuesConfig, value => {
                    if (item.label.toLowerCase() == value) {
                        var manifestIndex = _.findIndex(fromData, x => x.label.toLowerCase() == value.toLowerCase());

                        if (manifestIndex != -1) {
                            var data = fromData.splice(manifestIndex, 1)[0];
                            item.value = data.value + item.value;
                        }
                    }
                });
            });
        }
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