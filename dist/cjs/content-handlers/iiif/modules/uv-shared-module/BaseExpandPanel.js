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
exports.BaseExpandPanel = void 0;
var $ = window.$;
var BaseView_1 = require("./BaseView");
var utils_1 = require("@edsilv/utils");
var IIIFEvents_1 = require("../../IIIFEvents");
var BaseExpandPanel = /** @class */ (function (_super) {
    __extends(BaseExpandPanel, _super);
    function BaseExpandPanel($element) {
        var _this = _super.call(this, $element, false, true) || this;
        _this.isExpanded = false;
        _this.isFullyExpanded = false;
        _this.isUnopened = true;
        _this.autoToggled = false;
        _this.expandFullEnabled = true;
        _this.reducedAnimation = false;
        return _this;
    }
    BaseExpandPanel.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this.$top = $('<div class="top"></div>');
        this.$element.append(this.$top);
        this.$title = $('<h2 class="title"></h2>');
        this.$top.append(this.$title);
        this.$expandFullButton = $('<a class="expandFullButton" tabindex="0"></a>');
        this.$top.append(this.$expandFullButton);
        if (!utils_1.Bools.getBool(this.config.options.expandFullEnabled, true)) {
            this.$expandFullButton.hide();
        }
        this.$collapseButton = $('<div role="button" class="collapseButton" tabindex="0"></div>');
        this.$collapseButton.prop("title", this.content.collapse);
        this.$top.append(this.$collapseButton);
        this.$closed = $('<div class="closed"></div>');
        this.$element.append(this.$closed);
        this.$expandButton = $('<a role="button" class="expandButton" tabindex="0"></a>');
        this.$expandButton.prop("title", this.content.expand);
        this.$closed.append(this.$expandButton);
        this.$closedTitle = $('<a class="title"></a>');
        this.$closed.append(this.$closedTitle);
        this.$main = $('<div class="main"></div>');
        this.$element.append(this.$main);
        this.onAccessibleClick(this.$expandButton, function () {
            _this.toggle();
        });
        this.$expandFullButton.on("click", function () {
            _this.expandFull();
        });
        this.$closedTitle.on("click", function () {
            _this.toggle();
        });
        this.$title.on("click", function () {
            if (_this.isFullyExpanded) {
                _this.collapseFull();
            }
            else {
                _this.toggle();
            }
        });
        this.onAccessibleClick(this.$collapseButton, function () {
            if (_this.isFullyExpanded) {
                _this.collapseFull();
            }
            else {
                _this.toggle();
            }
        });
        this.$top.hide();
        this.$main.hide();
        // Subscribe to settings change.
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.SETTINGS_CHANGE, function (args) {
            _this.reducedAnimation = args.reducedAnimation || false;
        });
    };
    BaseExpandPanel.prototype.init = function () {
        _super.prototype.init.call(this);
    };
    BaseExpandPanel.prototype.setTitle = function (title) {
        this.$title.text(title);
        this.$closedTitle.text(title);
    };
    BaseExpandPanel.prototype.toggle = function (autoToggled) {
        var _this = this;
        autoToggled ? (this.autoToggled = true) : (this.autoToggled = false);
        // if collapsing, hide contents immediately.
        if (this.isExpanded) {
            this.$top.attr("aria-hidden", "true");
            this.$main.attr("aria-hidden", "true");
            this.$closed.attr("aria-hidden", "false");
            this.$top.hide();
            this.$main.hide();
            this.$closed.show();
        }
        if (this.reducedAnimation) {
            // This is reduced motion.
            this.$element.css("width", this.getTargetWidth());
            this.$element.css("left", this.getTargetLeft());
            this.toggled();
        }
        else {
            // Otherwise animate.
            this.$element.stop().animate({
                width: this.getTargetWidth(),
                left: this.getTargetLeft(),
            }, this.options.panelAnimationDuration, function () {
                _this.toggled();
            });
        }
    };
    BaseExpandPanel.prototype.toggled = function () {
        this.toggleStart();
        this.isExpanded = !this.isExpanded;
        // if expanded show content when animation finished.
        if (this.isExpanded) {
            this.$top.attr("aria-hidden", "false");
            this.$main.attr("aria-hidden", "false");
            this.$closed.attr("aria-hidden", "true");
            this.$closed.hide();
            this.$top.show();
            this.$main.show();
        }
        this.toggleFinish();
        this.isUnopened = false;
    };
    BaseExpandPanel.prototype.expandFull = function () {
        var _this = this;
        if (!this.isExpanded) {
            this.toggled();
        }
        var targetWidth = this.getFullTargetWidth();
        var targetLeft = this.getFullTargetLeft();
        this.expandFullStart();
        this.$element.stop().animate({
            width: targetWidth,
            left: targetLeft,
        }, this.options.panelAnimationDuration, function () {
            _this.expandFullFinish();
        });
    };
    BaseExpandPanel.prototype.collapseFull = function () {
        var _this = this;
        var targetWidth = this.getTargetWidth();
        var targetLeft = this.getTargetLeft();
        this.collapseFullStart();
        this.$element.stop().animate({
            width: targetWidth,
            left: targetLeft,
        }, this.options.panelAnimationDuration, function () {
            _this.collapseFullFinish();
        });
    };
    BaseExpandPanel.prototype.getTargetWidth = function () {
        return 0;
    };
    BaseExpandPanel.prototype.getTargetLeft = function () {
        return 0;
    };
    BaseExpandPanel.prototype.getFullTargetWidth = function () {
        return 0;
    };
    BaseExpandPanel.prototype.getFullTargetLeft = function () {
        return 0;
    };
    BaseExpandPanel.prototype.toggleStart = function () { };
    BaseExpandPanel.prototype.toggleFinish = function () {
        if (this.isExpanded && !this.autoToggled) {
            this.focusCollapseButton();
        }
        else {
            this.focusExpandButton();
        }
    };
    BaseExpandPanel.prototype.expandFullStart = function () { };
    BaseExpandPanel.prototype.expandFullFinish = function () {
        this.isFullyExpanded = true;
        this.$expandFullButton.hide();
        this.focusCollapseButton();
    };
    BaseExpandPanel.prototype.collapseFullStart = function () { };
    BaseExpandPanel.prototype.collapseFullFinish = function () {
        this.isFullyExpanded = false;
        if (this.expandFullEnabled) {
            this.$expandFullButton.show();
        }
        this.focusExpandFullButton();
    };
    BaseExpandPanel.prototype.focusExpandButton = function () {
        var _this = this;
        setTimeout(function () {
            _this.$expandButton.focus();
        }, 1);
    };
    BaseExpandPanel.prototype.focusExpandFullButton = function () {
        var _this = this;
        setTimeout(function () {
            _this.$expandFullButton.focus();
        }, 1);
    };
    BaseExpandPanel.prototype.focusCollapseButton = function () {
        var _this = this;
        setTimeout(function () {
            _this.$collapseButton.focus();
        }, 1);
    };
    BaseExpandPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        this.$main.height(this.$element.parent().height() - this.$top.outerHeight(true));
    };
    return BaseExpandPanel;
}(BaseView_1.BaseView));
exports.BaseExpandPanel = BaseExpandPanel;
//# sourceMappingURL=BaseExpandPanel.js.map