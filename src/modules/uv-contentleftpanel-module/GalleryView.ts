import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseView = require("../uv-shared-module/BaseView");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import ICanvas = Manifold.ICanvas;
import IRange = Manifold.IRange;
import ISeadragonExtension = require("../../extensions/uv-seadragon-extension/ISeadragonExtension");
import IThumb = Manifold.IThumb;
import ITreeNode = Manifold.ITreeNode;
import Mode = require("../../extensions/uv-seadragon-extension/Mode");

class GalleryView extends BaseView {

    isOpen: boolean = false;
    component: IIIFComponents.IGalleryComponent;
    galleryOptions: IIIFComponents.IGalleryComponentOptions;
    $gallery: JQuery;

    constructor($element: JQuery) {
        super($element, true, true);
    }

    create(): void {
        this.setConfig('contentLeftPanel');
        super.create();

        this.$gallery = $('<div class="iiif-gallery-component"></div>');
        this.$element.append(this.$gallery);
    }

    public setup(): void {
        this.component = new IIIFComponents.GalleryComponent(this.galleryOptions);

        (<any>this.component).on('thumbSelected', function(args) {
            var thumb = args[0];
            $.publish(Commands.GALLERY_THUMB_SELECTED, [thumb]);
            $.publish(BaseCommands.THUMB_SELECTED, [thumb]);
        });

        (<any>this.component).on('decreaseSize', function() {
            $.publish(Commands.GALLERY_DECREASE_SIZE);
        });

        (<any>this.component).on('increaseSize', function() {
            $.publish(Commands.GALLERY_INCREASE_SIZE);
        });
    }

    public databind(): void {
        this.component.options = this.galleryOptions;
        this.component.databind();
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
        var $galleryElement = $(this.galleryOptions.element);
        var $main: JQuery = $galleryElement.find('.main');
        var $header: JQuery = $galleryElement.find('.header');
        $main.height(this.$element.height() - $header.height());
    }
}

export = GalleryView;