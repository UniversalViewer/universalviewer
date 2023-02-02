"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformationFactory = void 0;
var IIIFEvents_1 = require("../../IIIFEvents");
var Information_1 = require("./Information");
var InformationAction_1 = require("./InformationAction");
var InformationType_1 = require("./InformationType");
var InformationFactory = /** @class */ (function () {
    function InformationFactory(extension) {
        this.extension = extension;
    }
    InformationFactory.prototype.Get = function (args) {
        var _this = this;
        switch (args.informationType) {
            case InformationType_1.InformationType.AUTH_CORS_ERROR:
                return new Information_1.Information(this.extension.data.config.content.authCORSError, []);
            case InformationType_1.InformationType.DEGRADED_RESOURCE:
                var actions = [];
                var loginAction = new InformationAction_1.InformationAction();
                var label = args.param.loginService.getConfirmLabel();
                if (!label) {
                    label = this.extension.data.config.content.fallbackDegradedLabel || 'login';
                }
                loginAction.label = label;
                var resource_1 = args.param;
                loginAction.action = function () {
                    resource_1.authHoldingPage = window.open("", "_blank");
                    _this.extension.extensionHost.publish(IIIFEvents_1.IIIFEvents.HIDE_INFORMATION);
                    _this.extension.extensionHost.publish(IIIFEvents_1.IIIFEvents.OPEN_EXTERNAL_RESOURCE, [[resource_1]]);
                };
                actions.push(loginAction);
                var message = args.param.loginService.getServiceLabel();
                if (!message) {
                    message = this.extension.data.config.content.fallbackDegradedMessage;
                }
                return new Information_1.Information(message, actions);
        }
    };
    return InformationFactory;
}());
exports.InformationFactory = InformationFactory;
//# sourceMappingURL=InformationFactory.js.map