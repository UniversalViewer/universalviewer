// iiif-av-component v0.0.22 https://github.com/iiif-commons/iiif-av-component#readme
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.iiifAvComponent = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/// <reference types="exjs" /> 

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
            _this._currentCanvas = null;
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
                defaultAspectRatio: 0.56,
                doubleClickMS: 350,
                limitToRange: false,
                content: {
                    currentTime: "Current Time",
                    duration: "Duration",
                    next: "Next",
                    pause: "Pause",
                    play: "Play",
                    previous: "Previous"
                }
            };
        };
        AVComponent.prototype.set = function (data) {
            // changing any of these data properties forces a reload.
            if (this._propertiesChanged(data, ['helper'])) {
                $.extend(this._data, data);
                // reset all global properties and terminate all running processes
                // create canvases
                this._reset();
            }
            else {
                // no need to reload, just update.
                $.extend(this._data, data);
            }
            // update
            this._update();
            // resize everything
            this._resize();
        };
        AVComponent.prototype._propertiesChanged = function (data, properties) {
            var propChanged = false;
            for (var i = 0; i < properties.length; i++) {
                propChanged = this._propertyChanged(data, properties[i]);
                if (propChanged) {
                    break;
                }
            }
            return propChanged;
        };
        AVComponent.prototype._propertyChanged = function (data, propertyName) {
            return !!data[propertyName] && this._data[propertyName] !== data[propertyName];
        };
        AVComponent.prototype._reset = function () {
            for (var i = 0; i < this.canvasInstances.length; i++) {
                var canvasInstance = this.canvasInstances[i];
                canvasInstance.destroy();
            }
            this.canvasInstances = [];
            this._$element.empty();
            var canvases = this._getCanvases();
            for (var i = 0; i < canvases.length; i++) {
                this._initCanvas(canvases[i]);
            }
        };
        AVComponent.prototype._update = function () {
            for (var i = 0; i < this.canvasInstances.length; i++) {
                var canvasInstance = this.canvasInstances[i];
                canvasInstance.set(this._data);
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
            canvasInstance.on(AVComponent.Events.PREVIOUS_RANGE, function () {
                _this._prevRange();
            }, false);
            canvasInstance.on(AVComponent.Events.NEXT_RANGE, function () {
                _this._nextRage();
            }, false);
        };
        AVComponent.prototype._prevRange = function () {
            if (!this._data || !this._data.helper) {
                return;
            }
            var prevRange = this._data.helper.getPreviousRange();
            if (prevRange) {
                var canvasIds = prevRange.getCanvasIds();
                if (canvasIds.length) {
                    this._data.helper.rangeId = prevRange.id;
                    this.playCanvas(canvasIds[0]);
                    this.fire(AVComponent.Events.PREVIOUS_RANGE);
                }
            }
            else {
                // no previous range. rewind.
                this._rewind();
            }
        };
        AVComponent.prototype._nextRage = function () {
            if (!this._data || !this._data.helper) {
                return;
            }
            var nextRange = this._data.helper.getNextRange();
            if (nextRange) {
                var canvasIds = nextRange.getCanvasIds();
                if (canvasIds.length) {
                    this._data.helper.rangeId = nextRange.id;
                    this.playCanvas(canvasIds[0]);
                    this.fire(AVComponent.Events.NEXT_RANGE);
                }
            }
        };
        AVComponent.prototype.getCanvasInstanceById = function (canvasId) {
            canvasId = manifesto.Utils.normaliseUrl(canvasId);
            for (var i = 0; i < this.canvasInstances.length; i++) {
                var canvasInstance = this.canvasInstances[i];
                var id = canvasInstance.getCanvasId();
                if (id) {
                    var canvasInstanceId = manifesto.Utils.normaliseUrl(id);
                    if (canvasInstanceId === canvasId) {
                        return canvasInstance;
                    }
                }
            }
            return null;
        };
        AVComponent.prototype._getCurrentCanvas = function () {
            if (this._currentCanvas) {
                return this.getCanvasInstanceById(this._currentCanvas);
            }
            return null;
        };
        AVComponent.prototype._rewind = function () {
            if (this._data.limitToRange) {
                return;
            }
            var canvasInstance = this._getCurrentCanvas();
            if (canvasInstance) {
                canvasInstance.unhighlightDuration();
                canvasInstance.rewind();
            }
        };
        AVComponent.prototype.playCanvas = function (canvasId) {
            this.showCanvas(canvasId);
            var canvasInstance = this.getCanvasInstanceById(canvasId);
            if (canvasInstance) {
                this._currentCanvas = canvasId;
                var temporal = /t=([^&]+)/g.exec(canvasId);
                if (temporal && temporal.length > 1) {
                    var rangeTiming = temporal[1].split(',');
                    var duration = new IIIFComponents.AVComponentObjects.Duration(Number(rangeTiming[0]), Number(rangeTiming[1]));
                    canvasInstance.currentDuration = duration;
                    canvasInstance.highlightDuration();
                    canvasInstance.setCurrentTime(duration.start);
                    canvasInstance.play();
                }
            }
        };
        AVComponent.prototype.playRange = function (rangeId) {
            if (!this._data || !this._data.helper) {
                return;
            }
            var range = this._data.helper.getRangeById(rangeId);
            if (range) {
                this._data.helper.rangeId = rangeId;
                if (range.canvases) {
                    var canvasId = range.canvases[0];
                    this.playCanvas(canvasId);
                }
            }
        };
        AVComponent.prototype.showCanvas = function (canvasId) {
            // pause all canvases
            for (var i = 0; i < this.canvasInstances.length; i++) {
                this.canvasInstances[i].pause();
            }
            // hide all players
            this._$element.find('.player').hide();
            var canvasInstance = this.getCanvasInstanceById(canvasId);
            if (canvasInstance && canvasInstance.$playerElement) {
                canvasInstance.$playerElement.show();
            }
        };
        AVComponent.prototype._logMessage = function (message) {
            this.fire(AVComponent.Events.LOG, message);
        };
        AVComponent.prototype.resize = function () {
            this._resize();
        };
        AVComponent.prototype._resize = function () {
            // loop through all canvases resizing their elements
            for (var i = 0; i < this.canvasInstances.length; i++) {
                var canvasInstance = this.canvasInstances[i];
                canvasInstance.resize();
            }
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
            Events.NEXT_RANGE = 'nextrange';
            Events.PAUSECANVAS = 'pause';
            Events.PLAYCANVAS = 'play';
            Events.PREVIOUS_RANGE = 'previousrange';
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
            _this._state = {
                currentVolume: 1,
                lastVolume: 1
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
            this._$volumeMute = $('<button class="btn volume-mute"><i class="av-icon-mute on" aria-hidden="true"></i></button>');
            this._$volumeSlider = $('<input type="range" class="volume-slider" min="0" max="1" step="0.01" value="1">');
            this._$element.append(this._$volumeMute, this._$volumeSlider);
            var that = this;
            this._$volumeMute.on('click', function () {
                if (_this._state.currentVolume !== 0) {
                    // mute
                    _this._state.lastVolume = _this._state.currentVolume;
                    _this._state.currentVolume = 0;
                }
                else {
                    // unmute
                    _this._state.currentVolume = _this._state.lastVolume;
                }
                _this._render();
                _this.fire(AVVolumeControl.Events.VOLUME_CHANGED, _this._state.currentVolume);
            });
            this._$volumeSlider.on('input', function () {
                that._state.currentVolume = Number(this.value);
                if (that._state.currentVolume === 0) {
                    that._state.lastVolume = 0;
                }
                that._render();
                that.fire(AVVolumeControl.Events.VOLUME_CHANGED, that._state.currentVolume);
            });
            this._$volumeSlider.on('change', function () {
                that._state.currentVolume = Number(this.value);
                if (that._state.currentVolume === 0) {
                    that._state.lastVolume = 0;
                }
                that._render();
                that.fire(AVVolumeControl.Events.VOLUME_CHANGED, that._state.currentVolume);
            });
            return success;
        };
        AVVolumeControl.prototype._render = function () {
            this._$volumeSlider.val(this._state.currentVolume);
            if (this._state.currentVolume === 0) {
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
            _this._highPriorityFrequency = 25;
            _this._lowPriorityFrequency = 100;
            _this._canvasClockDuration = 0; // todo: should these 0 values be undefined by default?
            _this._canvasClockFrequency = 25;
            _this._canvasClockStartDate = 0;
            _this._canvasClockTime = 0;
            _this._canvasHeight = 0;
            _this._canvasWidth = 0;
            _this._isPlaying = false;
            _this._isStalled = false;
            _this._readyCanvasesCount = 0;
            _this._stallRequestedBy = []; //todo: type
            _this._wasPlaying = false;
            _this.currentDuration = null;
            _this.$playerElement = $('<div class="player"></div>');
            return _this;
        }
        CanvasInstance.prototype.init = function () {
            var _this = this;
            this._$canvasContainer = $('<div class="canvas-container"></div>');
            this._$optionsContainer = $('<div class="options-container"></div>');
            this._$rangeTimelineContainer = $('<div class="range-timeline-container"></div>');
            this._$canvasTimelineContainer = $('<div class="canvas-timeline-container"></div>');
            this._$durationHighlight = $('<div class="duration-highlight"></div>');
            this._$timelineItemContainer = $('<div class="timeline-item-container"></div>');
            this._$controlsContainer = $('<div class="controls-container"></div>');
            this._$prevButton = $('<button class="btn"><i class="av-icon-previous" aria-hidden="true"></i></button>');
            this._$playButton = $('<button class="btn"><i class="av-icon-play play" aria-hidden="true"></i></button>');
            this._$nextButton = $('<button class="btn"><i class="av-icon-next" aria-hidden="true"></i></button>');
            this._$timeDisplay = $('<div class="time-display"><span class="canvas-time"></span> / <span class="canvas-duration"></span></div>');
            this._$canvasTime = this._$timeDisplay.find('.canvas-time');
            this._$canvasDuration = this._$timeDisplay.find('.canvas-duration');
            var $volume = $('<div class="volume"></div>');
            this._volume = new IIIFComponents.AVVolumeControl({
                target: $volume[0]
            });
            this._volume.on(IIIFComponents.AVVolumeControl.Events.VOLUME_CHANGED, function (value) {
                _this.setVolume(value);
            }, false);
            this._$controlsContainer.append(this._$prevButton, this._$playButton, this._$nextButton, this._$timeDisplay, $volume);
            this._$canvasTimelineContainer.append(this._$durationHighlight);
            this._$optionsContainer.append(this._$canvasTimelineContainer, this._$rangeTimelineContainer, this._$timelineItemContainer, this._$controlsContainer);
            this.$playerElement.append(this._$canvasContainer, this._$optionsContainer);
            this._canvasClockDuration = this.options.data.canvas.getDuration();
            var canvasWidth = this.options.data.canvas.getWidth();
            var canvasHeight = this.options.data.canvas.getHeight();
            if (!canvasWidth) {
                this._canvasWidth = this.$playerElement.parent().width(); // this.options.data.defaultCanvasWidth;
            }
            else {
                this._canvasWidth = canvasWidth;
            }
            if (!canvasHeight) {
                this._canvasHeight = this._canvasWidth * this.options.data.defaultAspectRatio; //this.options.data.defaultCanvasHeight;
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
                    }, _this.options.data.doubleClickMS);
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
                    _this.pause();
                }
                else {
                    _this.play();
                }
            });
            this._$nextButton.on('click', function () {
                _this.fire(IIIFComponents.AVComponent.Events.NEXT_RANGE);
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
                    that.setCurrentTime(ui.value);
                },
                stop: function (evt, ui) {
                    //this.setCurrentTime(ui.value);
                }
            });
            // create annotations
            this._contentAnnotations = [];
            var items = this.options.data.canvas.__jsonld.content[0].items; //todo: use canvas.getContent()
            if (items.length === 1) {
                this._$timelineItemContainer.hide();
            }
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                /*
                if (item.motivation != 'painting') {
                    return null;
                }
                */
                var mediaSource = void 0;
                if (Array.isArray(item.body) && item.body[0].type.toLowerCase() === 'choice') {
                    // Choose first "Choice" item as body
                    var tmpItem = item;
                    item.body = tmpItem.body[0].items[0];
                    mediaSource = item.body.id.split('#')[0];
                }
                else if (item.body.type.toLowerCase() === 'textualbody') {
                    mediaSource = item.body.value;
                }
                else {
                    mediaSource = item.body.id.split('#')[0];
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
                var spatial = /xywh=([^&]+)/g.exec(item.target);
                var temporal = /t=([^&]+)/g.exec(item.target);
                var xywh = void 0;
                if (spatial && spatial[1]) {
                    xywh = spatial[1].split(',');
                }
                else {
                    xywh = [0, 0, this._canvasWidth, this._canvasHeight];
                }
                var t = void 0;
                if (temporal && temporal[1]) {
                    t = temporal[1].split(',');
                }
                else {
                    t = [0, this._canvasClockDuration];
                }
                var positionLeft = parseInt(xywh[0]), positionTop = parseInt(xywh[1]), mediaWidth = parseInt(xywh[2]), mediaHeight = parseInt(xywh[3]), startTime = parseInt(t[0]), endTime = parseInt(t[1]);
                var percentageTop = this._convertToPercentage(positionTop, this._canvasHeight), percentageLeft = this._convertToPercentage(positionLeft, this._canvasWidth), percentageWidth = this._convertToPercentage(mediaWidth, this._canvasWidth), percentageHeight = this._convertToPercentage(mediaHeight, this._canvasHeight);
                var temporalOffsets = /t=([^&]+)/g.exec(item.body.id);
                var ot = void 0;
                if (temporalOffsets && temporalOffsets[1]) {
                    ot = temporalOffsets[1].split(',');
                }
                else {
                    ot = [null, null];
                }
                var offsetStart = (ot[0]) ? parseInt(ot[0]) : ot[0], offsetEnd = (ot[1]) ? parseInt(ot[1]) : ot[1];
                var itemData = {
                    'type': item.body.type,
                    'source': mediaSource,
                    'start': startTime,
                    'end': endTime,
                    'top': percentageTop,
                    'left': percentageLeft,
                    'width': percentageWidth,
                    'height': percentageHeight,
                    'startOffset': offsetStart,
                    'endOffset': offsetEnd,
                    'active': false
                };
                this._renderMediaElement(itemData);
            }
        };
        CanvasInstance.prototype.getCanvasId = function () {
            return this.options.data.canvas.id;
        };
        CanvasInstance.prototype._previous = function (isDouble) {
            if (this._isLimitedToRange() && this.currentDuration) {
                // if only showing the range, single click rewinds, double click goes to previous range
                if (isDouble) {
                    this.fire(IIIFComponents.AVComponent.Events.PREVIOUS_RANGE);
                }
                else {
                    this.rewind();
                }
            }
            else {
                // not limited to range. 
                // if there is a currentDuration, single click goes to previous range, double click rewinds.
                // if there is no currentDuration, single and double click rewinds.
                if (this.currentDuration) {
                    if (isDouble) {
                        this.unhighlightDuration();
                        this.rewind();
                    }
                    else {
                        this.fire(IIIFComponents.AVComponent.Events.PREVIOUS_RANGE);
                    }
                }
                else {
                    this.rewind();
                }
            }
        };
        CanvasInstance.prototype.set = function (data) {
            if (data) {
                this.options.data = Object.assign({}, this.options.data, data);
            }
            if (this._isLimitedToRange() && this.currentDuration) {
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
            var $mediaElement;
            switch (data.type.toLowerCase()) {
                case 'image':
                    $mediaElement = $('<img class="anno" src="' + data.source + '" />');
                    break;
                case 'video':
                    $mediaElement = $('<video class="anno" src="' + data.source + '" />');
                    break;
                case 'audio':
                    $mediaElement = $('<audio class="anno" src="' + data.source + '" />');
                    break;
                case 'textualbody':
                    $mediaElement = $('<div class="anno">' + data.source + '</div>');
                    break;
                default:
                    return;
            }
            $mediaElement.css({
                top: data.top + '%',
                left: data.left + '%',
                width: data.width + '%',
                height: data.height + '%'
            }).hide();
            data.element = $mediaElement;
            if (data.type.toLowerCase() === 'video' || data.type.toLowerCase() === 'audio') {
                data.timeout = null;
                var that_1 = this;
                data.checkForStall = function () {
                    var self = this;
                    if (this.active) {
                        that_1._checkMediaSynchronization();
                        if (this.element.get(0).readyState > 0 && !this.outOfSync) {
                            that_1._playbackStalled(false, self);
                        }
                        else {
                            that_1._playbackStalled(true, self);
                            if (this.timeout) {
                                window.clearTimeout(this.timeout);
                            }
                            this.timeout = window.setTimeout(function () {
                                self.checkForStall();
                            }, 1000);
                        }
                    }
                    else {
                        that_1._playbackStalled(false, self);
                    }
                };
            }
            this._contentAnnotations.push(data);
            if (this.$playerElement) {
                this._$canvasContainer.append($mediaElement);
            }
            if (data.type.toLowerCase() === 'video' || data.type.toLowerCase() === 'audio') {
                var that_2 = this;
                var self_1 = data;
                $mediaElement.on('loadstart', function () {
                    //console.log('loadstart');
                    self_1.checkForStall();
                });
                $mediaElement.on('waiting', function () {
                    //console.log('waiting');
                    self_1.checkForStall();
                });
                $mediaElement.on('seeking', function () {
                    //console.log('seeking');
                    //self.checkForStall();
                });
                $mediaElement.on('loadedmetadata', function () {
                    that_2._readyCanvasesCount++;
                    if (that_2._readyCanvasesCount === that_2._contentAnnotations.length) {
                        that_2.setCurrentTime(0);
                        if (that_2.options.data.autoPlay) {
                            that_2.play();
                        }
                        that_2._updateDurationDisplay();
                        that_2.fire(IIIFComponents.AVComponent.Events.CANVASREADY);
                    }
                });
                $mediaElement.attr('preload', 'auto');
                $mediaElement.get(0).load(); // todo: type
            }
            this._renderSyncIndicator(data);
        };
        CanvasInstance.prototype._updateCurrentTimeDisplay = function () {
            if (this._isLimitedToRange() && this.currentDuration) {
                var rangeClockTime = this._canvasClockTime - this.currentDuration.start;
                this._$canvasTime.text(IIIFComponents.AVComponentUtils.Utils.formatTime(rangeClockTime));
            }
            else {
                this._$canvasTime.text(IIIFComponents.AVComponentUtils.Utils.formatTime(this._canvasClockTime));
            }
        };
        CanvasInstance.prototype._updateDurationDisplay = function () {
            if (this._isLimitedToRange() && this.currentDuration) {
                this._$canvasDuration.text(IIIFComponents.AVComponentUtils.Utils.formatTime(this.currentDuration.getLength()));
            }
            else {
                this._$canvasDuration.text(IIIFComponents.AVComponentUtils.Utils.formatTime(this._canvasClockDuration));
            }
        };
        CanvasInstance.prototype.unhighlightDuration = function () {
            this.currentDuration = null;
            if (this.options.data && this.options.data.helper) {
                this.options.data.helper.rangeId = null;
            }
            this._$durationHighlight.hide();
        };
        CanvasInstance.prototype.highlightDuration = function () {
            if (!this.currentDuration) {
                return;
            }
            // get the total length in seconds.
            var totalLength = this._canvasClockDuration;
            // get the length of the timeline container
            var timelineLength = this._$canvasTimelineContainer.width();
            // get the ratio of seconds to length
            var ratio = timelineLength / totalLength;
            var start = this.currentDuration.start * ratio;
            var end = this.currentDuration.end * ratio;
            var width = end - start;
            this._$durationHighlight.show();
            // set the start position and width
            this._$durationHighlight.css({
                left: start,
                width: width
            });
            var that = this;
            this._$rangeTimelineContainer.slider("destroy");
            this._$rangeTimelineContainer.slider({
                value: this.currentDuration.start,
                step: 0.01,
                orientation: "horizontal",
                range: "min",
                min: this.currentDuration.start,
                max: this.currentDuration.end,
                animate: false,
                create: function (evt, ui) {
                    // on create
                },
                slide: function (evt, ui) {
                    that.setCurrentTime(ui.value);
                },
                stop: function (evt, ui) {
                    //this.setCurrentTime(ui.value);
                }
            });
            // todo: the above should take place in set() instead of forcing a set
            // extend IAVCanvasInstanceData to include currentDuration
            // same for unhighlightDuration
            this.set({});
        };
        CanvasInstance.prototype.setVolume = function (value) {
            for (var i = 0; i < this._contentAnnotations.length; i++) {
                var $mediaElement = this._contentAnnotations[i];
                $($mediaElement.element).prop("volume", value);
            }
        };
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
        CanvasInstance.prototype.setCurrentTime = function (seconds) {
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
        CanvasInstance.prototype.rewind = function (withoutUpdate) {
            this.pause();
            if (this._isLimitedToRange() && this.currentDuration) {
                this._canvasClockTime = this.currentDuration.start;
            }
            else {
                this._canvasClockTime = 0;
            }
            this.play();
        };
        CanvasInstance.prototype.play = function (withoutUpdate) {
            if (this._isPlaying)
                return;
            if (this._isLimitedToRange() && this.currentDuration && this._canvasClockTime >= this.currentDuration.end) {
                this._canvasClockTime = this.currentDuration.start;
            }
            if (this._canvasClockTime === this._canvasClockDuration) {
                this._canvasClockTime = 0;
            }
            this._canvasClockStartDate = Date.now() - (this._canvasClockTime * 1000);
            var self = this;
            this._highPriorityInterval = window.setInterval(function () {
                self._highPriorityUpdater();
            }, this._highPriorityFrequency);
            this._lowPriorityInterval = window.setInterval(function () {
                self._lowPriorityUpdater();
            }, this._lowPriorityFrequency);
            this._canvasClockInterval = window.setInterval(function () {
                self._canvasClockUpdater();
            }, this._canvasClockFrequency);
            this._isPlaying = true;
            if (!withoutUpdate) {
                this._synchronizeMedia();
            }
            this._$playButton.find('i').switchClass('play', 'pause');
            this.fire(IIIFComponents.AVComponent.Events.PLAYCANVAS);
            this.logMessage('PLAY canvas');
        };
        CanvasInstance.prototype.pause = function (withoutUpdate) {
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
            this.fire(IIIFComponents.AVComponent.Events.PAUSECANVAS);
            this.logMessage('PAUSE canvas');
        };
        CanvasInstance.prototype._isLimitedToRange = function () {
            return this.options.data.limitToRange;
        };
        CanvasInstance.prototype._canvasClockUpdater = function () {
            this._canvasClockTime = (Date.now() - this._canvasClockStartDate) / 1000;
            if (this._isLimitedToRange() && this.currentDuration && this._canvasClockTime >= this.currentDuration.end) {
                this.pause();
            }
            if (this._canvasClockTime >= this._canvasClockDuration) {
                this._canvasClockTime = this._canvasClockDuration;
                this.pause();
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
        };
        CanvasInstance.prototype._updateMediaActiveStates = function () {
            var contentAnnotation;
            for (var i = 0; i < this._contentAnnotations.length; i++) {
                contentAnnotation = this._contentAnnotations[i];
                if (contentAnnotation.start <= this._canvasClockTime && contentAnnotation.end >= this._canvasClockTime) {
                    this._checkMediaSynchronization();
                    if (!contentAnnotation.active) {
                        this._synchronizeMedia();
                        contentAnnotation.active = true;
                        contentAnnotation.element.show();
                        contentAnnotation.timelineElement.addClass('active');
                    }
                    if (contentAnnotation.type.toLowerCase() === 'video' || contentAnnotation.type.toLowerCase() === 'audio') {
                        if (contentAnnotation.element[0].currentTime > contentAnnotation.element[0].duration - contentAnnotation.endOffset) {
                            contentAnnotation.element[0].pause();
                        }
                    }
                }
                else {
                    if (contentAnnotation.active) {
                        contentAnnotation.active = false;
                        contentAnnotation.element.hide();
                        contentAnnotation.timelineElement.removeClass('active');
                        if (contentAnnotation.toLowerCase() === 'video' || contentAnnotation.toLowerCase() === 'audio') {
                            contentAnnotation.element[0].pause();
                        }
                    }
                }
            }
            //this.logMessage('UPDATE MEDIA ACTIVE STATES at: '+ this._canvasClockTime + ' seconds.');
        };
        CanvasInstance.prototype._synchronizeMedia = function () {
            var contentAnnotation;
            for (var i = 0; i < this._contentAnnotations.length; i++) {
                contentAnnotation = this._contentAnnotations[i];
                if (contentAnnotation.type.toLowerCase() === 'video' || contentAnnotation.type.toLowerCase() === 'audio') {
                    contentAnnotation.element[0].currentTime = this._canvasClockTime - contentAnnotation.start + contentAnnotation.startOffset;
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
                            contentAnnotation.element[0].pause();
                        }
                    }
                    else {
                        contentAnnotation.element[0].pause();
                    }
                    if (contentAnnotation.element[0].currentTime > contentAnnotation.element[0].duration - contentAnnotation.endOffset) {
                        contentAnnotation.element[0].pause();
                    }
                }
            }
            this.logMessage('SYNC MEDIA at: ' + this._canvasClockTime + ' seconds.');
        };
        CanvasInstance.prototype._checkMediaSynchronization = function () {
            var contentAnnotation;
            for (var i = 0, l = this._contentAnnotations.length; i < l; i++) {
                contentAnnotation = this._contentAnnotations[i];
                if ((contentAnnotation.type.toLowerCase() === 'video' || contentAnnotation.type.toLowerCase() === 'audio') &&
                    (contentAnnotation.start <= this._canvasClockTime && contentAnnotation.end >= this._canvasClockTime)) {
                    var correctTime = (this._canvasClockTime - contentAnnotation.start + contentAnnotation.startOffset);
                    var factualTime = contentAnnotation.element[0].currentTime;
                    // off by 0.2 seconds
                    if (Math.abs(factualTime - correctTime) > 0.4) {
                        contentAnnotation.outOfSync = true;
                        //this.playbackStalled(true, contentAnnotation);
                        var lag = Math.abs(factualTime - correctTime);
                        this.logMessage('DETECTED synchronization lag: ' + Math.abs(lag));
                        contentAnnotation.element[0].currentTime = correctTime;
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
                        this._showWorkingIndicator(this._$canvasContainer);
                    }
                    this._wasPlaying = this._isPlaying;
                    this.pause(true);
                    this._isStalled = aBoolean;
                }
            }
            else {
                var idx = this._stallRequestedBy.indexOf(syncMediaRequestingStall);
                if (idx >= 0) {
                    this._stallRequestedBy.splice(idx, 1);
                }
                if (this._stallRequestedBy.length === 0) {
                    this._hideWorkingIndicator();
                    if (this._isStalled && this._wasPlaying) {
                        this.play(true);
                    }
                    this._isStalled = aBoolean;
                }
            }
        };
        CanvasInstance.prototype._showWorkingIndicator = function ($targetElement) {
            var workingIndicator = $('<div class="working-indicator">Waiting...</div>');
            if ($targetElement.find('.working-indicator').length == 0) {
                $targetElement.append(workingIndicator);
            }
            //console.log('show working');
        };
        CanvasInstance.prototype._hideWorkingIndicator = function () {
            $('.workingIndicator').remove();
            //console.log('hide working');
        };
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
                this.highlightDuration();
            }
        };
        return CanvasInstance;
    }(_Components.BaseComponent));
    IIIFComponents.CanvasInstance = CanvasInstance;
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});