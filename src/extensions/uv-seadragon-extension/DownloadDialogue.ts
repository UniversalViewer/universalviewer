import BaseCommands = require("../../modules/uv-shared-module/BaseCommands");
import BaseDownloadDialogue = require("../../modules/uv-dialogues-module/DownloadDialogue");
import Commands = require("./Commands");
import DownloadOption = require("../../modules/uv-shared-module/DownloadOption");
import ISeadragonExtension = require("./ISeadragonExtension");
import ISeadragonProvider = require("./ISeadragonProvider");
import CroppedImageDimensions = require("./CroppedImageDimensions");
import Size = Utils.Measurements.Size;

class DownloadDialogue extends BaseDownloadDialogue {

    $buttonsContainer: JQuery;
    $currentViewAsJpgButton: JQuery;
    $downloadButton: JQuery;
    $pagingNote: JQuery;
    $settingsButton: JQuery;
    $wholeImageHighResButton: JQuery;
    $wholeImageLowResAsJpgButton: JQuery;
    renderingUrls: string[];
    renderingUrlsCount: number;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('downloadDialogue');

        super.create();

        // create ui.
        this.$settingsButton = $('<a class="settings" href="#">' + this.content.editSettings + '</a>');
        this.$pagingNote = $('<div class="pagingNote">' + this.content.pagingNote + ' </div>');
        this.$pagingNote.append(this.$settingsButton);
        this.$content.append(this.$pagingNote);

        this.$currentViewAsJpgButton = $('<li><input id="' + DownloadOption.currentViewAsJpg.toString() + '" type="radio" name="downloadOptions" /><label for="' + DownloadOption.currentViewAsJpg.toString() + '"></label></li>');
        this.$downloadOptions.append(this.$currentViewAsJpgButton);
        this.$currentViewAsJpgButton.hide();

        this.$wholeImageHighResButton = $('<li><input id="' + DownloadOption.wholeImageHighRes.toString() + '" type="radio" name="downloadOptions" /><label id="' + DownloadOption.wholeImageHighRes.toString() + 'label" for="' + DownloadOption.wholeImageHighRes.toString() + '"></label></li>');
        this.$downloadOptions.append(this.$wholeImageHighResButton);
        this.$wholeImageHighResButton.hide();

        this.$wholeImageLowResAsJpgButton = $('<li><input id="' + DownloadOption.wholeImageLowResAsJpg.toString() + '" type="radio" name="downloadOptions" /><label for="' + DownloadOption.wholeImageLowResAsJpg.toString() + '">' + this.content.wholeImageLowResAsJpg + '</label></li>');
        this.$downloadOptions.append(this.$wholeImageLowResAsJpgButton);
        this.$wholeImageLowResAsJpgButton.hide();

        this.$buttonsContainer = $('<div class="buttons"></div>');
        this.$content.append(this.$buttonsContainer);

        this.$downloadButton = $('<a class="btn btn-primary" href="#">' + this.content.download + '</a>');
        this.$buttonsContainer.append(this.$downloadButton);

        var that = this;

        this.$downloadButton.on('click', (e) => {
            e.preventDefault();

            var selectedOption = that.getSelectedOption();

            var id: string = selectedOption.attr('id');
            var canvas: Manifesto.ICanvas = this.provider.getCurrentCanvas();

            if (this.renderingUrls[id]) {
                if (id.toLowerCase().indexOf('pdf') !== -1){
                    $.publish(Commands.DOWNLOAD_ENTIREDOCUMENTASPDF);
                } else if (id.toLowerCase().indexOf('text') !== -1){
                    $.publish(Commands.DOWNLOAD_ENTIREDOCUMENTASTEXT);
                }
                window.open(this.renderingUrls[id]);
            } else {
                switch (id){
                    case DownloadOption.currentViewAsJpg.toString():
                        var viewer = (<ISeadragonExtension>that.extension).getViewer();
                        window.open((<ISeadragonProvider>that.provider).getCroppedImageUri(canvas, viewer));
                        $.publish(Commands.DOWNLOAD_CURRENTVIEW);
                        break;
                    case DownloadOption.wholeImageHighRes.toString():
                        window.open(this.getOriginalImageForCurrentCanvas());
                        $.publish(Commands.DOWNLOAD_WHOLEIMAGEHIGHRES);
                        break;
                    case DownloadOption.wholeImageLowResAsJpg.toString():
                        window.open((<ISeadragonProvider>that.provider).getConfinedImageUri(canvas, that.options.confinedImageSize));
                        $.publish(Commands.DOWNLOAD_WHOLEIMAGELOWRES);
                        break;
                }
            }

            $.publish(BaseCommands.DOWNLOAD, [id]);

            this.close();
        });

