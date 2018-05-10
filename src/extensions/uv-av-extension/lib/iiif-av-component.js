// iiif-av-component v0.0.39 https://github.com/iiif-commons/iiif-av-component#readme
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.iiifAvComponent = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var IIIFComponents;
(function (IIIFComponents) {
    var AVComponent = /** @class */ (function (_super) {
        __extends(AVComponent, _super);
        function AVComponent(options) {
            var _this = _super.call(this, options) || this;
            _this._data = _this.data();
            _this.canvasInstances = [];
            _this._init();
            _this._resize();
            return _this;
        }
        AVComponent.prototype._init = function () {
            var success = _super.prototype._init.call(this);
            if (!success) {
                console.error("Component failed to initialise");
            }
            return success;
        };
        AVComponent.prototype.data = function () {
            return {
                autoPlay: false,
                constrainNavigationToRange: false,
                defaultAspectRatio: 0.56,
                doubleClickMS: 350,
                limitToRange: false,
                content: {
                    currentTime: "Current Time",
                    duration: "Duration",
                    mute: "Mute",
                    next: "Next",
                    pause: "Pause",
                    play: "Play",
                    previous: "Previous"
                }
            };
        };
        AVComponent.prototype.set = function (data) {
            var _this = this;
            var oldData = Object.assign({}, this._data);
            this._data = Object.assign(this._data, data);
            var diff = IIIFComponents.AVComponentUtils.Utils.diff(oldData, this._data);
            // changing any of these data properties forces a reload.
            if (diff.includes('helper')) {
                // create canvases
                this._reset();
            }
            if (!this._data.helper) {
                console.warn('must pass a helper object');
                return;
            }
            if (diff.includes('limitToRange') && this._data.canvasId) {
                this.canvasInstances.forEach(function (canvasInstance, index) {
                    canvasInstance.set({
                        limitToRange: _this._data.limitToRange
                    });
                });
            }
            if (diff.includes('constrainNavigationToRange') && this._data.canvasId) {
                this.canvasInstances.forEach(function (canvasInstance, index) {
                    canvasInstance.set({
                        constrainNavigationToRange: _this._data.constrainNavigationToRange
                    });
                });
            }
            if (diff.includes('autoSelectRange') && this._data.canvasId) {
                this.canvasInstances.forEach(function (canvasInstance, index) {
                    canvasInstance.set({
                        autoSelectRange: _this._data.autoSelectRange
                    });
                });
            }
            if (diff.includes('canvasId') && this._data.canvasId) {
                var currentCanvasInstance_1 = this._getCanvasInstanceById(this._data.canvasId);
                this.canvasInstances.forEach(function (canvasInstance, index) {
                    if (canvasInstance !== currentCanvasInstance_1) {
                        canvasInstance.set({
                            visible: false
                        });
                    }
                    else {
                        canvasInstance.set({ visible: true });
                    }
                });
            }
            if (diff.includes('range') && this._data.range) {
                var range = this._data.helper.getRangeById(this._data.range.rangeId);
                if (!range) {
                    console.warn('range not found');
                }
                else {
                    if (range.canvases) {
                        var canvasId = Manifesto.Utils.normaliseUrl(range.canvases[0]);
                        // get canvas by normalised id (without temporal part)
                        var canvasInstance = this._getCanvasInstanceById(canvasId);
                        if (canvasInstance) {
                            var canvasRange = new IIIFComponents.AVComponentObjects.CanvasRange(range);
                            // if not using the correct canvasinstance, switch to it
                            if (this._data.canvasId && Manifesto.Utils.normaliseUrl(this._data.canvasId) !== canvasId) {
                                this.set({
                                    canvasId: canvasId,
                                    range: canvasRange
                                });
                            }
                            else {
                                canvasInstance.set({
                                    range: canvasRange
                                });
                            }
                        }
                    }
                }
            }
            this._render();
            this._resize();
        };
        AVComponent.prototype._render = function () {
        };
        AVComponent.prototype._reset = function () {
            var _this = this;
            this.canvasInstances.forEach(function (canvasInstance, index) {
                canvasInstance.destroy();
            });
            this.canvasInstances = [];
            this._$element.empty();
            // if the manifest has an auto-advance behavior, join the canvases into a single "virtual" canvas
            if (this._data && this._data.helper) {
                var behavior = this._data.helper.manifest.getBehavior();
                var canvases = this._getCanvases();
                if (behavior && behavior.toString() === manifesto.Behavior.autoadvance().toString()) {
                    var virtualCanvas_1 = new IIIFComponents.AVComponentObjects.VirtualCanvas();
                    canvases.forEach(function (canvas) {
                        virtualCanvas_1.addCanvas(canvas);
                    });
                    this._initCanvas(virtualCanvas_1);
                }
                else {
                    canvases.forEach(function (canvas) {
                        _this._initCanvas(canvas);
                    });
                }
                if (this.canvasInstances.length > 0) {
                    this._data.canvasId = this.canvasInstances[0].getCanvasId();
                }
            }
        };
        AVComponent.prototype._getCanvases = function () {
            if (this._data.helper) {
                return this._data.helper.getCanvases();
            }
            return [];
        };
        AVComponent.prototype._initCanvas = function (canvas) {
            var _this = this;
            var canvasInstance = new IIIFComponents.CanvasInstance({
                target: document.createElement('div'),
                data: Object.assign({}, { canvas: canvas }, this._data)
            });
            canvasInstance.logMessage = this._logMessage.bind(this);
            this._$element.append(canvasInstance.$playerElement);
            canvasInstance.init();
            this.canvasInstances.push(canvasInstance);
            canvasInstance.on(AVComponent.Events.CANVASREADY, function () {
                //that._logMessage('CREATED CANVAS: ' + canvasInstance.canvasClockDuration + ' seconds, ' + canvasInstance.canvasWidth + ' x ' + canvasInstance.canvasHeight + ' px.');
                _this.fire(AVComponent.Events.CANVASREADY);
            }, false);
            // canvasInstance.on(AVComponent.Events.RESETCANVAS, () => {
            //     this.playCanvas(canvasInstance.canvas.id);
            // }, false);
            canvasInstance.on(IIIFComponents.AVComponentCanvasInstance.Events.PREVIOUS_RANGE, function () {
                _this._prevRange();
            }, false);
            canvasInstance.on(IIIFComponents.AVComponentCanvasInstance.Events.NEXT_RANGE, function () {
                _this._nextRange();
            }, false);
            canvasInstance.on(AVComponent.Events.RANGE_CHANGED, function (rangeId) {
                _this.fire(AVComponent.Events.RANGE_CHANGED, rangeId);
            }, false);
            canvasInstance.on(IIIFComponents.AVVolumeControl.Events.VOLUME_CHANGED, function (volume) {
                _this._setCanvasInstanceVolumes(volume);
                _this.fire(IIIFComponents.AVVolumeControl.Events.VOLUME_CHANGED, volume);
            }, false);
        };
        AVComponent.prototype._prevRange = function () {
            if (!this._data || !this._data.helper) {
                return;
            }
            var prevRange = this._data.helper.getPreviousRange();
            if (prevRange) {
                this.playRange(prevRange.id);
            }
            else {
                // no previous range. rewind.
                this._rewind();
            }
        };
        AVComponent.prototype._nextRange = function () {
            if (!this._data || !this._data.helper) {
                return;
            }
            var nextRange = this._data.helper.getNextRange();
            if (nextRange) {
                this.playRange(nextRange.id);
            }
        };
        AVComponent.prototype._setCanvasInstanceVolumes = function (volume) {
            this.canvasInstances.forEach(function (canvasInstance) {
                canvasInstance.set({
                    volume: volume
                });
            });
        };
        AVComponent.prototype._getCanvasInstanceById = function (canvasId) {
            canvasId = Manifesto.Utils.normaliseUrl(canvasId);
            for (var i = 0; i < this.canvasInstances.length; i++) {
                var canvasInstance = this.canvasInstances[i];
                // if the canvasinstance has a virtual canvas
                if (canvasInstance.isVirtual()) {
                    if (canvasInstance.includesVirtualSubCanvas(canvasId)) {
                        return canvasInstance;
                    }
                }
                else {
                    var id = canvasInstance.getCanvasId();
                    if (id) {
                        var canvasInstanceId = Manifesto.Utils.normaliseUrl(id);
                        if (canvasInstanceId === canvasId) {
                            return canvasInstance;
                        }
                    }
                }
            }
            return null;
        };
        // private _getCurrentRange(): AVComponentObjects.CanvasRange | null {
        //     if (!this._data.helper || !this._data.helper.rangeId) {
        //         return null;
        //     }
        //     const range: Manifesto.IRange | null = this._data.helper.getRangeById(this._data.helper.rangeId);
        //     if (range) {
        //         const canvasRange: AVComponentObjects.CanvasRange = new AVComponentObjects.CanvasRange(range);
        //         return canvasRange;
        //     }
        //     return null;
        // }
        AVComponent.prototype._getCurrentCanvas = function () {
            if (this._data.canvasId) {
                return this._getCanvasInstanceById(this._data.canvasId);
            }
            return null;
        };
        AVComponent.prototype._rewind = function () {
            if (this._data.limitToRange) {
                return;
            }
            var canvasInstance = this._getCurrentCanvas();
            if (canvasInstance) {
                canvasInstance.set({
                    range: undefined
                });
            }
        };
        AVComponent.prototype.playRange = function (rangeId) {
            if (!this._data.helper) {
                return;
            }
            var range = this._data.helper.getRangeById(rangeId);
            if (range) {
                var canvasRange = new IIIFComponents.AVComponentObjects.CanvasRange(range);
                this.set({
                    range: canvasRange
                });
            }
        };
        AVComponent.prototype.showCanvas = function (canvasId) {
            this.set({
                canvasId: canvasId
            });
        };
        AVComponent.prototype._logMessage = function (message) {
            this.fire(AVComponent.Events.LOG, message);
        };
        AVComponent.prototype.resize = function () {
            this.canvasInstances.forEach(function (canvasInstance) {
                canvasInstance.resize();
            });
        };
        return AVComponent;
    }(_Components.BaseComponent));
    IIIFComponents.AVComponent = AVComponent;
})(IIIFComponents || (IIIFComponents = {}));
(function (IIIFComponents) {
    var AVComponent;
    (function (AVComponent) {
        var Events = /** @class */ (function () {
            function Events() {
            }
            Events.CANVASREADY = 'canvasready';
            Events.LOG = 'log';
            Events.RANGE_CHANGED = 'rangechanged';
            return Events;
        }());
        AVComponent.Events = Events;
    })(AVComponent = IIIFComponents.AVComponent || (IIIFComponents.AVComponent = {}));
})(IIIFComponents || (IIIFComponents = {}));
(function (g) {
    if (!g.IIIFComponents) {
        g.IIIFComponents = IIIFComponents;
    }
    else {
        g.IIIFComponents.AVComponent = IIIFComponents.AVComponent;
    }
})(global);

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var IIIFComponents;
(function (IIIFComponents) {
    var AVVolumeControl = /** @class */ (function (_super) {
        __extends(AVVolumeControl, _super);
        function AVVolumeControl(options) {
            var _this = _super.call(this, options) || this;
            _this._lastVolume = 1;
            _this._data = {
                volume: 1
            };
            _this._init();
            _this._resize();
            return _this;
        }
        AVVolumeControl.prototype._init = function () {
            var _this = this;
            var success = _super.prototype._init.call(this);
            if (!success) {
                console.error("Component failed to initialise");
            }
            this._$volumeMute = $("\n                                <button class=\"btn volume-mute\" title=\"" + this.options.data.content.mute + "\">\n                                    <i class=\"av-icon-mute on\" aria-hidden=\"true\"></i>" + this.options.data.content.mute + "\n                                </button>");
            this._$volumeSlider = $('<input type="range" class="volume-slider" min="0" max="1" step="0.01" value="1">');
            this._$element.append(this._$volumeMute, this._$volumeSlider);
            var that = this;
            this._$volumeMute.on('click', function () {
                // start reducer
                if (_this._data.volume !== 0) {
                    // mute
                    _this._lastVolume = _this._data.volume;
                    _this._data.volume = 0;
                }
                else {
                    // unmute
                    _this._data.volume = _this._lastVolume;
                }
                // end reducer
                _this._render();
                _this.fire(AVVolumeControl.Events.VOLUME_CHANGED, _this._data.volume);
            });
            this._$volumeSlider.on('input', function () {
                // start reducer
                that._data.volume = Number(this.value);
                if (that._data.volume === 0) {
                    that._lastVolume = 0;
                }
                // end reducer
                that._render();
                that.fire(AVVolumeControl.Events.VOLUME_CHANGED, that._data.volume);
            });
            this._$volumeSlider.on('change', function () {
                // start reducer
                that._data.volume = Number(this.value);
                if (that._data.volume === 0) {
                    that._lastVolume = 0;
                }
                // end reducer
                that._render();
                that.fire(AVVolumeControl.Events.VOLUME_CHANGED, that._data.volume);
            });
            return success;
        };
        AVVolumeControl.prototype.set = function (data) {
            this._data = Object.assign(this._data, data);
            this._render();
        };
        AVVolumeControl.prototype._render = function () {
            this._$volumeSlider.val(this._data.volume);
            if (this._data.volume === 0) {
                this._$volumeMute.find('i').switchClass('on', 'off');
            }
            else {
                this._$volumeMute.find('i').switchClass('off', 'on');
            }
        };
        AVVolumeControl.prototype._resize = function () {
        };
        return AVVolumeControl;
    }(_Components.BaseComponent));
    IIIFComponents.AVVolumeControl = AVVolumeControl;
})(IIIFComponents || (IIIFComponents = {}));
(function (IIIFComponents) {
    var AVVolumeControl;
    (function (AVVolumeControl) {
        var Events = /** @class */ (function () {
            function Events() {
            }
            Events.VOLUME_CHANGED = 'volumechanged';
            return Events;
        }());
        AVVolumeControl.Events = Events;
    })(AVVolumeControl = IIIFComponents.AVVolumeControl || (IIIFComponents.AVVolumeControl = {}));
})(IIIFComponents || (IIIFComponents = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var IIIFComponents;
(function (IIIFComponents) {
    var CanvasInstance = /** @class */ (function (_super) {
        __extends(CanvasInstance, _super);
        function CanvasInstance(options) {
            var _this = _super.call(this, options) || this;
            _this._canvasClockDuration = 0; // todo: should these 0 values be undefined by default?
            _this._canvasClockFrequency = 25;
            _this._canvasClockStartDate = 0;
            _this._canvasClockTime = 0;
            _this._canvasHeight = 0;
            _this._canvasWidth = 0;
            _this._data = _this.data();
            _this._highPriorityFrequency = 25;
            _this._isPlaying = false;
            _this._isStalled = false;
            _this._lowPriorityFrequency = 250;
            _this._mediaSyncMarginSecs = 1;
            _this._ranges = [];
            _this._readyCanvasesCount = 0;
            _this._stallRequestedBy = []; //todo: type
            _this._wasPlaying = false;
            _this._data = _this.options.data;
            _this.$playerElement = $('<div class="player"></div>');
            return _this;
        }
        CanvasInstance.prototype.init = function () {
            var _this = this;
            if (!this._data || !this._data.content || !this._data.canvas) {
                console.warn('unable to initialise, missing canvas or content');
                return;
            }
            this._$hoverPreviewTemplate = $('<div class="hover-preview"><div class="label"></div><div class="pointer"><span class="arrow"></span></div></div>');
            this._$canvasContainer = $('<div class="canvas-container"></div>');
            this._$optionsContainer = $('<div class="options-container"></div>');
            this._$rangeTimelineContainer = $('<div class="range-timeline-container"></div>');
            this._$canvasTimelineContainer = $('<div class="canvas-timeline-container"></div>');
            this._$canvasHoverPreview = this._$hoverPreviewTemplate.clone();
            this._$canvasHoverHighlight = $('<div class="hover-highlight"></div>');
            this._$rangeHoverPreview = this._$hoverPreviewTemplate.clone();
            this._$rangeHoverHighlight = $('<div class="hover-highlight"></div>');
            this._$durationHighlight = $('<div class="duration-highlight"></div>');
            this._$timelineItemContainer = $('<div class="timeline-item-container"></div>');
            this._$controlsContainer = $('<div class="controls-container"></div>');
            this._$prevButton = $("\n                                <button class=\"btn\" title=\"" + this._data.content.previous + "\">\n                                    <i class=\"av-icon-previous\" aria-hidden=\"true\"></i>" + this._data.content.previous + "\n                                </button>");
            this._$playButton = $("\n                                <button class=\"btn\" title=\"" + this._data.content.play + "\">\n                                    <i class=\"av-icon-play play\" aria-hidden=\"true\"></i>" + this._data.content.play + "\n                                </button>");
            this._$nextButton = $("\n                                <button class=\"btn\" title=\"" + this._data.content.next + "\">\n                                    <i class=\"av-icon-next\" aria-hidden=\"true\"></i>" + this._data.content.next + "\n                                </button>");
            this._$timeDisplay = $('<div class="time-display"><span class="canvas-time"></span> / <span class="canvas-duration"></span></div>');
            this._$canvasTime = this._$timeDisplay.find('.canvas-time');
            this._$canvasDuration = this._$timeDisplay.find('.canvas-duration');
            var $volume = $('<div class="volume"></div>');
            this._volume = new IIIFComponents.AVVolumeControl({
                target: $volume[0],
                data: Object.assign({}, this._data)
            });
            this._volume.on(IIIFComponents.AVVolumeControl.Events.VOLUME_CHANGED, function (value) {
                _this.fire(IIIFComponents.AVVolumeControl.Events.VOLUME_CHANGED, value);
            }, false);
            this._$controlsContainer.append(this._$prevButton, this._$playButton, this._$nextButton, this._$timeDisplay, $volume);
            this._$canvasTimelineContainer.append(this._$canvasHoverPreview, this._$canvasHoverHighlight, this._$durationHighlight);
            this._$rangeTimelineContainer.append(this._$rangeHoverPreview, this._$rangeHoverHighlight);
            this._$optionsContainer.append(this._$canvasTimelineContainer, this._$rangeTimelineContainer, this._$timelineItemContainer, this._$controlsContainer);
            this.$playerElement.append(this._$canvasContainer, this._$optionsContainer);
            this._$canvasHoverPreview.hide();
            this._$rangeHoverPreview.hide();
            if (this._data && this._data.helper && this._data.canvas) {
                var ranges_1 = [];
                // if the canvas is virtual, get the ranges for all sub canvases
                if (this.isVirtual()) {
                    this._data.canvas.canvases.forEach(function (canvas) {
                        if (_this._data && _this._data.helper) {
                            var r = _this._data.helper.getCanvasRanges(canvas);
                            // shift the range targets forward by the duration of their previous canvases
                            r.forEach(function (range) {
                                if (range.canvases && range.canvases.length) {
                                    for (var i = 0; i < range.canvases.length; i++) {
                                        range.canvases[i] = IIIFComponents.AVComponentUtils.Utils.retargetTemporalComponent(_this._data.canvas.canvases, range.__jsonld.items[i].id);
                                    }
                                }
                            });
                            ranges_1.push.apply(ranges_1, r);
                        }
                    });
                }
                else {
                    ranges_1.concat(this._data.helper.getCanvasRanges(this._data.canvas));
                }
                ranges_1.forEach(function (range) {
                    _this._ranges.push(new IIIFComponents.AVComponentObjects.CanvasRange(range));
                });
            }
            this._canvasClockDuration = this._data.canvas.getDuration();
            var canvasWidth = this._data.canvas.getWidth();
            var canvasHeight = this._data.canvas.getHeight();
            if (!canvasWidth) {
                this._canvasWidth = this.$playerElement.parent().width(); // this._data.defaultCanvasWidth;
            }
            else {
                this._canvasWidth = canvasWidth;
            }
            if (!canvasHeight) {
                this._canvasHeight = this._canvasWidth * this._data.defaultAspectRatio; //this._data.defaultCanvasHeight;
            }
            else {
                this._canvasHeight = canvasHeight;
            }
            var that = this;
            var prevClicks = 0;
            var prevTimeout = 0;
            this._$prevButton.on('click', function () {
                prevClicks++;
                if (prevClicks === 1) {
                    // single click
                    //console.log('single');
                    _this._previous(false);
                    prevTimeout = setTimeout(function () {
                        prevClicks = 0;
                        prevTimeout = 0;
                    }, _this._data.doubleClickMS);
                }
                else {
                    // double click
                    //console.log('double');
                    _this._previous(true);
                    clearTimeout(prevTimeout);
                    prevClicks = 0;
                    prevTimeout = 0;
                }
            });
            this._$playButton.on('click', function () {
                if (_this._isPlaying) {
                    _this._pause();
                }
                else {
                    _this._play();
                }
            });
            this._$nextButton.on('click', function () {
                _this._next();
            });
            this._$canvasTimelineContainer.slider({
                value: 0,
                step: 0.01,
                orientation: "horizontal",
                range: "min",
                max: that._canvasClockDuration,
                animate: false,
                create: function (evt, ui) {
                    // on create
                },
                slide: function (evt, ui) {
                    that._setCurrentTime(ui.value);
                },
                stop: function (evt, ui) {
                    //this._setCurrentTime(ui.value);
                }
            });
            this._$canvasTimelineContainer.mouseout(function () {
                that._$canvasHoverHighlight.width(0);
                that._$canvasHoverPreview.hide();
            });
            this._$rangeTimelineContainer.mouseout(function () {
                that._$rangeHoverHighlight.width(0);
                that._$rangeHoverPreview.hide();
            });
            this._$canvasTimelineContainer.on("mousemove", function (e) {
                _this._updateHoverPreview(e, _this._$canvasTimelineContainer, _this._canvasClockDuration);
            });
            this._$rangeTimelineContainer.on("mousemove", function (e) {
                if (_this._data.range) {
                    _this._updateHoverPreview(e, _this._$rangeTimelineContainer, _this._data.range.duration ? _this._data.range.duration.getLength() : 0);
                }
            });
            // create annotations
            this._contentAnnotations = [];
            var items = this._data.canvas.getContent(); // (<any>this._data.canvas).__jsonld.content[0].items;
            // always hide timelineItemContainer for now
            //if (items.length === 1) {
            this._$timelineItemContainer.hide();
            //}
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                /*
                if (item.motivation != 'painting') {
                    return null;
                }
                */
                var mediaSource = void 0;
                var bodies = item.getBody();
                if (!bodies.length) {
                    console.warn('item has no body');
                    return;
                }
                var body = bodies[0];
                var type = body.getType();
                var format = body.getFormat();
                // if (type && type.toString() === 'choice') {
                //     // Choose first "Choice" item as body
                //     const tmpItem = item;
                //     item.body = tmpItem.body[0].items[0];
                //     mediaSource = item.body.id.split('#')[0];
                // } else 
                if (type && type.toString() === 'textualbody') {
                    //mediaSource = (<any>body).value;
                }
                else {
                    mediaSource = body.id.split('#')[0];
                }
                /*
                var targetFragment = (item.target.indexOf('#') != -1) ? item.target.split('#t=')[1] : '0, '+ canvasClockDuration,
                    fragmentTimings = targetFragment.split(','),
                    startTime = parseFloat(fragmentTimings[0]),
                    endTime = parseFloat(fragmentTimings[1]);

                //TODO: Check format (in "target" as MFID or in "body" as "width", "height" etc.)
                var fragmentPosition = [0, 0, 100, 100],
                    positionTop = fragmentPosition[1],
                    positionLeft = fragmentPosition[0],
                    mediaWidth = fragmentPosition[2],
                    mediaHeight = fragmentPosition[3];
                */
                var target = item.getTarget();
                if (!target) {
                    console.warn('item has no target');
                    return;
                }
                var xywh = IIIFComponents.AVComponentUtils.Utils.getSpatialComponent(target);
                var t = IIIFComponents.AVComponentUtils.Utils.getTemporalComponent(target);
                if (!xywh) {
                    xywh = [0, 0, this._canvasWidth, this._canvasHeight];
                }
                if (!t) {
                    t = [0, this._canvasClockDuration];
                }
                var positionLeft = parseInt(String(xywh[0])), positionTop = parseInt(String(xywh[1])), mediaWidth = parseInt(String(xywh[2])), mediaHeight = parseInt(String(xywh[3])), startTime = parseInt(String(t[0])), endTime = parseInt(String(t[1]));
                var percentageTop = this._convertToPercentage(positionTop, this._canvasHeight), percentageLeft = this._convertToPercentage(positionLeft, this._canvasWidth), percentageWidth = this._convertToPercentage(mediaWidth, this._canvasWidth), percentageHeight = this._convertToPercentage(mediaHeight, this._canvasHeight);
                var temporalOffsets = /t=([^&]+)/g.exec(body.id);
                var ot = void 0;
                if (temporalOffsets && temporalOffsets[1]) {
                    ot = temporalOffsets[1].split(',');
                }
                else {
                    ot = [null, null];
                }
                var offsetStart = (ot[0]) ? parseInt(ot[0]) : ot[0], offsetEnd = (ot[1]) ? parseInt(ot[1]) : ot[1];
                // todo: type this
                var itemData = {
                    'type': type,
                    'source': mediaSource,
                    'start': startTime,
                    'end': endTime,
                    'top': percentageTop,
                    'left': percentageLeft,
                    'width': percentageWidth,
                    'height': percentageHeight,
                    'startOffset': offsetStart,
                    'endOffset': offsetEnd,
                    'active': false,
                    'format': format
                };
                this._renderMediaElement(itemData);
            }
        };
        CanvasInstance.prototype.isVirtual = function () {
            return this._data.canvas instanceof IIIFComponents.AVComponentObjects.VirtualCanvas;
        };
        CanvasInstance.prototype.includesVirtualSubCanvas = function (canvasId) {
            if (this.isVirtual() && this._data.canvas && this._data.canvas.canvases) {
                for (var i = 0; i < this._data.canvas.canvases.length; i++) {
                    var canvas = this._data.canvas.canvases[i];
                    if (Manifesto.Utils.normaliseUrl(canvas.id) === canvasId) {
                        return true;
                    }
                }
            }
            return false;
        };
        CanvasInstance.prototype.set = function (data) {
            var oldData = Object.assign({}, this._data);
            this._data = Object.assign(this._data, data);
            var diff = IIIFComponents.AVComponentUtils.Utils.diff(oldData, this._data);
            if (diff.includes('visible')) {
                if (this._data.canvas) {
                    if (this._data.visible) {
                        this.$playerElement.show();
                        //console.log('show ' + this._data.canvas.id);
                    }
                    else {
                        this.$playerElement.hide();
                        this._pause();
                        //console.log('hide ' + this._data.canvas.id);
                    }
                    this.resize();
                }
            }
            if (diff.includes('range')) {
                if (this._data.helper) {
                    if (!this._data.range) {
                        this.fire(IIIFComponents.AVComponent.Events.RANGE_CHANGED, null);
                    }
                    else if (this._data.range.duration) {
                        // if the range has changed, update the time if not already within the duration span
                        if (!this._data.range.spans(this._canvasClockTime)) {
                            this._setCurrentTime(this._data.range.duration.start);
                        }
                        this._play();
                        this.fire(IIIFComponents.AVComponent.Events.RANGE_CHANGED, this._data.range.rangeId);
                    }
                }
            }
            this._render();
        };
        CanvasInstance.prototype._render = function () {
            var _this = this;
            if (this._data.range && this._data.range.duration) {
                // get the total length in seconds.
                var totalLength = this._canvasClockDuration;
                // get the length of the timeline container
                var timelineLength = this._$canvasTimelineContainer.width();
                // get the ratio of seconds to length
                var ratio = timelineLength / totalLength;
                var start = this._data.range.duration.start * ratio;
                var end = this._data.range.duration.end * ratio;
                var width = end - start;
                this._$durationHighlight.show();
                // set the start position and width
                this._$durationHighlight.css({
                    left: start,
                    width: width
                });
                var that_1 = this;
                this._$rangeTimelineContainer.slider("destroy");
                this._$rangeTimelineContainer.slider({
                    value: this._data.range.duration.start,
                    step: 0.01,
                    orientation: "horizontal",
                    range: "min",
                    min: this._data.range.duration.start,
                    max: this._data.range.duration.end,
                    animate: false,
                    create: function (evt, ui) {
                        // on create
                    },
                    slide: function (evt, ui) {
                        that_1._setCurrentTime(ui.value);
                    },
                    stop: function (evt, ui) {
                        //this._setCurrentTime(ui.value);
                    }
                });
            }
            else {
                this._$durationHighlight.hide();
            }
            this._contentAnnotations.forEach(function ($mediaElement) {
                $($mediaElement.element).prop("volume", _this._data.volume);
                _this._volume.set({
                    volume: _this._data.volume
                });
            });
            if (this._data.limitToRange && this._data.range) {
                this._$canvasTimelineContainer.hide();
                this._$rangeTimelineContainer.show();
            }
            else {
                this._$canvasTimelineContainer.show();
                this._$rangeTimelineContainer.hide();
            }
            this._updateCurrentTimeDisplay();
            this._updateDurationDisplay();
        };
        CanvasInstance.prototype.getCanvasId = function () {
            if (this._data && this._data.canvas) {
                return this._data.canvas.id;
            }
            return undefined;
        };
        CanvasInstance.prototype._updateHoverPreview = function (e, $container, duration) {
            var offset = $container.offset();
            var x = e.pageX - offset.left;
            var $hoverArrow = $container.find('.arrow');
            var $hoverHighlight = $container.find('.hover-highlight');
            var $hoverPreview = $container.find('.hover-preview');
            $hoverHighlight.width(x);
            var fullWidth = $container.width();
            var ratio = x / fullWidth;
            var seconds = Math.min(duration * ratio);
            $hoverPreview.find('.label').text(IIIFComponents.AVComponentUtils.Utils.formatTime(seconds));
            var hoverPreviewWidth = $hoverPreview.outerWidth();
            var hoverPreviewHeight = $hoverPreview.outerHeight();
            var left = x - hoverPreviewWidth * 0.5;
            var arrowLeft = hoverPreviewWidth * 0.5 - 6;
            if (left < 0) {
                left = 0;
                arrowLeft = x - 6;
            }
            if (left + hoverPreviewWidth > fullWidth) {
                left = fullWidth - hoverPreviewWidth;
                arrowLeft = (hoverPreviewWidth - (fullWidth - x)) - 6;
            }
            $hoverPreview.css({
                left: left,
                top: hoverPreviewHeight * -1 + 'px'
            }).show();
            $hoverArrow.css({
                left: arrowLeft
            });
        };
        CanvasInstance.prototype._previous = function (isDouble) {
            if (this._data.limitToRange) {
                // if only showing the range, single click rewinds, double click goes to previous range unless navigation is contrained to range
                if (isDouble) {
                    if (this._isNavigationConstrainedToRange()) {
                        this._rewind();
                    }
                    else {
                        this.fire(IIIFComponents.AVComponentCanvasInstance.Events.PREVIOUS_RANGE);
                    }
                }
                else {
                    this._rewind();
                }
            }
            else {
                // not limited to range. 
                // if there is a currentDuration, single click goes to previous range, double click clears current duration and rewinds.
                // if there is no currentDuration, single and double click rewinds.
                if (this._data.range) {
                    if (isDouble) {
                        this.set({
                            range: undefined
                        });
                        this._rewind();
                    }
                    else {
                        this.fire(IIIFComponents.AVComponentCanvasInstance.Events.PREVIOUS_RANGE);
                    }
                }
                else {
                    this._rewind();
                }
            }
        };
        CanvasInstance.prototype._next = function () {
            if (this._data.limitToRange) {
                if (this._isNavigationConstrainedToRange()) {
                    this._fastforward();
                }
                else {
                    this.fire(IIIFComponents.AVComponentCanvasInstance.Events.NEXT_RANGE);
                }
            }
            else {
                this.fire(IIIFComponents.AVComponentCanvasInstance.Events.NEXT_RANGE);
            }
        };
        CanvasInstance.prototype.destroy = function () {
            window.clearInterval(this._highPriorityInterval);
            window.clearInterval(this._lowPriorityInterval);
            window.clearInterval(this._canvasClockInterval);
        };
        CanvasInstance.prototype._convertToPercentage = function (pixelValue, maxValue) {
            var percentage = (pixelValue / maxValue) * 100;
            return percentage;
        };
        CanvasInstance.prototype._renderMediaElement = function (data) {
            var _this = this;
            var $mediaElement;
            var type = data.type.toString().toLowerCase();
            switch (type) {
                case 'image':
                    $mediaElement = $('<img class="anno" src="' + data.source + '" />');
                    break;
                case 'video':
                    $mediaElement = $('<video class="anno" />');
                    break;
                case 'audio':
                    $mediaElement = $('<audio class="anno" />');
                    break;
                case 'textualbody':
                    $mediaElement = $('<div class="anno">' + data.source + '</div>');
                    break;
                default:
                    return;
            }
            var video = $mediaElement[0];
            if (data.format && data.format.toString() === 'application/dash+xml') {
                // dash
                $mediaElement.attr('data-dashjs-player', '');
                var player = dashjs.MediaPlayer().create();
                player.initialize(video, data.source);
            }
            else if (data.format && data.format.toString() === 'application/vnd.apple.mpegurl') {
                // hls
                if (Hls.isSupported()) {
                    var hls = new Hls();
                    hls.loadSource(data.source);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, function () {
                        //video.play();
                    });
                }
                else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = data.source;
                    video.addEventListener('canplay', function () {
                        //video.play();
                    });
                }
            }
            else {
                $mediaElement.attr('src', data.source);
            }
            $mediaElement.css({
                top: data.top + '%',
                left: data.left + '%',
                width: data.width + '%',
                height: data.height + '%'
            }).hide();
            data.element = $mediaElement;
            if (type === 'video' || type === 'audio') {
                data.timeout = null;
                var that_2 = this;
                data.checkForStall = function () {
                    var self = this;
                    if (this.active) {
                        that_2._checkMediaSynchronization();
                        if (this.element.get(0).readyState > 0 && !this.outOfSync) {
                            that_2._playbackStalled(false, self);
                        }
                        else {
                            that_2._playbackStalled(true, self);
                            if (this.timeout) {
                                window.clearTimeout(this.timeout);
                            }
                            this.timeout = window.setTimeout(function () {
                                self.checkForStall();
                            }, 1000);
                        }
                    }
                    else {
                        that_2._playbackStalled(false, self);
                    }
                };
            }
            this._contentAnnotations.push(data);
            if (this.$playerElement) {
                this._$canvasContainer.append($mediaElement);
            }
            if (type === 'video' || type === 'audio') {
                $mediaElement.on('loadstart', function () {
                    //console.log('loadstart');
                    data.checkForStall();
                });
                $mediaElement.on('waiting', function () {
                    //console.log('waiting');
                    data.checkForStall();
                });
                $mediaElement.on('seeking', function () {
                    //console.log('seeking');
                    //data.checkForStall();
                });
                $mediaElement.on('loadedmetadata', function () {
                    _this._readyCanvasesCount++;
                    if (_this._readyCanvasesCount === _this._contentAnnotations.length) {
                        //if (!this._data.range) {
                        _this._setCurrentTime(0);
                        //}                        
                        if (_this.options.data.autoPlay) {
                            _this._play();
                        }
                        _this._updateDurationDisplay();
                        _this.fire(IIIFComponents.AVComponent.Events.CANVASREADY);
                    }
                });
                $mediaElement.attr('preload', 'auto');
                $mediaElement.get(0).load(); // todo: type
            }
            this._renderSyncIndicator(data);
        };
        CanvasInstance.prototype._hasRangeChanged = function () {
            var range = this._getRangeForCurrentTime();
            if (range !== this._data.range && !this._data.limitToRange) {
                this.set({
                    range: range
                });
            }
        };
        CanvasInstance.prototype._getRangeForCurrentTime = function () {
            for (var i = 0; i < this._ranges.length; i++) {
                var range = this._ranges[i];
                if (!range.nonav && range.spans(this._canvasClockTime)) {
                    return range;
                }
            }
            return undefined;
        };
        CanvasInstance.prototype._updateCurrentTimeDisplay = function () {
            if (this._data.limitToRange && this._data.range && this._data.range.duration) {
                var rangeClockTime = this._canvasClockTime - this._data.range.duration.start;
                this._$canvasTime.text(IIIFComponents.AVComponentUtils.Utils.formatTime(rangeClockTime));
            }
            else {
                this._$canvasTime.text(IIIFComponents.AVComponentUtils.Utils.formatTime(this._canvasClockTime));
            }
        };
        CanvasInstance.prototype._updateDurationDisplay = function () {
            if (this._data.limitToRange && this._data.range && this._data.range.duration) {
                this._$canvasDuration.text(IIIFComponents.AVComponentUtils.Utils.formatTime(this._data.range.duration.getLength()));
            }
            else {
                this._$canvasDuration.text(IIIFComponents.AVComponentUtils.Utils.formatTime(this._canvasClockDuration));
            }
        };
        // public setVolume(value: number): void {
        //     //console.log('set volume', (<any>this._data.canvas).id);
        //     this._data.volume = value;
        //     for (let i = 0; i < this._contentAnnotations.length; i++) {
        //         const $mediaElement = this._contentAnnotations[i];
        //         $($mediaElement.element).prop("volume", value);
        //     }
        // }
        CanvasInstance.prototype._renderSyncIndicator = function (mediaElementData) {
            var leftPercent = this._convertToPercentage(mediaElementData.start, this._canvasClockDuration);
            var widthPercent = this._convertToPercentage(mediaElementData.end - mediaElementData.start, this._canvasClockDuration);
            var $timelineItem = $('<div class="timeline-item" title="' + mediaElementData.source + '" data-start="' + mediaElementData.start + '" data-end="' + mediaElementData.end + '"></div>');
            $timelineItem.css({
                left: leftPercent + '%',
                width: widthPercent + '%'
            });
            var $lineWrapper = $('<div class="line-wrapper"></div>');
            $timelineItem.appendTo($lineWrapper);
            mediaElementData.timelineElement = $timelineItem;
            if (this.$playerElement) {
                this._$timelineItemContainer.append($lineWrapper);
            }
        };
        CanvasInstance.prototype._setCurrentTime = function (seconds) {
            // const secondsAsFloat: number = parseFloat(seconds.toString());
            // if (isNaN(secondsAsFloat)) {
            //     return;
            // }
            this._canvasClockTime = seconds; //secondsAsFloat;
            this._canvasClockStartDate = Date.now() - (this._canvasClockTime * 1000);
            this.logMessage('SET CURRENT TIME to: ' + this._canvasClockTime + ' seconds.');
            this._canvasClockUpdater();
            this._highPriorityUpdater();
            this._lowPriorityUpdater();
            this._synchronizeMedia();
        };
        // todo: can this be part of the _data state?
        // this._data.rewind = true?
        CanvasInstance.prototype._rewind = function (withoutUpdate) {
            this._pause();
            if (this._data.limitToRange && this._data.range && this._data.range.duration) {
                this._canvasClockTime = this._data.range.duration.start;
            }
            else {
                this._canvasClockTime = 0;
            }
            if (!this._data.limitToRange) {
                if (this._data && this._data.helper) {
                    this.set({
                        range: undefined
                    });
                }
            }
            this._play();
        };
        // todo: can this be part of the _data state?
        // this._data.fastforward = true?
        CanvasInstance.prototype._fastforward = function () {
            if (this._data.limitToRange && this._data.range && this._data.range.duration) {
                this._canvasClockTime = this._data.range.duration.end;
            }
            else {
                this._canvasClockTime = this._canvasClockDuration;
            }
            this._pause();
        };
        // todo: can this be part of the _data state?
        // this._data.play = true?
        CanvasInstance.prototype._play = function (withoutUpdate) {
            var _this = this;
            if (this._isPlaying)
                return;
            if (this._data.limitToRange && this._data.range && this._data.range.duration && this._canvasClockTime >= this._data.range.duration.end) {
                this._canvasClockTime = this._data.range.duration.start;
            }
            if (this._canvasClockTime === this._canvasClockDuration) {
                this._canvasClockTime = 0;
            }
            this._canvasClockStartDate = Date.now() - (this._canvasClockTime * 1000);
            this._highPriorityInterval = window.setInterval(function () {
                _this._highPriorityUpdater();
            }, this._highPriorityFrequency);
            this._lowPriorityInterval = window.setInterval(function () {
                _this._lowPriorityUpdater();
            }, this._lowPriorityFrequency);
            this._canvasClockInterval = window.setInterval(function () {
                _this._canvasClockUpdater();
            }, this._canvasClockFrequency);
            this._isPlaying = true;
            if (!withoutUpdate) {
                this._synchronizeMedia();
            }
            this._$playButton.find('i').switchClass('play', 'pause');
            this.fire(IIIFComponents.AVComponentCanvasInstance.Events.PLAYCANVAS);
            this.logMessage('PLAY canvas');
        };
        // todo: can this be part of the _data state?
        // this._data.play = false?
        CanvasInstance.prototype._pause = function (withoutUpdate) {
            window.clearInterval(this._highPriorityInterval);
            window.clearInterval(this._lowPriorityInterval);
            window.clearInterval(this._canvasClockInterval);
            this._isPlaying = false;
            if (!withoutUpdate) {
                this._highPriorityUpdater();
                this._lowPriorityUpdater();
                this._synchronizeMedia();
            }
            this._$playButton.find('i').switchClass('pause', 'play');
            this.fire(IIIFComponents.AVComponentCanvasInstance.Events.PAUSECANVAS);
            this.logMessage('PAUSE canvas');
        };
        CanvasInstance.prototype._isNavigationConstrainedToRange = function () {
            return this._data.constrainNavigationToRange;
        };
        CanvasInstance.prototype._canvasClockUpdater = function () {
            this._canvasClockTime = (Date.now() - this._canvasClockStartDate) / 1000;
            if (this._data.limitToRange && this._data.range && this._data.range.duration && this._canvasClockTime >= this._data.range.duration.end) {
                this._pause();
            }
            if (this._canvasClockTime >= this._canvasClockDuration) {
                this._canvasClockTime = this._canvasClockDuration;
                this._pause();
            }
        };
        CanvasInstance.prototype._highPriorityUpdater = function () {
            this._$rangeTimelineContainer.slider({
                value: this._canvasClockTime
            });
            this._$canvasTimelineContainer.slider({
                value: this._canvasClockTime
            });
            this._updateCurrentTimeDisplay();
            this._updateDurationDisplay();
        };
        CanvasInstance.prototype._lowPriorityUpdater = function () {
            this._updateMediaActiveStates();
            if (this._isPlaying && this._data.autoSelectRange) {
                this._hasRangeChanged();
            }
        };
        CanvasInstance.prototype._updateMediaActiveStates = function () {
            var contentAnnotation;
            for (var i = 0; i < this._contentAnnotations.length; i++) {
                contentAnnotation = this._contentAnnotations[i];
                var type = contentAnnotation.type.toString().toLowerCase();
                if (contentAnnotation.start <= this._canvasClockTime && contentAnnotation.end >= this._canvasClockTime) {
                    this._checkMediaSynchronization();
                    if (!contentAnnotation.active) {
                        this._synchronizeMedia();
                        contentAnnotation.active = true;
                        contentAnnotation.element.show();
                        contentAnnotation.timelineElement.addClass('active');
                    }
                    if (type === 'video' || type === 'audio') {
                        if (contentAnnotation.element[0].currentTime > contentAnnotation.element[0].duration - contentAnnotation.endOffset) {
                            this._pauseMedia(contentAnnotation.element[0]);
                        }
                    }
                }
                else {
                    if (contentAnnotation.active) {
                        contentAnnotation.active = false;
                        contentAnnotation.element.hide();
                        contentAnnotation.timelineElement.removeClass('active');
                        if (type === 'video' || type === 'audio') {
                            this._pauseMedia(contentAnnotation.element[0]);
                        }
                    }
                }
            }
            //this.logMessage('UPDATE MEDIA ACTIVE STATES at: '+ this._canvasClockTime + ' seconds.');
        };
        CanvasInstance.prototype._pauseMedia = function (media) {
            var playPromise = media.play();
            if (playPromise !== undefined) {
                playPromise.then(function (_) {
                    // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
                    media.pause();
                });
            }
            else {
                media.pause();
            }
        };
        CanvasInstance.prototype._setMediaCurrentTime = function (media, time) {
            if (!isNaN(media.duration)) {
                media.currentTime = time;
            }
        };
        CanvasInstance.prototype._synchronizeMedia = function () {
            var contentAnnotation;
            for (var i = 0; i < this._contentAnnotations.length; i++) {
                contentAnnotation = this._contentAnnotations[i];
                var type = contentAnnotation.type.toString().toLowerCase();
                if (type === 'video' || type === 'audio') {
                    this._setMediaCurrentTime(contentAnnotation.element[0], this._canvasClockTime - contentAnnotation.start + contentAnnotation.startOffset);
                    if (contentAnnotation.start <= this._canvasClockTime && contentAnnotation.end >= this._canvasClockTime) {
                        if (this._isPlaying) {
                            if (contentAnnotation.element[0].paused) {
                                var promise = contentAnnotation.element[0].play();
                                if (promise) {
                                    promise["catch"](function () { });
                                }
                            }
                        }
                        else {
                            this._pauseMedia(contentAnnotation.element[0]);
                        }
                    }
                    else {
                        this._pauseMedia(contentAnnotation.element[0]);
                    }
                    if (contentAnnotation.element[0].currentTime > contentAnnotation.element[0].duration - contentAnnotation.endOffset) {
                        this._pauseMedia(contentAnnotation.element[0]);
                    }
                }
            }
            this.logMessage('SYNC MEDIA at: ' + this._canvasClockTime + ' seconds.');
        };
        CanvasInstance.prototype._checkMediaSynchronization = function () {
            var contentAnnotation;
            for (var i = 0, l = this._contentAnnotations.length; i < l; i++) {
                contentAnnotation = this._contentAnnotations[i];
                var type = contentAnnotation.type.toString().toLowerCase();
                if ((type === 'video' || type === 'audio') &&
                    (contentAnnotation.start <= this._canvasClockTime && contentAnnotation.end >= this._canvasClockTime)) {
                    var correctTime = (this._canvasClockTime - contentAnnotation.start + contentAnnotation.startOffset);
                    var factualTime = contentAnnotation.element[0].currentTime;
                    // off by 0.2 seconds
                    if (Math.abs(factualTime - correctTime) > this._mediaSyncMarginSecs) {
                        contentAnnotation.outOfSync = true;
                        //this.playbackStalled(true, contentAnnotation);
                        var lag = Math.abs(factualTime - correctTime);
                        this.logMessage('DETECTED synchronization lag: ' + Math.abs(lag));
                        this._setMediaCurrentTime(contentAnnotation.element[0], correctTime);
                        //this.synchronizeMedia();
                    }
                    else {
                        contentAnnotation.outOfSync = false;
                        //this.playbackStalled(false, contentAnnotation);
                    }
                }
            }
        };
        CanvasInstance.prototype._playbackStalled = function (aBoolean, syncMediaRequestingStall) {
            if (aBoolean) {
                if (this._stallRequestedBy.indexOf(syncMediaRequestingStall) < 0) {
                    this._stallRequestedBy.push(syncMediaRequestingStall);
                }
                if (!this._isStalled) {
                    if (this.$playerElement) {
                        //this._showWorkingIndicator(this._$canvasContainer);
                    }
                    this._wasPlaying = this._isPlaying;
                    this._pause(true);
                    this._isStalled = aBoolean;
                }
            }
            else {
                var idx = this._stallRequestedBy.indexOf(syncMediaRequestingStall);
                if (idx >= 0) {
                    this._stallRequestedBy.splice(idx, 1);
                }
                if (this._stallRequestedBy.length === 0) {
                    //this._hideWorkingIndicator();
                    if (this._isStalled && this._wasPlaying) {
                        this._play(true);
                    }
                    this._isStalled = aBoolean;
                }
            }
        };
        // private _showWorkingIndicator($targetElement: JQuery): void {
        //     const workingIndicator: JQuery = $('<div class="working-indicator">Waiting...</div>');
        //     if ($targetElement.find('.working-indicator').length == 0) {
        //         $targetElement.append(workingIndicator);
        //     }
        //     //console.log('show working');
        // }
        // private _hideWorkingIndicator() {
        //     $('.workingIndicator').remove();
        //     //console.log('hide working');
        // }
        CanvasInstance.prototype.resize = function () {
            if (this.$playerElement) {
                var containerWidth = this._$canvasContainer.width();
                if (containerWidth) {
                    this._$canvasTimelineContainer.width(containerWidth);
                    //const resizeFactorY: number = containerWidth / this.canvasWidth;
                    //$canvasContainer.height(this.canvasHeight * resizeFactorY);
                    var $options = this.$playerElement.find('.options-container');
                    this._$canvasContainer.height(this.$playerElement.parent().height() - $options.height());
                }
                this._render();
            }
        };
        return CanvasInstance;
    }(_Components.BaseComponent));
    IIIFComponents.CanvasInstance = CanvasInstance;
})(IIIFComponents || (IIIFComponents = {}));
(function (IIIFComponents) {
    var AVComponentCanvasInstance;
    (function (AVComponentCanvasInstance) {
        var Events = /** @class */ (function () {
            function Events() {
            }
            Events.NEXT_RANGE = 'nextrange';
            Events.PAUSECANVAS = 'pause';
            Events.PLAYCANVAS = 'play';
            Events.PREVIOUS_RANGE = 'previousrange';
            return Events;
        }());
        AVComponentCanvasInstance.Events = Events;
    })(AVComponentCanvasInstance = IIIFComponents.AVComponentCanvasInstance || (IIIFComponents.AVComponentCanvasInstance = {}));
})(IIIFComponents || (IIIFComponents = {}));

