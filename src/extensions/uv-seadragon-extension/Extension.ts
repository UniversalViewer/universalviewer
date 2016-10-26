import BaseCommands = require("../../modules/uv-shared-module/BaseCommands");
import BaseExtension = require("../../modules/uv-shared-module/BaseExtension");
import Bookmark = require("../../modules/uv-shared-module/Bookmark");
import BootStrapper = require("../../Bootstrapper");
import Commands = require("./Commands");
import ContentLeftPanel = require("../../modules/uv-contentleftpanel-module/ContentLeftPanel");
import CroppedImageDimensions = require("./CroppedImageDimensions");
import DownloadDialogue = require("./DownloadDialogue");
import ExternalContentDialogue = require("../../modules/uv-dialogues-module/ExternalContentDialogue");
import ExternalResource = Manifesto.IExternalResource;
import FooterPanel = require("../../modules/uv-searchfooterpanel-module/FooterPanel");
import GalleryView = require("../../modules/uv-contentleftpanel-module/GalleryView");
import HelpDialogue = require("../../modules/uv-dialogues-module/HelpDialogue");
import ISeadragonExtension = require("./ISeadragonExtension");
import IThumb = Manifold.IThumb;
import ITreeNode = Manifold.ITreeNode;
import LeftPanel = require("../../modules/uv-shared-module/LeftPanel");
import Metrics = require("../../modules/uv-shared-module/Metrics");
import MobileFooterPanel = require("../../modules/uv-osdmobilefooterpanel-module/MobileFooter");
import Mode = require("./Mode");
import MoreInfoDialogue = require("../../modules/uv-dialogues-module/MoreInfoDialogue");
import MoreInfoRightPanel = require("../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel");
import MultiSelectDialogue = require("../../modules/uv-multiselectdialogue-module/MultiSelectDialogue");
import MultiSelectionArgs = require("./MultiSelectionArgs");
import PagingHeaderPanel = require("../../modules/uv-pagingheaderpanel-module/PagingHeaderPanel");
import Params = require("../../Params");
import Point = require("../../modules/uv-shared-module/Point");
import RightPanel = require("../../modules/uv-shared-module/RightPanel");
import SeadragonCenterPanel = require("../../modules/uv-seadragoncenterpanel-module/SeadragonCenterPanel");
import SearchResult = require("./SearchResult");
import SearchResultRect = require("./SearchResultRect");
import Settings = require("../../modules/uv-shared-module/Settings");
import SettingsDialogue = require("./SettingsDialogue");
import ShareDialogue = require("./ShareDialogue");
import Shell = require("../../modules/uv-shared-module/Shell");
import Size = Utils.Measurements.Size;

class Extension extends BaseExtension implements ISeadragonExtension {

    $downloadDialogue: JQuery;
    $externalContentDialogue: JQuery;
    $helpDialogue: JQuery;
    $moreInfoDialogue: JQuery;
    $multiSelectDialogue: JQuery;
    $settingsDialogue: JQuery;
    $shareDialogue: JQuery;
    centerPanel: SeadragonCenterPanel;
    currentRotation: number = 0;
    downloadDialogue: DownloadDialogue;
    externalContentDialogue: ExternalContentDialogue;
    footerPanel: FooterPanel;
    headerPanel: PagingHeaderPanel;
    helpDialogue: HelpDialogue;
    iiifImageUriTemplate: string = '{0}/{1}/{2}/{3}/{4}/{5}.jpg';
    leftPanel: ContentLeftPanel;
    mobileFooterPanel: MobileFooterPanel;
    mode: Mode;
    moreInfoDialogue: MoreInfoDialogue;
    multiSelectDialogue: MultiSelectDialogue;
    rightPanel: MoreInfoRightPanel;
    searchResults: SearchResult[] = [];
    settingsDialogue: SettingsDialogue;
    shareDialogue: ShareDialogue;

    constructor(bootstrapper: BootStrapper) {
        super(bootstrapper);
    }

