import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseView = require("../uv-shared-module/BaseView");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import IRange = Manifold.IRange;
import ITreeNode = Manifold.ITreeNode;
import MultiSelectState = Manifold.MultiSelectState;

class TreeView extends BaseView {

    isOpen: boolean = false;
    component: IIIFComponents.ITreeComponent;
    treeOptions: IIIFComponents.ITreeComponentOptions;
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
        var that = this;

        this.component = new IIIFComponents.TreeComponent(this.treeOptions);

        // todo: casting as <any> is necessary because IBaseComponent doesn't implement ITinyEmitter
        // it is mixed-in a runtime. figure out how to add .on etc to IBaseComponent without needing
        // to implement it in BaseComponent.

        (<any>this.component).on('treeNodeSelected', function(args) {
            var node = args[0];
            $.publish(Commands.TREE_NODE_SELECTED, [node]);
        });

        (<any>this.component).on('treeNodeMultiSelected', function(args) {
            var node = args[0];
            $.publish(Commands.TREE_NODE_MULTISELECTED, [node]);
        });
    }

    public databind(): void {
        this.component.options = this.treeOptions;
        this.component.databind();
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
        this.component.selectNode(node);
    }

    public deselectCurrentNode(): void {
        this.component.deselectCurrentNode();
    }

    public getNodeById(id: string): ITreeNode {
        return this.component.getNodeById(id);
    }

    resize(): void {
        super.resize();
    }
}

export = TreeView;