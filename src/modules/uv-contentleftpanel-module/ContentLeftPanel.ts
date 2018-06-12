import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {GalleryView} from "./GalleryView";
import {ISeadragonExtension} from "../../extensions/uv-seadragon-extension/ISeadragonExtension";
import {LeftPanel} from "../uv-shared-module/LeftPanel";
import {Mode} from "../../extensions/uv-seadragon-extension/Mode";
import {ThumbsView} from "./ThumbsView";
import {TreeView} from "./TreeView";
import AnnotationGroup = Manifold.AnnotationGroup;
import IThumb = Manifold.IThumb;
import ITreeNode = Manifold.ITreeNode;

export class ContentLeftPanel extends LeftPanel {

    $bottomOptions: JQuery;
    $galleryView: JQuery;
    $leftOptions: JQuery;
    $options: JQuery;
    $rightOptions: JQuery;
    $sortButtonGroup: JQuery;
    $sortByDateButton: JQuery;
    $sortByLabel: JQuery;
    $sortByVolumeButton: JQuery;
    $tabs: JQuery;
    $tabsContent: JQuery;
    $thumbsButton: JQuery;
    $thumbsView: JQuery;
    $topOptions: JQuery;
    $treeButton: JQuery;
    $treeView: JQuery;
    $treeViewOptions: JQuery;
    $treeSelect: JQuery;
    $views: JQuery;
    expandFullEnabled: boolean = false;
    galleryView: GalleryView;
    isThumbsViewOpen: boolean = false;
    isTreeViewOpen: boolean = false;
    thumbsView: ThumbsView;
    treeData: Manifesto.ITreeNode;
    treeSortType: Manifold.TreeSortType = Manifold.TreeSortType.NONE;
    treeView: TreeView;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('contentLeftPanel');

        super.create();

        $.subscribe(BaseEvents.SETTINGS_CHANGED, () => {
            this.databind();
        });

        $.subscribe(BaseEvents.GALLERY_THUMB_SELECTED, () => {
            this.collapseFull();
        });

        $.subscribe(BaseEvents.METRIC_CHANGED, () => {
            if (!this.extension.isDesktopMetric()) {
                if (this.isFullyExpanded) {
                    this.collapseFull();
                }
            }
        });

        $.subscribe(BaseEvents.ANNOTATIONS, () => {
            this.databindThumbsView();
            this.databindGalleryView();
        });

        $.subscribe(BaseEvents.ANNOTATIONS_CLEARED, () => {
            this.databindThumbsView();
            this.databindGalleryView();
        });

        $.subscribe(BaseEvents.ANNOTATIONS_EMPTY, () => {
            this.databindThumbsView();
            this.databindGalleryView();
        });

