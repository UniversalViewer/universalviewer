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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFCenterPanel = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var CenterPanel_1 = require("../uv-shared-module/CenterPanel");
var Events_1 = require("../../extensions/uv-pdf-extension/Events");
var utils_1 = require("@edsilv/utils");
var Events_2 = require("../../../../Events");
var Utils_1 = require("../../../../Utils");
// declare var PDFJS: any;
var PDFCenterPanel = /** @class */ (function (_super) {
    __extends(PDFCenterPanel, _super);
    function PDFCenterPanel($element) {
        var _this = _super.call(this, $element) || this;
        _this._lastMediaUri = null;
        _this._maxScale = 5;
        _this._minScale = 0.7;
        _this._nextButtonEnabled = false;
        _this._pageIndex = 1;
        _this._pageIndexPending = null;
        _this._pageRendering = false;
        _this._pdfDoc = null;
        _this._pdfjsLib = null;
        _this._prevButtonEnabled = false;
        _this._scale = 0.7;
        return _this;
    }
    PDFCenterPanel.prototype.create = function () {
        var _this = this;
        this.setConfig("pdfCenterPanel");
        _super.prototype.create.call(this);
        this._$pdfContainer = $('<div class="pdfContainer"></div>');
        this._$canvas = $("<canvas></canvas>");
        // this._$spinner = $('<div class="spinner"></div>');
        this._$progress = $('<progress max="100" value="0"></progress>');
        this._canvas = this._$canvas[0];
        this._ctx = this._canvas.getContext("2d");
        this._$prevButton = $('<div class="btn prev" tabindex="0"></div>');
        this._$nextButton = $('<div class="btn next" tabindex="0"></div>');
        this._$zoomInButton = $('<div class="btn zoomIn" tabindex="0"></div>');
        this._$zoomOutButton = $('<div class="btn zoomOut" tabindex="0"></div>');
        // Only attach PDF controls if we're using PDF.js; they have no meaning in
        // PDFObject. However, we still create the objects above so that references
        // to them do not cause errors (simpler than putting usePdfJs checks all over):
        if (utils_1.Bools.getBool(this.extension.data.config.options.usePdfJs, false)) {
            // this.$content.append(this._$spinner);
            this.$content.append(this._$progress);
            this.$content.append(this._$prevButton);
            this.$content.append(this._$nextButton);
            this.$content.append(this._$zoomInButton);
            this.$content.append(this._$zoomOutButton);
        }
        this._$pdfContainer.append(this._$canvas);
        this.$content.prepend(this._$pdfContainer);
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_EXTERNAL_RESOURCE, function (resources) {
            _this.openMedia(resources);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.FIRST, function () {
            if (!_this._pdfDoc) {
                return;
            }
            _this._pageIndex = 1;
            _this._queueRenderPage(_this._pageIndex);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.PREV, function () {
            if (!_this._pdfDoc) {
                return;
            }
            if (_this._pageIndex <= 1) {
                return;
            }
            _this._pageIndex--;
            _this._queueRenderPage(_this._pageIndex);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.NEXT, function () {
            if (!_this._pdfDoc) {
                return;
            }
            if (_this._pageIndex >= _this._pdfDoc.numPages) {
                return;
            }
            _this._pageIndex++;
            _this._queueRenderPage(_this._pageIndex);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.LAST, function () {
            if (!_this._pdfDoc) {
                return;
            }
            _this._pageIndex = _this._pdfDoc.numPages;
            _this._queueRenderPage(_this._pageIndex);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function () {
            if (!_this._pdfDoc) {
                return;
            }
            _this._pageIndex = 1;
            _this._queueRenderPage(_this._pageIndex);
        });
        this.extensionHost.subscribe(Events_1.PDFExtensionEvents.SEARCH, function (pageIndex) {
            if (!_this._pdfDoc) {
                return;
            }
            if (pageIndex < 1 || pageIndex > _this._pdfDoc.numPages) {
                return;
            }
            _this._pageIndex = pageIndex;
            _this._queueRenderPage(_this._pageIndex);
        });
        this._$prevButton.onPressed(function (e) {
            e.preventDefault();
            if (!_this._prevButtonEnabled)
                return;
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.PREV);
        });
        this.disablePrevButton();
        this._$nextButton.onPressed(function (e) {
            e.preventDefault();
            if (!_this._nextButtonEnabled)
                return;
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.NEXT);
        });
        this.disableNextButton();
        this._$zoomInButton.onPressed(function (e) {
            e.preventDefault();
            var newScale = _this._scale + 0.5;
            if (newScale < _this._maxScale) {
                _this._scale = newScale;
            }
            else {
                _this._scale = _this._maxScale;
            }
            _this._render(_this._pageIndex);
        });
        this._$zoomOutButton.onPressed(function (e) {
            e.preventDefault();
            var newScale = _this._scale - 0.5;
            if (newScale > _this._minScale) {
                _this._scale = newScale;
            }
            else {
                _this._scale = _this._minScale;
            }
            _this._render(_this._pageIndex);
        });
    };
    PDFCenterPanel.prototype.disablePrevButton = function () {
        this._prevButtonEnabled = false;
        this._$prevButton.addClass("disabled");
    };
    PDFCenterPanel.prototype.enablePrevButton = function () {
        this._prevButtonEnabled = true;
        this._$prevButton.removeClass("disabled");
    };
    PDFCenterPanel.prototype.hidePrevButton = function () {
        this.disablePrevButton();
        this._$prevButton.hide();
    };
    PDFCenterPanel.prototype.showPrevButton = function () {
        this.enablePrevButton();
        this._$prevButton.show();
    };
    PDFCenterPanel.prototype.disableNextButton = function () {
        this._nextButtonEnabled = false;
        this._$nextButton.addClass("disabled");
    };
    PDFCenterPanel.prototype.enableNextButton = function () {
        this._nextButtonEnabled = true;
        this._$nextButton.removeClass("disabled");
    };
    PDFCenterPanel.prototype.hideNextButton = function () {
        this.disableNextButton();
        this._$nextButton.hide();
    };
    PDFCenterPanel.prototype.showNextButton = function () {
        this.enableNextButton();
        this._$nextButton.show();
    };
    PDFCenterPanel.prototype.openMedia = function (resources) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaUri, canvas, formats, pdfUri, _a, parameter, loadingTask;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // this._$spinner.show();
                    return [4 /*yield*/, this.extension.getExternalResources(resources)];
                    case 1:
                        // this._$spinner.show();
                        _b.sent();
                        mediaUri = null;
                        canvas = this.extension.helper.getCurrentCanvas();
                        formats = this.extension.getMediaFormats(canvas);
                        pdfUri = canvas.id;
                        if (formats && formats.length) {
                            mediaUri = formats[0].id;
                        }
                        else {
                            mediaUri = canvas.id;
                        }
                        if (mediaUri === this._lastMediaUri) {
                            return [2 /*return*/];
                        }
                        this._lastMediaUri = mediaUri;
                        if (!!utils_1.Bools.getBool(this.extension.data.config.options.usePdfJs, false)) return [3 /*break*/, 3];
                        _a = window;
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(
                            /* webpackChunkName: "pdfobject" */ /* webpackMode: "lazy" */ "pdfobject")); })];
                    case 2:
                        _a.PDFObject = _b.sent();
                        window.PDFObject.embed(pdfUri, ".pdfContainer", { id: "PDF" });
                        return [3 /*break*/, 7];
                    case 3:
                        if (!!this._pdfjsLib) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, Utils_1.loadScripts)(["//mozilla.github.io/pdf.js/build/pdf.js"])];
                    case 4:
                        _b.sent();
                        this._pdfjsLib = window["pdfjs-dist/build/pdf"];
                        this._pdfjsLib.GlobalWorkerOptions.workerSrc =
                            "//mozilla.github.io/pdf.js/build/pdf.worker.js";
                        return [3 /*break*/, 6];
                    case 5:
                        this._$progress[0].setAttribute("value", "0");
                        this._$progress.show();
                        this._$canvas.hide();
                        _b.label = 6;
                    case 6:
                        parameter = {
                            url: mediaUri,
                            withCredentials: canvas.externalResource.isAccessControlled(),
                        };
                        loadingTask = this._pdfjsLib.getDocument(parameter);
                        loadingTask.onProgress = function (progress) {
                            var percentLoaded = (progress.loaded / progress.total) * 100;
                            _this._$progress[0].setAttribute("value", String(percentLoaded));
                            if (percentLoaded === 100) {
                                _this._$progress.hide();
                                _this._$canvas.show();
                            }
                        };
                        loadingTask.promise.then(function (pdf) {
                            _this._pdfDoc = pdf;
                            _this._render(_this._pageIndex);
                            _this.extensionHost.publish(Events_1.PDFExtensionEvents.PDF_LOADED, pdf);
                        });
                        _b.label = 7;
                    case 7:
                        this.extensionHost.publish(Events_2.Events.EXTERNAL_RESOURCE_OPENED);
                        this.extensionHost.publish(Events_2.Events.LOAD);
                        return [2 /*return*/];
                }
            });
        });
    };
    PDFCenterPanel.prototype._render = function (num) {
        var _this = this;
        if (!utils_1.Bools.getBool(this.extension.data.config.options.usePdfJs, false)) {
            return;
        }
        this._pageRendering = true;
        this._$zoomOutButton.enable();
        this._$zoomInButton.enable();
        //disable zoom if not possible
        var lowScale = this._scale - 0.5;
        var highScale = this._scale + 0.5;
        if (lowScale < this._minScale) {
            this._$zoomOutButton.disable();
        }
        if (highScale > this._maxScale) {
            this._$zoomInButton.disable();
        }
        //this._pdfDoc.getPage(num).then((page: any) => {
        this._pdfDoc.getPage(num).then(function (page) {
            if (_this._renderTask) {
                _this._renderTask.cancel();
            }
            // how to fit to the available space
            // const height: number = this.$content.height();
            // this._canvas.height = height;
            // this._viewport = page.getViewport(this._canvas.height / page.getViewport(1.0).height);
            // const width: number = this._viewport.width;
            // this._canvas.width = width;
            // this._$canvas.css({
            //     left: (this.$content.width() / 2) - (width / 2)
            // });
            // scale viewport
            _this._viewport = page.getViewport({ scale: _this._scale });
            _this._canvas.height = _this._viewport.height;
            _this._canvas.width = _this._viewport.width;
            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: _this._ctx,
                viewport: _this._viewport,
            };
            _this._renderTask = page.render(renderContext);
            // Wait for rendering to finish
            _this._renderTask.promise
                .then(function () {
                _this.extensionHost.publish(Events_1.PDFExtensionEvents.PAGE_INDEX_CHANGE, _this._pageIndex);
                _this._pageRendering = false;
                if (_this._pageIndexPending !== null) {
                    // New page rendering is pending
                    _this._render(_this._pageIndexPending);
                    _this._pageIndexPending = null;
                }
                if (_this._pageIndex === 1) {
                    _this.disablePrevButton();
                }
                else {
                    _this.enablePrevButton();
                }
                if (_this._pageIndex === _this._pdfDoc.numPages) {
                    _this.disableNextButton();
                }
                else {
                    _this.enableNextButton();
                }
            })
                .catch(function (_err) {
                //console.log(err);
            });
        });
    };
    PDFCenterPanel.prototype._queueRenderPage = function (num) {
        if (this._pageRendering) {
            this._pageIndexPending = num;
        }
        else {
            this._render(num);
        }
    };
    PDFCenterPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        this._$pdfContainer.width(this.$content.width());
        this._$pdfContainer.height(this.$content.height());
        // this._$spinner.css(
        //   "top",
        //   this.$content.height() / 2 - this._$spinner.height() / 2
        // );
        // this._$spinner.css(
        //   "left",
        //   this.$content.width() / 2 - this._$spinner.width() / 2
        // );
        this._$progress.css("top", this.$content.height() / 2 - this._$progress.height() / 2);
        this._$progress.css("left", this.$content.width() / 2 - this._$progress.width() / 2);
        this._$prevButton.css({
            top: (this.$content.height() - this._$prevButton.height()) / 2,
            left: this._$prevButton.horizontalMargins(),
        });
        this._$nextButton.css({
            top: (this.$content.height() - this._$nextButton.height()) / 2,
            left: this.$content.width() -
                (this._$nextButton.width() + this._$nextButton.horizontalMargins()),
        });
        if (!this._viewport) {
            return;
        }
        this._render(this._pageIndex);
    };
    return PDFCenterPanel;
}(CenterPanel_1.CenterPanel));
exports.PDFCenterPanel = PDFCenterPanel;
//# sourceMappingURL=PDFCenterPanel.js.map