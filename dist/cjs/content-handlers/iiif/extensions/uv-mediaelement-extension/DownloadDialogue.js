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
exports.DownloadDialogue = void 0;
var DownloadDialogue_1 = require("../../modules/uv-dialogues-module/DownloadDialogue");
var DownloadDialogue = /** @class */ (function (_super) {
    __extends(DownloadDialogue, _super);
    function DownloadDialogue($element) {
        return _super.call(this, $element) || this;
    }
    DownloadDialogue.prototype.create = function () {
        this.setConfig("downloadDialogue");
        _super.prototype.create.call(this);
    };
    DownloadDialogue.prototype.open = function (triggerButton) {
        _super.prototype.open.call(this, triggerButton);
        this.addEntireFileDownloadOptions();
        this.updateNoneAvailable();
        // Download option for text representation
        var canvas = this.extension.helper.getCurrentCanvas();
        var content = canvas.getContent();
        for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
            var annotation = content_1[_i];
            var body = annotation.getBody();
            for (var _a = 0, body_1 = body; _a < body_1.length; _a++) {
                var item = body_1[_a];
                var format = item.getFormat();
                if (format &&
                    (format.toString() === "text/plain" ||
                        format.toString() === "text/vtt")) {
                    this.addEntireFileDownloadOption(item.id, item.getDefaultLabel() ||
                        "Download as text " + (item.__jsonld.language ? "(" + item.__jsonld.language + ")" : ""), format.toString());
                }
            }
        }
        this.resize();
    };
    DownloadDialogue.prototype.isDownloadOptionAvailable = function (option) {
        return _super.prototype.isDownloadOptionAvailable.call(this, option);
    };
    return DownloadDialogue;
}(DownloadDialogue_1.DownloadDialogue));
exports.DownloadDialogue = DownloadDialogue;
//# sourceMappingURL=DownloadDialogue.js.map