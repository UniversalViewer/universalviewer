import BaseCommands = require("../../modules/uv-shared-module/BaseCommands");
import BaseDownloadDialogue = require("../../modules/uv-dialogues-module/DownloadDialogue");
import Commands = require("./Commands");
import CroppedImageDimensions = require("./CroppedImageDimensions");
import DownloadOption = require("../../modules/uv-shared-module/DownloadOption");
import DownloadType = require("./DownloadType");
import ISeadragonExtension = require("./ISeadragonExtension");
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

            var $selectedOption = that.getSelectedOption();

            var id: string = $selectedOption.attr('id');
            var label: string = $selectedOption.attr('title');
            var mime: any = $selectedOption.data('mime');
            var type: string = DownloadType.UNKNOWN;
            var canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

            if (this.renderingUrls[id]) {
                if (mime){
                    if (mime.toLowerCase().indexOf('pdf') !== -1){
                        type = DownloadType.ENTIREDOCUMENTASPDF;
                    } else if (mime.toLowerCase().indexOf('txt') !== -1){
                        type = DownloadType.ENTIREDOCUMENTASTEXT;
                    }
                }
                window.open(this.renderingUrls[id]);
            } else {
                switch (id){
                    case DownloadOption.currentViewAsJpg.toString():
                        var viewer = (<ISeadragonExtension>that.extension).getViewer();
                        window.open((<ISeadragonExtension>that.extension).getCroppedImageUri(canvas, viewer));
                        type = DownloadType.CURRENTVIEW;
                        break;
                    case DownloadOption.selection.toString():
                        $.publish(Commands.ENTER_MULTISELECT_MODE, [this.content.downloadSelectionButton]);
                        break;
                    case DownloadOption.wholeImageHighRes.toString():
                        window.open(this.getHighResImageUriForCurrentCanvas());
                        type = DownloadType.WHOLEIMAGEHIGHRES;
                        break;
                    case DownloadOption.wholeImageLowResAsJpg.toString():
                        window.open((<ISeadragonExtension>that.extension).getConfinedImageUri(canvas, that.options.confinedImageSize));
                        type = DownloadType.WHOLEIMAGELOWRES;
                        break;
                }
            }

            $.publish(BaseCommands.DOWNLOAD, [{
                "type": type,
                "label": label
            }]);

            this.close();
        });

        this.$settingsButton.onPressed(() => {
            $.publish(BaseCommands.HIDE_DOWNLOAD_DIALOGUE);
            $.publish(BaseCommands.SHOW_SETTINGS_DIALOGUE);
        });
    }

    open() {
        super.open();

        var canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

        if (this.isDownloadOptionAvailable(DownloadOption.currentViewAsJpg)) {
            var $input: JQuery = this.$currentViewAsJpgButton.find('input');
            var $label: JQuery = this.$currentViewAsJpgButton.find('label');
            var label: string = this.content.currentViewAsJpg;
            var viewer = (<ISeadragonExtension>this.extension).getViewer();
            var dimensions: CroppedImageDimensions = (<ISeadragonExtension>this.extension).getCroppedImageDimensions(canvas, viewer);

            if (dimensions){
                label = String.format(label, dimensions.size.width, dimensions.size.height);
                $label.text(label);
                $input.prop('title', label);
                this.$currentViewAsJpgButton.show();
            } else {
                this.$currentViewAsJpgButton.hide();
            }
        } else {
            this.$currentViewAsJpgButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.wholeImageHighRes)) {
            var $input: JQuery = this.$wholeImageHighResButton.find('input');
            var $label: JQuery = this.$wholeImageHighResButton.find('label');
            var mime = this.getMimeTypeForCurrentCanvas();

            if (mime){
                mime = Utils.Files.simplifyMimeType(mime);
            } else {
                mime = '?';
            }

            var size: Size = this.getComputedDimensionsForCurrentCanvas();

            if (!size){
                this.$wholeImageHighResButton.hide();
            } else {
                var label: string = String.format(this.content.wholeImageHighRes, size.width, size.height, mime);
                $label.text(label);
                $input.prop('title', label);
                this.$wholeImageHighResButton.show();
            }
        } else {
            this.$wholeImageHighResButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.wholeImageLowResAsJpg)) {
            var $input: JQuery = this.$wholeImageLowResAsJpgButton.find('input');
            var $label: JQuery = this.$wholeImageLowResAsJpgButton.find('label');
            var size: Size = (<ISeadragonExtension>this.extension).getConfinedImageDimensions(canvas, this.options.confinedImageSize);
            var label = String.format(this.content.wholeImageLowResAsJpg, size.width, size.height);
            $label.text(label);
            $input.prop('title', label);
            this.$wholeImageLowResAsJpgButton.show();
        } else {
            this.$wholeImageLowResAsJpgButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.selection)) {
            var $input: JQuery = this.$selectionButton.find('input');
            var $label: JQuery = this.$selectionButton.find('label');
            $label.text(this.content.downloadSelection);
            $input.prop('title', this.content.downloadSelection);
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
            this.addDownloadOptionsForRenderings(this.extension.helper.getCurrentSequence(), this.content.entireDocument, DownloadOption.dynamicSequenceRenderings);
        }

        // hide empty groups
        var $groups: JQuery = this.$downloadOptions.find('li.group');

        $groups.each((index, group) => {
            var $group: JQuery = $(group);

            $group.show();

            if ($group.find('li.option:hidden').length === $group.find('li.option').length){
                // all options are hidden, hide group.
                $group.hide();
            }
        });

        this.$downloadOptions.find('li.group:visible').last().addClass('lastVisible');

        if ((<ISeadragonExtension>this.extension).isPagingSettingEnabled()) {
            this.$pagingNote.show();
        } else {
            this.$pagingNote.hide();
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
                var currentId: string = "downloadOption" + ++this.renderingUrlsCount;
                if (label) {
                    label += " ({0})";
                } else {
                    label = defaultLabel;
                }
                var mime: string = Utils.Files.simplifyMimeType(rendering.getFormat().toString());
                label = String.format(label, mime);
                this.renderingUrls[currentId] = rendering.id;
                var $button = $('<li class="option dynamic"><input id="' + currentId + '" data-mime="' + mime + '" title="' + label + '" type="radio" name="downloadOptions" /><label for="' + currentId + '">' + label + '</label></li>');

                switch (type) {
                    case DownloadOption.dynamicImageRenderings:
                        this.$imageOptions.append($button);
                        break;
                    case DownloadOption.dynamicCanvasRenderings:
                        this.$canvasOptions.append($button);
                        break;
                    case DownloadOption.dynamicSequenceRenderings:
                        this.$sequenceOptions.append($button);
                        break;
                }
            }
        }
    }

    getSelectedOption() {
        return this.$downloadOptions.find("li.option input:checked");
    }

    getCurrentCanvasImageResource() {
        var images = this.extension.helper.getCurrentCanvas().getImages();
        if (images[0]) {
            return images[0].getResource();
        }
        return null;
    }

    getHighResImageUriForCurrentCanvas(): string {
        var canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();
        var size: Size = this.getComputedDimensionsForCurrentCanvas();
        if (size){
            var width: number = size.width;
            return canvas.getCanonicalImageUri(width);
        }
        return '';
    }

    getMimeTypeForCurrentCanvas() {
        var resource = this.getCurrentCanvasImageResource();
        var format: Manifesto.ResourceFormat = resource.getFormat();

        if (format){
            return format.toString();
        }

        return null;
    }

    getDimensionsForCurrentCanvas(): Size {
        var currentCanvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();
        return new Size(currentCanvas.externalResource.data.width, currentCanvas.externalResource.data.height);
    }

    getMaxDimensionsForCurrentCanvas(): Size {
        var currentCanvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();
        if (currentCanvas.externalResource.data.profile[1]){
            return new Size(currentCanvas.externalResource.data.profile[1].maxWidth, currentCanvas.externalResource.data.profile[1].maxHeight);
        }
        return null;
    }

    getComputedDimensionsForCurrentCanvas(): Size {
        var size: Size = this.getDimensionsForCurrentCanvas();
        var maxSize: Size =  this.getMaxDimensionsForCurrentCanvas();

        if (!maxSize) return null;

        var finalWidth: number = size.width;
        var finalHeight: number = size.height;

        // if the maxWidth is less than the advertised width
        if (!_.isUndefined(maxSize.width) && maxSize.width < size.width){
            finalWidth = maxSize.width;

            if (!_.isUndefined(maxSize.height)){
                finalHeight = maxSize.height;
            } else {
                // calculate finalHeight
                var ratio: number = Math.normalise(maxSize.width, 0, size.width);
                finalHeight = Math.floor(size.height * ratio);
            }
        }

        return new Size(finalWidth, finalHeight);
    }

    isDownloadOptionAvailable(option: DownloadOption): boolean {
        switch (option){
            case DownloadOption.currentViewAsJpg:
            case DownloadOption.dynamicCanvasRenderings:
            case DownloadOption.dynamicImageRenderings:
            case DownloadOption.wholeImageHighRes:
                if (!(<ISeadragonExtension>this.extension).isPagingSettingEnabled()){
                    var maxSize: Size = this.getMaxDimensionsForCurrentCanvas();
                    if (maxSize && _.isUndefined(maxSize.width)){
                        return true;
                    } else if (maxSize.width <= this.options.maxImageWidth){
                        return true;
                    }
                }
                return false;
            case DownloadOption.wholeImageLowResAsJpg:
                // hide low-res option if hi-res width is smaller than constraint
                var size: Size = this.getComputedDimensionsForCurrentCanvas();
                if (!size) return false;
                return (!(<ISeadragonExtension>this.extension).isPagingSettingEnabled() && (size.width > this.options.confinedImageSize));
            case DownloadOption.selection:
                return this.options.selectionEnabled;
            default:
                return super.isDownloadOptionAvailable(option);
        }
    }
}

export = DownloadDialogue;