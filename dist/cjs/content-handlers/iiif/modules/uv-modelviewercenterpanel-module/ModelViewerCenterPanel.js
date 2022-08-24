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
exports.ModelViewerCenterPanel = void 0;
var $ = window.$;
// import "@webcomponents/webcomponentsjs/webcomponents-bundle.js";
// import "@google/model-viewer/dist/model-viewer-legacy";
require("@google/model-viewer/dist/model-viewer");
var Utils_1 = require("../../../../Utils");
var IIIFEvents_1 = require("../../IIIFEvents");
var CenterPanel_1 = require("../uv-shared-module/CenterPanel");
var Events_1 = require("../../extensions/uv-model-viewer-extension/Events");
var Orbit_1 = require("../../extensions/uv-model-viewer-extension/Orbit");
var utils_1 = require("@edsilv/utils");
var Events_2 = require("../../../../Events");
var ModelViewerCenterPanel = /** @class */ (function (_super) {
    __extends(ModelViewerCenterPanel, _super);
    function ModelViewerCenterPanel($element) {
        var _this = _super.call(this, $element) || this;
        _this.isLoaded = false;
        return _this;
    }
    ModelViewerCenterPanel.prototype.create = function () {
        var _this = this;
        this.setConfig("modelViewerCenterPanel");
        _super.prototype.create.call(this);
        var that = this;
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_EXTERNAL_RESOURCE, function (resources) {
            that.openMedia(resources);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.SET_TARGET, function (target) {
            _this.whenLoaded(function () {
                that.$modelviewer[0].cameraOrbit = target.toAttributeString();
            });
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.ANNOTATIONS, function (args) {
            _this.overlayAnnotations();
            // this.zoomToInitialAnnotation();
        });
        this.title = this.extension.helper.getLabel();
        this.$spinner = $('<div class="spinner"></div>');
        this.$content.prepend(this.$spinner);
        this.$modelviewer = $("<model-viewer \n        " + (this.config.options.autoRotateEnabled ? "auto-rotate" : "") + " \n        " + (this.config.options.interactionPromptEnabled
            ? 'interaction-prompt="auto"'
            : 'interaction-prompt="none"') + "\n        camera-controls \n        style=\"background-color: unset;\"></model-viewer>");
        this.$content.prepend(this.$modelviewer);
        this.$modelviewer[0].addEventListener("model-visibility", function () {
            _this.isLoaded = true;
            _this.$content.removeClass("loading");
            _this.$spinner.hide();
            _this.extensionHost.publish(Events_2.Events.LOAD);
            _this.extensionHost.publish(Events_1.ModelViewerExtensionEvents.CAMERA_CHANGE, _this.getCameraOrbit());
        });
        var debouncedCameraChange = (0, Utils_1.debounce)(function (obj) {
            if (_this.isLoaded) {
                //if (obj.detail.source === "user-interaction") {
                _this.extensionHost.publish(Events_1.ModelViewerExtensionEvents.CAMERA_CHANGE, _this.getCameraOrbit());
                //}
            }
        }, this.config.options.cameraChangeDelay);
        this.$modelviewer[0].addEventListener("camera-change", debouncedCameraChange);
        this.$modelviewer[0].addEventListener("dblclick", function (e) {
            if (_this.config.options.doubleClickAnnotationEnabled) {
                var point = _this.$modelviewer[0].positionAndNormalFromPoint(e.clientX, e.clientY);
                var canvas = that.extension.helper.getCurrentCanvas();
                _this.extensionHost.publish(Events_1.ModelViewerExtensionEvents.DOUBLECLICK, {
                    target: canvas.id + "#xyz=" + point.position.x + "," + point.position.y + "," + point.position.z + "&nxyz=" + point.normal.x + "," + point.normal.y + "," + point.normal.z,
                });
            }
        });
    };
    ModelViewerCenterPanel.prototype.whenLoaded = function (cb) {
        var _this = this;
        utils_1.Async.waitFor(function () {
            return _this.isLoaded;
        }, cb);
    };
    ModelViewerCenterPanel.prototype.overlayAnnotations = function () {
        var _this = this;
        // clear existing annotations
        this.clearAnnotations();
        var annotationGroups = this
            .extension.annotations;
        annotationGroups.forEach(function (annoGroup) {
            annoGroup.points3D.forEach(function (point, index) {
                var div = document.createElement("DIV");
                div.id = "annotation-" + point.canvasIndex + "-" + index;
                div.title = (0, Utils_1.sanitize)(point.bodyValue);
                div.className = "annotationPin";
                div.setAttribute("slot", "hotspot-" + index);
                div.setAttribute("data-position", point.x + " " + point.y + " " + point.z);
                div.setAttribute("data-normal", point.nx + " " + point.ny + " " + point.nz);
                div.onclick = function (e) {
                    e.preventDefault();
                    _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.PINPOINT_ANNOTATION_CLICKED, index);
                };
                var span = document.createElement("SPAN");
                span.innerText = String(index + 1);
                div.appendChild(span);
                _this.$modelviewer[0].appendChild(div);
            });
        });
    };
    ModelViewerCenterPanel.prototype.clearAnnotations = function () {
        var nodes = this.$modelviewer[0].querySelectorAll(".annotationPin");
        [].forEach.call(nodes, function (node) {
            node.parentNode.removeChild(node);
        });
    };
    ModelViewerCenterPanel.prototype.getCameraOrbit = function () {
        if (this.$modelviewer) {
            var orbit = this.$modelviewer[0].getCameraOrbit();
            var tpr = new Orbit_1.Orbit(orbit.theta, orbit.phi, orbit.radius);
            return tpr;
        }
        return null;
    };
    ModelViewerCenterPanel.prototype.openMedia = function (resources) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaUri, canvas, formats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$spinner.show();
                        return [4 /*yield*/, this.extension.getExternalResources(resources)];
                    case 1:
                        _a.sent();
                        mediaUri = null;
                        canvas = this.extension.helper.getCurrentCanvas();
                        formats = this.extension.getMediaFormats(canvas);
                        if (formats && formats.length) {
                            mediaUri = formats[0].id;
                        }
                        else {
                            mediaUri = canvas.id;
                        }
                        this.$modelviewer.attr("src", mediaUri);
                        // todo: look for choice of usdz, if found, add ar attribute or hide ar button using --ar-button-display
                        // use choice for this? https://github.com/edsilv/biiif/issues/13#issuecomment-383504734
                        // mediaUri = mediaUri.substr(0, mediaUri.lastIndexOf(".")) + ".usdz";
                        // this.$modelviewer.attr("ios-src", mediaUri);
                        this.extensionHost.publish(Events_2.Events.EXTERNAL_RESOURCE_OPENED);
                        return [2 /*return*/];
                }
            });
        });
    };
    ModelViewerCenterPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        this.$spinner.css("top", this.$content.height() / 2 - this.$spinner.height() / 2);
        this.$spinner.css("left", this.$content.width() / 2 - this.$spinner.width() / 2);
        if (this.title) {
            this.$title.text((0, Utils_1.sanitize)(this.title));
        }
        if (this.$modelviewer) {
            this.$modelviewer.width(this.$content.width());
            this.$modelviewer.height(this.$content.height());
        }
    };
    return ModelViewerCenterPanel;
}(CenterPanel_1.CenterPanel));
exports.ModelViewerCenterPanel = ModelViewerCenterPanel;
//# sourceMappingURL=ModelViewerCenterPanel.js.map