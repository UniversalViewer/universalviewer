/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import BootStrapper = require("../../bootstrapper");
import baseExtension = require("../../modules/uv-shared-module/baseExtension");
import utils = require("../../utils");
import baseProvider = require("../../modules/uv-shared-module/baseProvider");
import provider = require("./provider");
import IProvider = require("../../modules/uv-shared-module/iProvider");
import IPDFProvider = require("./iPDFProvider");
import shell = require("../../modules/uv-shared-module/shell");
import header = require("../../modules/uv-shared-module/headerPanel");
import baseLeft = require("../../modules/uv-shared-module/leftPanel");
import left = require("../../modules/uv-treeviewleftpanel-module/treeViewLeftPanel");
import center = require("../../modules/uv-pdfcenterpanel-module/pdfCenterPanel");
import baseRight = require("../../modules/uv-shared-module/rightPanel");
import right = require("../../modules/uv-moreinforightpanel-module/moreInfoRightPanel");
import footer = require("../../modules/uv-shared-module/footerPanel");
import help = require("../../modules/uv-dialogues-module/helpDialogue");
import embed = require("./embedDialogue");
import thumbsView = require("../../modules/uv-treeviewleftpanel-module/thumbsView");

export class Extension extends baseExtension.BaseExtension{

    headerPanel: header.HeaderPanel;
    leftPanel: left.TreeViewLeftPanel;
    centerPanel: center.PDFCenterPanel;
    rightPanel: right.MoreInfoRightPanel;
    footerPanel: footer.FooterPanel;
    $helpDialogue: JQuery;
    helpDialogue: help.HelpDialogue;
    $embedDialogue: JQuery;
    embedDialogue: embed.EmbedDialogue;

    constructor(bootstrapper: BootStrapper) {
        super(bootstrapper);
    }

    create(overrideDependencies?: any): void {
        super.create();

        var that = this;

        // events
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

        // dependencies
        if (overrideDependencies){
            this.loadDependencies(overrideDependencies);
        } else {
            this.getDependencies((deps: any) => {
                this.loadDependencies(deps);
            });
        }
    }

    getDependencies(callback: (deps: any) => void): any {
        require(["../../extensions/uv-pdf-extension/dependencies"], function (deps) {
            callback(deps);
        });
    }

    loadDependencies(deps: any): void {
        var that = this;

        require(_.values(deps), function () {

            that.createModules();

            //this.setParams();

            // initial sizing
            $.publish(baseExtension.BaseExtension.RESIZE);

            that.viewMedia();

            // publish created event
            $.publish(Extension.CREATED);
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

    isLeftPanelEnabled(): boolean{
        return  utils.Utils.getBool(this.provider.config.options.leftPanelEnabled, true);
    }

    isRightPanelEnabled(): boolean{
        return  utils.Utils.getBool(this.provider.config.options.rightPanelEnabled, true);
    }

    viewMedia(): void {
        var canvas = this.provider.getCanvasByIndex(0);

        this.viewCanvas(0, () => {

            this.provider.setMediaUri(canvas);

            $.publish(Extension.OPEN_MEDIA, [canvas]);

            this.setParam(baseProvider.params.canvasIndex, 0);
        });
    }

}
