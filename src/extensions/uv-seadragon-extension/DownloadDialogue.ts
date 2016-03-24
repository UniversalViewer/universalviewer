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
    $canvasOptionsContainer: JQuery;
    $canvasOptions: JQuery;
    $currentViewAsJpgButton: JQuery;
    $downloadButton: JQuery;
    $imageOptionsContainer: JQuery;
    $imageOptions: JQuery;
    $pagingNote: JQuery;
    $selectionButton: JQuery;
    $settingsButton: JQuery;
    $sequenceOptionsContainer: JQuery;
    $sequenceOptions: JQuery;
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

        this.$imageOptionsContainer = $('<li class="group image"></li>');
        this.$downloadOptions.append(this.$imageOptionsContainer);
        this.$imageOptions = $('<ul></ul>');
        this.$imageOptionsContainer.append(this.$imageOptions);

        this.$currentViewAsJpgButton = $('<li class="option"><input id="' + DownloadOption.currentViewAsJpg.toString() + '" type="radio" name="downloadOptions" /><label for="' + DownloadOption.currentViewAsJpg.toString() + '"></label></li>');
        this.$imageOptions.append(this.$currentViewAsJpgButton);
        this.$currentViewAsJpgButton.hide();

        this.$wholeImageHighResButton = $('<li class="option"><input id="' + DownloadOption.wholeImageHighRes.toString() + '" type="radio" name="downloadOptions" /><label id="' + DownloadOption.wholeImageHighRes.toString() + 'label" for="' + DownloadOption.wholeImageHighRes.toString() + '"></label></li>');
        this.$imageOptions.append(this.$wholeImageHighResButton);
        this.$wholeImageHighResButton.hide();

        this.$wholeImageLowResAsJpgButton = $('<li class="option"><input id="' + DownloadOption.wholeImageLowResAsJpg.toString() + '" type="radio" name="downloadOptions" /><label for="' + DownloadOption.wholeImageLowResAsJpg.toString() + '">' + this.content.wholeImageLowResAsJpg + '</label></li>');
        this.$imageOptions.append(this.$wholeImageLowResAsJpgButton);
        this.$wholeImageLowResAsJpgButton.hide();

        this.$canvasOptionsContainer = $('<li class="group canvas"></li>');
        this.$downloadOptions.append(this.$canvasOptionsContainer);
        this.$canvasOptions = $('<ul></ul>');
        this.$canvasOptionsContainer.append(this.$canvasOptions);

        this.$sequenceOptionsContainer = $('<li class="group sequence"></li>');
        this.$downloadOptions.append(this.$sequenceOptionsContainer);
        this.$sequenceOptions = $('<ul></ul>');
        this.$sequenceOptionsContainer.append(this.$sequenceOptions);

        this.$selectionButton = $('<li class="option"><input id="' + DownloadOption.selection.toString() + '" type="radio" name="downloadOptions" /><label id="' + DownloadOption.selection.toString() + 'label" for="' + DownloadOption.selection.toString() + '"></label></li>');
        this.$sequenceOptions.append(this.$selectionButton);
        this.$selectionButton.hide();

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
                    case DownloadOption.selection.toString():
                        $.publish(Commands.ENTER_MULTISELECT_MODE, [this.content.downloadSelectionButton]);
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

            if (dimensions){
                label = String.format(label, dimensions.size.width, dimensions.size.height);
                $label.text(label);
                this.$currentViewAsJpgButton.show();
            } else {
                this.$currentViewAsJpgButton.hide();
            }
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

        if (this.isDownloadOptionAvailable(DownloadOption.selection)) {
            var $label: JQuery = this.$selectionButton.find('label');
            $label.text(this.content.downloadSelection);
            this.$selectionButton.show();
        } else {
            this.$selectionButton.hide();
        }

        this.resetDynamicDownloadOptions();

        if (this.isDownloadOptionAvailable(DownloadOption.dynamicImageRenderings)) {
            var images = canvas.getImages();
            for (var i = 0; i < images.length; i++) {
                this.addDownloadOptionsForRenderings(images[i].getResource(), this.content.entireFileAsOriginal, DownloadOption.dynamicImageRenderings);
            }
        }

        if (this.isDownloadOptionAvailable(DownloadOption.dynamicCanvasRenderings)) {
            this.addDownloadOptionsForRenderings(canvas, this.content.entireFileAsOriginal, DownloadOption.dynamicCanvasRenderings);
        }

        if (this.isDownloadOptionAvailable(DownloadOption.dynamicSequenceRenderings)) {
            this.addDownloadOptionsForRenderings(this.provider.getCurrentSequence(), this.content.entireDocument, DownloadOption.dynamicSequenceRenderings);
        }

        if (!this.$downloadOptions.find('li.option:visible').length){
            this.$noneAvailable.show();
            this.$downloadButton.hide();
        } else {
            // select first option.
            this.$downloadOptions.find('li.option input:visible:first').prop("checked", true);
            this.$noneAvailable.hide();
            this.$downloadButton.show();
        }

        // hide empty groups
        this.$downloadOptions.find('li.group').each((index, group) => {
            var $group: JQuery = $(group);

            $group.show();

            if ($group.find('li.option:hidden').length === $group.find('li.option').length){
                // all options are hidden, hide group.
                $group.hide();
            }
        });

        if ((<ISeadragonProvider>this.provider).isPagingSettingEnabled()) {
            this.$pagingNote.show();
        } else {
            this.$pagingNote.hide();
        }

        this.resize();
    }

    resetDynamicDownloadOptions() {
        this.renderingUrls = [];
        this.renderingUrlsCount = 0;
        this.$downloadOptions.find('li.dynamic').remove();
    }

    addDownloadOptionsForRenderings(resource: Manifesto.IManifestResource, defaultLabel: string, type: DownloadOption) {
        var renderings: Manifesto.IRendering[] = resource.getRenderings();

        for (var i = 0; i < renderings.length; i++) {
            var rendering: Manifesto.IRendering = renderings[i];
            if (rendering) {
                var label: string = rendering.getLabel();
                var currentId: string = "dynamic_download_" + ++this.renderingUrlsCount;
                if (label) {
                    label += " ({0})";
                } else {
                    label = defaultLabel;
                }
                label = String.format(label, this.simplifyMimeType(rendering.getFormat().toString()));
                this.renderingUrls[currentId] = rendering.id;
                var newButton = $('<li class="option dynamic"><input id="' + currentId + '" type="radio" name="downloadOptions" /><label for="' + currentId + '">' + label + '</label></li>');

                switch (type) {
                    case DownloadOption.dynamicImageRenderings:
                        this.$imageOptions.append(newButton);
                        break;
                    case DownloadOption.dynamicCanvasRenderings:
                        this.$canvasOptions.append(newButton);
                        break;
                    case DownloadOption.dynamicSequenceRenderings:
                        this.$sequenceOptions.append(newButton);
                        break;
                }
            }
        }
    }

    getSelectedOption() {
        return this.$downloadOptions.find("li.option input:checked");
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
        var image = this.getCurrentCanvasImageResource();
        var size = new Size(0, 0);

        if (!image) return size;

        size.width = image.getWidth();
        size.height = image.getHeight();

        var maxWidth: number = image.getMaxWidth();
        var maxHeight: number = image.getMaxHeight();

        var configMaxWidth: number = this.options.maxImageWidth;

        if (maxWidth){

            if (configMaxWidth){
                maxWidth = Math.min(maxWidth, configMaxWidth);
            }

            size.width = Math.min(size.width, maxWidth);
            size.height = Math.min(size.height, maxHeight);
        }

        return size;
    }

    isDownloadOptionAvailable(option: DownloadOption): boolean {
        switch (option){
            case DownloadOption.currentViewAsJpg:
            case DownloadOption.dynamicCanvasRenderings:
            case DownloadOption.dynamicImageRenderings:
            case DownloadOption.wholeImageHighRes:
                return !(<ISeadragonProvider>this.provider).isPagingSettingEnabled();
            case DownloadOption.wholeImageLowResAsJpg:
                // hide low-res option if hi-res width is smaller than constraint
                var size: Size = this.getDimensionsForCurrentCanvas();
                return (!(<ISeadragonProvider>this.provider).isPagingSettingEnabled() && (size.width > this.options.confinedImageSize));
            case DownloadOption.selection:
                return this.options.selectionEnabled;
            default:
                return true;
        }
    }
}

export = DownloadDialogue;