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
var DownloadDialogue_1 = require("../../modules/uv-dialogues-module/DownloadDialogue");
var DownloadOption_1 = require("../../modules/uv-shared-module/DownloadOption");
var IIIFEvents_1 = require("../../IIIFEvents");
var utils_1 = require("@edsilv/utils");
var DownloadDialogue = /** @class */ (function (_super) {
    __extends(DownloadDialogue, _super);
    function DownloadDialogue($element) {
        return _super.call(this, $element) || this;
    }
    DownloadDialogue.prototype.create = function () {
        var _this = this;
        this.setConfig("downloadDialogue");
        _super.prototype.create.call(this);
        this.$entireFileAsOriginal = $('<li class="option single"><input id="' +
            DownloadOption_1.DownloadOption.ENTIRE_FILE_AS_ORIGINAL +
            '" type="radio" name="downloadOptions" tabindex="0" /><label id="' +
            DownloadOption_1.DownloadOption.ENTIRE_FILE_AS_ORIGINAL +
            'label" for="' +
            DownloadOption_1.DownloadOption.ENTIRE_FILE_AS_ORIGINAL +
            '"></label></li>');
        this.$downloadOptions.append(this.$entireFileAsOriginal);
        this.$entireFileAsOriginal.hide();
        this.$downloadButton = $('<a class="btn btn-primary" href="#" tabindex="0">' +
            this.content.download +
            "</a>");
        this.$buttons.prepend(this.$downloadButton);
        this.$imageOptionsContainer = $('<li class="group image"></li>');
        this.$imageOptions = $("<ul></ul>");
        this.$imageOptionsContainer.append(this.$imageOptions);
        this.$canvasOptionsContainer = $('<li class="group canvas"></li>');
        this.$canvasOptions = $("<ul></ul>");
        this.$canvasOptionsContainer.append(this.$canvasOptions);
        this.$manifestOptionsContainer = $('<li class="group manifest"></li>');
        this.$manifestOptions = $("<ul></ul>");
        this.$manifestOptionsContainer.append(this.$manifestOptions);
        var that = this;
        this.$downloadButton.on("click", function (e) {
            e.preventDefault();
            var $selectedOption = that.getSelectedOption();
            var id = $selectedOption.attr("id");
            var label = $selectedOption.attr("title");
            var type = DownloadOption_1.DownloadOption.UNKNOWN;
            if (_this.renderingUrls[id]) {
                window.open(_this.renderingUrls[id]);
            }
            else {
                var id_1 = _this.getCurrentResourceId();
                window.open(id_1);
            }
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.DOWNLOAD, {
                type: type,
                label: label,
            });
            _this.close();
        });
    };
    DownloadDialogue.prototype._isAdaptive = function () {
        var format = this.getCurrentResourceFormat();
        return format === "mpd" || format === "m3u8";
    };
    DownloadDialogue.prototype.open = function (triggerButton) {
        _super.prototype.open.call(this, triggerButton);
        var canvas = this.extension.helper.getCurrentCanvas();
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.ENTIRE_FILE_AS_ORIGINAL) &&
            !this._isAdaptive()) {
            var $input = this.$entireFileAsOriginal.find("input");
            var $label = this.$entireFileAsOriginal.find("label");
            var label = utils_1.Strings.format(this.content.entireFileAsOriginalWithFormat, this.getCurrentResourceFormat());
            $label.text(label);
            $input.prop("title", label);
            this.$entireFileAsOriginal.show();
        }
        this.resetDynamicDownloadOptions();
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.RANGE_RENDERINGS)) {
            if (canvas.ranges && canvas.ranges.length) {
                var currentRange = this.extension.helper.getCurrentRange();
                if (currentRange) {
                    this.$downloadOptions.append(this.$canvasOptionsContainer);
                    var renderingOptions = this.getDownloadOptionsForRenderings(currentRange, this.content.entireFileAsOriginal, DownloadOption_1.DownloadOption.CANVAS_RENDERINGS);
                    this.addDownloadOptionsForRenderings(renderingOptions);
                }
                // commented out as part of https://github.com/UniversalViewer/universalviewer/issues/876
                // for (let i = 0; i < canvas.ranges.length; i++) {
                //   const range: Range = canvas.ranges[i];
                //   const renderingOptions: IRenderingOption[] = this.getDownloadOptionsForRenderings(
                //     range,
                //     this.content.entireFileAsOriginal,
                //     DownloadOption.CANVAS_RENDERINGS
                //   );
                //   console.log("renderingOptions", renderingOptions);
                //   this.addDownloadOptionsForRenderings(renderingOptions);
                // }
            }
        }
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.IMAGE_RENDERINGS)) {
            var images = canvas.getImages();
            if (images.length) {
                this.$downloadOptions.append(this.$imageOptionsContainer);
            }
            for (var i = 0; i < images.length; i++) {
                var renderingOptions = this.getDownloadOptionsForRenderings(images[i].getResource(), this.content.entireFileAsOriginal, DownloadOption_1.DownloadOption.IMAGE_RENDERINGS);
                this.addDownloadOptionsForRenderings(renderingOptions);
            }
        }
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.CANVAS_RENDERINGS)) {
            var renderingOptions = this.getDownloadOptionsForRenderings(canvas, this.content.entireFileAsOriginal, DownloadOption_1.DownloadOption.CANVAS_RENDERINGS);
            if (renderingOptions.length) {
                this.$downloadOptions.append(this.$canvasOptionsContainer);
                this.addDownloadOptionsForRenderings(renderingOptions);
            }
        }
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.MANIFEST_RENDERINGS)) {
            var renderingOptions = this.getDownloadOptionsForRenderings(this.extension.helper.getCurrentSequence(), this.content.entireDocument, DownloadOption_1.DownloadOption.MANIFEST_RENDERINGS);
            if (!renderingOptions.length && this.extension.helper.manifest) {
                renderingOptions = this.getDownloadOptionsForRenderings(this.extension.helper.manifest, this.content.entireDocument, DownloadOption_1.DownloadOption.MANIFEST_RENDERINGS);
            }
            if (renderingOptions.length) {
                this.$downloadOptions.append(this.$manifestOptionsContainer);
                this.addDownloadOptionsForRenderings(renderingOptions);
            }
        }
        if (this.$downloadOptions.length) {
            this.$entireFileAsOriginal.hide();
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
    DownloadDialogue.prototype.isDownloadOptionAvailable = function (_option) {
        return this.isMediaDownloadEnabled();
    };
    return DownloadDialogue;
}(DownloadDialogue_1.DownloadDialogue));
exports.DownloadDialogue = DownloadDialogue;
//# sourceMappingURL=DownloadDialogue.js.map