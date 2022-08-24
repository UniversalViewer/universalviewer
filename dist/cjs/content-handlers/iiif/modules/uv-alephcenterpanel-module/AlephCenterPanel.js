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
exports.AlephCenterPanel = void 0;
var IIIFEvents_1 = require("../../IIIFEvents");
var CenterPanel_1 = require("../uv-shared-module/CenterPanel");
var DisplayMode_1 = require("./DisplayMode");
var Events_1 = require("../../extensions/uv-aleph-extension/Events");
var Position_1 = require("../uv-shared-module/Position");
var utils_1 = require("@edsilv/utils");
var loader_1 = require("@universalviewer/aleph/loader");
require("@universalviewer/aleph/dist/collection/assets/OrbitControls");
var Events_2 = require("../../../../Events");
var AlephCenterPanel = /** @class */ (function (_super) {
    __extends(AlephCenterPanel, _super);
    function AlephCenterPanel($element) {
        var _this = _super.call(this, $element) || this;
        _this._alViewerReady = false;
        _this._state = {};
        _this._prevState = {};
        _this.attributionPosition = Position_1.Position.BOTTOM_RIGHT;
        return _this;
    }
    AlephCenterPanel.prototype.create = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dracoDecoderPath, that;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setConfig("alephCenterPanel");
                        _super.prototype.create.call(this);
                        return [4 /*yield*/, (0, loader_1.applyPolyfills)()];
                    case 1:
                        _a.sent();
                        (0, loader_1.defineCustomElements)(window);
                        this._alViewer = document.createElement("al-viewer");
                        this.$content.prepend(this._alViewer);
                        this._alViewer.setAttribute("width", "100%");
                        this._alViewer.setAttribute("height", "100%");
                        dracoDecoderPath = "https://www.gstatic.com/draco/v1/decoders/";
                        this._alViewer.setAttribute("draco-decoder-path", dracoDecoderPath);
                        this._alViewer.addEventListener("change", function (e) {
                            if (_this._alViewerReady) {
                                _this._nextState(Object.assign({}, e.detail, {
                                    src: _this._prevState.src,
                                }));
                            }
                        }, false);
                        this._alViewer.addEventListener("loaded", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.LOADED, {
                                stackhelper: _this._state.displayMode !== DisplayMode_1.DisplayMode.MESH ? e.detail : null,
                            });
                        }, false);
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.CONTROLS_TYPE_CHANGE, function (controlsType) {
                            _this._alViewer.setControlsType(controlsType);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.CLEAR_GRAPH, function () {
                            _this._alViewer.clearGraph();
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.DELETE_ANGLE, function (id) {
                            _this._alViewer.deleteAngle(id);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.DELETE_EDGE, function (id) {
                            _this._alViewer.deleteEdge(id);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.DELETE_NODE, function (id) {
                            _this._alViewer.deleteNode(id);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.DISPLAY_MODE_CHANGE, function (displayMode) {
                            _this._alViewer.setDisplayMode(displayMode);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.GRAPH_ENABLED_CHANGE, function (enabled) {
                            _this._alViewer.setGraphEnabled(enabled);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.BOUNDING_BOX_ENABLED_CHANGE, function (enabled) {
                            _this._alViewer.setBoundingBoxEnabled(enabled);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.ORIENTATION_CHANGE, function (orientation) {
                            _this._alViewer.setOrientation(orientation);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.RECENTER, function () {
                            _this._alViewer.recenter();
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.SET_GRAPH, function (graph) {
                            _this._alViewer.setGraph(graph);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.SET_NODE, function (node) {
                            _this._alViewer.setNode(node);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.SELECT_NODE, function (id) {
                            _this._alViewer.selectNode(id);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.SLICES_INDEX_CHANGE, function (index) {
                            _this._alViewer.setSlicesIndex(index);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.SLICES_BRIGHTNESS_CHANGE, function (brightness) {
                            _this._alViewer.setVolumeBrightness(brightness);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.SLICES_CONTRAST_CHANGE, function (contrast) {
                            _this._alViewer.setVolumeContrast(contrast);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.UNITS_CHANGE, function (units) {
                            _this._alViewer.setUnits(units);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.VOLUME_STEPS_CHANGE, function (steps) {
                            _this._alViewer.setVolumeSteps(steps);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.VOLUME_BRIGHTNESS_CHANGE, function (brightness) {
                            _this._alViewer.setVolumeBrightness(brightness);
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.VOLUME_CONTRAST_CHANGE, function (contrast) {
                            _this._alViewer.setVolumeContrast(contrast);
                        });
                        utils_1.Async.waitFor(function () {
                            return window.customElements !== undefined;
                        }, function () {
                            customElements.whenDefined("al-viewer").then(function () {
                                _this._alViewerReady = true;
                                _this._alViewer.load(_this._state.src, _this._state.displayMode);
                            });
                        });
                        that = this;
                        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_EXTERNAL_RESOURCE, function (resources) {
                            that.openMedia(resources);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    AlephCenterPanel.prototype.openMedia = function (resources) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.extension.getExternalResources(resources).then(function () { return __awaiter(_this, void 0, void 0, function () {
                    var canvas, annotations, annotation, body, media, format, displayMode;
                    return __generator(this, function (_a) {
                        canvas = this.extension.helper.getCurrentCanvas();
                        annotations = canvas.getContent();
                        if (annotations.length) {
                            annotation = annotations[0];
                            body = annotation.getBody();
                            if (body.length) {
                                media = body[0];
                                format = media.getFormat();
                                displayMode = format && format.toString() === "model/gltf+json"
                                    ? DisplayMode_1.DisplayMode.MESH
                                    : DisplayMode_1.DisplayMode.SLICES;
                                // only load AMI if not DisplayMode.MESH
                                // if (displayMode !== DisplayMode.MESH) {
                                //   window.AMI = await import(
                                //     /* webpackChunkName: "ami" */ /* webpackMode: "lazy" */ "@universalviewer/aleph/dist/collection/assets/ami.min"
                                //   );
                                // }
                                this._nextState({
                                    src: media.id,
                                    displayMode: displayMode,
                                });
                            }
                        }
                        this.extensionHost.publish(Events_2.Events.EXTERNAL_RESOURCE_OPENED);
                        this.extensionHost.publish(Events_2.Events.LOAD);
                        return [2 /*return*/];
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    AlephCenterPanel.prototype._nextState = function (s) {
        var _this = this;
        this._state = Object.assign({}, this._state, s);
        if (this._state.src && this._state.src !== this._prevState.src) {
            utils_1.Async.waitFor(function () {
                return _this._alViewerReady;
            }, function () {
                _this._alViewer.load(_this._state.src);
            });
        }
        this.extensionHost.publish(Events_1.AlephExtensionEvents.VIEWER_CHANGE, this._state);
        this._prevState = Object.assign({}, this._state);
    };
    AlephCenterPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        if (this._alViewerReady && this._state.srcLoaded) {
            this._alViewer.resize();
        }
    };
    return AlephCenterPanel;
}(CenterPanel_1.CenterPanel));
exports.AlephCenterPanel = AlephCenterPanel;
//# sourceMappingURL=AlephCenterPanel.js.map