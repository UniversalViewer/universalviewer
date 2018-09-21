// iiif-av-component v0.0.82 https://github.com/iiif-commons/iiif-av-component#readme
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
            _this._readyMedia = 0;
            _this._readyWaveforms = 0;
            _this._posterCanvasWidth = 0;
            _this._posterCanvasHeight = 0;
            _this._posterImageExpanded = false;
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
                halveAtWidth: 200,
                limitToRange: false,
                posterImageRatio: 0.3,
                virtualCanvasEnabled: true,
                content: {
                    currentTime: "Current Time",
                    collapse: "Collapse",
                    duration: "Duration",
                    expand: "Expand",
                    mute: "Mute",
                    next: "Next",
                    pause: "Pause",
                    play: "Play",
                    previous: "Previous",
                    unmute: "Unmute"
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
                var nextCanvasInstance_1 = this._getCanvasInstanceById(this._data.canvasId);
                if (nextCanvasInstance_1) {
                    this.canvasInstances.forEach(function (canvasInstance) {
                        // hide canvases that don't have the same id        
                        if (canvasInstance.getCanvasId() !== nextCanvasInstance_1.getCanvasId()) {
                            canvasInstance.set({
                                visible: false
                            });
                        }
                        else {
                            if (diff.includes('range')) {
                                canvasInstance.set({
                                    visible: true,
                                    range: _this._data.range ? jQuery.extend(true, {}, _this._data.range) : undefined
                                });
                            }
                            else {
                                canvasInstance.set({
                                    visible: true
                                });
                            }
                        }
                    });
                }
            }
            if (diff.includes('virtualCanvasEnabled')) {
                this.set({
                    range: undefined
                });
                // as you don't know the id of virtual canvases, you can toggle them on
                // but when toggling off, you must call showCanvas to show the next canvas
                if (this._data.virtualCanvasEnabled) {
                    this.canvasInstances.forEach(function (canvasInstance) {
                        if (canvasInstance.isVirtual()) {
                            _this.set({
                                canvasId: canvasInstance.getCanvasId(),
                                range: undefined
                            });
                        }
                    });
                }
            }
            if (diff.includes('range') && this._data.range) {
                var range = this._data.helper.getRangeById(this._data.range.id);
                if (!range) {
                    console.warn('range not found');
                }
                else {
                    var canvasId = IIIFComponents.AVComponentUtils.Utils.getFirstTargetedCanvasId(range);
                    if (canvasId) {
                        // get canvas by normalised id (without temporal part)
                        var canvasInstance = this._getCanvasInstanceById(canvasId);
                        if (canvasInstance) {
                            if (canvasInstance.isVirtual() && this._data.virtualCanvasEnabled) {
                                if (canvasInstance.includesVirtualSubCanvas(canvasId)) {
                                    canvasId = canvasInstance.getCanvasId();
                                    // use the retargeted range
                                    for (var i = 0; i < canvasInstance.ranges.length; i++) {
                                        var r = canvasInstance.ranges[i];
                                        if (r.id === range.id) {
                                            range = r;
                                            break;
                                        }
                                    }
                                }
                            }
                            // if not using the correct canvasinstance, switch to it                    
                            if (this._data.canvasId &&
                                ((this._data.canvasId.includes('://')) ? Manifesto.Utils.normaliseUrl(this._data.canvasId) : this._data.canvasId) !== canvasId) {
                                this.set({
                                    canvasId: canvasId,
                                    range: jQuery.extend(true, {}, range) // force diff
                                });
                            }
                            else {
                                canvasInstance.set({
                                    range: jQuery.extend(true, {}, range)
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
        AVComponent.prototype.reset = function () {
            this._reset();
        };
        AVComponent.prototype._reset = function () {
            var _this = this;
            this._readyMedia = 0;
            this._readyWaveforms = 0;
            this._posterCanvasWidth = 0;
            this._posterCanvasHeight = 0;
            clearInterval(this._checkAllMediaReadyInterval);
            clearInterval(this._checkAllWaveformsReadyInterval);
            this.canvasInstances.forEach(function (canvasInstance) {
                canvasInstance.destroy();
            });
            this.canvasInstances = [];
            this._$element.empty();
            if (this._data && this._data.helper) {
                // if the manifest has an auto-advance behavior, join the canvases into a single "virtual" canvas
                var behavior = this._data.helper.manifest.getBehavior();
                var canvases = this._getCanvases();
                if (behavior && behavior.toString() === manifesto.Behavior.autoadvance().toString()) {
                    var virtualCanvas_1 = new IIIFComponents.AVComponentObjects.VirtualCanvas();
                    canvases.forEach(function (canvas) {
                        virtualCanvas_1.addCanvas(canvas);
                    });
                    this._initCanvas(virtualCanvas_1);
                }
                // all canvases need to be individually navigable
                canvases.forEach(function (canvas) {
                    _this._initCanvas(canvas);
                });
                if (this.canvasInstances.length > 0) {
                    this._data.canvasId = this.canvasInstances[0].getCanvasId();
                }
                this._checkAllMediaReadyInterval = setInterval(this._checkAllMediaReady.bind(this), 100);
                this._checkAllWaveformsReadyInterval = setInterval(this._checkAllWaveformsReady.bind(this), 100);
                this._$posterContainer = $('<div class="poster-container"></div>');
                this._$element.append(this._$posterContainer);
                this._$posterImage = $('<div class="poster-image"></div>');
                this._$posterExpandButton = $("\n                    <button class=\"btn\" title=\"" + (this._data && this._data.content ? this._data.content.expand : '') + "\">\n                        <i class=\"av-icon  av-icon-expand expand\" aria-hidden=\"true\"></i><span>" + (this._data && this._data.content ? this._data.content.expand : '') + "</span>\n                    </button>\n                ");
                this._$posterImage.append(this._$posterExpandButton);
                this._$posterImage.on('touchstart click', function (e) {
                    e.preventDefault();
                    var target = _this._getPosterImageCss(!_this._posterImageExpanded);
                    //this._$posterImage.animate(target,"fast", "easein");
                    _this._$posterImage.animate(target);
                    _this._posterImageExpanded = !_this._posterImageExpanded;
                    if (_this._posterImageExpanded) {
                        var label = _this.options.data.content.collapse;
                        _this._$posterExpandButton.prop('title', label);
                        _this._$posterExpandButton.find('i').switchClass('expand', 'collapse');
                    }
                    else {
                        var label = _this.options.data.content.expand;
                        _this._$posterExpandButton.prop('title', label);
                        _this._$posterExpandButton.find('i').switchClass('collapse', 'expand');
                    }
                });
                // poster canvas
                var posterCanvas = this._data.helper.getPosterCanvas();
                if (posterCanvas) {
                    this._posterCanvasWidth = posterCanvas.getWidth();
                    this._posterCanvasHeight = posterCanvas.getHeight();
                    var posterImage = this._data.helper.getPosterImage();
                    if (posterImage) {
                        this._$posterContainer.append(this._$posterImage);
                        var css = this._getPosterImageCss(this._posterImageExpanded);
                        css = Object.assign({}, css, {
                            'background-image': 'url(' + posterImage + ')'
                        });
                        this._$posterImage.css(css);
                    }
                }
            }
        };
        AVComponent.prototype._checkAllMediaReady = function () {
            console.log('loading media');
            if (this._readyMedia === this.canvasInstances.length) {
                console.log('all media ready');
                clearInterval(this._checkAllMediaReadyInterval);
                //that._logMessage('CREATED CANVAS: ' + canvasInstance.canvasClockDuration + ' seconds, ' + canvasInstance.canvasWidth + ' x ' + canvasInstance.canvasHeight + ' px.');
                this.fire(AVComponent.Events.MEDIA_READY);
                this.resize();
            }
        };
        AVComponent.prototype._checkAllWaveformsReady = function () {
            console.log('loading waveforms');
            if (this._readyWaveforms === this._getCanvasInstancesWithWaveforms().length) {
                console.log('waveforms ready');
                clearInterval(this._checkAllWaveformsReadyInterval);
                this.fire(AVComponent.Events.WAVEFORMS_READY);
                this.resize();
            }
        };
        AVComponent.prototype._getCanvasInstancesWithWaveforms = function () {
            return this.canvasInstances.filter(function (c) {
                return c.waveforms.length > 0;
            });
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
            canvasInstance.isOnlyCanvasInstance = this._getCanvases().length === 1;
            this._$element.append(canvasInstance.$playerElement);
            canvasInstance.init();
            this.canvasInstances.push(canvasInstance);
            canvasInstance.on(AVComponent.Events.MEDIA_READY, function () {
                _this._readyMedia++;
            }, false);
            canvasInstance.on(AVComponent.Events.WAVEFORM_READY, function () {
                _this._readyWaveforms++;
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
        AVComponent.prototype._getNormaliseCanvasId = function (canvasId) {
            return (canvasId.includes('://')) ? Manifesto.Utils.normaliseUrl(canvasId) : canvasId;
        };
        AVComponent.prototype._getCanvasInstanceById = function (canvasId) {
            canvasId = this._getNormaliseCanvasId(canvasId);
            // if virtual canvas is enabled, check for that first
            if (this._data.virtualCanvasEnabled) {
                for (var i = 0; i < this.canvasInstances.length; i++) {
                    var canvasInstance = this.canvasInstances[i];
                    var currentCanvasId = canvasInstance.getCanvasId();
                    if (currentCanvasId) {
                        currentCanvasId = this._getNormaliseCanvasId(currentCanvasId);
                        if ((canvasInstance.isVirtual() || this.canvasInstances.length === 1) && currentCanvasId === canvasId ||
                            canvasInstance.includesVirtualSubCanvas(canvasId)) {
                            return canvasInstance;
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < this.canvasInstances.length; i++) {
                    var canvasInstance = this.canvasInstances[i];
                    var id = canvasInstance.getCanvasId();
                    if (id) {
                        var canvasInstanceId = Manifesto.Utils.normaliseUrl(id);
                        if (canvasInstanceId === canvasId) {
                            return canvasInstance;
                        }
                    }
                }
            }
            return undefined;
        };
        AVComponent.prototype._getCurrentCanvas = function () {
            if (this._data.canvasId) {
                return this._getCanvasInstanceById(this._data.canvasId);
            }
            return undefined;
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
        AVComponent.prototype.play = function () {
            var currentCanvas = this._getCurrentCanvas();
            if (currentCanvas) {
                currentCanvas.play();
            }
        };
        AVComponent.prototype.pause = function () {
            var currentCanvas = this._getCurrentCanvas();
            if (currentCanvas) {
                currentCanvas.pause();
            }
        };
        AVComponent.prototype.playRange = function (rangeId) {
            if (!this._data.helper) {
                return;
            }
            var range = this._data.helper.getRangeById(rangeId);
            if (range) {
                this.set({
                    range: jQuery.extend(true, {}, range)
                });
            }
        };
        AVComponent.prototype.showCanvas = function (canvasId) {
            // if the passed canvas id is already the current canvas id, but the canvas isn't visible
            // (switching from virtual canvas)
            var currentCanvas = this._getCurrentCanvas();
            if (currentCanvas && currentCanvas.getCanvasId() === canvasId && !currentCanvas.isVisible()) {
                currentCanvas.set({
                    visible: true
                });
            }
            else {
                this.set({
                    canvasId: canvasId
                });
            }
        };
        AVComponent.prototype._logMessage = function (message) {
            this.fire(AVComponent.Events.LOG, message);
        };
        AVComponent.prototype._getPosterImageCss = function (expanded) {
            var currentCanvas = this._getCurrentCanvas();
            if (currentCanvas) {
                var $options = currentCanvas.$playerElement.find('.options-container');
                var containerWidth = currentCanvas.$playerElement.parent().width();
                var containerHeight = currentCanvas.$playerElement.parent().height() - $options.height();
                if (expanded) {
                    return {
                        'top': 0,
                        'left': 0,
                        'width': containerWidth,
                        'height': containerHeight
                    };
                }
                else {
                    // get the longer edge of the poster canvas and make that a ratio of the container height/width.
                    // scale the shorter edge proportionally.
                    var ratio = void 0;
                    var width = void 0;
                    var height = void 0;
                    if (this._posterCanvasWidth > this._posterCanvasHeight) {
                        ratio = this._posterCanvasHeight / this._posterCanvasWidth;
                        width = containerWidth * this._data.posterImageRatio;
                        height = width * ratio;
                    }
                    else {
                        ratio = this._posterCanvasWidth / this._posterCanvasHeight;
                        height = containerHeight * this._data.posterImageRatio;
                        width = height * ratio;
                    }
                    return {
                        'top': 0,
                        'left': containerWidth - width,
                        'width': width,
                        'height': height
                    };
                }
            }
            return null;
        };
        AVComponent.prototype.resize = function () {
            this.canvasInstances.forEach(function (canvasInstance) {
                canvasInstance.resize();
            });
            // get the visible player and align the poster to it
            var currentCanvas = this._getCurrentCanvas();
            if (currentCanvas) {
                if (this._$posterImage && this._$posterImage.is(':visible')) {
                    if (this._posterImageExpanded) {
                        this._$posterImage.css(this._getPosterImageCss(true));
                    }
                    else {
                        this._$posterImage.css(this._getPosterImageCss(false));
                    }
                    // this._$posterExpandButton.css({
                    //     top: <number>this._$posterImage.height() - <number>this._$posterExpandButton.outerHeight()
                    // });
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
        var Events = /** @class */ (function () {
            function Events() {
            }
            Events.MEDIA_READY = 'mediaready';
            Events.LOG = 'log';
            Events.RANGE_CHANGED = 'rangechanged';
            Events.WAVEFORM_READY = 'waveformready';
            Events.WAVEFORMS_READY = 'waveformsready';
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
            this._$volumeMute = $("\n                                <button class=\"btn volume-mute\" title=\"" + this.options.data.content.mute + "\">\n                                    <i class=\"av-icon av-icon-mute on\" aria-hidden=\"true\"></i>" + this.options.data.content.mute + "\n                                </button>");
            this._$volumeSlider = $('<div class="volume-slider"></div>');
            this._$element.append(this._$volumeMute, this._$volumeSlider);
            var that = this;
            this._$volumeMute.on('touchstart click', function (e) {
                e.preventDefault();
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
                _this.fire(AVVolumeControl.Events.VOLUME_CHANGED, _this._data.volume);
            });
            this._$volumeSlider.slider({
                value: that._data.volume,
                step: 0.1,
                orientation: "horizontal",
                range: "min",
                min: 0,
                max: 1,
                animate: false,
                create: function (evt, ui) {
                },
                slide: function (evt, ui) {
                    // start reducer
                    that._data.volume = ui.value;
                    if (that._data.volume === 0) {
                        that._lastVolume = 0;
                    }
                    // end reducer
                    that.fire(AVVolumeControl.Events.VOLUME_CHANGED, that._data.volume);
                },
                stop: function (evt, ui) {
                }
            });
            return success;
        };
        AVVolumeControl.prototype.set = function (data) {
            this._data = Object.assign(this._data, data);
            this._render();
        };
        AVVolumeControl.prototype._render = function () {
            if (this._data.volume !== undefined) {
                this._$volumeSlider.slider({
                    value: this._data.volume
                });
                if (this._data.volume === 0) {
                    var label = this.options.data.content.unmute;
                    this._$volumeMute.prop('title', label);
                    this._$volumeMute.find('i').switchClass('on', 'off');
                }
                else {
                    var label = this.options.data.content.mute;
                    this._$volumeMute.prop('title', label);
                    this._$volumeMute.find('i').switchClass('off', 'on');
                }
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
            _this._rangeSpanPadding = 0.25;
            _this._readyMediaCount = 0;
            _this._stallRequestedBy = []; //todo: type
            _this._wasPlaying = false;
            //private _waveformNeedsRedraw: boolean = true;
            _this.ranges = [];
            _this.waveforms = [];
            _this.isOnlyCanvasInstance = false;
            _this._scaleY = function (amplitude, height) {
                var range = 256;
                return Math.max(_this._data.waveformBarWidth, (amplitude * height / range));
            };
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
            this._$prevButton = $("\n                                <button class=\"btn\" title=\"" + this._data.content.previous + "\">\n                                    <i class=\"av-icon av-icon-previous\" aria-hidden=\"true\"></i>" + this._data.content.previous + "\n                                </button>");
            this._$playButton = $("\n                                <button class=\"btn\" title=\"" + this._data.content.play + "\">\n                                    <i class=\"av-icon av-icon-play play\" aria-hidden=\"true\"></i>" + this._data.content.play + "\n                                </button>");
            this._$nextButton = $("\n                                <button class=\"btn\" title=\"" + this._data.content.next + "\">\n                                    <i class=\"av-icon av-icon-next\" aria-hidden=\"true\"></i>" + this._data.content.next + "\n                                </button>");
            this._$timeDisplay = $('<div class="time-display"><span class="canvas-time"></span> / <span class="canvas-duration"></span></div>');
            this._$canvasTime = this._$timeDisplay.find('.canvas-time');
            this._$canvasDuration = this._$timeDisplay.find('.canvas-duration');
            if (this.isVirtual()) {
                this.$playerElement.addClass('virtual');
            }
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
                            var clonedRanges_1 = [];
                            // shift the range targets forward by the duration of their previous canvases
                            r.forEach(function (range) {
                                var clonedRange = jQuery.extend(true, {}, range);
                                clonedRanges_1.push(clonedRange);
                                if (clonedRange.canvases && clonedRange.canvases.length) {
                                    for (var i = 0; i < clonedRange.canvases.length; i++) {
                                        clonedRange.canvases[i] = IIIFComponents.AVComponentUtils.Utils.retargetTemporalComponent(_this._data.canvas.canvases, clonedRange.__jsonld.items[i].id);
                                    }
                                }
                            });
                            ranges_1.push.apply(ranges_1, clonedRanges_1);
                        }
                    });
                }
                else {
                    ranges_1 = ranges_1.concat(this._data.helper.getCanvasRanges(this._data.canvas));
                }
                ranges_1.forEach(function (range) {
                    _this.ranges.push(range);
                });
            }
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
            this._$prevButton.on('touchstart click', function (e) {
                e.preventDefault();
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
            this._$playButton.on('touchstart click', function (e) {
                e.preventDefault();
                if (_this._isPlaying) {
                    _this.pause();
                }
                else {
                    _this.play();
                }
            });
            this._$nextButton.on('touchstart click', function (e) {
                e.preventDefault();
                _this._next();
            });
            this._$canvasTimelineContainer.slider({
                value: 0,
                step: 0.01,
                orientation: "horizontal",
                range: "min",
                max: that._getDuration(),
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
                _this._updateHoverPreview(e, _this._$canvasTimelineContainer, _this._getDuration());
            });
            this._$rangeTimelineContainer.on("mousemove", function (e) {
                if (_this._data.range) {
                    var duration = _this._data.range.getDuration();
                    _this._updateHoverPreview(e, _this._$rangeTimelineContainer, duration ? duration.getLength() : 0);
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
                var body = this._getBody(bodies);
                if (!body) {
                    // if no suitable format was found for the current browser, skip this item.
                    console.warn('unable to find suitable format for', item.id);
                    continue;
                }
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
                var t = Manifesto.Utils.getTemporalComponent(target);
                if (!xywh) {
                    xywh = [0, 0, this._canvasWidth, this._canvasHeight];
                }
                if (!t) {
                    t = [0, this._getDuration()];
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
                    'active': false,
                    'end': endTime,
                    'endOffset': offsetEnd,
                    'format': format,
                    'height': percentageHeight,
                    'left': percentageLeft,
                    'source': mediaSource,
                    'start': startTime,
                    'startOffset': offsetStart,
                    'top': percentageTop,
                    'type': type,
                    'width': percentageWidth
                };
                this._renderMediaElement(itemData);
                // waveform
                // todo: create annotation.getSeeAlso
                var seeAlso = item.getProperty('seeAlso');
                if (seeAlso && seeAlso.length) {
                    var dat = seeAlso[0].id;
                    this.waveforms.push(dat);
                }
            }
            this._renderWaveform();
        };
        CanvasInstance.prototype._getBody = function (bodies) {
            // if there's an HLS format and HLS is supported in this browser
            for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                var format = body.getFormat();
                if (format) {
                    if (IIIFComponents.AVComponentUtils.Utils.isHLSFormat(format) && IIIFComponents.AVComponentUtils.Utils.canPlayHls()) {
                        return body;
                    }
                }
            }
            // if there's a Dash format and the browser isn't Safari
            for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                var format = body.getFormat();
                if (format) {
                    if (IIIFComponents.AVComponentUtils.Utils.isMpegDashFormat(format) && !IIIFComponents.AVComponentUtils.Utils.isSafari()) {
                        return body;
                    }
                }
            }
            // otherwise, return the first format that isn't HLS or Dash
            for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                var format = body.getFormat();
                if (format) {
                    if (!IIIFComponents.AVComponentUtils.Utils.isHLSFormat(format) && !IIIFComponents.AVComponentUtils.Utils.isMpegDashFormat(format)) {
                        return body;
                    }
                }
            }
            // couldn't find a suitable format
            return null;
        };
        CanvasInstance.prototype._getDuration = function () {
            if (this._data && this._data.canvas) {
                return this._data.canvas.getDuration();
            }
            return 0;
        };
        CanvasInstance.prototype.data = function () {
            return {
                waveformColor: "#fff",
                waveformBarSpacing: 4,
                waveformBarWidth: 2,
                volume: 1
            };
        };
        CanvasInstance.prototype.isVirtual = function () {
            return this._data.canvas instanceof IIIFComponents.AVComponentObjects.VirtualCanvas;
        };
        CanvasInstance.prototype.isVisible = function () {
            return !!this._data.visible;
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
            var _this = this;
            var oldData = Object.assign({}, this._data);
            this._data = Object.assign(this._data, data);
            var diff = IIIFComponents.AVComponentUtils.Utils.diff(oldData, this._data);
            if (diff.includes('visible')) {
                if (this._data.canvas) {
                    if (this._data.visible) {
                        this._rewind();
                        this.$playerElement.show();
                        //console.log('show ' + this._data.canvas.id);
                    }
                    else {
                        this.$playerElement.hide();
                        this.pause();
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
                    else {
                        var duration = this._data.range.getDuration();
                        if (duration) {
                            if (!this._data.range.autoChanged) {
                                this._setCurrentTime(duration.start);
                            }
                            if (this._data.autoPlay) {
                                this.play();
                            }
                            this.fire(IIIFComponents.AVComponent.Events.RANGE_CHANGED, this._data.range.id);
                        }
                    }
                }
            }
            if (diff.includes('volume')) {
                this._contentAnnotations.forEach(function ($mediaElement) {
                    $($mediaElement.element).prop('volume', _this._data.volume);
                    _this._volume.set({
                        volume: _this._data.volume
                    });
                });
            }
            else {
                this._render();
            }
            if (diff.includes('limitToRange')) {
                this._render();
            }
        };
        CanvasInstance.prototype._hasRangeChanged = function () {
            var range = this._getRangeForCurrentTime();
            if (range && !this._data.limitToRange && (!this._data.range || (this._data.range && range.id !== this._data.range.id))) {
                this.set({
                    range: jQuery.extend(true, { autoChanged: true }, range)
                });
            }
        };
        CanvasInstance.prototype._getRangeForCurrentTime = function (parentRange) {
            var ranges;
            if (!parentRange) {
                ranges = this.ranges;
            }
            else {
                ranges = parentRange.getRanges();
            }
            for (var i = 0; i < ranges.length; i++) {
                var range = ranges[i];
                // if the range spans the current time, and is navigable, return it.
                // otherwise, try to find a navigable child range.
                if (this._rangeSpansCurrentTime(range)) {
                    if (this._rangeNavigable(range)) {
                        return range;
                    }
                    var childRanges = range.getRanges();
                    // if a child range spans the current time, recurse into it
                    for (var i_1 = 0; i_1 < childRanges.length; i_1++) {
                        var childRange = childRanges[i_1];
                        if (this._rangeSpansCurrentTime(childRange)) {
                            return this._getRangeForCurrentTime(childRange);
                        }
                    }
                    // this range isn't navigable, and couldn't find a navigable child range.
                    // therefore return the parent range (if any).
                    return range.parentRange;
                }
            }
            return undefined;
        };
        CanvasInstance.prototype._rangeSpansCurrentTime = function (range) {
            if (range.spansTime(Math.ceil(this._canvasClockTime) + this._rangeSpanPadding)) {
                return true;
            }
            return false;
        };
        CanvasInstance.prototype._rangeNavigable = function (range) {
            var behavior = range.getBehavior();
            if (behavior && behavior.toString() === manifesto.Behavior.nonav().toString()) {
                return false;
            }
            return true;
        };
        CanvasInstance.prototype._render = function () {
            if (this._data.range) {
                var duration = this._data.range.getDuration();
                if (duration) {
                    // get the total length in seconds.
                    var totalLength = this._getDuration();
                    // get the length of the timeline container
                    var timelineLength = this._$canvasTimelineContainer.width();
                    // get the ratio of seconds to length
                    var ratio = timelineLength / totalLength;
                    var start = duration.start * ratio;
                    var end = duration.end * ratio;
                    // if the end is on the next canvas
                    if (end > totalLength || end < start) {
                        end = totalLength;
                    }
                    var width = end - start;
                    //console.log(width);
                    if (this.isVirtual() || this.isOnlyCanvasInstance) {
                        this._$durationHighlight.show();
                        // set the start position and width
                        this._$durationHighlight.css({
                            left: start,
                            width: width
                        });
                    }
                    else {
                        this._$durationHighlight.hide();
                    }
                    var that_1 = this;
                    // try to destroy existing rangeTimelineContainer
                    if (this._$rangeTimelineContainer.data("ui-sortable")) {
                        this._$rangeTimelineContainer.slider("destroy");
                    }
                    this._$rangeTimelineContainer.slider({
                        value: duration.start,
                        step: 0.01,
                        orientation: "horizontal",
                        range: "min",
                        min: duration.start,
                        max: duration.end,
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
            }
            else {
                this._$durationHighlight.hide();
            }
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
            this._drawWaveform();
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
            var media = $mediaElement[0];
            if (data.format && data.format.toString() === 'application/dash+xml') {
                // dash
                $mediaElement.attr('data-dashjs-player', '');
                var player = dashjs.MediaPlayer().create();
                player.getDebug().setLogToBrowserConsole(false);
                if (this._data.adaptiveAuthEnabled) {
                    player.setXHRWithCredentialsForType('MPD', true); // send cookies
                }
                player.initialize(media, data.source);
            }
            else if (data.format && data.format.toString() === 'application/vnd.apple.mpegurl') {
                // hls
                if (Hls.isSupported()) {
                    var hls = new Hls();
                    if (this._data.adaptiveAuthEnabled) {
                        hls = new Hls({
                            xhrSetup: function (xhr) {
                                xhr.withCredentials = true; // send cookies
                            }
                        });
                    }
                    else {
                        hls = new Hls();
                    }
                    if (this._data.adaptiveAuthEnabled) {
                    }
                    hls.loadSource(data.source);
                    hls.attachMedia(media);
                    //hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    //media.play();
                    //});
                }
                else if (media.canPlayType('application/vnd.apple.mpegurl')) {
                    media.src = data.source;
                    //media.addEventListener('canplay', function () {
                    //media.play();
                    //});
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
                    //data.checkForStall();
                });
                $mediaElement.on('waiting', function () {
                    //console.log('waiting');
                    //data.checkForStall();
                });
                $mediaElement.on('seeking', function () {
                    //console.log('seeking');
                    //data.checkForStall();
                });
                $mediaElement.on('loadedmetadata', function () {
                    _this._readyMediaCount++;
                    if (_this._readyMediaCount === _this._contentAnnotations.length) {
                        //if (!this._data.range) {
                        _this._setCurrentTime(0);
                        //}                        
                        if (_this._data.autoPlay) {
                            _this.play();
                        }
                        _this._updateDurationDisplay();
                        _this.fire(IIIFComponents.AVComponent.Events.MEDIA_READY);
                    }
                });
                $mediaElement.attr('preload', 'auto');
                $mediaElement.get(0).load();
            }
            this._renderSyncIndicator(data);
        };
        CanvasInstance.prototype._getWaveformData = function (url) {
            // return new Promise(function (resolve, reject) {
            //     const xhr = new XMLHttpRequest();
            //     xhr.responseType = 'arraybuffer';
            //     xhr.open('GET', url);
            //     xhr.addEventListener('load', (progressEvent: any) => {
            //         if (xhr.status == 200) {
            //             resolve(WaveformData.create(progressEvent.target.response));
            //         } else {
            //             reject(new Error(xhr.statusText));
            //         }
            //     });
            //     xhr.onerror = function () {
            //         reject(new Error("Network Error"));
            //     };
            //     xhr.send();
            // });
            // must use this for IE11
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'binary',
                    responseType: 'arraybuffer',
                    processData: false
                }).done(function (data) {
                    resolve(WaveformData.create(data));
                }).fail(function (err) {
                    reject(new Error('Network Error'));
                });
            });
        };
        CanvasInstance.prototype._renderWaveform = function () {
            var _this = this;
            if (!this.waveforms.length)
                return;
            var promises = this.waveforms.map(function (url) {
                return _this._getWaveformData(url);
            });
            Promise.all(promises).then(function (waveforms) {
                _this._waveformCanvas = document.createElement('canvas');
                _this._waveformCanvas.classList.add('waveform');
                _this._$canvasContainer.append(_this._waveformCanvas);
                _this._waveformCtx = _this._waveformCanvas.getContext('2d');
                if (_this._waveformCtx) {
                    _this._waveformCtx.fillStyle = _this._data.waveformColor;
                    _this._compositeWaveform = new IIIFComponents.AVComponentObjects.CompositeWaveform(waveforms);
                    //this._resize();
                    _this.fire(IIIFComponents.AVComponent.Events.WAVEFORM_READY);
                }
            });
        };
        CanvasInstance.prototype._drawWaveform = function () {
            //if (!this._waveformCtx || !this._waveformNeedsRedraw) return;
            if (!this._waveformCtx)
                return;
            var duration;
            var start = 0;
            var end = this._compositeWaveform.duration;
            if (this._data.range) {
                duration = this._data.range.getDuration();
            }
            if (this._data.limitToRange && duration) {
                start = duration.start;
                end = duration.end;
            }
            var startpx = start * this._compositeWaveform.pixelsPerSecond;
            var endpx = end * this._compositeWaveform.pixelsPerSecond;
            var canvasWidth = this._waveformCtx.canvas.width;
            var canvasHeight = this._waveformCtx.canvas.height;
            var barSpacing = this._data.waveformBarSpacing;
            var barWidth = this._data.waveformBarWidth;
            var increment = Math.floor(((endpx - startpx) / canvasWidth) * barSpacing);
            var sampleSpacing = (canvasWidth / barSpacing);
            this._waveformCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            this._waveformCtx.fillStyle = this._data.waveformColor;
            for (var x = startpx; x < endpx; x += increment) {
                var maxMin = this._getWaveformMaxAndMin(this._compositeWaveform, x, sampleSpacing);
                var height = this._scaleY(maxMin.max - maxMin.min, canvasHeight);
                var ypos = (canvasHeight - height) / 2;
                var xpos = canvasWidth * IIIFComponents.AVComponentUtils.Utils.normalise(x, startpx, endpx);
                this._waveformCtx.fillRect(xpos, ypos, barWidth, height);
            }
        };
        CanvasInstance.prototype._getWaveformMaxAndMin = function (waveform, index, sampleSpacing) {
            var max = -127;
            var min = 128;
            for (var x = index; x < index + sampleSpacing; x++) {
                if (waveform.max(x) > max) {
                    max = waveform.max(x);
                }
                if (waveform.min(x) < min) {
                    min = waveform.min(x);
                }
            }
            return { max: max, min: min };
        };
        CanvasInstance.prototype._updateCurrentTimeDisplay = function () {
            var duration;
            if (this._data.range) {
                duration = this._data.range.getDuration();
            }
            if (this._data.limitToRange && duration) {
                var rangeClockTime = this._canvasClockTime - duration.start;
                this._$canvasTime.text(IIIFComponents.AVComponentUtils.Utils.formatTime(rangeClockTime));
            }
            else {
                this._$canvasTime.text(IIIFComponents.AVComponentUtils.Utils.formatTime(this._canvasClockTime));
            }
        };
        CanvasInstance.prototype._updateDurationDisplay = function () {
            var duration;
            if (this._data.range) {
                duration = this._data.range.getDuration();
            }
            if (this._data.limitToRange && duration) {
                this._$canvasDuration.text(IIIFComponents.AVComponentUtils.Utils.formatTime(duration.getLength()));
            }
            else {
                this._$canvasDuration.text(IIIFComponents.AVComponentUtils.Utils.formatTime(this._getDuration()));
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
            var leftPercent = this._convertToPercentage(mediaElementData.start, this._getDuration());
            var widthPercent = this._convertToPercentage(mediaElementData.end - mediaElementData.start, this._getDuration());
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
        CanvasInstance.prototype._rewind = function (withoutUpdate) {
            this.pause();
            var duration;
            if (this._data.range) {
                duration = this._data.range.getDuration();
            }
            if (this._data.limitToRange && duration) {
                this._canvasClockTime = duration.start;
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
        };
        CanvasInstance.prototype._fastforward = function () {
            var duration;
            if (this._data.range) {
                duration = this._data.range.getDuration();
            }
            if (this._data.limitToRange && duration) {
                this._canvasClockTime = duration.end;
            }
            else {
                this._canvasClockTime = this._getDuration();
            }
            this.pause();
        };
        // todo: can this be part of the _data state?
        // this._data.play = true?
        CanvasInstance.prototype.play = function (withoutUpdate) {
            //console.log('playing ', this.getCanvasId());
            var _this = this;
            if (this._isPlaying)
                return;
            var duration;
            if (this._data.range) {
                duration = this._data.range.getDuration();
            }
            if (this._data.limitToRange && duration && this._canvasClockTime >= duration.end) {
                this._canvasClockTime = duration.start;
            }
            if (this._canvasClockTime === this._getDuration()) {
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
            var label = (this._data && this._data.content) ? this._data.content.pause : '';
            this._$playButton.prop('title', label);
            this._$playButton.find('i').switchClass('play', 'pause');
            this.fire(IIIFComponents.AVComponentCanvasInstance.Events.PLAYCANVAS);
            this.logMessage('PLAY canvas');
        };
        // todo: can this be part of the _data state?
        // this._data.play = false?
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
            var label = (this._data && this._data.content) ? this._data.content.play : '';
            this._$playButton.prop('title', label);
            this._$playButton.find('i').switchClass('pause', 'play');
            this.fire(IIIFComponents.AVComponentCanvasInstance.Events.PAUSECANVAS);
            this.logMessage('PAUSE canvas');
        };
        CanvasInstance.prototype._isNavigationConstrainedToRange = function () {
            return this._data.constrainNavigationToRange;
        };
        CanvasInstance.prototype._canvasClockUpdater = function () {
            this._canvasClockTime = (Date.now() - this._canvasClockStartDate) / 1000;
            var duration;
            if (this._data.range) {
                duration = this._data.range.getDuration();
            }
            if (this._data.limitToRange && duration && this._canvasClockTime >= duration.end) {
                this.pause();
            }
            if (this._canvasClockTime >= this._getDuration()) {
                this._canvasClockTime = this._getDuration();
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
            if (this._isPlaying && this._data.autoSelectRange && this.isVirtual()) {
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
            media.pause();
            // const playPromise = media.play();
            // if (playPromise !== undefined) {
            //     playPromise.then(_ => {
            //         // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
            //         media.pause();
            //     });
            // } else {
            //     media.pause();
            // }
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
                    //this._hideWorkingIndicator();
                    if (this._isStalled && this._wasPlaying) {
                        this.play(true);
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
                    // if in the watch metric, make sure the canvasContainer isn't more than half the height to allow
                    // room between buttons
                    if (this._data.halveAtWidth !== undefined && this.$playerElement.parent().width() < this._data.halveAtWidth) {
                        this._$canvasContainer.height(this.$playerElement.parent().height() / 2);
                    }
                    else {
                        this._$canvasContainer.height(this.$playerElement.parent().height() - $options.height());
                    }
                }
                if (this._waveformCanvas) {
                    var canvasWidth = this._$canvasContainer.width();
                    var canvasHeight = this._$canvasContainer.height();
                    //if (canvasWidth !== this._lastCanvasWidth || canvasHeight !== this._lastCanvasHeight) {
                    this._waveformCanvas.width = this._lastCanvasWidth = canvasWidth;
                    this._waveformCanvas.height = this._lastCanvasHeight = canvasHeight;
                    //     this._waveformNeedsRedraw = true;
                    // } else {
                    //     this._waveformNeedsRedraw = false;
                    // }
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
        var CompositeWaveform = /** @class */ (function () {
            function CompositeWaveform(waveforms) {
                var _this = this;
                this.length = 0;
                this.duration = 0;
                this.pixelsPerSecond = Number.MAX_VALUE;
                this.secondsPerPixel = Number.MAX_VALUE;
                this._waveforms = [];
                waveforms.forEach(function (waveform) {
                    _this._waveforms.push({
                        start: _this.length,
                        end: _this.length + waveform.adapter.length,
                        waveform: waveform
                    });
                    _this.length += waveform.adapter.length;
                    _this.duration += waveform.duration;
                    _this.pixelsPerSecond = Math.min(_this.pixelsPerSecond, waveform.pixels_per_second);
                    _this.secondsPerPixel = Math.min(_this.secondsPerPixel, waveform.seconds_per_pixel);
                });
            }
            // Note: these could be optimised, assuming access is sequential
            CompositeWaveform.prototype.min = function (index) {
                var waveform = this._find(index);
                return waveform ? waveform.waveform.min_sample(index - waveform.start) : 0;
            };
            CompositeWaveform.prototype.max = function (index) {
                var waveform = this._find(index);
                return waveform ? waveform.waveform.max_sample(index - waveform.start) : 0;
            };
            CompositeWaveform.prototype._find = function (index) {
                var waveforms = this._waveforms.filter(function (waveform) {
                    return index >= waveform.start && index < waveform.end;
                });
                return waveforms.length > 0 ? waveforms[0] : null;
            };
            return CompositeWaveform;
        }());
        AVComponentObjects.CompositeWaveform = CompositeWaveform;
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
            Utils.getFirstTargetedCanvasId = function (range) {
                var canvasId;
                if (range.canvases && range.canvases.length) {
                    canvasId = range.canvases[0];
                }
                else {
                    var childRanges = range.getRanges();
                    if (childRanges.length) {
                        return Utils.getFirstTargetedCanvasId(childRanges[0]);
                    }
                }
                if (canvasId !== undefined) {
                    return Manifesto.Utils.normaliseUrl(canvasId);
                }
                return undefined;
            };
            Utils.getTimestamp = function () {
                return String(new Date().valueOf());
            };
            Utils.retargetTemporalComponent = function (canvases, target) {
                var t = Manifesto.Utils.getTemporalComponent(target);
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
            Utils.isIE = function () {
                var ua = window.navigator.userAgent;
                // Test values; Uncomment to check result …
                // IE 10
                // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
                // IE 11
                // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
                // Edge 12 (Spartan)
                // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
                // Edge 13
                // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';
                var msie = ua.indexOf('MSIE ');
                if (msie > 0) {
                    // IE 10 or older => return version number
                    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
                }
                var trident = ua.indexOf('Trident/');
                if (trident > 0) {
                    // IE 11 => return version number
                    var rv = ua.indexOf('rv:');
                    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
                }
                var edge = ua.indexOf('Edge/');
                if (edge > 0) {
                    // Edge (IE 12+) => return version number
                    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
                }
                // other browser
                return false;
            };
            Utils.isSafari = function () {
                // https://stackoverflow.com/questions/7944460/detect-safari-browser?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
                var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                console.log('isSafari', isSafari);
                return isSafari;
            };
            Utils.debounce = function (fn, debounceDuration) {
                // summary:
                //      Returns a debounced function that will make sure the given
                //      function is not triggered too much.
                // fn: Function
                //      Function to debounce.
                // debounceDuration: Number
                //      OPTIONAL. The amount of time in milliseconds for which we
                //      will debounce the function. (defaults to 100ms)
                debounceDuration = debounceDuration || 100;
                return function () {
                    if (!fn.debouncing) {
                        var args = Array.prototype.slice.apply(arguments);
                        fn.lastReturnVal = fn.apply(window, args);
                        fn.debouncing = true;
                    }
                    clearTimeout(fn.debounceTimeout);
                    fn.debounceTimeout = setTimeout(function () {
                        fn.debouncing = false;
                    }, debounceDuration);
                    return fn.lastReturnVal;
                };
            };
            Utils.normalise = function (num, min, max) {
                return (num - min) / (max - min);
            };
            Utils.isHLSFormat = function (format) {
                return this.hlsMimeTypes.includes(format.toString());
            };
            Utils.isMpegDashFormat = function (format) {
                return format.toString() === 'application/dash+xml';
            };
            Utils.canPlayHls = function () {
                var doc = typeof document === 'object' && document, videoelem = doc && doc.createElement('video'), isvideosupport = Boolean(videoelem && videoelem.canPlayType);
                return isvideosupport && this.hlsMimeTypes.some(function (canItPlay) {
                    return /maybe|probably/i.test(videoelem.canPlayType(canItPlay));
                });
            };
            Utils.hlsMimeTypes = [
                // Apple santioned
                'application/vnd.apple.mpegurl',
                'vnd.apple.mpegurl',
                // Apple sanctioned for backwards compatibility
                'audio/mpegurl',
                // Very common
                'audio/x-mpegurl',
                // Very common
                'application/x-mpegurl',
                // Included for completeness
                'video/x-mpegurl',
                'video/mpegurl',
                'application/mpegurl'
            ];
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
                this.id = IIIFComponents.AVComponentUtils.Utils.getTimestamp();
            }
            VirtualCanvas.prototype.addCanvas = function (canvas) {
                // canvases need to be deep copied including functions
                this.canvases.push(jQuery.extend(true, {}, canvas));
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
                            var t = Manifesto.Utils.getTemporalComponent(target);
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

var IIIFComponents;
(function (IIIFComponents) {
    var AVComponentObjects;
    (function (AVComponentObjects) {
        var Waveform = /** @class */ (function () {
            function Waveform() {
            }
            return Waveform;
        }());
        AVComponentObjects.Waveform = Waveform;
    })(AVComponentObjects = IIIFComponents.AVComponentObjects || (IIIFComponents.AVComponentObjects = {}));
})(IIIFComponents || (IIIFComponents = {}));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
