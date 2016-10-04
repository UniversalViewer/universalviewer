import BaseCommands = require("../uv-shared-module/BaseCommands");
import RightPanel = require("../uv-shared-module/RightPanel");

class MoreInfoRightPanel extends RightPanel {

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
        
        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, canvasIndex) => {
            this.canvasData = this.getCanvasData(this.extension.helper.getCanvasByIndex(canvasIndex));
            this.displayInfo();
        });

        this.setTitle(this.content.title);
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
    
    

    resize(): void {
        super.resize();

        this.$main.height(this.$element.height() - this.$top.height() - this.$main.verticalMargins());
    }
}

export = MoreInfoRightPanel;