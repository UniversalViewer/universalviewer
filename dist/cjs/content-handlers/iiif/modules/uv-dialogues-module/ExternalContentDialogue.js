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
exports.ExternalContentDialogue = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var Dialogue_1 = require("../uv-shared-module/Dialogue");
var ExternalContentDialogue = /** @class */ (function (_super) {
    __extends(ExternalContentDialogue, _super);
    function ExternalContentDialogue($element) {
        return _super.call(this, $element) || this;
    }
    ExternalContentDialogue.prototype.create = function () {
        var _this = this;
        this.setConfig("externalContentDialogue");
        _super.prototype.create.call(this);
        this.openCommand = IIIFEvents_1.IIIFEvents.SHOW_EXTERNALCONTENT_DIALOGUE;
        this.closeCommand = IIIFEvents_1.IIIFEvents.HIDE_EXTERNALCONTENT_DIALOGUE;
        this.extensionHost.subscribe(this.openCommand, function (params) {
            _this.open();
            _this.$iframe.prop("src", params.uri);
        });
        this.extensionHost.subscribe(this.closeCommand, function () {
            _this.close();
        });
        this.$iframe = $("<iframe></iframe>");
        this.$content.append(this.$iframe);
        this.$element.hide();
    };
    ExternalContentDialogue.prototype.resize = function () {
        _super.prototype.resize.call(this);
        this.$iframe.width(this.$content.width());
        this.$iframe.height(this.$content.height());
    };
    return ExternalContentDialogue;
}(Dialogue_1.Dialogue));
exports.ExternalContentDialogue = ExternalContentDialogue;
//# sourceMappingURL=ExternalContentDialogue.js.map