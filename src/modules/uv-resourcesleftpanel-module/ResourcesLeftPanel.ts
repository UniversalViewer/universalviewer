import BaseCommands = require("../uv-shared-module/BaseCommands");
import LeftPanel = require("../uv-shared-module/LeftPanel");
import ThumbsView = require("./ThumbsView");

class ResourcesLeftPanel extends LeftPanel {

    $resources: JQuery;
    $resourcesButton: JQuery;
    $resourcesView: JQuery;
    $tabs: JQuery;
    $tabsContent: JQuery;
    $thumbsButton: JQuery;
    $thumbsView: JQuery;
    $views: JQuery;
    thumbsView: ThumbsView;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('resourcesLeftPanel');

        super.create();

        this.setTitle(this.content.title);

        /*
         TODO: make tabs work
        this.$tabs = $('<div class="tabs"></div>');
        this.$main.append(this.$tabs);

        this.$thumbsButton = $('<a class="thumbs tab">' + this.content.thumbnails + '</a>');
        this.$thumbsButton.prop('title', this.content.thumbnails);
        this.$tabs.append(this.$thumbsButton);

        this.$resourcesButton = $('<a class="resources tab">' + this.content.resources+ '</a>');
        this.$resourcesButton.prop('title', this.content.resources);
        this.$tabs.append(this.$resourcesButton);
         */

        this.$tabsContent = $('<div class="tabsContent"></div>');
        this.$main.append(this.$tabsContent);

        this.$views = $('<div class="views"></div>');
        this.$tabsContent.append(this.$views);

        this.$thumbsView = $('<div class="thumbsView"></div>');
        this.$views.append(this.$thumbsView);

        this.$resourcesView = $('<div class="resourcesView"></div>');
        this.$resources = $('<ul></ul>');
        this.$resourcesView.append(this.$resources);
        this.$views.append(this.$resourcesView);

        this.thumbsView = new ThumbsView(this.$thumbsView);
        this.dataBind();
    }

    dataBind(): void {
        this.dataBindThumbsView();
        var annotations: Manifesto.IAnnotation[] = this.extension.helper.getResources();

        if (annotations.length === 0) {
            this.$resourcesView.hide();
        }
        for (var i = 0; i < annotations.length; i++){
            var annotation: Manifesto.IAnnotation = annotations[i];
            var resource: Manifesto.Resource = annotation.getResource();
            var $listItem: JQuery = $('<li><a href="' + resource.id + '" target="_blank">' + resource.getLabel() + ' (' + Utils.Files.simplifyMimeType(resource.getFormat().toString()) + ')' + '</li>');
            this.$resources.append($listItem);
        }
    }

    dataBindThumbsView(): void{
        if (!this.thumbsView) return;
        var width, height;

        var viewingDirection = this.extension.helper.getViewingDirection().toString();

        if (viewingDirection === manifesto.ViewingDirection.topToBottom().toString() || viewingDirection === manifesto.ViewingDirection.bottomToTop().toString()){
            width = this.config.options.oneColThumbWidth;
            height = this.config.options.oneColThumbHeight;
        } else {
            width = this.config.options.twoColThumbWidth;
            height = this.config.options.twoColThumbHeight;
        }
        if (typeof width === "undefined") {
            width = 100;
        }
        if (typeof height === "undefined") {
            height = 100;
        }

        this.thumbsView.thumbs = <Manifold.IThumb[]>this.extension.helper.getThumbs(width, height);
        // hide thumb selector for single-part manifests
        if (this.thumbsView.thumbs.length < 2) {
            this.$thumbsView.hide();
        }
        this.thumbsView.databind();
    }

    expandFullStart(): void {
        super.expandFullStart();
        $.publish(BaseCommands.LEFTPANEL_EXPAND_FULL_START);
    }

    expandFullFinish(): void {
        super.expandFullFinish();

        $.publish(BaseCommands.LEFTPANEL_EXPAND_FULL_FINISH);
    }

    collapseFullStart(): void {
        super.collapseFullStart();

        $.publish(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START);
    }

    collapseFullFinish(): void {
        super.collapseFullFinish();

        $.publish(BaseCommands.LEFTPANEL_COLLAPSE_FULL_FINISH);
    }

    resize(): void {
        super.resize();

        this.$views.height(this.$main.height());
        this.$resources.height(this.$main.height());
    }
}

export = ResourcesLeftPanel;