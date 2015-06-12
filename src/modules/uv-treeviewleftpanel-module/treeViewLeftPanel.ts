/// <reference path="../../js/jquery.d.ts" />

import baseLeft = require("../uv-shared-module/leftPanel");
import utils = require("../../utils");
import tree = require("./treeView");
import TreeNode = require("../uv-shared-module/treeNode");
import thumbs = require("./thumbsView");
import gallery = require("./galleryView");
import baseView = require("../uv-shared-module/baseView");
import extension = require("../../extensions/uv-seadragon-extension/extension");
import baseExtension = require("../uv-shared-module/baseExtension");
import IProvider = require("../uv-shared-module/iProvider");

export class TreeViewLeftPanel extends baseLeft.LeftPanel {

    $tabs: JQuery;
    $treeButton: JQuery;
    $thumbsButton: JQuery;
    $tabsContent: JQuery;
    $options: JQuery;
    $views: JQuery;
    $treeView: JQuery;
    $thumbsView: JQuery;
    $galleryView: JQuery;
    treeData: TreeNode;
    treeView: tree.TreeView;
    thumbsView: thumbs.ThumbsView;
    galleryView: gallery.GalleryView;

    static OPEN_TREE_VIEW: string = 'leftPanel.onOpenTreeView';
    static OPEN_THUMBS_VIEW: string = 'leftPanel.onOpenThumbsView';
    static EXPAND_FULL_START: string = 'leftPanel.onExpandFullStart';
    static EXPAND_FULL_FINISH: string = 'leftPanel.onExpandFullFinish';
    static COLLAPSE_FULL_START: string = 'leftPanel.onCollapseFullStart';
    static COLLAPSE_FULL_FINISH: string = 'leftPanel.onCollapseFullFinish';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('treeViewLeftPanel');

        super.create();

        $.subscribe(extension.Extension.SETTINGS_CHANGED, () => {
            this.dataBindThumbsView();
            this.dataBindTreeView();
            this.dataBindGalleryView();
        });

        $.subscribe(gallery.GalleryView.THUMB_SELECTED, () => {
            this.collapseFull();
        });

        $.subscribe(baseExtension.BaseExtension.CANVAS_INDEX_CHANGED, (e, index) => {
            if (this.isFullyExpanded){
                this.collapseFull();
            }
        });

        this.$tabs = $('<div class="tabs"></div>');
        this.$main.append(this.$tabs);

        this.$treeButton = $('<a class="index tab first">' + this.content.index + '</a>');
        this.$treeButton.prop('title', this.content.index);
        this.$tabs.append(this.$treeButton);

        this.$thumbsButton = $('<a class="thumbs tab">' + this.content.thumbnails + '</a>');
        this.$thumbsButton.prop('title', this.content.thumbnails);
        this.$tabs.append(this.$thumbsButton);

        this.$tabsContent = $('<div class="tabsContent"></div>');
        this.$main.append(this.$tabsContent);

        this.$options = $('<div class="options"></div>');
        this.$tabsContent.append(this.$options);

        this.$views = $('<div class="views"></div>');
        this.$tabsContent.append(this.$views);

        this.$treeView = $('<div class="treeView"></div>');
        this.$views.append(this.$treeView);

        this.$thumbsView = $('<div class="thumbsView"></div>');
        this.$views.append(this.$thumbsView);

        this.$galleryView = $('<div class="galleryView"></div>');
        this.$views.append(this.$galleryView);

        this.$treeButton.onPressed(() => {
            this.openTreeView();

            $.publish(TreeViewLeftPanel.OPEN_TREE_VIEW);
        });

        this.$thumbsButton.onPressed(() => {
            this.openThumbsView();

            $.publish(TreeViewLeftPanel.OPEN_THUMBS_VIEW);
        });

        this.$expandButton.attr('tabindex', '7');
        this.$collapseButton.attr('tabindex', '7');
        this.$expandFullButton.attr('tabindex', '8');

