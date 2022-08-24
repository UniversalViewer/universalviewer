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
exports.ClickThroughDialogue = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var Dialogue_1 = require("../uv-shared-module/Dialogue");
var ClickThroughDialogue = /** @class */ (function (_super) {
    __extends(ClickThroughDialogue, _super);
    function ClickThroughDialogue($element) {
        return _super.call(this, $element) || this;
    }
    ClickThroughDialogue.prototype.create = function () {
        var _this = this;
        this.setConfig("clickThroughDialogue");
        _super.prototype.create.call(this);
        this.openCommand = IIIFEvents_1.IIIFEvents.SHOW_CLICKTHROUGH_DIALOGUE;
        this.closeCommand = IIIFEvents_1.IIIFEvents.HIDE_CLICKTHROUGH_DIALOGUE;
        this.extensionHost.subscribe(this.openCommand, function (params) {
            _this.acceptCallback = params.acceptCallback;
            _this.resource = params.resource;
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
                    <a class="acceptTerms btn btn-primary" href="#" target="_parent"></a>\
                </div>\
            </div>');
        this.$message = this.$content.find(".message");
        this.$acceptTermsButton = this.$content.find(".acceptTerms");
        // TODO: get from config this.$acceptTermsButton.text(this.content.acceptTerms); // figure out config
        this.$acceptTermsButton.text("Accept Terms and Open");
        this.$element.hide();
        this.$acceptTermsButton.on("click", function (e) {
            e.preventDefault();
            _this.close();
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.ACCEPT_TERMS);
            if (_this.acceptCallback)
                _this.acceptCallback();
        });
    };
    ClickThroughDialogue.prototype.open = function () {
        _super.prototype.open.call(this);
        if (this.resource.clickThroughService) {
            this.$title.text(this.resource.clickThroughService.getProperty("label"));
            this.$message.html(this.resource.clickThroughService.getProperty("description"));
            this.$message.targetBlank();
        }
        this.$message.find("a").on("click", function () {
            var url = $(this).attr("href");
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.EXTERNAL_LINK_CLICKED, url);
        });
        this.resize();
    };
    ClickThroughDialogue.prototype.resize = function () {
        _super.prototype.resize.call(this);
    };
    return ClickThroughDialogue;
}(Dialogue_1.Dialogue));
exports.ClickThroughDialogue = ClickThroughDialogue;
//# sourceMappingURL=ClickThroughDialogue.js.map