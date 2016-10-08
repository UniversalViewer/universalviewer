// iiif-metadata-component v1.0.0 https://github.com/viewdir/iiif-metadata-component#readme
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.iiifMetadataComponent = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var IIIFComponents;
(function (IIIFComponents) {
    var StringValue = (function () {
        function StringValue(value) {
            this.value = "";
            if (value) {
                this.value = value.toLowerCase();
            }
        }
        StringValue.prototype.toString = function () {
            return this.value;
        };
        return StringValue;
    }());
    IIIFComponents.StringValue = StringValue;
})(IIIFComponents || (IIIFComponents = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IIIFComponents;
(function (IIIFComponents) {
    var MetadataComponentOptions;
    (function (MetadataComponentOptions) {
        var LimitType = (function (_super) {
            __extends(LimitType, _super);
            function LimitType() {
                _super.apply(this, arguments);
            }
            LimitType.LINES = new LimitType("lines");
            LimitType.CHARS = new LimitType("chars");
            return LimitType;
        }(IIIFComponents.StringValue));
        MetadataComponentOptions.LimitType = LimitType;
    })(MetadataComponentOptions = IIIFComponents.MetadataComponentOptions || (IIIFComponents.MetadataComponentOptions = {}));
})(IIIFComponents || (IIIFComponents = {}));

/// <reference path="./StringValue.ts" />
/// <reference path="./LimitType.ts" /> 





var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IIIFComponents;
(function (IIIFComponents) {
    var MetadataComponent = (function (_super) {
        __extends(MetadataComponent, _super);
        function MetadataComponent(options) {
            _super.call(this, options);
            this._init();
            this._resize();
        }
        MetadataComponent.prototype._init = function () {
            var success = _super.prototype._init.call(this);
            if (!success) {
                console.error("Component failed to initialise");
            }
            this._$moreInfoItemTemplate = $('<div class="item">\
                                                   <div class="header"></div>\
                                                   <div class="text"></div>\
                                               </div>');
            this._$copyTextTemplate = $('<div class="copyText" alt="' + this.options.content.copyToClipboard + '" title="' + this.options.content.copyToClipboard + '">\
                                                   <div class="copiedText">' + this.options.content.copiedToClipboard + ' </div>\
                                               </div>');
            this._$items = $('<div class="items"></div>');
            this._$element.append(this._$items);
            this._$canvasItems = $('<div class="items"></div>');
            this._$element.append(this._$canvasItems);
            this._$noData = $('<div class="noData">' + this.options.content.noData + '</div>');
            this._$element.append(this._$noData);
            this._aggregateValues = this._readCSV(this.options.aggregateValues);
            this._canvasExclude = this._readCSV(this.options.canvasExclude);
            return success;
        };
        MetadataComponent.prototype._getDefaultOptions = function () {
            return {
                aggregateValues: "",
                canvasExclude: "",
                content: {
                    attribution: "Attribution",
                    canvasHeader: "About the image",
                    copiedToClipboard: "Copied to clipboard",
                    copyToClipboard: "Copy to clipboard",
                    description: "Description",
                    less: "less",
                    license: "License",
                    logo: "Logo",
                    manifestHeader: "About the item",
                    more: "more",
                    noData: "No data to display"
                },
                copyToClipboardEnabled: false,
                displayOrder: "",
                helper: null,
                limit: 4,
                limitType: IIIFComponents.MetadataComponentOptions.LimitType.LINES,
                manifestExclude: "",
                sanitizer: function (html) { return html; }
            };
        };
        MetadataComponent.prototype.databind = function () {
            // todo
            // if (this.extension.config.licenseMap){
            //     data = this.extension.helper.getMetadata(new Manifold.UriLabeller(this.extension.config.licenseMap));
            // } else {
            this._manifestMetadata = this.options.helper.getMetadata();
            //}
            if (this.options.displayOrder) {
                this._manifestMetadata = this._sort(this._manifestMetadata[0].value, this._readCSV(this.options.displayOrder));
            }
            if (this.options.manifestExclude) {
                this._manifestMetadata = this._exclude(this._manifestMetadata[0].value, this._readCSV(this.options.manifestExclude));
            }
            this._manifestMetadata = this._flatten(this._manifestMetadata);
            this._canvasMetadata = this._getCanvasData(this.options.helper.getCurrentCanvas());
            if (this._manifestMetadata.length === 0 && this._canvasMetadata.length === 0) {
                this._$noData.show();
                return;
            }
            this._$noData.hide();
            //var manifestRenderData: JQuery = $.extend(true, [], this._manifestMetadata);
            //var canvasRenderData: JQuery = $.extend(true, [], this._canvasMetadata);
            this._aggregate(this._manifestMetadata, this._canvasMetadata);
            this._renderElement(this._$items, this._manifestMetadata, this.options.content.manifestHeader, this._canvasMetadata.length !== 0);
            this._renderElement(this._$canvasItems, this._canvasMetadata, this.options.content.canvasHeader, this._manifestMetadata.length !== 0);
        };
        MetadataComponent.prototype._sort = function (data, displayOrder) {
            var _this = this;
            // sort items
            var sorted = [];
            var unsorted = data.clone();
            $.each(displayOrder, function (index, item) {
                var match = unsorted.en().where((function (x) { return _this._normalise(x.label) === item; })).first();
                if (match) {
                    sorted.push(match);
                    unsorted.remove(match);
                }
            });
            // add remaining items that were not in the displayOrder.
            $.each(unsorted, function (index, item) {
                sorted.push(item);
            });
            return sorted;
        };
        MetadataComponent.prototype._exclude = function (data, excludeConfig) {
            var _this = this;
            $.each(excludeConfig, function (index, item) {
                var match = data.en().where((function (x) { return _this._normalise(x.label) === item; })).first();
                if (match) {
                    data.remove(match);
                }
            });
            return data;
        };
        MetadataComponent.prototype._flatten = function (data) {
            // flatten metadata into array.
            var flattened = [];
            $.each(data, function (index, item) {
                if (Array.isArray(item.value)) {
                    flattened = flattened.concat(item.value);
                }
                else {
                    flattened.push(item);
                }
            });
            return flattened;
        };
        // merge any duplicate items into canvas metadata
        // todo: needs to be more generic taking a single concatenated array
        MetadataComponent.prototype._aggregate = function (manifestMetadata, canvasMetadata) {
            var _this = this;
            if (this._aggregateValues.length) {
                $.each(canvasMetadata, function (index, canvasItem) {
                    $.each(_this._aggregateValues, function (index, value) {
                        value = _this._normalise(value);
                        if (_this._normalise(canvasItem.label) === value) {
                            var manifestItem = manifestMetadata.en().where(function (x) { return _this._normalise(x.label) === value; }).first();
                            if (manifestItem) {
                                canvasItem.value = manifestItem.value + canvasItem.value;
                                manifestMetadata.remove(manifestItem);
                            }
                        }
                    });
                });
            }
        };
        MetadataComponent.prototype._normalise = function (value) {
            return value.toLowerCase().replace(/ /g, "");
        };
        MetadataComponent.prototype._renderElement = function (element, data, header, renderHeader) {
            var _this = this;
            element.empty();
            if (data.length !== 0) {
                if (renderHeader && header) {
                    element.append(this._buildHeader(header));
                }
                $.each(data, function (index, item) {
                    var $built = _this._buildItem(item);
                    element.append($built);
                    if (_this.options.limitType === IIIFComponents.MetadataComponentOptions.LimitType.LINES) {
                        $built.find('.text').toggleExpandTextByLines(_this.options.limit, _this.options.content.less, _this.options.content.more, function () { });
                    }
                    else if (_this.options.limitType === IIIFComponents.MetadataComponentOptions.LimitType.CHARS) {
                        $built.find('.text').ellipsisHtmlFixed(_this.options.limit, null);
                    }
                });
            }
        };
        MetadataComponent.prototype._buildHeader = function (label) {
            var $header = $('<div class="header"></div>');
            $header.html(this._sanitize(label));
            return $header;
        };
        MetadataComponent.prototype._buildItem = function (item) {
            var $elem = this._$moreInfoItemTemplate.clone();
            var $header = $elem.find('.header');
            var $text = $elem.find('.text');
            item.label = this._sanitize(item.label);
            item.value = this._sanitize(item.value);
            if (item.isRootLevel) {
                switch (item.label.toLowerCase()) {
                    case "attribution":
                        item.label = this.options.content.attribution;
                        break;
                    case "description":
                        item.label = this.options.content.description;
                        break;
                    case "license":
                        item.label = this.options.content.license;
                        break;
                    case "logo":
                        item.label = this.options.content.logo;
                        break;
                }
            }
            // replace \n with <br>
            item.value = item.value.replace('\n', '<br>');
            $header.html(item.label);
            $text.html(item.value);
            $text.targetBlank();
            item.label = item.label.trim();
            item.label = item.label.toLowerCase();
            $elem.addClass(item.label.toCssClass());
            if (this.options.copyToClipboardEnabled && Utils.Clipboard.supportsCopy() && $text.text() && $header.text()) {
                this._addCopyButton($elem, $header);
            }
            return $elem;
        };
        MetadataComponent.prototype._addCopyButton = function ($elem, $header) {
            var _this = this;
            var $copyBtn = this._$copyTextTemplate.clone();
            var $copiedText = $copyBtn.children();
            $header.append($copyBtn);
            if (Utils.Device.isTouch()) {
                $copyBtn.show();
            }
            else {
                $elem.on('mouseenter', function () {
                    $copyBtn.show();
                });
                $elem.on('mouseleave', function () {
                    $copyBtn.hide();
                });
                $copyBtn.on('mouseleave', function () {
                    $copiedText.hide();
                });
            }
            $copyBtn.on('click', function (e) {
                var imgElement = e.target;
                var headerText = imgElement.previousSibling.textContent || imgElement.previousSibling.nodeValue;
                _this._copyValueForLabel(headerText);
            });
        };
        MetadataComponent.prototype._copyValueForLabel = function (label) {
            var manifestItems = this._flatten(this._manifestMetadata);
            var canvasItems = this._flatten(this._canvasMetadata);
            var $matchingItems = $(manifestItems.concat(canvasItems))
                .filter(function (i, md) { return md.label && label && md.label.toLowerCase() === label.toLowerCase(); });
            var text = $matchingItems.map(function (i, md) { return md.value; }).get().join('');
            if (!text)
                return;
            Utils.Clipboard.copy(text);
            var $copiedText = $('.items .item .header:contains(' + label + ') .copiedText');
            $copiedText.show();
            setTimeout(function () {
                $copiedText.hide();
            }, 2000);
        };
        MetadataComponent.prototype._getCanvasData = function (canvas) {
            var data = this.options.helper.getCanvasMetadata(canvas);
            if (this._canvasExclude.length !== 0) {
                this._exclude(data[0].value, this._canvasExclude);
            }
            return this._flatten(data);
        };
        MetadataComponent.prototype._readCSV = function (config) {
            if (config) {
                return config
                    .toLowerCase()
                    .replace(/ /g, "")
                    .split(',');
            }
            return [];
        };
        MetadataComponent.prototype._sanitize = function (html) {
            return this.options.sanitizer(html);
        };
        MetadataComponent.prototype._resize = function () {
        };
        return MetadataComponent;
    }(_Components.BaseComponent));
    IIIFComponents.MetadataComponent = MetadataComponent;
})(IIIFComponents || (IIIFComponents = {}));
var IIIFComponents;
(function (IIIFComponents) {
    var MetadataComponent;
    (function (MetadataComponent) {
        var Events = (function () {
            function Events() {
            }
            return Events;
        }());
        MetadataComponent.Events = Events;
    })(MetadataComponent = IIIFComponents.MetadataComponent || (IIIFComponents.MetadataComponent = {}));
})(IIIFComponents || (IIIFComponents = {}));
(function (w) {
    if (!w.IIIFComponents) {
        w.IIIFComponents = IIIFComponents;
    }
    else {
        w.IIIFComponents.MetadataComponent = IIIFComponents.MetadataComponent;
        w.IIIFComponents.MetadataComponentOptions = IIIFComponents.MetadataComponentOptions;
    }
})(window);

},{}]},{},[1])(1)
});