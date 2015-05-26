/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import BootStrapper = require("../../bootstrapper");
import baseExtension = require("../../modules/uv-shared-module/baseExtension");
import utils = require("../../utils");
import baseProvider = require("../../modules/uv-shared-module/baseProvider");
import provider = require("./provider");
import shell = require("../../modules/uv-shared-module/shell");
import header = require("../../modules/uv-shared-module/headerPanel");
import baseLeft = require("../../modules/uv-shared-module/leftPanel");
import left = require("../../modules/uv-treeviewleftpanel-module/treeViewLeftPanel");
import treeView = require("../../modules/uv-treeviewleftpanel-module/treeView");
import center = require("../../modules/uv-mediaelementcenterpanel-module/mediaelementCenterPanel");
import baseRight = require("../../modules/uv-shared-module/rightPanel");
import right = require("../../modules/uv-moreinforightpanel-module/moreInfoRightPanel");
import footer = require("../../modules/uv-shared-module/footerPanel");
import help = require("../../modules/uv-dialogues-module/helpDialogue");
import download = require("./downloadDialogue");
import embed = require("./embedDialogue");
import IProvider = require("../../modules/uv-shared-module/iProvider");

export class Extension extends baseExtension.BaseExtension{

    headerPanel: header.HeaderPanel;
    leftPanel: left.TreeViewLeftPanel;
    centerPanel: center.MediaElementCenterPanel;
    rightPanel: right.MoreInfoRightPanel;
    footerPanel: footer.FooterPanel;
    $helpDialogue: JQuery;
    helpDialogue: help.HelpDialogue;
    $downloadDialogue: JQuery;
    downloadDialogue: download.DownloadDialogue;
    $embedDialogue: JQuery;
    embedDialogue: embed.EmbedDialogue;

    // events
    static OPEN_MEDIA: string = 'onMediaOpened';
    static MEDIA_PLAYED: string = 'onMediaPlayed';
    static MEDIA_PAUSED: string = 'onMediaPaused';
    static MEDIA_ENDED: string = 'onMediaEnded';

    constructor(bootstrapper: BootStrapper) {
        super(bootstrapper);
    }

    create(overrideDependencies?: any): void {
        super.create();

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
        require(["../../extensions/uv-mediaelement-extension/dependencies"], function (deps) {
            callback(deps);
        });
    }

    loadDependencies(deps: any): void {
        var that = this;

        require(_.values(deps), function () {

            that.createModules();

            that.setParams();

            // initial sizing
            $.publish(baseExtension.BaseExtension.RESIZE);

            that.viewMedia();

            // publish created event
            $.publish(Extension.CREATED);
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

    setParams(): void{
        if (!this.provider.isHomeDomain) return;

        // set sequenceIndex hash param.
        this.setParam(baseProvider.params.sequenceIndex, this.provider.sequenceIndex);
    }

    isLeftPanelEnabled(): boolean{
        return  utils.Utils.getBool(this.provider.config.options.leftPanelEnabled, true)
                && this.provider.isMultiSequence();
    }

    viewMedia(): void {
        var canvas = this.provider.getCanvasByIndex(0);

        this.viewCanvas(0, () => {

            $.publish(Extension.OPEN_MEDIA, [canvas]);

            this.setParam(baseProvider.params.canvasIndex, 0);
        });
    }
}
