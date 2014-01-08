/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import utils = require("../../utils");
import baseExtension = require("../coreplayer-shared-module/baseExtension");
import shell = require("../coreplayer-shared-module/shell");
import baseView = require("../coreplayer-shared-module/baseView");
import TreeNode = require("../coreplayer-treeviewleftpanel-module/treeNode");

export class TreeView extends baseView.BaseView {

    $tree: JQuery;
    selectedSection: any;

    structuresRootNode: TreeNode;
    sectionsRootNode: TreeNode;

    static VIEW_SECTION: string = 'treeView.onViewSection';
    static VIEW_STRUCTURE: string = 'treeView.onViewStructure';

    constructor($element: JQuery) {
        super($element, true, false);
    }

    create(): void {
        super.create();

        $.subscribe(baseExtension.BaseExtension.ASSET_INDEX_CHANGED, (e, assetIndex) => {
            this.selectIndex(assetIndex);
        });

        // parse the structures and sections into a single tree.
        this.createTreeNodes();

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

                            if (self.data.type == 'structure') {
                                $.publish(TreeView.VIEW_STRUCTURE, [self.data.ref]);
                            } else {
                                $.publish(TreeView.VIEW_SECTION, [self.data.ref]);
                            }
                        })
                },
                template: $.templates.treeTemplate
            }
        });

        this.$tree.link($.templates.pageTemplate, this.structuresRootNode);

        this.resize();
    }

    parseStructure(node: TreeNode, structure: any): void {
        node.label = structure.name || "root";
        node.type = "structure";
        node.ref = structure;
        structure.treeNode = node;
        node.path = node.ref.path;

        // if this is the structure node that contains the assetSequence.
        if (this.provider.assetSequence.structure == structure) {
            this.sectionsRootNode = node;
            this.sectionsRootNode.selected = true;
            this.sectionsRootNode.expanded = true;
        }

        if (structure.structures) {

            for (var i = 0; i < structure.structures.length; i++) {
                var childStructure = structure.structures[i];

                var childNode = new TreeNode();
                node.nodes.push(childNode);

                this.parseStructure(childNode, childStructure);
            }
        }
    }

    parseSection(node: TreeNode, section: any): void {
        node.label = section.sectionType;
        node.type = "section";
        node.ref = section;
        section.treeNode = node;
        node.path = node.ref.path;

        if (section.sections) {

            for (var i = 0; i < section.sections.length; i++) {
                var childSection = section.sections[i];

                var childNode = new TreeNode();
                node.nodes.push(childNode);

                this.parseSection(childNode, childSection);
            }
        }
    }

    createTreeNodes() {
        this.structuresRootNode = new TreeNode('root');

        if (this.provider.pkg.rootStructure) {
            this.parseStructure(this.structuresRootNode, this.provider.pkg.rootStructure);
        }

        // if there aren't any structures then the sectionsRootNode won't have been created.
        if (!this.sectionsRootNode) this.sectionsRootNode = this.structuresRootNode;

        if (this.provider.assetSequence.rootSection.sections){
            for (var i = 0; i < this.provider.assetSequence.rootSection.sections.length; i++) {
                var section = this.provider.assetSequence.rootSection.sections[i];

                var childNode = new TreeNode();
                this.sectionsRootNode.nodes.push(childNode);

                this.parseSection(childNode, section);
            }
        }
    }

    selectIndex(index: number): void {
        // may be authenticating
        if (index == -1) return;

        var section = this.extension.getSectionByAssetIndex(index);
        this.selectPath(section.path);
    }

    selectPath(path: string): void {

        var pathArr = path.split("/");

        if (pathArr.length >= 1) pathArr.shift();

        // reset the previous selected node.
        if (this.selectedSection) $.observable(this.selectedSection.treeNode).setProperty("selected", false);

        // should have an array that looks like this: [0, 1, 0]
        // (1st section in root, 2nd section in that, 1st section in that).
        // recursively walk tree to set selected node.
        this.selectedSection = this.getSection(this.provider.assetSequence.rootSection, pathArr);

        $.observable(this.selectedSection.treeNode).setProperty("selected", true);
    }

    show(): void {
        this.$element.show();

        setTimeout(() => {
            this.selectIndex(this.extension.currentAssetIndex);
        }, 1);
    }

    hide(): void {
        this.$element.hide();
    }

    getSection(parentSection, path) {

        if (path.length == 0) return parentSection;

        parentSection.expanded = true;

        var index = path.shift();

        var section = parentSection.sections[index];

        return this.getSection(section, path);
    }

    resize(): void {
        super.resize();

    }
}