var IIIFComponents;
(function (IIIFComponents) {
    var AVComponentObjects;
    (function (AVComponentObjects) {
        var CanvasRange = /** @class */ (function () {
            function CanvasRange(range) {
                this.rangeId = null;
                this.duration = null;
                this.nonav = false;
                if (!range.canvases || !range.canvases.length) {
                    return;
                }
                this.rangeId = range.id;
                // if there are multiple canvases, get the start of the first canvas,
                // and the end of the last canvas.
                var start;
                var end;
                for (var i = 0; i < range.canvases.length; i++) {
                    var canvas = range.canvases[i];
                    var temporal = IIIFComponents.AVComponentUtils.Utils.getTemporalComponent(canvas);
                    if (temporal && temporal.length > 1) {
                        if (i === 0) {
                            start = Number(temporal[0]);
                        }
                        if (i === range.canvases.length - 1) {
                            end = Number(temporal[1]);
                        }
                    }
                }
                if (start && end) {
                    this.duration = new AVComponentObjects.Duration(start, end);
                }
                this.nonav = range.getProperty('behavior') === 'no-nav';
            }
            CanvasRange.prototype.spans = function (time) {
                if (this.duration) {
                    if (time >= this.duration.start && time <= this.duration.end) {
                        return true;
                    }
                }
                return false;
            };
            return CanvasRange;
        }());
        AVComponentObjects.CanvasRange = CanvasRange;
    })(AVComponentObjects = IIIFComponents.AVComponentObjects || (IIIFComponents.AVComponentObjects = {}));
})(IIIFComponents || (IIIFComponents = {}));