        $.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, () => {
            if (this.isFullyExpanded) {
                this.collapseFull();
            }

            this.selectCurrentTreeNode();
            this.updateTreeTabBySelection();
        });

        $.subscribe(BaseEvents.RANGE_CHANGED, () => {
            if (this.isFullyExpanded) {
                this.collapseFull();
            }

            this.selectCurrentTreeNode();
            this.updateTreeTabBySelection();
        });

        this.$tabs = $('<div class="tabs"></div>');
        this.$main.append(this.$tabs);

        this.$treeButton = $('<a class="index tab" tabindex="0">' + this.content.index + '</a>');
        this.$tabs.append(this.$treeButton);

        this.$thumbsButton = $('<a class="thumbs tab" tabindex="0">' + this.content.thumbnails + '</a>');
        this.$thumbsButton.prop('title', this.content.thumbnails);
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

        this.$sortByLabel = $('<span class="sort">' + this.content.sortBy + '</span>');
        this.$treeViewOptions.append(this.$sortByLabel);

        this.$sortButtonGroup = $('<div class="btn-group"></div>');
        this.$treeViewOptions.append(this.$sortButtonGroup);

        this.$sortByDateButton = $('<button class="btn tabindex="0"">' + this.content.date + '</button>');
        this.$sortButtonGroup.append(this.$sortByDateButton);

        this.$sortByVolumeButton = $('<button class="btn" tabindex="0">' + this.content.volume + '</button>');
        this.$sortButtonGroup.append(this.$sortByVolumeButton);

        this.$views = $('<div class="views"></div>');
        this.$tabsContent.append(this.$views);

        this.$treeView = $('<div class="treeView"></div>');
        this.$views.append(this.$treeView);

        this.$thumbsView = $('<div class="thumbsView" tabindex="0"></div>');
        this.$views.append(this.$thumbsView);

        this.$galleryView = $('<div class="galleryView"></div>');
        this.$views.append(this.$galleryView);

        this.$treeSelect.hide();

        this.$treeSelect.change(() => {
            this.databindTreeView();
            this.selectCurrentTreeNode()
            this.updateTreeTabBySelection();
        });

        this.$sortByDateButton.on('click', () => {
            this.sortByDate();
        });

        this.$sortByVolumeButton.on('click', () => {
            this.sortByVolume();
        });

        this.$treeViewOptions.hide();

        this.$treeButton.onPressed(() => {
            this.openTreeView();

            $.publish(BaseEvents.OPEN_TREE_VIEW);
        });

        this.$thumbsButton.onPressed(() => {
            this.openThumbsView();

            $.publish(BaseEvents.OPEN_THUMBS_VIEW);
        });

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
    }

    createTreeView(): void {
        this.treeView = new TreeView(this.$treeView);
        this.treeView.treeData = this.getTreeData();
        this.treeView.setup();
        this.databindTreeView();

        // populate the tree select drop down when there are multiple top-level ranges
        const topRanges: Manifesto.IRange[] = this.extension.helper.getTopRanges();

        if (topRanges.length > 1){            
            for (let i = 0; i < topRanges.length; i++){
                const range: Manifesto.IRange = topRanges[i];
                this.$treeSelect.append('<option value="' + range.id + '">' + Manifesto.TranslationCollection.getValue(range.getLabel()) + '</option>');
            }
        }

        this.updateTreeViewOptions();
    }

    databind(): void {
        this.databindThumbsView();
        this.databindTreeView();
        this.databindGalleryView();
    }

    updateTreeViewOptions(): void {
        const treeData: ITreeNode | null = this.getTree();
        
        if (!treeData) {
            return;
        }

        if (this.isCollection() && this.extension.helper.treeHasNavDates(treeData)){
            this.$treeViewOptions.show();
        } else {
            this.$treeViewOptions.hide();
        }

        if (this.$treeSelect.find('option').length){
            this.$treeSelect.show();
        } else {
            this.$treeSelect.hide();
        }
    }

    sortByDate(): void {
        this.treeSortType = Manifold.TreeSortType.DATE;
        this.treeView.treeData = this.getTreeData();
        this.treeView.databind();
        this.selectCurrentTreeNode();
        this.$sortByDateButton.addClass('on');
        this.$sortByVolumeButton.removeClass('on');
        this.resize();
    }

    sortByVolume(): void {
        this.treeSortType = Manifold.TreeSortType.NONE;
        this.treeView.treeData = this.getTreeData();
        this.treeView.databind();
        this.selectCurrentTreeNode();
        this.$sortByDateButton.removeClass('on');
        this.$sortByVolumeButton.addClass('on');
        this.resize();
    }

    isCollection(): boolean {
        var treeData: ITreeNode | null = this.getTree();

        if (treeData) {
            return treeData.data.type === manifesto.TreeNodeType.collection().toString();
        }
        
        throw new Error("Tree not available");
    }

    databindTreeView(): void {
        if (!this.treeView) return;
        this.treeView.treeData = this.getTreeData();
        this.treeView.databind();
        this.selectCurrentTreeNode();
    }

    getTreeData(): IIIFComponents.ITreeComponentData {
        return <IIIFComponents.ITreeComponentData>{
            autoExpand: this._isTreeAutoExpanded(),
            branchNodesExpandOnClick: false,
            branchNodesSelectable: Utils.Bools.getBool(this.config.options.branchNodesSelectable, false),
            helper: this.extension.helper,
            topRangeIndex: this.getSelectedTopRangeIndex(),
            treeSortType: this.treeSortType
        };
    }

    private _isTreeAutoExpanded(): boolean {
        const autoExpandTreeEnabled: boolean = Utils.Bools.getBool(this.config.options.autoExpandTreeEnabled, false);
        const autoExpandTreeIfFewerThan: number = this.config.options.autoExpandTreeIfFewerThan || 0;

        if (autoExpandTreeEnabled) {
            // get total number of tree nodes
            const flatTree: Manifesto.ITreeNode[] = this.extension.helper.getFlattenedTree();

            if (flatTree.length < autoExpandTreeIfFewerThan) {
                return true;
            }
        }

        return false;
    }

    updateTreeTabByCanvasIndex(): void {
        // update tab to current top range label (if there is one)
        const topRanges: Manifesto.IRange[] = this.extension.helper.getTopRanges();
        if (topRanges.length > 1){
            const index: number = this.getCurrentCanvasTopRangeIndex();

            if (index === -1) {
                return;
            }

            const currentRange: Manifesto.IRange = topRanges[index];
            this.setTreeTabTitle(<string>Manifesto.TranslationCollection.getValue(currentRange.getLabel()));
        } else {
            this.setTreeTabTitle(this.content.index);
        }
    }

    setTreeTabTitle(title: string): void {
        this.$treeButton.text(title);
        this.$treeButton.prop('title', title);
    }

    updateTreeTabBySelection(): void {
        let title: string | null = null;
        const topRanges: Manifesto.IRange[] = this.extension.helper.getTopRanges();
        
        if (topRanges.length > 1){
            if (this.treeView){
                title = this.getSelectedTree().text();
            } else {
                title = Manifesto.TranslationCollection.getValue(topRanges[0].getLabel());
            }
        }

        if (title) {
            this.setTreeTabTitle(title);
        } else {
            this.setTreeTabTitle(this.content.index);
        }
    }

    getViewingHint(): Manifesto.ViewingHint | null {
        return this.extension.helper.getViewingHint();
    }

    getViewingDirection(): Manifesto.ViewingDirection | null {
        return this.extension.helper.getViewingDirection();
    }

    createThumbsView(): void {
        this.thumbsView = new ThumbsView(this.$thumbsView);
        this.databindThumbsView();
    }

    databindThumbsView(): void {
        if (!this.thumbsView) return;
        
        let width: number;
        let height: number;


        const viewingHint: Manifesto.ViewingHint | null = this.getViewingHint();
        const viewingDirection: Manifesto.ViewingDirection | null = this.getViewingDirection();

        if (viewingDirection && (viewingDirection.toString() === manifesto.ViewingDirection.leftToRight().toString() || viewingDirection.toString() === manifesto.ViewingDirection.rightToLeft().toString())) {
            width = this.config.options.twoColThumbWidth;
            height = this.config.options.twoColThumbHeight;
        } else if (viewingHint && viewingHint.toString() === manifesto.ViewingHint.paged().toString()) {
            width = this.config.options.twoColThumbWidth;
            height = this.config.options.twoColThumbHeight;
        } else {
            width = this.config.options.oneColThumbWidth;
            height = this.config.options.oneColThumbHeight;
        }

        const thumbs: IThumb[] = <IThumb[]>this.extension.helper.getThumbs(width, height);

        if (viewingDirection && viewingDirection.toString() === manifesto.ViewingDirection.bottomToTop().toString()) {
            thumbs.reverse();
        }

        // add a search result icon for pages with results
        const searchResults: AnnotationGroup[] | null = (<ISeadragonExtension>this.extension).annotations;
        
        if (searchResults && searchResults.length) {

            for (let i = 0; i < searchResults.length; i++) {
                const searchResult: AnnotationGroup = searchResults[i];

                // find the thumb with the same canvasIndex and add the searchResult
                let thumb: IThumb = thumbs.en().where(t => t.index === searchResult.canvasIndex).first();

                if (thumb) {
                    // clone the data so searchResults isn't persisted on the canvas.
                    let data = $.extend(true, {}, thumb.data);
                    data.searchResults = searchResult.rects.length;
                    thumb.data = data;
                }
            }

        }

        this.thumbsView.thumbs = thumbs;

        this.thumbsView.databind();
    }

    createGalleryView(): void {
        this.galleryView = new GalleryView(this.$galleryView);
        this.galleryView.galleryData = this.getGalleryData();
        this.galleryView.setup();
        this.databindGalleryView();
    }

    databindGalleryView(): void {
        if (!this.galleryView) return;
        this.galleryView.galleryData = this.getGalleryData();
        this.galleryView.databind();
    }

    getGalleryData(): IIIFComponents.IGalleryComponentData {
        return <IIIFComponents.IGalleryComponentData>{
            helper: this.extension.helper,
            chunkedResizingThreshold: this.config.options.galleryThumbChunkedResizingThreshold,
            content: this.config.content,
            debug: false,
            imageFadeInDuration: 300,
            initialZoom: 6,
            minLabelWidth: 20,
            pageModeEnabled: this.isPageModeEnabled(),
            scrollStopDuration: 100,
            searchResults: (<ISeadragonExtension>this.extension).annotations,
            sizingEnabled: Modernizr.inputtypes.range,
            thumbHeight: this.config.options.galleryThumbHeight,
            thumbLoadPadding: this.config.options.galleryThumbLoadPadding,
            thumbWidth: this.config.options.galleryThumbWidth,
            viewingDirection: this.getViewingDirection()
        };
    }

    isPageModeEnabled(): boolean {
        // todo: checks if the panel is being used in the openseadragon extension.
        // pass a `isPageModeEnabled` function to the panel's constructor instead?
        if (typeof (<ISeadragonExtension>this.extension).getMode === "function") { 
            return Utils.Bools.getBool(this.config.options.pageModeEnabled, true) && (<ISeadragonExtension>this.extension).getMode().toString() === Mode.page.toString();
        }
        return Utils.Bools.getBool(this.config.options.pageModeEnabled, true);
    }

    getSelectedTree(): JQuery {
        return this.$treeSelect.find(':selected');
    }

    getSelectedTopRangeIndex(): number {
        let topRangeIndex: number = this.getSelectedTree().index();
        if (topRangeIndex === -1){
            topRangeIndex = 0;
        }
        return topRangeIndex;
    }

    getTree(): ITreeNode | null {
        const topRangeIndex: number = this.getSelectedTopRangeIndex();
        return this.extension.helper.getTree(topRangeIndex, Manifold.TreeSortType.NONE);
    }

    toggleFinish(): void {
        super.toggleFinish();

        if (this.isUnopened) {

            let treeEnabled: boolean = Utils.Bools.getBool(this.config.options.treeEnabled, true);
            const thumbsEnabled: boolean = Utils.Bools.getBool(this.config.options.thumbsEnabled, true);

            const treeData: ITreeNode | null = this.getTree();

            if (!treeData || !treeData.nodes.length) {
                treeEnabled = false;
            }

            // hide the tabs if either tree or thumbs are disabled
            if (!treeEnabled || !thumbsEnabled) this.$tabs.hide();

            if (thumbsEnabled && this.defaultToThumbsView()){
                this.openThumbsView();
            } else if (treeEnabled){
                this.openTreeView();
            }
        }
    }

    defaultToThumbsView(): boolean {

        const defaultToTreeEnabled: boolean = Utils.Bools.getBool(this.config.options.defaultToTreeEnabled, false);
        const defaultToTreeIfGreaterThan: number = this.config.options.defaultToTreeIfGreaterThan || 0;

        const treeData: ITreeNode | null = this.getTree();

        if (defaultToTreeEnabled){
            if (treeData && treeData.nodes.length > defaultToTreeIfGreaterThan){
                return false;
            }
        }

        return true;
    }

    expandFullStart(): void {
        super.expandFullStart();
        $.publish(BaseEvents.LEFTPANEL_EXPAND_FULL_START);
    }

    expandFullFinish(): void {
        super.expandFullFinish();

        if (this.$treeButton.hasClass('on')){
            this.openTreeView();
        } else if (this.$thumbsButton.hasClass('on')){
            this.openThumbsView();
        }

        $.publish(BaseEvents.LEFTPANEL_EXPAND_FULL_FINISH);
    }

    collapseFullStart(): void {
        super.collapseFullStart();

        $.publish(BaseEvents.LEFTPANEL_COLLAPSE_FULL_START);
    }

    collapseFullFinish(): void {
        super.collapseFullFinish();

        // todo: write a more generic tabs system with base tab class.
        // thumbsView may not necessarily have been created yet.
        // replace thumbsView with galleryView.
        if (this.$thumbsButton.hasClass('on')){
            this.openThumbsView();
        }

        $.publish(BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
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

        this.$treeSelect.hide();
        this.$treeViewOptions.hide();

        this.resize();

        if (this.isFullyExpanded) {
            this.thumbsView.hide();
            if (this.galleryView) this.galleryView.show();
            if (this.galleryView) this.galleryView.resize();
        } else {
            if (this.galleryView) this.galleryView.hide();
            this.thumbsView.show();
            this.thumbsView.resize();
        }
    }

    selectTopRangeIndex(index: number): void {
        this.$treeSelect.prop('selectedIndex', index);
    }

    getCurrentCanvasTopRangeIndex(): number {
        let topRangeIndex: number = -1;
        
        const range: Manifesto.IRange | null = this.extension.getCurrentCanvasRange();
        
        if (range) {
            topRangeIndex = Number(range.path.split('/')[0]);
        }
        
        return topRangeIndex;
    }

    selectCurrentTreeNode(): void {
        // todo: merge selectCurrentTreeNodeByCanvas and selectCurrentTreeNodeByRange
        // the openseadragon extension should keep track of the current range instead of using canvas index
        if (this.extension.name === 'uv-seadragon-extension') {
            this.selectCurrentTreeNodeByCanvas(); 
        } else {
            this.selectCurrentTreeNodeByRange();
        }
    }

    selectCurrentTreeNodeByRange(): void{
        if (this.treeView) {

            const range: Manifesto.IRange | null = this.extension.helper.getCurrentRange();
            let node: Manifesto.ITreeNode | null = null;

            if (range && range.treeNode) {
                node = this.treeView.getNodeById(range.treeNode.id);
            }

            if (node){
                this.treeView.selectNode(<Manifold.ITreeNode>node);
            } else {
                this.treeView.deselectCurrentNode();
            }
        }
    }

    selectCurrentTreeNodeByCanvas(): void{
        if (this.treeView) {

            let node: Manifesto.ITreeNode | null = null;
            const currentCanvasTopRangeIndex: number = this.getCurrentCanvasTopRangeIndex();
            const selectedTopRangeIndex: number = this.getSelectedTopRangeIndex();
            const usingCorrectTree: boolean = currentCanvasTopRangeIndex === selectedTopRangeIndex;
            let range: Manifesto.IRange | null = null;

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

            if (node && usingCorrectTree){
                this.treeView.selectNode(<Manifold.ITreeNode>node);
            } else {
                range = this.extension.helper.getCurrentRange();
                
                if (range && range.treeNode) {
                    node = this.treeView.getNodeById(range.treeNode.id);
                }

                if (node) {
                    this.treeView.selectNode(<Manifold.ITreeNode>node);
                } else {
                    this.treeView.deselectCurrentNode();
                }
            }
        }
    }

    resize(): void {
        super.resize();

        this.$tabsContent.height(this.$main.height() - (this.$tabs.is(':visible') ? this.$tabs.height() : 0) - this.$tabsContent.verticalPadding());
        this.$views.height(this.$tabsContent.height() - this.$options.outerHeight());
    }
}
