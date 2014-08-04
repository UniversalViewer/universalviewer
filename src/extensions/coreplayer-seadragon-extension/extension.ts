/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../../modules/coreplayer-shared-module/baseExtension");
import utils = require("../../utils");
import baseProvider = require("../../modules/coreplayer-shared-module/baseProvider");
import provider = require("./provider");
import shell = require("../../modules/coreplayer-shared-module/shell");
import header = require("../../modules/coreplayer-pagingheaderpanel-module/pagingHeaderPanel");
import left = require("../../modules/coreplayer-treeviewleftpanel-module/treeViewLeftPanel");
import thumbsView = require("../../modules/coreplayer-treeviewleftpanel-module/thumbsView");
import treeView = require("../../modules/coreplayer-treeviewleftpanel-module/treeView");
import center = require("../../modules/coreplayer-seadragoncenterpanel-module/seadragonCenterPanel");
import right = require("../../modules/coreplayer-moreinforightpanel-module/moreInfoRightPanel");
import footer = require("../../modules/coreplayer-shared-module/footerPanel");
import help = require("../../modules/coreplayer-dialogues-module/helpDialogue");
import embed = require("../../extensions/coreplayer-seadragon-extension/embedDialogue");
import IProvider = require("../../modules/coreplayer-shared-module/iProvider");
import ISeadragonProvider = require("./iSeadragonProvider");
import dependencies = require("./dependencies");

export class Extension extends baseExtension.BaseExtension {

    headerPanel: header.PagingHeaderPanel;
    leftPanel: left.TreeViewLeftPanel;
    centerPanel: center.SeadragonCenterPanel;
    rightPanel: right.MoreInfoRightPanel;
    footerPanel: footer.FooterPanel;
    $helpDialogue: JQuery;
    helpDialogue: help.HelpDialogue;
    $embedDialogue: JQuery;
    embedDialogue: embed.EmbedDialogue;

    static mode: string;

    // events
    static MODE_CHANGED: string = 'onModeChanged';

    // modes
    static PAGE_MODE: string = "pageMode";
    static IMAGE_MODE: string = "imageMode";

    constructor(provider: IProvider) {
        super(provider);
    }

    create(overrideDependencies?: any): void {
        super.create();

        var that = this;

        // events.
        $.subscribe(header.PagingHeaderPanel.FIRST, (e) => {
            this.viewPage(0);
        });

        $.subscribe(header.PagingHeaderPanel.LAST, (e) => {
            this.viewPage(this.provider.getTotalCanvases() - 1);
        });

        $.subscribe(header.PagingHeaderPanel.PREV, (e) => {
            if (this.provider.canvasIndex != 0) {
                this.viewPage(Number(this.provider.canvasIndex) - 1);
            }
        });

        $.subscribe(header.PagingHeaderPanel.NEXT, (e) => {
            if (this.provider.canvasIndex != this.provider.getTotalCanvases() - 1) {
                this.viewPage(Number(this.provider.canvasIndex) + 1);
            }
        });

        $.subscribe(header.PagingHeaderPanel.MODE_CHANGED, (e, mode: string) => {
            Extension.mode = mode;

            $.publish(Extension.MODE_CHANGED, [mode]);
        });

        $.subscribe(header.PagingHeaderPanel.PAGE_SEARCH, (e, value: string) => {
            this.viewLabel(value);
        });

        $.subscribe(header.PagingHeaderPanel.IMAGE_SEARCH, (e, index: number) => {
            this.viewPage(index);
        });

        $.subscribe(treeView.TreeView.NODE_SELECTED, (e, data: any) => {
            this.treeNodeSelected(data);
        });

        $.subscribe(thumbsView.ThumbsView.THUMB_SELECTED, (e, index: number) => {
            this.viewPage(index);
        });

        $.subscribe(center.SeadragonCenterPanel.SEADRAGON_ANIMATION_FINISH, (e, viewer) => {
            this.setParam(baseProvider.params.zoom, this.centerPanel.serialiseBounds(this.centerPanel.currentBounds));
        });

        $.subscribe(center.SeadragonCenterPanel.PREV, (e) => {
            if (this.provider.canvasIndex != 0) {
                this.viewPage(Number(this.provider.canvasIndex) - 1);
            }
        });

        $.subscribe(center.SeadragonCenterPanel.NEXT, (e) => {
            if (this.provider.canvasIndex != this.provider.getTotalCanvases() - 1) {
                this.viewPage(Number(this.provider.canvasIndex) + 1);
            }
        });

        $.subscribe(footer.FooterPanel.EMBED, (e) => {
            $.publish(embed.EmbedDialogue.SHOW_EMBED_DIALOGUE);
        });

        // dependencies
        var deps = overrideDependencies || dependencies;
        require(_.values(deps), function () {
            //var deps = _.object(_.keys(dependencies), arguments);

            that.createModules();

            that.setParams();

            var canvasIndex;

            if (!that.provider.isReload){
                canvasIndex = parseInt(that.getParam(baseProvider.params.canvasIndex)) || 0;
            }

            that.viewPage(canvasIndex || 0);

            // initial sizing
            $.publish(baseExtension.BaseExtension.RESIZE);

            // publish created event
            $.publish(Extension.CREATED);
        });


    }

