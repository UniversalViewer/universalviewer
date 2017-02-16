// iiif-metadata-component v1.0.10 https://github.com/viewdir/iiif-metadata-component#readme
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
var MetadataGroup = Manifold.MetadataGroup;
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
            this._$metadataGroupTemplate = $('<div class="group">\
                                                   <div class="header"></div>\
                                                   <div class="items"></div>\
                                               </div>');
            this._$metadataItemTemplate = $('<div class="item">\
                                                   <div class="label"></div>\
                                                   <div class="values"></div>\
                                               </div>');
            this._$metadataItemValueTemplate = $('<div class="value"></div>');
            this._$metadataItemURIValueTemplate = $('<a class="value" href="" target="_blank"></a>');
            this._$copyTextTemplate = $('<div class="copyText" alt="' + this.options.content.copyToClipboard + '" title="' + this.options.content.copyToClipboard + '">\
                                                   <div class="copiedText">' + this.options.content.copiedToClipboard + ' </div>\
                                               </div>');
            this._$metadataGroups = $('<div class="groups"></div>');
            this._$element.append(this._$metadataGroups);
            this._$noData = $('<div class="noData">' + this.options.content.noData + '</div>');
            this._$element.append(this._$noData);
            return success;
        };
        MetadataComponent.prototype._getDefaultOptions = function () {
            return {
                aggregateValues: "",
                canvases: null,
                canvasDisplayOrder: "",
                canvasExclude: "",
                canvasLabels: "",
                content: {
                    attribution: "Attribution",
                    canvasHeader: "About the canvas",
                    copiedToClipboard: "Copied to clipboard",
                    copyToClipboard: "Copy to clipboard",
                    description: "Description",
                    imageHeader: "About the image",
                    less: "less",
                    license: "License",
                    logo: "Logo",
                    manifestHeader: "About the item",
                    more: "more",
                    noData: "No data to display",
                    rangeHeader: "About the range",
                    sequenceHeader: "About the sequence"
                },
                copiedMessageDuration: 2000,
                copyToClipboardEnabled: false,
                helper: null,
                licenseFormatter: null,
                limit: 4,
                limitType: IIIFComponents.MetadataComponentOptions.LimitType.LINES,
                manifestDisplayOrder: "",
                manifestExclude: "",
                range: null,
                rtlLanguageCodes: "ar, ara, dv, div, he, heb, ur, urd",
                sanitizer: function (html) { return html; },
                showAllLanguages: false
            };
        };
        MetadataComponent.prototype._getManifestGroup = function () {
            return this._metadataGroups.en().where(function (x) { return x.resource.isManifest(); }).first();
        };
        MetadataComponent.prototype._getCanvasGroups = function () {
            return this._metadataGroups.en().where(function (x) { return x.resource.isCanvas(); }).toArray();
        };
        MetadataComponent.prototype.databind = function () {
            var _this = this;
            this._$metadataGroups.empty();
            var options = {
                canvases: this.options.canvases,
                licenseFormatter: this.options.licenseFormatter,
                range: this.options.range
            };
            this._metadataGroups = this.options.helper.getMetadata(options);
            if (this.options.manifestDisplayOrder) {
                var manifestGroup = this._getManifestGroup();
                manifestGroup.items = this._sort(manifestGroup.items, this._readCSV(this.options.manifestDisplayOrder));
            }
            if (this.options.canvasDisplayOrder) {
                var canvasGroups = this._getCanvasGroups();
                $.each(canvasGroups, function (index, canvasGroup) {
                    canvasGroup.items = _this._sort(canvasGroup.items, _this._readCSV(_this.options.canvasDisplayOrder));
                });
            }
            if (this.options.canvasLabels) {
                this._label(this._getCanvasGroups(), this._readCSV(this.options.canvasLabels, false));
            }
            if (this.options.manifestExclude) {
                var manifestGroup = this._getManifestGroup();
                manifestGroup.items = this._exclude(manifestGroup.items, this._readCSV(this.options.manifestExclude));
            }
            if (this.options.canvasExclude) {
                var canvasGroups = this._getCanvasGroups();
                $.each(canvasGroups, function (index, canvasGroup) {
                    canvasGroup.items = _this._exclude(canvasGroup.items, _this._readCSV(_this.options.canvasExclude));
                });
            }
            if (!this._metadataGroups.length) {
                this._$noData.show();
                return;
            }
            this._$noData.hide();
            this._render();
        };
        MetadataComponent.prototype._sort = function (items, displayOrder) {
            var _this = this;
            var sorted = [];
            var unsorted = items.clone();
            $.each(displayOrder, function (index, item) {
                var match = unsorted.en().where((function (x) { return _this._normalise(x.getLabel()) === item; })).first();
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
        MetadataComponent.prototype._label = function (groups, labels) {
            $.each(groups, function (index, group) {
                group.label = labels[index];
            });
        };
        MetadataComponent.prototype._exclude = function (items, excludeConfig) {
            var _this = this;
            $.each(excludeConfig, function (index, item) {
                var match = items.en().where((function (x) { return _this._normalise(x.getLabel()) === item; })).first();
                if (match) {
                    items.remove(match);
                }
            });
            return items;
        };
        // private _flatten(items: MetadataItem[]): MetadataItem[] {
        //     // flatten metadata into array.
        //     var flattened: MetadataItem[] = [];
        //     $.each(items, (index: number, item: any) => {
        //         if (Array.isArray(item.value)){
        //             flattened = flattened.concat(<MetadataItem[]>item.value);
        //         } else {
        //             flattened.push(item);
        //         }
        //     });
        //     return flattened;
        // }
        // merge any duplicate items into canvas metadata
        // todo: needs to be more generic taking a single concatenated array
        // private _aggregate(manifestMetadata: any[], canvasMetadata: any[]) {
        //     if (this._aggregateValues.length) {
        //         $.each(canvasMetadata, (index: number, canvasItem: any) => {
        //             $.each(this._aggregateValues, (index: number, value: string) => {
        //                 value = this._normalise(value);
        //                 if (this._normalise(canvasItem.label) === value) {
        //                     var manifestItem = manifestMetadata.en().where(x => this._normalise(x.label) === value).first();
        //                     if (manifestItem) {
        //                         canvasItem.value = manifestItem.value + canvasItem.value;
        //                         manifestMetadata.remove(manifestItem);
        //                     }
        //                 }  
        //             });
        //         });
        //     }
        // }
        MetadataComponent.prototype._normalise = function (value) {
            if (value) {
                return value.toLowerCase().replace(/ /g, "");
            }
            return null;
        };
        MetadataComponent.prototype._render = function () {
            var _this = this;
            $.each(this._metadataGroups, function (index, metadataGroup) {
                var $metadataGroup = _this._buildMetadataGroup(metadataGroup);
                _this._$metadataGroups.append($metadataGroup);
                if (_this.options.limitType === IIIFComponents.MetadataComponentOptions.LimitType.LINES) {
                    $metadataGroup.find('.value').toggleExpandTextByLines(_this.options.limit, _this.options.content.less, _this.options.content.more, function () { });
                }
                else if (_this.options.limitType === IIIFComponents.MetadataComponentOptions.LimitType.CHARS) {
                    $metadataGroup.find('.value').ellipsisHtmlFixed(_this.options.limit, null);
                }
            });
        };
        MetadataComponent.prototype._buildMetadataGroup = function (metadataGroup) {
            var $metadataGroup = this._$metadataGroupTemplate.clone();
            var $header = $metadataGroup.find('>.header');
            // add group header
            if (metadataGroup.resource.isManifest() && this.options.content.manifestHeader) {
                $header.html(this._sanitize(this.options.content.manifestHeader));
            }
            else if (metadataGroup.resource.isSequence() && this.options.content.sequenceHeader) {
                $header.html(this._sanitize(this.options.content.sequenceHeader));
            }
            else if (metadataGroup.resource.isRange() && this.options.content.rangeHeader) {
                $header.html(this._sanitize(this.options.content.rangeHeader));
            }
            else if (metadataGroup.resource.isCanvas() && (metadataGroup.label || this.options.content.canvasHeader)) {
                var header = metadataGroup.label || this.options.content.canvasHeader;
                $header.html(this._sanitize(header));
            }
            else if (metadataGroup.resource.isAnnotation() && this.options.content.imageHeader) {
                $header.html(this._sanitize(this.options.content.imageHeader));
            }
            if (!$header.text()) {
                $header.hide();
            }
            var $items = $metadataGroup.find('.items');
            for (var i = 0; i < metadataGroup.items.length; i++) {
                var item = metadataGroup.items[i];
                var $metadataItem = this._buildMetadataItem(item);
                $items.append($metadataItem);
            }
            return $metadataGroup;
        };
        MetadataComponent.prototype._buildMetadataItem = function (item) {
            var $metadataItem = this._$metadataItemTemplate.clone();
            var $label = $metadataItem.find('.label');
            var $values = $metadataItem.find('.values');
            var originalLabel = item.getLabel();
            var label = originalLabel;
            if (label && item.isRootLevel) {
                switch (label.toLowerCase()) {
                    case "attribution":
                        label = this.options.content.attribution;
                        break;
                    case "description":
                        label = this.options.content.description;
                        break;
                    case "license":
                        label = this.options.content.license;
                        break;
                    case "logo":
                        label = this.options.content.logo;
                        break;
                }
            }
            label = this._sanitize(label);
            $label.html(label);
            // rtl?
            this._addReadingDirection($label, this._getItemLocale(item));
            $metadataItem.addClass(label.toCssClass());
            var value;
            var $value;
            // if the value is a URI
            if (originalLabel && originalLabel.toLowerCase() === "license") {
                $value = this._buildMetadataItemURIValue(item.value[0].value);
                $values.append($value);
            }
            else {
                if (this.options.showAllLanguages && item.value && item.value.length > 1) {
                    // display all values in each locale
                    for (var i = 0; i < item.value.length; i++) {
                        var translation = item.value[i];
                        $value = this._buildMetadataItemValue(translation.value, translation.locale);
                        $values.append($value);
                    }
                }
                else {
                    var itemLocale = this._getItemLocale(item);
                    var valueFound = false;
                    // display all values in the item's locale
                    for (var i = 0; i < item.value.length; i++) {
                        var translation = item.value[i];
                        if (itemLocale === translation.locale) {
                            valueFound = true;
                            $value = this._buildMetadataItemValue(translation.value, translation.locale);
                            $values.append($value);
                        }
                    }
                    // if no values were found in the current locale, default to the first.
                    if (!valueFound) {
                        var translation = item.value[0];
                        if (translation) {
                            $value = this._buildMetadataItemValue(translation.value, translation.locale);
                            $values.append($value);
                        }
                    }
                }
            }
            if (this.options.copyToClipboardEnabled && Utils.Clipboard.supportsCopy() && $label.text()) {
                this._addCopyButton($metadataItem, $label, $values);
            }
            return $metadataItem;
        };
        MetadataComponent.prototype._getItemLocale = function (item) {
            // the item's label locale takes precedence
            return (item.label.length && item.label[0].locale) ? item.label[0].locale : item.defaultLocale || this.options.helper.options.locale;
        };
        MetadataComponent.prototype._buildMetadataItemValue = function (value, locale) {
            value = this._sanitize(value);
            value = value.replace('\n', '<br>'); // replace \n with <br>
            var $value = this._$metadataItemValueTemplate.clone();
            $value.html(value);
            $value.targetBlank();
            // rtl?
            if (locale) {
                this._addReadingDirection($value, locale);
            }
            return $value;
        };
        MetadataComponent.prototype._buildMetadataItemURIValue = function (value) {
            value = this._sanitize(value);
            var $value = this._$metadataItemURIValueTemplate.clone();
            $value.prop('href', value);
            $value.text(value);
            return $value;
        };
        MetadataComponent.prototype._addReadingDirection = function ($elem, locale) {
            locale = Manifesto.Utils.getInexactLocale(locale);
            var rtlLanguages = this._readCSV(this.options.rtlLanguageCodes);
            var match = rtlLanguages.en().where(function (x) { return x === locale; }).toArray().length > 0;
            if (match) {
                $elem.prop('dir', 'rtl');
                $elem.addClass('rtl');
            }
        };
        MetadataComponent.prototype._addCopyButton = function ($elem, $header, $values) {
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
            var that = this;
            var originalValue = $values.text();
            $copyBtn.on('click', function (e) {
                that._copyItemValues($copyBtn, originalValue);
            });
        };
        MetadataComponent.prototype._copyItemValues = function ($copyButton, originalValue) {
            Utils.Clipboard.copy(originalValue);
            var $copiedText = $copyButton.find('.copiedText');
            $copiedText.show();
            setTimeout(function () {
                $copiedText.hide();
            }, this.options.copiedMessageDuration);
        };
        MetadataComponent.prototype._readCSV = function (config, normalise) {
            if (normalise === void 0) { normalise = true; }
            var csv = [];
            if (config) {
                csv = config.split(',');
                if (normalise) {
                    for (var i = 0; i < csv.length; i++) {
                        csv[i] = this._normalise(csv[i]);
                    }
                }
            }
            return csv;
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