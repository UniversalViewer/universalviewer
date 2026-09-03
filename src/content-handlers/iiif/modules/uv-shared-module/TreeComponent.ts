import { TreeNodeType, TreeNode } from "manifesto.js";
import {
  Helper,
  MultiSelectableRange,
  MultiSelectableTreeNode,
  MultiSelectState,
  TreeSortType,
} from "@iiif/manifold";
import { BaseComponent, IBaseComponentOptions } from "@iiif/base-component";

export interface ITreeComponentData {
  [key: string]: any;
  autoExpand?: boolean;
  branchNodesSelectable?: boolean;
  branchNodesExpandOnClick?: boolean;
  helper?: Helper | null;
  topRangeIndex?: number;
  treeSortType?: TreeSortType;
}

export class TreeComponent extends BaseComponent {
  public options: IBaseComponentOptions;
  private _$element: JQuery;
  private _$tree: JQuery;
  private _flattenedTree: MultiSelectableTreeNode[] | null; // cache
  private _data: ITreeComponentData = this.data();
  private _multiSelectableNodes: MultiSelectableTreeNode[] | null; // cache
  private _rootNode: MultiSelectableTreeNode;
  public selectedNode: MultiSelectableTreeNode;

  constructor(options: IBaseComponentOptions) {
    super(options);
    this._data = this.options.data;
    this._init();
    this._resize();
  }

  protected _init(): boolean {
    super._init();

    this._$element = $(this.el);
    const that = this;

    this._$tree = $('<ul class="tree"></ul>');
    this._$element.append(this._$tree);

    $.templates({
      pageTemplate:
        "{^{for nodes}}\
					{^{tree/}}\
				{{/for}}",
      treeTemplate:
        '<li dir={{>dir}}>\
						{^{if nodes && nodes.length}}\
							<div class="toggle" data-link="class{merge:expanded toggle=\'expanded\'}"></div>\
						{{else}}\
						<div class="spacer"></div>\
						{{/if}}\
						{^{if multiSelectEnabled}}\
							<input id="tree-checkbox-{{>id}}" type="checkbox" data-link="checked{:multiSelected ? \'checked\' : \'\'}" class="multiSelect" />\
						{{/if}}\
						{^{if selected}}\
							<a id="tree-link-{{>id}}" href="#" title="{{>label}}" class="selected">{{>label}}</a>\
						{{else}}\
							<a id="tree-link-{{>id}}" href="#" title="{{>label}}">{{>label}}</a>\
						{{/if}}\
				</li>\
				{^{if expanded}}\
					<li>\
							<ul>\
									{^{for nodes}}\
										{^{tree/}}\
									{{/for}}\
							</ul>\
					</li>\
				{{/if}}',
    });

    $.views.tags({
      tree: {
        toggleExpanded: function () {
          const node: MultiSelectableTreeNode = (this as any).data;
          that._setNodeExpanded(node, !node.expanded);
        },
        toggleMultiSelect: function () {
          const node: MultiSelectableTreeNode = (this as any).data;
          that._setNodeMultiSelected(node, !!!node.multiSelected);

          if (node.isRange()) {
            const multiSelectState: MultiSelectState | null =
              that._getMultiSelectState();

            if (multiSelectState) {
              multiSelectState.selectRange(
                <MultiSelectableRange>node.data,
                node.multiSelected
              );
            }
          }

          that.fire(Events.TREE_NODE_MULTISELECTED, node);
        },
        init: function (tagCtx, _linkCtx, _ctx) {
          const data = tagCtx.view.data;
          (this as any).data = data;

          data.dir = "ltr";

          if (data.data.__jsonld && data.data.__jsonld.label) {
            const lang: string = data.data.__jsonld.label["@language"];

            if (lang && that._data.rtlLanguageCodes.includes(lang.trim())) {
              data.dir = "rtl";
            }
          }
        },
        onAfterLink: function () {
          const self: any = this;

          self
            .contents("li")
            .first()
            .on("click", ".toggle", function () {
              self.toggleExpanded();
            })
            .on("click", "a", function (e) {
              e.preventDefault();

              const node: MultiSelectableTreeNode = self.data;

              if (node.nodes.length && that._data.branchNodesExpandOnClick) {
                self.toggleExpanded();
              }

              if (node.multiSelectEnabled) {
                self.toggleMultiSelect();
              } else {
                if (!node.nodes.length) {
                  that.fire(Events.TREE_NODE_SELECTED, node);
                  that.selectNode(node);
                } else if (that._data.branchNodesSelectable) {
                  that.fire(Events.TREE_NODE_SELECTED, node);
                  that.selectNode(node);
                }
              }
            })
            .on("click", "input.multiSelect", function (e) {
              self.toggleMultiSelect();
            });
        },
        template: $.templates.treeTemplate,
      },
    });

    return true;
  }

  public set(data: ITreeComponentData): void {
    this._data = Object.assign(this._data, data);

    if (!this._data.helper) {
      return;
    }

    this._rootNode = this._data.helper.getTree(
      this._data.topRangeIndex,
      this._data.treeSortType
    ) as MultiSelectableTreeNode;
    this._flattenedTree = null; // delete cache
    this._multiSelectableNodes = null; // delete cache
    this._$tree.link($.templates.pageTemplate, this._rootNode);

    const multiSelectState: MultiSelectState | null =
      this._getMultiSelectState();

    if (multiSelectState) {
      for (let i = 0; i < multiSelectState.ranges.length; i++) {
        const range: MultiSelectableRange = multiSelectState.ranges[i];
        const node: MultiSelectableTreeNode =
          this._getMultiSelectableNodes().filter(
            (n) => n.data.id === range.id
          )[0];
        if (node) {
          this._setNodeMultiSelectEnabled(
            node,
            (<MultiSelectableRange>range).multiSelectEnabled
          );
          this._setNodeMultiSelected(node, range.multiSelected);
        }
      }
    }

    if (this._data.autoExpand) {
      const allNodes: MultiSelectableTreeNode[] = this.getAllNodes();

      allNodes.forEach((node: MultiSelectableTreeNode, index: number) => {
        //if (node.nodes && node.nodes.length) {
        this._setNodeExpanded(node, true);
        //}
      });
    }
  }

