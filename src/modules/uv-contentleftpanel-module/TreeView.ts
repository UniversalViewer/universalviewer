import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseView = require("../uv-shared-module/BaseView");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import IRange = Manifold.IRange;
import ITreeNode = Manifold.ITreeNode;
import MultiSelectState = Manifold.MultiSelectState;

class TreeView extends BaseView {

    isOpen: boolean = false;
    component: IIIFComponents.ITreeComponent;

    public rootNode: ITreeNode;

    constructor($element: JQuery) {
        super($element, true, true);
    }

    create(): void {
        super.create();

        var that = this;

        $.subscribe(Commands.ENTER_MULTISELECT_MODE, () => {
            this.databind();
        });

        $.subscribe(Commands.MULTISELECT_CHANGE, (s, state: MultiSelectState) => {
            this._updateMultiSelectState(state);
        });

        this.component = new IIIFComponents.TreeComponent({
            element: ".views .treeView"
        });

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
        if (!this.rootNode) return;

        this.component.databind(this.rootNode);

        this.resize();
    }

    private _updateMultiSelectState(state: MultiSelectState): void {
        this.component.updateMultiSelectState(state); 
    }

    public show(): void {
        this.isOpen = true;
        this.$element.show();
    }

    public hide(): void {
        this.isOpen = false;
        this.$element.hide();
    }

    public selectNode(node: any): void {
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