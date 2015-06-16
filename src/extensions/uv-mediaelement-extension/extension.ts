import baseExtension = require("../../modules/uv-shared-module/baseExtension");
import baseLeft = require("../../modules/uv-shared-module/leftPanel");
import baseProvider = require("../../modules/uv-shared-module/baseProvider");
import baseRight = require("../../modules/uv-shared-module/rightPanel");
import BootStrapper = require("../../bootstrapper");
import center = require("../../modules/uv-mediaelementcenterpanel-module/mediaelementCenterPanel");
import download = require("./downloadDialogue");
import embed = require("./embedDialogue");
import footer = require("../../modules/uv-shared-module/footerPanel");
import header = require("../../modules/uv-shared-module/headerPanel");
import help = require("../../modules/uv-dialogues-module/helpDialogue");
import IProvider = require("../../modules/uv-shared-module/iProvider");
import left = require("../../modules/uv-treeviewleftpanel-module/treeViewLeftPanel");
import provider = require("./provider");
import right = require("../../modules/uv-moreinforightpanel-module/moreInfoRightPanel");
import shell = require("../../modules/uv-shared-module/shell");
import treeView = require("../../modules/uv-treeviewleftpanel-module/treeView");
import utils = require("../../utils");

export class Extension extends baseExtension.BaseExtension{

    $downloadDialogue: JQuery;
    $embedDialogue: JQuery;
    $helpDialogue: JQuery;
    centerPanel: center.MediaElementCenterPanel;
    downloadDialogue: download.DownloadDialogue;
    embedDialogue: embed.EmbedDialogue;
    footerPanel: footer.FooterPanel;
    headerPanel: header.HeaderPanel;
    helpDialogue: help.HelpDialogue;
    leftPanel: left.TreeViewLeftPanel;
    rightPanel: right.MoreInfoRightPanel;

    static MEDIA_ENDED: string = 'onMediaEnded';
    static MEDIA_PAUSED: string = 'onMediaPaused';
    static MEDIA_PLAYED: string = 'onMediaPlayed';

    constructor(bootstrapper: BootStrapper) {
        super(bootstrapper);
    }

    create(overrideDependencies?: any): void {
        super.create(overrideDependencies);

        // listen for mediaelement enter/exit fullscreen events.
        $(window).bind('enterfullscreen', () => {
            $.publish(baseExtension.BaseExtension.TOGGLE_FULLSCREEN);
        });

        $(window).bind('exitfullscreen', () => {
            $.publish(baseExtension.BaseExtension.TOGGLE_FULLSCREEN);
        });

        $.subscribe(treeView.TreeView.NODE_SELECTED, (e, data: any) => {
            this.viewManifest(data);
        });

        $.subscribe(footer.FooterPanel.DOWNLOAD, (e) => {
            $.publish(download.DownloadDialogue.SHOW_DOWNLOAD_DIALOGUE);
        });

        $.subscribe(footer.FooterPanel.EMBED, (e) => {
            $.publish(embed.EmbedDialogue.SHOW_EMBED_DIALOGUE);
        });

        $.subscribe(baseLeft.LeftPanel.OPEN_LEFT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(baseLeft.LeftPanel.CLOSE_LEFT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(baseRight.RightPanel.OPEN_RIGHT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(baseRight.RightPanel.CLOSE_RIGHT_PANEL, (e) => {
            this.resize();
        });
    }

    createModules(): void{
        this.headerPanel = new header.HeaderPanel(shell.Shell.$headerPanel);

        if (this.isLeftPanelEnabled()){
            this.leftPanel = new left.TreeViewLeftPanel(shell.Shell.$leftPanel);
        }

        this.centerPanel = new center.MediaElementCenterPanel(shell.Shell.$centerPanel);
        this.rightPanel = new right.MoreInfoRightPanel(shell.Shell.$rightPanel);
        this.footerPanel = new footer.FooterPanel(shell.Shell.$footerPanel);

        this.$helpDialogue = $('<div class="overlay help"></div>');
        shell.Shell.$overlays.append(this.$helpDialogue);
        this.helpDialogue = new help.HelpDialogue(this.$helpDialogue);

        this.$downloadDialogue = $('<div class="overlay download"></div>');
        shell.Shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new download.DownloadDialogue(this.$downloadDialogue);

        this.$embedDialogue = $('<div class="overlay embed"></div>');
        shell.Shell.$overlays.append(this.$embedDialogue);
        this.embedDialogue = new embed.EmbedDialogue(this.$embedDialogue);

        if (this.isLeftPanelEnabled()){
            this.leftPanel.init();
        }
    }

    isLeftPanelEnabled(): boolean{
        return  utils.Utils.getBool(this.provider.config.options.leftPanelEnabled, true)
                && this.provider.isMultiSequence();
    }
}