  private _getMultiSelectState(): MultiSelectState | null {
    if (this._data.helper) {
      return this._data.helper.getMultiSelectState();
    }
    return null;
  }

  public data(): ITreeComponentData {
    return <ITreeComponentData>{
      autoExpand: false,
      branchNodesExpandOnClick: true,
      branchNodesSelectable: true,
      helper: null,
      topRangeIndex: 0,
      treeSortType: TreeSortType.NONE,
      rtlLanguageCodes: "ar, ara, dv, div, he, heb, ur, urd",
    };
  }

  public allNodesSelected(): boolean {
    const applicableNodes: MultiSelectableTreeNode[] =
      this._getMultiSelectableNodes();
    const multiSelectedNodes: MultiSelectableTreeNode[] =
      this.getMultiSelectedNodes();
    return applicableNodes.length === multiSelectedNodes.length;
  }

  private _getMultiSelectableNodes(): MultiSelectableTreeNode[] {
    // if cached
    if (this._multiSelectableNodes) {
      return this._multiSelectableNodes;
    }

    const allNodes: MultiSelectableTreeNode[] | null = this.getAllNodes();

    if (allNodes) {
      return (this._multiSelectableNodes = allNodes.filter((n) =>
        this._nodeIsMultiSelectable(n)
      ));
    }

    return [];
  }

  private _nodeIsMultiSelectable(node: MultiSelectableTreeNode): boolean {
    if (
      (node.data.type === TreeNodeType.MANIFEST &&
        node.nodes &&
        node.nodes.length > 0) ||
      node.data.type === TreeNodeType.RANGE
    ) {
      return true;
    }

    return false;
  }

  private getAllNodes(): MultiSelectableTreeNode[] {
    // if cached
    if (this._flattenedTree) {
      return this._flattenedTree;
    }

    if (this._data.helper) {
      return (this._flattenedTree = this._data.helper.getFlattenedTree(
        this._rootNode
      ) as MultiSelectableTreeNode[]);
    }

    return [];
  }

  public getMultiSelectedNodes(): MultiSelectableTreeNode[] {
    return this.getAllNodes().filter(
      (n) => this._nodeIsMultiSelectable(n) && n.multiSelected
    );
  }

  public getNodeById(id: string): MultiSelectableTreeNode {
    return this.getAllNodes().filter((n) => n.id === id)[0];
  }

  public expandParents(node: TreeNode, expand: boolean): void {
    if (!node || !node.parentNode) return;
    this._setNodeExpanded(node.parentNode as MultiSelectableTreeNode, expand);
    this.expandParents(node.parentNode, expand);
  }

  private _setNodeSelected(
    node: MultiSelectableTreeNode,
    selected: boolean
  ): void {
    $.observable(node).setProperty("selected", selected);
  }

  private _setNodeExpanded(
    node: MultiSelectableTreeNode,
    expanded: boolean
  ): void {
    $.observable(node).setProperty("expanded", expanded);
  }

  private _setNodeMultiSelected(
    node: MultiSelectableTreeNode,
    selected: boolean
  ): void {
    $.observable(node).setProperty("multiSelected", selected);
  }

  private _setNodeMultiSelectEnabled(
    node: MultiSelectableTreeNode,
    enabled: boolean
  ): void {
    $.observable(node).setProperty("multiSelectEnabled", enabled);
  }

  public selectPath(path: string): void {
    if (!this._rootNode) return;

    const pathArr = path.split("/");
    if (pathArr.length >= 1) pathArr.shift();
    const node: MultiSelectableTreeNode = this.getNodeByPath(
      this._rootNode,
      pathArr
    );

    this.selectNode(node);
  }

  public deselectCurrentNode(): void {
    if (this.selectedNode) this._setNodeSelected(this.selectedNode, false);
  }

  public selectNode(node: MultiSelectableTreeNode): void {
    if (!this._rootNode) return;

    this.deselectCurrentNode();
    this.selectedNode = node;
    this._setNodeSelected(this.selectedNode, true);
  }

  public expandNode(node: TreeNode, expanded: boolean): void {
    if (!this._rootNode) return;
    this._setNodeExpanded(node as MultiSelectableTreeNode, expanded);
  }

  // walks down the tree using the specified path e.g. [2,2,0]
  public getNodeByPath(
    parentNode: MultiSelectableTreeNode,
    path: string[]
  ): MultiSelectableTreeNode {
    if (path.length === 0) return parentNode;
    const index: number = Number(path.shift());
    const node = parentNode.nodes[index];
    return this.getNodeByPath(<MultiSelectableTreeNode>node, path);
  }

  public show(): void {
    this._$element.show();
  }

  public hide(): void {
    this._$element.hide();
  }

  protected _resize(): void {}
}

export class Events {
  static TREE_NODE_MULTISELECTED: string = "treeNodeMultiSelected";
  static TREE_NODE_SELECTED: string = "treeNodeSelected";
}
