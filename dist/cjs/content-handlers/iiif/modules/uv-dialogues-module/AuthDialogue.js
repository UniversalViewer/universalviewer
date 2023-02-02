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
exports.AuthDialogue = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var Dialogue_1 = require("../uv-shared-module/Dialogue");
var Utils_1 = require("../../../../Utils");
var AuthDialogue = /** @class */ (function (_super) {
    __extends(AuthDialogue, _super);
    function AuthDialogue($element) {
        return _super.call(this, $element) || this;
    }
    AuthDialogue.prototype.create = function () {
        var _this = this;
        this.setConfig("authDialogue");
        _super.prototype.create.call(this);
        this.openCommand = IIIFEvents_1.IIIFEvents.SHOW_AUTH_DIALOGUE;
        this.closeCommand = IIIFEvents_1.IIIFEvents.HIDE_AUTH_DIALOGUE;
        this.extensionHost.subscribe(this.openCommand, function (_e) {
            var e = Array.isArray(_e) ? _e[0] : _e;
            _this.closeCallback = e.closeCallback;
            _this.confirmCallback = e.confirmCallback;
            _this.cancelCallback = e.cancelCallback;
            _this.service = e.service;
            _this.open();
        });
        this.extensionHost.subscribe(this.closeCommand, function () {
            _this.close();
        });
        this.$title = $("<div role=\"heading\" class=\"heading\"></div>");
        this.$content.append(this.$title);
        this.$content.append('\
            <div>\
                <p class="message scroll"></p>\
            </div>');
        this.$buttons.prepend(this._buttonsToAdd());
        this.$message = this.$content.find(".message");
        this.$confirmButton = this.$buttons.find(".confirm");
        this.$confirmButton.text(this.content.confirm);
        this.$cancelButton = this.$buttons.find(".close");
        this.$cancelButton.text(this.content.cancel);
        this.$element.hide();
        this.$confirmButton.on("click", function (e) {
            e.preventDefault();
            if (_this.confirmCallback) {
                _this.confirmCallback();
            }
            _this.close();
        });
        this.$cancelButton.on("click", function (e) {
            e.preventDefault();
            if (_this.cancelCallback) {
                _this.cancelCallback();
            }
            _this.close();
        });
    };
    AuthDialogue.prototype.open = function () {
        if (!this.service) {
            console.error('NO SERVICE');
            return;
        }
        _super.prototype.open.call(this);
        var header = this.service.getHeader();
        var description = this.service.getDescription();
        var confirmLabel = this.service.getConfirmLabel();
        if (header) {
            this.$title.text((0, Utils_1.sanitize)(header));
        }
        if (description) {
            this.$message.html((0, Utils_1.sanitize)(description));
            this.$message.targetBlank();
            this.$message.find("a").on("click", function () {
                var url = $(this).attr("href");
                this.extensionHost.publish(IIIFEvents_1.IIIFEvents.EXTERNAL_LINK_CLICKED, url);
            });
        }
        if (confirmLabel) {
            this.$confirmButton.text((0, Utils_1.sanitize)(confirmLabel));
        }
        this.resize();
    };
    AuthDialogue.prototype.resize = function () {
        _super.prototype.resize.call(this);
    };
    AuthDialogue.prototype._buttonsToAdd = function () {
        var buttonsToAdd = '<a class="confirm btn btn-primary" href="#" target="_parent"></a>';
        // If the top button is enabled, add an additional close button for consistency.
        if (this.config.topCloseButtonEnabled) {
            buttonsToAdd += '<button class="close btn btn-default"></button>';
        }
        return buttonsToAdd;
    };
    return AuthDialogue;
}(Dialogue_1.Dialogue));
exports.AuthDialogue = AuthDialogue;
//# sourceMappingURL=AuthDialogue.js.map