const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { BaseView } from "../uv-shared-module/BaseView";
import { GalleryComponent } from "@iiif/iiif-gallery-component";

export class GalleryView extends BaseView {
  isOpen: boolean = false;
  galleryComponent: any;
  galleryData: any;
  $gallery: JQuery;

  constructor($element: JQuery) {
    super($element, true, true);
  }

  create(): void {
    this.setConfig("contentLeftPanel");
    super.create();

    this.$gallery = $('<div class="iiif-gallery-component"></div>');
    this.$element.append(this.$gallery);
  }

  public setup(): void {
    const that = this;

    this.galleryComponent = new GalleryComponent({
      target: <HTMLElement>this.$gallery[0],
    });

    this.galleryComponent.on(
      "thumbSelected",
      function(thumb: any) {
        that.extensionHost.publish(IIIFEvents.GALLERY_THUMB_SELECTED, thumb);
        that.extensionHost.publish(IIIFEvents.THUMB_SELECTED, thumb);
      },
      false
    );

    this.galleryComponent.on(
      "decreaseSize",
      function() {
        that.extensionHost.publish(IIIFEvents.GALLERY_DECREASE_SIZE);
      },
      false
    );

    this.galleryComponent.on(
      "increaseSize",
      function() {
        that.extensionHost.publish(IIIFEvents.GALLERY_INCREASE_SIZE);
      },
      false
    );
  }

  public databind(): void {
    this.galleryComponent.options.data = this.galleryData;
    this.galleryComponent.set(this.galleryData);
    this.resize();
  }

  show(): void {
    this.isOpen = true;
    this.$element.show();

    // todo: would be better to have no imperative methods on components and use a reactive pattern
    setTimeout(() => {
      this.galleryComponent.selectIndex(this.extension.helper.canvasIndex);
    }, 10);
  }

  hide(): void {
    this.isOpen = false;
    this.$element.hide();
  }

  resize(): void {
    super.resize();
    const $main: JQuery = this.$gallery.find(".main");
    const $header: JQuery = this.$gallery.find(".header");
    $main.height(this.$element.height() - $header.height());
  }
}
