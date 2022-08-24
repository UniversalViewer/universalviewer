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
exports.getUUID = exports.defaultLocale = exports.isVisible = exports.loadCSS = exports.loadScripts = exports.propertyChanged = exports.propertiesChanged = exports.debounce = exports.isValidUrl = exports.sanitize = exports.merge = void 0;
var filterXSS = require("xss");
exports.merge = require("lodash/merge");
var sanitize = function (html) {
    return filterXSS(html, {
        whiteList: {
            a: ["href", "title", "target", "class", "data-uv-navigate"],
            b: [],
            br: [],
            i: [],
            img: ["src", "alt"],
            p: [],
            small: [],
            span: ["data-uv-navigate"],
            strong: [],
            sub: [],
            sup: [],
        },
    });
};
exports.sanitize = sanitize;
var isValidUrl = function (value) {
    var a = document.createElement("a");
    a.href = value;
    return !!a.host && a.host !== window.location.host;
};
exports.isValidUrl = isValidUrl;
var debounce = function (callback, wait) {
    var timeout;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var context = this;
        clearTimeout(timeout);
        timeout = setTimeout(function () { return callback.apply(context, args); }, wait);
    };
};
exports.debounce = debounce;
var propertiesChanged = function (newData, currentData, properties) {
    var propChanged = false;
    for (var i = 0; i < properties.length; i++) {
        propChanged = (0, exports.propertyChanged)(newData, currentData, properties[i]);
        if (propChanged) {
            break;
        }
    }
    return propChanged;
};
exports.propertiesChanged = propertiesChanged;
var propertyChanged = function (newData, currentData, propertyName) {
    return currentData[propertyName] !== newData[propertyName];
};
exports.propertyChanged = propertyChanged;
function appendScript(src) {
    return new Promise(function (resolve) {
        var script = document.createElement("script");
        script.src = src;
        script.onload = function () { return resolve(); };
        document.head.appendChild(script);
    });
}
function appendCSS(src) {
    return new Promise(function (resolve) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = src;
        link.onload = function () { return resolve(); };
        document.head.appendChild(link);
    });
}
var loadScripts = function (sources) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(sources.map(function (src) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, appendScript(src)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.loadScripts = loadScripts;
var loadCSS = function (sources) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(sources.map(function (src) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, appendCSS(src)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.loadCSS = loadCSS;
var isVisible = function (el) {
    // return el.css("visibility") !== "hidden"
    return el.is(":visible");
};
exports.isVisible = isVisible;
exports.defaultLocale = {
    name: "en-GB",
};
var getUUID = function () {
    return URL.createObjectURL(new Blob()).substr(-36);
};
exports.getUUID = getUUID;
//# sourceMappingURL=Utils.js.map