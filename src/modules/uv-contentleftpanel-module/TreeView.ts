import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseView = require("../uv-shared-module/BaseView");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import ISeadragonProvider = require("../../extensions/uv-seadragon-extension/ISeadragonProvider");
import Shell = require("../uv-shared-module/Shell");
import ITreeNode = require("../uv-shared-module/ITreeNode");

class TreeView extends BaseView {

    $tree: JQuery;
    elideCount: number;
    isOpen: boolean = false;
    selectedNode: ITreeNode;
    multiSelectionMode: boolean = false;

    public rootNode: ITreeNode;

    constructor($element: JQuery) {
        super($element, true, true);
    }

    create(): void {
        super.create();

        var that = this;

        $.subscribe(Commands.ENTER_MULTI_SELECTION_MODE, () => {
            this.multiSelectionMode = true;
            this.dataBind();
        });

        $.subscribe(Commands.EXIT_MULTI_SELECTION_MODE, () => {
            this.multiSelectionMode = false;
            this.dataBind();
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
                                    <input type="checkbox" data-link="checked{:multiSelected ? \'checked\' : \'\'}" class="multiSelect" />\
                               {{/if}}\
                               {^{if selected}}\
                                   <a href="#" title="{{>label}}" class="selected" data-link="~elide(text)"></a>\
                               {{else}}\
                                   <a href="#" title="{{>label}}" data-link="~elide(text)"></a>\
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
                    $.observable(this.data).setProperty("expanded", !this.data.expanded);
                },
                toggleMultiSelect: function() {
                    that._multiSelectTreeNode(this.data, !this.data.multiSelected);
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
                            $.publish(Commands.TREE_NODE_SELECTED, [self.data.data]);
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

        this._setMultiSelectionEnabled(this.multiSelectionMode);

        this.$tree.link($.templates.pageTemplate, this.rootNode);
        this.resize();
    }

    private _getAllNodes(): ITreeNode[] {
        return <ITreeNode[]>this.rootNode.nodes.en().traverseUnique(node => node.nodes).toArray();
    }

    public getMultiSelectedNodes(): ITreeNode[] {
        return this._getAllNodes().en().where((n) => n.multiSelected).toArray();
    }

    public getNodeById(id: string): ITreeNode {
        return this._getAllNodes().en().where((n) => n.id === id).first();
    }

    private _multiSelectTreeNode(node: ITreeNode, isSelected: boolean): void {
        $.observable(node).setProperty("multiSelected", isSelected);

        // recursively select/deselect child nodes
        for (var i = 0; i < node.nodes.length; i++){
            var n: ITreeNode = <ITreeNode>node.nodes[i];
            this._multiSelectTreeNode(n, isSelected);
        }
    }

    private _setMultiSelectionEnabled(enabled: boolean): void {
        var nodes: ITreeNode[] = this._getAllNodes();

        for (var i = 0; i < nodes.length; i++){
            var node: ITreeNode = nodes[i];
            node.multiSelectionEnabled = enabled;
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
        if (this.selectedNode) $.observable(this.selectedNode).setProperty("selected", false);
    }

    selectNode(node: any): void{
        if (!this.rootNode) return;

        this.deselectCurrentNode();

        this.selectedNode = node;
        $.observable(this.selectedNode).setProperty("selected", true);

        this.expandParents(this.selectedNode);
    }

    // walk up the tree expanding parent nodes.
    expandParents(node: ITreeNode): void{
        if (!node.parentNode) return;

        $.observable(node.parentNode).setProperty("expanded", true);
        this.expandParents(<ITreeNode>node.parentNode);
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