import BaseCommands = require("../uv-shared-module/BaseCommands");
import RightPanel = require("../uv-shared-module/RightPanel");

class MoreInfoRightPanel extends RightPanel {

    component: IIIFComponents.IMetadataComponent;
    $metadata: JQuery;
    limitType: IIIFComponents.MetadataComponentOptions.LimitType;
    limit: number;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('moreInfoRightPanel');

        super.create();
        
        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, canvasIndex) => {
            this.databind();
        });

        this.setTitle(this.config.content.title);

        this.$metadata = $('<div class="iiif-metadata-component"></div>');
        this.$main.append(this.$metadata);

        this.component = new IIIFComponents.MetadataComponent(this._getOptions());
    }

    toggleFinish(): void {
        super.toggleFinish();

        if (this.isUnopened) {
            this.databind();
        }
    }

    databind(): void {
        this.component.options = this._getOptions();
        this.component.databind();
    }

    private _getOptions(): IIIFComponents.IMetadataComponentOptions {
        return <IIIFComponents.IMetadataComponentOptions>{
            aggregateValues: this.config.options.aggregateValues,
            canvasExclude: this.config.options.canvasExclude,
            content: this.config.content,
            copyToClipboardEnabled: Utils.Bools.getBool(this.config.options.copyToClipboardEnabled, false),
            displayOrder: this.config.options.displayOrder,
            element: ".rightPanel .iiif-metadata-component",
            helper: this.extension.helper,
            limit: this.config.options.textLimit || 4,
            limitType: IIIFComponents.MetadataComponentOptions.LimitType.LINES,
            manifestExclude: this.config.options.manifestExclude,
            sanitizer: function(html) { return html }
        };
    }

    resize(): void {
        super.resize();

        this.$main.height(this.$element.height() - this.$top.height() - this.$main.verticalMargins());
    }
}

export = MoreInfoRightPanel;