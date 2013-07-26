/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/extensions.d.ts" />
import utils = module("app/Utils");
import baseApp = module("app/BaseApp");
import shell = module("app/shared/Shell");
import baseView = module("app/BaseView");

export class TreeView extends baseView.BaseView {

    $tree: JQuery;

    constructor($element: JQuery) {
        super($element, true, false);
    }

    create(): void {
        super.create();

        $.subscribe(baseApp.BaseApp.ASSET_INDEX_CHANGED, (e, assetIndex) => {
            //this.indexChanged(assetIndex);
        });

        this.$tree = $('<div></div>');
        this.$element.append(this.$tree);

        $.templates({
            pageTemplate: '<ul>{^{tree/}}</ul>',
            treeTemplate: '<li>\
		                       {{if folders && folders.length }}\
			                       <span class="toggle" >{^{:expanded ? "-" : "+"}}</span>\
		                       {{else}}\
			                       <span class="spacer">></span>\
		                       {{/if}}\
                               {{>name}}\
	                       </li>\
	                        {^{if expanded}}\
                                <li>\
                                    <ul>\
				                        {{for folders}}\
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
                        });
                },
                template: $.templates.treeTemplate
            }
        });

        /* Hierarchy of named folders */
        var rootFolder = {
            name: "Categories", folders: [
                {
                    name: "Drama", folders: [
                    { name: "Courtroom" },
                    { name: "Political" }
                ]
                },
                {
                    name: "Classic", folders: [
                    {
                        name: "Musicals", folders: [
                        { name: "Jazz" },
                        { name: "R&B/Soul" }
                    ]
                    }
                ]
                }
            ]
        };

        this.$tree.link($.templates.pageTemplate, rootFolder);
    }

    /*
    create(): void {
        super.create();

        $.subscribe(baseApp.BaseApp.ASSET_INDEX_CHANGED, (e, assetIndex) => {
            this.indexChanged(assetIndex);
        });

        this.$assetSequenceElem = $('<ul class="tree"></ul>');
        this.$element.append(this.$assetSequenceElem);

        $.templates({
            assetSequenceTmpl: '<li>\
		                            {{if ~hasContent() link=true}}\
			                            {{toggle:expanded}}\
		                            {{/if}}\
		                            {{if isSelected}} \
		                                <a href="#" class="selected">{{>SectionType}}</a> \
                                    {{else}} \
                                        <a href="#">{{>SectionType}}</a> \
                                    {{/if}}\
	                            </li>\
	                            {{if expanded link=true}}\
		                            <li>\
			                            <ul>{{for sections tmpl="assetSequenceTmpl" link=true/}}</ul>\
		                            </li>\
	                            {{/if}}'
        });

        $.views.helpers({
            hasContent: function () {
                var item = this.data;
                return item.expanded || item.sections && item.sections.length;
            }
        });

        $.views.converters({
            toggle: function (value) {
                if (value) {
                    return '<div class="toggle expanded"></div>';
                } else {
                    return '<div class="toggle"></div>';
                }
            }
        });

        if (!this.provider.assetSequence.rootSection.sections) return;

        var treeElement = $.link.assetSequenceTmpl(this.$assetSequenceElem, this.provider.assetSequence.rootSection.sections)
            .on("click", ".toggle", function () {
                // Toggle expanded property on data, then refresh rendering
                var view = $.view(this).parent;
                view.data.expanded = !view.data.expanded;
                view.refresh();
            })
            .on("click", "a", function (e) {
                e.preventDefault();
                var view = $.view(this).data;
                this._trigger("onSelect", null, view.path);
            });

        var view = $.view(treeElement);

        this.treeView = view.views._1;

        // get current section.
        var section = this.app.getSectionByAssetIndex(this.app.currentAssetIndex);
        this.selectPath(section.path);
    
    }
    */

    /*
    indexChanged(index: number): void {
        var section = this.app.getSectionByAssetIndex(index);
        this.selectPath(section.path);
    }
    */

    /*
    getSection(parentSection, path) {

        if (path.length == 0) return parentSection;

        parentSection.expanded = true;

        var index = path.shift();

        var section = parentSection.sections[index];

        return this.getSection(section, path);
    }
    */

    /*
    selectPath(path: string): void {

        // split the path into array
        var pathArr = path.split("/");

        if (pathArr.length >= 1) pathArr.shift();

        // walk the data to select the matching tree node.

        // should have an array that looks like this: [0, 1, 0]
        // (1st section in root, 2nd section in that, 1st section in that).

        // reset the previous selected node.
        if (this.selectedSection) this.selectedSection.isSelected = false;

        this.selectedSection = this.getSection(this.provider.assetSequence.rootSection, pathArr);

        this.selectedSection.isSelected = true;

        if (this.treeView)
            this.treeView.refresh();
    }
    */

    resize(): void {
        super.resize();

    }
}