"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Panel = void 0;
var utils_1 = require("@edsilv/utils");
var Events_1 = require("../../../../Events");
var Panel = /** @class */ (function () {
    function Panel($element, fitToParentWidth, fitToParentHeight) {
        this.isResized = false;
        this.$element = $element;
        this.fitToParentWidth = fitToParentWidth || false;
        this.fitToParentHeight = fitToParentHeight || false;
        this.create();
    }
    Panel.prototype.create = function () {
        var _this = this;
        var _a;
        (_a = this.extensionHost) === null || _a === void 0 ? void 0 : _a.subscribe(Events_1.Events.RESIZE, function () {
            _this.resize();
        });
    };
    Panel.prototype.whenResized = function (cb) {
        var _this = this;
        utils_1.Async.waitFor(function () {
            return _this.isResized;
        }, cb);
    };
    Panel.prototype.onAccessibleClick = function (el, callback, withClick) {
        if (withClick === void 0) { withClick = true; }
        if (withClick) {
            el.on("click", function (e) {
                callback(e);
            });
        }
        el.on("keyup", function (e) {
            if (e.keyCode === 32) {
                callback(e);
            }
        });
    };
    Panel.prototype.resize = function () {
        var $parent = this.$element.parent();
        if (this.fitToParentWidth) {
            this.$element.width($parent.width());
        }
        if (this.fitToParentHeight) {
            this.$element.height($parent.height());
        }
        this.isResized = true;
    };
    return Panel;
}());
exports.Panel = Panel;
//# sourceMappingURL=Panel.js.map