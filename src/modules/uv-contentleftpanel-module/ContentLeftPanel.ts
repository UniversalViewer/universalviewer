import BaseCommands = require("../uv-shared-module/BaseCommands");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import GalleryView = require("./GalleryView");
import IProvider = require("../uv-shared-module/IProvider");
import ISeadragonProvider = require("../../extensions/uv-seadragon-extension/ISeadragonProvider");
import LeftPanel = require("../uv-shared-module/LeftPanel");
import ThumbsView = require("./ThumbsView");
import TreeSortType = require("../../extensions/uv-seadragon-extension/TreeSortType");
import TreeView = require("./TreeView");
import IRange = require("../uv-shared-module/IRange");
import ITreeNode = require("../uv-shared-module/ITreeNode");
import IThumb = require("../uv-shared-module/IThumb");
import MultiSelectState = require("../uv-shared-module/MultiSelectState");
import ICanvas = require("../uv-shared-module/ICanvas");

class ContentLeftPanel extends LeftPanel {

    $galleryView: JQuery;
    $leftOptions: JQuery;
    $multiSelectOptions: JQuery;
    $options: JQuery;
    $rightOptions: JQuery;
    $selectAllButton: JQuery;
    $selectAllButtonCheckbox: JQuery;
    $selectButton: JQuery;
    $sortButtonGroup: JQuery;
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
    isTreeViewOpen: boolean = false;
    isThumbsViewOpen: boolean = false;
    multiSelectState: MultiSelectState;
    thumbsView: ThumbsView;
    treeData: Manifesto.ITreeNode;
    treeView: TreeView;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('contentLeftPanel');

        super.create();

        var that = this;

        $.subscribe(BaseCommands.SETTINGS_CHANGED, () => {
            this.dataBind();
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

        $.subscribe(Commands.ENTER_MULTISELECT_MODE, (s, e) => {

            that._reset();

            that.multiSelectState.enabled = true;

            this._publishMultiSelectStateChange();

            that.setTitle(that.content.selection);

            if (!that.isFullyExpanded){
                that.expandFull();
            } else {
                this._showMultiSelectOptions();
            }

            this.$selectButton.text(e);
        });

        $.subscribe(Commands.EXIT_MULTISELECT_MODE, () => {

            that._reset();

            that.multiSelectState.enabled = false;

            $.publish(Commands.MULTISELECT_CHANGE, [that.multiSelectState]);

            that.setTitle(that.content.title);
            that.$multiSelectOptions.hide();
        });

        $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START, () => {
            if (that.multiSelectState.enabled) {
                $.publish(Commands.EXIT_MULTISELECT_MODE);
            }
        });

        $.subscribe(BaseCommands.LEFTPANEL_EXPAND_FULL_START, () => {
            if (that.multiSelectState.enabled) {
                that._showMultiSelectOptions();
            }
        });

        $.subscribe(Commands.TREE_NODE_MULTISELECTED, (s, node: ITreeNode) => {
            if (node.isRange()){
                this._updateRangeMultiSelectState(node.data, node.multiSelected);
            }
        });

        $.subscribe(Commands.THUMB_MULTISELECTED, (s, thumb: IThumb) => {
            var range: IRange = <IRange>this.provider.getCanvasRange(thumb.data);

            if (range){
                this._updateRangeMultiSelectState(range, thumb.multiSelected);
            }

            this._updateCanvasMultiSelectState(thumb.data, thumb.multiSelected);
        });

        this.$tabs = $('<div class="tabs"></div>');
        this.$main.append(this.$tabs);

        this.$treeButton = $('<a class="index tab">' + this.content.index + '</a>');
        this.$treeButton.prop('title', this.content.index);
        this.$tabs.append(this.$treeButton);

        this.$thumbsButton = $('<a class="thumbs tab">' + this.content.thumbnails + '</a>');
        this.$thumbsButton.prop('title', this.content.thumbnails);
        this.$tabs.append(this.$thumbsButton);

        this.$tabsContent = $('<div class="tabsContent"></div>');
        this.$main.append(this.$tabsContent);

        this.$options = $('<div class="options"></div>');
        this.$tabsContent.append(this.$options);

        this.$leftOptions = $('<div class="left"></div>');
        this.$options.append(this.$leftOptions);

        this.$rightOptions = $('<div class="right"></div>');
        this.$options.append(this.$rightOptions);

        this.$treeViewOptions = $('<div class="treeView"></div>');
        this.$leftOptions.append(this.$treeViewOptions);

        this.$sortByLabel = $('<span class="sort">' + this.content.sortBy + '</span>');
        this.$treeViewOptions.append(this.$sortByLabel);

        this.$sortButtonGroup = $('<div class="btn-group"></div>');
        this.$treeViewOptions.append(this.$sortButtonGroup);

        this.$sortByDateButton = $('<button class="btn">' + this.content.date + '</button>');
        this.$sortButtonGroup.append(this.$sortByDateButton);

        this.$sortByVolumeButton = $('<button class="btn">' + this.content.volume + '</button>');
        this.$sortButtonGroup.append(this.$sortByVolumeButton);

        this.$multiSelectOptions = $('<div class="multiSelect"></div>');
        this.$rightOptions.append(this.$multiSelectOptions);

        this.$selectAllButton = $('<div class="multiSelectAll"><input id="multiSelectAll" type="checkbox" /><label for="multiSelectAll">' + this.content.selectAll + '</label></div>');
        this.$multiSelectOptions.append(this.$selectAllButton);
        this.$selectAllButtonCheckbox = $(this.$selectAllButton.find('input:checkbox'));

        this.$selectButton = $('<a class="btn btn-primary">' + this.content.select + '</a>');
        this.$multiSelectOptions.append(this.$selectButton);

        this.$views = $('<div class="views"></div>');
        this.$tabsContent.append(this.$views);

        this.$treeView = $('<div class="treeView"></div>');
        this.$views.append(this.$treeView);

        this.$thumbsView = $('<div class="thumbsView"></div>');
        this.$views.append(this.$thumbsView);

        this.$galleryView = $('<div class="galleryView"></div>');
        this.$views.append(this.$galleryView);

        this.$multiSelectOptions.hide();

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

        this.$selectAllButton.checkboxButton((checked: boolean) => {
            this._multiSelectAll(checked);
        });

        this.$selectButton.on('click', () => {

            var ids: String[] = _.map(that._getAllSelectedCanvases(), (canvas: ICanvas) => {
                return canvas.id;
            });

            $.publish(Commands.MULTISELECTION_MADE, [ids]);
        });

        this.$expandButton.attr('tabindex', '7');
        this.$collapseButton.attr('tabindex', '7');
        this.$expandFullButton.attr('tabindex', '8');

        this.setTitle(this.content.title);

        this.$sortByVolumeButton.addClass('on');

        var tabOrderConfig: string = this.options.tabOrder;

        if (tabOrderConfig) {
            // sort tabs
            tabOrderConfig = tabOrderConfig.toLowerCase();
            tabOrderConfig = tabOrderConfig.replace(/ /g, "");
            var tabOrder:string[] = tabOrderConfig.split(',');

            if (tabOrder[0] === 'thumbs'){
                this.$treeButton.before(this.$thumbsButton);
                this.$thumbsButton.addClass('first');
            } else {
                this.$treeButton.addClass('first');
            }
        }

        this._reset();
    }

