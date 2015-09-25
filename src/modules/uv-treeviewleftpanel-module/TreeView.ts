import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseView = require("../uv-shared-module/BaseView");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import ISeadragonProvider = require("../../extensions/uv-seadragon-extension/ISeadragonProvider");
import Shell = require("../uv-shared-module/Shell");

class TreeView extends BaseView {

    $tree: JQuery;
    elideCount: number;
    isOpen: boolean = false;
    selectedNode: Manifesto.TreeNode;

    public rootNode: Manifesto.TreeNode;

    constructor($element: JQuery) {
        super($element, true, true);
    }

    create(): void {
        super.create();

        this.$tree = $('<ul class="tree"></ul>');
        this.$element.append(this.$tree);

        $.templates({
            pageTemplate: '{^{for nodes}}\
                               {^{tree/}}\
                           {{/for}}',
            treeTemplate: '<li>\
                               {^{if nodes && nodes.length}}\
                                   {^{if expanded}}\
                                       <div class="toggle expanded"></div>\
                                   {{else}}\
                                       <div class="toggle"></div>\
                                   {{/if}}\
                               {{else}}\
                                   <div class="spacer"></div>\
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
                toggle: function () {
                    $.observable(this.data).setProperty("expanded", !this.data.expanded);
                    //this.contents().find('a').each(function() {
                    //    that.elide($(this));
                    //});
                },
                init: function (tagCtx, linkCtx, ctx) {
                    var data = tagCtx.view.data;
                    data.text = data.label;//Utils.Strings.htmlDecode(Utils.Strings.ellipsis(data.label, that.elideCount));
                    this.data = tagCtx.view.data;
                },
                onAfterLink: function () {
                    var self = this;

                    self.contents("li").first()
                        .on("click", ".toggle", function () {
                            self.toggle();
                        }).on("click", "a", function (e) {
                            e.preventDefault();

                            if (self.data.nodes.length){
                                self.toggle();
                            }

                            $.publish(Commands.TREE_NODE_SELECTED, [self.data.data]);
                        });
                },
                template: $.templates.treeTemplate
            }
        });
    }

    public dataBind(): void {
        if (!this.rootNode) return;

        this.$tree.link($.templates.pageTemplate, this.rootNode);
        this.resize();
    }

    public getNodeById(id: string): Manifesto.TreeNode {
        return this.rootNode.nodes.en().traverseUnique(node => node.nodes)
            .where((n) => n.id === id).first();
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
    expandParents(node: Manifesto.TreeNode): void{
        if (!node.parentNode) return;

        $.observable(node.parentNode).setProperty("expanded", true);
        this.expandParents(node.parentNode);
    }

    // walks down the tree using the specified path e.g. [2,2,0]
    getNodeByPath(parentNode: Manifesto.TreeNode, path: string[]): Manifesto.TreeNode {
        if (path.length === 0) return parentNode;
        var index = path.shift();
        var node = parentNode.nodes[index];
        return this.getNodeByPath(node, path);
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