var IIIFComponents;
(function (IIIFComponents) {
    var AVComponentObjects;
    (function (AVComponentObjects) {
        var Duration = /** @class */ (function () {
            function Duration(start, end) {
                this.start = start;
                this.end = end;
            }
            Duration.prototype.getLength = function () {
                return this.end - this.start;
            };
            return Duration;
        }());
        AVComponentObjects.Duration = Duration;
    })(AVComponentObjects = IIIFComponents.AVComponentObjects || (IIIFComponents.AVComponentObjects = {}));
})(IIIFComponents || (IIIFComponents = {}));





var IIIFComponents;
(function (IIIFComponents) {
    var AVComponentUtils;
    (function (AVComponentUtils) {
        var Utils = /** @class */ (function () {
            function Utils() {
            }
            Utils._compare = function (a, b) {
                var changed = [];
                Object.keys(a).forEach(function (p) {
                    if (!Object.is(b[p], a[p])) {
                        changed.push(p);
                    }
                });
                return changed;
            };
            Utils.diff = function (a, b) {
                return Array.from(new Set(Utils._compare(a, b).concat(Utils._compare(b, a))));
            };
            Utils.getSpatialComponent = function (target) {
                var spatial = /xywh=([^&]+)/g.exec(target);
                var xywh = null;
                if (spatial && spatial[1]) {
                    xywh = spatial[1].split(',');
                }
                return xywh;
            };
            Utils.getTemporalComponent = function (target) {
                var temporal = /t=([^&]+)/g.exec(target);
                var t = null;
                if (temporal && temporal[1]) {
                    t = temporal[1].split(',');
                }
                return t;
            };
            Utils.retargetTemporalComponent = function (canvases, target) {
                var t = AVComponentUtils.Utils.getTemporalComponent(target);
                if (t) {
                    var offset = 0;
                    var targetWithoutTemporal = target.substr(0, target.indexOf('#'));
                    // loop through canvases adding up their durations until we reach the targeted canvas
                    for (var i = 0; i < canvases.length; i++) {
                        var canvas = canvases[i];
                        if (!canvas.id.includes(targetWithoutTemporal)) {
                            var duration = canvas.getDuration();
                            if (duration) {
                                offset += duration;
                            }
                        }
                        else {
                            // we've reached the canvas whose target we're adjusting
                            break;
                        }
                    }
                    t[0] = Number(t[0]) + offset;
                    t[1] = Number(t[1]) + offset;
                    return targetWithoutTemporal + '#t=' + t[0] + ',' + t[1];
                }
                return undefined;
            };
            Utils.formatTime = function (aNumber) {
                var hours, minutes, seconds, hourValue;
                seconds = Math.ceil(aNumber);
                hours = Math.floor(seconds / (60 * 60));
                hours = (hours >= 10) ? hours : '0' + hours;
                minutes = Math.floor(seconds % (60 * 60) / 60);
                minutes = (minutes >= 10) ? minutes : '0' + minutes;
                seconds = Math.floor(seconds % (60 * 60) % 60);
                seconds = (seconds >= 10) ? seconds : '0' + seconds;
                if (hours >= 1) {
                    hourValue = hours + ':';
                }
                else {
                    hourValue = '';
                }
                return hourValue + minutes + ':' + seconds;
            };
            return Utils;
        }());
        AVComponentUtils.Utils = Utils;
    })(AVComponentUtils = IIIFComponents.AVComponentUtils || (IIIFComponents.AVComponentUtils = {}));
})(IIIFComponents || (IIIFComponents = {}));

