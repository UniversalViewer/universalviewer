/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../../modules/coreplayer-shared-module/baseExtension");
import utils = require("../../utils");
import baseProvider = require("../../modules/coreplayer-shared-module/baseProvider");
import provider = require("./provider");
import IProvider = require("../../modules/coreplayer-shared-module/iProvider");
import IPDFProvider = require("./iPDFProvider");
import shell = require("../../modules/coreplayer-shared-module/shell");
import header = require("../../modules/coreplayer-shared-module/headerPanel");
import left = require("../../modules/coreplayer-treeviewleftpanel-module/treeViewLeftPanel");
import center = require("../../modules/coreplayer-pdfcenterpanel-module/pdfCenterPanel");
import right = require("../../modules/coreplayer-moreinforightpanel-module/moreInfoRightPanel");
import footer = require("../../modules/coreplayer-shared-module/footerPanel");
import help = require("../../modules/coreplayer-dialogues-module/helpDialogue");
import embed = require("./embedDialogue");
import thumbsView = require("../../modules/coreplayer-treeviewleftpanel-module/thumbsView");
import dependencies = require("./dependencies");

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

    constructor(provider: IProvider) {
        super(provider);
    }

    create(): void {
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

        // load dependencies

//        // if in debug mode, map to extension's path
//        if (window.DEBUG){
//            _.values(dependencies)
//        }
//
//        yepnope({
//            load: ,
//            complete: function () {
//                that.createModules();
//
//                //this.setParams();
//
//                // initial sizing
//                $.publish(baseExtension.BaseExtension.RESIZE);
//
//                that.viewMedia();
//
//                // publish created event
//                $.publish(Extension.CREATED);
//            }
//        });

        // dependencies
        require(_.values(dependencies), function () {
            //var deps = _.object(_.keys(dependencies), arguments);

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
        var browser = window.BrowserDetect.browser;
        var version = window.BrowserDetect.version;

        if (browser == 'Explorer' && version < 9) return true;
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
