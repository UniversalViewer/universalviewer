import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {RightPanel} from "../uv-shared-module/RightPanel";
import {UVUtils} from "../../Utils";

export class MoreInfoRightPanel extends RightPanel {

    metadataComponent: IIIFComponents.MetadataComponent;
    $metadata: JQuery;
    limitType: IIIFComponents.LimitType;
    limit: number;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('moreInfoRightPanel');

        super.create();
        
        $.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, () => {
            this.databind();
        });

        $.subscribe(BaseEvents.RANGE_CHANGED, () => {
            this.databind();
        });

        this.setTitle(this.config.content.title);

        this.$metadata = $('<div class="iiif-metadata-component"></div>');
        this.$main.append(this.$metadata);

        this.metadataComponent = new IIIFComponents.MetadataComponent({
            target:  <HTMLElement>this.$metadata[0],
            data: this._getData()
        });

        this.metadataComponent.on('iiifViewerLinkClicked', (href: string) => {
            // get the hash param.
            const rangeId: string | null = Utils.Urls.getHashParameterFromString('rid', href);

            if (rangeId) {
                const range: Manifesto.IRange | null = this.extension.helper.getRangeById(rangeId);

                if (range) {
                    $.publish(BaseEvents.RANGE_CHANGED, [range]);
                }
            }

        }, false);
    }

    toggleFinish(): void {
        super.toggleFinish();
        this.databind();
    }

    databind(): void {
        this.metadataComponent.set(this._getData());
    }

    private _getCurrentRange(): Manifesto.IRange | null {
        const range: Manifesto.IRange | null = this.extension.helper.getCurrentRange();
        return range;
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
            licenseFormatter: new Manifold.UriLabeller(this.config.license ? this.config.license : {}), 
            limit: this.config.options.textLimit || 4,
            limitType: IIIFComponents.LimitType.LINES,
            limitToRange: Utils.Bools.getBool(this.config.options.limitToRange, false),
            manifestDisplayOrder: this.config.options.manifestDisplayOrder,
            manifestExclude: this.config.options.manifestExclude,
            range: this._getCurrentRange(),
            rtlLanguageCodes: this.config.options.rtlLanguageCodes,
            sanitizer: (html) => {
                return UVUtils.sanitize(html);
            },
            showAllLanguages: this.config.options.showAllLanguages
        };
    }

    resize(): void {
        super.resize();

        this.$main.height(this.$element.height() - this.$top.height() - this.$main.verticalMargins());
    }
}