var IIIFComponents;
(function (IIIFComponents) {
    var AVComponentObjects;
    (function (AVComponentObjects) {
        var VirtualCanvas = /** @class */ (function () {
            function VirtualCanvas() {
                this.canvases = [];
                // generate an id
                this.id = String(new Date().valueOf());
            }
            VirtualCanvas.prototype.addCanvas = function (canvas) {
                this.canvases.push(canvas);
            };
            VirtualCanvas.prototype.getContent = function () {
                var _this = this;
                var annotations = [];
                this.canvases.forEach(function (canvas) {
                    var items = canvas.getContent();
                    // if the annotations have no temporal target, add one so that
                    // they specifically target the duration of their canvas
                    items.forEach(function (item) {
                        var target = item.getTarget();
                        if (target) {
                            var t = IIIFComponents.AVComponentUtils.Utils.getTemporalComponent(target);
                            if (!t) {
                                item.__jsonld.target += '#t=0,' + canvas.getDuration();
                            }
                        }
                    });
                    items.forEach(function (item) {
                        var target = item.getTarget();
                        if (target) {
                            item.__jsonld.target = IIIFComponents.AVComponentUtils.Utils.retargetTemporalComponent(_this.canvases, target);
                        }
                    });
                    annotations.push.apply(annotations, items);
                });
                return annotations;
            };
            VirtualCanvas.prototype.getDuration = function () {
                var duration = 0;
                this.canvases.forEach(function (canvas) {
                    var d = canvas.getDuration();
                    if (d) {
                        duration += d;
                    }
                });
                return duration;
            };
            VirtualCanvas.prototype.getWidth = function () {
                if (this.canvases.length) {
                    return this.canvases[0].getWidth();
                }
                return 0;
            };
            VirtualCanvas.prototype.getHeight = function () {
                if (this.canvases.length) {
                    return this.canvases[0].getHeight();
                }
                return 0;
            };
            return VirtualCanvas;
        }());
        AVComponentObjects.VirtualCanvas = VirtualCanvas;
    })(AVComponentObjects = IIIFComponents.AVComponentObjects || (IIIFComponents.AVComponentObjects = {}));
})(IIIFComponents || (IIIFComponents = {}));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
