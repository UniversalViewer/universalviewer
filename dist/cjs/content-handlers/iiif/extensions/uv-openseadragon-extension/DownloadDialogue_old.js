"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadDialogue = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var DownloadDialogue_1 = require("../../modules/uv-dialogues-module/DownloadDialogue");
var DownloadOption_1 = require("../../modules/uv-shared-module/DownloadOption");
var utils_1 = require("@edsilv/utils");
var manifesto_js_1 = require("manifesto.js");
var DownloadDialogue = /** @class */ (function (_super) {
    __extends(DownloadDialogue, _super);
    function DownloadDialogue($element) {
        return _super.call(this, $element) || this;
    }
    DownloadDialogue.prototype.create = function () {
        var _this = this;
        this.setConfig("downloadDialogue");
        _super.prototype.create.call(this);
        // create ui.
        this.$settingsButton = $('<a class="settings" href="#">' + this.content.editSettings + "</a>");
        this.$pagingNote = $('<div class="pagingNote">' + this.content.pagingNote + " </div>");
        this.$pagingNote.append(this.$settingsButton);
        this.$content.append(this.$pagingNote);
        this.$imageOptionsContainer = $('<li class="group image"></li>');
        this.$downloadOptions.append(this.$imageOptionsContainer);
        this.$imageOptions = $("<ul></ul>");
        this.$imageOptionsContainer.append(this.$imageOptions);
        this.$currentViewAsJpgButton = $('<li class="option single"><input id="' +
            DownloadOption_1.DownloadOption.CURRENT_VIEW +
            '" type="radio" name="downloadOptions" tabindex="0" /><label for="' +
            DownloadOption_1.DownloadOption.CURRENT_VIEW +
            '"></label></li>');
        this.$imageOptions.append(this.$currentViewAsJpgButton);
        this.$currentViewAsJpgButton.hide();
        this.$wholeImageHighResButton = $('<li class="option single"><input id="' +
            DownloadOption_1.DownloadOption.WHOLE_IMAGE_HIGH_RES +
            '" type="radio" name="downloadOptions" tabindex="0" /><label id="' +
            DownloadOption_1.DownloadOption.WHOLE_IMAGE_HIGH_RES +
            'label" for="' +
            DownloadOption_1.DownloadOption.WHOLE_IMAGE_HIGH_RES +
            '"></label></li>');
        this.$imageOptions.append(this.$wholeImageHighResButton);
        this.$wholeImageHighResButton.hide();
        this.$wholeImagesHighResButton = $('<li class="option multiple"><input id="' +
            DownloadOption_1.DownloadOption.WHOLE_IMAGES_HIGH_RES +
            '" type="radio" name="downloadOptions" tabindex="0" /><label id="' +
            DownloadOption_1.DownloadOption.WHOLE_IMAGES_HIGH_RES +
            'label" for="' +
            DownloadOption_1.DownloadOption.WHOLE_IMAGES_HIGH_RES +
            '"></label></li>');
        this.$imageOptions.append(this.$wholeImagesHighResButton);
        this.$wholeImageHighResButton.hide();
        this.$wholeImageLowResAsJpgButton = $('<li class="option single"><input id="' +
            DownloadOption_1.DownloadOption.WHOLE_IMAGE_LOW_RES +
            '" type="radio" name="downloadOptions" tabindex="0" /><label for="' +
            DownloadOption_1.DownloadOption.WHOLE_IMAGE_LOW_RES +
            '">' +
            this.content.wholeImageLowResAsJpg +
            "</label></li>");
        this.$imageOptions.append(this.$wholeImageLowResAsJpgButton);
        this.$wholeImageLowResAsJpgButton.hide();
        this.$canvasOptionsContainer = $('<li class="group canvas"></li>');
        this.$downloadOptions.append(this.$canvasOptionsContainer);
        this.$canvasOptions = $("<ul></ul>");
        this.$canvasOptionsContainer.append(this.$canvasOptions);
        this.$manifestOptionsContainer = $('<li class="group manifest"></li>');
        this.$downloadOptions.append(this.$manifestOptionsContainer);
        this.$manifestOptions = $("<ul></ul>");
        this.$manifestOptionsContainer.append(this.$manifestOptions);
        this.$selectionButton = $('<li class="option"><input id="' +
            DownloadOption_1.DownloadOption.SELECTION +
            '" type="radio" name="downloadOptions" tabindex="0" /><label id="' +
            DownloadOption_1.DownloadOption.SELECTION +
            'label" for="' +
            DownloadOption_1.DownloadOption.SELECTION +
            '"></label></li>');
        this.$manifestOptions.append(this.$selectionButton);
        this.$selectionButton.hide();
        this.$downloadButton = $('<a class="btn btn-primary" href="#" tabindex="0">' +
            this.content.download +
            "</a>");
        this.$buttons.prepend(this.$downloadButton);
        this.$explanatoryTextTemplate = $('<span class="explanatory"></span>');
        var that = this;
        // what happens on download is specific to the extension (except for renderings which need to be moved to the base download dialogue)
        // todo: we need to make everything a list of radio button options in the base class, then we can unify everything into a single render method
        this.$downloadButton.on("click", function (e) {
            e.preventDefault();
            var $selectedOption = that.getSelectedOption();
            var id = $selectedOption.attr("id");
            var label = $selectedOption.attr("title");
            var mime = $selectedOption.data("mime");
            var type = DownloadOption_1.DownloadOption.UNKNOWN;
            var canvas = _this.extension.helper.getCurrentCanvas();
            if (_this.renderingUrls[id]) {
                if (mime) {
                    if (mime.toLowerCase().indexOf("pdf") !== -1) {
                        type = DownloadOption_1.DownloadOption.ENTIRE_DOCUMENT_AS_PDF;
                    }
                    else if (mime.toLowerCase().indexOf("txt") !== -1) {
                        type = DownloadOption_1.DownloadOption.ENTIRE_DOCUMENT_AS_TEXT;
                    }
                }
                if ((type = DownloadOption_1.DownloadOption.ENTIRE_DOCUMENT_AS_PDF)) {
                    //var printService: manifesto.Service = this.extension.helper.manifest.getService(manifesto.ServiceProfile.printExtensions());
                    // if downloading a pdf - if there's a print service, generate an event instead of opening a new window.
                    // if (printService && this.extension.isOnHomeDomain()){
                    //     this.component.publish(Events.PRINT);
                    // } else {
                    window.open(_this.renderingUrls[id]);
                    //}
                }
            }
            else {
                type = id;
                switch (type) {
                    case DownloadOption_1.DownloadOption.CURRENT_VIEW:
                        var viewer = (that.extension).getViewer();
                        window.open((that.extension.getCroppedImageUri(canvas, viewer)));
                        break;
                    case DownloadOption_1.DownloadOption.SELECTION:
                        utils_1.Async.waitFor(function () {
                            return !_this.isActive;
                        }, function () {
                            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_MULTISELECT_DIALOGUE);
                        });
                        break;
                    case DownloadOption_1.DownloadOption.WHOLE_IMAGE_HIGH_RES:
                        window.open(_this.getCanvasHighResImageUri(_this.extension.helper.getCurrentCanvas()));
                        break;
                    case DownloadOption_1.DownloadOption.WHOLE_IMAGES_HIGH_RES:
                        var indices = _this.extension.getPagedIndices();
                        for (var i = 0; i < indices.length; i++) {
                            window.open(_this.getCanvasHighResImageUri(_this.extension.helper.getCanvasByIndex(indices[i])));
                        }
                        break;
                    case DownloadOption_1.DownloadOption.WHOLE_IMAGE_LOW_RES:
                        var imageUri = (that.extension).getConfinedImageUri(canvas, that.options.confinedImageSize);
                        if (imageUri) {
                            window.open(imageUri);
                        }
                        break;
                }
            }
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.DOWNLOAD, {
                type: type,
                label: label,
            });
            _this.close();
        });
        this.$settingsButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.HIDE_DOWNLOAD_DIALOGUE);
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_SETTINGS_DIALOGUE);
        });
    };
    DownloadDialogue.prototype.open = function (triggerButton) {
        _super.prototype.open.call(this, triggerButton);
        var canvas = this.extension.helper.getCurrentCanvas();
        var rotation = (this.extension.getViewerRotation());
        var hasNormalDimensions = rotation % 180 == 0;
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.CURRENT_VIEW)) {
            var $input = this.$currentViewAsJpgButton.find("input");
            var $label = this.$currentViewAsJpgButton.find("label");
            var label = this.content.currentViewAsJpg;
            var viewer = this.extension.getViewer();
            var dimensions = this.extension.getCroppedImageDimensions(canvas, viewer);
            // dimensions
            if (dimensions) {
                label = hasNormalDimensions
                    ? utils_1.Strings.format(label, dimensions.size.width.toString(), dimensions.size.height.toString())
                    : utils_1.Strings.format(label, dimensions.size.height.toString(), dimensions.size.width.toString());
                $label.text(label);
                $input.prop("title", label);
                this.$currentViewAsJpgButton.data("width", dimensions.size.width);
                this.$currentViewAsJpgButton.data("height", dimensions.size.height);
                this.$currentViewAsJpgButton.show();
            }
            else {
                this.$currentViewAsJpgButton.hide();
            }
            // explanatory text
            if (utils_1.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                var text = this.content.currentViewAsJpgExplanation;
                if (text) {
                    var $span = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }
            }
        }
        else {
            this.$currentViewAsJpgButton.hide();
        }
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.WHOLE_IMAGE_HIGH_RES)) {
            var $input = this.$wholeImageHighResButton.find("input");
            var $label = this.$wholeImageHighResButton.find("label");
            var mime = this.getCanvasMimeType(this.extension.helper.getCurrentCanvas());
            if (mime) {
                mime = utils_1.Files.simplifyMimeType(mime);
            }
            else {
                mime = "?";
            }
            // dimensions
            var size = this.getCanvasComputedDimensions(this.extension.helper.getCurrentCanvas());
            if (!size) {
                // if there is no image service, allow the image to be downloaded directly.
                if (canvas.externalResource &&
                    !canvas.externalResource.hasServiceDescriptor()) {
                    var label = utils_1.Strings.format(this.content.wholeImageHighRes, "?", "?", mime);
                    $label.text(label);
                    $input.prop("title", label);
                    this.$wholeImageHighResButton.show();
                }
                else {
                    this.$wholeImageHighResButton.hide();
                }
            }
            else {
                var label = hasNormalDimensions
                    ? utils_1.Strings.format(this.content.wholeImageHighRes, size.width.toString(), size.height.toString(), mime)
                    : utils_1.Strings.format(this.content.wholeImageHighRes, size.height.toString(), size.width.toString(), mime);
                $label.text(label);
                $input.prop("title", label);
                this.$wholeImageHighResButton.data("width", size.width);
                this.$wholeImageHighResButton.data("height", size.height);
                this.$wholeImageHighResButton.show();
            }
            // explanatory text
            if (utils_1.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                var text = this.content.wholeImageHighResExplanation;
                if (text) {
                    var $span = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }
            }
        }
        else {
            this.$wholeImageHighResButton.hide();
        }
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.WHOLE_IMAGES_HIGH_RES)) {
            var $input = this.$wholeImagesHighResButton.find("input");
            var $label = this.$wholeImagesHighResButton.find("label");
            var mime = this.getCanvasMimeType(this.extension.helper.getCurrentCanvas());
            if (mime) {
                mime = utils_1.Files.simplifyMimeType(mime);
            }
            else {
                mime = "?";
            }
            var label = utils_1.Strings.format(this.content.wholeImagesHighRes, mime);
            $label.text(label);
            $input.prop("title", label);
            this.$wholeImagesHighResButton.show();
            // explanatory text
            if (utils_1.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                var text = this.content.wholeImagesHighResExplanation;
                if (text) {
                    var $span = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }
            }
        }
        else {
            this.$wholeImagesHighResButton.hide();
        }
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.WHOLE_IMAGE_LOW_RES)) {
            var $input = this.$wholeImageLowResAsJpgButton.find("input");
            var $label = this.$wholeImageLowResAsJpgButton.find("label");
            var size = (this.extension).getConfinedImageDimensions(canvas, this.options.confinedImageSize);
            var label = hasNormalDimensions
                ? utils_1.Strings.format(this.content.wholeImageLowResAsJpg, size.width.toString(), size.height.toString())
                : utils_1.Strings.format(this.content.wholeImageLowResAsJpg, size.height.toString(), size.width.toString());
            $label.text(label);
            $input.prop("title", label);
            this.$wholeImageLowResAsJpgButton.data("width", size.width);
            this.$wholeImageLowResAsJpgButton.data("height", size.height);
            this.$wholeImageLowResAsJpgButton.show();
            // explanatory text
            if (utils_1.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                var text = this.content.wholeImageLowResAsJpgExplanation;
                if (text) {
                    var $span = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }
            }
        }
        else {
            this.$wholeImageLowResAsJpgButton.hide();
        }
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.SELECTION)) {
            var $input = this.$selectionButton.find("input");
            var $label = this.$selectionButton.find("label");
            $label.text(this.content.downloadSelection);
            $input.prop("title", this.content.downloadSelection);
            this.$selectionButton.show();
            // explanatory text
            if (utils_1.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {
                var text = this.content.selectionExplanation;
                if (text) {
                    var $span = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }
            }
        }
        else {
            this.$selectionButton.hide();
        }
        this.resetDynamicDownloadOptions();
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.RANGE_RENDERINGS)) {
            if (canvas.ranges && canvas.ranges.length) {
                for (var i = 0; i < canvas.ranges.length; i++) {
                    var range = canvas.ranges[i];
                    var renderingOptions = this.getDownloadOptionsForRenderings(range, this.content.entireFileAsOriginal, DownloadOption_1.DownloadOption.CANVAS_RENDERINGS);
                    this.addDownloadOptionsForRenderings(renderingOptions);
                }
            }
        }
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.IMAGE_RENDERINGS)) {
            var images = canvas.getImages();
            for (var i = 0; i < images.length; i++) {
                var renderingOptions = this.getDownloadOptionsForRenderings(images[i].getResource(), this.content.entireFileAsOriginal, DownloadOption_1.DownloadOption.IMAGE_RENDERINGS);
                this.addDownloadOptionsForRenderings(renderingOptions);
            }
        }
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.CANVAS_RENDERINGS)) {
            var renderingOptions = this.getDownloadOptionsForRenderings(canvas, this.content.entireFileAsOriginal, DownloadOption_1.DownloadOption.CANVAS_RENDERINGS);
            this.addDownloadOptionsForRenderings(renderingOptions);
        }
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.MANIFEST_RENDERINGS)) {
            var renderingOptions = this.getDownloadOptionsForRenderings(this.extension.helper.getCurrentSequence(), this.content.entireDocument, DownloadOption_1.DownloadOption.MANIFEST_RENDERINGS);
            if (!renderingOptions.length && this.extension.helper.manifest) {
                renderingOptions = this.getDownloadOptionsForRenderings(this.extension.helper.manifest, this.content.entireDocument, DownloadOption_1.DownloadOption.MANIFEST_RENDERINGS);
            }
            this.addDownloadOptionsForRenderings(renderingOptions);
        }
        // hide the current view option if it's equivalent to whole image.
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.CURRENT_VIEW)) {
            var currentWidth = parseInt(this.$currentViewAsJpgButton.data("width").toString());
            var currentHeight = parseInt(this.$currentViewAsJpgButton.data("height").toString());
            var wholeWidth = parseInt(this.$wholeImageHighResButton.data("width").toString());
            var wholeHeight = parseInt(this.$wholeImageHighResButton.data("height").toString());
            var percentageWidth = (currentWidth / wholeWidth) * 100;
            var percentageHeight = (currentHeight / wholeHeight) * 100;
            var disabledPercentage = this.options
                .currentViewDisabledPercentage;
            // if over disabledPercentage of the size of whole image
            if (percentageWidth >= disabledPercentage &&
                percentageHeight >= disabledPercentage) {
                this.$currentViewAsJpgButton.hide();
            }
            else {
                this.$currentViewAsJpgButton.show();
            }
        }
        // order by image area
        var $options = this.$imageOptions.find("li.single");
        $options = $options.sort(function (a, b) {
            var aWidth = $(a).data("width");
            aWidth ? (aWidth = parseInt(aWidth.toString())) : 0;
            var aHeight = $(a).data("height");
            aHeight ? (aHeight = parseInt(aHeight.toString())) : 0;
            var bWidth = $(b).data("width");
            bWidth ? (bWidth = parseInt(bWidth.toString())) : 0;
            var bHeight = $(b).data("height");
            bHeight ? (bHeight = parseInt(bHeight.toString())) : 0;
            var aArea = aWidth * aHeight;
            var bArea = bWidth * bHeight;
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
        var $groups = this.$downloadOptions.find("li.group");
        $groups.each(function (index, group) {
            var $group = $(group);
            $group.show();
            if ($group.find("li.option:hidden").length ===
                $group.find("li.option").length) {
                // all options are hidden, hide group.
                $group.hide();
            }
        });
        this.$downloadOptions
            .find("li.group:visible")
            .last()
            .addClass("lastVisible");
        if (this.extension.isPagingSettingEnabled() &&
            this.config.options.downloadPagingNoteEnabled) {
            this.$pagingNote.show();
        }
        else {
            this.$pagingNote.hide();
        }
        if (!this.$downloadOptions.find("li.option:visible").length) {
            this.$noneAvailable.show();
            this.$downloadButton.hide();
        }
        else {
            // select first option.
            this.$downloadOptions
                .find("li.option input:visible:first")
                .prop("checked", true);
            this.$noneAvailable.hide();
            this.$downloadButton.show();
        }
        this.resize();
    };
    DownloadDialogue.prototype.addDownloadOptionsForRenderings = function (renderingOptions) {
        var _this = this;
        renderingOptions.forEach(function (option) {
            switch (option.type) {
                case DownloadOption_1.DownloadOption.IMAGE_RENDERINGS:
                    _this.$imageOptions.append(option.button);
                    break;
                case DownloadOption_1.DownloadOption.CANVAS_RENDERINGS:
                    _this.$canvasOptions.append(option.button);
                    break;
                case DownloadOption_1.DownloadOption.MANIFEST_RENDERINGS:
                    _this.$manifestOptions.append(option.button);
                    break;
            }
        });
    };
    DownloadDialogue.prototype.getCanvasImageResource = function (canvas) {
        var images = canvas.getImages();
        if (images[0]) {
            return images[0].getResource();
        }
        return null;
    };
    DownloadDialogue.prototype.getCanvasHighResImageUri = function (canvas) {
        var size = this.getCanvasComputedDimensions(canvas);
        if (size) {
            var width = size.width;
            var uri = canvas.getCanonicalImageUri(width);
            if (canvas.externalResource &&
                canvas.externalResource.hasServiceDescriptor()) {
                var uri_parts = uri.split("/");
                var rotation = (this.extension.getViewerRotation());
                uri_parts[uri_parts.length - 2] = String(rotation);
                uri = uri_parts.join("/");
            }
            return uri;
        }
        else if (canvas.externalResource &&
            !canvas.externalResource.hasServiceDescriptor()) {
            // if there is no image service, return the dataUri.
            return canvas.externalResource.dataUri;
        }
        return "";
    };
    DownloadDialogue.prototype.getCanvasMimeType = function (canvas) {
        var resource = this.getCanvasImageResource(canvas);
        if (resource) {
            var format = resource.getFormat();
            if (format) {
                return format.toString();
            }
        }
        return null;
    };
    DownloadDialogue.prototype.getCanvasDimensions = function (canvas) {
        // externalResource may not have loaded yet
        if (canvas.externalResource.data) {
            var width = (canvas.externalResource.data).width;
            var height = (canvas.externalResource.data).height;
            if (width && height) {
                return new manifesto_js_1.Size(width, height);
            }
        }
        return null;
    };
    DownloadDialogue.prototype.getCanvasComputedDimensions = function (canvas) {
        var imageSize = this.getCanvasDimensions(canvas);
        var requiredSize = canvas.getMaxDimensions();
        if (!imageSize) {
            return null;
        }
        if (!requiredSize) {
            return imageSize;
        }
        if (imageSize.width <= requiredSize.width &&
            imageSize.height <= requiredSize.height) {
            return imageSize;
        }
        var scaleW = requiredSize.width / imageSize.width;
        var scaleH = requiredSize.height / imageSize.height;
        var scale = Math.min(scaleW, scaleH);
        return new manifesto_js_1.Size(Math.floor(imageSize.width * scale), Math.floor(imageSize.height * scale));
    };
    DownloadDialogue.prototype._isLevel0 = function (profile) {
        if (!profile || !profile.length)
            return false;
        return manifesto_js_1.Utils.isLevel0ImageProfile(profile[0]);
    };
    DownloadDialogue.prototype.isDownloadOptionAvailable = function (option) {
        if (!this.extension.resources) {
            return false;
        }
        var canvas = this.extension.helper.getCurrentCanvas();
        // if the external resource doesn't have a service descriptor or is level 0
        // only allow wholeImageHighRes
        if (!canvas.externalResource.hasServiceDescriptor() ||
            this._isLevel0(canvas.externalResource.data.profile)) {
            if (option === DownloadOption_1.DownloadOption.WHOLE_IMAGE_HIGH_RES) {
                // if in one-up mode, or in two-up mode with a single page being shown
                if (!this.extension.isPagingSettingEnabled() ||
                    (this.extension.isPagingSettingEnabled() &&
                        this.extension.resources &&
                        this.extension.resources.length === 1)) {
                    return true;
                }
            }
            return false;
        }
        switch (option) {
            case DownloadOption_1.DownloadOption.CURRENT_VIEW:
            case DownloadOption_1.DownloadOption.CANVAS_RENDERINGS:
            case DownloadOption_1.DownloadOption.IMAGE_RENDERINGS:
            case DownloadOption_1.DownloadOption.WHOLE_IMAGE_HIGH_RES:
                // if in one-up mode, or in two-up mode with a single page being shown
                if (!this.extension.isPagingSettingEnabled() ||
                    (this.extension.isPagingSettingEnabled() &&
                        this.extension.resources &&
                        this.extension.resources.length === 1)) {
                    var maxDimensions = canvas.getMaxDimensions();
                    if (maxDimensions) {
                        if (maxDimensions.width <= this.options.maxImageWidth) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            case DownloadOption_1.DownloadOption.WHOLE_IMAGES_HIGH_RES:
                if (this.extension.isPagingSettingEnabled() &&
                    this.extension.resources &&
                    this.extension.resources.length > 1) {
                    return true;
                }
                return false;
            case DownloadOption_1.DownloadOption.WHOLE_IMAGE_LOW_RES:
                // hide low-res option if hi-res width is smaller than constraint
                var size = this.getCanvasComputedDimensions(canvas);
                if (!size) {
                    return false;
                }
                return (!this.extension.isPagingSettingEnabled() &&
                    size.width > this.options.confinedImageSize);
            case DownloadOption_1.DownloadOption.SELECTION:
                return this.options.selectionEnabled;
            case DownloadOption_1.DownloadOption.RANGE_RENDERINGS:
                if (canvas.ranges && canvas.ranges.length) {
                    var range = canvas.ranges[0];
                    return range.getRenderings().length > 0;
                }
                return false;
            default:
                return _super.prototype.isDownloadOptionAvailable.call(this, option);
        }
    };
    return DownloadDialogue;
}(DownloadDialogue_1.DownloadDialogue));
exports.DownloadDialogue = DownloadDialogue;
//# sourceMappingURL=DownloadDialogue_old.js.map