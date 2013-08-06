/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/extensions.d.ts" />
import utils = module("app/Utils");
import baseApp = module("app/modules/Shared/BaseApp");
import shell = module("app/modules/Shared/Shell");
import baseView = module("app/modules/Shared/BaseView");
import app = module("app/extensions/seadragon/App");

export class TreeView extends baseView.BaseView {

    $tree: JQuery;
    selectedSection: any;

    static VIEW_SECTION_PATH: string = 'treeView.onViewSectionPath';

    constructor($element: JQuery) {
        super($element, true, false);
    }

    create(): void {
        super.create();

        $.subscribe(baseApp.BaseApp.ASSET_INDEX_CHANGED, (e, assetIndex) => {
            this.selectIndex(assetIndex);
        });

        this.$tree = $('<ul class="tree"></ul>');
        this.$element.append(this.$tree);

        /*
        $.templates({
            pageTemplate: '{^{for sections}} {^{tree/}} {{/for}}',
            treeTemplate: '<li> {{if sections && sections.length}} {^{if expanded}} <div class="toggle expanded"></div> {{else}} <div class="toggle"></div> {{/if}} {{else}} <div class="spacer"></div> {{/if}} {^{if selected}} <a href="#" class="selected">{{>sectionType}}</a> {{else}} <a href="#">{{>sectionType}}</a> {{/if}} </li> {^{if expanded}} <li> <ul> {{for sections}} {^{tree/}} {{/for}} </ul> </li>{{/if}}'
        });
        */

        $.templates({
            pageTemplate: '{^{for sections}}\
                               {^{tree/}}\
                           {{/for}}',
            treeTemplate: '<li>\
                               {^{if sections && sections.length}}\
                                   {^{if expanded}}\
                                       <div class="toggle expanded"></div>\
                                   {{else}}\
                                       <div class="toggle"></div>\
                                   {{/if}}\
                               {{else}}\
                                   <div class="spacer"></div>\
                               {{/if}}\
                               {^{if selected}}\
                                   <a href="#" class="selected">{{>sectionType}}</a>\
                               {{else}}\
                                   <a href="#">{{>sectionType}}</a>\
                               {{/if}}\
                           </li>\
                           {^{if expanded}}\
                               <li>\
                                   <ul>\
                                       {^{for sections}}\
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
                            $.publish(TreeView.VIEW_SECTION_PATH, [self.data.path]);
                        })
                },
                template: $.templates.treeTemplate
            }
        });

        this.$tree.link($.templates.pageTemplate, this.provider.assetSequence.rootSection);

        this.resize();

        /*
        // test data

        var rootSection = {
            "title": "The biocrats",
            "sectionType": "Monograph",
            "sections": [
                {
                    "sectionType": "CoverFrontOutside",
                    "assets": [
                        0
                    ],
                    "sections": [
                        {
                            "sectionType": "Nested Section",
                            "assets": [
                                2
                            ]
                        }
                    ]
                },
                {
                    "sectionType": "CoverBackOutside",
                    "selected": true,
                    "assets": [
                        1
                    ]
                },
                {
                    "sectionType": "TitlePage",
                    "assets": [
                        7
                    ]
                },
                {
                    "sectionType": "TableOfContents",
                    "assets": [
                        9
                    ]
                }
            ]
        };

        this.$tree.link($.templates.pageTemplate, rootSection);
        */
    }

    selectIndex(index: number): void {
        var section = this.app.getSectionByAssetIndex(index);
        this.selectPath(section.path);
    }

    show(): void {
        this.$element.show();

        setTimeout(() => {
            this.selectIndex(this.app.currentAssetIndex);
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

    selectPath(path: string): void {

        var pathArr = path.split("/");

        if (pathArr.length >= 1) pathArr.shift();

        // reset the previous selected node.
        if (this.selectedSection) $.observable(this.selectedSection).setProperty("selected", false);

        // should have an array that looks like this: [0, 1, 0]
        // (1st section in root, 2nd section in that, 1st section in that).
        // recursively walk tree to set selected node.
        this.selectedSection = this.getSection(this.provider.assetSequence.rootSection, pathArr);

        $.observable(this.selectedSection).setProperty("selected", true);
    }

    resize(): void {
        super.resize();

    }
}