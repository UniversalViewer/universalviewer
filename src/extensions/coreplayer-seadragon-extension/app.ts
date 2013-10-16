/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseApp = require("../../modules/coreplayer-shared-module/baseApp");
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
import footer = require("../../modules/coreplayer-extendedfooterpanel-module/extendedFooterPanel");
import help = require("../../modules/coreplayer-dialogues-module/helpDialogue");
import embed = require("../../extensions/coreplayer-seadragon-extension/embedDialogue");

export class App extends baseApp.BaseApp {

    headerPanel: header.PagingHeaderPanel;
    leftPanel: left.TreeViewLeftPanel;
    centerPanel: center.SeadragonCenterPanel;
    rightPanel: right.MoreInfoRightPanel;
    footerPanel: footer.ExtendedFooterPanel;
    $helpDialogue: JQuery;
    helpDialogue: help.HelpDialogue;
    $embedDialogue: JQuery;
    embedDialogue: embed.EmbedDialogue;

    static mode: string;

    // events
    static MODE_CHANGED: string = 'onModeChanged';
    static OPEN_DZI: string = 'openDzi';

    // modes
    static PAGE_MODE: string = "pageMode";
    static IMAGE_MODE: string = "imageMode";

    constructor(provider: provider.Provider) {
        super(provider, 'seadragon');
    }

    create(): void {
        super.create();

        // events.
        $.subscribe(header.PagingHeaderPanel.FIRST, (e) => {
            this.viewPage(0);
        });

        $.subscribe(header.PagingHeaderPanel.LAST, (e) => {
            this.viewPage(this.provider.assetSequence.assets.length - 1);
        });

        $.subscribe(header.PagingHeaderPanel.PREV, (e) => {
            if (this.currentAssetIndex != 0) {
                this.viewPage(Number(this.currentAssetIndex) - 1);
            }
        });
        
        $.subscribe(header.PagingHeaderPanel.NEXT, (e) => {
            if (this.currentAssetIndex != this.provider.assetSequence.assets.length - 1) {
                this.viewPage(Number(this.currentAssetIndex) + 1);
            }
        });

        $.subscribe(header.PagingHeaderPanel.MODE_CHANGED, (e, mode: string) => {
            App.mode = mode;

            $.publish(App.MODE_CHANGED, [mode]);
        });

        $.subscribe(header.PagingHeaderPanel.PAGE_SEARCH, (e, value: string) => {
            this.viewLabel(value);
        });
        
        $.subscribe(header.PagingHeaderPanel.IMAGE_SEARCH, (e, index: number) => {
            this.viewPage(index);
        });

        $.subscribe(treeView.TreeView.VIEW_STRUCTURE, (e, structure: any) => {
            this.viewAssetSequence(structure.assetSequence.index);
        });

        $.subscribe(treeView.TreeView.VIEW_SECTION, (e, section: any) => {
            this.viewSection(section.path);
        });

        $.subscribe(thumbsView.ThumbsView.THUMB_SELECTED, (e, index: number) => {
            this.viewPage(index);
        });

        $.subscribe(center.SeadragonCenterPanel.SEADRAGON_ANIMATION_FINISH, (e, viewer) => {
            this.setParam(baseProvider.params.zoom, this.centerPanel.serialiseBounds(this.centerPanel.currentBounds));
        });

        $.subscribe(center.SeadragonCenterPanel.PREV, (e) => {
            if (this.currentAssetIndex != 0) {
                this.viewPage(Number(this.currentAssetIndex) - 1);
            }
        });
        
        $.subscribe(center.SeadragonCenterPanel.NEXT, (e) => {
            if (this.currentAssetIndex != this.provider.assetSequence.assets.length - 1) {
                this.viewPage(Number(this.currentAssetIndex) + 1);
            }
        });

        $.subscribe(footer.ExtendedFooterPanel.EMBED, (e) => {
            $.publish(embed.EmbedDialogue.SHOW_EMBED_DIALOGUE);
        });

        this.createModules();        

        this.setParams();

        var assetIndex;

        if (!this.provider.isReload){
            assetIndex = parseInt(this.getParam(baseProvider.params.assetIndex)) || 0;
        }

        this.viewPage(assetIndex || 0);

        // initial sizing
        $.publish(baseApp.BaseApp.RESIZE);        
    }

    createModules(): void{
        this.headerPanel = new header.PagingHeaderPanel(shell.Shell.$headerPanel);

        if (this.isLeftPanelEnabled()){
            this.leftPanel = new left.TreeViewLeftPanel(shell.Shell.$leftPanel);
        }

        this.centerPanel = new center.SeadragonCenterPanel(shell.Shell.$centerPanel);
        this.rightPanel = new right.MoreInfoRightPanel(shell.Shell.$rightPanel);
        this.footerPanel = new footer.ExtendedFooterPanel(shell.Shell.$footerPanel);

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
        // set assetSequenceIndex hash param.
        this.setParam(baseProvider.params.assetSequenceIndex, this.provider.assetSequenceIndex);
    }

    isLeftPanelEnabled(): boolean{
        return  utils.Utils.getBool(this.provider.options.leftPanelEnabled, true) 
                && this.provider.assetSequence.assets.length > 1;
    }

    viewPage(assetIndex: number): void {
        this.viewAsset(assetIndex, () => {

            var asset = this.provider.assetSequence.assets[assetIndex];

            var dziUri = (<provider.Provider>this.provider).getDziUri(asset);

            $.publish(App.OPEN_DZI, [dziUri]);

            this.setParam(baseProvider.params.assetIndex, assetIndex);
        });
    }

    viewSection(path: string): void {

        var index = this.getSectionIndex(path);

        this.viewPage(index);
    }

    viewLabel(label: string): void {

        if (!label) {
            this.showDialogue(this.provider.config.modules.genericDialogue.content.emptyValue);
            return;
        }
        
        var index = this.getAssetIndexByOrderLabel(label);

        if (index != -1) {
            this.viewPage(index);
        } else {
            this.showDialogue(this.provider.config.modules.genericDialogue.content.pageNotFound);
        }
    }

    getMode(): string {
        if (App.mode) return App.mode;

        switch (this.provider.type) {
            case 'monograph':
                return App.PAGE_MODE;
                break;
            case 'archive':
            case 'boundmanuscript':
                return App.IMAGE_MODE;
                break;
            default:
                return App.IMAGE_MODE;
        }
    }

    getViewerBounds(): string{
        
        if (!this.centerPanel) return;

        var bounds = this.centerPanel.getBounds();

        if (bounds) return this.centerPanel.serialiseBounds(bounds);

        return "";
    }
}
