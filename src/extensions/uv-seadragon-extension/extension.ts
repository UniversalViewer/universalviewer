import BaseExtension = require("../../modules/uv-shared-module/BaseExtension");
import BaseProvider = require("../../modules/uv-shared-module/BaseProvider");
import BootStrapper = require("../../Bootstrapper");
import DownloadDialogue = require("./DownloadDialogue");
import EmbedDialogue = require("./EmbedDialogue");
import ExternalContentDialogue = require("../../modules/uv-dialogues-module/ExternalContentDialogue");
import FooterPanel = require("../../modules/uv-searchfooterpanel-module/FooterPanel");
import GalleryView = require("../../modules/uv-treeviewleftpanel-module/GalleryView");
import HelpDialogue = require("../../modules/uv-dialogues-module/HelpDialogue");
import IProvider = require("../../modules/uv-shared-module/IProvider");
import ISeadragonProvider = require("./ISeadragonProvider");
import LeftPanel = require("../../modules/uv-shared-module/LeftPanel");
import MoreInfoRightPanel = require("../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel");
import PagingHeaderPanel = require("../../modules/uv-pagingheaderpanel-module/PagingHeaderPanel");
import Params = require("../../modules/uv-shared-module/Params");
import RightPanel = require("../../modules/uv-shared-module/RightPanel");
import SeadragonCenterPanel = require("../../modules/uv-seadragoncenterpanel-module/SeadragonCenterPanel");
import Settings = require("../../modules/uv-shared-module/Settings");
import SettingsDialogue = require("../../extensions/uv-seadragon-extension/SettingsDialogue");
import Shell = require("../../modules/uv-shared-module/Shell");
import ThumbsView = require("../../modules/uv-treeviewleftpanel-module/ThumbsView");
import TreeView = require("../../modules/uv-treeviewleftpanel-module/TreeView");
import TreeViewLeftPanel = require("../../modules/uv-treeviewleftpanel-module/TreeViewLeftPanel");
import Utils = require("../../Utils");

class Extension extends BaseExtension {

    $downloadDialogue: JQuery;
    $embedDialogue: JQuery;
    $externalContentDialogue: JQuery;
    $helpDialogue: JQuery;
    $settingsDialogue: JQuery;
    centerPanel: SeadragonCenterPanel;
    currentRotation: number = 0;
    downloadDialogue: DownloadDialogue;
    embedDialogue: EmbedDialogue;
    externalContentDialogue: ExternalContentDialogue;
    footerPanel: FooterPanel;
    headerPanel: PagingHeaderPanel;
    helpDialogue: HelpDialogue;
    isLoading: boolean = false;
    leftPanel: TreeViewLeftPanel;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;

    static CURRENT_VIEW_URI: string = 'onCurrentViewUri';
    static IMAGE_MODE: string = "imageMode";
    static mode: string;
    static PAGE_MODE: string = "pageMode";
    static SEARCH_RESULTS: string = 'onSearchResults';
    static SEARCH_RESULTS_EMPTY: string = 'onSearchResults'; // todo: should be onSearchResultsEmpty?

    constructor(bootstrapper: BootStrapper) {
        super(bootstrapper);
    }

