import {BaseView} from "../uv-shared-module/BaseView";
import {Events} from "../../extensions/uv-seadragon-extension/Events";
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

        // todo: casting as <any> is necessary because IBaseComponent doesn't implement ITinyEmitter
        // it is mixed-in a runtime. figure out how to add .on etc to IBaseComponent without needing
        // to implement it in BaseComponent.

        (<any>this.treeComponent).on('treeNodeSelected', function(node: ITreeNode) {
            $.publish(Events.TREE_NODE_SELECTED, [node]);
        });

        (<any>this.treeComponent).on('treeNodeMultiSelected', function(node: ITreeNode) {
            $.publish(Events.TREE_NODE_MULTISELECTED, [node]);
        });
    }

    public databind(): void {
        this.treeComponent.options.data = this.treeData;
        this.treeComponent.set(new Object()); // todo: should be passing options.data
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