    createTreeView(): void {
        this.treeView = new TreeView(this.$treeView);
        this.treeView.elideCount = this.config.options.elideCount;
        this.treeView.multiSelectState = this.multiSelectState;
        this.dataBindTreeView();
        this.updateTreeViewOptions();
    }

    dataBind(): void {
        this._reset();
        this.dataBindThumbsView();
        this.dataBindTreeView();
        this.dataBindGalleryView();
    }

    private _reset(): void {
        this.multiSelectState = new MultiSelectState();
        this.multiSelectState.ranges = this.provider.getRanges();
        this.multiSelectState.canvases = <ICanvas[]>this.provider.getCurrentSequence().getCanvases();
        //this.multiSelectState.ranges = _.cloneDeep(this.provider.getRanges());
        //this.multiSelectState.canvases = <ICanvas[]>_.cloneDeep(this.provider.getCurrentSequence().getCanvases());
    }

    private _showMultiSelectOptions(): void {
        this.$multiSelectOptions.show();
        this.resize();
    }

    updateTreeViewOptions(): void{
        if (this.isCollection() && this.treeData.nodes.length && !isNaN(this.treeData.nodes[0].navDate.getTime())){
            this.$treeViewOptions.show();
        } else {
            this.$treeViewOptions.hide();
        }
    }

    private _multiSelectAll(selected: boolean): void {
        this._multiSelectRanges(this.multiSelectState.ranges, selected);
        this._multiSelectCanvases(this.multiSelectState.canvases, selected);

        this._publishMultiSelectStateChange();
    }

