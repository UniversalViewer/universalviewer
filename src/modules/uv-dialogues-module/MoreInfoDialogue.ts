import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {Dialogue} from "../uv-shared-module/Dialogue";
import {UVUtils} from "../../Utils";

export class MoreInfoDialogue extends Dialogue {

    $title: JQuery;
    metadataComponent: any;
    $metadata: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('moreInfoDialogue');

        super.create();

        this.openCommand = BaseEvents.SHOW_MOREINFO_DIALOGUE;
        this.closeCommand = BaseEvents.HIDE_MOREINFO_DIALOGUE;

        this.component.subscribe(this.openCommand, (triggerButton: HTMLElement) => {
            this.open(triggerButton);
        });

        this.component.subscribe(this.closeCommand, () => {
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
            target:  <HTMLElement>this.$metadata[0]
        });

        // hide
        this.$element.hide();
    }

    open(triggerButton?: HTMLElement): void {
        super.open(triggerButton);
        this.metadataComponent.set(this._getData());
    }

    private _getData() {
        return {
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
            limitType: IIIFComponents.LimitType.LINES,
            manifestDisplayOrder: this.config.options.manifestDisplayOrder,
            manifestExclude: this.config.options.manifestExclude,
            range: this.extension.getCurrentCanvasRange(),
            rtlLanguageCodes: this.config.options.rtlLanguageCodes,
            sanitizer: (html: string) => {
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