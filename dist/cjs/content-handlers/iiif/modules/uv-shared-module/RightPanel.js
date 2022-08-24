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
exports.RightPanel = void 0;
var IIIFEvents_1 = require("../../IIIFEvents");
var BaseExpandPanel_1 = require("./BaseExpandPanel");
var utils_1 = require("@edsilv/utils");
var RightPanel = /** @class */ (function (_super) {
    __extends(RightPanel, _super);
    function RightPanel($element) {
        return _super.call(this, $element) || this;
    }
    RightPanel.prototype.create = function () {
        _super.prototype.create.call(this);
        this.$element.width(this.options.panelCollapsedWidth);
    };
    RightPanel.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        var shouldOpenPanel = utils_1.Bools.getBool(this.extension.getSettings().rightPanelOpen, this.options.panelOpen);
        if (shouldOpenPanel) {
            this.toggle(true);
        }
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.TOGGLE_EXPAND_RIGHT_PANEL, function () {
            if (_this.isFullyExpanded) {
                _this.collapseFull();
            }
            else {
                _this.expandFull();
            }
        });
    };
    RightPanel.prototype.getTargetWidth = function () {
        return this.isExpanded
            ? this.options.panelCollapsedWidth
            : this.options.panelExpandedWidth;
    };
    RightPanel.prototype.getTargetLeft = function () {
        return this.isExpanded
            ? this.$element.parent().width() - this.options.panelCollapsedWidth
            : this.$element.parent().width() - this.options.panelExpandedWidth;
    };
    RightPanel.prototype.toggleFinish = function () {
        _super.prototype.toggleFinish.call(this);
        if (this.isExpanded) {
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.OPEN_RIGHT_PANEL);
        }
        else {
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CLOSE_RIGHT_PANEL);
        }
        this.extension.updateSettings({ rightPanelOpen: this.isExpanded });
    };
    RightPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        this.$element.css({
            left: Math.floor(this.$element.parent().width() - this.$element.outerWidth()),
        });
    };
    return RightPanel;
}(BaseExpandPanel_1.BaseExpandPanel));
exports.RightPanel = RightPanel;
//# sourceMappingURL=RightPanel.js.map