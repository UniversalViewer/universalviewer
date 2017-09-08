import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {LeftPanel} from "../uv-shared-module/LeftPanel";
import {ThumbsView} from "./ThumbsView";

export class ResourcesLeftPanel extends LeftPanel {

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
        const annotations: Manifesto.IAnnotation[] = this.extension.helper.getCurrentCanvas().getResources();

        if (annotations.length === 0) {
            this.$resourcesView.hide();
        }

        for (let i = 0; i < annotations.length; i++) {
            const annotation: Manifesto.IAnnotation = annotations[i];
            const resource: Manifesto.Resource = annotation.getResource();
            if (resource) {
                const label: string | null = Manifesto.TranslationCollection.getValue(<Manifesto.TranslationCollection>resource.getLabel());

                if (label) {
                    const mime: string = Utils.Files.simplifyMimeType((<Manifesto.MediaType>resource.getFormat()).toString());
                    const $listItem: JQuery = $('<li><a href="' + resource.id + '" target="_blank">' + label + ' (' + mime + ')' + '</li>');
                    this.$resources.append($listItem);
                }
            }
        }
    }

    dataBindThumbsView(): void{
        if (!this.thumbsView) return;
        
        let width: number;
        let height: number;

        const viewingDirection: string = this.extension.helper.getViewingDirection().toString();

        if (viewingDirection === manifesto.ViewingDirection.topToBottom().toString() || viewingDirection === manifesto.ViewingDirection.bottomToTop().toString()) {
            width = this.config.options.oneColThumbWidth;
            height = this.config.options.oneColThumbHeight;
        } else {
            width = this.config.options.twoColThumbWidth;
            height = this.config.options.twoColThumbHeight;
        }
        if (typeof(width) === "undefined") {
            width = 100;
        }
        if (typeof(height) === "undefined") {
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
        $.publish(BaseEvents.LEFTPANEL_EXPAND_FULL_START);
    }

    expandFullFinish(): void {
        super.expandFullFinish();

        $.publish(BaseEvents.LEFTPANEL_EXPAND_FULL_FINISH);
    }

    collapseFullStart(): void {
        super.collapseFullStart();

        $.publish(BaseEvents.LEFTPANEL_COLLAPSE_FULL_START);
    }

    collapseFullFinish(): void {
        super.collapseFullFinish();

        $.publish(BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
    }

    resize(): void {
        super.resize();

        this.$views.height(this.$main.height());
        this.$resources.height(this.$main.height());
    }
}