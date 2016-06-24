import BaseCommands = require("../uv-shared-module/BaseCommands");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import GalleryView = require("./GalleryView");
import ICanvas = Manifold.ICanvas;
import IRange = Manifold.IRange;
import IThumb = Manifold.IThumb;
import ITreeNode = Manifold.ITreeNode;
import LeftPanel = require("../uv-shared-module/LeftPanel");
import MultiSelectState = Manifold.MultiSelectState;
import ThumbsView = require("./ThumbsView");
import TreeSortType = Manifold.TreeSortType;
import TreeView = require("./TreeView");

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
            this.databind();
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

            that.multiSelectState.setEnabled(true);

            that.setTitle(that.content.selection);

            if (!that.isFullyExpanded){
                that.expandFull();
            } else {
                that._showMultiSelectOptions();
            }

            that.$selectButton.text(e);

            that.updateMultiSelectState();
        });

        $.subscribe(Commands.EXIT_MULTISELECT_MODE, () => {

            that.multiSelectState.setEnabled(false);

            $.publish(Commands.MULTISELECT_CHANGE, [that.multiSelectState]);

            that.setTitle(that.content.title);
            that.$multiSelectOptions.hide();

            that.updateMultiSelectState();
        });

        $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START, () => {
            if (that.multiSelectState.isEnabled) {
                $.publish(Commands.EXIT_MULTISELECT_MODE);
            }
        });

        $.subscribe(BaseCommands.LEFTPANEL_EXPAND_FULL_START, () => {
            if (that.multiSelectState.isEnabled) {
                that._showMultiSelectOptions();
            }
        });

        $.subscribe(Commands.TREE_NODE_MULTISELECTED, (s, node: ITreeNode) => {
            if (node.isRange()){
                this.multiSelectState.selectRange(<IRange>node.data, node.multiSelected);                    
                //console.log('multi-selected: ' + node.label);                    
                this.updateMultiSelectState();
            }
        });

        $.subscribe(Commands.THUMB_MULTISELECTED, (s, thumb: IThumb) => {
            var range: IRange = <IRange>this.extension.helper.getCanvasRange(thumb.data);

            if (range){
                this.multiSelectState.selectRange(<IRange>range, thumb.multiSelected);
            } else {
                this.multiSelectState.selectCanvas(<ICanvas>thumb.data, thumb.multiSelected);
            }

            this.updateMultiSelectState();
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
            if (checked) {
                this.multiSelectState.selectAll(true);
            } else {
                this.multiSelectState.selectAll(false);
            }
  
            this.updateMultiSelectState();
        });
        
        this.$selectButton.on('click', () => {

            var ids: String[] = _.map(this.multiSelectState.getAllSelectedCanvases(), (canvas: ICanvas) => {
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

        this.multiSelectState = this.extension.helper.getMultiSelectState();
    }

    createTreeView(): void {
        this.treeView = new TreeView(this.$treeView);
        this.databindTreeView();
        this.updateTreeViewOptions();
    }

    databind(): void {
        this.databindThumbsView();
        this.databindTreeView();
        this.databindGalleryView();
    }

    private _showMultiSelectOptions(): void {
        this.$multiSelectOptions.show();
        this.resize();
    }

    updateTreeViewOptions(): void {
        if (this.isCollection() && this.extension.helper.treeHasNavDates(<Manifold.ITreeNode>this.treeData)){
            this.$treeViewOptions.show();
        } else {
            this.$treeViewOptions.hide();
        }
    }

    updateMultiSelectState(): void {
        this.$selectAllButtonCheckbox.prop('checked', this.multiSelectState.allRangesSelected() && this.multiSelectState.allCanvasesSelected());
        $.publish(Commands.MULTISELECT_CHANGE, [this.multiSelectState]);
    }

    sortByDate(): void {
        this.treeView.rootNode = this.extension.helper.getTree(manifold.TreeSortType.date());
        this.treeView.databind();
        this.selectCurrentTreeNode();
        this.$sortByDateButton.addClass('on');
        this.$sortByVolumeButton.removeClass('on');
        this.resize();
    }

    sortByVolume(): void {
        this.treeView.rootNode = this.extension.helper.getTree(manifold.TreeSortType.none());
        this.treeView.databind();
        this.selectCurrentTreeNode();
        this.$sortByDateButton.removeClass('on');
        this.$sortByVolumeButton.addClass('on');
        this.resize();
    }

    isCollection(): boolean {
        return this.treeData.data.type === manifesto.TreeNodeType.collection().toString();
    }

    databindTreeView(): void{
        if (!this.treeView) return;
        this.treeView.rootNode = <ITreeNode>this.treeData;
        this.treeView.databind();
        // ensure tree has current multiselect state
        this.updateMultiSelectState();
    }

    createThumbsView(): void {
        this.thumbsView = new ThumbsView(this.$thumbsView);
        this.databindThumbsView();
    }

    databindThumbsView(): void{
        if (!this.thumbsView) return;
        var width, height;

        var viewingDirection = this.extension.helper.getViewingDirection().toString();

        if (viewingDirection === manifesto.ViewingDirection.topToBottom().toString() || viewingDirection === manifesto.ViewingDirection.bottomToTop().toString()){
            width = this.config.options.oneColThumbWidth;
            height = this.config.options.oneColThumbHeight;
        } else {
            width = this.config.options.twoColThumbWidth;
            height = this.config.options.twoColThumbHeight;
        }

        this.thumbsView.thumbs = <IThumb[]>this.extension.helper.getThumbs(width, height);
        this.thumbsView.databind();
    }

    createGalleryView(): void {
        this.galleryView = new GalleryView(this.$galleryView);
        this.galleryView.multiSelectState = this.multiSelectState;
        this.databindGalleryView();
    }

    databindGalleryView(): void{
        if (!this.galleryView) return;
        var width = this.config.options.galleryThumbWidth;
        var height = this.config.options.galleryThumbHeight;
        this.galleryView.thumbs = <IThumb[]>this.extension.helper.getThumbs(width, height);
        this.galleryView.databind();
        // ensure gallery has current multiselect state
        this.updateMultiSelectState();
    }

    toggleFinish(): void {
        super.toggleFinish();

        if (this.isUnopened) {

            var treeEnabled = Utils.Bools.getBool(this.config.options.treeEnabled, true);
            var thumbsEnabled = Utils.Bools.getBool(this.config.options.thumbsEnabled, true);

            this.treeData = this.extension.helper.getTree(manifold.TreeSortType.none());

            if (!this.treeData || !this.treeData.nodes.length) {
                treeEnabled = false;
            }

            // hide the tabs if either tree or thumbs are disabled.
            if (!treeEnabled || !thumbsEnabled) this.$tabs.hide();

            if (thumbsEnabled && this.defaultToThumbsView()){
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

    defaultToThumbsView(): boolean{

        var defaultToTreeEnabled: boolean = Utils.Bools.getBool(this.config.options.defaultToTreeEnabled, false);
        var defaultToTreeIfGreaterThan: number = this.config.options.defaultToTreeIfGreaterThan || 0;

        if (defaultToTreeEnabled){
            if (this.treeData.nodes.length > defaultToTreeIfGreaterThan){
                return false;
            }
        }

        return true;

        //var manifestType: string = (<ISeadragonProvider>this.provider).getManifestType().toString();
        //
        //switch (manifestType){
        //    case manifesto.ManifestType.monograph().toString():
        //        if (!(<ISeadragonProvider>this.provider).isMultiSequence()) defaultToThumbs = true;
        //        break;
        //    case manifesto.ManifestType.manuscript().toString():
        //        if (!(<ISeadragonProvider>this.provider).isMultiSequence()) defaultToThumbs = true;
        //        break;
        //}
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
            var range: Manifesto.IRange = this.extension.helper.getCanvasRange(this.extension.helper.getCurrentCanvas());
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
            var rangePath: string = this.extension.currentRange ? this.extension.currentRange.path : '';
            var range: Manifesto.IRange = this.extension.helper.getCanvasRange(this.extension.helper.getCurrentCanvas(), rangePath);

            if (range){
                id = range.treeNode.id;
                node = this.treeView.getNodeById(id);
            }

            // use manifest root node
            if (!node){
                id = this.extension.helper.manifest.treeRoot.id;
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