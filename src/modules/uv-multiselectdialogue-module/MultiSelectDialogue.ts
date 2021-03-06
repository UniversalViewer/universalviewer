import { MultiSelectState } from '@iiif/manifold';
import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {Dialogue} from "../uv-shared-module/Dialogue";
import {ISeadragonExtension} from "../../extensions/uv-seadragon-extension/ISeadragonExtension";
import {Mode} from "../../extensions/uv-seadragon-extension/Mode";
import { GalleryComponent } from '@iiif/iiif-gallery-component';

export class MultiSelectDialogue extends Dialogue {

    $title: JQuery;
    $gallery: JQuery;
    galleryComponent: any;
    data: any;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('multiSelectDialogue');
        
        super.create();

        const that = this;

        this.openCommand = BaseEvents.SHOW_MULTISELECT_DIALOGUE;
        this.closeCommand = BaseEvents.HIDE_MULTISELECT_DIALOGUE;

        this.component.subscribe(this.openCommand, () => {
            this.open();
            const multiSelectState: MultiSelectState = this.extension.helper.getMultiSelectState();
            multiSelectState.setEnabled(true);
            this.galleryComponent.set(this.data);
        });

        this.component.subscribe(this.closeCommand, () => {
            this.close();
            const multiSelectState: MultiSelectState = this.extension.helper.getMultiSelectState();
            multiSelectState.setEnabled(false);
        });

        this.$title = $('<h1></h1>');
        this.$content.append(this.$title);
        this.$title.text(this.content.title);

        this.$gallery = $('<div class="iiif-gallery-component"></div>');
        this.$content.append(this.$gallery);

        this.data = {
            helper: this.extension.helper,
            chunkedResizingThreshold: this.config.options.galleryThumbChunkedResizingThreshold,
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
            viewingDirection: this.extension.helper.getViewingDirection()
        };

        this.galleryComponent = new GalleryComponent({
            target:  <HTMLElement>this.$gallery[0]
        });

        const $selectButton: JQuery = this.$gallery.find('a.select');
        $selectButton.addClass('btn btn-primary');

        this.galleryComponent.on('multiSelectionMade', (ids: string[]) => {
            this.component.publish(BaseEvents.MULTISELECTION_MADE, ids);
            that.close();
        }, false);

        this.$element.hide();
    }

    isPageModeEnabled(): boolean {
        return Utils.Bools.getBool(this.config.options.pageModeEnabled, true) && (<ISeadragonExtension>this.extension).getMode().toString() === Mode.page.toString();
    }

    open(): void {
        super.open();
    }

    close(): void {
        super.close();
    }

    resize(): void {
        super.resize();

        const $main: JQuery = this.$gallery.find('.main');
        const $header: JQuery = this.$gallery.find('.header');
        $main.height(this.$content.height() - this.$title.outerHeight() - this.$title.verticalMargins() - $header.height());
    }
}
