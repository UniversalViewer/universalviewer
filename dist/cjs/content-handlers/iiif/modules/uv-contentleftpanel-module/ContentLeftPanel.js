"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentLeftPanel = void 0;
var $ = window.$;
var react_1 = require("react");
var client_1 = require("react-dom/client");
var ThumbsView_1 = __importDefault(require("./ThumbsView"));
var ViewingDirectionEnum = require("@iiif/vocabulary/dist-commonjs/")
    .ViewingDirection;
// const ViewingHintEnum = require("@iiif/vocabulary/dist-commonjs/").ViewingHint;
var utils_1 = require("@edsilv/utils");
var dist_commonjs_1 = require("@iiif/vocabulary/dist-commonjs/");
var IIIFEvents_1 = require("../../IIIFEvents");
var GalleryView_1 = require("./GalleryView");
var LeftPanel_1 = require("../uv-shared-module/LeftPanel");
var Mode_1 = require("../../extensions/uv-openseadragon-extension/Mode");
var TreeView_1 = require("./TreeView");
var manifesto_js_1 = require("manifesto.js");
var manifold_1 = require("@iiif/manifold");
var Utils_1 = require("../../../../Utils");
var ContentLeftPanel = /** @class */ (function (_super) {
    __extends(ContentLeftPanel, _super);
    function ContentLeftPanel($element) {
        var _this = _super.call(this, $element) || this;
        _this.expandFullEnabled = false;
        _this.isThumbsViewOpen = false;
        _this.isTreeViewOpen = false;
        _this.treeSortType = manifold_1.TreeSortType.NONE;
        return _this;
    }
    ContentLeftPanel.prototype.create = function () {
        var _this = this;
        this.setConfig("contentLeftPanel");
        _super.prototype.create.call(this);
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.SETTINGS_CHANGE, function () {
            _this.render();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function () {
            _this.render();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.GALLERY_THUMB_SELECTED, function () {
            _this.collapseFull();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.METRIC_CHANGE, function () {
            if (!_this.extension.isDesktopMetric()) {
                if (_this.isFullyExpanded) {
                    _this.collapseFull();
                }
            }
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.ANNOTATIONS, function () {
            _this.renderThumbs();
            _this.renderGallery();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.ANNOTATIONS_CLEARED, function () {
            _this.renderThumbs();
            _this.renderGallery();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.ANNOTATIONS_EMPTY, function () {
            _this.renderThumbs();
            _this.renderGallery();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function () {
            if (_this.isFullyExpanded) {
                _this.collapseFull();
            }
            _this.selectCurrentTreeNode();
            _this.updateTreeTabBySelection();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.RANGE_CHANGE, function () {
            if (_this.isFullyExpanded) {
                _this.collapseFull();
            }
            _this.selectCurrentTreeNode();
            _this.updateTreeTabBySelection();
        });
        // this.extensionHost.subscribe(
        //   OpenSeadragonExtensionEvents.PAGING_TOGGLED,
        //   (_paged: boolean) => {
        //     this.renderThumbs();
        //   }
        // );
        this.$tabs = $('<div class="tabs"></div>');
        this.$main.append(this.$tabs);
        this.$treeButton = $('<a class="index tab" tabindex="0">' + this.content.index + "</a>");
        this.$tabs.append(this.$treeButton);
        this.$thumbsButton = $('<a class="thumbs tab" tabindex="0">' + this.content.thumbnails + "</a>");
        this.$tabs.append(this.$thumbsButton);
        this.$tabsContent = $('<div class="tabsContent"></div>');
        this.$main.append(this.$tabsContent);
        this.$options = $('<div class="options"></div>');
        this.$tabsContent.append(this.$options);
        this.$topOptions = $('<div class="top"></div>');
        this.$options.append(this.$topOptions);
        this.$treeSelect = $('<select aria-label="' + this.content.manifestRanges + '"></select>');
        this.$topOptions.append(this.$treeSelect);
        this.$bottomOptions = $('<div class="bottom"></div>');
        this.$options.append(this.$bottomOptions);
        this.$leftOptions = $('<div class="left"></div>');
        this.$bottomOptions.append(this.$leftOptions);
        this.$rightOptions = $('<div class="right"></div>');
        this.$bottomOptions.append(this.$rightOptions);
        this.$treeViewOptions = $('<div class="treeView"></div>');
        this.$leftOptions.append(this.$treeViewOptions);
        this.$sortByLabel = $('<span class="sort">' + this.content.sortBy + "</span>");
        this.$treeViewOptions.append(this.$sortByLabel);
        this.$sortButtonGroup = $('<div class="btn-group"></div>');
        this.$treeViewOptions.append(this.$sortButtonGroup);
        this.$sortByDateButton = $('<button class="btn" tabindex="0">' + this.content.date + "</button>");
        this.$sortButtonGroup.append(this.$sortByDateButton);
        this.$sortByVolumeButton = $('<button class="btn" tabindex="0">' + this.content.volume + "</button>");
        this.$sortButtonGroup.append(this.$sortByVolumeButton);
        this.$views = $('<div class="views"></div>');
        this.$tabsContent.append(this.$views);
        this.$treeView = $('<div class="treeView"></div>');
        this.$views.append(this.$treeView);
        this.$thumbsView = $('<div class="thumbsView" tabindex="-1"></div>');
        this.$views.append(this.$thumbsView);
        this.$galleryView = $('<div class="galleryView"></div>');
        this.$views.append(this.$galleryView);
        this.$treeSelect.hide();
        this.$treeSelect.change(function () {
            _this.renderTree();
            _this.selectCurrentTreeNode();
            _this.updateTreeTabBySelection();
        });
        this.$sortByDateButton.on("click", function () {
            _this.sortByDate();
        });
        this.$sortByVolumeButton.on("click", function () {
            _this.sortByVolume();
        });
        this.$treeViewOptions.hide();
        this.onAccessibleClick(this.$treeButton, function () {
            _this.openTreeView();
        });
        this.onAccessibleClick(this.$thumbsButton, function () {
            _this.openThumbsView();
        });
        this.setTitle(this.content.title);
        this.$sortByVolumeButton.addClass("on");
        var tabOrderConfig = this.options.tabOrder;
        if (tabOrderConfig) {
            // sort tabs
            tabOrderConfig = tabOrderConfig.toLowerCase();
            tabOrderConfig = tabOrderConfig.replace(/ /g, "");
            var tabOrder = tabOrderConfig.split(",");
            if (tabOrder[0] === "thumbs") {
                this.$treeButton.before(this.$thumbsButton);
                this.$thumbsButton.addClass("first");
            }
            else {
                this.$treeButton.addClass("first");
            }
        }
    };
    // renderThumbs({ paged }: { paged: boolean }): void {
    //   this.thumbsRoot.render(
    //     createElement(ThumbsViewReact, {
    //       paged,
    //     })
    //   );
    // }
    ContentLeftPanel.prototype.createTreeView = function () {
        this.treeView = new TreeView_1.TreeView(this.$treeView);
        this.treeView.treeData = this.getTreeData();
        this.treeView.setup();
        this.renderTree();
        // populate the tree select drop down when there are multiple top-level ranges
        var topRanges = this.extension.helper.getTopRanges();
        if (topRanges.length > 1) {
            for (var i = 0; i < topRanges.length; i++) {
                var range = topRanges[i];
                this.$treeSelect.append('<option value="' +
                    range.id +
                    '">' +
                    manifesto_js_1.LanguageMap.getValue(range.getLabel()) +
                    "</option>");
            }
        }
        this.updateTreeViewOptions();
    };
    ContentLeftPanel.prototype.render = function () {
        this.renderThumbs();
        this.renderTree();
        this.renderGallery();
    };
    ContentLeftPanel.prototype.updateTreeViewOptions = function () {
        var treeData = this.getTree();
        if (!treeData) {
            return;
        }
        if (this.isCollection() &&
            this.extension.helper.treeHasNavDates(treeData)) {
            this.$treeViewOptions.show();
        }
        else {
            this.$treeViewOptions.hide();
        }
        if (this.$treeSelect.find("option").length) {
            this.$treeSelect.show();
        }
        else {
            this.$treeSelect.hide();
        }
    };
    ContentLeftPanel.prototype.sortByDate = function () {
        this.treeSortType = manifold_1.TreeSortType.DATE;
        this.treeView.treeData = this.getTreeData();
        this.treeView.databind();
        this.selectCurrentTreeNode();
        this.$sortByDateButton.addClass("on");
        this.$sortByVolumeButton.removeClass("on");
        this.resize();
    };
    ContentLeftPanel.prototype.sortByVolume = function () {
        this.treeSortType = manifold_1.TreeSortType.NONE;
        this.treeView.treeData = this.getTreeData();
        this.treeView.databind();
        this.selectCurrentTreeNode();
        this.$sortByDateButton.removeClass("on");
        this.$sortByVolumeButton.addClass("on");
        this.resize();
    };
    ContentLeftPanel.prototype.isCollection = function () {
        var treeData = this.getTree();
        if (treeData) {
            return treeData.data.type === manifesto_js_1.TreeNodeType.COLLECTION;
        }
        throw new Error("Tree not available");
    };
    ContentLeftPanel.prototype.renderTree = function () {
        if (!this.treeView)
            return;
        this.treeView.treeData = this.getTreeData();
        this.treeView.databind();
        this.selectCurrentTreeNode();
    };
    ContentLeftPanel.prototype.getTreeData = function () {
        return {
            autoExpand: this._isTreeAutoExpanded(),
            branchNodesExpandOnClick: utils_1.Bools.getBool(this.config.options.branchNodesExpandOnClick, true),
            branchNodesSelectable: utils_1.Bools.getBool(this.config.options.branchNodesSelectable, false),
            helper: this.extension.helper,
            topRangeIndex: this.getSelectedTopRangeIndex(),
            treeSortType: this.treeSortType,
        };
    };
    ContentLeftPanel.prototype._isTreeAutoExpanded = function () {
        var autoExpandTreeEnabled = utils_1.Bools.getBool(this.config.options.autoExpandTreeEnabled, false);
        var autoExpandTreeIfFewerThan = this.config.options.autoExpandTreeIfFewerThan || 0;
        if (autoExpandTreeEnabled) {
            // get total number of tree nodes
            var flatTree = this.extension.helper.getFlattenedTree();
            if (flatTree && flatTree.length < autoExpandTreeIfFewerThan) {
                return true;
            }
        }
        return false;
    };
    ContentLeftPanel.prototype.updateTreeTabByCanvasIndex = function () {
        // update tab to current top range label (if there is one)
        var topRanges = this.extension.helper.getTopRanges();
        if (topRanges.length > 1) {
            var index = this.getCurrentCanvasTopRangeIndex();
            if (index === -1) {
                return;
            }
            var currentRange = topRanges[index];
            this.setTreeTabTitle(manifesto_js_1.LanguageMap.getValue(currentRange.getLabel()));
        }
        else {
            this.setTreeTabTitle(this.content.index);
        }
    };
    ContentLeftPanel.prototype.setTreeTabTitle = function (title) {
        this.$treeButton.text(title);
    };
    ContentLeftPanel.prototype.updateTreeTabBySelection = function () {
        var title = null;
        var topRanges = this.extension.helper.getTopRanges();
        if (topRanges.length > 1) {
            if (this.treeView) {
                title = this.getSelectedTree().text();
            }
            else {
                title = manifesto_js_1.LanguageMap.getValue(topRanges[0].getLabel());
            }
        }
        if (title) {
            this.setTreeTabTitle(title);
        }
        else {
            this.setTreeTabTitle(this.content.index);
        }
    };
    ContentLeftPanel.prototype.getViewingHint = function () {
        return this.extension.helper.getViewingHint();
    };
    ContentLeftPanel.prototype.getViewingDirection = function () {
        return this.extension.helper.getViewingDirection();
    };
    ContentLeftPanel.prototype.createThumbsRoot = function () {
        if (!this.thumbsRoot) {
            this.thumbsRoot = (0, client_1.createRoot)(this.$thumbsView[0]);
        }
        this.renderThumbs();
    };
    ContentLeftPanel.prototype.renderThumbs = function () {
        var _this = this;
        if (!this.thumbsRoot)
            return;
        // let width: number;
        // let height: number;
        // const viewingHint: ViewingHint | null = this.getViewingHint();
        var viewingDirection = this.getViewingDirection();
        // if (
        //   viewingDirection &&
        //   (viewingDirection === ViewingDirectionEnum.LEFT_TO_RIGHT ||
        //     viewingDirection === ViewingDirectionEnum.RIGHT_TO_LEFT)
        // ) {
        //   width = this.config.options.twoColThumbWidth;
        //   height = this.config.options.twoColThumbHeight;
        // } else if (viewingHint && viewingHint === ViewingHintEnum.PAGED) {
        //   width = this.config.options.twoColThumbWidth;
        //   height = this.config.options.twoColThumbHeight;
        // } else {
        //   width = this.config.options.oneColThumbWidth;
        //   height = this.config.options.oneColThumbHeight;
        // }
        var thumbs = (this.extension.helper.getThumbs(90)
        // this.extension.helper.getThumbs(width, height)
        );
        if (viewingDirection &&
            viewingDirection === ViewingDirectionEnum.BOTTOM_TO_TOP) {
            thumbs.reverse();
        }
        // add a search result icon for pages with results
        var searchResults = (this.extension).annotations;
        if (searchResults && searchResults.length) {
            var _loop_1 = function (i) {
                var searchResult = searchResults[i];
                // find the thumb with the same canvasIndex and add the searchResult
                var thumb = thumbs.filter(function (t) { return t.index === searchResult.canvasIndex; })[0];
                if (thumb) {
                    // clone the data so searchResults isn't persisted on the canvas.
                    var data = Object.assign({}, thumb.data);
                    data.searchResults = searchResult.rects.length;
                    thumb.data = data;
                }
            };
            for (var i = 0; i < searchResults.length; i++) {
                _loop_1(i);
            }
        }
        var paged = (!!this.extension.getSettings().pagingEnabled && this.extension.helper.isPaged());
        var selectedIndices = this.extension.getPagedIndices(this.extension.helper.canvasIndex);
        // console.log("selectedIndeces", selectedIndices);
        this.thumbsRoot.render((0, react_1.createElement)(ThumbsView_1.default, {
            thumbs: thumbs,
            paged: paged,
            viewingDirection: viewingDirection || dist_commonjs_1.ViewingDirection.LEFT_TO_RIGHT,
            selected: selectedIndices,
            onClick: function (thumb) {
                _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.THUMB_SELECTED, thumb);
            },
        }));
    };
    ContentLeftPanel.prototype.createGalleryView = function () {
        this.galleryView = new GalleryView_1.GalleryView(this.$galleryView);
        this.galleryView.galleryData = this.getGalleryData();
        this.galleryView.setup();
        this.renderGallery();
    };
    ContentLeftPanel.prototype.renderGallery = function () {
        if (!this.galleryView)
            return;
        this.galleryView.galleryData = this.getGalleryData();
        this.galleryView.databind();
    };
    ContentLeftPanel.prototype.getGalleryData = function () {
        return {
            helper: this.extension.helper,
            chunkedResizingThreshold: this.config.options
                .galleryThumbChunkedResizingThreshold,
            content: this.config.content,
            debug: false,
            imageFadeInDuration: 300,
            initialZoom: 6,
            minLabelWidth: 20,
            pageModeEnabled: this.isPageModeEnabled(),
            scrollStopDuration: 100,
            searchResults: this.extension.annotations,
            sizingEnabled: true,
            thumbHeight: this.config.options.galleryThumbHeight,
            thumbLoadPadding: this.config.options.galleryThumbLoadPadding,
            thumbWidth: this.config.options.galleryThumbWidth,
            viewingDirection: this.getViewingDirection(),
        };
    };
    ContentLeftPanel.prototype.isPageModeEnabled = function () {
        // todo: checks if the panel is being used in the openseadragon extension.
        // pass a `isPageModeEnabled` function to the panel's constructor instead?
        if (typeof this.extension.getMode === "function") {
            return (utils_1.Bools.getBool(this.config.options.pageModeEnabled, true) &&
                this.extension.getMode().toString() ===
                    Mode_1.Mode.page.toString());
        }
        return utils_1.Bools.getBool(this.config.options.pageModeEnabled, true);
    };
    ContentLeftPanel.prototype.getSelectedTree = function () {
        return this.$treeSelect.find(":selected");
    };
    ContentLeftPanel.prototype.getSelectedTopRangeIndex = function () {
        var topRangeIndex = this.getSelectedTree().index();
        if (topRangeIndex === -1) {
            topRangeIndex = 0;
        }
        return topRangeIndex;
    };
    ContentLeftPanel.prototype.getTree = function () {
        var topRangeIndex = this.getSelectedTopRangeIndex();
        return this.extension.helper.getTree(topRangeIndex, manifold_1.TreeSortType.NONE);
    };
    ContentLeftPanel.prototype.toggleFinish = function () {
        _super.prototype.toggleFinish.call(this);
        if (this.isUnopened) {
            var treeEnabled = utils_1.Bools.getBool(this.config.options.treeEnabled, true);
            var thumbsEnabled = utils_1.Bools.getBool(this.config.options.thumbsEnabled, true);
            var treeData = this.getTree();
            if (!treeData || !treeData.nodes.length) {
                treeEnabled = false;
            }
            // hide the tabs if either tree or thumbs are disabled
            if (!treeEnabled || !thumbsEnabled)
                this.$tabs.hide();
            if (thumbsEnabled && this.defaultToThumbsView()) {
                this.openThumbsView();
            }
            else if (treeEnabled) {
                this.openTreeView();
            }
        }
    };
    ContentLeftPanel.prototype.defaultToThumbsView = function () {
        var defaultToTreeEnabled = utils_1.Bools.getBool(this.config.options.defaultToTreeEnabled, false);
        var defaultToTreeIfGreaterThan = this.config.options.defaultToTreeIfGreaterThan || 0;
        var treeData = this.getTree();
        if (defaultToTreeEnabled) {
            if (treeData && treeData.nodes.length > defaultToTreeIfGreaterThan) {
                return false;
            }
        }
        return true;
    };
    ContentLeftPanel.prototype.expandFullStart = function () {
        _super.prototype.expandFullStart.call(this);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LEFTPANEL_EXPAND_FULL_START);
    };
    ContentLeftPanel.prototype.expandFullFinish = function () {
        _super.prototype.expandFullFinish.call(this);
        if (this.$treeButton.hasClass("on")) {
            this.openTreeView();
        }
        else if (this.$thumbsButton.hasClass("on")) {
            this.openThumbsView();
        }
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LEFTPANEL_EXPAND_FULL_FINISH);
    };
    ContentLeftPanel.prototype.collapseFullStart = function () {
        _super.prototype.collapseFullStart.call(this);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LEFTPANEL_COLLAPSE_FULL_START);
    };
    ContentLeftPanel.prototype.collapseFullFinish = function () {
        _super.prototype.collapseFullFinish.call(this);
        // todo: write a more generic tabs system with base tab class.
        // thumbsView may not necessarily have been created yet.
        // replace thumbsView with galleryView.
        if (this.$thumbsButton.hasClass("on")) {
            this.openThumbsView();
        }
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
    };
    ContentLeftPanel.prototype.openTreeView = function () {
        this.isTreeViewOpen = true;
        this.isThumbsViewOpen = false;
        if (!this.treeView) {
            this.createTreeView();
        }
        this.$treeButton.addClass("on");
        this.$thumbsButton.removeClass("on");
        this.treeView.show();
        if (this.$thumbsView)
            this.$thumbsView.hide();
        if (this.galleryView)
            this.galleryView.hide();
        this.updateTreeViewOptions();
        this.selectCurrentTreeNode();
        this.resize();
        this.treeView.resize();
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.OPEN_TREE_VIEW);
    };
    ContentLeftPanel.prototype.openThumbsView = function () {
        this.isTreeViewOpen = false;
        this.isThumbsViewOpen = true;
        // if (!this.$thumbsView) {
        this.createThumbsRoot();
        // }
        if (this.isFullyExpanded && !this.galleryView) {
            this.createGalleryView();
        }
        this.$treeButton.removeClass("on");
        this.$thumbsButton.addClass("on");
        if (this.treeView)
            this.treeView.hide();
        this.$treeSelect.hide();
        this.$treeViewOptions.hide();
        this.resize();
        if (this.isFullyExpanded) {
            this.$thumbsView.hide();
            if (this.galleryView)
                this.galleryView.show();
            if (this.galleryView)
                this.galleryView.resize();
        }
        else {
            if (this.galleryView)
                this.galleryView.hide();
            this.$thumbsView.show();
            this.$thumbsView.resize();
        }
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.OPEN_THUMBS_VIEW);
    };
    ContentLeftPanel.prototype.selectTopRangeIndex = function (index) {
        this.$treeSelect.prop("selectedIndex", index);
    };
    ContentLeftPanel.prototype.getCurrentCanvasTopRangeIndex = function () {
        var topRangeIndex = -1;
        var range = this.extension.getCurrentCanvasRange();
        if (range) {
            topRangeIndex = Number(range.path.split("/")[0]);
        }
        return topRangeIndex;
    };
    ContentLeftPanel.prototype.selectCurrentTreeNode = function () {
        var _a;
        // todo: merge selectCurrentTreeNodeByCanvas and selectCurrentTreeNodeByRange
        // the openseadragon extension should keep track of the current range instead of using canvas index
        if (((_a = this.extension.type) === null || _a === void 0 ? void 0 : _a.name) === "uv-openseadragon-extension") {
            this.selectCurrentTreeNodeByCanvas();
        }
        else {
            this.selectCurrentTreeNodeByRange();
        }
    };
    ContentLeftPanel.prototype.selectCurrentTreeNodeByRange = function () {
        if (this.treeView) {
            var range = this.extension.helper.getCurrentRange();
            var node = null;
            if (range && range.treeNode) {
                node = this.treeView.getNodeById(range.treeNode.id);
            }
            if (node) {
                this.treeView.selectNode(node);
            }
            else {
                this.selectTreeNodeByManifest();
            }
        }
    };
    ContentLeftPanel.prototype.selectCurrentTreeNodeByCanvas = function () {
        if (this.treeView) {
            var node = null;
            var currentCanvasTopRangeIndex = this.getCurrentCanvasTopRangeIndex();
            var selectedTopRangeIndex = this.getSelectedTopRangeIndex();
            var usingCorrectTree = currentCanvasTopRangeIndex === selectedTopRangeIndex;
            var range = null;
            if (currentCanvasTopRangeIndex !== -1) {
                range = this.extension.getCurrentCanvasRange();
                //range = this.extension.helper.getCurrentRange();
                if (range && range.treeNode) {
                    node = this.treeView.getNodeById(range.treeNode.id);
                }
            }
            // use manifest root node
            // if (!node){
            //     id = this.extension.helper.manifest.defaultTree.id;
            //     node = this.treeView.getNodeById(id);
            // }
            if (node && usingCorrectTree) {
                this.treeView.selectNode(node);
            }
            else {
                range = this.extension.helper.getCurrentRange();
                if (range && range.treeNode) {
                    node = this.treeView.getNodeById(range.treeNode.id);
                }
                if (node) {
                    this.treeView.selectNode(node);
                }
                else {
                    this.selectTreeNodeByManifest();
                }
            }
        }
    };
    // fall through to this is there's no current range or canvas
    ContentLeftPanel.prototype.selectTreeNodeByManifest = function () {
        var _this = this;
        var collectionIndex = this.extension.helper.collectionIndex;
        var manifestIndex = this.extension.helper.manifestIndex;
        var allNodes = this.treeView.getAllNodes();
        var nodeFound = false;
        allNodes.map(function (node) {
            if (node.isCollection() && node.data.index === collectionIndex) {
                _this.treeView.selectNode(node);
                _this.treeView.expandNode(node, true);
                nodeFound = true;
            }
            if (node.isManifest() && node.data.index === manifestIndex) {
                _this.treeView.selectNode(node);
                nodeFound = true;
            }
        });
        if (!nodeFound) {
            this.treeView.deselectCurrentNode();
        }
    };
    ContentLeftPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        this.$tabsContent.height(this.$main.height() -
            ((0, Utils_1.isVisible)(this.$tabs) ? this.$tabs.height() : 0) -
            this.$tabsContent.verticalPadding());
        this.$views.height(this.$tabsContent.height() - this.$options.outerHeight());
    };
    return ContentLeftPanel;
}(LeftPanel_1.LeftPanel));
exports.ContentLeftPanel = ContentLeftPanel;
//# sourceMappingURL=ContentLeftPanel.js.map