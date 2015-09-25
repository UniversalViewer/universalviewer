import BaseCommands = require("../uv-shared-module/BaseCommands");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import GalleryView = require("./GalleryView");
import IProvider = require("../uv-shared-module/IProvider");
import ISeadragonProvider = require("../../extensions/uv-seadragon-extension/ISeadragonProvider");
import LeftPanel = require("../uv-shared-module/LeftPanel");
import ThumbsView = require("./ThumbsView");
import TreeSortType = require("../../extensions/uv-seadragon-extension/TreeSortType");
import TreeView = require("./TreeView");

class TreeViewLeftPanel extends LeftPanel {

    $buttonGroup: JQuery;
    $galleryView: JQuery;
    $options: JQuery;
    $sortByDateButton: JQuery;
    $sortByLabel: JQuery;
    $sortByVolumeButton: JQuery;
    $tabs: JQuery;
    $tabsContent: JQuery;
    $thumbsButton: JQuery;
    $thumbsView: JQuery;
    $treeButton: JQuery;
    $treeView: JQuery;
    $treeViewOptions: JQuery;
    $views: JQuery;
    galleryView: GalleryView;
    thumbsView: ThumbsView;
    treeData: Manifesto.TreeNode;
    treeView: TreeView;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('treeViewLeftPanel');

        super.create();

        $.subscribe(BaseCommands.SETTINGS_CHANGED, () => {
            this.dataBindThumbsView();
            this.dataBindTreeView();
            this.dataBindGalleryView();
        });

