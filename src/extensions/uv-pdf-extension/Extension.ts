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

        this.component.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, (canvasIndex: number) => {
            this.viewCanvas(canvasIndex);
        });

        this.component.subscribe(BaseEvents.THUMB_SELECTED, (thumb: IThumb) => {
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, thumb.index);
        });

        this.component.subscribe(BaseEvents.LEFTPANEL_EXPAND_FULL_START, () => {
            this.shell.$centerPanel.hide();
            this.shell.$rightPanel.hide();
        });

        this.component.subscribe(BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH, () => {
            this.shell.$centerPanel.show();
            this.shell.$rightPanel.show();
            this.resize();
        });

        this.component.subscribe(BaseEvents.SHOW_OVERLAY, () => {
            if (this.IsOldIE()) {
                this.centerPanel.$element.hide();
            }
        });

        this.component.subscribe(BaseEvents.HIDE_OVERLAY, () => {
            if (this.IsOldIE()) {
                this.centerPanel.$element.show();
            }
        });

        this.component.subscribe(BaseEvents.EXIT_FULLSCREEN, () => {
            setTimeout(() => {
                this.resize();
            }, 10); // allow time to exit full screen, then resize
        });
    }

    render(): void {
        super.render();
    }

    IsOldIE(): boolean {
        const browser: string = window.browserDetect.browser;
        const version: number = window.browserDetect.version;

        if (browser === 'Explorer' && version <= 9) return true;
        return false;
    }

    isHeaderPanelEnabled(): boolean {
        return super.isHeaderPanelEnabled() && Utils.Bools.getBool(this.data.config.options.usePdfJs, true);
    }

    createModules(): void{
        super.createModules();

        if (this.isHeaderPanelEnabled()) {
            this.headerPanel = new PDFHeaderPanel(this.shell.$headerPanel);
        } else {
            this.shell.$headerPanel.hide();
        }

        if (this.isLeftPanelEnabled()) {
            this.leftPanel = new ResourcesLeftPanel(this.shell.$leftPanel);
        }

        this.centerPanel = new PDFCenterPanel(this.shell.$centerPanel);

        if (this.isRightPanelEnabled()) {
            this.rightPanel = new MoreInfoRightPanel(this.shell.$rightPanel);
        }

        if (this.isFooterPanelEnabled()) {
            this.footerPanel = new FooterPanel(this.shell.$footerPanel);
        } else {
            this.shell.$footerPanel.hide();
        }

        this.$downloadDialogue = $('<div class="overlay download" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

        this.$shareDialogue = $('<div class="overlay share" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$shareDialogue);
        this.shareDialogue = new ShareDialogue(this.$shareDialogue);

        this.$settingsDialogue = $('<div class="overlay settings" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$settingsDialogue);
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
        bookmark.label = <string>Manifesto.LanguageMap.getValue(canvas.getLabel());
        bookmark.thumb = canvas.getProperty('thumbnail');
        bookmark.title = this.helper.getLabel();
        bookmark.trackingLabel = window.trackingLabel;
        bookmark.type = manifesto.ResourceType.document().toString();

        this.fire(BaseEvents.BOOKMARK, bookmark);
    }

    dependencyLoaded(index: number, dep: any): void {
        if (index === 0) {
            window.PDFObject = dep;
        }
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
