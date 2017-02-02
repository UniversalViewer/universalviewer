// iiif-gallery-component v1.0.6 https://github.com/viewdir/iiif-gallery-component#readme
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.iiifGalleryComponent = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IIIFComponents;
(function (IIIFComponents) {
    var GalleryComponent = (function (_super) {
        __extends(GalleryComponent, _super);
        function GalleryComponent(options) {
            _super.call(this, options);
            this._scrollStopDuration = 100;
            this._init();
            this._resize();
        }
        GalleryComponent.prototype._init = function () {
            var _this = this;
            var success = _super.prototype._init.call(this);
            if (!success) {
                console.error("Component failed to initialise");
            }
            this._$header = $('<div class="header"></div>');
            this._$element.append(this._$header);
            this._$leftOptions = $('<div class="left"></div>');
            this._$header.append(this._$leftOptions);
            this._$rightOptions = $('<div class="right"></div>');
            this._$header.append(this._$rightOptions);
            this._$sizeDownButton = $('<input class="btn btn-default size-down" type="button" value="-" />');
            this._$leftOptions.append(this._$sizeDownButton);
            this._$sizeRange = $('<input type="range" name="size" min="1" max="10" value="' + this.options.initialZoom + '" />');
            this._$leftOptions.append(this._$sizeRange);
            this._$sizeUpButton = $('<input class="btn btn-default size-up" type="button" value="+" />');
            this._$leftOptions.append(this._$sizeUpButton);
            this._$multiSelectOptions = $('<div class="multiSelectOptions"></div>');
            this._$rightOptions.append(this._$multiSelectOptions);
            this._$selectAllButton = $('<div class="multiSelectAll"><input id="multiSelectAll" type="checkbox" tabindex="0" /><label for="multiSelectAll">' + this.options.content.selectAll + '</label></div>');
            this._$multiSelectOptions.append(this._$selectAllButton);
            this._$selectAllButtonCheckbox = $(this._$selectAllButton.find('input:checkbox'));
            this._$selectButton = $('<a class="select" href="#">' + this.options.content.select + '</a>');
            this._$multiSelectOptions.append(this._$selectButton);
            this._$main = $('<div class="main"></div>');
            this._$element.append(this._$main);
            this._$thumbs = $('<div class="thumbs"></div>');
            this._$main.append(this._$thumbs);
            this._$thumbs.addClass(this.options.helper.getViewingDirection().toString()); // defaults to "left-to-right"
            this._$sizeDownButton.on('click', function () {
                var val = Number(_this._$sizeRange.val()) - 1;
                if (val >= Number(_this._$sizeRange.attr('min'))) {
                    _this._$sizeRange.val(val.toString());
                    _this._$sizeRange.trigger('change');
                    _this._emit(GalleryComponent.Events.DECREASE_SIZE);
                }
            });
            this._$sizeUpButton.on('click', function () {
                var val = Number(_this._$sizeRange.val()) + 1;
                if (val <= Number(_this._$sizeRange.attr('max'))) {
                    _this._$sizeRange.val(val.toString());
                    _this._$sizeRange.trigger('change');
                    _this._emit(GalleryComponent.Events.INCREASE_SIZE);
                }
            });
            this._$sizeRange.on('change', function () {
                _this._updateThumbs();
                _this._scrollToThumb(_this._getSelectedThumbIndex());
            });
            this._$selectAllButton.checkboxButton(function (checked) {
                if (checked) {
                    _this._getMultiSelectState().selectAll(true);
                }
                else {
                    _this._getMultiSelectState().selectAll(false);
                }
                _this.databind();
            });
            this._$selectButton.on('click', function () {
                var ids = _this._getMultiSelectState().getAllSelectedCanvases().map(function (canvas) {
                    return canvas.id;
                });
                _this._emit(GalleryComponent.Events.MULTISELECTION_MADE, ids);
            });
            this._setRange();
            $.templates({
                galleryThumbsTemplate: '\
                    <div class="{{:~galleryThumbClassName()}}" data-src="{{>uri}}" data-index="{{>index}}" data-visible="{{>visible}}" data-width="{{>width}}" data-height="{{>height}}" data-initialwidth="{{>initialWidth}}" data-initialheight="{{>initialHeight}}">\
                        <div class="wrap" style="width:{{>initialWidth}}px; height:{{>initialHeight}}px" data-link="class{merge:multiSelected toggle=\'multiSelected\'}">\
                        {^{if multiSelectEnabled}}\
                            <input id="thumb-checkbox-{{>id}}" type="checkbox" data-link="checked{:multiSelected ? \'checked\' : \'\'}" class="multiSelect" />\
                        {{/if}}\
                        </div>\
                        <div class="info">\
                            <span class="index" style="width:{{>initialWidth}}px">{{:#index + 1}}</span>\
                            <span class="label" style="width:{{>initialWidth}}px" title="{{>label}}">{{>label}}&nbsp;</span>\
                            <span class="searchResults" title="{{:~galleryThumbSearchResultsTitle()}}">{{>data.searchResults}}</span>\
                        </div>\
                    </div>'
            });
            var that = this;
            $.views.helpers({
                galleryThumbClassName: function () {
                    var className = "thumb preLoad";
                    if (this.data.index === 0) {
                        className += " first";
                    }
                    if (!this.data.uri) {
                        className += " placeholder";
                    }
                    return className;
                },
                galleryThumbSearchResultsTitle: function () {
                    var searchResults = Number(this.data.data.searchResults);
                    if (searchResults) {
                        if (searchResults > 1) {
                            return String.format(that.options.content.searchResults, searchResults);
                        }
                        return String.format(that.options.content.searchResult, searchResults);
                    }
                }
            });
            // use unevent to detect scroll stop.
            this._$main.on('scroll', function () {
                _this._updateThumbs();
            }, this.options.scrollStopDuration);
            if (!this.options.sizingEnabled) {
                this._$sizeRange.hide();
            }
            return success;
        };
        GalleryComponent.prototype._getDefaultOptions = function () {
            return {
                chunkedResizingThreshold: 400,
                content: {
                    searchResult: "{0} search result",
                    searchResults: "{0} search results",
                    select: "Select",
                    selectAll: "Select All"
                },
                debug: false,
                helper: null,
                imageFadeInDuration: 300,
                initialZoom: 6,
                minLabelWidth: 20,
                pageModeEnabled: false,
                scrollStopDuration: 100,
                searchResults: [],
                sizingEnabled: true,
                thumbHeight: 320,
                thumbLoadPadding: 3,
                thumbWidth: 200,
                viewingDirection: manifesto.ViewingDirection.leftToRight()
            };
        };
        GalleryComponent.prototype.databind = function () {
            this._thumbs = this.options.helper.getThumbs(this.options.thumbWidth, this.options.thumbHeight);
            if (this.options.viewingDirection.toString() === manifesto.ViewingDirection.bottomToTop().toString()) {
                this._thumbs.reverse();
            }
            if (this.options.searchResults && this.options.searchResults.length) {
                for (var i = 0; i < this.options.searchResults.length; i++) {
                    var searchResult = this.options.searchResults[i];
                    // find the thumb with the same canvasIndex and add the searchResult
                    var thumb = this._thumbs.en().where(function (t) { return t.index === searchResult.canvasIndex; }).first();
                    // clone the data so searchResults isn't persisted on the canvas.
                    var data = $.extend(true, {}, thumb.data);
                    data.searchResults = searchResult.rects.length;
                    thumb.data = data;
                }
            }
            this._thumbsCache = null; // delete cache
            this._createThumbs();
            this.selectIndex(this.options.helper.canvasIndex);
            var multiSelectState = this._getMultiSelectState();
            if (multiSelectState.isEnabled) {
                this._$multiSelectOptions.show();
                this._$thumbs.addClass("multiSelect");
                for (var i = 0; i < multiSelectState.canvases.length; i++) {
                    var canvas = multiSelectState.canvases[i];
                    var thumb = this._getThumbByCanvas(canvas);
                    this._setThumbMultiSelected(thumb, canvas.multiSelected);
                }
                // range selections override canvas selections
                for (var i = 0; i < multiSelectState.ranges.length; i++) {
                    var range = multiSelectState.ranges[i];
                    var thumbs = this._getThumbsByRange(range);
                    for (var i_1 = 0; i_1 < thumbs.length; i_1++) {
                        var thumb = thumbs[i_1];
                        this._setThumbMultiSelected(thumb, range.multiSelected);
                    }
                }
            }
            else {
                this._$multiSelectOptions.hide();
                this._$thumbs.removeClass("multiSelect");
            }
            this._update();
        };
        GalleryComponent.prototype._update = function () {
            var multiSelectState = this._getMultiSelectState();
            if (multiSelectState.isEnabled) {
                // check/uncheck Select All checkbox
                this._$selectAllButtonCheckbox.prop("checked", multiSelectState.allSelected());
                var anySelected = multiSelectState.getAll().en().where(function (t) { return t.multiSelected; }).toArray().length > 0;
                if (!anySelected) {
                    this._$selectButton.hide();
                }
                else {
                    this._$selectButton.show();
                }
            }
        };
        GalleryComponent.prototype._getMultiSelectState = function () {
            return this.options.helper.getMultiSelectState();
        };
        GalleryComponent.prototype._createThumbs = function () {
            var _this = this;
            var that = this;
            if (!this._thumbs)
                return;
            this._$thumbs.undelegate('.thumb', 'click');
            this._$thumbs.empty();
            var multiSelectState = this._getMultiSelectState();
            // set initial thumb sizes
            var heights = [];
            for (var i = 0; i < this._thumbs.length; i++) {
                var thumb = this._thumbs[i];
                var initialWidth = thumb.width;
                var initialHeight = thumb.height;
                thumb.initialWidth = initialWidth;
                //thumb.initialHeight = initialHeight;
                heights.push(initialHeight);
                thumb.multiSelectEnabled = multiSelectState.isEnabled;
            }
            var medianHeight = Math.median(heights);
            for (var i = 0; i < this._thumbs.length; i++) {
                var thumb = this._thumbs[i];
                thumb.initialHeight = medianHeight;
            }
            this._$thumbs.link($.templates.galleryThumbsTemplate, this._thumbs);
            if (!multiSelectState.isEnabled) {
                // add a selection click event to all thumbs
                this._$thumbs.delegate('.thumb', 'click', function (e) {
                    e.preventDefault();
                    var thumb = $.view(this).data;
                    that._lastThumbClickedIndex = thumb.index;
                    that._emit(GalleryComponent.Events.THUMB_SELECTED, thumb);
                });
            }
            else {
                // make each thumb a checkboxButton
                $.each(this._$thumbs.find('.thumb'), function (index, thumb) {
                    var that = _this;
                    var $thumb = $(thumb);
                    $thumb.checkboxButton(function (checked) {
                        var thumb = $.view(this).data;
                        that._setThumbMultiSelected(thumb, !thumb.multiSelected);
                        var range = that.options.helper.getCanvasRange(thumb.data);
                        var multiSelectState = that._getMultiSelectState();
                        if (range) {
                            multiSelectState.selectRange(range, thumb.multiSelected);
                        }
                        else {
                            multiSelectState.selectCanvas(thumb.data, thumb.multiSelected);
                        }
                        that._update();
                        that._emit(GalleryComponent.Events.THUMB_MULTISELECTED, thumb);
                    });
                });
            }
        };
        GalleryComponent.prototype._getThumbByCanvas = function (canvas) {
            return this._thumbs.en().where(function (c) { return c.data.id === canvas.id; }).first();
        };
        GalleryComponent.prototype._sizeThumb = function ($thumb) {
            var initialWidth = $thumb.data().initialwidth;
            var initialHeight = $thumb.data().initialheight;
            var width = Number(initialWidth);
            var height = Number(initialHeight);
            var newWidth = Math.floor(width * this._range);
            var newHeight = Math.floor(height * this._range);
            var $wrap = $thumb.find('.wrap');
            var $label = $thumb.find('.label');
            var $index = $thumb.find('.index');
            var $searchResults = $thumb.find('.searchResults');
            var newLabelWidth = newWidth;
            // if search results are visible, size index/label to accommodate it.
            // if the resulting size is below options.minLabelWidth, hide search results.
            if (this.options.searchResults && this.options.searchResults.length) {
                $searchResults.show();
                newLabelWidth = newWidth - $searchResults.outerWidth();
                if (newLabelWidth < this.options.minLabelWidth) {
                    $searchResults.hide();
                    newLabelWidth = newWidth;
                }
                else {
                    $searchResults.show();
                }
            }
            if (this.options.pageModeEnabled) {
                $index.hide();
                $label.show();
            }
            else {
                $index.show();
                $label.hide();
            }
            $wrap.outerWidth(newWidth);
            $wrap.outerHeight(newHeight);
            $index.outerWidth(newLabelWidth);
            $label.outerWidth(newLabelWidth);
        };
        GalleryComponent.prototype._loadThumb = function ($thumb, cb) {
            var $wrap = $thumb.find('.wrap');
            if ($wrap.hasClass('loading') || $wrap.hasClass('loaded'))
                return;
            $thumb.removeClass('preLoad');
            // if no img has been added yet
            var visible = $thumb.attr('data-visible');
            var fadeDuration = this.options.imageFadeInDuration;
            if (visible !== "false") {
                $wrap.addClass('loading');
                var src = $thumb.attr('data-src');
                var $img = $('<img class="thumbImage" src="' + src + '" />');
                // fade in on load.
                $img.hide().load(function () {
                    $(this).fadeIn(fadeDuration, function () {
                        $(this).parent().swapClass('loading', 'loaded');
                    });
                });
                $wrap.prepend($img);
                if (cb)
                    cb($img);
            }
            else {
                $wrap.addClass('hidden');
            }
        };
        GalleryComponent.prototype._getThumbsByRange = function (range) {
            var thumbs = [];
            for (var i = 0; i < this._thumbs.length; i++) {
                var thumb = this._thumbs[i];
                var canvas = thumb.data;
                var r = this.options.helper.getCanvasRange(canvas, range.path);
                if (r && r.id === range.id) {
                    thumbs.push(thumb);
                }
            }
            return thumbs;
        };
        GalleryComponent.prototype._updateThumbs = function () {
            var debug = this.options.debug;
            // cache range size
            this._setRange();
            var scrollTop = this._$main.scrollTop();
            var scrollHeight = this._$main.height();
            var scrollBottom = scrollTop + scrollHeight;
            if (debug) {
                console.log('scrollTop %s, scrollBottom %s', scrollTop, scrollBottom);
            }
            // test which thumbs are scrolled into view
            var thumbs = this._getAllThumbs();
            var numToUpdate = 0;
            for (var i = 0; i < thumbs.length; i++) {
                var $thumb = $(thumbs[i]);
                var thumbTop = $thumb.position().top;
                var thumbHeight = $thumb.outerHeight();
                var thumbBottom = thumbTop + thumbHeight;
                var padding = thumbHeight * this.options.thumbLoadPadding;
                // check all thumbs to see if they are within the scroll area plus padding
                if (thumbTop <= scrollBottom + padding && thumbBottom >= scrollTop - padding) {
                    numToUpdate += 1;
                    var $label = $thumb.find('span:visible').not('.searchResults');
                    // if (debug) {
                    //     $thumb.addClass('debug');
                    //     $label.empty().append('t: ' + thumbTop + ', b: ' + thumbBottom);
                    // } else {
                    //     $thumb.removeClass('debug');
                    // }
                    this._sizeThumb($thumb);
                    $thumb.addClass('insideScrollArea');
                    // if (debug) {
                    //     $label.append(', i: true');
                    // }
                    this._loadThumb($thumb);
                }
                else {
                    $thumb.removeClass('insideScrollArea');
                }
            }
            if (debug) {
                console.log('number of thumbs to update: ' + numToUpdate);
            }
        };
        GalleryComponent.prototype._getSelectedThumbIndex = function () {
            return Number(this._$selectedThumb.data('index'));
        };
        GalleryComponent.prototype._getAllThumbs = function () {
            if (!this._thumbsCache) {
                this._thumbsCache = this._$thumbs.find('.thumb');
            }
            return this._thumbsCache;
        };
        GalleryComponent.prototype._getThumbByIndex = function (canvasIndex) {
            return this._$thumbs.find('[data-index="' + canvasIndex + '"]');
        };
        GalleryComponent.prototype._scrollToThumb = function (canvasIndex) {
            var $thumb = this._getThumbByIndex(canvasIndex);
            this._$main.scrollTop($thumb.position().top);
        };
        // these don't work well because thumbs are loaded in chunks
        // public searchPreviewStart(canvasIndex: number): void {
        //     this._scrollToThumb(canvasIndex);
        //     const $thumb: JQuery = this._getThumbByIndex(canvasIndex);
        //     $thumb.addClass('searchpreview');
        // }
        // public searchPreviewFinish(): void {
        //     this._scrollToThumb(this.options.helper.canvasIndex);
        //     this._getAllThumbs().removeClass('searchpreview');
        // }
        GalleryComponent.prototype.selectIndex = function (index) {
            if (!this._thumbs || !this._thumbs.length)
                return;
            this._getAllThumbs().removeClass('selected');
            this._$selectedThumb = this._getThumbByIndex(index);
            this._$selectedThumb.addClass('selected');
            this._scrollToThumb(index);
            // make sure visible images are loaded.
            this._updateThumbs();
        };
        GalleryComponent.prototype._setRange = function () {
            var norm = Math.normalise(Number(this._$sizeRange.val()), 0, 10);
            this._range = Math.clamp(norm, 0.05, 1);
        };
        GalleryComponent.prototype._setThumbMultiSelected = function (thumb, selected) {
            $.observable(thumb).setProperty("multiSelected", selected);
        };
        GalleryComponent.prototype._resize = function () {
        };
        return GalleryComponent;
    }(_Components.BaseComponent));
    IIIFComponents.GalleryComponent = GalleryComponent;
})(IIIFComponents || (IIIFComponents = {}));
var IIIFComponents;
(function (IIIFComponents) {
    var GalleryComponent;
    (function (GalleryComponent) {
        var Events = (function () {
            function Events() {
            }
            Events.DECREASE_SIZE = 'decreaseSize';
            Events.INCREASE_SIZE = 'increaseSize';
            Events.MULTISELECTION_MADE = 'multiSelectionMade';
            Events.THUMB_SELECTED = 'thumbSelected';
            Events.THUMB_MULTISELECTED = 'thumbMultiSelected';
            return Events;
        }());
        GalleryComponent.Events = Events;
    })(GalleryComponent = IIIFComponents.GalleryComponent || (IIIFComponents.GalleryComponent = {}));
})(IIIFComponents || (IIIFComponents = {}));
(function (w) {
    if (!w.IIIFComponents) {
        w.IIIFComponents = IIIFComponents;
    }
    else {
        w.IIIFComponents.GalleryComponent = IIIFComponents.GalleryComponent;
    }
})(window);





},{}]},{},[1])(1)
});