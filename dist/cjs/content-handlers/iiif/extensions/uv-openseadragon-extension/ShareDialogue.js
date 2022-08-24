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
exports.ShareDialogue = void 0;
var Events_1 = require("./Events");
var ShareDialogue_1 = require("../../modules/uv-dialogues-module/ShareDialogue");
var ShareDialogue = /** @class */ (function (_super) {
    __extends(ShareDialogue, _super);
    function ShareDialogue($element) {
        var _this = _super.call(this, $element) || this;
        _this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_OPEN, function () {
            _this.update();
        });
        _this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION_FINISH, function () {
            _this.update();
        });
        return _this;
    }
    ShareDialogue.prototype.create = function () {
        this.setConfig("shareDialogue");
        _super.prototype.create.call(this);
    };
    ShareDialogue.prototype.update = function () {
        _super.prototype.update.call(this);
        var xywh = (this.extension.getViewportBounds());
        var rotation = (this.extension.getViewerRotation());
        this.code = this.extension.getEmbedScript(this.options.embedTemplate, this.currentWidth, this.currentHeight, xywh, rotation);
        this.$code.val(this.code);
    };
    ShareDialogue.prototype.resize = function () {
        _super.prototype.resize.call(this);
    };
    return ShareDialogue;
}(ShareDialogue_1.ShareDialogue));
exports.ShareDialogue = ShareDialogue;
//# sourceMappingURL=ShareDialogue.js.map