        $.subscribe(Commands.GALLERY_THUMB_SELECTED, () => {
            this.collapseFull();
        });

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, index) => {
            if (this.isFullyExpanded){
                this.collapseFull();
            }

            this.selectCurrentTreeNode();
        });

        this.$tabs = $('<div class="tabs"></div>');
        this.$main.append(this.$tabs);

        this.$treeButton = $('<a class="index tab first">' + this.content.index + '</a>');
        this.$treeButton.prop('title', this.content.index);
        this.$tabs.append(this.$treeButton);

        this.$thumbsButton = $('<a class="thumbs tab">' + this.content.thumbnails + '</a>');
        this.$thumbsButton.prop('title', this.content.thumbnails);
        this.$tabs.append(this.$thumbsButton);

        this.$tabsContent = $('<div class="tabsContent"></div>');
        this.$main.append(this.$tabsContent);

        this.$options = $('<div class="options"></div>');
        this.$tabsContent.append(this.$options);

        this.$treeViewOptions = $('<div class="treeView"></div>');
        this.$options.append(this.$treeViewOptions);

        this.$sortByLabel = $('<span class="sort">' + this.content.sortBy + '</span>');
        this.$treeViewOptions.append(this.$sortByLabel);

        this.$buttonGroup = $('<div class="btn-group"></div>');
        this.$treeViewOptions.append(this.$buttonGroup);

        this.$sortByDateButton = $('<button class="btn">' + this.content.date + '</button>');
        this.$buttonGroup.append(this.$sortByDateButton);

        this.$sortByVolumeButton = $('<button class="btn">' + this.content.volume + '</button>');
        this.$buttonGroup.append(this.$sortByVolumeButton);

        this.$views = $('<div class="views"></div>');
        this.$tabsContent.append(this.$views);

        this.$treeView = $('<div class="treeView"></div>');
        this.$views.append(this.$treeView);

        this.$thumbsView = $('<div class="thumbsView"></div>');
        this.$views.append(this.$thumbsView);

        this.$galleryView = $('<div class="galleryView"></div>');
        this.$views.append(this.$galleryView);

        this.$sortByDateButton.on('click', () => {
            this.sortByDate();
        });

        this.$sortByVolumeButton.on('click', () => {
            this.sortByVolume();
        });

        this.$treeViewOptions.hide();

        this.$treeButton.onPressed(() => {
            this.openTreeView();

            $.publish(Commands.OPEN_TREE_VIEW);
        });

        this.$thumbsButton.onPressed(() => {
            this.openThumbsView();

            $.publish(Commands.OPEN_THUMBS_VIEW);
        });

        this.$expandButton.attr('tabindex', '7');
        this.$collapseButton.attr('tabindex', '7');
        this.$expandFullButton.attr('tabindex', '8');

        this.$title.text(this.content.title);
        this.$closedTitle.text(this.content.title);

        this.$sortByVolumeButton.addClass('on');
    }

    createTreeView(): void {
        this.treeView = new TreeView(this.$treeView);
        this.treeView.elideCount = this.config.options.elideCount;
        this.dataBindTreeView();
        this.updateTreeViewOptions();
    }

    updateTreeViewOptions(): void{
        if (this.isCollection() && this.treeData.nodes.length && !isNaN(this.treeData.nodes[0].navDate.getTime())){
            this.$treeViewOptions.show();
        } else {
            this.$treeViewOptions.hide();
        }
    }

    sortByDate(): void {
        this.treeView.rootNode = (<ISeadragonProvider>this.provider).getSortedTree(TreeSortType.date);
        this.treeView.dataBind();
        this.selectCurrentTreeNode();
        this.$sortByDateButton.addClass('on');
        this.$sortByVolumeButton.removeClass('on');
        this.resize();
    }

    sortByVolume(): void {
        this.treeView.rootNode = (<ISeadragonProvider>this.provider).getSortedTree(TreeSortType.none);
        this.treeView.dataBind();
        this.selectCurrentTreeNode();
        this.$sortByDateButton.removeClass('on');
        this.$sortByVolumeButton.addClass('on');
        this.resize();
    }

    isCollection(): boolean {
        return this.treeData.data.type === manifesto.TreeNodeType.collection().toString();
    }

    dataBindTreeView(): void{
        if (!this.treeView) return;
        this.treeView.rootNode = this.treeData;
        this.treeView.dataBind();
    }

    createThumbsView(): void {
        this.thumbsView = new ThumbsView(this.$thumbsView);
        this.dataBindThumbsView();
    }

    dataBindThumbsView(): void{
        if (!this.thumbsView) return;
        var width, height;

        var viewingDirection = this.provider.getViewingDirection().toString();

        if (viewingDirection === manifesto.ViewingDirection.topToBottom().toString() || viewingDirection === manifesto.ViewingDirection.bottomToTop().toString()){
            width = this.config.options.oneColThumbWidth;
            height = this.config.options.oneColThumbHeight;
        } else {
            width = this.config.options.twoColThumbWidth;
            height = this.config.options.twoColThumbHeight;
        }

        this.thumbsView.thumbs = this.provider.getThumbs(width, height);
        this.thumbsView.dataBind();
    }

    createGalleryView(): void {
        this.galleryView = new GalleryView(this.$galleryView);
        this.dataBindGalleryView();
    }

    dataBindGalleryView(): void{
        if (!this.galleryView) return;
        var width = this.config.options.galleryThumbWidth;
        var height = this.config.options.galleryThumbHeight;
        this.galleryView.thumbs = this.provider.getThumbs(width, height);
        this.galleryView.dataBind();
    }

    toggleFinish(): void {
        super.toggleFinish();

        if (this.isUnopened) {

            var treeEnabled = Utils.Bools.GetBool(this.config.options.treeEnabled, true);
            var thumbsEnabled = Utils.Bools.GetBool(this.config.options.thumbsEnabled, true);

            this.treeData = (<ISeadragonProvider>this.provider).getSortedTree(TreeSortType.none);

            if (!this.treeData.nodes.length) {
                treeEnabled = false;
            }

            // hide the tabs if either tree or thumbs are disabled.
            if (!treeEnabled || !thumbsEnabled) this.$tabs.hide();

            if (thumbsEnabled && (<IProvider>this.provider).defaultToThumbsView()){
                this.openThumbsView();
            } else if (treeEnabled){
                this.openTreeView();
            }
        }

        if (this.isExpanded){
            this.$treeButton.attr('tabindex', '9');
            this.$thumbsButton.attr('tabindex', '10');
        } else {
            this.$treeButton.attr('tabindex', '');
            this.$thumbsButton.attr('tabindex', '');
        }
    }

    expandFullStart(): void {
        super.expandFullStart();
        $.publish(BaseCommands.LEFTPANEL_EXPAND_FULL_START);
    }

    expandFullFinish(): void {
        super.expandFullFinish();

        if (this.$treeButton.hasClass('on')){
            this.openTreeView();
        } else if (this.$thumbsButton.hasClass('on')){
            this.openThumbsView();
        }

        $.publish(BaseCommands.LEFTPANEL_EXPAND_FULL_FINISH);
    }

    collapseFullStart(): void {
        super.collapseFullStart();

        $.publish(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START);
    }

    collapseFullFinish(): void {
        super.collapseFullFinish();

        // todo: write a more generic tabs system with base tab class.
        // thumbsView may not necessarily have been created yet.
        // replace thumbsView with galleryView.
        if (this.$thumbsButton.hasClass('on')){
            this.openThumbsView();
        }

        $.publish(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH);
    }

    openTreeView(): void {
        if (!this.treeView) {
            this.createTreeView();
        }

        this.$treeButton.addClass('on');
        this.$thumbsButton.removeClass('on');

        this.treeView.show();

        setTimeout(() => {
            var range: Manifesto.IRange = this.provider.getCanvasRange(this.provider.getCurrentCanvas());
            if (this.treeView && range && range.treeNode) this.treeView.selectNode(range.treeNode);
        }, 1);

        if (this.thumbsView) this.thumbsView.hide();
        if (this.galleryView) this.galleryView.hide();

        this.updateTreeViewOptions();
        this.selectCurrentTreeNode();

        this.resize();
        this.treeView.resize();
    }

    openThumbsView(): void {
        if (!this.thumbsView) {
            this.createThumbsView();
        }

        if (this.isFullyExpanded && !this.galleryView) {
            this.createGalleryView();
        }

        this.$treeButton.removeClass('on');
        this.$thumbsButton.addClass('on');

        if (this.treeView) this.treeView.hide();

        this.$treeViewOptions.hide();

        this.resize();

        if (this.isFullyExpanded){
            this.thumbsView.hide();
            if (this.galleryView) this.galleryView.show();
            if (this.galleryView) this.galleryView.resize();
        } else {
            if (this.galleryView) this.galleryView.hide();
            this.thumbsView.show();
            this.thumbsView.resize();
        }
    }

    selectCurrentTreeNode(): void{
        if (this.treeView) {

            var id: string;
            var node: Manifesto.TreeNode;

            // try finding a range first
            var range: Manifesto.IRange = this.provider.getCanvasRange(this.provider.getCurrentCanvas());

            if (range){
                id = range.treeNode.id;
                node = this.treeView.getNodeById(id);
            }

            // use manifest root node
            if (!node){
                id = this.provider.manifest.treeRoot.id;
                node = this.treeView.getNodeById(id);
            }

            if (node){
                this.treeView.selectNode(node);
            }
        }
    }

    resize(): void {
        super.resize();

        this.$tabsContent.height(this.$main.height() - (this.$tabs.is(':visible') ? this.$tabs.height() : 0) - this.$tabsContent.verticalPadding());
        this.$views.height(this.$tabsContent.height() - this.$options.height());
    }
}

export = TreeViewLeftPanel;