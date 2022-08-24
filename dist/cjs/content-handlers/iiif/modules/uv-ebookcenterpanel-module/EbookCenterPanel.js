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
exports.EbookCenterPanel = void 0;
var utils_1 = require("@edsilv/utils");
var IIIFEvents_1 = require("../../IIIFEvents");
var CenterPanel_1 = require("../uv-shared-module/CenterPanel");
var Events_1 = require("../../extensions/uv-ebook-extension/Events");
var Position_1 = require("../uv-shared-module/Position");
var loader_1 = require("@universalviewer/uv-ebook-components/loader");
var Events_2 = require("../../../../Events");
var EbookCenterPanel = /** @class */ (function (_super) {
    __extends(EbookCenterPanel, _super);
    function EbookCenterPanel($element) {
        var _this = _super.call(this, $element) || this;
        _this._ebookReaderReady = false;
        _this._state = {};
        _this._prevState = {};
        _this.attributionPosition = Position_1.Position.BOTTOM_RIGHT;
        return _this;
    }
    EbookCenterPanel.prototype.create = function () {
        return __awaiter(this, void 0, void 0, function () {
            var that;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setConfig("ebookCenterPanel");
                        _super.prototype.create.call(this);
                        return [4 /*yield*/, (0, loader_1.applyPolyfills)()];
                    case 1:
                        _a.sent();
                        (0, loader_1.defineCustomElements)(window);
                        this._ebookReader = document.createElement("uv-ebook-reader");
                        this.$content.prepend(this._ebookReader);
                        this._ebookReader.setAttribute("width", "100%");
                        this._ebookReader.setAttribute("height", "100%");
                        this._ebookReader.addEventListener("loadedNavigation", function (e) {
                            _this.extensionHost.publish(Events_1.EbookExtensionEvents.LOADED_NAVIGATION, e.detail);
                        }, false);
                        this._ebookReader.addEventListener("relocated", function (e) {
                            _this.extensionHost.publish(Events_1.EbookExtensionEvents.RELOCATED, e.detail);
                            _this._cfi = e.detail.start.cfi;
                            _this.extensionHost.publish(Events_1.EbookExtensionEvents.CFI_FRAGMENT_CHANGE, _this._cfi);
                        }, false);
                        utils_1.Async.waitFor(function () {
                            return window.customElements !== undefined;
                        }, function () {
                            customElements.whenDefined("uv-ebook-reader").then(function () {
                                _this._ebookReaderReady = true;
                            });
                        });
                        that = this;
                        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_EXTERNAL_RESOURCE, function (resources) {
                            that.openMedia(resources);
                        });
                        this.extensionHost.subscribe(Events_1.EbookExtensionEvents.ITEM_CLICKED, function (href) {
                            _this._nextState({
                                cfi: href,
                            });
                        });
                        this.extensionHost.subscribe(Events_1.EbookExtensionEvents.CFI_FRAGMENT_CHANGE, function (cfi) {
                            utils_1.Async.waitFor(function () {
                                return _this._ebookReaderReady;
                            }, function () {
                                if (cfi !== _this._cfi) {
                                    _this._nextState({
                                        cfi: cfi,
                                    });
                                }
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    EbookCenterPanel.prototype.openMedia = function (resources) {
        var _this = this;
        this.extension.getExternalResources(resources).then(function () {
            var canvas = _this.extension.helper.getCurrentCanvas();
            var annotations = canvas.getContent();
            if (annotations.length) {
                var annotation = annotations[0];
                var body = annotation.getBody();
                if (body.length) {
                    var media = body[0];
                    //const format: MediaType | null = media.getFormat();
                    _this._nextState({
                        bookPath: media.id,
                    });
                }
            }
            _this.extensionHost.publish(Events_2.Events.EXTERNAL_RESOURCE_OPENED);
            _this.extensionHost.publish(Events_2.Events.LOAD);
        });
    };
    EbookCenterPanel.prototype._nextState = function (s) {
        var _this = this;
        this._state = Object.assign({}, this._state, s);
        utils_1.Async.waitFor(function () {
            return _this._ebookReaderReady;
        }, function () {
            if (_this._state.bookPath &&
                _this._state.bookPath !== _this._prevState.bookPath) {
                _this._ebookReader.load(_this._state.bookPath);
            }
            if (_this._state.cfi && _this._state.cfi !== _this._prevState.cfi) {
                _this._ebookReader.display(_this._state.cfi);
            }
            _this._prevState = Object.assign({}, _this._state);
        });
    };
    EbookCenterPanel.prototype.resize = function () {
        var _this = this;
        _super.prototype.resize.call(this);
        if (this._ebookReaderReady) {
            setTimeout(function () {
                _this._ebookReader.resize();
            }, 10);
        }
    };
    return EbookCenterPanel;
}(CenterPanel_1.CenterPanel));
exports.EbookCenterPanel = EbookCenterPanel;
//# sourceMappingURL=EbookCenterPanel.js.map