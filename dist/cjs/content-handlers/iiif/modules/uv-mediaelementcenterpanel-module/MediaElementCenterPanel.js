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
exports.MediaElementCenterPanel = void 0;
var utils_1 = require("@edsilv/utils");
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var Events_1 = require("../../extensions/uv-mediaelement-extension/Events");
var CenterPanel_1 = require("../uv-shared-module/CenterPanel");
var Utils_1 = require("../../../../Utils");
require("mediaelement/build/mediaelement-and-player");
require("mediaelement-plugins/dist/source-chooser/source-chooser");
require("mediaelement-plugins/dist/source-chooser/source-chooser.css");
var Events_2 = require("../../../../Events");
var MediaElementCenterPanel = /** @class */ (function (_super) {
    __extends(MediaElementCenterPanel, _super);
    function MediaElementCenterPanel($element) {
        return _super.call(this, $element) || this;
    }
    MediaElementCenterPanel.prototype.create = function () {
        var _this = this;
        this.setConfig("mediaelementCenterPanel");
        _super.prototype.create.call(this);
        var that = this;
        this.extensionHost.subscribe(Events_2.Events.TOGGLE_FULLSCREEN, function () {
            _this.resize();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.SET_TARGET, function (target) {
            var t = target.t;
            if (Array.isArray(t)) {
                t = t[0];
            }
            that.player.setCurrentTime(t);
            that.player.play();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_EXTERNAL_RESOURCE, function (resources) {
            that.openMedia(resources);
        });
        this.$wrapper = $('<div class="wrapper"></div>');
        this.$content.append(this.$wrapper);
        this.$container = $('<div class="container"></div>');
        this.$wrapper.append(this.$container);
        this.title = this.extension.helper.getLabel();
    };
    MediaElementCenterPanel.prototype.openMedia = function (resources) {
        return __awaiter(this, void 0, void 0, function () {
            var that, canvas, poster, sources, subtitles, renderings, formats, _i, subtitles_1, subtitle, _a, sources_1, source, _b, sources_2, source;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        that = this;
                        return [4 /*yield*/, this.extension.getExternalResources(resources)];
                    case 1:
                        _c.sent();
                        this.$container.empty();
                        canvas = this.extension.helper.getCurrentCanvas();
                        this.mediaHeight = this.config.defaultHeight;
                        this.mediaWidth = this.config.defaultWidth;
                        poster = (this.extension).getPosterImageUri();
                        sources = [];
                        subtitles = [];
                        renderings = canvas.getRenderings();
                        if (renderings && renderings.length) {
                            canvas.getRenderings().forEach(function (rendering) {
                                sources.push({
                                    type: rendering.getFormat().toString(),
                                    src: rendering.id,
                                });
                            });
                        }
                        else {
                            formats = this.extension.getMediaFormats(this.extension.helper.getCurrentCanvas());
                            if (formats && formats.length) {
                                formats.forEach(function (format) {
                                    var type = format.getFormat();
                                    // Add any additional subtitle types if required.
                                    if (type && type.toString() === "text/vtt") {
                                        subtitles.push(format.__jsonld);
                                    }
                                    else if (type) {
                                        sources.push({
                                            label: format.__jsonld.label ? format.__jsonld.label : "",
                                            type: type.toString(),
                                            src: format.id,
                                        });
                                    }
                                });
                            }
                        }
                        if (this.isVideo()) {
                            this.$media = $('<video controls="controls" preload="none" style="width:100%;height:100%;" width="100%" height="100%"></video>');
                            // Add VTT subtitles/captions.
                            for (_i = 0, subtitles_1 = subtitles; _i < subtitles_1.length; _i++) {
                                subtitle = subtitles_1[_i];
                                this.$media.append($("<track label=\"" + subtitle.label + "\" kind=\"subtitles\" srclang=\"" + subtitle.language + "\" src=\"" + subtitle.id + "\" " + (subtitles.indexOf(subtitle) === 0 ? "default" : "") + ">\n"));
                            }
                            for (_a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
                                source = sources_1[_a];
                                this.$media.append($("<source src=\"" + source.src + "\" type=\"" + source.type + "\" title=\"" + source.label + "\">"));
                            }
                            this.$container.append(this.$media);
                            this.player = new MediaElementPlayer($("video")[0], {
                                poster: poster,
                                toggleCaptionsButtonWhenOnlyOne: true,
                                features: [
                                    "playpause",
                                    "current",
                                    "progress",
                                    "tracks",
                                    "volume",
                                    "sourcechooser",
                                    "fullscreen"
                                ],
                                success: function (mediaElement, originalNode) {
                                    mediaElement.addEventListener("loadstart", function () {
                                        // console.log("loadstart");
                                        that.resize();
                                    });
                                    mediaElement.addEventListener("play", function () {
                                        that.extensionHost.publish(Events_1.MediaElementExtensionEvents.MEDIA_PLAYED, Math.floor(mediaElement.currentTime));
                                    });
                                    mediaElement.addEventListener("pause", function () {
                                        // mediaelement creates a pause event before the ended event. ignore this.
                                        if (Math.floor(mediaElement.currentTime) !=
                                            Math.floor(mediaElement.duration)) {
                                            that.extensionHost.publish(Events_1.MediaElementExtensionEvents.MEDIA_PAUSED, Math.floor(mediaElement.currentTime));
                                        }
                                    });
                                    mediaElement.addEventListener("ended", function () {
                                        that.extensionHost.publish(Events_1.MediaElementExtensionEvents.MEDIA_ENDED, Math.floor(mediaElement.duration));
                                    });
                                    mediaElement.addEventListener("timeupdate", function () {
                                        that.extensionHost.publish(Events_1.MediaElementExtensionEvents.MEDIA_TIME_UPDATE, Math.floor(mediaElement.currentTime));
                                    });
                                },
                            });
                        }
                        else {
                            // audio
                            this.$media = $('<audio controls="controls" preload="none" style="width:100%;height:100%;" width="100%" height="100%"></audio>');
                            for (_b = 0, sources_2 = sources; _b < sources_2.length; _b++) {
                                source = sources_2[_b];
                                this.$media.append($("<source src=\"" + source.src + "\" type=\"" + source.type + "\" title=\"" + source.label + "\">"));
                            }
                            this.$container.append(this.$media);
                            this.player = new MediaElementPlayer($("audio")[0], {
                                poster: poster,
                                defaultAudioWidth: "auto",
                                features: [
                                    "playpause",
                                    "current",
                                    "progress",
                                    "tracks",
                                    "volume",
                                    "sourcechooser",
                                ],
                                stretching: "responsive",
                                defaultAudioHeight: "auto",
                                showPosterWhenPaused: true,
                                showPosterWhenEnded: true,
                                success: function (mediaElement, originalNode) {
                                    mediaElement.addEventListener("play", function () {
                                        that.extensionHost.publish(Events_1.MediaElementExtensionEvents.MEDIA_PLAYED, Math.floor(mediaElement.currentTime));
                                    });
                                    mediaElement.addEventListener("pause", function () {
                                        // mediaelement creates a pause event before the ended event. ignore this.
                                        if (Math.floor(mediaElement.currentTime) !=
                                            Math.floor(mediaElement.duration)) {
                                            that.extensionHost.publish(Events_1.MediaElementExtensionEvents.MEDIA_PAUSED, Math.floor(mediaElement.currentTime));
                                        }
                                    });
                                    mediaElement.addEventListener("ended", function () {
                                        that.extensionHost.publish(Events_1.MediaElementExtensionEvents.MEDIA_ENDED, Math.floor(mediaElement.duration));
                                    });
                                    mediaElement.addEventListener("timeupdate", function () {
                                        that.extensionHost.publish(Events_1.MediaElementExtensionEvents.MEDIA_TIME_UPDATE, Math.floor(mediaElement.currentTime));
                                    });
                                },
                            });
                        }
                        this.extensionHost.publish(Events_2.Events.EXTERNAL_RESOURCE_OPENED);
                        this.extensionHost.publish(Events_2.Events.LOAD);
                        return [2 /*return*/];
                }
            });
        });
    };
    MediaElementCenterPanel.prototype.isVideo = function () {
        return this.extension.isVideo();
    };
    MediaElementCenterPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        if (!this.mediaWidth || !this.mediaHeight) {
            return;
        }
        if (this.title) {
            this.$title.text((0, Utils_1.sanitize)(this.title));
        }
        var size = utils_1.Dimensions.fitRect(this.mediaWidth, this.mediaHeight, this.$content.width(), this.$content.height());
        this.$container.height(size.height);
        this.$container.width(size.width);
        if (this.player) {
            this.$media.width(size.width);
            this.$media.height(size.height);
        }
        if (this.player) {
            this.player.setPlayerSize();
            this.player.setControlsSize();
        }
    };
    return MediaElementCenterPanel;
}(CenterPanel_1.CenterPanel));
exports.MediaElementCenterPanel = MediaElementCenterPanel;
//# sourceMappingURL=MediaElementCenterPanel.js.map