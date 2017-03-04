import {Events} from "../../extensions/uv-seadragon-extension/Events";
import {Dialogue} from "../../modules/uv-shared-module/Dialogue";
import {ISeadragonExtension} from "../../extensions/uv-seadragon-extension/ISeadragonExtension";
import {Mode} from "../../extensions/uv-seadragon-extension/Mode";

export class MultiSelectDialogue extends Dialogue {

    $title: JQuery;
    $gallery: JQuery;
    component: IIIFComponents.IGalleryComponent;
    data: IIIFComponents.IGalleryComponentData;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('multiSelectDialogue');
        
        super.create();

        const that = this;

        this.openCommand = Events.SHOW_MULTISELECT_DIALOGUE;
        this.closeCommand = Events.HIDE_MULTISELECT_DIALOGUE;

        $.subscribe(this.openCommand, () => {
            this.open();
            const multiSelectState: Manifold.MultiSelectState = this.extension.helper.getMultiSelectState();
            multiSelectState.setEnabled(true);
            this.component.set(new Object()); // todo: should be passing data
        });

        $.subscribe(this.closeCommand, () => {
            this.close();
            const multiSelectState: Manifold.MultiSelectState = this.extension.helper.getMultiSelectState();
            multiSelectState.setEnabled(false);
        });

        this.$title = $('<h1></h1>');
        this.$content.append(this.$title);
        this.$title.text(this.content.title);

        this.$gallery = $('<div class="iiif-gallery-component"></div>');
        this.$content.append(this.$gallery);

        this.data = <IIIFComponents.IGalleryComponentData>{
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

        this.component = new IIIFComponents.GalleryComponent({
            target: this.$gallery[0],
            data: this.data
        });

        const $selectButton: JQuery = this.$gallery.find('a.select');
        $selectButton.addClass('btn btn-primary');

        (<any>this.component).on('multiSelectionMade', (ids: string[]) => {
            $.publish(Events.MULTISELECTION_MADE, [ids]);
            that.close();
        });

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