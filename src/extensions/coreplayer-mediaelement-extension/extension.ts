/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../../modules/coreplayer-shared-module/baseExtension");
import utils = require("../../utils");
import baseProvider = require("../../modules/coreplayer-shared-module/baseProvider");
import provider = require("./provider");
import shell = require("../../modules/coreplayer-shared-module/shell");
import header = require("../../modules/coreplayer-shared-module/headerPanel");
import left = require("../../modules/coreplayer-treeviewleftpanel-module/treeViewLeftPanel");
import treeView = require("../../modules/coreplayer-treeviewleftpanel-module/treeView");
import center = require("../../modules/coreplayer-mediaelementcenterpanel-module/mediaelementCenterPanel");
import right = require("../../modules/coreplayer-moreinforightpanel-module/moreInfoRightPanel");
import footer = require("../../modules/coreplayer-shared-module/footerPanel");
import help = require("../../modules/coreplayer-dialogues-module/helpDialogue");
import embed = require("./embedDialogue");
import IProvider = require("../../modules/coreplayer-shared-module/iProvider");
import dependencies = require("./dependencies");

export class Extension extends baseExtension.BaseExtension{

    headerPanel: header.HeaderPanel;
    leftPanel: left.TreeViewLeftPanel;
    centerPanel: center.MediaElementCenterPanel;
    rightPanel: right.MoreInfoRightPanel;
    footerPanel: footer.FooterPanel;
    $helpDialogue: JQuery;
    helpDialogue: help.HelpDialogue;
    $embedDialogue: JQuery;
    embedDialogue: embed.EmbedDialogue;

    // events
    static OPEN_MEDIA: string = 'onMediaOpened';
    static MEDIA_PLAYED: string = 'onMediaPlayed';
    static MEDIA_PAUSED: string = 'onMediaPaused';
    static MEDIA_ENDED: string = 'onMediaEnded';

    constructor(provider: IProvider) {
        super(provider);
    }

    create(): void {
        super.create();

        var that = this;

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

        $.subscribe(footer.FooterPanel.EMBED, (e) => {
            $.publish(embed.EmbedDialogue.SHOW_EMBED_DIALOGUE);
        });

        // dependencies
        require(_.values(dependencies), function () {
            //var deps = _.object(_.keys(dependencies), arguments);

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

            this.provider.setMediaUri(canvas);

            $.publish(Extension.OPEN_MEDIA, [canvas]);

            this.setParam(baseProvider.params.canvasIndex, 0);
        });
    }
}
