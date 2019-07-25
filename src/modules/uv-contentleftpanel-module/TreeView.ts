import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {BaseView} from "../uv-shared-module/BaseView";
import ITreeNode = Manifold.ITreeNode;

export class TreeView extends BaseView {

    isOpen: boolean = false;
    treeComponent: any;
    treeData: any;
    $tree: JQuery;

    constructor($element: JQuery) {
        super($element, true, true);
    }

    create(): void {
        this.setConfig('contentLeftPanel');
        super.create();

        this.$tree = $('<div class="iiif-tree-component"></div>');
        this.$element.append(this.$tree);
    }

    setup(): void {

        const that = this;

        this.treeComponent = new IIIFComponents.TreeComponent({
            target:  <HTMLElement>this.$tree[0], 
            data: this.treeData
        });

        this.treeComponent.on('treeNodeSelected', function(node: ITreeNode) {
            that.component.publish(BaseEvents.TREE_NODE_SELECTED, node);
        }, false);

        this.treeComponent.on('treeNodeMultiSelected', function(node: ITreeNode) {
            that.component.publish(BaseEvents.TREE_NODE_MULTISELECTED, node);
        }, false);
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

    public selectNode(node: Manifold.ITreeNode): void {

        if (!this.treeComponent.selectedNode) {

            this.treeComponent.expandParents(node, true);

            const link: Element | undefined = this.$tree.find("#tree-link-" + node.id)[0];

            if (link) {
                link.scrollIntoViewIfNeeded();
            }            
        }

        this.treeComponent.selectNode(node);        
    }

    public expandNode(node: Manifold.ITreeNode, expanded: boolean): void {
        this.treeComponent.expandNode(node, expanded);
    }


    public getAllNodes(): Manifold.ITreeNode[] {
        return this.treeComponent.getAllNodes();
    }

    public deselectCurrentNode(): void {
        this.treeComponent.deselectCurrentNode();
    }

    public getNodeById(id: string): ITreeNode {
        return this.treeComponent.getNodeById(id);
    }

    resize(): void {
        super.resize();
    }
}