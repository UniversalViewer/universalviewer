const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { Dialogue } from "../uv-shared-module/Dialogue";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { Mode } from "../../extensions/uv-openseadragon-extension/Mode";
import { Bools } from "@edsilv/utils";
import { GalleryComponent } from "@iiif/iiif-gallery-component";
// import { GalleryComponent } from "../../GalleryComponent";
import { MultiSelectState } from "@iiif/manifold";

export class MultiSelectDialogue extends Dialogue {
  $title: JQuery;
  $gallery: JQuery;
  galleryComponent: any;
  data: any;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("multiSelectDialogue");

    super.create();

    const that = this;

    this.openCommand = IIIFEvents.SHOW_MULTISELECT_DIALOGUE;
    this.closeCommand = IIIFEvents.HIDE_MULTISELECT_DIALOGUE;

    this.extensionHost.subscribe(this.openCommand, () => {
      this.open();
      const multiSelectState: MultiSelectState = this.extension.helper.getMultiSelectState();
      multiSelectState.setEnabled(true);
      this.galleryComponent.set(this.data);
    });

    this.extensionHost.subscribe(this.closeCommand, () => {
      this.close();
      const multiSelectState: MultiSelectState = this.extension.helper.getMultiSelectState();
      multiSelectState.setEnabled(false);
    });

    this.$title = $(`<div role="heading" class="heading"></div>`);
    this.$content.append(this.$title);
    this.$title.text(this.content.title);

    this.$gallery = $('<div class="iiif-gallery-component"></div>');
    this.$content.append(this.$gallery);

    this.data = {
      helper: this.extension.helper,
      chunkedResizingThreshold: this.config.options
        .galleryThumbChunkedResizingThreshold,
      content: this.config.content,
      debug: false,
      imageFadeInDuration: 300,
      initialZoom: 4,
      minLabelWidth: 20,
      pageModeEnabled: this.isPageModeEnabled(),
      searchResults: [],
      scrollStopDuration: 100,
      sizingEnabled: true,
      thumbHeight: this.config.options.galleryThumbHeight,
      thumbLoadPadding: this.config.options.galleryThumbLoadPadding,
      thumbWidth: this.config.options.galleryThumbWidth,
      viewingDirection: this.extension.helper.getViewingDirection(),
    };

    this.galleryComponent = new GalleryComponent({
      target: <HTMLElement>this.$gallery[0],
    });

    const $selectButton: JQuery = this.$gallery.find("a.select");
    $selectButton.addClass("btn btn-primary");

    this.galleryComponent.on(
      "multiSelectionMade",
      (ids: string[]) => {
        this.extensionHost.publish(IIIFEvents.MULTISELECTION_MADE, ids);
        that.close();
      },
      false
    );

    this.$element.hide();
  }

  isPageModeEnabled(): boolean {
    return (
      Bools.getBool(this.config.options.pageModeEnabled, true) &&
      (<OpenSeadragonExtension>this.extension).getMode().toString() ===
        Mode.page.toString()
    );
  }

  open(): void {
    super.open();
  }

  close(): void {
    super.close();
  }

  resize(): void {
    super.resize();

    const $main: JQuery = this.$gallery.find(".main");
    const $header: JQuery = this.$gallery.find(".header");
    $main.height(
      this.$content.height() -
        this.$title.outerHeight() -
        this.$title.verticalMargins() -
        $header.height()
    );
  }
}
