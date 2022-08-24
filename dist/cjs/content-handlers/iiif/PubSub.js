"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSub = void 0;
var PubSub = /** @class */ (function () {
    function PubSub() {
        this.events = {};
        this.onPublishHandler = function () { };
    }
    PubSub.prototype.publish = function (name, args, extra) {
        var _this = this;
        var handlers = this.events[name];
        if (handlers) {
            handlers.forEach(function (handler) {
                handler.call(_this, args, extra);
            });
        }
        this.onPublishHandler.call(this, name, args);
    };
    PubSub.prototype.subscribe = function (name, handler) {
        var handlers = this.events[name];
        if (handlers === undefined) {
            handlers = this.events[name] = [];
        }
        handlers.push(handler);
    };
    PubSub.prototype.subscribeAll = function (handler) {
        this.onPublishHandler = handler;
    };
    PubSub.prototype.unsubscribe = function (name, handler) {
        var handlers = this.events[name];
        if (handlers === undefined)
            return;
        var handlerIdx = handlers.indexOf(handler);
        handlers.splice(handlerIdx);
    };
    PubSub.prototype.unsubscribeAll = function () {
        this.onPublishHandler = function () { };
    };
    PubSub.prototype.dispose = function () {
        this.events = {};
    };
    return PubSub;
}());
exports.PubSub = PubSub;
//# sourceMappingURL=PubSub.js.map