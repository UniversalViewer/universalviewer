/// <reference path="../../js/jquery.d.ts" />

import baseLeft = require("../coreplayer-shared-module/leftPanel");
import utils = require("../../utils");
import tree = require("./treeView");
import thumbs = require("./thumbsView");
import baseView = require("../coreplayer-shared-module/baseView");

export class TreeViewLeftPanel extends baseLeft.LeftPanel {

    $tabs: JQuery;
    $treeButton: JQuery;
    $thumbsButton: JQuery;
    $tabsContent: JQuery;
    $treeView: JQuery;
    $thumbsView: JQuery;
    treeView: baseView.BaseView;
    thumbsView: baseView.BaseView;

    static OPEN_TREE_VIEW: string = 'leftPanel.onOpenTreeView';
    static OPEN_THUMBS_VIEW: string = 'leftPanel.onOpenThumbsView';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('treeViewLeftPanel');

        super.create();

        this.$tabs = utils.Utils.createDiv('tabs');
        this.$main.append(this.$tabs);

        this.$treeButton = $('<a class="tab first">' + this.content.index + '</a>');
        this.$tabs.append(this.$treeButton);

        this.$thumbsButton = $('<a class="tab">' + this.content.thumbnails + '</a>');
        this.$tabs.append(this.$thumbsButton);

        this.$tabsContent = utils.Utils.createDiv('tabsContent');
        this.$main.append(this.$tabsContent);

        this.$treeView = utils.Utils.createDiv('treeView');
        this.$tabsContent.append(this.$treeView);

        this.$thumbsView = utils.Utils.createDiv('thumbsView');
        this.$tabsContent.append(this.$thumbsView);

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
    }

    createThumbsView(): void {
        this.thumbsView = new thumbs.ThumbsView(this.$thumbsView);
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

        (<tree.TreeView>this.treeView).show();
        if (this.thumbsView) (<thumbs.ThumbsView>this.thumbsView).hide();
    }

    openThumbsView(): void {
        if (!this.thumbsView) {
            this.createThumbsView();
        }

        this.$treeButton.removeClass('on');
        this.$thumbsButton.addClass('on');

        if (this.treeView) (<tree.TreeView>this.treeView).hide();
        (<thumbs.ThumbsView>this.thumbsView).show();
    }

    resize(): void {
        super.resize();

        this.$tabsContent.actualHeight(this.$main.height() - this.$tabs.outerHeight());
    }
}