    create(overrideDependencies?: any): void {
        super.create(overrideDependencies);

        var that = this;

        // events.
        $.subscribe(PagingHeaderPanel.FIRST, (e) => {
            this.viewPage(this.provider.getFirstPageIndex());
        });

        $.subscribe(Extension.HOME, (e) => {
            this.viewPage(this.provider.getFirstPageIndex());
        });

        $.subscribe(PagingHeaderPanel.LAST, (e) => {
            this.viewPage(this.provider.getLastPageIndex());
        });

        $.subscribe(Extension.END, (e) => {
            this.viewPage(this.provider.getLastPageIndex());
        });

        $.subscribe(PagingHeaderPanel.PREV, (e) => {
            this.viewPage(this.provider.getPrevPageIndex());
        });

        $.subscribe(PagingHeaderPanel.NEXT, (e) => {
            this.viewPage(this.provider.getNextPageIndex());
        });

        $.subscribe(Extension.PAGE_UP, (e) => {
            this.viewPage(this.provider.getPrevPageIndex());
        });

        $.subscribe(Extension.PAGE_DOWN, (e) => {
            this.viewPage(this.provider.getNextPageIndex());
        });

        $.subscribe(Extension.LEFT_ARROW, (e) => {
            this.viewPage(this.provider.getPrevPageIndex());
        });

        $.subscribe(Extension.RIGHT_ARROW, (e) => {
            this.viewPage(this.provider.getNextPageIndex());
        });

        $.subscribe(PagingHeaderPanel.MODE_CHANGED, (e, mode: string) => {
            Extension.mode = mode;
            $.publish(Extension.SETTINGS_CHANGED, [mode]);
        });

        $.subscribe(PagingHeaderPanel.PAGE_SEARCH, (e, value: string) => {
            this.viewLabel(value);
        });

        $.subscribe(PagingHeaderPanel.IMAGE_SEARCH, (e, index: number) => {
            this.viewPage(index);
        });

        $.subscribe(FooterPanel.SEARCH, (e, terms: string) => {
            this.triggerSocket(FooterPanel.SEARCH, terms);
            this.searchWithin(terms);
        });

        $.subscribe(FooterPanel.VIEW_PAGE, (e, index: number) => {
            this.viewPage(index);
        });

        $.subscribe(FooterPanel.NEXT_SEARCH_RESULT, () => {
            this.nextSearchResult();
        });

        $.subscribe(FooterPanel.PREV_SEARCH_RESULT, () => {
            this.prevSearchResult();
        });

        $.subscribe(PagingHeaderPanel.UPDATE_SETTINGS, (e) => {
            this.updateSettings();
        });

        $.subscribe(SettingsDialogue.UPDATE_SETTINGS, (e) => {
            this.updateSettings();
        });

        $.subscribe(TreeView.NODE_SELECTED, (e, data: any) => {
            this.treeNodeSelected(data);
        });

        $.subscribe(ThumbsView.THUMB_SELECTED, (e, index: number) => {
            this.viewPage(index);
        });

        $.subscribe(GalleryView.THUMB_SELECTED, (e, index: number) => {
            this.viewPage(index);
        });

        $.subscribe(LeftPanel.OPEN_LEFT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(LeftPanel.CLOSE_LEFT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(RightPanel.OPEN_RIGHT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(RightPanel.CLOSE_RIGHT_PANEL, (e) => {
            this.resize();
        });

        $.subscribe(TreeViewLeftPanel.EXPAND_FULL_START, (e) => {
            Shell.$centerPanel.hide();
            Shell.$rightPanel.hide();
        });

        $.subscribe(TreeViewLeftPanel.COLLAPSE_FULL_FINISH, (e) => {
            Shell.$centerPanel.show();
            Shell.$rightPanel.show();
            this.resize();
        });

        $.subscribe(SeadragonCenterPanel.SEADRAGON_ANIMATION_FINISH, (e, viewer) => {
            if (this.centerPanel && this.centerPanel.currentBounds){
                this.setParam(Params.zoom, this.centerPanel.serialiseBounds(this.centerPanel.currentBounds));
            }

            var canvas = this.provider.getCurrentCanvas();

            this.triggerSocket(Extension.CURRENT_VIEW_URI,
                {
                    "cropUri": (<ISeadragonProvider>that.provider).getCroppedImageUri(canvas, this.getViewer(), true),
                    "fullUri": (<ISeadragonProvider>that.provider).getConfinedImageUri(canvas, canvas.width, canvas.height)
                });
        });

        $.subscribe(SeadragonCenterPanel.SEADRAGON_OPEN, () => {
            this.isLoading = false;
        });

        $.subscribe(SeadragonCenterPanel.SEADRAGON_ROTATION, (e, rotation) => {
            this.currentRotation = rotation;
            this.setParam(Params.rotation, rotation);
        });

        $.subscribe(SeadragonCenterPanel.PREV, (e) => {
            this.viewPage(this.provider.getPrevPageIndex());
        });

        $.subscribe(SeadragonCenterPanel.NEXT, (e) => {
            this.viewPage(this.provider.getNextPageIndex());
        });

        $.subscribe(FooterPanel.EMBED, (e) => {
            $.publish(EmbedDialogue.SHOW_EMBED_DIALOGUE);
        });

        $.subscribe(FooterPanel.DOWNLOAD, (e) => {
            $.publish(DownloadDialogue.SHOW_DOWNLOAD_DIALOGUE);
        });
    }

    createModules(): void{
        this.headerPanel = new PagingHeaderPanel(Shell.$headerPanel);

        if (this.isLeftPanelEnabled()){
            this.leftPanel = new TreeViewLeftPanel(Shell.$leftPanel);
        }

        this.centerPanel = new SeadragonCenterPanel(Shell.$centerPanel);

        if (this.isRightPanelEnabled()){
            this.rightPanel = new MoreInfoRightPanel(Shell.$rightPanel);
        }

        this.footerPanel = new FooterPanel(Shell.$footerPanel);

        this.$helpDialogue = $('<div class="overlay help"></div>');
        Shell.$overlays.append(this.$helpDialogue);
        this.helpDialogue = new HelpDialogue(this.$helpDialogue);

        this.$embedDialogue = $('<div class="overlay embed"></div>');
        Shell.$overlays.append(this.$embedDialogue);
        this.embedDialogue = new EmbedDialogue(this.$embedDialogue);

        this.$downloadDialogue = $('<div class="overlay download"></div>');
        Shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

        this.$settingsDialogue = $('<div class="overlay settings"></div>');
        Shell.$overlays.append(this.$settingsDialogue);
        this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);

        this.$externalContentDialogue = $('<div class="overlay externalContent"></div>');
        Shell.$overlays.append(this.$externalContentDialogue);
        this.externalContentDialogue = new ExternalContentDialogue(this.$externalContentDialogue);

        if (this.isLeftPanelEnabled()){
            this.leftPanel.init();
        }

        if (this.isRightPanelEnabled()){
            this.rightPanel.init();
        }
    }

    viewMedia(): void {
        var canvasIndex = parseInt(this.getParam(Params.canvasIndex)) || this.provider.getStartCanvasIndex();

        if (this.provider.isCanvasIndexOutOfRange(canvasIndex)){
            this.showDialogue(this.provider.config.content.canvasIndexOutOfRange);
            return;
        }

        this.viewPage(canvasIndex || this.provider.getStartCanvasIndex());
    }

    updateSettings(): void {
        this.viewPage(this.provider.canvasIndex, true);
        $.publish(Extension.SETTINGS_CHANGED);
    }

    viewPage(canvasIndex: number, isReload?: boolean): void {

        // todo: stopgap until this issue is resolved: https://github.com/openseadragon/openseadragon/issues/629
        if (this.isLoading){
            return;
        }

        // if it's a valid canvas index.
        if (canvasIndex == -1) return;

        this.isLoading = true;

        if (this.provider.isPagingSettingEnabled() && !isReload){
            var indices = this.provider.getPagedIndices(canvasIndex);

            // if the page is already displayed, only advance canvasIndex.
            if (indices.contains(this.provider.canvasIndex)) {
                this.viewCanvas(canvasIndex, () => {
                    this.setParam(Params.canvasIndex, canvasIndex);
                });

                this.isLoading = false;
                return;
            }
        }

        this.viewCanvas(canvasIndex, () => {
            var canvas = this.provider.getCanvasByIndex(canvasIndex);
            var uri = (<ISeadragonProvider>this.provider).getImageUri(canvas);
            $.publish(Extension.OPEN_MEDIA, [uri]);
            this.setParam(Params.canvasIndex, canvasIndex);
        });

    }

    getViewer() {
        return this.centerPanel.viewer;
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

        if (!this.centerPanel) return null;

        var bounds = this.centerPanel.getBounds();

        if (bounds) return this.centerPanel.serialiseBounds(bounds);

        return "";
    }

    getViewerRotation(): number{

        if (!this.centerPanel) return null;

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

    searchWithin(terms) {

        var that = this;

        (<ISeadragonProvider>this.provider).searchWithin(terms, (results: any) => {
            if (results.resources.length) {
                $.publish(Extension.SEARCH_RESULTS, [terms, results.resources]);

                // reload current index as it may contain results.
                that.viewPage(that.provider.canvasIndex, true);
            } else {
                that.showDialogue(that.provider.config.modules.genericDialogue.content.noMatches, () => {
                    $.publish(Extension.SEARCH_RESULTS_EMPTY);
                });
            }
        });
    }

    clearSearch() {
        (<ISeadragonProvider>this.provider).searchResults = [];

        // reload current index as it may contain results.
        this.viewPage(this.provider.canvasIndex);
    }

    prevSearchResult() {

        // get the first result with a canvasIndex less than the current index.
        for (var i = (<ISeadragonProvider>this.provider).searchResults.length - 1; i >= 0; i--) {
            var result = (<ISeadragonProvider>this.provider).searchResults[i];

            if (result.canvasIndex < this.provider.canvasIndex) {
                this.viewPage(result.canvasIndex);
                break;
            }
        }
    }

    nextSearchResult() {

        // get the first result with an index greater than the current index.
        for (var i = 0; i < (<ISeadragonProvider>this.provider).searchResults.length; i++) {
            var result = (<ISeadragonProvider>this.provider).searchResults[i];

            if (result.canvasIndex > this.provider.canvasIndex) {
                this.viewPage(result.canvasIndex);
                break;
            }
        }
    }
}

export = Extension;