"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Events_1 = require("./Events");
var Utils_1 = require("./Utils");
var BaseContentHandler = /** @class */ (function () {
    function BaseContentHandler(options, adapter, eventListeners) {
        var _this = this;
        this.options = options;
        this.adapter = adapter;
        // console.log("create YouTubeContentHandler");
        this._el = this.options.target;
        // this._assignedContentHandler.adapter = this.adapter; // set adapter
        // add event listeners
        if (eventListeners) {
            eventListeners.forEach(function (_a) {
                var name = _a.name, cb = _a.cb;
                _this.on(name, cb);
            });
        }
    }
    BaseContentHandler.prototype.set = function (data, initial) { };
    BaseContentHandler.prototype.on = function (name, cb, ctx) {
        var e = this._eventListeners || (this._eventListeners = {});
        (e[name] || (e[name] = [])).push({
            cb: cb,
            ctx: ctx,
        });
    };
    BaseContentHandler.prototype.fire = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var data = [].slice.call(arguments, 1);
        var evtArr = ((this._eventListeners || (this._eventListeners = {}))[name] || []).slice();
        var i = 0;
        var len = evtArr.length;
        for (i; i < len; i++) {
            evtArr[i].cb.apply(evtArr[i].ctx, data);
        }
    };
    BaseContentHandler.prototype.showSpinner = function () {
        var _a;
        (_a = this._el.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove("loaded");
    };
    BaseContentHandler.prototype.hideSpinner = function () {
        var _a;
        (_a = this._el.parentElement) === null || _a === void 0 ? void 0 : _a.classList.add("loaded");
    };
    BaseContentHandler.prototype.configure = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, configs, mergedConfigs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        this.fire(Events_1.Events.CONFIGURE, {
                            config: config,
                            cb: function (promise) {
                                promises.push(promise);
                            },
                        });
                        if (!promises.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        configs = _a.sent();
                        mergedConfigs = configs.reduce(function (previous, current) {
                            return (0, Utils_1.merge)(previous, current);
                        });
                        config = (0, Utils_1.merge)(config, mergedConfigs);
                        _a.label = 2;
                    case 2: return [2 /*return*/, config];
                }
            });
        });
    };
    BaseContentHandler.prototype.exitFullScreen = function () { };
    BaseContentHandler.prototype.resize = function () { };
    BaseContentHandler.prototype.dispose = function () {
        var _a;
        this._el.innerHTML = "";
        this._el.className = "";
        (_a = this.adapter) === null || _a === void 0 ? void 0 : _a.dispose();
    };
    return BaseContentHandler;
}());
exports.default = BaseContentHandler;
//# sourceMappingURL=BaseContentHandler.js.map