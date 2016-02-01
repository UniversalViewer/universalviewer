import BaseCommands = require("../../modules/uv-shared-module/BaseCommands");
import BaseExtension = require("../../modules/uv-shared-module/BaseExtension");
import BaseProvider = require("../../modules/uv-shared-module/BaseProvider");
import Bookmark = require("../../modules/uv-shared-module/Bookmark");
import BootStrapper = require("../../Bootstrapper");
import Commands = require("./Commands");
import DownloadDialogue = require("./DownloadDialogue");
import EmbedDialogue = require("./EmbedDialogue");
import ExternalResource = require("../../modules/uv-shared-module/ExternalResource");
import FooterPanel = require("../../modules/uv-shared-module/FooterPanel");
import HeaderPanel = require("../../modules/uv-shared-module/HeaderPanel");
import HelpDialogue = require("../../modules/uv-dialogues-module/HelpDialogue");
import IProvider = require("../../modules/uv-shared-module/IProvider");
import LeftPanel = require("../../modules/uv-shared-module/LeftPanel");
import MoreInfoRightPanel = require("../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel");
import Params = require("../../Params");
import Provider = require("./Provider");
import RightPanel = require("../../modules/uv-shared-module/RightPanel");
import SettingsDialogue = require("./SettingsDialogue");
import Shell = require("../../modules/uv-shared-module/Shell");
import TreeView = require("../../modules/uv-contentleftpanel-module/TreeView");
import ContentLeftPanel = require("../../modules/uv-contentleftpanel-module/ContentLeftPanel");
import VirtexCenterPanel = require("../../modules/uv-virtexcenterpanel-module/VirtexCenterPanel");

class Extension extends BaseExtension{

    $downloadDialogue: JQuery;
    $embedDialogue: JQuery;
    $helpDialogue: JQuery;
    $settingsDialogue: JQuery;
    centerPanel: VirtexCenterPanel;
    downloadDialogue: DownloadDialogue;
    embedDialogue: EmbedDialogue;
    footerPanel: FooterPanel;
    headerPanel: HeaderPanel;
    helpDialogue: HelpDialogue;
    leftPanel: ContentLeftPanel;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;

    constructor(bootstrapper: BootStrapper) {
        super(bootstrapper);
    }

    create(overrideDependencies?: any): void {
        super.create(overrideDependencies);

        $.subscribe(BaseCommands.THUMB_SELECTED, (e, canvasIndex: number) => {
            this.viewCanvas(canvasIndex);
        });
        //
        //$.subscribe(BaseCommands.LEFTPANEL_EXPAND_FULL_START, (e) => {
        //    Shell.$centerPanel.hide();
        //    Shell.$rightPanel.hide();
        //});
        //
        //$.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH, (e) => {
        //    Shell.$centerPanel.show();
        //    Shell.$rightPanel.show();
        //    this.resize();
        //});
    }

    createModules(): void{
        super.createModules();

        this.headerPanel = new HeaderPanel(Shell.$headerPanel);

        if (this.isLeftPanelEnabled()){
            this.leftPanel = new ContentLeftPanel(Shell.$leftPanel);
        }

        this.centerPanel = new VirtexCenterPanel(Shell.$centerPanel);

        if (this.isRightPanelEnabled()){
            this.rightPanel = new MoreInfoRightPanel(Shell.$rightPanel);
        }

        this.footerPanel = new FooterPanel(Shell.$footerPanel);

        this.$downloadDialogue = $('<div class="overlay download"></div>');
        Shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

        this.$embedDialogue = $('<div class="overlay embed"></div>');
        Shell.$overlays.append(this.$embedDialogue);
        this.embedDialogue = new EmbedDialogue(this.$embedDialogue);

        this.$settingsDialogue = $('<div class="overlay settings"></div>');
        Shell.$overlays.append(this.$settingsDialogue);
        this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);

        if (this.isLeftPanelEnabled()){
            this.leftPanel.init();
        } else {
            Shell.$leftPanel.hide();
        }

        if (this.isRightPanelEnabled()){
            this.rightPanel.init();
        } else {
            Shell.$rightPanel.hide();
        }
    }

    isLeftPanelEnabled(): boolean{
        return Utils.Bools.GetBool(this.provider.config.options.leftPanelEnabled, true)
                && (this.provider.isMultiCanvas() || this.provider.isMultiSequence());
    }

    bookmark(): void {
        super.bookmark();

        var canvas: Manifesto.ICanvas = this.provider.getCurrentCanvas();
        var bookmark: Bookmark = new Bookmark();

        bookmark.index = this.provider.canvasIndex;
        bookmark.label = canvas.getLabel();
        bookmark.path = this.getBookmarkUri();
        bookmark.thumb = canvas.getProperty('thumbnail');
        bookmark.title = this.provider.getTitle();
        bookmark.type = manifesto.ElementType.physicalobject().toString();

        this.triggerSocket(BaseCommands.BOOKMARK, bookmark);
    }
}

export = Extension;
