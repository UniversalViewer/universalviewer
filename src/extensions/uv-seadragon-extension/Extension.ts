import BaseCommands = require("../../modules/uv-shared-module/BaseCommands");
import BaseExtension = require("../../modules/uv-shared-module/BaseExtension");
import BaseProvider = require("../../modules/uv-shared-module/BaseProvider");
import Bookmark = require("../../modules/uv-shared-module/Bookmark");
import BootStrapper = require("../../Bootstrapper");
import Commands = require("./Commands");
import DownloadDialogue = require("./DownloadDialogue");
import EmbedDialogue = require("./EmbedDialogue");
import ExternalContentDialogue = require("../../modules/uv-dialogues-module/ExternalContentDialogue");
import ExternalResource = require("../../modules/uv-shared-module/ExternalResource");
import FooterPanel = require("../../modules/uv-searchfooterpanel-module/FooterPanel");
import GalleryView = require("../../modules/uv-contentleftpanel-module/GalleryView");
import HelpDialogue = require("../../modules/uv-dialogues-module/HelpDialogue");
import IProvider = require("../../modules/uv-shared-module/IProvider");
import ISeadragonProvider = require("./ISeadragonProvider");
import LeftPanel = require("../../modules/uv-shared-module/LeftPanel");
import Mode = require("./Mode");
import MoreInfoRightPanel = require("../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel");
import PagingHeaderPanel = require("../../modules/uv-pagingheaderpanel-module/PagingHeaderPanel");
import Params = require("../../Params");
import RightPanel = require("../../modules/uv-shared-module/RightPanel");
import SeadragonCenterPanel = require("../../modules/uv-seadragoncenterpanel-module/SeadragonCenterPanel");
import Settings = require("../../modules/uv-shared-module/Settings");
import SettingsDialogue = require("./SettingsDialogue");
import Shell = require("../../modules/uv-shared-module/Shell");
import ThumbsView = require("../../modules/uv-contentleftpanel-module/ThumbsView");
import TreeView = require("../../modules/uv-contentleftpanel-module/TreeView");
import ContentLeftPanel = require("../../modules/uv-contentleftpanel-module/ContentLeftPanel");

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
    leftPanel: ContentLeftPanel;
    mode: Mode;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;

    constructor(bootstrapper: BootStrapper) {
        super(bootstrapper);
    }

    create(overrideDependencies?: any): void {
        super.create(overrideDependencies);

        var that = this;

        $.subscribe(Commands.CLEAR_SEARCH, (e) => {
            this.triggerSocket(Commands.CLEAR_SEARCH);
        });

        $.subscribe(BaseCommands.DOWN_ARROW, (e) => {
            if (!this.useArrowKeysToNavigate()) {
                this.centerPanel.setFocus();
            }
        });

        $.subscribe(Commands.DOWNLOAD_CURRENTVIEW, (e) => {
            this.triggerSocket(Commands.DOWNLOAD_CURRENTVIEW);
        });

        $.subscribe(Commands.DOWNLOAD_ENTIREDOCUMENTASPDF, (e) => {
            this.triggerSocket(Commands.DOWNLOAD_ENTIREDOCUMENTASPDF);
        });

        $.subscribe(Commands.DOWNLOAD_ENTIREDOCUMENTASTEXT, (e) => {
            this.triggerSocket(Commands.DOWNLOAD_ENTIREDOCUMENTASTEXT);
        });

        $.subscribe(Commands.DOWNLOAD_WHOLEIMAGEHIGHRES, (e) => {
            this.triggerSocket(Commands.DOWNLOAD_WHOLEIMAGEHIGHRES);
        });

        $.subscribe(Commands.DOWNLOAD_WHOLEIMAGELOWRES, (e) => {
            this.triggerSocket(Commands.DOWNLOAD_WHOLEIMAGELOWRES);
        });

        $.subscribe(BaseCommands.END, (e) => {
            this.viewPage(this.provider.getLastPageIndex());
        });

        $.subscribe(Commands.FIRST, (e) => {
            this.triggerSocket(Commands.FIRST);
            this.viewPage(this.provider.getFirstPageIndex());
        });

        $.subscribe(Commands.GALLERY_THUMB_SELECTED, (e) => {
            this.triggerSocket(Commands.GALLERY_THUMB_SELECTED);
        });

        $.subscribe(BaseCommands.HOME, (e) => {;
            this.viewPage(this.provider.getFirstPageIndex());
        });

        $.subscribe(Commands.IMAGE_SEARCH, (e, index: number) => {
            this.triggerSocket(Commands.IMAGE_SEARCH, index);
            this.viewPage(index);
        });

        $.subscribe(Commands.LAST, (e) => {
            this.triggerSocket(Commands.LAST);
            this.viewPage(this.provider.getLastPageIndex());
        });

        $.subscribe(BaseCommands.LEFT_ARROW, (e) => {
            if (this.useArrowKeysToNavigate()) {
                this.viewPage((<ISeadragonProvider>this.provider).getPrevPageIndex());
            } else {
                this.centerPanel.setFocus();
            }
        });

        $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH, (e) => {;
            Shell.$centerPanel.show();
            Shell.$rightPanel.show();
            this.resize();
        });

        $.subscribe(BaseCommands.LEFTPANEL_EXPAND_FULL_START, (e) => {
            Shell.$centerPanel.hide();
            Shell.$rightPanel.hide();
        });

        $.subscribe(BaseCommands.MINUS, (e) => {
            this.centerPanel.setFocus();
        });

        $.subscribe(Commands.MODE_CHANGED, (e, mode: string) => {
            this.triggerSocket(Commands.MODE_CHANGED, mode);
            this.mode = new Mode(mode);
            var settings: ISettings = this.provider.getSettings();
            $.publish(BaseCommands.SETTINGS_CHANGED, [settings]);
        });

        $.subscribe(Commands.MULTISELECTION_MADE, (e, ids: string[]) => {
            this.triggerSocket(Commands.MULTISELECTION_MADE, ids);
        });

        $.subscribe(Commands.NEXT, (e) => {
            this.triggerSocket(Commands.NEXT);
            this.viewPage((<ISeadragonProvider>this.provider).getNextPageIndex());
        });

        $.subscribe(Commands.NEXT_SEARCH_RESULT, () => {
            this.triggerSocket(Commands.NEXT_SEARCH_RESULT);
            this.nextSearchResult();
        });

        $.subscribe(Commands.OPEN_THUMBS_VIEW, (e) => {
            this.triggerSocket(Commands.OPEN_THUMBS_VIEW);
        });

        $.subscribe(Commands.OPEN_TREE_VIEW, (e) => {
            this.triggerSocket(Commands.OPEN_TREE_VIEW);
        });

        $.subscribe(BaseCommands.PAGE_DOWN, (e) => {
            this.viewPage((<ISeadragonProvider>this.provider).getNextPageIndex());
        });

        $.subscribe(Commands.PAGE_SEARCH, (e, value: string) => {
            this.triggerSocket(Commands.PAGE_SEARCH, value);
            this.viewLabel(value);
        });

        $.subscribe(BaseCommands.PAGE_UP, (e) => {
            this.viewPage((<ISeadragonProvider>this.provider).getPrevPageIndex());
        });

        $.subscribe(BaseCommands.PLUS, (e) => {
            this.centerPanel.setFocus();
        });

        $.subscribe(Commands.PREV, (e) => {
            this.triggerSocket(Commands.PREV);
            this.viewPage((<ISeadragonProvider>this.provider).getPrevPageIndex());
        });

        $.subscribe(Commands.PREV_SEARCH_RESULT, () => {
            this.triggerSocket(Commands.PREV_SEARCH_RESULT);
            this.prevSearchResult();
        });

        $.subscribe(BaseCommands.RIGHT_ARROW, (e) => {
            if (this.useArrowKeysToNavigate()) {
                this.viewPage((<ISeadragonProvider>this.provider).getNextPageIndex());
            } else {
                this.centerPanel.setFocus();
            }
        });

        $.subscribe(Commands.SEADRAGON_ANIMATION, () => {
            this.triggerSocket(Commands.SEADRAGON_ANIMATION);
        });

        $.subscribe(Commands.SEADRAGON_ANIMATION_FINISH, (e, viewer) => {
            if (this.centerPanel && this.centerPanel.currentBounds){
                this.setParam(Params.zoom, this.centerPanel.serialiseBounds(this.centerPanel.currentBounds));
            }

            var canvas: Manifesto.ICanvas = this.provider.getCurrentCanvas();

            this.triggerSocket(Commands.CURRENT_VIEW_URI,
                {
                    "cropUri": (<ISeadragonProvider>that.provider).getCroppedImageUri(canvas, this.getViewer()),
                    "fullUri": (<ISeadragonProvider>that.provider).getConfinedImageUri(canvas, canvas.getWidth(), canvas.getHeight())
                });
        });

        $.subscribe(Commands.SEADRAGON_ANIMATION_START, () => {
            this.triggerSocket(Commands.SEADRAGON_ANIMATION_START);
        });

        $.subscribe(Commands.SEADRAGON_OPEN, () => {
            if (!this.useArrowKeysToNavigate())
                this.centerPanel.setFocus();
        });

        $.subscribe(Commands.SEADRAGON_RESIZE, () => {
            this.triggerSocket(Commands.SEADRAGON_RESIZE);
        });

        $.subscribe(Commands.SEADRAGON_ROTATION, (e, rotation) => {
            this.triggerSocket(Commands.SEADRAGON_ROTATION);
            this.currentRotation = rotation;
            this.setParam(Params.rotation, rotation);
        });

        $.subscribe(Commands.SEARCH, (e, terms: string) => {
            this.triggerSocket(Commands.SEARCH, terms);
            this.searchWithin(terms);
        });

        $.subscribe(Commands.SEARCH_PREVIEW_FINISH, (e) => {
            this.triggerSocket(Commands.SEARCH_PREVIEW_FINISH);
        });

        $.subscribe(Commands.SEARCH_PREVIEW_START, (e) => {
            this.triggerSocket(Commands.SEARCH_PREVIEW_START);
        });

        $.subscribe(Commands.SEARCH_RESULTS, (e, obj) => {
            this.triggerSocket(Commands.SEARCH_RESULTS, obj);
        });

        $.subscribe(Commands.SEARCH_RESULTS_EMPTY, (e) => {
            this.triggerSocket(Commands.SEARCH_RESULTS_EMPTY);
        });

        $.subscribe(BaseCommands.THUMB_SELECTED, (e, index: number) => {
            this.viewPage(index);
        });

        $.subscribe(Commands.TREE_NODE_SELECTED, (e, data: any) => {
            this.triggerSocket(Commands.TREE_NODE_SELECTED, data.path);
            this.treeNodeSelected(data);
        });

        $.subscribe(BaseCommands.UP_ARROW, (e) => {
            if (!this.useArrowKeysToNavigate()) {
                this.centerPanel.setFocus();
            }
        });

        $.subscribe(BaseCommands.UPDATE_SETTINGS, (e) => {
            this.updateSettings();
        });

        $.subscribe(Commands.VIEW_PAGE, (e, index: number) => {
            this.triggerSocket(Commands.VIEW_PAGE, index);
            this.viewPage(index);
        });

        Utils.Async.WaitFor(() => {
            return this.centerPanel && this.centerPanel.isCreated;
        }, () => {
            this.checkForSearchParam();
        });
    }

    createModules(): void{
        super.createModules();

        this.headerPanel = new PagingHeaderPanel(Shell.$headerPanel);

        if (this.isLeftPanelEnabled()){
            this.leftPanel = new ContentLeftPanel(Shell.$leftPanel);
        } else {
            Shell.$leftPanel.hide();
        }

        this.centerPanel = new SeadragonCenterPanel(Shell.$centerPanel);

        if (this.isRightPanelEnabled()){
            this.rightPanel = new MoreInfoRightPanel(Shell.$rightPanel);
        } else {
            Shell.$rightPanel.hide();
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

    checkForSearchParam(): void{
        // if a h value is in the hash params, do a search.
        if (this.provider.isDeepLinkingEnabled()){

            // if a highlight param is set, use it to search.
            var highlight: string = this.getParam(Params.highlight);

            if (highlight){
                highlight.replace(/\+/g, " ").replace(/"/g, "");
                $.publish(Commands.SEARCH, [highlight]);
            }
        }
    }

    updateSettings(): void {
        this.viewPage(this.provider.canvasIndex, true);
        var settings: ISettings = this.provider.getSettings();
        $.publish(BaseCommands.SETTINGS_CHANGED, [settings]);
    }

    viewPage(canvasIndex: number, isReload?: boolean): void {

        // if it's a valid canvas index.
        if (canvasIndex === -1) return;

        if (this.provider.isCanvasIndexOutOfRange(canvasIndex)){
            this.showMessage(this.provider.config.content.canvasIndexOutOfRange);
            canvasIndex = 0;
        }

        if ((<ISeadragonProvider>this.provider).isPagingSettingEnabled() && !isReload){
            var indices = this.provider.getPagedIndices(canvasIndex);

            // if the page is already displayed, only advance canvasIndex.
            if (indices.contains(this.provider.canvasIndex)) {
                this.viewCanvas(canvasIndex);
                return;
            }
        }

        this.viewCanvas(canvasIndex);
    }

    getViewer() {
        return this.centerPanel.viewer;
    }

    getMode(): Mode {
        if (this.mode) return this.mode;

        switch (this.provider.getManifestType().toString()) {
            case manifesto.ManifestType.monograph().toString():
                return Mode.page;
                break;
            case manifesto.ManifestType.manuscript().toString():
                return Mode.page;
                break;
            default:
                return Mode.image;
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

    viewRange(path: string): void {

        var range = this.provider.getRangeByPath(path);

        if (!range) return;

        var canvasId: string = range.getCanvasIds()[0];
        var index = this.provider.getCanvasIndexById(canvasId);

        this.viewPage(index);
    }

    viewLabel(label: string): void {

        if (!label) {
            this.showMessage(this.provider.config.modules.genericDialogue.content.emptyValue);
            $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
            return;
        }

        var index = this.provider.getCanvasIndexByLabel(label);

        if (index != -1) {
            this.viewPage(index);
        } else {
            this.showMessage(this.provider.config.modules.genericDialogue.content.pageNotFound);
            $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
        }
    }

    treeNodeSelected(data: any): void{
        if (!data.type) return;

        switch (data.type){
            case manifesto.IIIFResourceType.manifest().toString():
                this.viewManifest(data);
                break;
            case manifesto.IIIFResourceType.collection().toString():
                this.viewCollection(data);
                break;
            default:
                this.viewRange(data.path);
                break;
        }
    }

    searchWithin(terms): void {

        var that = this;

        (<ISeadragonProvider>this.provider).searchWithin(terms, (results: any) => {
            if (results.resources && results.resources.length) {
                $.publish(Commands.SEARCH_RESULTS, [{terms, results}]);

                // reload current index as it may contain results.
                that.viewPage(that.provider.canvasIndex, true);
            } else {
                that.showMessage(that.provider.config.modules.genericDialogue.content.noMatches, () => {
                    $.publish(Commands.SEARCH_RESULTS_EMPTY);
                });
            }
        });
    }

    clearSearch(): void {
        (<ISeadragonProvider>this.provider).searchResults = [];

        // reload current index as it may contain results.
        this.viewPage(this.provider.canvasIndex);
    }

    prevSearchResult(): void {

        // get the first result with a canvasIndex less than the current index.
        for (var i = (<ISeadragonProvider>this.provider).searchResults.length - 1; i >= 0; i--) {
            var result = (<ISeadragonProvider>this.provider).searchResults[i];

            if (result.canvasIndex < this.provider.canvasIndex) {
                this.viewPage(result.canvasIndex);
                break;
            }
        }
    }

    nextSearchResult(): void {

        // get the first result with an index greater than the current index.
        for (var i = 0; i < (<ISeadragonProvider>this.provider).searchResults.length; i++) {
            var result = (<ISeadragonProvider>this.provider).searchResults[i];

            if (result.canvasIndex > this.provider.canvasIndex) {
                this.viewPage(result.canvasIndex);
                break;
            }
        }
    }

    bookmark(): void {
        super.bookmark();

        var canvas: Manifesto.ICanvas = this.provider.getCurrentCanvas();
        var bookmark: Bookmark = new Bookmark();

        bookmark.index = this.provider.canvasIndex;
        bookmark.label = canvas.getLabel();
        bookmark.path = (<ISeadragonProvider>this.provider).getCroppedImageUri(canvas, this.getViewer());
        bookmark.thumb = canvas.getThumbUri(this.provider.config.options.bookmarkThumbWidth, this.provider.config.options.bookmarkThumbHeight);
        bookmark.title = this.provider.getTitle();
        bookmark.type = manifesto.ElementType.image().toString();

        this.triggerSocket(BaseCommands.BOOKMARK, bookmark);
    }
}

export = Extension;