        this.$settingsButton.onPressed(() => {
            $.publish(BaseCommands.HIDE_DOWNLOAD_DIALOGUE);
            $.publish(BaseCommands.SHOW_SETTINGS_DIALOGUE);
        });
    }

    open() {
        super.open();

        var canvas: Manifesto.ICanvas = this.provider.getCurrentCanvas();

        if (this.isDownloadOptionAvailable(DownloadOption.currentViewAsJpg)) {
            var $label: JQuery = this.$currentViewAsJpgButton.find('label');
            var label: string = this.content.currentViewAsJpg;
            var viewer = (<ISeadragonExtension>this.extension).getViewer();
            var dimensions: CroppedImageDimensions = (<ISeadragonProvider>this.provider).getCroppedImageDimensions(canvas, viewer);
            label = String.format(label, dimensions.size.width, dimensions.size.height);
            $label.text(label);
            this.$currentViewAsJpgButton.show();
        } else {
            this.$currentViewAsJpgButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.wholeImageHighRes)) {
            var $label: JQuery = this.$wholeImageHighResButton.find('label');
            var mime = this.getMimeTypeForCurrentCanvas();
            var size: Size = this.getDimensionsForCurrentCanvas();
            var label = String.format(this.content.wholeImageHighRes, size.width, size.height, this.simplifyMimeType(mime));
            $label.text(label);
            this.$wholeImageHighResButton.show();
        } else {
            this.$wholeImageHighResButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.wholeImageLowResAsJpg)) {
            var $label: JQuery = this.$wholeImageLowResAsJpgButton.find('label');
            var size: Size = (<ISeadragonProvider>this.provider).getConfinedImageDimensions(canvas, this.options.confinedImageSize);
            var label = String.format(this.content.wholeImageLowResAsJpg, size.width, size.height);
            $label.text(label);
            this.$wholeImageLowResAsJpgButton.show();
        } else {
            this.$wholeImageLowResAsJpgButton.hide();
        }

        this.resetDynamicDownloadOptions();

        if (this.isDownloadOptionAvailable(DownloadOption.dynamicImageRenderings)) {
            var images = canvas.getImages();
            for (var i = 0; i < images.length; i++) {
                this.addDownloadOptionsForRenderings(images[i].getResource(), this.content.entireFileAsOriginal);
            }
        }

        if (this.isDownloadOptionAvailable(DownloadOption.dynamicCanvasRenderings)) {
            this.addDownloadOptionsForRenderings(canvas, this.content.entireFileAsOriginal);
        }

        if (this.isDownloadOptionAvailable(DownloadOption.dynamicSequenceRenderings)) {
            this.addDownloadOptionsForRenderings(this.provider.getCurrentSequence(), this.content.entireDocument);
        }

        if (!this.$downloadOptions.find('li:visible').length){
            this.$noneAvailable.show();
            this.$downloadButton.hide();
        } else {
            // select first option.
            this.$downloadOptions.find('input:visible:first').prop("checked", true);
            this.$noneAvailable.hide();
            this.$downloadButton.show();
        }

        if (this.provider.isPagingSettingEnabled()) {
            this.$pagingNote.show();
        } else {
            this.$pagingNote.hide();
        }

        this.resize();
    }

    resetDynamicDownloadOptions() {
        this.renderingUrls = [];
        this.renderingUrlsCount = 0;
        this.$downloadOptions.find('.dynamic').remove();
    }

    addDownloadOptionsForRenderings(resource: Manifesto.IManifestResource, defaultLabel: string) {
        var renderings: Manifesto.IRendering[] = resource.getRenderings();

        for (var i = 0; i < renderings.length; i++) {
            var rendering: Manifesto.IRendering = renderings[i];
            if (rendering) {
                var label: string = rendering.getLabel();
                var currentId: string;
                if (label) {
                    currentId = _.camelCase(label);
                    label += " ({0})";
                } else {
                    currentId = "dynamic_download_" + ++this.renderingUrlsCount;
                    label = defaultLabel;
                }
                label = String.format(label, this.simplifyMimeType(rendering.getFormat().toString()));
                this.renderingUrls[currentId] = rendering.id;
                var newButton = $('<li class="dynamic"><input id="' + currentId + '" type="radio" name="downloadOptions" /><label for="' + currentId + '">' + label + '</label></li>');
                this.$downloadOptions.append(newButton);
            }
        }
    }

    getSelectedOption() {
        return this.$downloadOptions.find("input:checked");
    }

    getCurrentCanvasImageResource() {
        var images = this.provider.getCurrentCanvas().getImages();
        if (images[0]) {
            return images[0].getResource();
        }
        return null;
    }

    getOriginalImageForCurrentCanvas() {
        var resource = this.getCurrentCanvasImageResource();
        return resource ? resource.id : null;
    }

    getMimeTypeForCurrentCanvas() {
        var resource = this.getCurrentCanvasImageResource();
        return resource ? resource.getFormat().toString() : null;
    }

    getDimensionsForCurrentCanvas(): Size {
        var resource = this.getCurrentCanvasImageResource();
        var size = new Size(0, 0);

        if (resource){
            size.width = resource.getWidth();
            size.height = resource.getHeight();
        }

        return size;
    }

    isDownloadOptionAvailable(option: DownloadOption): boolean {
        switch (option){
            case DownloadOption.currentViewAsJpg:
            case DownloadOption.dynamicCanvasRenderings:
            case DownloadOption.dynamicImageRenderings:
            case DownloadOption.wholeImageHighRes:
                return !this.provider.isPagingSettingEnabled();
            case DownloadOption.wholeImageLowResAsJpg:
                // hide low-res option if hi-res width is smaller than constraint
                var size: Size = this.getDimensionsForCurrentCanvas();
                return (!this.provider.isPagingSettingEnabled() && (size.width > this.options.confinedImageSize))
            default:
                return true;
        }
    }
}

export = DownloadDialogue;