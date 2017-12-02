import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {BaseView} from "../uv-shared-module/BaseView";

export class GalleryView extends BaseView {

    isOpen: boolean = false;
    galleryComponent: IIIFComponents.IGalleryComponent;
    galleryData: IIIFComponents.IGalleryComponentData;
    $gallery: JQuery;

    constructor($element: JQuery) {
        super($element, true, true);
    }

    create(): void {
        this.setConfig('contentLeftPanel');
        super.create();

        // search preview doesn't work well with the gallery because it loads thumbs in "chunks"

        // $.subscribe(Events.SEARCH_PREVIEW_START, (e, canvasIndex) => {
        //     this.galleryComponent.searchPreviewStart(canvasIndex);
        // });

        // $.subscribe(Events.SEARCH_PREVIEW_FINISH, () => {
        //     this.galleryComponent.searchPreviewFinish();
        // });

        this.$gallery = $('<div class="iiif-gallery-component"></div>');
        this.$element.append(this.$gallery);
    }

    public setup(): void {
        this.galleryComponent = new IIIFComponents.GalleryComponent({
            target: this.$gallery[0], 
            data: this.galleryData
        });

        this.galleryComponent.on('thumbSelected', function(thumb: any) {
            $.publish(BaseEvents.GALLERY_THUMB_SELECTED, [thumb]);
            $.publish(BaseEvents.THUMB_SELECTED, [thumb]);
        }, false);

        this.galleryComponent.on('decreaseSize', function() {
            $.publish(BaseEvents.GALLERY_DECREASE_SIZE);
        }, false);

        this.galleryComponent.on('increaseSize', function() {
            $.publish(BaseEvents.GALLERY_INCREASE_SIZE);
        }, false);
    }

    public databind(): void {
        this.galleryComponent.options.data = this.galleryData;
        this.galleryComponent.set(new Object()); // todo: should be passing options.data
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
        const $main: JQuery = this.$gallery.find('.main');
        const $header: JQuery = this.$gallery.find('.header');
        $main.height(this.$element.height() - $header.height());
    }
}