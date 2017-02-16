import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import Dialogue = require("../../modules/uv-shared-module/Dialogue");
import ISeadragonExtension = require("../../extensions/uv-seadragon-extension/ISeadragonExtension");
import Mode = require("../../extensions/uv-seadragon-extension/Mode");

class MultiSelectDialogue extends Dialogue {

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

        var that = this;

        this.openCommand = Commands.SHOW_MULTISELECT_DIALOGUE;
        this.closeCommand = Commands.HIDE_MULTISELECT_DIALOGUE;

        $.subscribe(this.openCommand, (e, params) => {
            this.open();
            var multiSelectState: Manifold.MultiSelectState = this.extension.helper.getMultiSelectState();
            multiSelectState.setEnabled(true);
            this.component.set(null); // todo: should be passing data
        });

        $.subscribe(this.closeCommand, (e) => {
            this.close();
            var multiSelectState: Manifold.MultiSelectState = this.extension.helper.getMultiSelectState();
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

        var $selectButton: JQuery = this.$gallery.find('a.select');
        $selectButton.addClass('btn btn-primary');

        (<any>this.component).on('multiSelectionMade', (args) => {
            var ids = args[0];
            $.publish(Commands.MULTISELECTION_MADE, [ids]);
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

        var $main: JQuery = this.$gallery.find('.main');
        var $header: JQuery = this.$gallery.find('.header');
        $main.height(this.$content.height() - this.$title.outerHeight() - this.$title.verticalMargins() - $header.height());
    }
}

export = MultiSelectDialogue;