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
exports.HeaderPanel = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var BaseView_1 = require("./BaseView");
var InformationFactory_1 = require("./InformationFactory");
var utils_1 = require("@edsilv/utils");
var Utils_1 = require("../../../../Utils");
var HeaderPanel = /** @class */ (function (_super) {
    __extends(HeaderPanel, _super);
    function HeaderPanel($element) {
        return _super.call(this, $element, false, false) || this;
    }
    HeaderPanel.prototype.create = function () {
        var _this = this;
        this.setConfig("headerPanel");
        _super.prototype.create.call(this);
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.SHOW_INFORMATION, function (args) {
            _this.showInformation(Array.isArray(args) ? args[0] : args);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.HIDE_INFORMATION, function () {
            _this.hideInformation();
        });
        this.$options = $('<div class="options"></div>');
        this.$element.append(this.$options);
        this.$centerOptions = $('<div class="centerOptions"></div>');
        this.$options.append(this.$centerOptions);
        this.$rightOptions = $('<div class="rightOptions"></div>');
        this.$options.append(this.$rightOptions);
        //this.$helpButton = $('<a href="#" class="action help">' + this.content.help + '</a>');
        //this.$rightOptions.append(this.$helpButton);
        this.$localeToggleButton = $('<a class="localeToggle" tabindex="0"></a>');
        this.$rightOptions.append(this.$localeToggleButton);
        this.$settingsButton = $("\n          <button class=\"btn imageBtn settings\" tabindex=\"0\" title=\"" + this.content.settings + "\">\n            <i class=\"uv-icon-settings\" aria-hidden=\"true\"></i>\n          </button>\n        ");
        this.$settingsButton.attr("title", this.content.settings);
        this.$rightOptions.append(this.$settingsButton);
        this.$informationBox = $('<div class="informationBox" aria-hidden="true"> \
                                    <div class="message"></div> \
                                    <div class="actions"></div> \
                                    <button type="button" class="close" aria-label="Close"> \
                                        <span aria-hidden="true">&#215;</span>\
                                    </button> \
                                  </div>');
        this.$element.append(this.$informationBox);
        this.$informationBox.hide();
        this.$informationBox.find(".close").attr("title", this.content.close);
        this.$informationBox.find(".close").on("click", function (e) {
            e.preventDefault();
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.HIDE_INFORMATION);
        });
        this.$localeToggleButton.on("click", function () {
            _this.extension.changeLocale(String(_this.$localeToggleButton.data("locale")));
        });
        this.$settingsButton.onPressed(function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_SETTINGS_DIALOGUE, _this.$settingsButton);
        });
        if (!utils_1.Bools.getBool(this.options.centerOptionsEnabled, true)) {
            this.$centerOptions.hide();
        }
        this.updateLocaleToggle();
        this.updateSettingsButton();
    };
    HeaderPanel.prototype.updateLocaleToggle = function () {
        if (!this.localeToggleIsVisible()) {
            this.$localeToggleButton.hide();
            return;
        }
        var alternateLocale = this.extension.getAlternateLocale();
        var text = alternateLocale.name.split("-")[0].toUpperCase();
        this.$localeToggleButton.data("locale", alternateLocale.name);
        this.$localeToggleButton.attr("title", alternateLocale.label);
        this.$localeToggleButton.text(text);
    };
    HeaderPanel.prototype.updateSettingsButton = function () {
        var settingsEnabled = utils_1.Bools.getBool(this.options.settingsButtonEnabled, true);
        if (!settingsEnabled) {
            this.$settingsButton.hide();
        }
        else {
            this.$settingsButton.show();
        }
    };
    HeaderPanel.prototype.localeToggleIsVisible = function () {
        var locales = this.extension.data.locales;
        if (locales) {
            return (locales.length > 1 &&
                utils_1.Bools.getBool(this.options.localeToggleEnabled, false));
        }
        return false;
    };
    HeaderPanel.prototype.showInformation = function (args) {
        var informationFactory = new InformationFactory_1.InformationFactory(this.extension);
        this.information = informationFactory.Get(args);
        if (!this.information)
            return;
        var $message = this.$informationBox.find(".message");
        $message
            .html(this.information.message)
            .find("a")
            .attr("target", "_top");
        var $actions = this.$informationBox.find(".actions");
        $actions.empty();
        for (var i = 0; i < this.information.actions.length; i++) {
            var action = this.information.actions[i];
            var $action = $('<a href="#" class="btn btn-default">' + action.label + "</a>");
            $action.on("click", action.action);
            $actions.append($action);
        }
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.MESSAGE_DISPLAYED, this.information);
        this.$informationBox.attr("aria-hidden", "false");
        this.$informationBox.show();
        this.$element.addClass("showInformation");
        this.extension.resize();
    };
    HeaderPanel.prototype.hideInformation = function () {
        this.$element.removeClass("showInformation");
        this.$informationBox.attr("aria-hidden", "true");
        this.$informationBox.hide();
        this.extension.resize();
    };
    HeaderPanel.prototype.getSettings = function () {
        return this.extension.getSettings();
    };
    HeaderPanel.prototype.updateSettings = function (settings) {
        this.extension.updateSettings(settings);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.UPDATE_SETTINGS, settings);
    };
    HeaderPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        var headerWidth = this.$element.width();
        var center = headerWidth / 2;
        var containerWidth = this.$centerOptions.outerWidth();
        var pos = center - containerWidth / 2;
        this.$centerOptions.css({
            left: pos,
        });
        if ((0, Utils_1.isVisible)(this.$informationBox)) {
            var $actions = this.$informationBox.find(".actions");
            var $message = this.$informationBox.find(".message");
            $message.width(Math.floor(this.$element.width()) -
                Math.ceil($message.horizontalMargins()) -
                Math.ceil($actions.outerWidth(true)) -
                Math.ceil(this.$informationBox.find(".close").outerWidth(true)) -
                2);
            if (this.information) {
                $message.text(this.information.message);
            }
        }
        // hide toggle buttons below minimum width
        if (this.extension.width() <
            this.extension.data.config.options.minWidthBreakPoint) {
            if (this.localeToggleIsVisible())
                this.$localeToggleButton.hide();
        }
        else {
            if (this.localeToggleIsVisible())
                this.$localeToggleButton.show();
        }
    };
    return HeaderPanel;
}(BaseView_1.BaseView));
exports.HeaderPanel = HeaderPanel;
//# sourceMappingURL=HeaderPanel.js.map