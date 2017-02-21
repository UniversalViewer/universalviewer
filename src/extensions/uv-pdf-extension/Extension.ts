import {BaseCommands} from "../../modules/uv-shared-module/BaseCommands";
import {BaseExtension} from "../../modules/uv-shared-module/BaseExtension";
import {Bookmark} from "../../modules/uv-shared-module/Bookmark";
import {Bootstrapper} from "../../Bootstrapper";
import {Commands} from "./Commands";
import {DownloadDialogue} from "./DownloadDialogue";
import {ShareDialogue} from "./ShareDialogue";
import {FooterPanel} from "../../modules/uv-shared-module/FooterPanel";
import {HeaderPanel} from "../../modules/uv-shared-module/HeaderPanel";
import {IPDFExtension} from "./IPDFExtension";
import IThumb = Manifold.IThumb;
import {LeftPanel} from "../../modules/uv-shared-module/LeftPanel";
import {MoreInfoRightPanel} from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import {PDFCenterPanel} from "../../modules/uv-pdfcenterpanel-module/PDFCenterPanel";
import {Params} from "../../Params";
import {ResourcesLeftPanel} from "../../modules/uv-resourcesleftpanel-module/ResourcesLeftPanel";
import {RightPanel} from "../../modules/uv-shared-module/RightPanel";
import {SettingsDialogue} from "./SettingsDialogue";
import {Shell} from "../../modules/uv-shared-module/Shell";

export class Extension extends BaseExtension implements IPDFExtension {

    $downloadDialogue: JQuery;
    $shareDialogue: JQuery;
    $helpDialogue: JQuery;
    $settingsDialogue: JQuery;
    centerPanel: PDFCenterPanel;
    downloadDialogue: DownloadDialogue;
    shareDialogue: ShareDialogue;
    footerPanel: FooterPanel;
    headerPanel: HeaderPanel;
    leftPanel: ResourcesLeftPanel;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;

    constructor(bootstrapper: Bootstrapper) {
        super(bootstrapper);
    }

    create(): void {
        super.create();

        $.subscribe(BaseCommands.THUMB_SELECTED, (e, thumb: IThumb) => {
            this.viewCanvas(thumb.index);
        });

        $.subscribe(BaseCommands.LEFTPANEL_EXPAND_FULL_START, (e) => {
            Shell.$centerPanel.hide();
            Shell.$rightPanel.hide();
        });

        $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH, (e) => {
            Shell.$centerPanel.show();
            Shell.$rightPanel.show();
            this.resize();
        });

        $.subscribe(BaseCommands.SHOW_OVERLAY, (e, params) => {
            if (this.IsOldIE()) {
                this.centerPanel.$element.hide();
            }
        });

        $.subscribe(BaseCommands.HIDE_OVERLAY, (e, params) => {
            if (this.IsOldIE()) {
                this.centerPanel.$element.show();
            }
        });
    }

    IsOldIE(): boolean {
        var browser = window.browserDetect.browser;
        var version = window.browserDetect.version;

        if (browser === 'Explorer' && version <= 9) return true;
        return false;
    }

    createModules(): void{
        super.createModules();

        if (this.isHeaderPanelEnabled()){
            this.headerPanel = new HeaderPanel(Shell.$headerPanel);
        } else {
            Shell.$headerPanel.hide();
        }

        if (this.isLeftPanelEnabled()){
            this.leftPanel = new ResourcesLeftPanel(Shell.$leftPanel);
        }

        this.centerPanel = new PDFCenterPanel(Shell.$centerPanel);

        if (this.isRightPanelEnabled()){
            this.rightPanel = new MoreInfoRightPanel(Shell.$rightPanel);
        }

        if (this.isFooterPanelEnabled()){
            this.footerPanel = new FooterPanel(Shell.$footerPanel);
        } else {
            Shell.$footerPanel.hide();
        }

        this.$downloadDialogue = $('<div class="overlay download"></div>');
        Shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

        this.$shareDialogue = $('<div class="overlay share"></div>');
        Shell.$overlays.append(this.$shareDialogue);
        this.shareDialogue = new ShareDialogue(this.$shareDialogue);

        this.$settingsDialogue = $('<div class="overlay settings"></div>');
        Shell.$overlays.append(this.$settingsDialogue);
        this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);

        if (this.isLeftPanelEnabled()){
            this.leftPanel.init();
        }

        if (this.isRightPanelEnabled()){
            this.rightPanel.init();
        }
    }

    bookmark() : void {
        super.bookmark();

        var canvas: Manifesto.ICanvas = this.helper.getCurrentCanvas();
        var bookmark: Bookmark = new Bookmark();

        bookmark.index = this.helper.canvasIndex;
        bookmark.label = Manifesto.TranslationCollection.getValue(canvas.getLabel());
        bookmark.path = this.getBookmarkUri();
        bookmark.thumb = canvas.getProperty('thumbnail');
        bookmark.title = this.helper.getLabel();
        bookmark.trackingLabel = window.trackingLabel;
        bookmark.type = manifesto.ElementType.document().toString();

        this.triggerSocket(BaseCommands.BOOKMARK, bookmark);
    }

    getEmbedScript(template: string, width: number, height: number): string{
        var configUri = this.config.uri || '';
        var script = String.format(template, this.getSerializedLocales(), configUri, this.helper.iiifResourceUri, this.helper.collectionIndex, this.helper.manifestIndex, this.helper.sequenceIndex, this.helper.canvasIndex, width, height, this.embedScriptUri);
        return script;
    }
}