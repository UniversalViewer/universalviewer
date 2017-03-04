import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {BaseView} from "../uv-shared-module/BaseView";
import {Events} from "../../extensions/uv-seadragon-extension/Events";

export class GalleryView extends BaseView {

    isOpen: boolean = false;
    component: IIIFComponents.IGalleryComponent;
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
        //     this.component.searchPreviewStart(canvasIndex);
        // });

        // $.subscribe(Events.SEARCH_PREVIEW_FINISH, () => {
        //     this.component.searchPreviewFinish();
        // });

        this.$gallery = $('<div class="iiif-gallery-component"></div>');
        this.$element.append(this.$gallery);
    }

    public setup(): void {
        this.component = new IIIFComponents.GalleryComponent({
            target: this.$gallery[0], 
            data: this.galleryData
        });

        (<any>this.component).on('thumbSelected', function(thumb: any) {
            $.publish(Events.GALLERY_THUMB_SELECTED, [thumb]);
            $.publish(BaseEvents.THUMB_SELECTED, [thumb]);
        });

        (<any>this.component).on('decreaseSize', function() {
            $.publish(Events.GALLERY_DECREASE_SIZE);
        });

        (<any>this.component).on('increaseSize', function() {
            $.publish(Events.GALLERY_INCREASE_SIZE);
        });
    }

    public databind(): void {
        this.component.options.data = this.galleryData;
        this.component.set(new Object()); // todo: should be passing options.data
        this.resize();
    }

    show(): void {
        this.isOpen = true;
        this.$element.show();

        // todo: would be better to have no imperative methods on components and use a reactive pattern
        setTimeout(() => {
            this.component.selectIndex(this.extension.helper.canvasIndex);
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