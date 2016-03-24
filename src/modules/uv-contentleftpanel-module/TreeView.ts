import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseView = require("../uv-shared-module/BaseView");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import ISeadragonProvider = require("../../extensions/uv-seadragon-extension/ISeadragonProvider");
import Shell = require("../uv-shared-module/Shell");
import ITreeNode = require("../uv-shared-module/ITreeNode");
import IRange = require("../uv-shared-module/IRange");
import MultiSelectState = require("../uv-shared-module/MultiSelectState");

class TreeView extends BaseView {

    $tree: JQuery;
    allNodes: ITreeNode[];
    multiSelectableNodes: ITreeNode[];
    elideCount: number;
    isOpen: boolean = false;
    selectedNode: ITreeNode;
    multiSelectState: MultiSelectState;

    public rootNode: ITreeNode;

    constructor($element: JQuery) {
        super($element, true, true);
    }

    create(): void {
        super.create();

        var that = this;

        $.subscribe(Commands.ENTER_MULTISELECT_MODE, () => {
            this.dataBind();
        });

        $.subscribe(Commands.MULTISELECT_CHANGE, (s, state: MultiSelectState) => {
            this._multiSelectStateChange(state);
        });

        this.$tree = $('<ul class="tree"></ul>');
        this.$element.append(this.$tree);

        $.templates({
            pageTemplate: '{^{for nodes}}\
                               {^{tree/}}\
                           {{/for}}',
            treeTemplate: '<li>\
                               {^{if nodes && nodes.length}}\
                                   <div class="toggle" data-link="class{merge:expanded toggle=\'expanded\'}"></div>\
                               {{else}}\
                               <div class="spacer"></div>\
                               {{/if}}\
                               {^{if multiSelectionEnabled}}\
                                    <input id="tree-checkbox-{{>id}}" type="checkbox" data-link="checked{:multiSelected ? \'checked\' : \'\'}" class="multiSelect" />\
                               {{/if}}\
                               {^{if selected}}\
                                   <a id="tree-link-{{>id}}" href="#" title="{{>label}}" class="selected" data-link="~elide(text)"></a>\
                               {{else}}\
                                   <a id="tree-link-{{>id}}" href="#" title="{{>label}}" data-link="~elide(text)"></a>\
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
                           {{/if}}'
        });

        $.views.helpers({
            elide: function(text){
                var $a = $((<any>this).linkCtx.elem);
                var elideCount = Math.floor($a.parent().width() / 7);
                return Utils.Strings.HtmlDecode(Utils.Strings.Ellipsis(text, elideCount));
                //https://github.com/BorisMoore/jsviews/issues/296
            }
        });

        $.views.tags({
            tree: {
                toggleExpanded: function() {
                    that._setNodeExpanded(this.data, !this.data.expanded);
                },
                toggleMultiSelect: function() {
                    that._multiSelectTreeNode(this.data, !this.data.multiSelected);
                    that._updateParentNodes(this.data);
                },
                init: function (tagCtx, linkCtx, ctx) {
                    var data = tagCtx.view.data;
                    data.text = data.label;//Utils.Strings.htmlDecode(Utils.Strings.ellipsis(data.label, that.elideCount));
                    this.data = tagCtx.view.data;
                },
                onAfterLink: function () {
                    var self: any = this;

                    self.contents('li').first()
                        .on('click', '.toggle', function() {
                            self.toggleExpanded();
                        }).on('click', 'a', function(e) {
                            e.preventDefault();
                            if (self.data.nodes.length) self.toggleExpanded();

                            if (that.multiSelectState.enabled){
                                self.toggleMultiSelect();
                            } else {
                                $.publish(Commands.TREE_NODE_SELECTED, [self.data.data]);
                            }
                        }).on('click', 'input.multiSelect', function(e) {
                            self.toggleMultiSelect();
                        });
                },
                template: $.templates.treeTemplate
            }
        });
    }

    public dataBind(): void {
        if (!this.rootNode) return;

        this._reset();

        this.$tree.link($.templates.pageTemplate, this.rootNode);
        this.resize();
    }

    private _multiSelectStateChange(state: MultiSelectState): void {
        this.multiSelectState = state;

        for (var i = 0; i < this.multiSelectState.ranges.length; i++) {
            var range: IRange = this.multiSelectState.ranges[i];
            var node: ITreeNode = this._getMultiSelectableNodes().en().where(n => n.data.id === range.id).first();
            this._setNodeMultiSelected(node, range.multiSelected);
        }

        this.dataBind();
    }

    private _reset(): void {
        this.allNodes = null;
        this.multiSelectableNodes = null;
        this._setMultiSelectionEnabled(this.multiSelectState.enabled);
    }

    public allNodesSelected(): boolean {
        var applicableNodes: ITreeNode[] = this._getMultiSelectableNodes();
        var multiSelectedNodes: ITreeNode[] = this.getMultiSelectedNodes();

        return applicableNodes.length === multiSelectedNodes.length;
    }

    private _getMultiSelectableNodes(): ITreeNode[] {

        // if cached
        if (this.multiSelectableNodes){
            return this.multiSelectableNodes;
        }

        return this.multiSelectableNodes = this._getAllNodes().en().where((n) => this._nodeIsMultiSelectable(n)).toArray();
    }

