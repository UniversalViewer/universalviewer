import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {BaseView} from "../uv-shared-module/BaseView";
import ITreeNode = Manifold.ITreeNode;

export class TreeView extends BaseView {

    isOpen: boolean = false;
    treeComponent: IIIFComponents.ITreeComponent;
    treeData: IIIFComponents.ITreeComponentData;
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

        this.treeComponent = new IIIFComponents.TreeComponent({
            target: this.$tree[0], 
            data: this.treeData
        });

        this.treeComponent.on('treeNodeSelected', function(node: ITreeNode) {
            $.publish(BaseEvents.TREE_NODE_SELECTED, [node]);
        }, false);

        this.treeComponent.on('treeNodeMultiSelected', function(node: ITreeNode) {
            $.publish(BaseEvents.TREE_NODE_MULTISELECTED, [node]);
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
        this.treeComponent.selectNode(node);
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