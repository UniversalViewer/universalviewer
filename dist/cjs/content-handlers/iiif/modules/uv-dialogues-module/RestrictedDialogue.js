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
exports.RestrictedDialogue = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var Dialogue_1 = require("../uv-shared-module/Dialogue");
var RestrictedDialogue = /** @class */ (function (_super) {
    __extends(RestrictedDialogue, _super);
    function RestrictedDialogue($element) {
        return _super.call(this, $element) || this;
    }
    RestrictedDialogue.prototype.create = function () {
        var _this = this;
        this.setConfig("restrictedDialogue");
        _super.prototype.create.call(this);
        this.openCommand = IIIFEvents_1.IIIFEvents.SHOW_RESTRICTED_DIALOGUE;
        this.closeCommand = IIIFEvents_1.IIIFEvents.HIDE_RESTRICTED_DIALOGUE;
        this.extensionHost.subscribe(this.openCommand, function (e) {
            _this.acceptCallback = e.acceptCallback;
            _this.options = e.options;
            _this.resource = e.resource;
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
                <div class="buttons">\
                    <a class="cancel btn btn-primary" href="#" target="_parent"></a>\
                </div>\
            </div>');
        this.$message = this.$content.find(".message");
        this.$message.targetBlank();
        // todo: revisit?
        //this.$nextVisibleButton = this.$content.find('.nextvisible');
        //this.$nextVisibleButton.text(this.content.nextVisibleItem);
        this.$cancelButton = this.$content.find(".cancel");
        this.$cancelButton.text(this.content.cancel);
        this.$element.hide();
        this.$cancelButton.on("click", function (e) {
            e.preventDefault();
            _this.close();
        });
    };
    RestrictedDialogue.prototype.open = function () {
        _super.prototype.open.call(this);
        this.isAccepted = false;
        var message = "";
        if (this.resource.restrictedService) {
            this.$title.text(this.resource.restrictedService.getProperty("label"));
            message = this.resource.restrictedService.getProperty("description");
        }
        this.$message.html(message);
        this.$message.targetBlank();
        this.$message.find("a").on("click", function () {
            var url = $(this).attr("href");
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.EXTERNAL_LINK_CLICKED, url);
        });
        this.resize();
    };
    RestrictedDialogue.prototype.close = function () {
        _super.prototype.close.call(this);
        if (!this.isAccepted && this.acceptCallback) {
            this.isAccepted = true;
            this.acceptCallback();
        }
    };
    RestrictedDialogue.prototype.resize = function () {
        _super.prototype.resize.call(this);
    };
    return RestrictedDialogue;
}(Dialogue_1.Dialogue));
exports.RestrictedDialogue = RestrictedDialogue;
//# sourceMappingURL=RestrictedDialogue.js.map