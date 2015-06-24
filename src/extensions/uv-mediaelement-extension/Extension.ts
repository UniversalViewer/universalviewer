import BaseExtension = require("../../modules/uv-shared-module/BaseExtension");
import BaseCommands = require("../../modules/uv-shared-module/Commands");
import Commands = require("./Commands");
import LeftPanel = require("../../modules/uv-shared-module/LeftPanel");
import BaseProvider = require("../../modules/uv-shared-module/BaseProvider");
import RightPanel = require("../../modules/uv-shared-module/RightPanel");
import BootStrapper = require("../../Bootstrapper");
import MediaElementCenterPanel = require("../../modules/uv-mediaelementcenterpanel-module/MediaElementCenterPanel");
import DownloadDialogue = require("./DownloadDialogue");
import EmbedDialogue = require("./EmbedDialogue");
import FooterPanel = require("../../modules/uv-shared-module/FooterPanel");
import HeaderPanel = require("../../modules/uv-shared-module/HeaderPanel");
import HelpDialogue = require("../../modules/uv-dialogues-module/HelpDialogue");
import IProvider = require("../../modules/uv-shared-module/IProvider");
import TreeViewLeftPanel = require("../../modules/uv-treeviewleftpanel-module/TreeViewLeftPanel");
import Provider = require("./Provider");
import MoreInfoRightPanel = require("../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel");
import SettingsDialogue = require("./SettingsDialogue");
import Shell = require("../../modules/uv-shared-module/Shell");
import TreeView = require("../../modules/uv-treeviewleftpanel-module/TreeView");

class Extension extends BaseExtension{

    $downloadDialogue: JQuery;
    $embedDialogue: JQuery;
    $helpDialogue: JQuery;
    $settingsDialogue: JQuery;
    centerPanel: MediaElementCenterPanel;
    downloadDialogue: DownloadDialogue;
    embedDialogue: EmbedDialogue;
    footerPanel: FooterPanel;
    headerPanel: HeaderPanel;
    helpDialogue: HelpDialogue;
    leftPanel: TreeViewLeftPanel;
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

        $.subscribe(Commands.TREE_NODE_SELECTED, (e, data: any) => {
            this.viewManifest(data);
        });

        $.subscribe(BaseCommands.DOWNLOAD, (e) => {
            $.publish(BaseCommands.SHOW_DOWNLOAD_DIALOGUE);
        });

        $.subscribe(BaseCommands.EMBED, (e) => {
            $.publish(BaseCommands.SHOW_EMBED_DIALOGUE);
        });
    }

    createModules(): void{
        this.headerPanel = new HeaderPanel(Shell.$headerPanel);

        if (this.isLeftPanelEnabled()){
            this.leftPanel = new TreeViewLeftPanel(Shell.$leftPanel);
        }

        this.centerPanel = new MediaElementCenterPanel(Shell.$centerPanel);

        if (this.isRightPanelEnabled()){
            this.rightPanel = new MoreInfoRightPanel(Shell.$rightPanel);
        }

        this.footerPanel = new FooterPanel(Shell.$footerPanel);

        this.$helpDialogue = $('<div class="overlay help"></div>');
        Shell.$overlays.append(this.$helpDialogue);
        this.helpDialogue = new HelpDialogue(this.$helpDialogue);

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
        }

        if (this.isRightPanelEnabled()){
            this.rightPanel.init();
        }
    }

    isLeftPanelEnabled(): boolean{
        return  Utils.Bools.GetBool(this.provider.config.options.leftPanelEnabled, true)
                && this.provider.isMultiSequence();
    }
}

export = Extension;
