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
exports.SettingsDialogue = void 0;
var $ = window.$;
var SettingsDialogue_1 = require("../../modules/uv-dialogues-module/SettingsDialogue");
var SettingsDialogue = /** @class */ (function (_super) {
    __extends(SettingsDialogue, _super);
    function SettingsDialogue($element) {
        return _super.call(this, $element) || this;
    }
    SettingsDialogue.prototype.create = function () {
        var _this = this;
        this.setConfig("settingsDialogue");
        _super.prototype.create.call(this);
        this.$navigatorEnabled = $('<div class="setting navigatorEnabled"></div>');
        this.$scroll.append(this.$navigatorEnabled);
        // todo: use .checkboxButton jquery extension
        this.$navigatorEnabledCheckbox = $('<input id="navigatorEnabled" type="checkbox" tabindex="0" />');
        this.$navigatorEnabled.append(this.$navigatorEnabledCheckbox);
        this.$navigatorEnabledLabel = $('<label for="navigatorEnabled">' +
            this.content.navigatorEnabled +
            "</label>");
        this.$navigatorEnabled.append(this.$navigatorEnabledLabel);
        this.$pagingEnabled = $('<div class="setting pagingEnabled"></div>');
        this.$scroll.append(this.$pagingEnabled);
        this.$pagingEnabledCheckbox = $('<input id="pagingEnabled" type="checkbox" tabindex="0" />');
        this.$pagingEnabled.append(this.$pagingEnabledCheckbox);
        this.$pagingEnabledLabel = $('<label for="pagingEnabled">' + this.content.pagingEnabled + "</label>");
        this.$pagingEnabled.append(this.$pagingEnabledLabel);
        this.$clickToZoomEnabled = $('<div class="setting clickToZoom"></div>');
        this.$scroll.append(this.$clickToZoomEnabled);
        this.$clickToZoomEnabledCheckbox = $('<input id="clickToZoomEnabled" type="checkbox" />');
        this.$clickToZoomEnabled.append(this.$clickToZoomEnabledCheckbox);
        this.$clickToZoomEnabledLabel = $('<label for="clickToZoomEnabled">' +
            this.content.clickToZoomEnabled +
            "</label>");
        this.$clickToZoomEnabled.append(this.$clickToZoomEnabledLabel);
        this.$preserveViewport = $('<div class="setting preserveViewport"></div>');
        this.$scroll.append(this.$preserveViewport);
        this.$preserveViewportCheckbox = $('<input id="preserveViewport" type="checkbox" tabindex="0" />');
        this.$preserveViewport.append(this.$preserveViewportCheckbox);
        this.$preserveViewportLabel = $('<label for="preserveViewport">' +
            this.content.preserveViewport +
            "</label>");
        this.$preserveViewport.append(this.$preserveViewportLabel);
        this.$navigatorEnabledCheckbox.change(function () {
            var settings = {};
            if (_this.$navigatorEnabledCheckbox.is(":checked")) {
                settings.navigatorEnabled = true;
            }
            else {
                settings.navigatorEnabled = false;
            }
            _this.updateSettings(settings);
        });
        this.$clickToZoomEnabledCheckbox.change(function () {
            var settings = {};
            if (_this.$clickToZoomEnabledCheckbox.is(":checked")) {
                settings.clickToZoomEnabled = true;
            }
            else {
                settings.clickToZoomEnabled = false;
            }
            _this.updateSettings(settings);
        });
        this.$pagingEnabledCheckbox.change(function () {
            var settings = {};
            if (_this.$pagingEnabledCheckbox.is(":checked")) {
                settings.pagingEnabled = true;
            }
            else {
                settings.pagingEnabled = false;
            }
            _this.updateSettings(settings);
        });
        this.$preserveViewportCheckbox.change(function () {
            var settings = {};
            if (_this.$preserveViewportCheckbox.is(":checked")) {
                settings.preserveViewport = true;
            }
            else {
                settings.preserveViewport = false;
            }
            _this.updateSettings(settings);
        });
    };
    SettingsDialogue.prototype.open = function () {
        _super.prototype.open.call(this);
        var settings = this.getSettings();
        if (settings.navigatorEnabled) {
            this.$navigatorEnabledCheckbox.prop("checked", true);
        }
        else {
            this.$navigatorEnabledCheckbox.removeAttr("checked");
        }
        if (settings.clickToZoomEnabled) {
            this.$clickToZoomEnabledCheckbox.prop("checked", true);
        }
        else {
            this.$clickToZoomEnabledCheckbox.removeAttr("checked");
        }
        if (!this.extension.helper.isPagingAvailable()) {
            this.$pagingEnabled.hide();
        }
        else {
            if (settings.pagingEnabled) {
                this.$pagingEnabledCheckbox.prop("checked", true);
            }
            else {
                this.$pagingEnabledCheckbox.removeAttr("checked");
            }
        }
        if (settings.preserveViewport) {
            this.$preserveViewportCheckbox.prop("checked", true);
        }
        else {
            this.$preserveViewportCheckbox.removeAttr("checked");
        }
    };
    return SettingsDialogue;
}(SettingsDialogue_1.SettingsDialogue));
exports.SettingsDialogue = SettingsDialogue;
//# sourceMappingURL=SettingsDialogue.js.map