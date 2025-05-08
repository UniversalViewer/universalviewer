const $ = require("jquery");
import { IIIFEvents } from "../../IIIFEvents";
import { LeftPanel } from "../uv-shared-module/LeftPanel";
import { ThumbsView } from "./ThumbsView";
import { ViewingDirection, MediaType } from "@iiif/vocabulary/dist-commonjs/";
import { Files } from "@edsilv/utils";
import { Annotation, LanguageMap, Resource } from "manifesto.js";
import { ResourcesLeftPanel as ResourcesLeftPanelConfig } from "../../extensions/config/ResourcesLeftPanel";

export class ResourcesLeftPanel extends LeftPanel<ResourcesLeftPanelConfig> {
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
    this.setConfig("resourcesLeftPanel");

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
    this.$resources = $("<ul></ul>");
    this.$resourcesView.append(this.$resources);
    this.$views.append(this.$resourcesView);

    this.thumbsView = new ThumbsView(this.$thumbsView);
    this.dataBind();
  }

  dataBind(): void {
    this.dataBindThumbsView();
    const annotations: Annotation[] = this.extension.helper
      .getCurrentCanvas()
      .getResources();

    if (annotations.length === 0) {
      this.$resourcesView.hide();
    }

    for (let i = 0; i < annotations.length; i++) {
      const annotation: Annotation = annotations[i];
      const resource: Resource = annotation.getResource();
      if (resource) {
        const label: string | null = LanguageMap.getValue(
          <LanguageMap>resource.getLabel()
        );

        if (label) {
          const mime: string = Files.simplifyMimeType(
            (<MediaType>resource.getFormat()).toString()
          );
          const $listItem: JQuery = $(
            '<li><a href="' +
              resource.id +
              '" target="_blank">' +
              label +
              " (" +
              mime +
              ")" +
              "</li>"
          );
          this.$resources.append($listItem);
        }
      }
    }
  }

  dataBindThumbsView(): void {
    if (!this.thumbsView) return;

    let width: number;
    let height: number;

    const viewingDirection: ViewingDirection | null =
      this.extension.helper.getViewingDirection();

    if (
      viewingDirection &&
      (viewingDirection === ViewingDirection.LEFT_TO_RIGHT ||
        viewingDirection === ViewingDirection.RIGHT_TO_LEFT)
    ) {
      width = this.config.options.twoColThumbWidth;
      height = this.config.options.twoColThumbHeight;
    } else {
      width = this.config.options.oneColThumbWidth;
      height = this.config.options.oneColThumbHeight;
    }

    if (typeof width === "undefined") {
      width = 100;
    }

    if (typeof height === "undefined") {
      height = 100;
    }

    this.thumbsView.thumbs = this.extension.helper.getThumbs(width, height);
    // hide thumb selector for single-part manifests
    if (this.thumbsView.thumbs.length < 2) {
      this.$thumbsView.hide();
    }
    this.thumbsView.databind();
  }

  expandFullStart(): void {
    super.expandFullStart();
    this.extensionHost.publish(IIIFEvents.LEFTPANEL_EXPAND_FULL_START);
  }

  expandFullFinish(): void {
    super.expandFullFinish();

    this.extensionHost.publish(IIIFEvents.LEFTPANEL_EXPAND_FULL_FINISH);
  }

  collapseFullStart(): void {
    super.collapseFullStart();

    this.extensionHost.publish(IIIFEvents.LEFTPANEL_COLLAPSE_FULL_START);
  }

  collapseFullFinish(): void {
    super.collapseFullFinish();

    this.extensionHost.publish(IIIFEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
  }

  resize(): void {
    super.resize();

    this.$views.height(this.$main.height());
    this.$resources.height(this.$main.height());
  }
}
