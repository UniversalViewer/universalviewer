import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseView = require("../uv-shared-module/BaseView");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import IRange = Manifold.IRange;
import ITreeNode = Manifold.ITreeNode;
import MultiSelectState = Manifold.MultiSelectState;
import Shell = require("../uv-shared-module/Shell");

class TreeView extends BaseView {


    // allNodes: ITreeNode[];
    // multiSelectableNodes: ITreeNode[];
    // elideCount: number;
    isOpen: boolean = false;
    component: IIIFComponents.ITreeComponent;
    // selectedNode: ITreeNode;
    // multiSelectState: MultiSelectState;

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
            element: ".treeView"
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

    public getNodeById(id: string): ITreeNode {
        return this.component.getNodeById(id);
    }

    // private elide($a: JQuery): void {
    //     if (!$a.is(':visible')) return;
    //     var elideCount = Math.floor($a.parent().width() / 7); // todo: remove / 7
    //     $a.text(Utils.Strings.htmlDecode(Utils.Strings.ellipsis($a.attr('title'), elideCount)));
    // }

    // private elideAll(): void {
    //     var that = this;

    //     this.$tree.find('a').each(function() {
    //         var $this = $(this);
    //         that.elide($this);
    //     });
    // }

    resize(): void {
        super.resize();

        // elide links
        //this.elideAll();
    }
}

export = TreeView;