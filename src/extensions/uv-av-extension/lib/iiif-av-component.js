// iiif-av-component v0.0.1 https://github.com/viewdir/iiif-av-component#readme
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.iiifAvComponent = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
///<reference path="../node_modules/typescript/lib/lib.es6.d.ts"/> 

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
    var AVComponent = (function (_super) {
        __extends(AVComponent, _super);
        function AVComponent(options) {
            var _this = _super.call(this, options) || this;
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
                helper: null,
                defaultAspectRatio: 0.56
            };
        };
        AVComponent.prototype.set = function (data) {
            this.options.data = data;
            // reset all global properties and terminate all running processes
            this._reset();
            // render ui
            this._render();
            // resize everything
            this._resize();
        };
        AVComponent.prototype._reset = function () {
            for (var i = 0; i < this.canvasInstances.length; i++) {
                window.clearInterval(this.canvasInstances[i].highPriorityInterval);
                window.clearInterval(this.canvasInstances[i].lowPriorityInterval);
                window.clearInterval(this.canvasInstances[i].canvasClockInterval);
            }
            this.canvasInstances = [];
        };
        AVComponent.prototype._render = function () {
            this._$element.empty();
            var canvases = this._getCanvases();
            for (var i = 0; i < canvases.length; i++) {
                this._initCanvas(canvases[i]);
            }
        };
        AVComponent.prototype._getCanvases = function () {
            return this.options.data.helper.getCanvases();
        };
        AVComponent.prototype._initCanvas = function (canvas) {
            var $player = $('<div class="player"></div>');
            var $canvasContainer = $('<div class="canvasContainer"></div>');
            var $optionsContainer = $('<div class="optionsContainer"></div>');
            var $timelineContainer = $('<div class="timelineContainer"></div>');
            var $timelineItemContainer = $('<div class="timelineItemContainer"></div>');
            var $controlsContainer = $('<div class="controlsContainer"></div>');
            var $playButton = $('<button class="playButton">Play</button>');
            var $pauseButton = $('<button class="pauseButton">Pause</button>');
            var $timingControls = $('<span>Current Time: <span class="canvasTime"></span> / Duration: <span class="canvasDuration"></span></span>');
            $controlsContainer.append($playButton, $pauseButton, $timingControls);
            $optionsContainer.append($timelineContainer, $timelineItemContainer, $controlsContainer);
            $player.append($canvasContainer, $optionsContainer);
            this._$element.append($player);
            var canvasInstance = new IIIFComponents.CanvasInstance(canvas);
            var canvasWidth = canvas.getWidth();
            var canvasHeight = canvas.getHeight();
            if (!canvasWidth) {
                canvasInstance.canvasWidth = this._$element.width(); // this.options.data.defaultCanvasWidth;
            }
            else {
                canvasInstance.canvasWidth = canvasWidth;
            }
            if (!canvasHeight) {
                canvasInstance.canvasHeight = canvasInstance.canvasWidth * this.options.data.defaultAspectRatio; //this.options.data.defaultCanvasHeight;
            }
            else {
                canvasInstance.canvasHeight = canvasHeight;
            }
            canvasInstance.$playerElement = $player;
            canvasInstance.logMessage = this._logMessage.bind(this);
            $timelineContainer.slider({
                value: 0,
                step: 0.01,
                orientation: "horizontal",
                range: "min",
                max: canvasInstance.canvasClockDuration,
                animate: false,
                create: function (evt, ui) {
                    // on create
                },
                slide: function (evt, ui) {
                    canvasInstance.setCurrentTime(ui.value);
                },
                stop: function (evt, ui) {
                    //canvasInstance.setCurrentTime(ui.value);
                }
            });
            this.canvasInstances.push(canvasInstance);
            canvasInstance.initContents();
            $playButton.on('click', function () {
                canvasInstance.playCanvas();
            });
            $pauseButton.on('click', function () {
                canvasInstance.pauseCanvas();
            });
            canvasInstance.setCurrentTime(0);
            $timingControls.find('.canvasDuration').text(IIIFComponents.AVComponentUtils.Utils.formatTime(canvasInstance.canvasClockDuration));
            this._logMessage('CREATED CANVAS: ' + canvasInstance.canvasClockDuration + ' seconds, ' + canvasInstance.canvasWidth + ' x ' + canvasInstance.canvasHeight + ' px.');
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
                if (canvasInstance.$playerElement) {
                    var $canvasContainer = canvasInstance.$playerElement.find('.canvasContainer');
                    var $timelineContainer = canvasInstance.$playerElement.find('.timelineContainer');
                    var containerWidth = $canvasContainer.width();
                    if (containerWidth) {
                        $timelineContainer.width(containerWidth);
                        //const resizeFactorY: number = containerWidth / canvasInstance.canvasWidth;
                        //$canvasContainer.height(canvasInstance.canvasHeight * resizeFactorY);
                        var $options = canvasInstance.$playerElement.find('.optionsContainer');
                        $canvasContainer.height(this._$element.height() - $options.height());
                    }
                }
            }
        };
        return AVComponent;
    }(_Components.BaseComponent));
    IIIFComponents.AVComponent = AVComponent;
})(IIIFComponents || (IIIFComponents = {}));
(function (IIIFComponents) {
    var AVComponent;
    (function (AVComponent) {
        var Events = (function () {
            function Events() {
            }
            Events.LOG = 'log';
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

var IIIFComponents;
(function (IIIFComponents) {
    var CanvasInstance = (function () {
        function CanvasInstance(canvas) {
            this._highPriorityFrequency = 25;
            this._lowPriorityFrequency = 100;
            this._canvasClockFrequency = 25;
            this.$playerElement = null;
            this.canvasClockDuration = 0; // todo: should these 0 values be undefined by default?
            this.canvasClockStartDate = 0;
            this.canvasClockTime = 0;
            this.canvasHeight = 0;
            this.canvasWidth = 0;
            this.data = null;
            this.isPlaying = false;
            this.isStalled = false;
            this.stallRequestedBy = []; //todo: type
            this.wasPlaying = false;
            this.data = canvas;
            this.canvasClockDuration = canvas.getDuration();
        }
        CanvasInstance.prototype.initContents = function () {
            if (!this.data)
                return;
            this._mediaElements = [];
            var mediaItems = this.data.__jsonld.content[0].items; //todo: use canvas.getContent()
            for (var i = 0; i < mediaItems.length; i++) {
                var mediaItem = mediaItems[i];
                /*
                if (mediaItem.motivation != 'painting') {
                    return null;
                }
                */
                var mediaSource;
                if (mediaItem.body.type == 'TextualBody') {
                    mediaSource = mediaItem.body.value;
                }
                else if (Array.isArray(mediaItem.body) && mediaItem.body[0].type == 'Choice') {
                    // Choose first "Choice" item as body
                    var tmpItem = mediaItem;
                    mediaItem.body = tmpItem.body[0].items[0];
                    mediaSource = mediaItem.body.id.split('#')[0];
                }
                else {
                    mediaSource = mediaItem.body.id.split('#')[0];
                }
                /*
                var targetFragment = (mediaItem.target.indexOf('#') != -1) ? mediaItem.target.split('#t=')[1] : '0, '+ canvasClockDuration,
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
                var spatial = /xywh=([^&]+)/g.exec(mediaItem.target);
                var temporal = /t=([^&]+)/g.exec(mediaItem.target);
                var xywh;
                if (spatial && spatial[1]) {
                    xywh = spatial[1].split(',');
                }
                else {
                    xywh = [0, 0, this.canvasWidth, this.canvasHeight];
                }
                var t;
                if (temporal && temporal[1]) {
                    t = temporal[1].split(',');
                }
                else {
                    t = [0, this.canvasClockDuration];
                }
                var positionLeft = parseInt(xywh[0]), positionTop = parseInt(xywh[1]), mediaWidth = parseInt(xywh[2]), mediaHeight = parseInt(xywh[3]), startTime = parseInt(t[0]), endTime = parseInt(t[1]);
                var percentageTop = this._convertToPercentage(positionTop, this.canvasHeight), percentageLeft = this._convertToPercentage(positionLeft, this.canvasWidth), percentageWidth = this._convertToPercentage(mediaWidth, this.canvasWidth), percentageHeight = this._convertToPercentage(mediaHeight, this.canvasHeight);
                var temporalOffsets = /t=([^&]+)/g.exec(mediaItem.body.id);
                var ot;
                if (temporalOffsets && temporalOffsets[1]) {
                    ot = temporalOffsets[1].split(',');
                }
                else {
                    ot = [null, null];
                }
                var offsetStart = (ot[0]) ? parseInt(ot[0]) : ot[0], offsetEnd = (ot[1]) ? parseInt(ot[1]) : ot[1];
                var itemData = {
                    'type': mediaItem.body.type,
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
        CanvasInstance.prototype._convertToPercentage = function (pixelValue, maxValue) {
            var percentage = (pixelValue / maxValue) * 100;
            return percentage;
        };
        CanvasInstance.prototype._renderMediaElement = function (data) {
            var mediaElement;
            switch (data.type) {
                case 'Image':
                    mediaElement = $('<img class="anno" src="' + data.source + '" />');
                    break;
                case 'Video':
                    mediaElement = $('<video class="anno" src="' + data.source + '" />');
                    break;
                case 'Audio':
                    mediaElement = $('<audio class="anno" src="' + data.source + '" />');
                    break;
                case 'TextualBody':
                    mediaElement = $('<div class="anno">' + data.source + '</div>');
                    break;
                default:
                    return;
            }
            mediaElement.css({
                top: data.top + '%',
                left: data.left + '%',
                width: data.width + '%',
                height: data.height + '%'
            }).hide();
            data.element = mediaElement;
            if (data.type == 'Video' || data.type == 'Audio') {
                data.timeout = null;
                var that = this;
                data.checkForStall = function () {
                    var self = this;
                    if (this.active) {
                        that.checkMediaSynchronization();
                        if (this.element.get(0).readyState > 0 && !this.outOfSync) {
                            that.playbackStalled(false, self);
                        }
                        else {
                            that.playbackStalled(true, self);
                            if (this.timeout) {
                                window.clearTimeout(this.timeout);
                            }
                            this.timeout = window.setTimeout(function () {
                                self.checkForStall();
                            }, 1000);
                        }
                    }
                    else {
                        that.playbackStalled(false, self);
                    }
                };
            }
            this._mediaElements.push(data);
            if (this.$playerElement) {
                var targetElement = this.$playerElement.find('.canvasContainer');
                targetElement.append(mediaElement);
            }
            if (data.type == 'Video' || data.type == 'Audio') {
                var self = data;
                mediaElement.on('loadstart', function () {
                    //console.log('loadstart');
                    self.checkForStall();
                });
                mediaElement.on('waiting', function () {
                    //console.log('waiting');
                    self.checkForStall();
                });
                mediaElement.on('seeking', function () {
                    //console.log('seeking');
                    //self.checkForStall();
                });
                mediaElement.attr('preload', 'auto');
                mediaElement.get(0).load(); // todo: type
            }
            this._renderSyncIndicator(data);
        };
        CanvasInstance.prototype._renderSyncIndicator = function (mediaElementData) {
            var leftPercent = this._convertToPercentage(mediaElementData.start, this.canvasClockDuration);
            var widthPercent = this._convertToPercentage(mediaElementData.end - mediaElementData.start, this.canvasClockDuration);
            var timelineItem = $('<div class="timelineItem" title="' + mediaElementData.source + '" data-start="' + mediaElementData.start + '" data-end="' + mediaElementData.end + '"></div>');
            timelineItem.css({
                left: leftPercent + '%',
                width: widthPercent + '%'
            });
            var lineWrapper = $('<div class="lineWrapper"></div>');
            timelineItem.appendTo(lineWrapper);
            mediaElementData.timelineElement = timelineItem;
            if (this.$playerElement) {
                var itemContainer = this.$playerElement.find('.timelineItemContainer');
                itemContainer.append(lineWrapper);
            }
        };
        CanvasInstance.prototype.setCurrentTime = function (seconds) {
            var secondsAsFloat = parseFloat(seconds);
            if (isNaN(secondsAsFloat)) {
                return;
            }
            this.canvasClockTime = secondsAsFloat;
            this.canvasClockStartDate = Date.now() - (this.canvasClockTime * 1000);
            this.logMessage('SET CURRENT TIME to: ' + this.canvasClockTime + ' seconds.');
            this.canvasClockUpdater();
            this.highPriorityUpdater();
            this.lowPriorityUpdater();
            this.synchronizeMedia();
        };
        CanvasInstance.prototype.playCanvas = function (withoutUpdate) {
            if (this.isPlaying)
                return;
            if (this.canvasClockTime === this.canvasClockDuration) {
                this.canvasClockTime = 0;
            }
            this.canvasClockStartDate = Date.now() - (this.canvasClockTime * 1000);
            var self = this;
            this._highPriorityInterval = window.setInterval(function () {
                self.highPriorityUpdater();
            }, this._highPriorityFrequency);
            this._lowPriorityInterval = window.setInterval(function () {
                self.lowPriorityUpdater();
            }, this._lowPriorityFrequency);
            this._canvasClockInterval = window.setInterval(function () {
                self.canvasClockUpdater();
            }, this._canvasClockFrequency);
            this.isPlaying = true;
            if (!withoutUpdate) {
                this.synchronizeMedia();
            }
            this.logMessage('PLAY canvas');
        };
        CanvasInstance.prototype.pauseCanvas = function (withoutUpdate) {
            window.clearInterval(this._highPriorityInterval);
            window.clearInterval(this._lowPriorityInterval);
            window.clearInterval(this._canvasClockInterval);
            this.isPlaying = false;
            if (!withoutUpdate) {
                this.highPriorityUpdater();
                this.lowPriorityUpdater();
                this.synchronizeMedia();
            }
            this.logMessage('PAUSE canvas');
        };
        CanvasInstance.prototype.canvasClockUpdater = function () {
            this.canvasClockTime = (Date.now() - this.canvasClockStartDate) / 1000;
            if (this.canvasClockTime >= this.canvasClockDuration) {
                this.canvasClockTime = this.canvasClockDuration;
                this.pauseCanvas();
            }
        };
        CanvasInstance.prototype.highPriorityUpdater = function () {
            if (!this.$playerElement)
                return;
            var $timeLineContainer = this.$playerElement.find('.timelineContainer');
            $timeLineContainer.slider({
                value: this.canvasClockTime
            });
            this.$playerElement.find('.canvasTime').text(IIIFComponents.AVComponentUtils.Utils.formatTime(this.canvasClockTime));
        };
        CanvasInstance.prototype.lowPriorityUpdater = function () {
            this.updateMediaActiveStates();
        };
        CanvasInstance.prototype.updateMediaActiveStates = function () {
            var mediaElement;
            for (var i = 0; i < this._mediaElements.length; i++) {
                mediaElement = this._mediaElements[i];
                if (mediaElement.start <= this.canvasClockTime && mediaElement.end >= this.canvasClockTime) {
                    this.checkMediaSynchronization();
                    if (!mediaElement.active) {
                        this.synchronizeMedia();
                        mediaElement.active = true;
                        mediaElement.element.show();
                        mediaElement.timelineElement.addClass('active');
                    }
                    if (mediaElement.type == 'Video' || mediaElement.type == 'Audio') {
                        if (mediaElement.element[0].currentTime > mediaElement.element[0].duration - mediaElement.endOffset) {
                            mediaElement.element[0].pause();
                        }
                    }
                }
                else {
                    if (mediaElement.active) {
                        mediaElement.active = false;
                        mediaElement.element.hide();
                        mediaElement.timelineElement.removeClass('active');
                        if (mediaElement.type == 'Video' || mediaElement.type == 'Audio') {
                            mediaElement.element[0].pause();
                        }
                    }
                }
            }
            //this.logMessage('UPDATE MEDIA ACTIVE STATES at: '+ this.canvasClockTime + ' seconds.');
        };
        CanvasInstance.prototype.synchronizeMedia = function () {
            var mediaElement;
            for (var i = 0; i < this._mediaElements.length; i++) {
                mediaElement = this._mediaElements[i];
                if (mediaElement.type == 'Video' || mediaElement.type == 'Audio') {
                    mediaElement.element[0].currentTime = this.canvasClockTime - mediaElement.start + mediaElement.startOffset;
                    if (mediaElement.start <= this.canvasClockTime && mediaElement.end >= this.canvasClockTime) {
                        if (this.isPlaying) {
                            if (mediaElement.element[0].paused) {
                                var promise = mediaElement.element[0].play();
                                if (promise) {
                                    promise["catch"](function () { });
                                }
                            }
                        }
                        else {
                            mediaElement.element[0].pause();
                        }
                    }
                    else {
                        mediaElement.element[0].pause();
                    }
                    if (mediaElement.element[0].currentTime > mediaElement.element[0].duration - mediaElement.endOffset) {
                        mediaElement.element[0].pause();
                    }
                }
            }
            this.logMessage('SYNC MEDIA at: ' + this.canvasClockTime + ' seconds.');
        };
        CanvasInstance.prototype.checkMediaSynchronization = function () {
            var mediaElement;
            for (var i = 0, l = this._mediaElements.length; i < l; i++) {
                mediaElement = this._mediaElements[i];
                if ((mediaElement.type == 'Video' || mediaElement.type == 'Audio') &&
                    (mediaElement.start <= this.canvasClockTime && mediaElement.end >= this.canvasClockTime)) {
                    var correctTime = (this.canvasClockTime - mediaElement.start + mediaElement.startOffset);
                    var factualTime = mediaElement.element[0].currentTime;
                    // off by 0.2 seconds
                    if (Math.abs(factualTime - correctTime) > 0.4) {
                        mediaElement.outOfSync = true;
                        //this.playbackStalled(true, mediaElement);
                        var lag = Math.abs(factualTime - correctTime);
                        this.logMessage('DETECTED synchronization lag: ' + Math.abs(lag));
                        mediaElement.element[0].currentTime = correctTime;
                        //this.synchronizeMedia();
                    }
                    else {
                        mediaElement.outOfSync = false;
                        //this.playbackStalled(false, mediaElement);
                    }
                }
            }
        };
        CanvasInstance.prototype.playbackStalled = function (aBoolean, syncMediaRequestingStall) {
            if (aBoolean) {
                if (this.stallRequestedBy.indexOf(syncMediaRequestingStall) < 0) {
                    this.stallRequestedBy.push(syncMediaRequestingStall);
                }
                if (!this.isStalled) {
                    if (this.$playerElement) {
                        this._showWorkingIndicator(this.$playerElement.find('.canvasContainer'));
                    }
                    this.wasPlaying = this.isPlaying;
                    this.pauseCanvas(true);
                    this.isStalled = aBoolean;
                }
            }
            else {
                var idx = this.stallRequestedBy.indexOf(syncMediaRequestingStall);
                if (idx >= 0) {
                    this.stallRequestedBy.splice(idx, 1);
                }
                if (this.stallRequestedBy.length === 0) {
                    this._hideWorkingIndicator();
                    if (this.isStalled && this.wasPlaying) {
                        this.playCanvas(true);
                    }
                    this.isStalled = aBoolean;
                }
            }
        };
        CanvasInstance.prototype._showWorkingIndicator = function ($targetElement) {
            var workingIndicator = $('<div class="workingIndicator">Waiting ...</div>');
            if ($targetElement.find('.workingIndicator').length == 0) {
                $targetElement.append(workingIndicator);
            }
            //console.log('show working');
        };
        CanvasInstance.prototype._hideWorkingIndicator = function () {
            $('.workingIndicator').remove();
            //console.log('hide working');
        };
        return CanvasInstance;
    }());
    IIIFComponents.CanvasInstance = CanvasInstance;
})(IIIFComponents || (IIIFComponents = {}));



var IIIFComponents;
(function (IIIFComponents) {
    var AVComponentUtils;
    (function (AVComponentUtils) {
        var Utils = (function () {
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