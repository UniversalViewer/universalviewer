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
var IIIFEvents_1 = require("../../IIIFEvents");
var Dialogue_1 = require("../uv-shared-module/Dialogue");
var SettingsDialogue = /** @class */ (function (_super) {
    __extends(SettingsDialogue, _super);
    function SettingsDialogue($element) {
        return _super.call(this, $element) || this;
    }
    SettingsDialogue.prototype.create = function () {
        var _this = this;
        this.setConfig("settingsDialogue");
        _super.prototype.create.call(this);
        this.openCommand = IIIFEvents_1.IIIFEvents.SHOW_SETTINGS_DIALOGUE;
        this.closeCommand = IIIFEvents_1.IIIFEvents.HIDE_SETTINGS_DIALOGUE;
        var lastElement;
        this.extensionHost.subscribe(this.openCommand, function (element) {
            lastElement = element;
            _this.open();
        });
        this.extensionHost.subscribe(this.closeCommand, function () {
            if (lastElement) {
                lastElement.focus();
            }
            _this.close();
        });
        this.$title = $("<div role=\"heading\" class=\"heading\"></div>");
        this.$content.append(this.$title);
        this.$scroll = $('<div class="scroll"></div>');
        this.$content.append(this.$scroll);
        this.$version = $('<div class="version"></div>');
        this.$content.append(this.$version);
        this.$website = $('<div class="website"></div>');
        this.$content.append(this.$website);
        this.$locale = $('<div class="setting locale"></div>');
        this.$scroll.append(this.$locale);
        this.$localeLabel = $('<label for="locale">' + this.content.locale + "</label>");
        this.$locale.append(this.$localeLabel);
        this.$localeDropDown = $('<select id="locale"></select>');
        this.$locale.append(this.$localeDropDown);
        // initialise ui.
        this.$title.text(this.content.title);
        this.$website.html(this.content.website);
        this.$website.targetBlank();
        this._createLocalesMenu();
        this._createAccessibilityMenu();
        this.$element.hide();
    };
    SettingsDialogue.prototype.getSettings = function () {
        return this.extension.getSettings();
    };
    SettingsDialogue.prototype.updateSettings = function (settings) {
        this.extension.updateSettings(settings);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.UPDATE_SETTINGS, settings);
    };
    SettingsDialogue.prototype.open = function () {
        _super.prototype.open.call(this);
        this.$version.text("v" + process.env.PACKAGE_VERSION);
    };
    SettingsDialogue.prototype._createLocalesMenu = function () {
        var _this = this;
        var locales = this.extension.data.locales;
        if (locales && locales.length > 1) {
            for (var i = 0; i < locales.length; i++) {
                var locale = locales[i];
                this.$localeDropDown.append('<option value="' + locale.name + '">' + locale.label + "</option>");
            }
            this.$localeDropDown.val(locales[0].name);
        }
        else {
            this.$locale.hide();
        }
        this.$localeDropDown.change(function () {
            _this.extension.changeLocale(_this.$localeDropDown.val());
        });
    };
    SettingsDialogue.prototype.resize = function () {
        _super.prototype.resize.call(this);
    };
    SettingsDialogue.prototype._createAccessibilityMenu = function () {
        var _this = this;
        // Accessibility
        this.$reducedAnimation = $('<div class="setting reducedAnimation"></div>');
        this.$scroll.append(this.$reducedAnimation);
        this.$reducedAnimationCheckbox = $('<input id="reducedAnimation" type="checkbox" tabindex="0" />');
        this.$reducedAnimation.append(this.$reducedAnimationCheckbox);
        this.$reducedAnimationLabel = $('<label for="reducedAnimation">' + this.content.reducedMotion + "</label>");
        this.$reducedAnimation.append(this.$reducedAnimationLabel);
        this.$reducedAnimationCheckbox.change(function () {
            var settings = {};
            if (_this.$reducedAnimationCheckbox.is(":checked")) {
                settings.reducedAnimation = true;
            }
            else {
                settings.reducedAnimation = false;
            }
            _this.updateSettings(settings);
        });
    };
    return SettingsDialogue;
}(Dialogue_1.Dialogue));
exports.SettingsDialogue = SettingsDialogue;
//# sourceMappingURL=SettingsDialogue.js.map