    private _nodeIsMultiSelectable(node: ITreeNode): boolean {
        return (node.isManifest() && node.nodes.length > 0 || node.isRange());
    }

    private _getAllNodes(): ITreeNode[] {

        // if cached
        if (this.allNodes){
            return this.allNodes;
        }

        return this.allNodes = <ITreeNode[]>this.rootNode.nodes.en().traverseUnique(node => node.nodes).toArray();
    }

    public getMultiSelectedNodes(): ITreeNode[] {
        return this._getAllNodes().en().where((n) => this._nodeIsMultiSelectable(n) && n.multiSelected).toArray();
    }

    public getNodeById(id: string): ITreeNode {
        return this._getAllNodes().en().where((n) => n.id === id).first();
    }

    private _multiSelectTreeNode(node: ITreeNode, isSelected: boolean): void {
        if (!this._nodeIsMultiSelectable(node)) return;

        this._setNodeMultiSelected(node, isSelected);

        $.publish(Commands.TREE_NODE_MULTISELECTED, [node]);

        // recursively select/deselect child nodes
        for (var i = 0; i < node.nodes.length; i++){
            var n: ITreeNode = <ITreeNode>node.nodes[i];
            this._multiSelectTreeNode(n, isSelected);
        }
    }

    private _updateParentNodes(node: ITreeNode): void {

        var parentNode: ITreeNode = <ITreeNode>node.parentNode;

        if (!parentNode) return;

        // expand parents if selected
        if (node.selected) {
            this._expandParents(node);
        }

        // get the number of selected children.
        var checkedCount: number = parentNode.nodes.en().where(n => (<ITreeNode>n).multiSelected).count();

        // if any are checked, check the parent.
        this._setNodeMultiSelected(parentNode, checkedCount > 0);

        var indeterminate: boolean = checkedCount > 0 && checkedCount < parentNode.nodes.length;

        this._setNodeIndeterminate(parentNode, indeterminate);

        // cascade up tree
        this._updateParentNodes(parentNode);
    }

    private _expandParents(node: ITreeNode): void{
        if (!node.parentNode) return;
        this._setNodeExpanded(<ITreeNode>node.parentNode, true);
        this._expandParents(<ITreeNode>node.parentNode);
    }

    private _setNodeSelected(node: ITreeNode, selected: boolean): void {
        $.observable(node).setProperty("selected", selected);
    }

    private _setNodeExpanded(node: ITreeNode, expanded: boolean): void {
        $.observable(node).setProperty("expanded", expanded);
    }

    private _setNodeMultiSelected(node: ITreeNode, selected: boolean): void {
        $.observable(node).setProperty("multiSelected", selected);

        if (!selected){
            this._setNodeIndeterminate(node, false);
        }
    }

    private _setNodeIndeterminate(node: ITreeNode, indeterminate: boolean): void {
        var $checkbox: JQuery = this._getNodeCheckbox(node);
        $checkbox.prop("indeterminate", indeterminate);
    }

    private _getNodeCheckbox(node: ITreeNode): JQuery {
        return $("#tree-checkbox-" + node.id);
    }

    private _getNodeSiblings(node: ITreeNode): ITreeNode[] {
        var siblings: ITreeNode[] = [];

        if (node.parentNode){
            siblings = <ITreeNode[]>node.parentNode.nodes.en().where(n => n !== node).toArray();
        }

        return siblings;
    }

    private _setMultiSelectionEnabled(enabled: boolean): void {
        var nodes: ITreeNode[] = this._getAllNodes();

        for (var i = 0; i < nodes.length; i++){
            var node: ITreeNode = nodes[i];

            if (this._nodeIsMultiSelectable(node)){
                node.multiSelectionEnabled = enabled;
            }
        }
    }

    public selectPath(path: string): void {
        if (!this.rootNode) return;

        var pathArr = path.split("/");
        if (pathArr.length >= 1) pathArr.shift();
        var node = this.getNodeByPath(this.rootNode, pathArr);

        this.selectNode(node);
    }

    deselectCurrentNode(): void {
        if (this.selectedNode) this._setNodeSelected(this.selectedNode, false);
    }

    selectNode(node: any): void{
        if (!this.rootNode) return;

        this.deselectCurrentNode();
        this.selectedNode = node;
        this._setNodeSelected(this.selectedNode, true);

        this._updateParentNodes(this.selectedNode);
    }

    // walks down the tree using the specified path e.g. [2,2,0]
    getNodeByPath(parentNode: ITreeNode, path: string[]): ITreeNode {
        if (path.length === 0) return parentNode;
        var index = path.shift();
        var node = parentNode.nodes[index];
        return this.getNodeByPath(<ITreeNode>node, path);
    }

    public show(): void {
        this.isOpen = true;
        this.$element.show();
    }

    public hide(): void {
        this.isOpen = false;
        this.$element.hide();
    }

    private elide($a: JQuery): void {
        if (!$a.is(':visible')) return;
        var elideCount = Math.floor($a.parent().width() / 7);
        $a.text(Utils.Strings.HtmlDecode(Utils.Strings.Ellipsis($a.attr('title'), elideCount)));
    }

    private elideAll(): void {
        var that = this;

        this.$tree.find('a').each(function() {
            var $this = $(this);
            that.elide($this);
        });
    }

    resize(): void {
        super.resize();

        // elide links
        this.elideAll();
    }
}

export = TreeView;