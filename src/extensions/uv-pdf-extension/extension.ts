import baseExtension = require("../../modules/uv-shared-module/baseExtension");
import baseLeft = require("../../modules/uv-shared-module/leftPanel");
import baseProvider = require("../../modules/uv-shared-module/baseProvider");
import baseRight = require("../../modules/uv-shared-module/rightPanel");
import BootStrapper = require("../../bootstrapper");
import center = require("../../modules/uv-pdfcenterpanel-module/pdfCenterPanel");
import embed = require("./embedDialogue");
import footer = require("../../modules/uv-shared-module/footerPanel");
import header = require("../../modules/uv-shared-module/headerPanel");
import help = require("../../modules/uv-dialogues-module/helpDialogue");
import IPDFProvider = require("./iPDFProvider");
import IProvider = require("../../modules/uv-shared-module/iProvider");
import left = require("../../modules/uv-treeviewleftpanel-module/treeViewLeftPanel");
import provider = require("./provider");
import right = require("../../modules/uv-moreinforightpanel-module/moreInfoRightPanel");
import shell = require("../../modules/uv-shared-module/shell");
import thumbsView = require("../../modules/uv-treeviewleftpanel-module/thumbsView");
import utils = require("../../utils");

export class Extension extends baseExtension.BaseExtension{

    $embedDialogue: JQuery;
    $helpDialogue: JQuery;
    centerPanel: center.PDFCenterPanel;
    embedDialogue: embed.EmbedDialogue;
    footerPanel: footer.FooterPanel;
    headerPanel: header.HeaderPanel;
    helpDialogue: help.HelpDialogue;
    leftPanel: left.TreeViewLeftPanel;
    rightPanel: right.MoreInfoRightPanel;

    constructor(bootstrapper: BootStrapper) {
        super(bootstrapper);
    }

    create(overrideDependencies?: any): void {
        super.create();

        var that = this;

        $.subscribe(thumbsView.ThumbsView.THUMB_SELECTED, (e, index: number) => {
            window.open((<IPDFProvider>that.provider).getPDFUri());
        });

        $.subscribe(footer.FooterPanel.EMBED, (e) => {
            $.publish(embed.EmbedDialogue.SHOW_EMBED_DIALOGUE);
        });

        $.subscribe(shell.Shell.SHOW_OVERLAY, (e, params) => {
            if (this.IsOldIE()) {
                this.centerPanel.$element.hide();
            }
        });

        $.subscribe(shell.Shell.HIDE_OVERLAY, (e, params) => {
            if (this.IsOldIE()) {
                this.centerPanel.$element.show();
            }
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

    IsOldIE(): boolean {
        var browser = window.browserDetect.browser;
        var version = window.browserDetect.version;

        if (browser == 'Explorer' && version <= 9) return true;
        return false;
    }

    createModules(): void{
        this.headerPanel = new header.HeaderPanel(shell.Shell.$headerPanel);

        if (this.isLeftPanelEnabled()){
            this.leftPanel = new left.TreeViewLeftPanel(shell.Shell.$leftPanel);
        }

        this.centerPanel = new center.PDFCenterPanel(shell.Shell.$centerPanel);

        if (this.isRightPanelEnabled()){
            this.rightPanel = new right.MoreInfoRightPanel(shell.Shell.$rightPanel);
        }

        this.footerPanel = new footer.FooterPanel(shell.Shell.$footerPanel);

        this.$helpDialogue = utils.Utils.createDiv('overlay help');
        shell.Shell.$overlays.append(this.$helpDialogue);
        this.helpDialogue = new help.HelpDialogue(this.$helpDialogue);

        this.$embedDialogue = utils.Utils.createDiv('overlay embed');
        shell.Shell.$overlays.append(this.$embedDialogue);
        this.embedDialogue = new embed.EmbedDialogue(this.$embedDialogue);

        if (this.isLeftPanelEnabled()){
            this.leftPanel.init();
        }
    }
}
