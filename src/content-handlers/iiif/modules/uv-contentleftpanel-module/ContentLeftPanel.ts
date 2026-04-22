const $ = require("jquery");
import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import ThumbsView from "./ThumbsView";
const ViewingDirectionEnum =
  require("@iiif/vocabulary/dist-commonjs/").ViewingDirection;
// const ViewingHintEnum = require("@iiif/vocabulary/dist-commonjs/").ViewingHint;
import { Bools } from "../../Utils";
import { ViewingHint, ViewingDirection } from "@iiif/vocabulary/dist-commonjs/";
import { IIIFEvents } from "../../IIIFEvents";
import { GalleryView } from "./GalleryView";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { LeftPanel } from "../uv-shared-module/LeftPanel";
import { Mode } from "../../extensions/uv-openseadragon-extension/Mode";
import { TreeView } from "./TreeView";
import {
  LanguageMap,
  Thumb,
  TreeNode,
  TreeNodeType,
  Range,
} from "manifesto.js";
import { AnnotationGroup, TreeSortType } from "@iiif/manifold";
import { isVisible } from "../../../../Utils";
import { ContentLeftPanel as ContentLeftPanelConfig } from "../../extensions/config/ContentLeftPanel";

export class ContentLeftPanel extends LeftPanel<ContentLeftPanelConfig> {
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
  $keyElement: JQuery;
  expandFullEnabled: boolean = false;
  galleryView: GalleryView;
  isThumbsViewOpen: boolean = false;
  isTreeViewOpen: boolean = false;
  keyPress: boolean = false;
  treeData: TreeNode;
  treeSortType: TreeSortType = TreeSortType.NONE;
  treeView: TreeView;
  thumbsRoot: Root;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("contentLeftPanel");

    super.create();

    this.extensionHost.subscribe(IIIFEvents.SETTINGS_CHANGE, () => {
      this.render();
    });

    this.extensionHost.subscribe(IIIFEvents.CANVAS_INDEX_CHANGE, () => {
      this.render();
    });

    this.extensionHost.subscribe(IIIFEvents.GALLERY_THUMB_SELECTED, () => {
      this.collapseFull();
    });

    this.extensionHost.subscribe(IIIFEvents.METRIC_CHANGE, () => {
      if (!this.extension.isDesktopMetric()) {
        if (this.isFullyExpanded) {
          this.collapseFull();
        }
      }
    });

    this.extensionHost.subscribe(IIIFEvents.ANNOTATIONS, () => {
      this.renderThumbs();
      this.renderGallery();
    });

    this.extensionHost.subscribe(IIIFEvents.ANNOTATIONS_CLEARED, () => {
      this.renderThumbs();
      this.renderGallery();
    });

    this.extensionHost.subscribe(IIIFEvents.ANNOTATIONS_EMPTY, () => {
      this.renderThumbs();
      this.renderGallery();
    });

    this.extensionHost.subscribe(IIIFEvents.CANVAS_INDEX_CHANGE, () => {
      if (this.isFullyExpanded) {
        this.collapseFull();
      }

      this.selectCurrentTreeNodeByCanvas();
      this.updateTreeTabBySelection();
    });

    this.extensionHost.subscribe(IIIFEvents.RANGE_CHANGE, () => {
      if (this.isFullyExpanded) {
        this.collapseFull();
      }

      this.selectCurrentTreeNodeByRange();
      this.updateTreeTabBySelection();
    });

    this.extensionHost.subscribe(IIIFEvents.TREE_NODE_SELECTED, () => {
      if (this.extension.isMetric("sm")) {
        this.toggle(true);
      }
    });

    this.extensionHost.subscribe(IIIFEvents.TOGGLE_EXPAND_LEFT_PANEL, () => {
      this.openThumbsView();
    });

    // this.extensionHost.subscribe(
    //   OpenSeadragonExtensionEvents.PAGING_TOGGLED,
    //   (_paged: boolean) => {
    //     this.renderThumbs();
    //   }
    // );

