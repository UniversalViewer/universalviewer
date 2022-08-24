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
exports.MultiSelectDialogue = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var Dialogue_1 = require("../uv-shared-module/Dialogue");
var Mode_1 = require("../../extensions/uv-openseadragon-extension/Mode");
var utils_1 = require("@edsilv/utils");
var iiif_gallery_component_1 = require("@iiif/iiif-gallery-component");
var MultiSelectDialogue = /** @class */ (function (_super) {
    __extends(MultiSelectDialogue, _super);
    function MultiSelectDialogue($element) {
        return _super.call(this, $element) || this;
    }
    MultiSelectDialogue.prototype.create = function () {
        var _this = this;
        this.setConfig("multiSelectDialogue");
        _super.prototype.create.call(this);
        var that = this;
        this.openCommand = IIIFEvents_1.IIIFEvents.SHOW_MULTISELECT_DIALOGUE;
        this.closeCommand = IIIFEvents_1.IIIFEvents.HIDE_MULTISELECT_DIALOGUE;
        this.extensionHost.subscribe(this.openCommand, function () {
            _this.open();
            var multiSelectState = _this.extension.helper.getMultiSelectState();
            multiSelectState.setEnabled(true);
            _this.galleryComponent.set(_this.data);
        });
        this.extensionHost.subscribe(this.closeCommand, function () {
            _this.close();
            var multiSelectState = _this.extension.helper.getMultiSelectState();
            multiSelectState.setEnabled(false);
        });
        this.$title = $("<div role=\"heading\" class=\"heading\"></div>");
        this.$content.append(this.$title);
        this.$title.text(this.content.title);
        this.$gallery = $('<div class="iiif-gallery-component"></div>');
        this.$content.append(this.$gallery);
        this.data = {
            helper: this.extension.helper,
            chunkedResizingThreshold: this.config.options
                .galleryThumbChunkedResizingThreshold,
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
            viewingDirection: this.extension.helper.getViewingDirection(),
        };
        this.galleryComponent = new iiif_gallery_component_1.GalleryComponent({
            target: this.$gallery[0],
        });
        var $selectButton = this.$gallery.find("a.select");
        $selectButton.addClass("btn btn-primary");
        this.galleryComponent.on("multiSelectionMade", function (ids) {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.MULTISELECTION_MADE, ids);
            that.close();
        }, false);
        this.$element.hide();
    };
    MultiSelectDialogue.prototype.isPageModeEnabled = function () {
        return (utils_1.Bools.getBool(this.config.options.pageModeEnabled, true) &&
            this.extension.getMode().toString() ===
                Mode_1.Mode.page.toString());
    };
    MultiSelectDialogue.prototype.open = function () {
        _super.prototype.open.call(this);
    };
    MultiSelectDialogue.prototype.close = function () {
        _super.prototype.close.call(this);
    };
    MultiSelectDialogue.prototype.resize = function () {
        _super.prototype.resize.call(this);
        var $main = this.$gallery.find(".main");
        var $header = this.$gallery.find(".header");
        $main.height(this.$content.height() -
            this.$title.outerHeight() -
            this.$title.verticalMargins() -
            $header.height());
    };
    return MultiSelectDialogue;
}(Dialogue_1.Dialogue));
exports.MultiSelectDialogue = MultiSelectDialogue;
//# sourceMappingURL=MultiSelectDialogue.js.map