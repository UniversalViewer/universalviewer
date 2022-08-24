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
exports.GenericDialogue = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var Dialogue_1 = require("./Dialogue");
var GenericDialogue = /** @class */ (function (_super) {
    __extends(GenericDialogue, _super);
    function GenericDialogue($element) {
        return _super.call(this, $element) || this;
    }
    GenericDialogue.prototype.create = function () {
        var _this = this;
        this.setConfig("genericDialogue");
        _super.prototype.create.call(this);
        this.openCommand = IIIFEvents_1.IIIFEvents.SHOW_GENERIC_DIALOGUE;
        this.closeCommand = IIIFEvents_1.IIIFEvents.HIDE_GENERIC_DIALOGUE;
        this.extensionHost.subscribe(this.openCommand, function (params) {
            _this.acceptCallback = params.acceptCallback;
            _this.showMessage(params);
        });
        this.extensionHost.subscribe(this.closeCommand, function () {
            _this.close();
        });
        this.$message = $("<p></p>");
        this.$content.append(this.$message);
        this.$acceptButton = $("\n          <button class=\"btn btn-primary accept default\">\n            " + this.content.ok + "\n          </button>\n        ");
        this.$buttons.append(this.$acceptButton);
        // Hide the redundant close button
        this.$buttons.find(".close").hide();
        this.$acceptButton.onPressed(function () {
            _this.accept();
        });
        this.returnFunc = function () {
            if (_this.isActive) {
                _this.accept();
            }
        };
        this.$element.hide();
    };
    GenericDialogue.prototype.accept = function () {
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CLOSE_ACTIVE_DIALOGUE);
        if (this.acceptCallback)
            this.acceptCallback();
    };
    GenericDialogue.prototype.showMessage = function (params) {
        this.$message.html(params.message);
        if (params.buttonText) {
            this.$acceptButton.text(params.buttonText);
        }
        else {
            this.$acceptButton.text(this.content.ok);
        }
        if (params.allowClose === false) {
            this.disableClose();
        }
        this.open();
    };
    GenericDialogue.prototype.resize = function () {
        _super.prototype.resize.call(this);
    };
    return GenericDialogue;
}(Dialogue_1.Dialogue));
exports.GenericDialogue = GenericDialogue;
//# sourceMappingURL=GenericDialogue.js.map