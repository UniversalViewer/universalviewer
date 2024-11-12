const $ = require("jquery");
import { IIIFEvents } from "../../IIIFEvents";
import { BaseView } from "../uv-shared-module/BaseView";
import { TreeNode } from "manifesto.js";
import { TreeComponent } from "@iiif/iiif-tree-component";
import { ContentLeftPanel } from "./ContentLeftPanel";

export class TreeView extends BaseView<ContentLeftPanel> {
  isOpen: boolean = false;
  treeComponent: any;
  treeData: any;
  $tree: JQuery;
  private expandedNodeIds: Set<string> = new Set();

  constructor($element: JQuery) {
    super($element, true, true);
  }

  create(): void {
    this.setConfig("contentLeftPanel");
    super.create();
    this.$tree = $('<div class="iiif-tree-component"></div>');
    this.$element.append(this.$tree);
  }

  setup(): void {
    this.treeComponent = new TreeComponent({
      target: <HTMLElement>this.$tree[0],
      data: this.treeData,
    });

    this.treeComponent.on(
      "treeNodeSelected",
      (node: TreeNode) => {
        this.extensionHost.publish(IIIFEvents.TREE_NODE_SELECTED, node);
      },
      false
    );

    this.treeComponent.on(
      "treeNodeMultiSelected",
      (node: TreeNode) => {
        this.extensionHost.publish(IIIFEvents.TREE_NODE_MULTISELECTED, node);
      },
      false
    );
  }

  private saveState(): void {
    const allNodes = this.treeComponent.getAllNodes();
    this.expandedNodeIds.clear();
    allNodes.forEach((node) => {
      if (node.expanded) {
        this.expandedNodeIds.add(node.id);
      }
    });
  }

  private restoreState(): void {
    const allNodes = this.treeComponent.getAllNodes();
    allNodes.forEach((node) => {
      if (this.expandedNodeIds.has(node.id)) {
        this.treeComponent.expandNode(node, true);
      }
    });
  }

  public databind(): void {
    this.saveState();
    this.treeComponent.set(this.treeData);
    this.restoreState();
    this.resize();
  }

  public show(): void {
    this.isOpen = true;
    this.$element.show();
  }

  public hide(): void {
    this.isOpen = false;
    this.$element.hide();
  }

  public selectNode(node: TreeNode): void {
    this.treeComponent.expandParents(node, true); // Expand node parents
    const link: Element | undefined = this.$tree.find(
      "#tree-link-" + node.id
    )[0];
    if (link) {
      //commented out as bug where scrolls to wrong node eg in Villanova collection
      // link.scrollIntoViewIfNeeded();
    }

    Promise.resolve().then(() => {
      this.treeComponent.selectNode(node);
    });
  }

  public expandNode(node: TreeNode, expanded: boolean): void {
    this.treeComponent.expandNode(node, expanded);
  }

  public getAllNodes(): TreeNode[] {
    return this.treeComponent.getAllNodes();
  }

  public deselectCurrentNode(): void {
    this.treeComponent.deselectCurrentNode();
  }

  public getNodeById(id: string): TreeNode {
    return this.treeComponent.getNodeById(id);
  }

  resize(): void {
    super.resize();
  }
}