    this.$tabs = $('<div class="tabs"></div>');
    this.$main.append(this.$tabs);

    this.$treeButton = $(
      '<a class="index tab" tabindex="0">' + this.content.index + "</a>"
    );
    this.$tabs.append(this.$treeButton);

    this.$thumbsButton = $(
      '<a class="thumbs tab" tabindex="0">' + this.content.thumbnails + "</a>"
    );
    this.$tabs.append(this.$thumbsButton);

    this.$tabsContent = $('<div class="tabsContent"></div>');
    this.$main.append(this.$tabsContent);

    this.$options = $('<div class="options"></div>');
    this.$tabsContent.append(this.$options);

    this.$topOptions = $('<div class="top"></div>');
    this.$options.append(this.$topOptions);

    this.$treeSelect = $(
      '<select aria-label="' + this.content.manifestRanges + '"></select>'
    );
    this.$topOptions.append(this.$treeSelect);

    this.$bottomOptions = $('<div class="bottom"></div>');
    this.$options.append(this.$bottomOptions);

    this.$leftOptions = $('<div class="left"></div>');
    this.$bottomOptions.append(this.$leftOptions);

    this.$rightOptions = $('<div class="right"></div>');
    this.$bottomOptions.append(this.$rightOptions);

    this.$treeViewOptions = $('<div class="treeView"></div>');
    this.$leftOptions.append(this.$treeViewOptions);

    this.$sortByLabel = $(
      '<span class="sort">' + this.content.sortBy + "</span>"
    );
    this.$treeViewOptions.append(this.$sortByLabel);

    this.$sortButtonGroup = $('<div class="btn-group"></div>');
    this.$treeViewOptions.append(this.$sortButtonGroup);

    this.$sortByDateButton = $(
      '<button class="btn" tabindex="0">' + this.content.date + "</button>"
    );
    this.$sortButtonGroup.append(this.$sortByDateButton);

    this.$sortByVolumeButton = $(
      '<button class="btn" tabindex="0">' + this.content.volume + "</button>"
    );
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

    this.$treeSelect.change(() => {
      this.renderTree();
      this.selectCurrentTreeNode();
      this.updateTreeTabBySelection();
    });

    this.$sortByDateButton.on("click", () => {
      this.sortByDate();
    });

    this.$sortByVolumeButton.on("click", () => {
      this.sortByVolume();
    });

    this.$treeViewOptions.hide();

    this.onAccessibleClick(
      this.$treeButton,
      () => {
        this.openTreeView();
      },
      true,
      true
    );

    this.onAccessibleClick(
      this.$thumbsButton,
      () => {
        this.openThumbsView();
      },
      true,
      true
    );

    this.setTitle(this.content.title);

    this.$sortByVolumeButton.addClass("on");

    var tabOrderConfig: string = this.options.tabOrder;

