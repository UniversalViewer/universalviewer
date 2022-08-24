const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { BaseView } from "../uv-shared-module/BaseView";
import { TreeNode } from "manifesto.js";
import { TreeComponent } from "@iiif/iiif-tree-component";

export class TreeView extends BaseView {
  isOpen: boolean = false;
  treeComponent: any;
  treeData: any;
  $tree: JQuery;

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
    const that = this;

    this.treeComponent = new TreeComponent({
      target: <HTMLElement>this.$tree[0],
      data: this.treeData,
    });

    this.treeComponent.on(
      "treeNodeSelected",
      function(node: TreeNode) {
        that.extensionHost.publish(IIIFEvents.TREE_NODE_SELECTED, node);
      },
      false
    );

    this.treeComponent.on(
      "treeNodeMultiSelected",
      function(node: TreeNode) {
        that.extensionHost.publish(IIIFEvents.TREE_NODE_MULTISELECTED, node);
      },
      false
    );
  }

  public databind(): void {
    this.treeComponent.set(this.treeData);
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
    if (!this.treeComponent.selectedNode) {
      this.treeComponent.expandParents(node, true);

      const link: Element | undefined = this.$tree.find(
        "#tree-link-" + node.id
      )[0];

      if (link) {
        // link.scrollIntoView({ inline: 'center' });
      }
    }

    this.treeComponent.selectNode(node);
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
