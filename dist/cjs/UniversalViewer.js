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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversalViewer = void 0;
var BaseContentHandler_1 = __importDefault(require("./BaseContentHandler"));
var ContentType;
(function (ContentType) {
    ContentType["IIIFLEGACY"] = "manifest";
    ContentType["IIIF"] = "iiifManifestId";
    ContentType["YOUTUBE"] = "youTubeVideoId";
    ContentType["UNKNOWN"] = "unknown";
})(ContentType || (ContentType = {}));
var ContentHandler = (_a = {},
    _a[ContentType.IIIF] = function () {
        /* webpackMode: "lazy" */ return Promise.resolve().then(function () { return __importStar(require("./content-handlers/iiif/IIIFContentHandler")); });
    },
    _a[ContentType.YOUTUBE] = function () {
        /* webpackMode: "lazy" */ return Promise.resolve().then(function () { return __importStar(require("./content-handlers/youtube/YouTubeContentHandler")); });
    },
    _a);
var UniversalViewer = /** @class */ (function (_super) {
    __extends(UniversalViewer, _super);
    function UniversalViewer(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        _this._contentType = ContentType.UNKNOWN;
        _this._externalEventListeners = [];
        _this._assignContentHandler(_this.options.data);
        return _this;
    }
    UniversalViewer.prototype.on = function (name, cb, ctx) {
        this._externalEventListeners.push({
            name: name,
            cb: cb,
            ctx: ctx,
        });
    };
    UniversalViewer.prototype._assignContentHandler = function (data) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var contentType, handlerChanged, m;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (data[ContentType.IIIFLEGACY]) {
                            // if using "manifest" not "iiifManifestId"
                            data.iiifManifestId = data[ContentType.IIIFLEGACY];
                            delete data[ContentType.IIIFLEGACY];
                            contentType = ContentType.IIIF;
                        }
                        else if (data[ContentType.IIIF]) {
                            contentType = ContentType.IIIF;
                        }
                        else if (data[ContentType.YOUTUBE]) {
                            contentType = ContentType.YOUTUBE;
                        }
                        else if (this._contentType) {
                            contentType = this._contentType;
                        }
                        else {
                            contentType = ContentType.UNKNOWN;
                        }
                        handlerChanged = this._contentType !== contentType;
                        if (!(contentType === ContentType.UNKNOWN)) return [3 /*break*/, 1];
                        console.error("Unknown content type");
                        return [3 /*break*/, 3];
                    case 1:
                        if (!handlerChanged) return [3 /*break*/, 3];
                        this._contentType = contentType; // set content type
                        (_a = this._assignedContentHandler) === null || _a === void 0 ? void 0 : _a.dispose(); // dispose previous content handler
                        return [4 /*yield*/, ContentHandler[contentType]()];
                    case 2:
                        m = _b.sent();
                        this.showSpinner(); // show spinner
                        this._assignedContentHandler = new m.default({
                            target: this._el,
                            data: data,
                        }, this.adapter, this._externalEventListeners); // create content handler
                        _b.label = 3;
                    case 3: return [2 /*return*/, handlerChanged];
                }
            });
        });
    };
    UniversalViewer.prototype.set = function (data, initial) {
        var _this = this;
        // content type may have changed
        this._assignContentHandler(data).then(function (handlerChanged) {
            if (handlerChanged) {
                // the handler has changed, show a spinner until it's created
                _this.showSpinner();
            }
            else {
                // the handler didn't change, therefore handler's initial set didn't run
                // so we need to call set
                _this._assignedContentHandler.set(data, initial);
            }
        });
    };
    UniversalViewer.prototype.exitFullScreen = function () {
        var _a;
        (_a = this._assignedContentHandler) === null || _a === void 0 ? void 0 : _a.exitFullScreen();
    };
    UniversalViewer.prototype.resize = function () {
        var _a;
        (_a = this._assignedContentHandler) === null || _a === void 0 ? void 0 : _a.resize();
    };
    UniversalViewer.prototype.dispose = function () {
        var _a;
        (_a = this._assignedContentHandler) === null || _a === void 0 ? void 0 : _a.dispose();
    };
    return UniversalViewer;
}(BaseContentHandler_1.default));
exports.UniversalViewer = UniversalViewer;
//# sourceMappingURL=UniversalViewer.js.map