    if (tabOrderConfig) {
      // sort tabs
      tabOrderConfig = tabOrderConfig.toLowerCase();
      tabOrderConfig = tabOrderConfig.replace(/ /g, "");
      var tabOrder: string[] = tabOrderConfig.split(",");

      if (tabOrder[0] === "thumbs") {
        this.$treeButton.before(this.$thumbsButton);
        this.$thumbsButton.addClass("first");
      } else {
        this.$treeButton.addClass("first");
      }
    }
  }

  // renderThumbs({ paged }: { paged: boolean }): void {
  //   this.thumbsRoot.render(
  //     createElement(ThumbsViewReact, {
  //       paged,
  //     })
  //   );
  // }

  createTreeView(): void {
    this.treeView = new TreeView(this.$treeView, false);
    this.treeView.treeData = this.getTreeData();
    this.treeView.setup();
    this.renderTree();

    // populate the tree select drop down when there are multiple top-level ranges
    const topRanges: Range[] = this.extension.helper.getTopRanges();

    if (topRanges.length > 1) {
      for (let i = 0; i < topRanges.length; i++) {
        const range: Range = topRanges[i];
        this.$treeSelect.append(
          '<option value="' +
            range.id +
            '">' +
            LanguageMap.getValue(range.getLabel()) +
            "</option>"
        );
      }
    }

    this.updateTreeViewOptions();
  }

  render(): void {
    this.renderThumbs();
    this.renderTree();
    this.renderGallery();
  }

  updateTreeViewOptions(): void {
    const treeData: TreeNode | null = this.getTree();

    if (!treeData) {
      return;
    }
    if (!this.defaultToThumbsView()) {
      this.$treeViewOptions.show();
    } else {
      this.$treeViewOptions.hide();
    }

    if (this.$treeSelect.find("option").length) {
      this.$treeSelect.show();
    } else {
      this.$treeSelect.hide();
    }
  }

  sortByDate(): void {
    this.treeSortType = TreeSortType.DATE;
    this.treeView.treeData = this.getTreeData();
    this.treeView.databind();
    this.selectCurrentTreeNode();
    this.$sortByDateButton.addClass("on");
    this.$sortByVolumeButton.removeClass("on");
    this.resize();
  }

  sortByVolume(): void {
    this.treeSortType = TreeSortType.NONE;
    this.treeView.treeData = this.getTreeData();
    this.treeView.databind();
    this.selectCurrentTreeNode();
    this.$sortByDateButton.removeClass("on");
    this.$sortByVolumeButton.addClass("on");
    this.resize();
  }

  isCollection(): boolean {
    var treeData: TreeNode | null = this.getTree();

    if (treeData) {
      return treeData.data.type === TreeNodeType.COLLECTION;
    }

    throw new Error("Tree not available");
  }

  renderTree(): void {
    if (!this.treeView) return;
    this.treeView.treeData = this.getTreeData();
    this.treeView.databind();
    this.selectCurrentTreeNode();
  }

  getTreeData() {
    return {
      autoExpand: this._isTreeAutoExpanded(),
      branchNodesExpandOnClick: Bools.getBool(
        this.config.options.branchNodesExpandOnClick,
        true
      ),
      branchNodesSelectable: Bools.getBool(
        this.config.options.branchNodesSelectable,
        false
      ),
      helper: this.extension.helper,
      topRangeIndex: this.getSelectedTopRangeIndex(),
      treeSortType: this.treeSortType,
    };
  }

  private _isTreeAutoExpanded(): boolean {
    const autoExpandTreeEnabled: boolean = Bools.getBool(
      this.config.options.autoExpandTreeEnabled,
      false
    );
    const autoExpandTreeIfFewerThan: number =
      this.config.options.autoExpandTreeIfFewerThan || 0;

    if (autoExpandTreeEnabled) {
      // get total number of tree nodes
      const flatTree: TreeNode[] | null =
        this.extension.helper.getFlattenedTree();

      if (flatTree && flatTree.length < autoExpandTreeIfFewerThan) {
        return true;
      }
    }

    return false;
  }

  updateTreeTabByCanvasIndex(): void {
    // update tab to current top range label (if there is one)
    const topRanges: Range[] = this.extension.helper.getTopRanges();
    if (topRanges.length > 1) {
      const index: number = this.getCurrentCanvasTopRangeIndex();

      if (index === -1) {
        return;
      }

      const currentRange: Range = topRanges[index];
      this.setTreeTabTitle(
        <string>LanguageMap.getValue(currentRange.getLabel())
      );
    } else {
      this.setTreeTabTitle(this.content.index);
    }
  }

  setTreeTabTitle(title: string): void {
    this.$treeButton.text(title);
  }

  updateTreeTabBySelection(): void {
    let title: string | null = null;
    const topRanges: Range[] = this.extension.helper.getTopRanges();

    if (topRanges.length > 1) {
      if (this.treeView) {
        title = this.getSelectedTree().text();
      } else {
        title = LanguageMap.getValue(topRanges[0].getLabel());
      }
    }

    if (title) {
      this.setTreeTabTitle(title);
    } else {
      this.setTreeTabTitle(this.content.index);
    }
  }

  getViewingHint(): ViewingHint | null {
    return this.extension.helper.getViewingHint();
  }

  getViewingDirection(): ViewingDirection | null {
    return this.extension.helper.getViewingDirection();
  }

  createThumbsRoot(): void {
    if (!this.thumbsRoot) {
      this.thumbsRoot = createRoot(this.$thumbsView[0]);
    }
    this.renderThumbs();
  }

  renderThumbs(): void {
    if (!this.thumbsRoot) return;

    // let width: number;
    // let height: number;

    // const viewingHint: ViewingHint | null = this.getViewingHint();
    const viewingDirection: ViewingDirection | null =
      this.getViewingDirection();

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

    const thumbs: Thumb[] = <Thumb[]>this.extension.helper.getThumbs(90);
    // this.extension.helper.getThumbs(width, height)

    if (
      viewingDirection &&
      viewingDirection === ViewingDirectionEnum.BOTTOM_TO_TOP
    ) {
      thumbs.reverse();
    }

    // add a search result icon for pages with results
    const searchResults: AnnotationGroup[] | null = (<OpenSeadragonExtension>(
      this.extension
    )).annotations;

    if (searchResults && searchResults.length) {
      for (let i = 0; i < searchResults.length; i++) {
        const searchResult: AnnotationGroup = searchResults[i];

        // find the thumb with the same canvasIndex and add the searchResult
        const thumb: Thumb = thumbs.filter(
          (t) => t.index === searchResult.canvasIndex
        )[0];

        if (thumb) {
          // clone the data so searchResults isn't persisted on the canvas.
          const data = Object.assign({}, thumb.data);
          data.searchResults = searchResult.rects.length;
          thumb.data = data;
        }
      }
    }

    const paged: boolean =
      !!this.extension.getSettings().pagingEnabled &&
      this.extension.helper.isPaged();

    const selectedIndices: number[] = this.extension.getPagedIndices(
      this.extension.helper.canvasIndex
    );

    const settings = this.extension.getSettings();

    this.thumbsRoot.render(
      createElement(ThumbsView, {
        thumbs,
        paged,
        viewingDirection: viewingDirection || ViewingDirection.LEFT_TO_RIGHT,
        selected: selectedIndices,
        truncateThumbnailLabels:
          settings.truncateThumbnailLabels !== undefined
            ? settings.truncateThumbnailLabels
            : true,
        onClick: (thumb: Thumb) => {
          this.extensionHost.publish(IIIFEvents.THUMB_SELECTED, thumb);
        },
        onKeyDown: (thumb: Thumb) => {
          this.extensionHost.publish(IIIFEvents.THUMB_SELECTED, thumb);
        },
      })
    );
  }
  createGalleryView(): void {
    this.galleryView = new GalleryView(this.$galleryView, false);
    this.galleryView.galleryData = this.getGalleryData();
    this.galleryView.setup();
    this.renderGallery();
  }

  renderGallery(): void {
    if (!this.galleryView) return;
    this.galleryView.galleryData = this.getGalleryData();
    this.galleryView.databind();
  }

  getGalleryData() {
    return {
      helper: this.extension.helper,
      chunkedResizingThreshold:
        this.config.options.galleryThumbChunkedResizingThreshold,
      content: this.config.content,
      debug: false,
      imageFadeInDuration: 300,
      initialZoom: 6,
      minLabelWidth: 20,
      pageModeEnabled: this.isPageModeEnabled(),
      scrollStopDuration: 100,
      searchResults: (<OpenSeadragonExtension>this.extension).annotations,
      sizingEnabled: true, // range API is IE11 up
      thumbHeight: this.config.options.galleryThumbHeight,
      thumbLoadPadding: this.config.options.galleryThumbLoadPadding,
      thumbWidth: this.config.options.galleryThumbWidth,
      viewingDirection: this.getViewingDirection(),
    };
  }

  isPageModeEnabled(): boolean {
    // todo: checks if the panel is being used in the openseadragon extension.
    // pass a `isPageModeEnabled` function to the panel's constructor instead?
    if (
      typeof (<OpenSeadragonExtension>this.extension).getMode === "function"
    ) {
      return (
        Bools.getBool(this.config.options.pageModeEnabled, true) &&
        (<OpenSeadragonExtension>this.extension).getMode().toString() ===
          Mode.page.toString()
      );
    }
    return Bools.getBool(this.config.options.pageModeEnabled, true);
  }

  getSelectedTree(): JQuery {
    return this.$treeSelect.find(":selected");
  }

  getSelectedTopRangeIndex(): number {
    let topRangeIndex: number = this.getSelectedTree().index();
    if (topRangeIndex === -1) {
      topRangeIndex = 0;
    }
    return topRangeIndex;
  }

  getTree(): TreeNode | null {
    const topRangeIndex: number = this.getSelectedTopRangeIndex();
    return this.extension.helper.getTree(topRangeIndex, TreeSortType.NONE);
  }

  toggleFinish(): void {
    super.toggleFinish();

    if (this.isUnopened) {
      let treeEnabled: boolean = Bools.getBool(
        this.config.options.treeEnabled,
        true
      );
      const thumbsEnabled: boolean = Bools.getBool(
        this.config.options.thumbsEnabled,
        true
      );

      const treeData: TreeNode | null = this.getTree();

      if (!treeData || !treeData.nodes.length) {
        treeEnabled = false;
      }

      // hide the tabs if either tree or thumbs are disabled
      if (!treeEnabled || !thumbsEnabled) this.$tabs.hide();

      if (thumbsEnabled && this.defaultToThumbsView()) {
        this.openThumbsView();
      } else if (treeEnabled) {
        this.openTreeView();
      }
    }
  }

  defaultToThumbsView(): boolean {
    const defaultToTreeEnabled: boolean = Bools.getBool(
      this.config.options.defaultToTreeEnabled,
      false
    );
    const defaultToTreeIfGreaterThan: number =
      this.config.options.defaultToTreeIfGreaterThan || 0;
    const defaultToTreeIfCollection: boolean = Bools.getBool(
      this.config.options.defaultToTreeIfCollection,
      false
    );

    const treeData: TreeNode | null = this.getTree();

    if (
      this.isCollection() &&
      (defaultToTreeIfCollection ||
        (treeData && this.extension.helper.treeHasNavDates(treeData)))
    ) {
      return false;
    }

    if (defaultToTreeEnabled) {
      if (treeData && treeData.nodes.length > defaultToTreeIfGreaterThan) {
        return false;
      }
    }

    return true;
  }

  expandFullStart(): void {
    super.expandFullStart();
    this.extensionHost.publish(IIIFEvents.LEFTPANEL_EXPAND_FULL_START);
  }

  expandFullFinish(): void {
    super.expandFullFinish();

    if (this.$treeButton.hasClass("on")) {
      this.openTreeView();
    } else if (this.$thumbsButton.hasClass("on")) {
      this.openThumbsView();
    }

    this.extensionHost.publish(IIIFEvents.LEFTPANEL_EXPAND_FULL_FINISH);
  }

  collapseFullStart(): void {
    super.collapseFullStart();

    this.extensionHost.publish(IIIFEvents.LEFTPANEL_COLLAPSE_FULL_START);
  }

  collapseFullFinish(): void {
    super.collapseFullFinish();

    // todo: write a more generic tabs system with base tab class.
    // thumbsView may not necessarily have been created yet.
    // replace thumbsView with galleryView.
    if (this.$thumbsButton.hasClass("on")) {
      this.openThumbsView();
    }

    this.extensionHost.publish(IIIFEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
  }

  openTreeView(): void {
    this.isTreeViewOpen = true;
    this.isThumbsViewOpen = false;

    if (!this.treeView) {
      this.createTreeView();
    }

    this.$treeButton.addClass("on");
    this.$thumbsButton.removeClass("on");

    this.treeView.show();

    if (this.$thumbsView) this.$thumbsView.hide();
    if (this.galleryView) this.galleryView.hide();

    this.updateTreeViewOptions();

    this.selectCurrentTreeNode();

    this.resize();
    this.treeView.resize();

    this.extensionHost.publish(IIIFEvents.OPEN_TREE_VIEW);
  }

  openThumbsView(): void {
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

    if (this.treeView) this.treeView.hide();

    this.$treeSelect.hide();
    this.$treeViewOptions.hide();

    this.resize();

    if (this.isFullyExpanded) {
      setTimeout(() => {
        this.$thumbsView.hide();
        if (this.galleryView) this.galleryView.show();
        if (this.galleryView) this.galleryView.resize();
      }, 1);
    } else {
      if (this.galleryView) this.galleryView.hide();
      this.$thumbsView.show();
      this.$thumbsView.resize();
    }

    this.extensionHost.publish(IIIFEvents.OPEN_THUMBS_VIEW);
  }

  selectTopRangeIndex(index: number): void {
    this.$treeSelect.prop("selectedIndex", index);
  }

  getCurrentCanvasTopRangeIndex(): number {
    let topRangeIndex: number = -1;

    const range: Range | null = this.extension.getCurrentCanvasRange();

    if (range) {
      topRangeIndex = Number(range.path.split("/")[0]);
    }

    return topRangeIndex;
  }

  selectCurrentTreeNode(): void {
    // todo: merge selectCurrentTreeNodeByCanvas and selectCurrentTreeNodeByRange
    // the openseadragon extension should keep track of the current range instead of using canvas index
    if (this.extension.type?.name === "uv-openseadragon-extension") {
      this.selectCurrentTreeNodeByCanvas();
    } else {
      this.selectCurrentTreeNodeByRange();
    }
  }

  selectCurrentTreeNodeByRange(): void {
    if (this.treeView) {
      const range: Range | null = this.extension.helper.getCurrentRange();
      if (range && range.treeNode) {
        const node = this.treeView.getNodeById(range.treeNode.id);
        if (node) {
          this.treeView.selectNode(node);
        } else {
          this.selectTreeNodeByManifest();
        }
      }
    }
  }

  selectCurrentTreeNodeByCanvas(): void {
    if (this.treeView) {
      let node: TreeNode | null = null;
      const currentCanvasTopRangeIndex: number =
        this.getCurrentCanvasTopRangeIndex();
      const selectedTopRangeIndex: number = this.getSelectedTopRangeIndex();
      const usingCorrectTree: boolean =
        currentCanvasTopRangeIndex === selectedTopRangeIndex;
      let range: Range | null = null;

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
      } else {
        range = this.extension.helper.getCurrentRange();

        if (range && range.treeNode) {
          node = this.treeView.getNodeById(range.treeNode.id);
        }

        if (node) {
          this.treeView.selectNode(node);
        } else {
          this.selectTreeNodeByManifest();
        }
      }
    }
  }

  // fall through to this is there's no current range or canvas
  selectTreeNodeByManifest(): void {
    const collectionIndex: number = this.extension.helper.collectionIndex;
    const manifestIndex: number = this.extension.helper.manifestIndex;

    const allNodes: TreeNode[] = this.treeView.getAllNodes();

    let nodeFound: boolean = false;

    allNodes.map((node) => {
      if (node.isCollection() && node.data.index === collectionIndex) {
        this.treeView.selectNode(node as TreeNode);
        this.treeView.expandNode(node as TreeNode, true);
        nodeFound = true;
      }

      if (node.isManifest() && node.data.index === manifestIndex) {
        this.treeView.selectNode(node as TreeNode);
        nodeFound = true;
      }
    });

    if (!nodeFound) {
      this.treeView.deselectCurrentNode();
    }
  }

  resize(): void {
    super.resize();

    // bit of a race condition happening
    // timeout gives tabs time to appear and be counted
    // so the correct height is calc'd
    setTimeout(() => {
      this.$tabsContent.height(
        this.$main.height() -
          (isVisible(this.$tabs) ? this.$tabs.height() : 0) -
          this.$tabsContent.verticalPadding()
      );

      this.$views.height(
        this.$tabsContent.height() - this.$options.outerHeight()
      );
    }, 1);
  }
}