        this.$title.text(this.content.title);
        this.$closedTitle.text(this.content.title);
    }

    createTreeView(): void {
        this.treeView = new tree.TreeView(this.$treeView);
        this.treeView.elideCount = this.config.options.elideCount;
        this.dataBindTreeView();
    }

    dataBindTreeView(): void{
        if (!this.treeView) return;
        this.treeView.rootNode = this.treeData;
        this.treeView.dataBind();
    }

    createThumbsView(): void {
        this.thumbsView = new thumbs.ThumbsView(this.$thumbsView);
        this.dataBindThumbsView();
    }

    dataBindThumbsView(): void{
        if (!this.thumbsView) return;
        var width, height;
        var viewingDirection = this.provider.getViewingDirection();

        if (viewingDirection === "top-to-bottom" || viewingDirection === "bottom-to-top"){
            width = this.config.options.oneColThumbWidth;
            height = this.config.options.oneColThumbHeight;
        } else {
            width = this.config.options.twoColThumbWidth;
            height = this.config.options.twoColThumbHeight;
        }

        this.thumbsView.thumbs = this.provider.getThumbs(width, height);
        this.thumbsView.dataBind();
    }

    createGalleryView(): void {
        this.galleryView = new gallery.GalleryView(this.$galleryView);
        this.dataBindGalleryView();
    }

    dataBindGalleryView(): void{
        if (!this.galleryView) return;
        var width = this.config.options.galleryThumbWidth;
        var height = this.config.options.galleryThumbHeight;
        this.galleryView.thumbs = this.provider.getThumbs(width, height);
        this.galleryView.dataBind();
    }

    toggleFinish(): void {
        super.toggleFinish();

        if (this.isUnopened) {

            var treeEnabled = utils.Utils.getBool(this.config.options.treeEnabled, true);
            var thumbsEnabled = utils.Utils.getBool(this.config.options.thumbsEnabled, true);

            this.treeData = this.provider.getTree();

            if (!this.treeData.nodes.length) {
                treeEnabled = false;
            }

            // hide the tabs if either tree or thumbs are disabled.
            if (!treeEnabled || !thumbsEnabled) this.$tabs.hide();

            if (thumbsEnabled && (<IProvider>this.provider).defaultToThumbsView()){
                this.openThumbsView();
            } else if (treeEnabled){
                this.openTreeView();
            }
        }

        if (this.isExpanded){
            this.$treeButton.attr('tabindex', '9');
            this.$thumbsButton.attr('tabindex', '10');
        } else {
            this.$treeButton.attr('tabindex', '');
            this.$thumbsButton.attr('tabindex', '');
        }
    }

    expandFullStart(): void {
        super.expandFullStart();
        $.publish(TreeViewLeftPanel.EXPAND_FULL_START);
    }

    expandFullFinish(): void {
        super.expandFullFinish();

        if (this.$treeButton.hasClass('on')){
            this.openTreeView();
        } else if (this.$thumbsButton.hasClass('on')){
            this.openThumbsView();
        }

        $.publish(TreeViewLeftPanel.EXPAND_FULL_FINISH);
    }

    collapseFullStart(): void {
        super.collapseFullStart();

        $.publish(TreeViewLeftPanel.COLLAPSE_FULL_START);
    }

    collapseFullFinish(): void {
        super.collapseFullFinish();

        // todo: write a more generic tabs system with base tab class.
        // thumbsView may not necessarily have been created yet.
        // replace thumbsView with galleryView.
        if (this.$thumbsButton.hasClass('on')){
            this.openThumbsView();
        }

        $.publish(TreeViewLeftPanel.COLLAPSE_FULL_FINISH);
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
            if (this.treeView && structure && structure.treeNode) this.treeView.selectNode(structure.treeNode);
        }, 1);

        if (this.thumbsView) this.thumbsView.hide();
        if (this.galleryView) this.galleryView.hide();

        this.treeView.resize();
    }

    openThumbsView(): void {
        if (!this.thumbsView) {
            this.createThumbsView();
        }

        if (this.isFullyExpanded && !this.galleryView) {
            this.createGalleryView();
        }

        this.$treeButton.removeClass('on');
        this.$thumbsButton.addClass('on');

        if (this.treeView) this.treeView.hide();

        if (this.isFullyExpanded){
            this.thumbsView.hide();
            if (this.galleryView) this.galleryView.show();
            if (this.galleryView) this.galleryView.resize();
        } else {
            if (this.galleryView) this.galleryView.hide();
            this.thumbsView.show();
            this.thumbsView.resize();
        }
    }

    resize(): void {
        super.resize();

        this.$tabsContent.height(this.$main.height() - (this.$tabs.is(':visible') ? this.$tabs.height() : 0) - this.$tabsContent.verticalPadding());
        this.$views.height(this.$tabsContent.height() - this.$options.height());
    }
}