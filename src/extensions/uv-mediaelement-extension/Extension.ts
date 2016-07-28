import BaseCommands = require("../../modules/uv-shared-module/BaseCommands");
import BaseExtension = require("../../modules/uv-shared-module/BaseExtension");
import Bookmark = require("../../modules/uv-shared-module/Bookmark");
import BootStrapper = require("../../Bootstrapper");
import Commands = require("./Commands");
import DownloadDialogue = require("./DownloadDialogue");
import ShareDialogue = require("./ShareDialogue");
import ExternalResource = Manifesto.IExternalResource;
import FooterPanel = require("../../modules/uv-shared-module/FooterPanel");
import HeaderPanel = require("../../modules/uv-shared-module/HeaderPanel");
import HelpDialogue = require("../../modules/uv-dialogues-module/HelpDialogue");
import IMediaElementExtension = require("./IMediaElementExtension");
import LeftPanel = require("../../modules/uv-shared-module/LeftPanel");
import MediaElementCenterPanel = require("../../modules/uv-mediaelementcenterpanel-module/MediaElementCenterPanel");
import MoreInfoRightPanel = require("../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel");
import Params = require("../../Params");
import ResourcesLeftPanel = require("../../modules/uv-resourcesleftpanel-module/ResourcesLeftPanel");
import RightPanel = require("../../modules/uv-shared-module/RightPanel");
import SettingsDialogue = require("./SettingsDialogue");
import Shell = require("../../modules/uv-shared-module/Shell");
import TreeView = require("../../modules/uv-contentleftpanel-module/TreeView");

class Extension extends BaseExtension implements IMediaElementExtension {

    $downloadDialogue: JQuery;
    $shareDialogue: JQuery;
    $helpDialogue: JQuery;
    $settingsDialogue: JQuery;
    centerPanel: MediaElementCenterPanel;
    downloadDialogue: DownloadDialogue;
    shareDialogue: ShareDialogue;
    footerPanel: FooterPanel;
    headerPanel: HeaderPanel;
    helpDialogue: HelpDialogue;
    leftPanel: ResourcesLeftPanel;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;

    constructor(bootstrapper: BootStrapper) {
        super(bootstrapper);
    }

    create(overrideDependencies?: any): void {
        super.create(overrideDependencies);

        // listen for mediaelement enter/exit fullscreen events.
        $(window).bind('enterfullscreen', () => {
            $.publish(BaseCommands.TOGGLE_FULLSCREEN);
        });

        $(window).bind('exitfullscreen', () => {
            $.publish(BaseCommands.TOGGLE_FULLSCREEN);
        });

        $.subscribe(BaseCommands.THUMB_SELECTED, (e, canvasIndex: number) => {
            this.viewCanvas(canvasIndex);
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

        $.subscribe(Commands.MEDIA_ENDED, (e) => {
            this.triggerSocket(Commands.MEDIA_ENDED);
        });

        $.subscribe(Commands.MEDIA_PAUSED, (e) => {
            this.triggerSocket(Commands.MEDIA_PAUSED);
        });

        $.subscribe(Commands.MEDIA_PLAYED, (e) => {
            this.triggerSocket(Commands.MEDIA_PLAYED);
        });
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

        this.centerPanel = new MediaElementCenterPanel(Shell.$centerPanel);

        if (this.isRightPanelEnabled()){
            this.rightPanel = new MoreInfoRightPanel(Shell.$rightPanel);
        }

        if (this.isFooterPanelEnabled()){
            this.footerPanel = new FooterPanel(Shell.$footerPanel);
        } else {
            Shell.$footerPanel.hide();
        }

        this.$helpDialogue = $('<div class="overlay help"></div>');
        Shell.$overlays.append(this.$helpDialogue);
        this.helpDialogue = new HelpDialogue(this.$helpDialogue);

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

    isLeftPanelEnabled(): boolean {
        return Utils.Bools.getBool(this.config.options.leftPanelEnabled, true)
                && ((this.helper.isMultiCanvas() || this.helper.isMultiSequence()) || this.helper.hasResources());
    }

    bookmark(): void {
        super.bookmark();

        var canvas: Manifesto.ICanvas = this.extensions.helper.getCurrentCanvas();
        var bookmark: Bookmark = new Bookmark();

        bookmark.index = this.helper.canvasIndex;
        bookmark.label = canvas.getLabel();
        bookmark.path = this.getBookmarkUri();
        bookmark.thumb = canvas.getProperty('thumbnail');
        bookmark.title = this.helper.getLabel();
        bookmark.trackingLabel = window.trackingLabel;

        if (this.isVideo()){
            bookmark.type = manifesto.ElementType.movingimage().toString();
        } else {
            bookmark.type = manifesto.ElementType.sound().toString();
        }

        this.triggerSocket(BaseCommands.BOOKMARK, bookmark);
    }

    getEmbedScript(template: string, width: number, height: number): string{
        var configUri = this.config.uri || '';
        var script = String.format(template, this.getSerializedLocales(), configUri, this.helper.iiifResourceUri, this.helper.collectionIndex, this.helper.manifestIndex, this.helper.sequenceIndex, this.helper.canvasIndex, width, height, this.embedScriptUri);
        return script;
    }

    // todo: use canvas.getThumbnail()
    getPosterImageUri(): string{
        return this.helper.getCurrentCanvas().getProperty('thumbnail');
    }

    isVideo(): boolean {
        var elementType: Manifesto.ElementType = this.helper.getElementType();
        return elementType.toString() === manifesto.ElementType.movingimage().toString();
    }
}

export = Extension;
