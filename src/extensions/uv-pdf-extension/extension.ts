import BaseCommands = require("../../modules/uv-shared-module/Commands");
import BaseExtension = require("../../modules/uv-shared-module/BaseExtension");
import BaseProvider = require("../../modules/uv-shared-module/BaseProvider");
import BootStrapper = require("../../Bootstrapper");
import Commands = require("./Commands");
import EmbedDialogue = require("./EmbedDialogue");
import FooterPanel = require("../../modules/uv-shared-module/FooterPanel");
import HeaderPanel = require("../../modules/uv-shared-module/HeaderPanel");
import IPDFProvider = require("./IPDFProvider");
import IProvider = require("../../modules/uv-shared-module/IProvider");
import LeftPanel = require("../../modules/uv-shared-module/LeftPanel");
import MoreInfoRightPanel = require("../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel");
import PDFCenterPanel = require("../../modules/uv-pdfcenterpanel-module/PDFCenterPanel");
import Provider = require("./Provider");
import RightPanel = require("../../modules/uv-shared-module/RightPanel");
import Shell = require("../../modules/uv-shared-module/Shell");
import ThumbsView = require("../../modules/uv-treeviewleftpanel-module/ThumbsView");
import TreeViewLeftPanel = require("../../modules/uv-treeviewleftpanel-module/TreeViewLeftPanel");
import Utils = require("../../Utils");

class Extension extends BaseExtension{

    $embedDialogue: JQuery;
    $helpDialogue: JQuery;
    centerPanel: PDFCenterPanel;
    embedDialogue: EmbedDialogue;
    footerPanel: FooterPanel;
    headerPanel: HeaderPanel;
    leftPanel: TreeViewLeftPanel;
    rightPanel: MoreInfoRightPanel;

    constructor(bootstrapper: BootStrapper) {
        super(bootstrapper);
    }

    create(overrideDependencies?: any): void {
        super.create();

        var that = this;

        $.subscribe(Commands.THUMB_SELECTED, (e, index: number) => {
            window.open((<IPDFProvider>that.provider).getPDFUri());
        });

        $.subscribe(BaseCommands.EMBED, (e) => {
            $.publish(BaseCommands.SHOW_EMBED_DIALOGUE);
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

        $.subscribe(BaseCommands.OPEN_LEFT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(BaseCommands.CLOSE_LEFT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(BaseCommands.OPEN_RIGHT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(BaseCommands.CLOSE_RIGHT_PANEL, (e) => {
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
        this.headerPanel = new HeaderPanel(Shell.$headerPanel);

        if (this.isLeftPanelEnabled()){
            this.leftPanel = new TreeViewLeftPanel(Shell.$leftPanel);
        }

        this.centerPanel = new PDFCenterPanel(Shell.$centerPanel);

        if (this.isRightPanelEnabled()){
            this.rightPanel = new MoreInfoRightPanel(Shell.$rightPanel);
        }

        this.footerPanel = new FooterPanel(Shell.$footerPanel);

        this.$embedDialogue = $('<div class="overlay embed"></div>');
        Shell.$overlays.append(this.$embedDialogue);
        this.embedDialogue = new EmbedDialogue(this.$embedDialogue);

        if (this.isLeftPanelEnabled()){
            this.leftPanel.init();
        }
    }
}

export = Extension;
