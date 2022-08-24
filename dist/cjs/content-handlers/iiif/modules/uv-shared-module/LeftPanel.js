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
exports.LeftPanel = void 0;
var IIIFEvents_1 = require("../../IIIFEvents");
var BaseExpandPanel_1 = require("./BaseExpandPanel");
var utils_1 = require("@edsilv/utils");
var LeftPanel = /** @class */ (function (_super) {
    __extends(LeftPanel, _super);
    function LeftPanel($element) {
        return _super.call(this, $element) || this;
    }
    LeftPanel.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this.$element.width(this.options.panelCollapsedWidth);
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.TOGGLE_EXPAND_LEFT_PANEL, function () {
            if (_this.isFullyExpanded) {
                _this.collapseFull();
            }
            else {
                _this.expandFull();
            }
        });
    };
    LeftPanel.prototype.init = function () {
        _super.prototype.init.call(this);
        var shouldOpenPanel = utils_1.Bools.getBool(this.extension.getSettings().leftPanelOpen, this.options.panelOpen);
        if (shouldOpenPanel) {
            this.toggle(true);
        }
    };
    LeftPanel.prototype.getTargetWidth = function () {
        if (this.isFullyExpanded || !this.isExpanded) {
            return this.options.panelExpandedWidth;
        }
        else {
            return this.options.panelCollapsedWidth;
        }
    };
    LeftPanel.prototype.getFullTargetWidth = function () {
        return this.$element.parent().width();
    };
    LeftPanel.prototype.toggleFinish = function () {
        _super.prototype.toggleFinish.call(this);
        if (this.isExpanded) {
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.OPEN_LEFT_PANEL);
        }
        else {
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CLOSE_LEFT_PANEL);
        }
        this.extension.updateSettings({ leftPanelOpen: this.isExpanded });
    };
    LeftPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        if (this.isFullyExpanded) {
            this.$element.width(this.$element.parent().width());
        }
    };
    return LeftPanel;
}(BaseExpandPanel_1.BaseExpandPanel));
exports.LeftPanel = LeftPanel;
//# sourceMappingURL=LeftPanel.js.map