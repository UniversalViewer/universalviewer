/// <reference path="../../js/jquery.d.ts" />

import baseLeft = require("../coreplayer-shared-module/leftPanel");
import utils = require("../../utils");
import tree = require("./treeView");
import thumbs = require("./thumbsView");
import baseView = require("../coreplayer-shared-module/baseView");
import extension = require("../../extensions/coreplayer-seadragon-extension/extension");
import baseExtension = require("../coreplayer-shared-module/baseExtension");

export class TreeViewLeftPanel extends baseLeft.LeftPanel {

    $tabs: JQuery;
    $treeButton: JQuery;
    $thumbsButton: JQuery;
    $tabsContent: JQuery;
    $options: JQuery;
    $views: JQuery;
    $treeView: JQuery;
    $thumbsView: JQuery;
    treeView: tree.TreeView;
    thumbsView: thumbs.ThumbsView;

    static OPEN_TREE_VIEW: string = 'leftPanel.onOpenTreeView';
    static OPEN_THUMBS_VIEW: string = 'leftPanel.onOpenThumbsView';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('treeViewLeftPanel');

        super.create();

        $.subscribe(extension.Extension.RELOAD, () => {
            this.dataBindThumbsView();
        });

        $.subscribe(baseExtension.BaseExtension.CANVAS_INDEX_CHANGED, (e, canvasIndex) => {
            this.selectTreeNodeFromCanvasIndex(canvasIndex);
        });

        this.$tabs = utils.Utils.createDiv('tabs');
        this.$main.append(this.$tabs);

        this.$treeButton = $('<a class="tab first">' + this.content.index + '</a>');
        this.$tabs.append(this.$treeButton);

        this.$thumbsButton = $('<a class="tab">' + this.content.thumbnails + '</a>');
        this.$tabs.append(this.$thumbsButton);

        this.$tabsContent = utils.Utils.createDiv('tabsContent');
        this.$main.append(this.$tabsContent);

        this.$options = $('<div class="options"></div>');
        this.$tabsContent.append(this.$options);

        this.$views = $('<div class="views"></div>');
        this.$tabsContent.append(this.$views);

        this.$treeView = utils.Utils.createDiv('treeView');
        this.$views.append(this.$treeView);

        this.$thumbsView = utils.Utils.createDiv('thumbsView');
        this.$views.append(this.$thumbsView);

        this.$treeButton.on('click', (e) => {
            e.preventDefault();

            this.openTreeView();

            $.publish(TreeViewLeftPanel.OPEN_TREE_VIEW);
        });

        this.$thumbsButton.on('click', (e) => {
            e.preventDefault();

            this.openThumbsView();

            $.publish(TreeViewLeftPanel.OPEN_THUMBS_VIEW);
        });
    }

    createTreeView(): void {
        this.treeView = new tree.TreeView(this.$treeView);
        this.dataBindTreeView();
    }

    dataBindTreeView(): void{
        this.treeView.rootNode = this.provider.getTree();
        this.treeView.dataBind();
    }

    createThumbsView(): void {
        this.thumbsView = new thumbs.ThumbsView(this.$thumbsView);
        this.dataBindThumbsView();
    }

    dataBindThumbsView(): void{
        this.thumbsView.thumbs = this.provider.getThumbs();
        this.thumbsView.dataBind();
    }

    toggleComplete(): void {
        super.toggleComplete();

        if (this.isUnopened) {

            var treeEnabled = utils.Utils.getBool(this.config.options.treeEnabled, true);
            var thumbsEnabled = utils.Utils.getBool(this.config.options.thumbsEnabled, true);

            // hide the tabs if either tree or thumbs are disabled.
            if (!treeEnabled || !thumbsEnabled) this.$tabs.hide();

            if (thumbsEnabled && this.defaultToThumbsView()){
                this.$tabs.hide();
                this.openThumbsView();
            } else if (treeEnabled){
                this.openTreeView();
            }
        }
    }

    // todo: should this be in the provider?
    defaultToThumbsView(): boolean{
        var manifestType = this.provider.getManifestType();

        switch (manifestType){
            case 'archive': return true;
            case 'boundmanuscript': return true;
            case 'artwork': return true;
        }

        var sequenceType = this.provider.getSequenceType();

        switch (sequenceType){
            case 'application-pdf': return true;
        }

        return false;
    }

    openTreeView(): void {
        if (!this.treeView) {
            this.createTreeView();
        }

        this.$treeButton.addClass('on');
        this.$thumbsButton.removeClass('on');

        this.treeView.show();

        setTimeout(() => {
            var structure = this.provider.getStructureByCanvasIndex(this.provider.canvasIndex);
            if (this.treeView && structure.treeNode) this.treeView.selectNode(structure.treeNode);
        }, 1);

        if (this.thumbsView) this.thumbsView.hide();

        this.treeView.resize();
    }

    openThumbsView(): void {
        if (!this.thumbsView) {
            this.createThumbsView();
        }

        this.$treeButton.removeClass('on');
        this.$thumbsButton.addClass('on');

        if (this.treeView) this.treeView.hide();
        this.thumbsView.show();

        this.thumbsView.resize();
    }

    selectTreeNodeFromCanvasIndex(index: number): void {
        // may be authenticating
        if (index == -1) return;

        var structure = this.provider.getStructureByCanvasIndex(index);

        if (!structure) return;

        if (this.treeView && structure.treeNode) this.treeView.selectNode(structure.treeNode);
    }

    resize(): void {
        super.resize();

        this.$tabsContent.height(this.$main.height() - this.$tabs.height() - this.$tabsContent.verticalPadding());
        this.$views.height(this.$tabsContent.height() - this.$options.height());
    }
}