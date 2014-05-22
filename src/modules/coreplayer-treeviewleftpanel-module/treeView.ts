/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import utils = require("../../utils");
import baseExtension = require("../coreplayer-shared-module/baseExtension");
import shell = require("../coreplayer-shared-module/shell");
import baseView = require("../coreplayer-shared-module/baseView");
import TreeNode = require("../coreplayer-shared-module/treeNode");

export class TreeView extends baseView.BaseView {

    $tree: JQuery;
    selectedStructure: any;

    rootNode: TreeNode;
    //sectionsRootNode: TreeNode;

    //static VIEW_SECTION: string = 'treeView.onViewSection';
    //static VIEW_STRUCTURE: string = 'treeView.onViewStructure';
    static VIEW_STRUCTURE: string = 'treeView.onViewStructure';
    static VIEW_MANIFEST: string = 'treeView.onViewManifest';

    constructor($element: JQuery) {
        super($element, true, false);
    }

    create(): void {
        super.create();

        $.subscribe(baseExtension.BaseExtension.CANVAS_INDEX_CHANGED, (e, canvasIndex) => {
            this.selectIndex(canvasIndex);
        });

        this.rootNode = this.provider.getTree();

        if (!this.rootNode) return;

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
                                   <a href="#" class="selected">{{>label}}</a>\
                               {{else}}\
                                   <a href="#">{{>label}}</a>\
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

        $.views.tags({
            tree: {
                toggle: function () {
                    $.observable(this.data).setProperty("expanded", !this.data.expanded);
                },
                init: function (tagCtx, linkCtx, ctx) {
                    this.data = tagCtx.view.data;
                },
                onAfterLink: function () {
                    var self = this;

                    self.contents("li").first()
                        .on("click", ".toggle", function () {
                            self.toggle();
                        }).on("click", "a", function (e) {
                            e.preventDefault();

                            if (self.data.type == 'manifest') {
                                $.publish(TreeView.VIEW_MANIFEST, [self.data.ref]);
                            } else {
                                $.publish(TreeView.VIEW_STRUCTURE, [self.data.ref]);
                            }
                        })
                },
                template: $.templates.treeTemplate
            }
        });

        this.$tree.link($.templates.pageTemplate, this.rootNode);

        this.resize();
    }

    selectIndex(index: number): void {
        // may be authenticating
        if (index == -1) return;

        // has a tree been successfully generated?
        if (!this.rootNode) return;

        var structure = this.provider.getStructureByCanvasIndex(index);

        if (!structure) return;

        this.selectPath(structure.path);
    }

    selectPath(path: string): void {

        var pathArr = path.split("/");

        if (pathArr.length >= 1) pathArr.shift();

        // reset the previous selected node.
        if (this.selectedStructure) $.observable(this.selectedStructure.treeNode).setProperty("selected", false);

        // should have an array that looks like this: [0, 1, 0]
        // (1st structure in root, 2nd structure in that, 1st structure in that).
        // recursively walk tree to set selected node.
        this.selectedStructure = this.getStructure(this.provider.getRootStructure(), pathArr);

        $.observable(this.selectedStructure.treeNode).setProperty("selected", true);
    }

    show(): void {
        this.$element.show();

        setTimeout(() => {
            this.selectIndex(this.provider.canvasIndex);
        }, 1);
    }

    hide(): void {
        this.$element.hide();
    }

    getStructure(parentStructure, path) {

        if (path.length == 0) return parentStructure;

        parentStructure.expanded = true;

        var index = path.shift();

        var structure = this.provider.getStructureByIndex(parentStructure, index);

        return this.getStructure(structure, path);
    }

    resize(): void {
        super.resize();

    }
}