    create(overrideDependencies?: any): void {
        super.create(overrideDependencies);

        var that = this;

        $.subscribe(BaseCommands.METRIC_CHANGED, () => {
            if (this.metric === Metrics.MOBILE_LANDSCAPE) {
                var settings: ISettings = {};
                settings.pagingEnabled = false;
                this.updateSettings(settings);
                $.publish(BaseCommands.UPDATE_SETTINGS);
                Shell.$rightPanel.hide();
            } else {
                Shell.$rightPanel.show();
            }
        });

        $.subscribe(Commands.CLEAR_SEARCH, (e) => {
            this.triggerSocket(Commands.CLEAR_SEARCH);
        });

        $.subscribe(BaseCommands.DOWN_ARROW, (e) => {
            if (!this.useArrowKeysToNavigate()) {
                this.centerPanel.setFocus();
            }
        });

        $.subscribe(BaseCommands.END, (e) => {
            this.viewPage(this.helper.getLastPageIndex());
        });

        $.subscribe(Commands.FIRST, (e) => {
            this.triggerSocket(Commands.FIRST);
            this.viewPage(this.helper.getFirstPageIndex());
        });

        $.subscribe(Commands.GALLERY_DECREASE_SIZE, (e) => {
            this.triggerSocket(Commands.GALLERY_DECREASE_SIZE);
        });

        $.subscribe(Commands.GALLERY_INCREASE_SIZE, (e) => {
            this.triggerSocket(Commands.GALLERY_INCREASE_SIZE);
        });

        $.subscribe(Commands.GALLERY_THUMB_SELECTED, (e) => {
            this.triggerSocket(Commands.GALLERY_THUMB_SELECTED);
        });

        $.subscribe(BaseCommands.HOME, (e) => {
            this.viewPage(this.helper.getFirstPageIndex());
        });

        $.subscribe(Commands.IMAGE_SEARCH, (e, index: number) => {
            this.triggerSocket(Commands.IMAGE_SEARCH, index);
            this.viewPage(index);
        });

        $.subscribe(Commands.LAST, (e) => {
            this.triggerSocket(Commands.LAST);
            this.viewPage(this.helper.getLastPageIndex());
        });

        $.subscribe(BaseCommands.LEFT_ARROW, (e) => {
            if (this.useArrowKeysToNavigate()) {
                this.viewPage(this.getPrevPageIndex());
            } else {
                this.centerPanel.setFocus();
            }
        });

        $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START, (e) => {
            if (this.metric !== Metrics.MOBILE_LANDSCAPE) {
                Shell.$rightPanel.show();
            }
        });