    private _multiSelectRanges(ranges: IRange[], selected: boolean): void {
        for(var i = 0; i < ranges.length; i++) {
            var range: IRange = ranges[i];
            range.multiSelected = selected;
            var canvases: ICanvas[] = this._getCanvasesByIds(range.getCanvasIds());
            this._multiSelectCanvases(canvases, selected);
        }
    }

    private _multiSelectCanvases(canvases: ICanvas[], selected: boolean): void {
        for(var j = 0; j < canvases.length; j++) {
            var canvas: ICanvas = canvases[j];
            canvas.multiSelected = selected;
        }
    }

    private _getCanvasById(id: string): ICanvas {
        return this.multiSelectState.canvases.en().where(c => c.id === id).first();
    }

    private _getCanvasesByIds(ids: string[]): ICanvas[] {
        var canvases: ICanvas[] = [];

        for (var i = 0; i < ids.length; i++) {
            var id: string = ids[i];
            canvases.push(this._getCanvasById(id));
        }

        return canvases;
    }

    private _updateRangeMultiSelectState(range: IRange, selected: boolean): void {
        var r: IRange = this.multiSelectState.ranges.en().where(r => r.id === range.id).first();
        r.multiSelected = selected;

        var canvases: ICanvas[] = <ICanvas[]>this.provider.getRangeCanvases(r);

        this._multiSelectCanvases(canvases, selected);

        this._publishMultiSelectStateChange();
    }

    private _updateCanvasMultiSelectState(canvas: ICanvas, selected: boolean): void {
        var c: ICanvas = this.multiSelectState.canvases.en().where(c => c.id === canvas.id).first();
        c.multiSelected = selected;
        this._publishMultiSelectStateChange();
    }

    private _publishMultiSelectStateChange(): void {
        this.$selectAllButtonCheckbox.prop('checked', this._allRangesSelected() && this._allCanvasesSelected());
        $.publish(Commands.MULTISELECT_CHANGE, [this.multiSelectState]);
    }

    private _allRangesSelected(): boolean {
        return this._getAllSelectedRanges().length === this.multiSelectState.ranges.length;
    }

    private _getAllSelectedRanges(): IRange[] {
        return this.multiSelectState.ranges.en().where(r => r.multiSelected).toArray();
    }

    private _allCanvasesSelected(): boolean {
        return this._getAllSelectedCanvases().length === this.multiSelectState.canvases.length;
    }

    private _getAllSelectedCanvases(): ICanvas[] {
        return this.multiSelectState.canvases.en().where(c => c.multiSelected).toArray();
    }

    sortByDate(): void {
        this.treeView.rootNode = <ITreeNode>(<ISeadragonProvider>this.provider).getSortedTree(TreeSortType.date);
        this.treeView.dataBind();
        this.selectCurrentTreeNode();
        this.$sortByDateButton.addClass('on');
        this.$sortByVolumeButton.removeClass('on');
        this.resize();
    }

    sortByVolume(): void {
        this.treeView.rootNode = <ITreeNode>(<ISeadragonProvider>this.provider).getSortedTree(TreeSortType.none);
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
        this.treeView.rootNode = <ITreeNode>this.treeData;
        this.treeView.dataBind();
        // ensure tree has current multiselect state
        this._publishMultiSelectStateChange();
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
        this.galleryView.multiSelectState = this.multiSelectState;
        this.dataBindGalleryView();
    }

    dataBindGalleryView(): void{
        if (!this.galleryView) return;
        var width = this.config.options.galleryThumbWidth;
        var height = this.config.options.galleryThumbHeight;
        this.galleryView.thumbs = <IThumb[]>this.provider.getThumbs(width, height);
        this.galleryView.dataBind();
        // ensure gallery has current multiselect state
        this._publishMultiSelectStateChange();
    }

    toggleFinish(): void {
        super.toggleFinish();

        if (this.isUnopened) {

            var treeEnabled = Utils.Bools.GetBool(this.config.options.treeEnabled, true);
            var thumbsEnabled = Utils.Bools.GetBool(this.config.options.thumbsEnabled, true);

            this.treeData = (typeof (<ISeadragonProvider>this.provider).getSortedTree === 'function')
                ? (<ISeadragonProvider>this.provider).getSortedTree(TreeSortType.none)
                : null;

            if (!this.treeData || !this.treeData.nodes.length) {
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
        this.isTreeViewOpen = true;
        this.isThumbsViewOpen = false;

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
        this.isTreeViewOpen = false;
        this.isThumbsViewOpen = true;

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
            var node: Manifesto.ITreeNode;

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
        this.$views.height(this.$tabsContent.height() - this.$options.outerHeight());
    }
}

export = ContentLeftPanel;