    createModules(): void{
        this.headerPanel = new header.PagingHeaderPanel(shell.Shell.$headerPanel);

        if (this.isLeftPanelEnabled()){
            this.leftPanel = new left.TreeViewLeftPanel(shell.Shell.$leftPanel);
        }

        this.centerPanel = new center.SeadragonCenterPanel(shell.Shell.$centerPanel);

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

        if (this.isRightPanelEnabled()){
            this.rightPanel.init();
        }
    }

    setParams(): void{
        if (!this.provider.isHomeDomain) return;

        // set sequenceIndex hash param.
        this.setParam(baseProvider.params.sequenceIndex, this.provider.sequenceIndex);
    }

    isLeftPanelEnabled(): boolean{
        return  utils.Utils.getBool(this.provider.config.options.leftPanelEnabled, true)
                && this.provider.isMultiCanvas();
    }

    isRightPanelEnabled(): boolean{
        return  utils.Utils.getBool(this.provider.config.options.rightPanelEnabled, true);
    }

    viewPage(canvasIndex: number): void {
        this.viewCanvas(canvasIndex, () => {

            var canvas = this.provider.getCanvasByIndex(canvasIndex);

            var uri = (<ISeadragonProvider>this.provider).getImageUri(canvas);

            $.publish(Extension.OPEN_MEDIA, [uri]);

            this.setParam(baseProvider.params.canvasIndex, canvasIndex);
        });
    }

    getMode(): string {
        if (Extension.mode) return Extension.mode;

        switch (this.provider.getManifestType()) {
            case 'monograph':
                return Extension.PAGE_MODE;
                break;
            case 'archive',
                 'boundmanuscript':
                return Extension.IMAGE_MODE;
                break;
            default:
                return Extension.IMAGE_MODE;
        }
    }

    getViewerBounds(): string{

        if (!this.centerPanel) return;

        var bounds = this.centerPanel.getBounds();

        if (bounds) return this.centerPanel.serialiseBounds(bounds);

        return "";
    }

    viewStructure(path: string): void {

        var index = this.provider.getStructureIndex(path);

        this.viewPage(index);
    }

    viewLabel(label: string): void {

        if (!label) {
            this.showDialogue(this.provider.config.modules.genericDialogue.content.emptyValue);
            return;
        }

        var index = this.provider.getCanvasIndexByOrderLabel(label);

        if (index != -1) {
            this.viewPage(index);
        } else {
            this.showDialogue(this.provider.config.modules.genericDialogue.content.pageNotFound);
        }
    }

    treeNodeSelected(data: any): void{
        if (!data.type) return;

        if (data.type == 'manifest') {
            this.viewManifest(data);
        } else {
            this.viewStructure(data.path);
        }
    }
}
