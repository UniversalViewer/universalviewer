/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
/// <reference path="./iSettings.d.ts" />

import baseExtension = require("../../modules/uv-shared-module/baseExtension");
import utils = require("../../utils");
import baseProvider = require("../../modules/uv-shared-module/baseProvider");
import provider = require("./provider");
import shell = require("../../modules/uv-shared-module/shell");
import header = require("../../modules/uv-pagingheaderpanel-module/pagingHeaderPanel");
import baseLeft = require("../../modules/uv-shared-module/leftPanel");
import left = require("../../modules/uv-treeviewleftpanel-module/treeViewLeftPanel");
import thumbsView = require("../../modules/uv-treeviewleftpanel-module/thumbsView");
import galleryView = require("../../modules/uv-treeviewleftpanel-module/galleryView");
import treeView = require("../../modules/uv-treeviewleftpanel-module/treeView");
import baseCenter = require("../../modules/uv-seadragoncenterpanel-module/seadragonCenterPanel");
import center = require("../../modules/uv-seadragoncenterpanel-module/seadragonCenterPanel");
import baseRight = require("../../modules/uv-shared-module/rightPanel");
import right = require("../../modules/uv-moreinforightpanel-module/moreInfoRightPanel");
import footer = require("../../modules/uv-shared-module/footerPanel");
import help = require("../../modules/uv-dialogues-module/helpDialogue");
import embed = require("../../extensions/uv-seadragon-extension/embedDialogue");
import settingsDialogue = require("../../extensions/uv-seadragon-extension/settingsDialogue");
import IProvider = require("../../modules/uv-shared-module/iProvider");
import settings = require("../../modules/uv-shared-module/settings");
import externalContentDialogue = require("../../modules/uv-dialogues-module/externalContentDialogue");
import ISeadragonProvider = require("./iSeadragonProvider");
import dependencies = require("./dependencies");

export class Extension extends baseExtension.BaseExtension {

    headerPanel: header.PagingHeaderPanel;
    leftPanel: left.TreeViewLeftPanel;
    centerPanel: baseCenter.SeadragonCenterPanel;
    rightPanel: right.MoreInfoRightPanel;
    footerPanel: footer.FooterPanel;
    $helpDialogue: JQuery;
    helpDialogue: help.HelpDialogue;
    $embedDialogue: JQuery;
    embedDialogue: embed.EmbedDialogue;
    $settingsDialogue: JQuery;
    settingsDialogue: settingsDialogue.SettingsDialogue;
    $externalContentDialogue: JQuery;
    externalContentDialogue: externalContentDialogue.ExternalContentDialogue;

    currentRotation: number = 0;

