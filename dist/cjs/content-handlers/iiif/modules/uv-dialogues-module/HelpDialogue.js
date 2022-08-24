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
exports.HelpDialogue = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var Dialogue_1 = require("../uv-shared-module/Dialogue");
var HelpDialogue = /** @class */ (function (_super) {
    __extends(HelpDialogue, _super);
    function HelpDialogue($element) {
        return _super.call(this, $element) || this;
    }
    HelpDialogue.prototype.create = function () {
        var _this = this;
        this.setConfig("helpDialogue");
        _super.prototype.create.call(this);
        this.openCommand = IIIFEvents_1.IIIFEvents.SHOW_HELP_DIALOGUE;
        this.closeCommand = IIIFEvents_1.IIIFEvents.HIDE_HELP_DIALOGUE;
        this.extensionHost.subscribe(this.openCommand, function () {
            _this.open();
        });
        this.extensionHost.subscribe(this.closeCommand, function () {
            _this.close();
        });
        this.$title = $("<div role=\"heading\" class=\"heading\"></div>");
        this.$content.append(this.$title);
        this.$scroll = $('<div class="scroll"></div>');
        this.$content.append(this.$scroll);
        this.$message = $("<p></p>");
        this.$scroll.append(this.$message);
        // initialise ui.
        this.$title.text(this.content.title);
        this.$message.html(this.content.text);
        // ensure anchor tags link to _blank.
        this.$message.targetBlank();
        this.$element.hide();
    };
    HelpDialogue.prototype.resize = function () {
        _super.prototype.resize.call(this);
    };
    return HelpDialogue;
}(Dialogue_1.Dialogue));
exports.HelpDialogue = HelpDialogue;
//# sourceMappingURL=HelpDialogue.js.map