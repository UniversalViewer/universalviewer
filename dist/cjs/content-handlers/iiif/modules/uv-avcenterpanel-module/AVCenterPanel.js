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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVCenterPanel = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var CenterPanel_1 = require("../uv-shared-module/CenterPanel");
var Position_1 = require("../uv-shared-module/Position");
var Utils_1 = require("../../../../Utils");
var manifesto_js_1 = require("manifesto.js");
var dist_esmodule_1 = require("@iiif/iiif-av-component/dist-esmodule");
var utils_1 = require("@edsilv/utils");
var Events_1 = require("../../../../Events");
var AVCenterPanel = /** @class */ (function (_super) {
    __extends(AVCenterPanel, _super);
    function AVCenterPanel($element) {
        var _this = _super.call(this, $element) || this;
        _this._mediaReady = false;
        _this._isThumbsViewOpen = false;
        _this._mediaReadyQueue = [];
        _this.attributionPosition = Position_1.Position.BOTTOM_RIGHT;
        return _this;
    }
    AVCenterPanel.prototype.create = function () {
        var _this = this;
        this.setConfig("avCenterPanel");
        _super.prototype.create.call(this);
        var that = this;
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_EXTERNAL_RESOURCE, function (resources) {
            that.openMedia(resources);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function (canvasIndex) {
            if (_this._lastCanvasIndex !== canvasIndex) {
                _this._viewCanvas(canvasIndex);
            }
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CURRENT_TIME_CHANGE, function (currentTime) {
            _this._whenMediaReady(function () {
                if (_this.avcomponent) {
                    _this.avcomponent.setCurrentTime(currentTime);
                }
            });
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.RANGE_CHANGE, function (range) {
            if (!_this._observeRangeChanges()) {
                return;
            }
            _this._whenMediaReady(function () {
                that._viewRange(range);
                that._setTitle();
            });
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.METRIC_CHANGE, function () {
            _this._whenMediaReady(function () {
                if (_this.avcomponent) {
                    _this.avcomponent.set({
                        limitToRange: _this._limitToRange(),
                        constrainNavigationToRange: _this._limitToRange(),
                        autoAdvanceRanges: _this._autoAdvanceRanges(),
                    });
                }
            });
        });
        this.extensionHost.subscribe(Events_1.Events.CREATED, function () {
            _this._setTitle();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_THUMBS_VIEW, function () {
            _this._isThumbsViewOpen = true;
            _this._whenMediaReady(function () {
                if (_this.avcomponent) {
                    _this.avcomponent.set({
                        virtualCanvasEnabled: false,
                    });
                    var canvas = _this.extension.helper.getCurrentCanvas();
                    if (canvas) {
                        _this._viewCanvas(_this.extension.helper.canvasIndex);
                    }
                }
            });
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_TREE_VIEW, function () {
            _this._isThumbsViewOpen = false;
            _this._whenMediaReady(function () {
                if (_this.avcomponent) {
                    _this.avcomponent.set({
                        virtualCanvasEnabled: true,
                    });
                }
            });
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_LEFT_PANEL, function () {
            _this.resize();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_RIGHT_PANEL, function () {
            _this.resize();
        });
        this._createAVComponent();
    };
    // call all callbacks in the order they were added, and remove them from the queue
    AVCenterPanel.prototype._flushMediaReadyQueue = function () {
        for (var _i = 0, _a = this._mediaReadyQueue; _i < _a.length; _i++) {
            var cb = _a[_i];
            cb();
        }
        this._mediaReadyQueue = [];
    };
    AVCenterPanel.prototype._createAVComponent = function () {
        var _this = this;
        this.$avcomponent = $('<div class="iiif-av-component"></div>');
        this.$content.prepend(this.$avcomponent);
        // @ts-ignore
        this.avcomponent = new dist_esmodule_1.AVComponent({
            target: this.$avcomponent[0],
            // @ts-ignore
            data: {
                posterImageExpanded: this.options.posterImageExpanded,
                enableFastForward: true,
                enableFastRewind: true,
            }
        });
        this.avcomponent.on('mediaerror', function (err) {
            if (!_this.config.options.hideMediaError) {
                _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_MESSAGE, [err]);
            }
        });
        this.avcomponent.on("mediaready", function () {
            _this._mediaReady = true;
            _this._flushMediaReadyQueue();
        }, false);
        this.avcomponent.on("pause", function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.PAUSE, _this.avcomponent.getCurrentTime());
        });
        this.avcomponent.on("rangechanged", function (rangeId) {
            if (rangeId) {
                var range = _this.extension.helper.getRangeById(rangeId);
                if (range) {
                    var currentRange = _this.extension.helper.getCurrentRange();
                    if (range !== currentRange) {
                        _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.RANGE_CHANGE, range);
                    }
                }
                else {
                    _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.RANGE_CHANGE, null);
                }
            }
            else {
                _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.RANGE_CHANGE, null);
            }
            _this._setTitle();
        }, false);
    };
    AVCenterPanel.prototype._observeRangeChanges = function () {
        return !this._isThumbsViewOpen;
    };
    AVCenterPanel.prototype._setTitle = function () {
        var _this = this;
        var title = "";
        var value;
        var label;
        // get the current range or canvas title
        var currentRange = this.extension.helper.getCurrentRange();
        if (currentRange) {
            label = currentRange.getLabel();
        }
        else {
            label = this.extension.helper.getCurrentCanvas().getLabel();
        }
        value = manifesto_js_1.LanguageMap.getValue(label);
        if (value) {
            title = value;
        }
        if (utils_1.Bools.getBool(this.config.options.includeParentInTitleEnabled, false)) {
            // get the parent range or manifest's title
            if (currentRange) {
                if (currentRange.parentRange) {
                    label = currentRange.parentRange.getLabel();
                    value = manifesto_js_1.LanguageMap.getValue(label);
                }
            }
            else {
                value = this.extension.helper.getLabel();
            }
            if (value) {
                title += this.content.delimiter + value;
            }
        }
        this.title = title;
        // set subtitle
        var groups = this.extension.helper.getMetadata({
            range: currentRange
        });
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            var item = group.items.find(function (el) {
                if (el.label) {
                    var label_1 = manifesto_js_1.LanguageMap.getValue(el.label);
                    if (label_1 &&
                        label_1.toLowerCase() === _this.config.options.subtitleMetadataField) {
                        return true;
                    }
                }
                return false;
            });
            if (item) {
                // @ts-ignore
                this.subtitle = manifesto_js_1.LanguageMap.getValue(item.value);
                break;
            }
        }
        this.$title.text((0, Utils_1.sanitize)(this.title));
        this.resize(false);
    };
    AVCenterPanel.prototype._isCurrentResourceAccessControlled = function () {
        var canvas = this.extension.helper.getCurrentCanvas();
        return canvas.externalResource.isAccessControlled();
    };
    AVCenterPanel.prototype.openMedia = function (resources) {
        var _this = this;
        this.extension.getExternalResources(resources).then(function () {
            if (_this.avcomponent) {
                // reset if the media has already been loaded (degraded flow has happened)
                if (_this.extension.helper.canvasIndex === _this._lastCanvasIndex) {
                    _this.avcomponent.reset();
                }
                _this._lastCanvasIndex = _this.extension.helper.canvasIndex;
                _this.avcomponent.set({
                    helper: _this.extension.helper,
                    adaptiveAuthEnabled: _this._isCurrentResourceAccessControlled(),
                    autoPlay: _this.config.options.autoPlay,
                    enableFastForward: _this.config.options.enableFastForward,
                    enableFastRewind: _this.config.options.enableFastRewind,
                    autoSelectRange: true,
                    constrainNavigationToRange: _this._limitToRange(),
                    autoAdvanceRanges: _this._autoAdvanceRanges(),
                    content: _this.content,
                    defaultAspectRatio: 0.56,
                    doubleClickMS: 350,
                    limitToRange: _this._limitToRange(),
                    posterImageRatio: _this.config.options.posterImageRatio,
                });
                // console.log("set up")
                // this.avcomponent.on('waveformready', () => {
                //     this.resize();
                // }, false);
                _this.extensionHost.publish(Events_1.Events.EXTERNAL_RESOURCE_OPENED);
            }
        });
    };
    AVCenterPanel.prototype._limitToRange = function () {
        if (utils_1.Bools.getBool(this.config.options.limitToRange, false)) {
            return true;
        }
        return !this.extension.isDesktopMetric();
    };
    AVCenterPanel.prototype._autoAdvanceRanges = function () {
        return utils_1.Bools.getBool(this.config.options.autoAdvanceRanges, true);
    };
    AVCenterPanel.prototype._whenMediaReady = function (cb) {
        if (this._mediaReady) {
            cb();
        }
        else {
            this._mediaReadyQueue.push(cb);
        }
    };
    AVCenterPanel.prototype._viewRange = function (range) {
        var _this = this;
        this._whenMediaReady(function () {
            if (range && _this.avcomponent) {
                _this.avcomponent.viewRange(range.id);
            }
            // don't resize the av component to avoid expensively redrawing waveforms
            _this.resize(false);
        });
    };
    AVCenterPanel.prototype._viewCanvas = function (canvasIndex) {
        var _this = this;
        this._whenMediaReady(function () {
            var canvas = _this.extension.helper.getCanvasByIndex(canvasIndex);
            if (_this.avcomponent) {
                _this.avcomponent.showCanvas(canvas.id);
            }
        });
    };
    AVCenterPanel.prototype.resize = function (resizeAVComponent) {
        if (resizeAVComponent === void 0) { resizeAVComponent = true; }
        _super.prototype.resize.call(this);
        if (resizeAVComponent && this.avcomponent) {
            this.$avcomponent.height(this.$content.height());
            this.avcomponent.resize();
        }
    };
    return AVCenterPanel;
}(CenterPanel_1.CenterPanel));
exports.AVCenterPanel = AVCenterPanel;
//# sourceMappingURL=AVCenterPanel.js.map