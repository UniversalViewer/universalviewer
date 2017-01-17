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
    $explanatoryTextTemplate: JQuery;
    $imageOptionsContainer: JQuery;
    $imageOptions: JQuery;
    $selectionButton: JQuery;
    $sequenceOptionsContainer: JQuery;
    $sequenceOptions: JQuery;
    $wholeImageHighResButton: JQuery;
    $wholeImagesHighResButton: JQuery;
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
        // this.$settingsButton = $('<a class="settings" href="#">' + this.content.editSettings + '</a>');
        // this.$pagingNote = $('<div class="pagingNote">' + this.content.pagingNote + ' </div>');
        // this.$pagingNote.append(this.$settingsButton);
        // this.$content.append(this.$pagingNote);

        this.$imageOptionsContainer = $('<li class="group image"></li>');
        this.$downloadOptions.append(this.$imageOptionsContainer);
        this.$imageOptions = $('<ul></ul>');
        this.$imageOptionsContainer.append(this.$imageOptions);

        this.$currentViewAsJpgButton = $('<li class="option single"><input id="' + DownloadOption.currentViewAsJpg.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label for="' + DownloadOption.currentViewAsJpg.toString() + '"></label></li>');
        this.$imageOptions.append(this.$currentViewAsJpgButton);
        this.$currentViewAsJpgButton.hide();

        this.$wholeImageHighResButton = $('<li class="option single"><input id="' + DownloadOption.wholeImageHighRes.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption.wholeImageHighRes.toString() + 'label" for="' + DownloadOption.wholeImageHighRes.toString() + '"></label></li>');
        this.$imageOptions.append(this.$wholeImageHighResButton);
        this.$wholeImageHighResButton.hide();

        this.$wholeImagesHighResButton = $('<li class="option multiple"><input id="' + DownloadOption.wholeImagesHighRes.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption.wholeImagesHighRes.toString() + 'label" for="' + DownloadOption.wholeImagesHighRes.toString() + '"></label></li>');
        this.$imageOptions.append(this.$wholeImagesHighResButton);
        this.$wholeImageHighResButton.hide();

        this.$wholeImageLowResAsJpgButton = $('<li class="option single"><input id="' + DownloadOption.wholeImageLowResAsJpg.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label for="' + DownloadOption.wholeImageLowResAsJpg.toString() + '">' + this.content.wholeImageLowResAsJpg + '</label></li>');
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

        this.$selectionButton = $('<li class="option"><input id="' + DownloadOption.selection.toString() + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption.selection.toString() + 'label" for="' + DownloadOption.selection.toString() + '"></label></li>');
        this.$sequenceOptions.append(this.$selectionButton);
        this.$selectionButton.hide();

        this.$buttonsContainer = $('<div class="buttons"></div>');
        this.$content.append(this.$buttonsContainer);

        this.$downloadButton = $('<a class="btn btn-primary" href="#" tabindex="0">' + this.content.download + '</a>');
        this.$buttonsContainer.append(this.$downloadButton);

        this.$explanatoryTextTemplate = $('<span class="explanatory"></span>');

        var that = this;

        this.$downloadButton.on('click', (e) => {
            e.preventDefault();

            var $selectedOption: JQuery = that.getSelectedOption();

            var id: string = $selectedOption.attr('id');
            var label: string = $selectedOption.attr('title');
            var mime: any = $selectedOption.data('mime');
            var type: string = DownloadType.UNKNOWN;
            var canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

            if (this.renderingUrls[id]) {
                if (mime) {
                    if (mime.toLowerCase().indexOf('pdf') !== -1) {
                        type = DownloadType.ENTIREDOCUMENTASPDF;
                    } else if (mime.toLowerCase().indexOf('txt') !== -1) {
                        type = DownloadType.ENTIREDOCUMENTASTEXT;
                    }
                }

                if (type = DownloadType.ENTIREDOCUMENTASPDF) {
                    //var printService: Manifesto.IService = this.extension.helper.manifest.getService(manifesto.ServiceProfile.printExtensions());
                    
                    // if downloading a pdf - if there's a print service, generate an event instead of opening a new window.
                    // if (printService && this.extension.isOnHomeDomain()){
                    //     $.publish(Commands.PRINT);
                    // } else {
                        window.open(this.renderingUrls[id]);
                    //}
                }
            } else {
                switch (id) {
                    case DownloadOption.currentViewAsJpg.toString():
                        var viewer = (<ISeadragonExtension>that.extension).getViewer();
                        window.open((<ISeadragonExtension>that.extension).getCroppedImageUri(canvas, viewer));
                        type = DownloadType.CURRENTVIEW;
                        break;
                    case DownloadOption.selection.toString():
                        Utils.Async.waitFor(() => {
                            return !this.isActive;
                        }, () => {
                            $.publish(Commands.SHOW_MULTISELECT_DIALOGUE);
                        });
                        break;
                    case DownloadOption.wholeImageHighRes.toString():
                        window.open(this.getCanvasHighResImageUri(this.extension.helper.getCurrentCanvas()));
                        type = DownloadType.WHOLEIMAGEHIGHRES;
                        break;
                    case DownloadOption.wholeImagesHighRes.toString():
                        var indices: number[] = this.extension.getPagedIndices();

                        for (var i = 0; i < indices.length; i++) {
                            window.open(this.getCanvasHighResImageUri(this.extension.helper.getCanvasByIndex(indices[i])));
                        }

                        type = DownloadType.WHOLEIMAGESHIGHRES;
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

        // this.$settingsButton.onPressed(() => {
        //     $.publish(BaseCommands.HIDE_DOWNLOAD_DIALOGUE);
        //     $.publish(BaseCommands.SHOW_SETTINGS_DIALOGUE);
        // });
    }

    open($triggerButton?: JQuery) {
        super.open($triggerButton);

        var canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

        var rotation: number = (<ISeadragonExtension>this.extension).getViewerRotation();
        var hasNormalDimensions: boolean = rotation % 180 == 0;

        if (this.isDownloadOptionAvailable(DownloadOption.currentViewAsJpg)) {
            var $input: JQuery = this.$currentViewAsJpgButton.find('input');
            var $label: JQuery = this.$currentViewAsJpgButton.find('label');

            var label: string = this.content.currentViewAsJpg;
            var viewer = (<ISeadragonExtension>this.extension).getViewer();
            var dimensions: CroppedImageDimensions = (<ISeadragonExtension>this.extension).getCroppedImageDimensions(canvas, viewer);


            // dimensions
            if (dimensions){
                label = hasNormalDimensions ?
                  String.format(label, dimensions.size.width, dimensions.size.height) :
                  String.format(label, dimensions.size.height, dimensions.size.width);
                $label.text(label);
                $input.prop('title', label);
                this.$currentViewAsJpgButton.data('width', dimensions.size.width);
                this.$currentViewAsJpgButton.data('height', dimensions.size.height);
                this.$currentViewAsJpgButton.show();
            } else {
                this.$currentViewAsJpgButton.hide();
            }

            // explanatory text
            if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {                
                var text: string = this.content.currentViewAsJpgExplanation;
                if (text) {
                    var $span = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }                
            }
        } else {
            this.$currentViewAsJpgButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.wholeImageHighRes)) {
            var $input: JQuery = this.$wholeImageHighResButton.find('input');
            var $label: JQuery = this.$wholeImageHighResButton.find('label');
            var mime = this.getCanvasMimeType(this.extension.helper.getCurrentCanvas());

            if (mime){
                mime = Utils.Files.simplifyMimeType(mime);
            } else {
                mime = '?';
            }

            // dimensions
            var size: Size = this.getCanvasComputedDimensions(this.extension.helper.getCurrentCanvas());


            if (!size){
                this.$wholeImageHighResButton.hide();
            } else {
                var label: string = hasNormalDimensions ?
                  String.format(this.content.wholeImageHighRes, size.width, size.height, mime) :
                  String.format(this.content.wholeImageHighRes, size.height, size.width, mime);
                $label.text(label);
                $input.prop('title', label);
                this.$wholeImageHighResButton.data('width', size.width);
                this.$wholeImageHighResButton.data('height', size.height);
                this.$wholeImageHighResButton.show();
            }

            // explanatory text
            if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {                
                var text: string = this.content.wholeImageHighResExplanation;
                if (text) {
                    var $span = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }                
            }
        } else {
            this.$wholeImageHighResButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.wholeImagesHighRes)) {
            var $input: JQuery = this.$wholeImagesHighResButton.find('input');
            var $label: JQuery = this.$wholeImagesHighResButton.find('label');
            var mime = this.getCanvasMimeType(this.extension.helper.getCurrentCanvas());

            if (mime){
                mime = Utils.Files.simplifyMimeType(mime);
            } else {
                mime = '?';
            }
            
            var label: string = String.format(this.content.wholeImagesHighRes, mime);
            $label.text(label);
            $input.prop('title', label);

            this.$wholeImagesHighResButton.show();

            // explanatory text
            if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {                
                var text: string = this.content.wholeImagesHighResExplanation;
                if (text) {
                    var $span = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }                
            }
        } else {
            this.$wholeImagesHighResButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.wholeImageLowResAsJpg)) {
            var $input: JQuery = this.$wholeImageLowResAsJpgButton.find('input');
            var $label: JQuery = this.$wholeImageLowResAsJpgButton.find('label');
            var size: Size = (<ISeadragonExtension>this.extension).getConfinedImageDimensions(canvas, this.options.confinedImageSize);
            var label = hasNormalDimensions ?
              String.format(this.content.wholeImageLowResAsJpg, size.width, size.height) :
              String.format(this.content.wholeImageLowResAsJpg, size.height, size.width);
            $label.text(label);
            $input.prop('title', label);
            this.$wholeImageLowResAsJpgButton.data('width', size.width);
            this.$wholeImageLowResAsJpgButton.data('height', size.height);
            this.$wholeImageLowResAsJpgButton.show();

            // explanatory text
            if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {                
                var text: string = this.content.wholeImageLowResAsJpgExplanation;
                if (text) {
                    var $span = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }                
            }
        } else {
            this.$wholeImageLowResAsJpgButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.selection)) {
            var $input: JQuery = this.$selectionButton.find('input');
            var $label: JQuery = this.$selectionButton.find('label');
            $label.text(this.content.downloadSelection);
            $input.prop('title', this.content.downloadSelection);
            this.$selectionButton.show();

            // explanatory text
            if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {                
                var text: string = this.content.selectionExplanation;
                if (text) {
                    var $span = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }                
            }
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

        // hide the current view option if it's equivalent to whole image.
        if (this.isDownloadOptionAvailable(DownloadOption.currentViewAsJpg)) {
            var currentWidth: number = parseInt(this.$currentViewAsJpgButton.data('width').toString());
            var currentHeight: number = parseInt(this.$currentViewAsJpgButton.data('height').toString());
            var wholeWidth: number = parseInt(this.$wholeImageHighResButton.data('width').toString());
            var wholeHeight: number = parseInt(this.$wholeImageHighResButton.data('height').toString());

            var percentageWidth: number = (currentWidth / wholeWidth) * 100;
            var percentageHeight: number = (currentHeight / wholeHeight) * 100;

            var disabledPercentage: number = this.options.currentViewDisabledPercentage;

            // if over disabledPercentage of the size of whole image
            if (percentageWidth >= disabledPercentage && percentageHeight >= disabledPercentage) {
                this.$currentViewAsJpgButton.hide();
            } else {
                this.$currentViewAsJpgButton.show();
            }
        }

        // order by image area
        var $options: any = this.$imageOptions.find('li.single');

        $options = $options.sort((a, b) => {
            var aWidth: any = $(a).data('width');
            aWidth ? aWidth = parseInt(aWidth.toString()) : 0;

            var aHeight: any = $(a).data('height');
            aHeight ? aHeight = parseInt(aHeight.toString()) : 0;

            var bWidth: any = $(b).data('width');
            bWidth ? bWidth = parseInt(bWidth.toString()) : 0;

            var bHeight: any = $(b).data('height');
            bHeight ? bHeight = parseInt(bHeight.toString()) : 0;
            
            var aArea: number = aWidth * aHeight;
            var bArea: number = bWidth * bHeight;

            if (aArea < bArea) {
                return -1;
            }

            if (aArea > bArea) {
                return 1;
            }

            return 0; 
        });

        $options.detach().appendTo(this.$imageOptions);

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

    resetDynamicDownloadOptions(): void {
        this.renderingUrls = [];
        this.renderingUrlsCount = 0;
        this.$downloadOptions.find('li.dynamic').remove();
    }

    addDownloadOptionsForRenderings(resource: Manifesto.IManifestResource, defaultLabel: string, type: DownloadOption): void {
        var renderings: Manifesto.IRendering[] = resource.getRenderings();

        for (var i = 0; i < renderings.length; i++) {
            var rendering: Manifesto.IRendering = renderings[i];
            if (rendering) {
                var label: string = Manifesto.TranslationCollection.getValue(rendering.getLabel());
                var currentId: string = "downloadOption" + ++this.renderingUrlsCount;
                if (label) {
                    label += " ({0})";
                } else {
                    label = defaultLabel;
                }
                var mime: string = Utils.Files.simplifyMimeType(rendering.getFormat().toString());
                label = String.format(label, mime);
                this.renderingUrls[currentId] = rendering.id;
                var $button = $('<li class="option dynamic"><input id="' + currentId + '" data-mime="' + mime + '" title="' + label + '" type="radio" name="downloadOptions" tabindex="0" /><label for="' + currentId + '">' + label + '</label></li>');

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

    getCanvasImageResource(canvas: Manifesto.ICanvas) {
        var images = canvas.getImages();
        if (images[0]) {
            return images[0].getResource();
        }
        return null;
    }

    getCanvasHighResImageUri(canvas: Manifesto.ICanvas): string {
        var size: Size = this.getCanvasComputedDimensions(canvas);
        if (size){
            var width: number = size.width;
            var uri: string = canvas.getCanonicalImageUri(width);
            var uri_parts: string [] = uri.split('/');
            var rotation: number = (<ISeadragonExtension>this.extension).getViewerRotation();
            uri_parts[ uri_parts.length - 2 ] = String(rotation);
            uri = uri_parts.join('/');
            return uri;
        }
        return '';
    }

    getCanvasMimeType(canvas: Manifesto.ICanvas): string {
        var resource = this.getCanvasImageResource(canvas);
        var format: Manifesto.ResourceFormat = resource.getFormat();

        if (format){
            return format.toString();
        }

        return null;
    }

    getCanvasDimensions(canvas: Manifesto.ICanvas): Size {
        // externalResource may not have loaded yet
        if (canvas.externalResource.data){
            return new Size(canvas.externalResource.data.width, canvas.externalResource.data.height);
        }
        
        return new Size(0, 0);
    }

    getCanvasMaxDimensions(canvas: Manifesto.ICanvas): Size {
        if (canvas.externalResource.data && canvas.externalResource.data.profile[1]){
            return new Size(canvas.externalResource.data.profile[1].maxWidth, canvas.externalResource.data.profile[1].maxHeight);
        }
        return null;
    }

    getCanvasComputedDimensions(canvas: Manifesto.ICanvas): Size {
        var size: Size = this.getCanvasDimensions(canvas);
        var maxSize: Size =  this.getCanvasMaxDimensions(canvas);

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
                // if in one-up mode, or in two-up mode with a single page being shown
                if (!(<ISeadragonExtension>this.extension).isPagingSettingEnabled() || 
                    (<ISeadragonExtension>this.extension).isPagingSettingEnabled() && this.extension.resources && this.extension.resources.length === 1) {
                    var maxSize: Size = this.getCanvasMaxDimensions(this.extension.helper.getCurrentCanvas());
                    if (maxSize) {
                        if (_.isUndefined(maxSize.width)) {
                            return true;
                        } else if (maxSize.width <= this.options.maxImageWidth) {
                            return true;
                        }
                    }
                }
                return false;
            case DownloadOption.wholeImagesHighRes:
                if ((<ISeadragonExtension>this.extension).isPagingSettingEnabled() && this.extension.resources && this.extension.resources.length > 1) {
                    return true;
                }
                return false;
            case DownloadOption.wholeImageLowResAsJpg:
                // hide low-res option if hi-res width is smaller than constraint
                var size: Size = this.getCanvasComputedDimensions(this.extension.helper.getCurrentCanvas());
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
