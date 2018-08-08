// iiif-metadata-component v1.1.8 https://github.com/iiif-commons/iiif-metadata-component#readme
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.iiifMetadataComponent = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
(function (global){

var IIIFComponents;
(function (IIIFComponents) {
    var StringValue = /** @class */ (function () {
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
    var MetadataComponentOptions;
    (function (MetadataComponentOptions) {
        var LimitType = /** @class */ (function (_super) {
            __extends(LimitType, _super);
            function LimitType() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            LimitType.LINES = new LimitType("lines");
            LimitType.CHARS = new LimitType("chars");
            return LimitType;
        }(IIIFComponents.StringValue));
        MetadataComponentOptions.LimitType = LimitType;
    })(MetadataComponentOptions = IIIFComponents.MetadataComponentOptions || (IIIFComponents.MetadataComponentOptions = {}));
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
var MetadataGroup = Manifold.MetadataGroup;
var IIIFComponents;
(function (IIIFComponents) {
    var MetadataComponent = /** @class */ (function (_super) {
        __extends(MetadataComponent, _super);
        function MetadataComponent(options) {
            var _this = _super.call(this, options) || this;
            _this._data = _this.data();
            _this._init();
            _this._resize();
            return _this;
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
            this._$copyTextTemplate = $('<div class="copyText" alt="' + this._data.content.copyToClipboard + '" title="' + this._data.content.copyToClipboard + '">\
                                                   <div class="copiedText">' + this._data.content.copiedToClipboard + ' </div>\
                                               </div>');
            this._$metadataGroups = $('<div class="groups"></div>');
            this._$element.append(this._$metadataGroups);
            this._$noData = $('<div class="noData">' + this._data.content.noData + '</div>');
            this._$element.append(this._$noData);
            return success;
        };
        MetadataComponent.prototype.data = function () {
            return {
                aggregateValues: "",
                canvases: null,
                canvasDisplayOrder: "",
                metadataGroupOrder: "",
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
                limitToRange: false,
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
        MetadataComponent.prototype.set = function (data) {
            var _this = this;
            $.extend(this._data, data);
            if (!this._data || !this._data.helper) {
                return;
            }
            var options = {
                canvases: this._data.canvases,
                licenseFormatter: this._data.licenseFormatter,
                range: this._data.range
            };
            this._metadataGroups = this._data.helper.getMetadata(options);
            if (this._data.manifestDisplayOrder) {
                var manifestGroup = this._getManifestGroup();
                manifestGroup.items = this._sortItems(manifestGroup.items, this._readCSV(this._data.manifestDisplayOrder));
            }
            if (this._data.canvasDisplayOrder) {
                var canvasGroups = this._getCanvasGroups();
                canvasGroups.forEach(function (canvasGroup, index) {
                    canvasGroup.items = _this._sortItems(canvasGroup.items, _this._readCSV(_this._data.canvasDisplayOrder));
                });
            }
            if (this._data.metadataGroupOrder) {
                this._metadataGroups = this._sortGroups(this._metadataGroups, this._readCSV(this._data.metadataGroupOrder));
            }
            if (this._data.canvasLabels) {
                this._label(this._getCanvasGroups(), this._readCSV(this._data.canvasLabels, false));
            }
            if (this._data.manifestExclude) {
                var manifestGroup = this._getManifestGroup();
                manifestGroup.items = this._exclude(manifestGroup.items, this._readCSV(this._data.manifestExclude));
            }
            if (this._data.canvasExclude) {
                var canvasGroups = this._getCanvasGroups();
                canvasGroups.forEach(function (canvasGroup, index) {
                    canvasGroup.items = _this._exclude(canvasGroup.items, _this._readCSV(_this._data.canvasExclude));
                });
            }
            if (this._data.limitToRange) {
                var newGroups_1 = [];
                this._metadataGroups.forEach(function (group, index) {
                    if (group.resource.isRange()) {
                        newGroups_1.push(group);
                    }
                });
                if (newGroups_1.length) {
                    this._metadataGroups = newGroups_1;
                }
            }
            this._render();
        };
        MetadataComponent.prototype._sortItems = function (items, displayOrder) {
            var _this = this;
            var sorted = [];
            var unsorted = items.slice(0);
            displayOrder.forEach(function (item, index) {
                var match = unsorted.en().where((function (x) { return _this._normalise(x.getLabel()) === item; })).first();
                if (match) {
                    sorted.push(match);
                    var index_1 = unsorted.indexOf(match);
                    if (index_1 > -1) {
                        unsorted.splice(index_1, 1);
                    }
                }
            });
            // add remaining items that were not in the displayOrder.
            unsorted.forEach(function (item, index) {
                sorted.push(item);
            });
            return sorted;
        };
        MetadataComponent.prototype._sortGroups = function (groups, metadataGroupOrder) {
            var sorted = [];
            var unsorted = groups.slice(0);
            metadataGroupOrder.forEach(function (group, index) {
                var match = unsorted.en().where(function (x) { return x.resource.constructor.name.toLowerCase() == group; }).first();
                if (match) {
                    sorted.push(match);
                    var index_2 = unsorted.indexOf(match);
                    if (index_2 > -1) {
                        unsorted.splice(index_2, 1);
                    }
                }
            });
            return sorted;
        };
        MetadataComponent.prototype._label = function (groups, labels) {
            groups.forEach(function (group, index) {
                group.label = labels[index];
            });
        };
        MetadataComponent.prototype._exclude = function (items, excludeConfig) {
            var _this = this;
            excludeConfig.forEach(function (item, index) {
                var match = items.en().where((function (x) { return _this._normalise(x.getLabel()) === item; })).first();
                if (match) {
                    var index_3 = items.indexOf(match);
                    if (index_3 > -1) {
                        items.splice(index_3, 1);
                    }
                }
            });
            return items;
        };
        // private _flatten(items: MetadataItem[]): MetadataItem[] {
        //     // flatten metadata into array.
        //     var flattened: MetadataItem[] = [];
        //     items.forEach(item: any, index: number) => {
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
        //         canvasMetadata.forEach((canvasItem: any, index: number) => {
        //             this._aggregateValues.forEach((value: string, index: number) => {
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
            if (!this._metadataGroups.length) {
                this._$noData.show();
                return;
            }
            this._$noData.hide();
            this._$metadataGroups.empty();
            this._metadataGroups.forEach(function (metadataGroup, index) {
                var $metadataGroup = _this._buildMetadataGroup(metadataGroup);
                _this._$metadataGroups.append($metadataGroup);
                if (_this._data.limitType === IIIFComponents.MetadataComponentOptions.LimitType.LINES) {
                    $metadataGroup.find('.value').toggleExpandTextByLines(_this._data.limit, _this._data.content.less, _this._data.content.more, function () { });
                }
                else if (_this._data.limitType === IIIFComponents.MetadataComponentOptions.LimitType.CHARS) {
                    $metadataGroup.find('.value').ellipsisHtmlFixed(_this._data.limit, function () { });
                }
            });
        };
        MetadataComponent.prototype._buildMetadataGroup = function (metadataGroup) {
            var $metadataGroup = this._$metadataGroupTemplate.clone();
            var $header = $metadataGroup.find('>.header');
            // add group header
            if (metadataGroup.resource.isManifest() && this._data.content.manifestHeader) {
                $header.html(this._sanitize(this._data.content.manifestHeader));
            }
            else if (metadataGroup.resource.isSequence() && this._data.content.sequenceHeader) {
                $header.html(this._sanitize(this._data.content.sequenceHeader));
            }
            else if (metadataGroup.resource.isRange() && this._data.content.rangeHeader) {
                $header.html(this._sanitize(this._data.content.rangeHeader));
            }
            else if (metadataGroup.resource.isCanvas() && (metadataGroup.label || this._data.content.canvasHeader)) {
                var header = metadataGroup.label || this._data.content.canvasHeader;
                $header.html(this._sanitize(header));
            }
            else if (metadataGroup.resource.isAnnotation() && this._data.content.imageHeader) {
                $header.html(this._sanitize(this._data.content.imageHeader));
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
            var urlPattern = new RegExp("/\w+:(\/?\/?)[^\s]+/gm", "i");
            if (label && item.isRootLevel) {
                switch (label.toLowerCase()) {
                    case "attribution":
                        label = this._data.content.attribution;
                        break;
                    case "description":
                        label = this._data.content.description;
                        break;
                    case "license":
                        label = this._data.content.license;
                        break;
                    case "logo":
                        label = this._data.content.logo;
                        break;
                }
            }
            label = this._sanitize(label);
            $label.html(label);
            // rtl?
            this._addReadingDirection($label, this._getLabelLocale(item));
            $metadataItem.addClass(Utils.Strings.toCssClass(label));
            var $value;
            // if the value is a URI
            if (originalLabel && originalLabel.toLowerCase() === "license" && (urlPattern.exec(item.value[0].value) !== null)) {
                $value = this._buildMetadataItemURIValue(item.value[0].value);
                $values.append($value);
            }
            else {
                if (this._data.showAllLanguages && item.value && item.value.length > 1) {
                    // display all values in each locale
                    for (var i = 0; i < item.value.length; i++) {
                        var translation = item.value[i];
                        $value = this._buildMetadataItemValue(translation.value, translation.locale);
                        $values.append($value);
                    }
                }
                else {
                    var valueLocale = this._getValueLocale(item);
                    var valueFound = false;
                    // display all values in the item's locale
                    for (var i = 0; i < item.value.length; i++) {
                        var translation = item.value[i];
                        if (valueLocale.toLowerCase() === translation.locale.toLowerCase()) {
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
            if (this._data.copyToClipboardEnabled && Utils.Clipboard.supportsCopy() && $label.text()) {
                this._addCopyButton($metadataItem, $label, $values);
            }
            return $metadataItem;
        };
        MetadataComponent.prototype._getLabelLocale = function (item) {
            if (!this._data || !this._data.helper) {
                return '';
            }
            var defaultLocale = this._data.helper.options.locale;
            if (item.label.length) {
                var labelLocale = item.label[0].locale;
                if (labelLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
                    return labelLocale;
                }
            }
            return defaultLocale;
        };
        MetadataComponent.prototype._getValueLocale = function (item) {
            if (!this._data || !this._data.helper) {
                return '';
            }
            var defaultLocale = this._data.helper.options.locale;
            // if (item.value.length) {
            //     const valueLocale: string = item.value[0].locale;
            //     if (valueLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
            //         return valueLocale;
            //     }
            // }
            return defaultLocale;
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
            var rtlLanguages = this._readCSV(this._data.rtlLanguageCodes);
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
            }, this._data.copiedMessageDuration);
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
            return this._data.sanitizer(html);
        };
        MetadataComponent.prototype._resize = function () {
        };
        return MetadataComponent;
    }(_Components.BaseComponent));
    IIIFComponents.MetadataComponent = MetadataComponent;
})(IIIFComponents || (IIIFComponents = {}));
(function (IIIFComponents) {
    var MetadataComponent;
    (function (MetadataComponent) {
        var Events = /** @class */ (function () {
            function Events() {
            }
            return Events;
        }());
        MetadataComponent.Events = Events;
    })(MetadataComponent = IIIFComponents.MetadataComponent || (IIIFComponents.MetadataComponent = {}));
})(IIIFComponents || (IIIFComponents = {}));
(function (g) {
    if (!g.IIIFComponents) {
        g.IIIFComponents = IIIFComponents;
    }
    else {
        g.IIIFComponents.MetadataComponent = IIIFComponents.MetadataComponent;
        g.IIIFComponents.MetadataComponentOptions = IIIFComponents.MetadataComponentOptions;
    }
})(global);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});