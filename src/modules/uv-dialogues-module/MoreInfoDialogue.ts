import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {Dialogue} from "../uv-shared-module/Dialogue";
import {UVUtils} from "../uv-shared-module/Utils";

export class MoreInfoDialogue extends Dialogue {

    $title: JQuery;
    metadataComponent: IIIFComponents.IMetadataComponent;
    $metadata: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('moreInfoDialogue');

        super.create();

        this.openCommand = BaseEvents.SHOW_MOREINFO_DIALOGUE;
        this.closeCommand = BaseEvents.HIDE_MOREINFO_DIALOGUE;

        $.subscribe(this.openCommand, (e: any, $triggerButton: JQuery) => {
            this.open($triggerButton);
        });

        $.subscribe(this.closeCommand, () => {
            this.close();
        });

        this.config.content = this.extension.data.config.modules.moreInfoRightPanel.content;
        this.config.options = this.extension.data.config.modules.moreInfoRightPanel.options;

        // create ui
        this.$title = $('<h1>' + this.config.content.title + '</h1>');
        this.$content.append(this.$title);

        this.$metadata = $('<div class="iiif-metadata-component"></div>');
        this.$content.append(this.$metadata);

        this.metadataComponent = new IIIFComponents.MetadataComponent({
            target: this.$metadata[0],
            data: this._getData()
        });

        // hide
        this.$element.hide();
    }

    open($triggerButton?: JQuery): void {
        super.open($triggerButton);
        this.metadataComponent.set(new Object()); // todo: should be passing data
    }

    private _getData(): IIIFComponents.IMetadataComponentData {
        return <IIIFComponents.IMetadataComponentData>{
            canvasDisplayOrder: this.config.options.canvasDisplayOrder,
            canvases: this.extension.getCurrentCanvases(),
            canvasExclude: this.config.options.canvasExclude,
            canvasLabels: this.extension.getCanvasLabels(this.content.page),
            content: this.config.content,
            copiedMessageDuration: 2000,
            copyToClipboardEnabled: Utils.Bools.getBool(this.config.options.copyToClipboardEnabled, false),
            helper: this.extension.helper,
            licenseFormatter: null,
            limit: this.config.options.textLimit || 4,
            limitType: IIIFComponents.MetadataComponentOptions.LimitType.LINES,
            manifestDisplayOrder: this.config.options.manifestDisplayOrder,
            manifestExclude: this.config.options.manifestExclude,
            range: this.extension.getCurrentCanvasRange(),
            rtlLanguageCodes: this.config.options.rtlLanguageCodes,
            sanitizer: (html) => {
                return UVUtils.sanitize(html);
            },
            showAllLanguages: this.config.options.showAllLanguages
        };
    }

    close(): void {
        super.close();
    }

    resize(): void {
        this.setDockedPosition();
    }
}