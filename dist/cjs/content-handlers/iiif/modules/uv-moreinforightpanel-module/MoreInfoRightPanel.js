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
exports.MoreInfoRightPanel = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var RightPanel_1 = require("../uv-shared-module/RightPanel");
var Utils_1 = require("../../../../Utils");
var utils_1 = require("@edsilv/utils");
var manifold_1 = require("@iiif/manifold");
var iiif_metadata_component_1 = require("@iiif/iiif-metadata-component");
var MoreInfoRightPanel = /** @class */ (function (_super) {
    __extends(MoreInfoRightPanel, _super);
    function MoreInfoRightPanel($element) {
        return _super.call(this, $element) || this;
    }
    MoreInfoRightPanel.prototype.create = function () {
        var _this = this;
        this.setConfig("moreInfoRightPanel");
        _super.prototype.create.call(this);
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function () {
            _this.databind();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.RANGE_CHANGE, function () {
            _this.databind();
        });
        this.setTitle(this.config.content.title);
        this.$metadata = $('<div class="iiif-metadata-component"></div>');
        this.$main.append(this.$metadata);
        this.metadataComponent = new iiif_metadata_component_1.MetadataComponent({
            target: this.$metadata[0],
            data: this._getData(),
        });
        this.metadataComponent.on("iiifViewerLinkClicked", function (href) {
            // Range change.
            var rangeId = utils_1.Urls.getHashParameterFromString("rid", href);
            if (rangeId) {
                var range = _this.extension.helper.getRangeById(rangeId);
                if (range) {
                    _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.RANGE_CHANGE, range);
                }
            }
            // Time change.
            var time = utils_1.Urls.getHashParameterFromString("t", href);
            if (time !== null) {
                var timeAsNumber = Number(time);
                if (!Number.isNaN(timeAsNumber)) {
                    _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CURRENT_TIME_CHANGE, timeAsNumber);
                }
            }
        }, false);
    };
    MoreInfoRightPanel.prototype.toggleFinish = function () {
        _super.prototype.toggleFinish.call(this);
        this.databind();
    };
    MoreInfoRightPanel.prototype.databind = function () {
        this.metadataComponent.set(this._getData());
    };
    MoreInfoRightPanel.prototype._getCurrentRange = function () {
        var range = this.extension.helper.getCurrentRange();
        return range;
    };
    MoreInfoRightPanel.prototype._getData = function () {
        var canvases = this.extension.getCurrentCanvases();
        return {
            canvasDisplayOrder: this.config.options.canvasDisplayOrder,
            canvases: canvases,
            canvasExclude: this.config.options.canvasExclude,
            canvasLabels: this.extension.getCanvasLabels(this.content.page),
            content: this.config.content,
            copiedMessageDuration: 2000,
            copyToClipboardEnabled: utils_1.Bools.getBool(this.config.options.copyToClipboardEnabled, false),
            helper: this.extension.helper,
            licenseFormatter: new manifold_1.UriLabeller(this.config.license ? this.config.license : {}),
            limit: this.config.options.textLimit || 4,
            limitType: iiif_metadata_component_1.LimitType.LINES,
            limitToRange: utils_1.Bools.getBool(this.config.options.limitToRange, false),
            manifestDisplayOrder: this.config.options.manifestDisplayOrder,
            manifestExclude: this.config.options.manifestExclude,
            range: this._getCurrentRange(),
            rtlLanguageCodes: this.config.options.rtlLanguageCodes,
            sanitizer: function (html) {
                return (0, Utils_1.sanitize)(html);
            },
            showAllLanguages: this.config.options.showAllLanguages,
        };
    };
    MoreInfoRightPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        this.$main.height(this.$element.height() - this.$top.height() - this.$main.verticalMargins());
    };
    return MoreInfoRightPanel;
}(RightPanel_1.RightPanel));
exports.MoreInfoRightPanel = MoreInfoRightPanel;
//# sourceMappingURL=MoreInfoRightPanel.js.map