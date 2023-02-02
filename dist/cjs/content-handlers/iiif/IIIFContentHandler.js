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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var $ = window.$;
require("jsviews")($);
var JQueryPlugins_1 = __importDefault(require("./JQueryPlugins"));
(0, JQueryPlugins_1.default)($);
var PubSub_1 = require("./PubSub");
var dist_commonjs_1 = require("@iiif/vocabulary/dist-commonjs/");
var manifold_1 = require("@iiif/manifold");
require("../../uv.css");
require("./themes/theme.less");
var Utils_1 = require("../../Utils");
var BaseContentHandler_1 = __importDefault(require("../../BaseContentHandler"));
var Events_1 = require("../../Events");
// use static paths (not based on variable) so webpack can use publicPath: "auto"
var Extension = {
    AV: {
        name: "uv-av-extension",
        loader: function () {
            /* webpackMode: "lazy" */ return Promise.resolve().then(function () { return __importStar(require("./extensions/uv-av-extension/Extension")); });
        },
    },
    ALEPH: {
        name: "uv-aleph-extension",
        loader: function () {
            /* webpackMode: "lazy" */ return Promise.resolve().then(function () { return __importStar(require("./extensions/uv-aleph-extension/Extension")); });
        },
    },
    DEFAULT: {
        name: "uv-default-extension",
        loader: function () {
            /* webpackMode: "lazy" */ return Promise.resolve().then(function () { return __importStar(require("./extensions/uv-default-extension/Extension")); });
        },
    },
    EBOOK: {
        name: "uv-ebook-extension",
        loader: function () {
            /* webpackMode: "lazy" */ return Promise.resolve().then(function () { return __importStar(require("./extensions/uv-ebook-extension/Extension")); });
        },
    },
    MEDIAELEMENT: {
        name: "uv-mediaelement-extension",
        loader: function () {
            /* webpackMode: "lazy" */ return Promise.resolve().then(function () { return __importStar(require("./extensions/uv-mediaelement-extension/Extension")); });
        },
    },
    MODELVIEWER: {
        name: "uv-model-viewer-extension",
        loader: function () {
            /* webpackMode: "lazy" */ return Promise.resolve().then(function () { return __importStar(require("./extensions/uv-model-viewer-extension/Extension")); });
        },
    },
    OSD: {
        name: "uv-openseadragon-extension",
        loader: function () {
            /* webpackMode: "lazy" */ return Promise.resolve().then(function () { return __importStar(require("./extensions/uv-openseadragon-extension/Extension")); });
        },
    },
    PDF: {
        name: "uv-pdf-extension",
        loader: function () {
            /* webpackMode: "lazy" */ return Promise.resolve().then(function () { return __importStar(require("./extensions/uv-pdf-extension/Extension")); });
        },
    },
    SLIDEATLAS: {
        name: "uv-openseadragon-extension",
        loader: function () {
            /* webpackMode: "lazy" */ return Promise.resolve().then(function () { return __importStar(require("./extensions/uv-openseadragon-extension/Extension")); });
        },
    },
};
var IIIFContentHandler = /** @class */ (function (_super) {
    __extends(IIIFContentHandler, _super);
    function IIIFContentHandler(options, adapter, eventListeners) {
        var _this = _super.call(this, options, adapter, eventListeners) || this;
        _this.options = options;
        _this.adapter = adapter;
        _this.isFullScreen = false;
        _this.disposed = false;
        _this.extra = { initial: false };
        // console.log("create IIIFContentHandler");
        _this.extra.initial = true;
        _this._pubsub = new PubSub_1.PubSub();
        _this._init();
        _this.resize();
        _this.extra.initial = false;
        return _this;
    }
    IIIFContentHandler.prototype._init = function () {
        var _this = this;
        this._extensionRegistry = {};
        this._extensionRegistry[dist_commonjs_1.ExternalResourceType.CANVAS] = Extension.OSD;
        this._extensionRegistry[dist_commonjs_1.ExternalResourceType.DOCUMENT] = Extension.PDF;
        this._extensionRegistry[dist_commonjs_1.ExternalResourceType.IMAGE] = Extension.OSD;
        this._extensionRegistry[dist_commonjs_1.ExternalResourceType.MOVING_IMAGE] =
            Extension.MEDIAELEMENT;
        this._extensionRegistry[dist_commonjs_1.ExternalResourceType.PHYSICAL_OBJECT] =
            Extension.MODELVIEWER;
        this._extensionRegistry[dist_commonjs_1.ExternalResourceType.SOUND] =
            Extension.MEDIAELEMENT;
        this._extensionRegistry[dist_commonjs_1.MediaType.AUDIO_MP4] = Extension.AV;
        this._extensionRegistry[dist_commonjs_1.MediaType.DICOM] = Extension.ALEPH;
        this._extensionRegistry[dist_commonjs_1.MediaType.DRACO] = Extension.MODELVIEWER;
        this._extensionRegistry[dist_commonjs_1.MediaType.EPUB] = Extension.EBOOK;
        this._extensionRegistry[dist_commonjs_1.MediaType.GIRDER] = Extension.SLIDEATLAS;
        this._extensionRegistry[dist_commonjs_1.MediaType.GLB] = Extension.MODELVIEWER;
        this._extensionRegistry[dist_commonjs_1.MediaType.GLTF] = Extension.MODELVIEWER;
        this._extensionRegistry[dist_commonjs_1.MediaType.JPG] = Extension.OSD;
        this._extensionRegistry[dist_commonjs_1.MediaType.MP3] = Extension.AV;
        this._extensionRegistry[dist_commonjs_1.MediaType.MPEG_DASH] = Extension.AV;
        this._extensionRegistry[dist_commonjs_1.MediaType.OPF] = Extension.EBOOK;
        this._extensionRegistry[dist_commonjs_1.MediaType.PDF] = Extension.PDF;
        this._extensionRegistry[dist_commonjs_1.MediaType.USDZ] = Extension.MODELVIEWER;
        this._extensionRegistry[dist_commonjs_1.MediaType.VIDEO_MP4] = Extension.AV;
        this._extensionRegistry[dist_commonjs_1.MediaType.WAV] = Extension.AV;
        this._extensionRegistry[dist_commonjs_1.MediaType.WEBM] = Extension.AV;
        this._extensionRegistry[dist_commonjs_1.RenderingFormat.PDF] = Extension.PDF;
        this.on(Events_1.Events.CREATED, function (_obj) {
            _this.hideSpinner();
        }, false);
        this.on(Events_1.Events.RELOAD, function (data) {
            data.isReload = true;
            _this.set(data);
        }, false);
        this.extra.initial = true;
        this.set(this.options.data);
        this.extra.initial = false;
        return true;
    };
    IIIFContentHandler.prototype._getExtensionByType = function (type, format) {
        return __awaiter(this, void 0, void 0, function () {
            var m, extension;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, type.loader()];
                    case 1:
                        m = _a.sent();
                        extension = new m.default();
                        extension.format = format;
                        extension.type = type;
                        return [2 /*return*/, extension];
                }
            });
        });
    };
    IIIFContentHandler.prototype._getExtensionByFormat = function (format) {
        if (!this._extensionRegistry[format]) {
            return this._getExtensionByType(Extension.DEFAULT, format);
        }
        return this._getExtensionByType(this._extensionRegistry[format], format);
    };
    IIIFContentHandler.prototype.set = function (data, initial) {
        if (initial) {
            this.extra.initial = true;
        }
        // if this is the first set
        if (!this.extension) {
            if (!data.iiifManifestId) {
                console.warn("iiifManifestId is required.");
                return;
            }
            this._reload(data);
        }
        else {
            // changing any of these data properties forces the UV to reload.
            var newData = Object.assign({}, this.extension.data, data);
            if (newData.isReload ||
                newData.iiifManifestId !== this.extension.data.iiifManifestId ||
                newData.manifestIndex !== this.extension.data.manifestIndex ||
                newData.collectionIndex !== this.extension.data.collectionIndex) {
                this.extension.data = newData;
                this.showSpinner();
                this._reload(this.extension.data);
            }
            else {
                // no need to reload, just update.
                this.extension.data = newData;
                this.extension.render();
            }
        }
        this.extra.initial = false;
    };
    // public get<T>(key: string): T | undefined {
    //   if (this.extension) {
    //     return this.extension.data[key];
    //   }
    //   return undefined;
    // }
    IIIFContentHandler.prototype.publish = function (event, args, extra) {
        this._pubsub.publish(event, args, __assign(__assign({}, this.extra), extra));
    };
    IIIFContentHandler.prototype.subscribe = function (event, handler) {
        var _this = this;
        this._pubsub.subscribe(event, handler);
        return function () {
            _this._pubsub.unsubscribe(event, handler);
        };
    };
    IIIFContentHandler.prototype.subscribeAll = function (handler) {
        var _this = this;
        this._pubsub.subscribeAll(handler);
        return function () {
            _this._pubsub.unsubscribeAll();
        };
    };
    IIIFContentHandler.prototype.dispose = function () {
        var _a;
        // console.log("dispose IIIFContentHandler");
        _super.prototype.dispose.call(this);
        this._pubsub.dispose();
        (_a = this.extension) === null || _a === void 0 ? void 0 : _a.dispose();
        this.disposed = true;
        // const $elem: JQuery = $(this.options.target);
        // $elem.empty();
        // remove all classes
        // $elem.attr("class", "");
    };
    IIIFContentHandler.prototype._reload = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var $elem, that, helper, trackingLabel, canvas, extension, content, format, annotation, body, type, type, canvasType, format_1, hasRanges, config, _a, e_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._pubsub.dispose(); // remove any existing event listeners
                        data.target = ""; // clear target
                        this.subscribe(Events_1.Events.RELOAD, function (data) {
                            _this.fire(Events_1.Events.RELOAD, data);
                        });
                        $elem = $(this.options.target);
                        // empty the containing element
                        $elem.empty();
                        that = this;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 20, , 21]);
                        return [4 /*yield*/, (0, manifold_1.loadManifest)({
                                manifestUri: data.iiifManifestId,
                                collectionIndex: data.collectionIndex,
                                manifestIndex: data.manifestIndex || 0,
                                canvasId: data.canvasId,
                                canvasIndex: data.canvasIndex || 0,
                                rangeId: data.rangeId,
                                locale: data.locales ? data.locales[0].name : undefined,
                            })];
                    case 2:
                        helper = _b.sent();
                        trackingLabel = helper.getTrackingLabel();
                        if (trackingLabel) {
                            trackingLabel +=
                                ", URI: " + (window.location !== window.parent.location)
                                    ? document.referrer
                                    : document.location;
                            window.trackingLabel = trackingLabel;
                        }
                        canvas = void 0;
                        canvas = helper.getCurrentCanvas();
                        if (!canvas) {
                            that._error("Canvas " + data.canvasIndex + " not found.");
                            return [2 /*return*/];
                        }
                        extension = void 0;
                        content = canvas.getContent();
                        format = void 0;
                        if (!content.length) return [3 /*break*/, 9];
                        annotation = content[0];
                        body = annotation.getBody();
                        if (!(body && body.length)) return [3 /*break*/, 8];
                        format = body[0].getFormat();
                        if (!format) return [3 /*break*/, 6];
                        return [4 /*yield*/, that._getExtensionByFormat(format)];
                    case 3:
                        extension = _b.sent();
                        if (!!extension) return [3 /*break*/, 5];
                        type = body[0].getType();
                        if (!type) return [3 /*break*/, 5];
                        return [4 /*yield*/, that._getExtensionByFormat(type)];
                    case 4:
                        extension = _b.sent();
                        _b.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        type = body[0].getType();
                        if (!type) return [3 /*break*/, 8];
                        return [4 /*yield*/, that._getExtensionByFormat(type)];
                    case 7:
                        extension = _b.sent();
                        _b.label = 8;
                    case 8: return [3 /*break*/, 13];
                    case 9:
                        canvasType = canvas.getType();
                        if (!canvasType) return [3 /*break*/, 11];
                        return [4 /*yield*/, that._getExtensionByFormat(canvasType)];
                    case 10:
                        // try using canvasType
                        extension = _b.sent();
                        _b.label = 11;
                    case 11:
                        if (!!extension) return [3 /*break*/, 13];
                        format_1 = canvas.getProperty("format");
                        return [4 /*yield*/, that._getExtensionByFormat(format_1)];
                    case 12:
                        extension = _b.sent();
                        _b.label = 13;
                    case 13:
                        hasRanges = helper.getRanges().length > 0;
                        if (!(extension.type === Extension.AV && !hasRanges)) return [3 /*break*/, 15];
                        return [4 /*yield*/, that._getExtensionByType(Extension.MEDIAELEMENT, format)];
                    case 14:
                        extension = _b.sent();
                        _b.label = 15;
                    case 15:
                        if (!!extension) return [3 /*break*/, 17];
                        return [4 /*yield*/, that._getExtensionByFormat(Extension.DEFAULT.name)];
                    case 16:
                        extension = _b.sent();
                        _b.label = 17;
                    case 17:
                        if (!data.locales) {
                            data.locales = [];
                            data.locales.push(Utils_1.defaultLocale);
                        }
                        return [4 /*yield*/, extension.loadConfig(data.locales[0].name)];
                    case 18:
                        config = _b.sent();
                        _a = data;
                        return [4 /*yield*/, that.configure(config)];
                    case 19:
                        _a.config = _b.sent();
                        that._createExtension(extension, data, helper);
                        return [3 /*break*/, 21];
                    case 20:
                        e_1 = _b.sent();
                        this.hideSpinner();
                        alert("Unable to load manifest");
                        return [3 /*break*/, 21];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    IIIFContentHandler.prototype._error = function (message) {
        this.fire(Events_1.Events.ERROR, message);
    };
    IIIFContentHandler.prototype._createExtension = function (extension, data, helper) {
        this.extension = extension;
        if (this.extension) {
            this.extension.extensionHost = this;
            this.extension.data = data;
            this.extension.helper = helper;
            this.extension.create();
        }
    };
    IIIFContentHandler.prototype.exitFullScreen = function () {
        if (this.extension) {
            this.extension.exitFullScreen();
        }
    };
    IIIFContentHandler.prototype.resize = function () {
        if (this.extension && !this.disposed) {
            this.extension.resize();
        }
    };
    return IIIFContentHandler;
}(BaseContentHandler_1.default));
exports.default = IIIFContentHandler;
//# sourceMappingURL=IIIFContentHandler.js.map