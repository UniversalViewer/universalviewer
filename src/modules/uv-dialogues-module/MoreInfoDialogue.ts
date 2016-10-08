import BaseCommands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");

class MoreInfoDialogue extends Dialogue {

    $title: JQuery;
    component: IIIFComponents.IMetadataComponent;
    $metadata: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('moreInfoDialogue');

        super.create();

        this.openCommand = BaseCommands.SHOW_MOREINFO_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_MOREINFO_DIALOGUE;

        $.subscribe(this.openCommand, (e, $triggerButton) => {
            this.open($triggerButton);
        });

        $.subscribe(this.closeCommand, (e) => {
            this.close();
        });

        this.config.content = this.extension.config.modules.moreInfoRightPanel.content;
        this.config.options = this.extension.config.modules.moreInfoRightPanel.options;

        // create ui
        this.$title = $('<h1>' + this.config.content.title + '</h1>');
        this.$content.append(this.$title);

        this.$metadata = $('<div class="iiif-metadata-component"></div>');
        this.$content.append(this.$metadata);

        this.component = new IIIFComponents.MetadataComponent(this._getOptions());

        // hide
        this.$element.hide();
    }

    open($triggerButton?: JQuery): void {
        super.open($triggerButton);
        this.component.databind();
    }

    private _getOptions(): IIIFComponents.IMetadataComponentOptions {
        return <IIIFComponents.IMetadataComponentOptions>{
            aggregateValues: this.config.options.aggregateValues,
            canvasExclude: this.config.options.canvasExclude,
            content: this.config.content,
            copyToClipboardEnabled: this.config.options.copyToClipboardEnabled,
            displayOrder: this.config.options.displayOrder,
            element: ".overlay.moreInfo .iiif-metadata-component",
            helper: this.extension.helper,
            limit: this.config.options.textLimit,
            limitType: IIIFComponents.MetadataComponentOptions.LimitType.LINES,
            manifestExclude: this.config.options.manifestExclude,
            sanitizer: function(html) { return html }
        };
    }

    close(): void {
        super.close();
    }

    resize(): void {
        this.setDockedPosition();
    }
}

export = MoreInfoDialogue;