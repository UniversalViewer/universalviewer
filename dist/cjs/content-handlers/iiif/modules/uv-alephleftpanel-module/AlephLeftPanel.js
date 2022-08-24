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
exports.AlephLeftPanel = void 0;
var IIIFEvents_1 = require("../../IIIFEvents");
var LeftPanel_1 = require("../uv-shared-module/LeftPanel");
var Events_1 = require("../../extensions/uv-aleph-extension/Events");
var loader_1 = require("@universalviewer/aleph/loader");
var AlephLeftPanel = /** @class */ (function (_super) {
    __extends(AlephLeftPanel, _super);
    function AlephLeftPanel($element) {
        return _super.call(this, $element) || this;
    }
    AlephLeftPanel.prototype.create = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setConfig("alephLeftPanel");
                        _super.prototype.create.call(this);
                        return [4 /*yield*/, (0, loader_1.applyPolyfills)()];
                    case 1:
                        _a.sent();
                        (0, loader_1.defineCustomElements)(window);
                        this._alControlPanel = document.createElement("al-control-panel");
                        this._alControlPanel.setAttribute("src-tab-enabled", this.config.options.srcTabEnabled);
                        this._alControlPanel.setAttribute("settings-tab-enabled", this.config.options.settingsTabEnabled);
                        this._alControlPanel.setAttribute("graph-tab-enabled", this.config.options.graphTabEnabled);
                        this._alControlPanel.setAttribute("console-tab-enabled", this.config.options.consoleTabEnabled);
                        this._alControlPanel.setAttribute("height", "100%");
                        this.$main.addClass("disabled");
                        this.$main.append(this._alControlPanel);
                        this.setTitle(this.content.title);
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.LOADED, function (args) {
                            _this.$main.removeClass("disabled");
                        });
                        this.extensionHost.subscribe(Events_1.AlephExtensionEvents.VIEWER_CHANGE, function (state) {
                            _this._alControlPanel.angles = state.angles;
                            _this._alControlPanel.boundingBoxEnabled = state.boundingBoxEnabled;
                            _this._alControlPanel.controlsType = state.controlsType;
                            _this._alControlPanel.displayMode = state.displayMode;
                            _this._alControlPanel.edges = state.edges;
                            _this._alControlPanel.graphEnabled = state.graphEnabled;
                            _this._alControlPanel.nodes = state.nodes;
                            _this._alControlPanel.selected = state.selected;
                            _this._alControlPanel.units = state.units;
                            _this._alControlPanel.slicesIndex = state.slicesIndex;
                            _this._alControlPanel.slicesBrightness = state.volumeWindowCenter;
                            _this._alControlPanel.slicesContrast = state.volumeWindowWidth;
                            _this._alControlPanel.volumeSteps = state.volumeSteps;
                            _this._alControlPanel.volumeBrightness = state.volumeWindowCenter;
                            _this._alControlPanel.volumeContrast = state.volumeWindowWidth;
                        });
                        this._alControlPanel.addEventListener("boundingBoxEnabledChange", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.BOUNDING_BOX_ENABLED_CHANGE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("controlsTypeChange", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.CONTROLS_TYPE_CHANGE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("deleteAngle", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.DELETE_ANGLE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("deleteEdge", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.DELETE_EDGE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("deleteNode", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.DELETE_NODE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("displayModeChange", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.DISPLAY_MODE_CHANGE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("graphEnabledChange", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.GRAPH_ENABLED_CHANGE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("graphSubmitted", function (e) {
                            var graph = JSON.parse(e.detail);
                            if (graph) {
                                _this.extensionHost.publish(Events_1.AlephExtensionEvents.CLEAR_GRAPH);
                                _this.extensionHost.publish(Events_1.AlephExtensionEvents.SET_GRAPH, graph);
                            }
                        }, false);
                        this._alControlPanel.addEventListener("orientationChange", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.ORIENTATION_CHANGE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("recenter", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.RECENTER, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("saveNode", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.SET_NODE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("selectedChange", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.SELECT_NODE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("slicesIndexChange", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.SLICES_INDEX_CHANGE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("slicesBrightnessChange", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.VOLUME_BRIGHTNESS_CHANGE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("slicesContrastChange", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.VOLUME_CONTRAST_CHANGE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("unitsChange", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.UNITS_CHANGE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("volumeStepsChange", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.VOLUME_STEPS_CHANGE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("volumeBrightnessChange", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.VOLUME_BRIGHTNESS_CHANGE, e.detail);
                        }, false);
                        this._alControlPanel.addEventListener("volumeContrastChange", function (e) {
                            _this.extensionHost.publish(Events_1.AlephExtensionEvents.VOLUME_CONTRAST_CHANGE, e.detail);
                        }, false);
                        return [2 /*return*/];
                }
            });
        });
    };
    AlephLeftPanel.prototype.expandFullStart = function () {
        _super.prototype.expandFullStart.call(this);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LEFTPANEL_EXPAND_FULL_START);
    };
    AlephLeftPanel.prototype.expandFullFinish = function () {
        _super.prototype.expandFullFinish.call(this);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LEFTPANEL_EXPAND_FULL_FINISH);
    };
    AlephLeftPanel.prototype.collapseFullStart = function () {
        _super.prototype.collapseFullStart.call(this);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LEFTPANEL_COLLAPSE_FULL_START);
    };
    AlephLeftPanel.prototype.collapseFullFinish = function () {
        _super.prototype.collapseFullFinish.call(this);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
    };
    AlephLeftPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        if (this._alControlPanel) {
            this._alControlPanel.tabContentHeight = this.$main.height() - 68 + "px";
        }
    };
    return AlephLeftPanel;
}(LeftPanel_1.LeftPanel));
exports.AlephLeftPanel = AlephLeftPanel;
//# sourceMappingURL=AlephLeftPanel.js.map