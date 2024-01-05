import { IIIFEvents } from "../../IIIFEvents";
import { ContentLeftPanel } from "../../extensions/config/ContentLeftPanel";
import { BaseView } from "../uv-shared-module/BaseView";
import { GalleryComponent } from "@iiif/iiif-gallery-component";
import $ from "jquery"; 

export class GalleryView extends BaseView<ContentLeftPanel> {
  isOpen: boolean = false;
  galleryComponent: any;
  galleryData: any;
  $gallery: JQuery;
  $extendLabelsCheckbox: JQuery | undefined;

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
      function (thumb: any) {
        that.extensionHost.publish(IIIFEvents.GALLERY_THUMB_SELECTED, thumb);
        that.extensionHost.publish(IIIFEvents.THUMB_SELECTED, thumb);
      },
      false
    );

    this.galleryComponent.on(
      "decreaseSize",
      function () {
        that.extensionHost.publish(IIIFEvents.GALLERY_DECREASE_SIZE);
      },
      false
    );

    this.galleryComponent.on(
      "increaseSize",
      function () {
        that.extensionHost.publish(IIIFEvents.GALLERY_INCREASE_SIZE);
      },
      false
    );

    setTimeout(() => {
      const labelHasOverflow = this.checkLabelOverflow();

      if (labelHasOverflow) {
        this.$extendLabelsCheckbox = $('<input type="checkbox" id="extendLabelsCheckbox">');
        const $label = $('<label for="extendLabelsCheckbox">Show full labels</label>');

        this.$element.prepend($label);
        this.$element.prepend(this.$extendLabelsCheckbox);

        this.$extendLabelsCheckbox.on('change', () => {
          const extendLabels = this.$extendLabelsCheckbox?.prop('checked');
          if (extendLabels !== undefined) {
            this.toggleLabelExtension(extendLabels);
          }
        });
      }
    }, 0);
  }

  public databind(): void {
    this.galleryComponent.options.data = this.galleryData;
    this.galleryComponent.set(this.galleryData);
    this.resize();
  }

  show(): void {
    this.isOpen = true;
    this.$element.show();

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

  checkLabelOverflow(): boolean {
    const $labels = this.$gallery.find('.info .label');
    for (let i = 0; i < $labels.length; i++) {
      const label = $labels[i];
      if (label.scrollWidth > label.clientWidth) {
        return true;
      }
    }
    return false;
  }

  toggleLabelExtension(extendLabels: boolean): void {
    if (extendLabels) {
      this.$gallery.find('.info .label').css({
        'overflow-x': 'visible',
        'text-overflow': 'nowrap',
        'white-space': 'break-spaces',
        'max-width': '100%',
      });
    } else {
      this.$gallery.find('.info .label').css({
        'overflow-x': 'hidden',
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap',
        'max-width': '100%',
      });
    }
  }
}