        $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH, (e) => {
            Shell.$centerPanel.show();            
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
            var settings: ISettings = this.getSettings();
            $.publish(BaseCommands.SETTINGS_CHANGED, [settings]);
        });

        $.subscribe(Commands.MULTISELECTION_MADE, (e, ids: string[]) => {
            var args: MultiSelectionArgs = new MultiSelectionArgs();
            args.manifestUri = this.helper.iiifResourceUri;
            args.allCanvases = ids.length === this.helper.getCanvases().length;
            args.canvases = ids;
            args.format = this.config.options.multiSelectionMimeType;
            args.sequence = this.helper.getCurrentSequence().id;
            this.triggerSocket(Commands.MULTISELECTION_MADE, args);
        });

        $.subscribe(Commands.NEXT, (e) => {
            this.triggerSocket(Commands.NEXT);
            this.viewPage(this.getNextPageIndex());
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
            this.viewPage(this.getNextPageIndex());
        });

        $.subscribe(Commands.PAGE_SEARCH, (e, value: string) => {
            this.triggerSocket(Commands.PAGE_SEARCH, value);
            this.viewLabel(value);
        });

        $.subscribe(BaseCommands.PAGE_UP, (e) => {
            this.viewPage(this.getPrevPageIndex());
        });

        $.subscribe(Commands.PAGING_TOGGLED, (e, obj) => {
            this.triggerSocket(Commands.PAGING_TOGGLED, obj);
        });

        $.subscribe(BaseCommands.PLUS, (e) => {
            this.centerPanel.setFocus();
        });

        $.subscribe(Commands.PREV, (e) => {
            this.triggerSocket(Commands.PREV);
            this.viewPage(this.getPrevPageIndex());
        });

        $.subscribe(Commands.PREV_SEARCH_RESULT, () => {
            this.triggerSocket(Commands.PREV_SEARCH_RESULT);
            this.prevSearchResult();
        });

        $.subscribe(Commands.PRINT, () => {
            this.print();
        });

        $.subscribe(BaseCommands.RIGHT_ARROW, (e) => {
            if (this.useArrowKeysToNavigate()) {
                this.viewPage(this.getNextPageIndex());
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

            var canvas: Manifesto.ICanvas = this.helper.getCurrentCanvas();

            this.triggerSocket(Commands.CURRENT_VIEW_URI,
                {
                    cropUri: this.getCroppedImageUri(canvas, this.getViewer()),
                    fullUri: this.getConfinedImageUri(canvas, canvas.getWidth())
                });
        });

        $.subscribe(Commands.SEADRAGON_ANIMATION_START, () => {
            this.triggerSocket(Commands.SEADRAGON_ANIMATION_START);
        });

        $.subscribe(Commands.SEADRAGON_OPEN, () => {
            if (!this.useArrowKeysToNavigate()){
                this.centerPanel.setFocus();
            }
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

        $.subscribe(BaseCommands.THUMB_SELECTED, (e, thumb: IThumb) => {
            this.viewPage(thumb.index);
        });

        $.subscribe(Commands.TREE_NODE_SELECTED, (e, node: ITreeNode) => {
            this.triggerSocket(Commands.TREE_NODE_SELECTED, node.data.path);
            this.treeNodeSelected(node);
        });

        $.subscribe(BaseCommands.UP_ARROW, (e) => {
            if (!this.useArrowKeysToNavigate()) {
                this.centerPanel.setFocus();
            }
        });

        $.subscribe(BaseCommands.UPDATE_SETTINGS, (e) => {
            this.viewPage(this.helper.canvasIndex, true);
            var settings: ISettings = this.getSettings();
            $.publish(BaseCommands.SETTINGS_CHANGED, [settings]);
        });

        $.subscribe(Commands.VIEW_PAGE, (e, index: number) => {
            this.triggerSocket(Commands.VIEW_PAGE, index);
            this.viewPage(index);
        });

        Utils.Async.waitFor(() => {
            return this.centerPanel && this.centerPanel.isCreated;
        }, () => {
            this.checkForSearchParam();
            this.checkForRotationParam();
        });
    }

    createModules(): void{
        super.createModules();

        if (this.isHeaderPanelEnabled()){
            this.headerPanel = new PagingHeaderPanel(Shell.$headerPanel);
        } else {
            Shell.$headerPanel.hide();
        }

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

        if (this.isFooterPanelEnabled()){
            this.footerPanel = new FooterPanel(Shell.$footerPanel);
            this.mobileFooterPanel = new MobileFooterPanel(Shell.$mobileFooterPanel);
        } else {
            Shell.$footerPanel.hide();
        }

        this.$helpDialogue = $('<div class="overlay help"></div>');
        Shell.$overlays.append(this.$helpDialogue);
        this.helpDialogue = new HelpDialogue(this.$helpDialogue);

        this.$moreInfoDialogue = $('<div class="overlay moreInfo"></div>');
        Shell.$overlays.append(this.$moreInfoDialogue);
        this.moreInfoDialogue = new MoreInfoDialogue(this.$moreInfoDialogue);

        this.$multiSelectDialogue = $('<div class="overlay multiSelect"></div>');
        Shell.$overlays.append(this.$multiSelectDialogue);
        this.multiSelectDialogue = new MultiSelectDialogue(this.$multiSelectDialogue);

        this.$shareDialogue = $('<div class="overlay share"></div>');
        Shell.$overlays.append(this.$shareDialogue);
        this.shareDialogue = new ShareDialogue(this.$shareDialogue);

        this.$downloadDialogue = $('<div class="overlay download"></div>');
        Shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

        this.$settingsDialogue = $('<div class="overlay settings"></div>');
        Shell.$overlays.append(this.$settingsDialogue);
        this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);

        this.$externalContentDialogue = $('<div class="overlay externalContent"></div>');
        Shell.$overlays.append(this.$externalContentDialogue);
        this.externalContentDialogue = new ExternalContentDialogue(this.$externalContentDialogue);

        if (this.isHeaderPanelEnabled()){
            this.headerPanel.init();
        }

        if (this.isLeftPanelEnabled()){
            this.leftPanel.init();
        }

        if (this.isRightPanelEnabled()){
            this.rightPanel.init();
        }

        if (this.isFooterPanelEnabled()){
            this.footerPanel.init();
        }
    }

    checkForSearchParam(): void{
        // if a h value is in the hash params, do a search.
        if (this.isDeepLinkingEnabled()){

            // if a highlight param is set, use it to search.
            var highlight: string = this.getParam(Params.highlight);

            if (highlight){
                highlight.replace(/\+/g, " ").replace(/"/g, "");
                $.publish(Commands.SEARCH, [highlight]);
            }
        }
    }
    checkForRotationParam(): void{
        // if a rotation value is in the hash params, set currentRotation
        if (this.isDeepLinkingEnabled()){

            var rotation: number = Number(this.getParam(Params.rotation));

            if (rotation){
                $.publish(Commands.SEADRAGON_ROTATION, [rotation]);
            }
        }
    }

    viewPage(canvasIndex: number, isReload?: boolean): void {

        // if it's a valid canvas index.
        if (canvasIndex === -1) return;

        if (this.helper.isCanvasIndexOutOfRange(canvasIndex)){
            this.showMessage(this.config.content.canvasIndexOutOfRange);
            canvasIndex = 0;
        }

        if (this.isPagingSettingEnabled() && !isReload){
            var indices = this.getPagedIndices(canvasIndex);

            // if the page is already displayed, only advance canvasIndex.
            if (indices.contains(this.helper.canvasIndex)) {
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

        switch (this.helper.getManifestType().toString()) {
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
        //this.currentRangePath = path;
        var range: Manifesto.IRange = this.helper.getRangeByPath(path);
        if (!range) return;
        var canvasId: string = range.getCanvasIds()[0];
        var index: number = this.helper.getCanvasIndexById(canvasId);
        this.viewPage(index);
    }

    viewLabel(label: string): void {

        if (!label) {
            this.showMessage(this.config.modules.genericDialogue.content.emptyValue);
            $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
            return;
        }

        var index = this.helper.getCanvasIndexByLabel(label);

        if (index != -1) {
            this.viewPage(index);
        } else {
            this.showMessage(this.config.modules.genericDialogue.content.pageNotFound);
            $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
        }
    }

    treeNodeSelected(node: ITreeNode): void{
        var data: any = node.data;
        
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

    clearSearch(): void {
        this.searchResults = [];

        // reload current index as it may contain results.
        this.viewPage(this.helper.canvasIndex);
    }

    prevSearchResult(): void {

        // get the first result with a canvasIndex less than the current index.
        for (var i = this.searchResults.length - 1; i >= 0; i--) {
            var result = this.searchResults[i];

            if (result.canvasIndex < this.helper.canvasIndex) {
                this.viewPage(result.canvasIndex);
                break;
            }
        }
    }

    nextSearchResult(): void {

        // get the first result with an index greater than the current index.
        for (var i = 0; i < this.searchResults.length; i++) {
            var result = this.searchResults[i];

            if (result.canvasIndex > this.helper.canvasIndex) {
                this.viewPage(result.canvasIndex);
                break;
            }
        }
    }

    bookmark(): void {
        super.bookmark();

        var canvas: Manifesto.ICanvas = this.helper.getCurrentCanvas();
        var bookmark: Bookmark = new Bookmark();

        bookmark.index = this.helper.canvasIndex;
        bookmark.label = Manifesto.TranslationCollection.getValue(canvas.getLabel());
        bookmark.path = this.getCroppedImageUri(canvas, this.getViewer());
        bookmark.thumb = canvas.getCanonicalImageUri(this.config.options.bookmarkThumbWidth);
        bookmark.title = this.helper.getLabel();
        bookmark.trackingLabel = window.trackingLabel;
        bookmark.type = manifesto.ElementType.image().toString();

        this.triggerSocket(BaseCommands.BOOKMARK, bookmark);
    }

    print(): void {
        // var args: MultiSelectionArgs = new MultiSelectionArgs();
        // args.manifestUri = this.helper.iiifResourceUri;
        // args.allCanvases = true;
        // args.format = this.config.options.printMimeType;
        // args.sequence = this.helper.getCurrentSequence().id;
        window.print();
        this.triggerSocket(Commands.PRINT);
    }

    getCroppedImageDimensions(canvas: Manifesto.ICanvas, viewer: any): CroppedImageDimensions {
        if (!viewer) return null;
        if (!viewer.viewport) return null;

        if (!canvas.getHeight() || !canvas.getWidth()){
            return null;
        }

        var bounds = viewer.viewport.getBounds(true);

        var dimensions: CroppedImageDimensions = new CroppedImageDimensions();

        var width: number = Math.floor(bounds.width);
        var height: number = Math.floor(bounds.height);
        var x: number = Math.floor(bounds.x);
        var y: number = Math.floor(bounds.y);

        // constrain to image bounds
        if (x + width > canvas.getWidth()) {
            width = canvas.getWidth() - x;
        } else if (x < 0){
            width = width + x;
            x = 0;
        }

        if (y + height > canvas.getHeight()) {
            height = canvas.getHeight() - y;
        } else if (y < 0){
            height = height + y;
            y = 0;
        }
        
        width = Math.min(width, canvas.getWidth());
        height = Math.min(height, canvas.getHeight());       
        var regionWidth: number = width;
        var regionHeight: number = height;

        if (canvas.externalResource.data && canvas.externalResource.data.profile[1]){
          var maxSize: Size =  new Size(canvas.externalResource.data.profile[1].maxWidth, canvas.externalResource.data.profile[1].maxHeight);
          if (!_.isUndefined(maxSize.width) && !_.isUndefined(maxSize.height)){

            if( width > maxSize.width ){

              var newWidth: number = maxSize.width;
              height = Math.round( newWidth * (height / width) );
              width = newWidth;

            }

            if ( height > maxSize.height ) {

                var newHeight: number = maxSize.height;
                width = Math.round( (width / height) * newHeight );
                height = newHeight;

            }

          } 
        }

        dimensions.region = new Size(regionWidth, regionHeight);
        dimensions.regionPos = new Point(x, y);
        dimensions.size = new Size(width, height);

        return dimensions;
    }

    // keep this around for reference

    // getOnScreenCroppedImageDimensions(canvas: Manifesto.ICanvas, viewer: any): CroppedImageDimensions {

    //     if (!viewer) return null;
    //     if (!viewer.viewport) return null;

    //     if (!canvas.getHeight() || !canvas.getWidth()){
    //         return null;
    //     }

    //     var bounds = viewer.viewport.getBounds(true);
    //     var containerSize = viewer.viewport.getContainerSize();
    //     var zoom = viewer.viewport.getZoom(true);

    //     var top = Math.max(0, bounds.y);
    //     var left = Math.max(0, bounds.x);

    //     // change top to be normalised value proportional to height of image, not width (as per OSD).
    //     top = 1 / (canvas.getHeight() / parseInt(String(canvas.getWidth() * top)));

    //     // get on-screen pixel sizes.

    //     var viewportWidthPx = containerSize.x;
    //     var viewportHeightPx = containerSize.y;

    //     var imageWidthPx = parseInt(String(viewportWidthPx * zoom));
    //     var ratio = canvas.getWidth() / imageWidthPx;
    //     var imageHeightPx = parseInt(String(canvas.getHeight() / ratio));

    //     var viewportLeftPx = parseInt(String(left * imageWidthPx));
    //     var viewportTopPx = parseInt(String(top * imageHeightPx));

    //     var rect1Left = 0;
    //     var rect1Right = imageWidthPx;
    //     var rect1Top = 0;
    //     var rect1Bottom = imageHeightPx;

    //     var rect2Left = viewportLeftPx;
    //     var rect2Right = viewportLeftPx + viewportWidthPx;
    //     var rect2Top = viewportTopPx;
    //     var rect2Bottom = viewportTopPx + viewportHeightPx;

    //     var sizeWidth = Math.max(0, Math.min(rect1Right, rect2Right) - Math.max(rect1Left, rect2Left));
    //     var sizeHeight = Math.max(0, Math.min(rect1Bottom, rect2Bottom) - Math.max(rect1Top, rect2Top));

    //     // get original image pixel sizes.

    //     var ratio2 = canvas.getWidth() / imageWidthPx;

    //     var regionWidth = parseInt(String(sizeWidth * ratio2));
    //     var regionHeight = parseInt(String(sizeHeight * ratio2));

    //     var regionTop = parseInt(String(canvas.getHeight() * top));
    //     var regionLeft = parseInt(String(canvas.getWidth() * left));

    //     if (regionTop < 0) regionTop = 0;
    //     if (regionLeft < 0) regionLeft = 0;

    //     var dimensions: CroppedImageDimensions = new CroppedImageDimensions();

    //     dimensions.region = new Size(regionWidth, regionHeight);
    //     dimensions.regionPos = new Point(regionLeft, regionTop);
    //     dimensions.size = new Size(sizeWidth, sizeHeight);

    //     return dimensions;
    // }

    getCroppedImageUri(canvas: Manifesto.ICanvas, viewer: any): string {

        if (!viewer) return null;
        if (!viewer.viewport) return null;

        var dimensions: CroppedImageDimensions = this.getCroppedImageDimensions(canvas, viewer);

        // construct uri
        // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg

        var baseUri = this.getImageBaseUri(canvas);
        var id = this.getImageId(canvas);
        var region = dimensions.regionPos.x + "," + dimensions.regionPos.y + "," + dimensions.region.width + "," + dimensions.region.height;
        var size = dimensions.size.width + ',' + dimensions.size.height;
        var rotation = this.getViewerRotation();
        var quality = 'default';
        return String.format(this.iiifImageUriTemplate, baseUri, id, region, size, rotation, quality);
    }

    getConfinedImageDimensions(canvas: Manifesto.ICanvas, width: number): Size {
        var dimensions: Size = new Size(0, 0);
        dimensions.width = width;
        var normWidth = Math.normalise(width, 0, canvas.getWidth());
        dimensions.height = Math.floor(canvas.getHeight() * normWidth);
        return dimensions;
    }

    getConfinedImageUri(canvas: Manifesto.ICanvas, width: number): string {
        var baseUri = this.getImageBaseUri(canvas);

        // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
        var id = this.getImageId(canvas);
        var region = 'full';
        var dimensions = this.getConfinedImageDimensions(canvas, width);
        var size: string = dimensions.width + ',' + dimensions.height;
        var rotation = this.getViewerRotation();
        var quality = 'default';
        var uri = String.format(this.iiifImageUriTemplate, baseUri, id, region, size, rotation, quality);
        return uri;
    }

    getImageId(canvas: Manifesto.ICanvas): string {
        var id = this.getInfoUri(canvas);
        // First trim off info.json, then extract ID:
        id = id.substr(0, id.lastIndexOf("/"));
        return id.substr(id.lastIndexOf("/") + 1);
    }

    getImageBaseUri(canvas: Manifesto.ICanvas): string {
        var uri = this.getInfoUri(canvas);
        // First trim off info.json, then trim off ID....
        uri = uri.substr(0, uri.lastIndexOf("/"));
        return uri.substr(0, uri.lastIndexOf("/"));
    }

    getInfoUri(canvas: Manifesto.ICanvas): string{
        var infoUri: string;

        var images: Manifesto.IAnnotation[] = canvas.getImages();

        if (images && images.length) {
            var firstImage = images[0];
            var resource: Manifesto.IResource = firstImage.getResource();
            var services: Manifesto.IService[] = resource.getServices();

            for (var i = 0; i < services.length; i++) {
                var service: Manifesto.IService = services[i];
                var id = service.id;

                if (!_.endsWith(id, '/')) {
                    id += '/';
                }

                if (manifesto.isImageProfile(service.getProfile())){
                    infoUri = id + 'info.json';
                }
            }
        }

        if (!infoUri){
            // todo: use compiler flag (when available)
            infoUri = (window.DEBUG)? '/src/extensions/uv-seadragon-extension/lib/imageunavailable.json' : 'lib/imageunavailable.json';
        }

        return infoUri;
    }

    getEmbedScript(template: string, width: number, height: number, zoom: string, rotation: number): string{
        var configUri = this.config.uri || '';
        var script = String.format(template, this.getSerializedLocales(), configUri, this.helper.iiifResourceUri, this.helper.collectionIndex, this.helper.manifestIndex, this.helper.sequenceIndex, this.helper.canvasIndex, zoom, rotation, width, height, this.embedScriptUri);
        return script;
    }

    getPrevPageIndex(canvasIndex?: number): number {
        if (_.isUndefined(canvasIndex)) canvasIndex = this.helper.canvasIndex;

        var index;

        if (this.isPagingSettingEnabled()){
            var indices = this.getPagedIndices(canvasIndex);

            if (this.helper.isRightToLeft()){
                index = indices.last() - 1;
            } else {
                index = indices[0] - 1;
            }

        } else {
            index = canvasIndex - 1;
        }

        return index;
    }

    isSearchWithinEnabled(): boolean {
        if (!Utils.Bools.getBool(this.config.options.searchWithinEnabled, false)){
            return false;
        }

        if (!this.helper.getSearchWithinService()) {
            return false;
        }

        return true;
    }

    isPagingSettingEnabled(): boolean {
        if (this.helper.isPagingAvailable()){
            return this.getSettings().pagingEnabled;
        }

        return false;
    }

    getNextPageIndex(canvasIndex?: number): number {
       if (_.isUndefined(canvasIndex)) canvasIndex = this.helper.canvasIndex;
    
       var index;
    
       if (this.isPagingSettingEnabled()){
           var indices = this.getPagedIndices(canvasIndex);
    
           if (this.helper.isRightToLeft()){
               index = indices[0] + 1;
           } else {
               index = indices.last() + 1;
           }
    
       } else {
           index = canvasIndex + 1;
       }
    
       if (index > this.helper.getTotalCanvases() - 1) {
           return -1;
       }
    
       return index;
    }
    
    getAutoCompleteService(): Manifesto.IService {
       var service: Manifesto.IService = this.helper.getSearchWithinService();
       if (!service) return null;
       return service.getService(manifesto.ServiceProfile.autoComplete());
    }

    getAutoCompleteUri(): string{
        var service = this.getAutoCompleteService();
        if (!service) return null;
        return service.id + '?q={0}';
    }

    getSearchWithinServiceUri(): string {
        var service: Manifesto.IService = this.helper.getSearchWithinService();

        if (!service) return null;

        var uri = service.id;
        uri = uri + "?q={0}";
        return uri;
    }

    searchWithin(terms): void {

        var that = this;

        this.doSearchWithin(terms, (results: any) => {
            if (results.resources && results.resources.length) {
                $.publish(Commands.SEARCH_RESULTS, [{terms, results}]);

                // reload current index as it may contain results.
                that.viewPage(that.helper.canvasIndex, true);
            } else {
                that.showMessage(that.config.modules.genericDialogue.content.noMatches, () => {
                    $.publish(Commands.SEARCH_RESULTS_EMPTY);
                });
            }
        });
    }

    doSearchWithin(terms: string, cb: (results: any) => void): void {
        var that = this;

        var searchUri = this.getSearchWithinServiceUri();
        searchUri = String.format(searchUri, terms);

        $.getJSON(searchUri, (results: any) => {
            if (results.resources && results.resources.length) {
                that.parseSearchWithinResults(results);
            }

            cb(results);
        });
    }

    parseSearchWithinResults(results: any): void {
        this.searchResults = [];

        for (var i = 0; i < results.resources.length; i++) {
            var r = results.resources[i];

            var sr: SearchResult = new SearchResult(r, this.helper);

            var match = this.getSearchResultByCanvasIndex(sr.canvasIndex);

            if (match){
                match.addRect(r);
            } else {
                this.searchResults.push(sr);
            }
        }
    }

    getSearchResultByCanvasIndex(canvasIndex: number): SearchResult {
        for (var i = 0; i < this.searchResults.length; i++) {
            var r = this.searchResults[i];
            if (r.canvasIndex === canvasIndex){
                return r;
            }
        }
        return null;
    }

    getPagedIndices(canvasIndex?: number): number[]{
        if (_.isUndefined(canvasIndex)) canvasIndex = this.helper.canvasIndex;

        var indices = [];

        // if it's a continuous manifest, get all resources.
        if (this.helper.isContinuous()){
            indices = _.map(this.helper.getCanvases(), (c: Manifesto.ICanvas, index: number) => {
                return index;
            });
        } else {
            if (!this.isPagingSettingEnabled()) {
                indices.push(this.helper.canvasIndex);
            } else {
                if (this.helper.isFirstCanvas(canvasIndex) || (this.helper.isLastCanvas(canvasIndex) && this.helper.isTotalCanvasesEven())){
                    indices = [canvasIndex];
                } else if (canvasIndex % 2){
                    indices = [canvasIndex, canvasIndex + 1];
                } else {
                    indices = [canvasIndex - 1, canvasIndex];
                }

                if (this.helper.isRightToLeft()){
                    indices = indices.reverse();
                }
            }
        }

        return indices;
    }
}

export = Extension;
