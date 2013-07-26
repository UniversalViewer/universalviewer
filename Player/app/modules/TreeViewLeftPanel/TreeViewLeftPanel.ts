/// <reference path="../../../js/jquery.d.ts" />
import baseLeft = module("app/shared/LeftPanel");
import utils = module("app/Utils");
import tree = module("app/modules/TreeViewLeftPanel/TreeView");
import thumbs = module("app/modules/TreeViewLeftPanel/ThumbsView");

export class TreeViewLeftPanel extends baseLeft.LeftPanel {

    $tabs: JQuery;
    $treeButton: JQuery;
    $thumbsButton: JQuery;
    $tabsContent: JQuery;
    $treeView: JQuery;
    $thumbsView: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

        // load css.
        utils.Utils.loadCss('app/modules/TreeViewLeftPanel/css/styles.css');

        this.$tabs = utils.Utils.createDiv('tabs');
        this.$main.append(this.$tabs);

        this.$treeButton = $('<a class="tab first">' + this.content.leftPanel.index + '</a>');
        this.$tabs.append(this.$treeButton);

        this.$thumbsButton = $('<a class="tab">' + this.content.leftPanel.thumbnails + '</a>');
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
        });

        this.$thumbsButton.on('click', (e) => {
            e.preventDefault();

            this.openThumbsView();
        });
    }

    createTreeView(): void {       
        new tree.TreeView(this.$treeView);
    }

    createThumbsView(): void {
        new thumbs.ThumbsView(this.$thumbsView);
    }

    toggleComplete(): void {
        super.toggleComplete();

        // if this is the first opening, create tree and thumbs views.
        if (this.isUnopened) {
            this.createTreeView();
            this.createThumbsView();
            this.openTreeView();
        }
    }

    openTreeView(): void {
        this.$treeButton.addClass('on');
        this.$thumbsButton.removeClass('on');
        this.$treeView.show();
        this.$thumbsView.hide();
    }

    openThumbsView(): void {
        this.$treeButton.removeClass('on');
        this.$thumbsButton.addClass('on');
        this.$treeView.hide();
        this.$thumbsView.show();
    }

    resize(): void {
        super.resize();

    }
}