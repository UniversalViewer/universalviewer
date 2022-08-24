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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLAdapter = void 0;
var UVAdapter_1 = require("../../UVAdapter");
var utils_1 = require("@edsilv/utils");
var IIIFEvents_1 = require("./IIIFEvents");
var Utils_1 = require("../../Utils");
var helpers_1 = require("./helpers");
var URLAdapter = /** @class */ (function (_super) {
    __extends(URLAdapter, _super);
    function URLAdapter(readonly) {
        if (readonly === void 0) { readonly = false; }
        return _super.call(this, readonly) || this;
    }
    URLAdapter.prototype.get = function (key, defaultValue) {
        var hashParameter = utils_1.Urls.getHashParameter(key, document);
        if (hashParameter === null) {
            return defaultValue;
        }
        return hashParameter;
    };
    URLAdapter.prototype.getFragment = function (key, url) {
        var regex = new RegExp("#.*" + key + "=([^&]+)(&|$)");
        var match = regex.exec(url);
        return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null;
    };
    URLAdapter.prototype.set = function (key, value) {
        if (!this.readonly) {
            if (value) {
                utils_1.Urls.setHashParameter(key, value, document);
            }
            else {
                var existing = utils_1.Urls.getHashParameter(key);
                if (existing !== null) {
                    utils_1.Urls.setHashParameter(key, "", document);
                }
            }
        }
    };
    URLAdapter.prototype.getInitialData = function (overrides) {
        var formattedLocales = [];
        var locales = this.get("locales", "");
        if (locales) {
            var names = locales.split(",");
            for (var i in names) {
                var parts = String(names[i]).split(":");
                formattedLocales[i] = { name: parts[0], label: parts[1] };
            }
        }
        else {
            formattedLocales.push(Utils_1.defaultLocale);
        }
        function numberOrUndefined(num) {
            if (num === undefined) {
                return undefined;
            }
            return Number(num);
        }
        // if there's a iiif_content param in the qs, parse out the components of it and use those
        var iiifContent = this.get("iiif-content", "");
        if (iiifContent) {
            var iiifManifestId = "";
            var canvasId = "";
            var xywh = "";
            var contentState = (0, helpers_1.parseContentStateParameter)(iiifContent);
            if (contentState.type === "remote-content-state") {
                iiifManifestId = contentState.id;
            }
            else if (contentState && contentState.target.length) {
                var firstTarget = contentState.target[0];
                if (firstTarget.type === "SpecificResource" &&
                    firstTarget.source.type === "Canvas") {
                    var manifestSource = (firstTarget.source.partOf || []).find(function (s) { return s.type === "Manifest"; });
                    // get canvas selector
                    if (firstTarget.selector &&
                        firstTarget.selector.type === "BoxSelector") {
                        canvasId = firstTarget.source.id;
                        xywh =
                            firstTarget.selector.x +
                                "," +
                                firstTarget.selector.y +
                                "," +
                                firstTarget.selector.width +
                                "," +
                                firstTarget.selector.height;
                    }
                    if (manifestSource) {
                        iiifManifestId = manifestSource.id;
                    }
                }
            }
            return __assign({ iiifManifestId: iiifManifestId, collectionIndex: undefined, manifestIndex: 0, canvasId: canvasId, canvasIndex: 0, rotation: 0, rangeId: "", xywh: xywh, target: "", 
                // cfi: this.get<string>("cfi", ""),
                // youTubeVideoId: this.get<string>("youTubeVideoId", ""),
                locales: formattedLocales.length ? formattedLocales : undefined }, overrides);
        }
        return __assign({ iiifManifestId: this.get("iiifManifestId") || this.get("manifest"), collectionIndex: numberOrUndefined(this.get("c")), manifestIndex: Number(this.get("m", 0)), canvasIndex: Number(this.get("cv", 0)), rotation: Number(this.get("r", 0)), rangeId: this.get("rid", ""), xywh: this.get("xywh", ""), target: this.get("target", ""), 
            // cfi: this.get<string>("cfi", ""),
            // youTubeVideoId: this.get<string>("youTubeVideoId", ""),
            locales: formattedLocales.length ? formattedLocales : undefined }, overrides);
    };
    URLAdapter.prototype.dispose = function () {
        history.pushState("", document.title, window.location.pathname + window.location.search);
    };
    URLAdapter.prototype.bindTo = function (uv) {
        var _this = this;
        uv.adapter = this;
        // Removing this for now, as t={time} does not line up with what the
        // user will see when they reload the page.
        // uv.on(
        //   IIIFEvents.PAUSE,
        //   (currentTime) => {
        //     if (currentTime > 0) {
        //       this.set("t", currentTime);
        //     }
        //   },
        //   false
        // );
        uv.on(IIIFEvents_1.IIIFEvents.COLLECTION_INDEX_CHANGE, function (collectionIndex) {
            _this.set("c", collectionIndex);
        }, false);
        uv.on(IIIFEvents_1.IIIFEvents.MANIFEST_INDEX_CHANGE, function (manifestIndex) {
            _this.set("m", manifestIndex);
        }, false);
        uv.on(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function (canvasIndex) {
            _this.set("cv", canvasIndex);
        }, false);
        uv.on(IIIFEvents_1.IIIFEvents.RANGE_CHANGE, function (range) {
            var rangeId = !range || typeof range === 'string' ? range : range.id;
            _this.set("rid", rangeId);
        }, false);
        uv.on(IIIFEvents_1.IIIFEvents.TARGET_CHANGE, function (target) {
            _this.set("xywh", _this.getFragment("xywh", target));
        }, false);
    };
    return URLAdapter;
}(UVAdapter_1.UVAdapter));
exports.URLAdapter = URLAdapter;
//# sourceMappingURL=URLAdapter.js.map