    static mode: string;

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
            this.viewPage(this.provider.getFirstPageIndex());
        });

        $.subscribe(Extension.HOME, (e) => {
            this.viewPage(this.provider.getFirstPageIndex());
        });

        $.subscribe(header.PagingHeaderPanel.LAST, (e) => {
            this.viewPage(this.provider.getLastPageIndex());
        });

        $.subscribe(Extension.END, (e) => {
            this.viewPage(this.provider.getLastPageIndex());
        });

        $.subscribe(header.PagingHeaderPanel.PREV, (e) => {
            this.viewPage(this.provider.getPrevPageIndex());
        });

        $.subscribe(Extension.PAGE_UP, (e) => {
            this.viewPage(this.provider.getPrevPageIndex());
        });

        $.subscribe(header.PagingHeaderPanel.NEXT, (e) => {
            this.viewPage(this.provider.getNextPageIndex());
        });

        $.subscribe(Extension.PAGE_DOWN, (e) => {
            this.viewPage(this.provider.getNextPageIndex());
        });

        $.subscribe(header.PagingHeaderPanel.MODE_CHANGED, (e, mode: string) => {
            Extension.mode = mode;
            $.publish(Extension.SETTINGS_CHANGED, [mode]);
        });

        $.subscribe(header.PagingHeaderPanel.PAGE_SEARCH, (e, value: string) => {
            this.viewLabel(value);
        });

        $.subscribe(header.PagingHeaderPanel.IMAGE_SEARCH, (e, index: number) => {
            this.viewPage(index);
        });

        $.subscribe(header.PagingHeaderPanel.UPDATE_SETTINGS, (e) => {
            this.updateSettings();
        });

        $.subscribe(settingsDialogue.SettingsDialogue.UPDATE_SETTINGS, (e) => {
            this.updateSettings();
        });

        $.subscribe(treeView.TreeView.NODE_SELECTED, (e, data: any) => {
            this.treeNodeSelected(data);
        });

        $.subscribe(thumbsView.ThumbsView.THUMB_SELECTED, (e, index: number) => {
            this.viewPage(index);
        });

        $.subscribe(galleryView.GalleryView.THUMB_SELECTED, (e, index: number) => {
            this.viewPage(index);
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

        $.subscribe(left.TreeViewLeftPanel.EXPAND_FULL_START, (e) => {
            shell.Shell.$centerPanel.hide();
            shell.Shell.$rightPanel.hide();
        });

        $.subscribe(left.TreeViewLeftPanel.COLLAPSE_FULL_FINISH, (e) => {
            shell.Shell.$centerPanel.show();
            shell.Shell.$rightPanel.show();
            this.resize();
        });

        $.subscribe(baseCenter.SeadragonCenterPanel.SEADRAGON_ANIMATION_FINISH, (e, viewer) => {
            if (this.centerPanel){
                this.setParam(baseProvider.params.zoom, this.centerPanel.serialiseBounds(this.centerPanel.currentBounds));
            }
        });

        $.subscribe(baseCenter.SeadragonCenterPanel.SEADRAGON_ROTATION, (e, rotation) => {
            this.currentRotation = rotation;
            this.setParam(baseProvider.params.rotation, rotation);
        });

        $.subscribe(baseCenter.SeadragonCenterPanel.PREV, (e) => {
            this.viewPage(this.provider.getPrevPageIndex());
        });

        $.subscribe(baseCenter.SeadragonCenterPanel.NEXT, (e) => {
            this.viewPage(this.provider.getNextPageIndex());
        });

        $.subscribe(footer.FooterPanel.EMBED, (e) => {
            $.publish(embed.EmbedDialogue.SHOW_EMBED_DIALOGUE);
        });

        $.subscribe(footer.FooterPanel.DOWNLOAD, (e) => {
            var c = this.provider.getCanvasByIndex(this.provider.canvasIndex);
            c = c['@id'];
        });

        // dependencies
        var deps = overrideDependencies || dependencies;
        require(_.values(deps), function () {
            //var deps = _.object(_.keys(dependencies), arguments);

            that.createModules();

            that.setParams();

            var canvasIndex;

            if (!that.provider.isReload){
                canvasIndex = parseInt(that.getParam(baseProvider.params.canvasIndex)) || that.provider.getStartCanvasIndex();
            }

            if (that.provider.isCanvasIndexOutOfRange(canvasIndex)){
                that.showDialogue(that.provider.config.content.canvasIndexOutOfRange);
                return;
            }

            that.viewPage(canvasIndex || that.provider.getStartCanvasIndex());

            // initial sizing
            $.publish(baseExtension.BaseExtension.RESIZE);

            that.setDefaultFocus();

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

        this.$helpDialogue = $('<div class="overlay help"></div>');
        shell.Shell.$overlays.append(this.$helpDialogue);
        this.helpDialogue = new help.HelpDialogue(this.$helpDialogue);

        this.$embedDialogue = $('<div class="overlay embed"></div>');
        shell.Shell.$overlays.append(this.$embedDialogue);
        this.embedDialogue = new embed.EmbedDialogue(this.$embedDialogue);

        this.$settingsDialogue = $('<div class="overlay settings"></div>');
        shell.Shell.$overlays.append(this.$settingsDialogue);
        this.settingsDialogue = new settingsDialogue.SettingsDialogue(this.$settingsDialogue);

        this.$externalContentDialogue = $('<div class="overlay externalContent"></div>');
        shell.Shell.$overlays.append(this.$externalContentDialogue);
        this.externalContentDialogue = new externalContentDialogue.ExternalContentDialogue(this.$externalContentDialogue);

        if (this.isLeftPanelEnabled()){
            this.leftPanel.init();
        }

        if (this.isRightPanelEnabled()){
            this.rightPanel.init();
        }
    }

    updateSettings(): void {
        this.provider.reloadManifest(() => {
            $.publish(baseExtension.BaseExtension.RELOAD_MANIFEST);
            this.viewPage(this.provider.canvasIndex, true);
            $.publish(Extension.SETTINGS_CHANGED);
        });
    }

    setDefaultFocus(): void {
        setTimeout(() => {
            $('[tabindex=1]').focus();
        }, 1);
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

    viewPage(canvasIndex: number, isReload?: boolean): void {

        // if it's a valid canvas index.
        if (canvasIndex == -1) return;

        if (this.provider.isPaged() && !isReload){
            var indices = this.provider.getPagedIndices(canvasIndex);

            // if the page is already displayed, only advance canvasIndex.
            if (indices.contains(this.provider.canvasIndex)) {
                this.viewCanvas(canvasIndex, () => {
                    this.setParam(baseProvider.params.canvasIndex, canvasIndex);
                });

                return;
            }
        } 

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

    getViewerRotation(): number{

        if (!this.centerPanel) return;

        return this.currentRotation;
    }

    viewStructure(path: string): void {

        var structure = this.provider.getStructureByPath(path);

        if (!structure) return;

        var canvas = structure.canvases[0];

        var index = this.provider.getCanvasIndexById(canvas['@id']);

        this.viewPage(index);
    }

    viewLabel(label: string): void {

        if (!label) {
            this.showDialogue(this.provider.config.modules.genericDialogue.content.emptyValue);
            $.publish(Extension.CANVAS_INDEX_CHANGE_FAILED);
            return;
        }

        var index = this.provider.getCanvasIndexByLabel(label);

        if (index != -1) {
            this.viewPage(index);
        } else {
            this.showDialogue(this.provider.config.modules.genericDialogue.content.pageNotFound);
            $.publish(Extension.CANVAS_INDEX_CHANGE_FAILED);
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
