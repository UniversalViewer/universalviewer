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
exports.MoreInfoDialogue = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var Dialogue_1 = require("../uv-shared-module/Dialogue");
var Utils_1 = require("../../../../Utils");
var utils_1 = require("@edsilv/utils");
var iiif_metadata_component_1 = require("@iiif/iiif-metadata-component");
var MoreInfoDialogue = /** @class */ (function (_super) {
    __extends(MoreInfoDialogue, _super);
    function MoreInfoDialogue($element) {
        return _super.call(this, $element) || this;
    }
    MoreInfoDialogue.prototype.create = function () {
        var _this = this;
        this.setConfig("moreInfoDialogue");
        _super.prototype.create.call(this);
        this.openCommand = IIIFEvents_1.IIIFEvents.SHOW_MOREINFO_DIALOGUE;
        this.closeCommand = IIIFEvents_1.IIIFEvents.HIDE_MOREINFO_DIALOGUE;
        this.extensionHost.subscribe(this.openCommand, function (triggerButton) {
            _this.open(triggerButton);
        });
        this.extensionHost.subscribe(this.closeCommand, function () {
            _this.close();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function () {
            _this.metadataComponent.set(_this._getData());
        });
        this.config.content = this.extension.data.config.modules.moreInfoRightPanel.content;
        this.config.options = this.extension.data.config.modules.moreInfoRightPanel.options;
        // create ui
        this.$title = $("<div role=\"heading\" class=\"heading\">" + this.config.content.title + "</div>");
        this.$content.append(this.$title);
        this.$metadata = $('<div class="iiif-metadata-component"></div>');
        this.$content.append(this.$metadata);
        this.metadataComponent = new iiif_metadata_component_1.MetadataComponent({
            target: this.$metadata[0],
        });
        // hide
        this.$element.hide();
    };
    MoreInfoDialogue.prototype.open = function (triggerButton) {
        _super.prototype.open.call(this, triggerButton);
        this.metadataComponent.set(this._getData());
    };
    MoreInfoDialogue.prototype._getData = function () {
        return {
            canvasDisplayOrder: this.config.options.canvasDisplayOrder,
            canvases: this.extension.getCurrentCanvases(),
            canvasExclude: this.config.options.canvasExclude,
            canvasLabels: this.extension.getCanvasLabels(this.content.page),
            content: this.config.content,
            copiedMessageDuration: 2000,
            copyToClipboardEnabled: utils_1.Bools.getBool(this.config.options.copyToClipboardEnabled, false),
            helper: this.extension.helper,
            licenseFormatter: null,
            limit: this.config.options.textLimit || 4,
            limitType: iiif_metadata_component_1.LimitType.LINES,
            manifestDisplayOrder: this.config.options.manifestDisplayOrder,
            manifestExclude: this.config.options.manifestExclude,
            range: this.extension.getCurrentCanvasRange(),
            rtlLanguageCodes: this.config.options.rtlLanguageCodes,
            sanitizer: function (html) {
                return (0, Utils_1.sanitize)(html);
            },
            showAllLanguages: this.config.options.showAllLanguages,
        };
    };
    MoreInfoDialogue.prototype.close = function () {
        _super.prototype.close.call(this);
    };
    MoreInfoDialogue.prototype.resize = function () {
        this.setDockedPosition();
    };
    return MoreInfoDialogue;
}(Dialogue_1.Dialogue));
exports.MoreInfoDialogue = MoreInfoDialogue;
//# sourceMappingURL=MoreInfoDialogue.js.map