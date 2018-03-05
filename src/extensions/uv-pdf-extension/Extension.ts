import {BaseEvents} from "../../modules/uv-shared-module/BaseEvents";
import {BaseExtension} from "../../modules/uv-shared-module/BaseExtension";
import {Bookmark} from "../../modules/uv-shared-module/Bookmark";
import {DownloadDialogue} from "./DownloadDialogue";
import {FooterPanel} from "../../modules/uv-shared-module/FooterPanel";
import {IPDFExtension} from "./IPDFExtension";
import {MoreInfoRightPanel} from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import {PDFCenterPanel} from "../../modules/uv-pdfcenterpanel-module/PDFCenterPanel";
import {PDFHeaderPanel} from "../../modules/uv-pdfheaderpanel-module/PDFHeaderPanel";
import {ResourcesLeftPanel} from "../../modules/uv-resourcesleftpanel-module/ResourcesLeftPanel";
import {SettingsDialogue} from "./SettingsDialogue";
import {ShareDialogue} from "./ShareDialogue";
import {Shell} from "../../modules/uv-shared-module/Shell";
import IThumb = Manifold.IThumb;

export class Extension extends BaseExtension implements IPDFExtension {

    $downloadDialogue: JQuery;
    $shareDialogue: JQuery;
    $helpDialogue: JQuery;
    $settingsDialogue: JQuery;
    centerPanel: PDFCenterPanel;
    downloadDialogue: DownloadDialogue;
    shareDialogue: ShareDialogue;
    footerPanel: FooterPanel;
    headerPanel: PDFHeaderPanel;
    leftPanel: ResourcesLeftPanel;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;

    create(): void {

        requirejs.config({paths: {'pdfjs-dist/build/pdf.combined': this.data.root + '/lib/' + 'pdf.combined'}});

        super.create();

        $.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, (e: any, canvasIndex: number) => {
            this.viewCanvas(canvasIndex);
        });

        $.subscribe(BaseEvents.THUMB_SELECTED, (e: any, thumb: IThumb) => {
            $.publish(BaseEvents.CANVAS_INDEX_CHANGED, [thumb.index]);
        });

        $.subscribe(BaseEvents.LEFTPANEL_EXPAND_FULL_START, () => {
            Shell.$centerPanel.hide();
            Shell.$rightPanel.hide();
        });

        $.subscribe(BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH, () => {
            Shell.$centerPanel.show();
            Shell.$rightPanel.show();
            this.resize();
        });

        $.subscribe(BaseEvents.SHOW_OVERLAY, () => {
            if (this.IsOldIE()) {
                this.centerPanel.$element.hide();
            }
        });

        $.subscribe(BaseEvents.HIDE_OVERLAY, () => {
            if (this.IsOldIE()) {
                this.centerPanel.$element.show();
            }
        });

        $.subscribe(BaseEvents.EXIT_FULLSCREEN, () => {
            setTimeout(() => {
                this.resize();
            }, 10); // allow time to exit full screen, then resize
        });
    }

    update(): void {
        super.update();
    }

    IsOldIE(): boolean {
        const browser: string = window.browserDetect.browser;
        const version: number = window.browserDetect.version;

        if (browser === 'Explorer' && version <= 9) return true;
        return false;
    }

    createModules(): void{
        super.createModules();

        if (this.isHeaderPanelEnabled()) {
            this.headerPanel = new PDFHeaderPanel(Shell.$headerPanel);
        } else {
            Shell.$headerPanel.hide();
        }

        if (this.isLeftPanelEnabled()) {
            this.leftPanel = new ResourcesLeftPanel(Shell.$leftPanel);
        }

        this.centerPanel = new PDFCenterPanel(Shell.$centerPanel);

        if (this.isRightPanelEnabled()) {
            this.rightPanel = new MoreInfoRightPanel(Shell.$rightPanel);
        }

        if (this.isFooterPanelEnabled()) {
            this.footerPanel = new FooterPanel(Shell.$footerPanel);
        } else {
            Shell.$footerPanel.hide();
        }

        this.$downloadDialogue = $('<div class="overlay download" aria-hidden="true"></div>');
        Shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

        this.$shareDialogue = $('<div class="overlay share" aria-hidden="true"></div>');
        Shell.$overlays.append(this.$shareDialogue);
        this.shareDialogue = new ShareDialogue(this.$shareDialogue);

        this.$settingsDialogue = $('<div class="overlay settings" aria-hidden="true"></div>');
        Shell.$overlays.append(this.$settingsDialogue);
        this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);

        if (this.isLeftPanelEnabled()) {
            this.leftPanel.init();
        }

        if (this.isRightPanelEnabled()) {
            this.rightPanel.init();
        }
    }

    bookmark() : void {
        super.bookmark();

        const canvas: Manifesto.ICanvas = this.helper.getCurrentCanvas();
        const bookmark: Bookmark = new Bookmark();

        bookmark.index = this.helper.canvasIndex;
        bookmark.label = <string>Manifesto.TranslationCollection.getValue(canvas.getLabel());
        bookmark.thumb = canvas.getProperty('thumbnail');
        bookmark.title = this.helper.getLabel();
        bookmark.trackingLabel = window.trackingLabel;
        bookmark.type = manifesto.ResourceType.document().toString();

        this.fire(BaseEvents.BOOKMARK, bookmark);
    }

    dependencyLoaded(index: number, dep: any): void {

    }

    getEmbedScript(template: string, width: number, height: number): string{
        //const configUri = this.data.config.uri || '';
        //const script = String.format(template, this.getSerializedLocales(), configUri, this.helper.iiifResourceUri, this.helper.collectionIndex, this.helper.manifestIndex, this.helper.sequenceIndex, this.helper.canvasIndex, width, height, this.data.embedScriptUri);
        const appUri: string = this.getAppUri();
        const iframeSrc: string = `${appUri}#?manifest=${this.helper.iiifResourceUri}&c=${this.helper.collectionIndex}&m=${this.helper.manifestIndex}&s=${this.helper.sequenceIndex}&cv=${this.helper.canvasIndex}`;
        const script: string = Utils.Strings.format(template, iframeSrc, width.toString(), height.toString());
        return script;
    }
}
