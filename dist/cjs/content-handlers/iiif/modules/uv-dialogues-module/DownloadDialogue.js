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
var Dialogue_1 = require("../uv-shared-module/Dialogue");
var DownloadOption_1 = require("../uv-shared-module/DownloadOption");
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
        // Accessibility.
        this.$element.attr("role", "region");
        this.$element.attr("aria-label", this.content.title);
        this.openCommand = IIIFEvents_1.IIIFEvents.SHOW_DOWNLOAD_DIALOGUE;
        this.closeCommand = IIIFEvents_1.IIIFEvents.HIDE_DOWNLOAD_DIALOGUE;
        var lastButton;
        this.extensionHost.subscribe(this.openCommand, function (triggerButton) {
            lastButton = triggerButton;
            _this.open(triggerButton);
        });
        this.extensionHost.subscribe(this.closeCommand, function () {
            if (lastButton) {
                lastButton.focus();
            }
            _this.close();
        });
        // create ui.
        this.$title = $("<div role=\"heading\" class=\"heading\">" + this.content.title + "</div>");
        this.$content.append(this.$title);
        this.$noneAvailable = $('<div class="noneAvailable">' + this.content.noneAvailable + "</div>");
        this.$content.append(this.$noneAvailable);
        this.$downloadOptions = $('<ol class="options"></ol>');
        this.$content.append(this.$downloadOptions);
        this.$footer = $('<div class="footer"></div>');
        this.$content.append(this.$footer);
        this.$termsOfUseButton = $('<a href="#">' + this.extension.data.config.content.termsOfUse + "</a>");
        this.$footer.append(this.$termsOfUseButton);
        this.$termsOfUseButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_TERMS_OF_USE);
        });
        // hide
        this.$element.hide();
        this.updateTermsOfUseButton();
    };
    DownloadDialogue.prototype.addEntireFileDownloadOptions = function () {
        if (this.isDownloadOptionAvailable(DownloadOption_1.DownloadOption.ENTIRE_FILE_AS_ORIGINAL)) {
            this.$downloadOptions.empty();
            //
            // add each file src
            var canvas = this.extension.helper.getCurrentCanvas();
            var renderingFound = false;
            var renderings = canvas.getRenderings();
            for (var i = 0; i < renderings.length; i++) {
                var rendering = renderings[i];
                var renderingFormat = rendering.getFormat();
                var format = "";
                if (renderingFormat) {
                    format = renderingFormat.toString();
                }
                this.addEntireFileDownloadOption(rendering.id, manifesto_js_1.LanguageMap.getValue(rendering.getLabel()), format);
                renderingFound = true;
            }
            if (!renderingFound) {
                var annotationFound = false;
                var annotations = canvas.getContent();
                for (var i = 0; i < annotations.length; i++) {
                    var annotation = annotations[i];
                    var body = annotation.getBody();
                    if (body.length) {
                        var format = body[0].getFormat();
                        if (format) {
                            this.addEntireFileDownloadOption(body[0].id, "", format.toString());
                            annotationFound = true;
                        }
                    }
                }
                if (!annotationFound) {
                    this.addEntireFileDownloadOption(canvas.id, "", "");
                }
            }
        }
    };
    DownloadDialogue.prototype.addEntireFileDownloadOption = function (uri, label, format) {
        var fileType;
        if (format) {
            fileType = utils_1.Files.simplifyMimeType(format);
        }
        else {
            fileType = this.getFileExtension(uri);
        }
        if (!label) {
            label = this.content.entireFileAsOriginal;
        }
        if (fileType) {
            label += " (" + fileType + ")";
        }
        this.$downloadOptions.append('<li><a href="' +
            uri +
            '" target="_blank" download tabindex="0">' +
            label +
            "</li>");
    };
    DownloadDialogue.prototype.resetDynamicDownloadOptions = function () {
        this.renderingUrls = [];
        this.renderingUrlsCount = 0;
        this.$downloadOptions.find("li.dynamic").remove();
    };
    DownloadDialogue.prototype.getDownloadOptionsForRenderings = function (resource, defaultLabel, type) {
        var renderings = resource.getRenderings();
        var downloadOptions = [];
        for (var i = 0; i < renderings.length; i++) {
            var rendering = renderings[i];
            if (rendering) {
                var label = manifesto_js_1.LanguageMap.getValue(rendering.getLabel(), this.extension.getLocale());
                var currentId = "downloadOption" + ++this.renderingUrlsCount;
                if (label) {
                    label += " ({0})";
                }
                else {
                    label = defaultLabel;
                }
                var mime = utils_1.Files.simplifyMimeType(rendering.getFormat().toString());
                label = utils_1.Strings.format(label, mime);
                this.renderingUrls[currentId] = rendering.id;
                var $button = $('<li class="option dynamic"><input id="' +
                    currentId +
                    '" data-mime="' +
                    mime +
                    '" title="' +
                    label +
                    '" type="radio" name="downloadOptions" tabindex="0" /><label for="' +
                    currentId +
                    '">' +
                    label +
                    "</label></li>");
                downloadOptions.push({
                    type: type,
                    button: $button,
                });
            }
        }
        return downloadOptions;
    };
    DownloadDialogue.prototype.getSelectedOption = function () {
        return this.$downloadOptions.find("li.option input:checked");
    };
    DownloadDialogue.prototype.getCurrentResourceId = function () {
        var canvas = this.extension.helper.getCurrentCanvas();
        var id = canvas.externalResource.data.id;
        // if there's no id, use contentLocation
        if (!id) {
            id = canvas.externalResource.data.contentLocation;
        }
        return id;
    };
    DownloadDialogue.prototype.getCurrentResourceFormat = function () {
        var id = this.getCurrentResourceId();
        return id === null || id === void 0 ? void 0 : id.substr(id.lastIndexOf(".") + 1).toLowerCase();
    };
    DownloadDialogue.prototype.updateNoneAvailable = function () {
        if (!this.$downloadOptions.find("li:visible").length) {
            this.$noneAvailable.show();
        }
        else {
            // select first option.
            this.$noneAvailable.hide();
        }
    };
    DownloadDialogue.prototype.updateTermsOfUseButton = function () {
        var requiredStatement = this.extension.helper.getRequiredStatement();
        if (utils_1.Bools.getBool(this.extension.data.config.options.termsOfUseEnabled, false) &&
            requiredStatement &&
            requiredStatement.value) {
            this.$termsOfUseButton.show();
        }
        else {
            this.$termsOfUseButton.hide();
        }
    };
    DownloadDialogue.prototype.getFileExtension = function (fileUri) {
        var extension = fileUri.split(".").pop();
        // if it's not a valid file extension
        if (extension.length > 5 || extension.indexOf("/") !== -1) {
            return null;
        }
        return extension;
    };
    DownloadDialogue.prototype.isMediaDownloadEnabled = function () {
        return this.extension.helper.isUIEnabled("mediaDownload");
    };
    DownloadDialogue.prototype.isDownloadOptionAvailable = function (option) {
        switch (option) {
            case DownloadOption_1.DownloadOption.ENTIRE_FILE_AS_ORIGINAL:
                return this.isMediaDownloadEnabled();
        }
        return true;
    };
    DownloadDialogue.prototype.close = function () {
        _super.prototype.close.call(this);
    };
    DownloadDialogue.prototype.resize = function () {
        this.setDockedPosition();
    };
    return DownloadDialogue;
}(Dialogue_1.Dialogue));
exports.DownloadDialogue = DownloadDialogue;
//# sourceMappingURL=DownloadDialogue.js.map