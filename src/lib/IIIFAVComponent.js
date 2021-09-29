(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("IIIFAVComponent", [], factory);
	else if(typeof exports === 'object')
		exports["IIIFAVComponent"] = factory();
	else
		root["IIIFAVComponent"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 36);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AnnotationMotivation;
(function (AnnotationMotivation) {
    AnnotationMotivation["BOOKMARKING"] = "oa:bookmarking";
    AnnotationMotivation["CLASSIFYING"] = "oa:classifying";
    AnnotationMotivation["COMMENTING"] = "oa:commenting";
    AnnotationMotivation["DESCRIBING"] = "oa:describing";
    AnnotationMotivation["EDITING"] = "oa:editing";
    AnnotationMotivation["HIGHLIGHTING"] = "oa:highlighting";
    AnnotationMotivation["IDENTIFYING"] = "oa:identifying";
    AnnotationMotivation["LINKING"] = "oa:linking";
    AnnotationMotivation["MODERATING"] = "oa:moderating";
    AnnotationMotivation["PAINTING"] = "sc:painting";
    AnnotationMotivation["QUESTIONING"] = "oa:questioning";
    AnnotationMotivation["REPLYING"] = "oa:replying";
    AnnotationMotivation["TAGGING"] = "oa:tagging";
    AnnotationMotivation["TRANSCRIBING"] = "oad:transcribing";
})(AnnotationMotivation = exports.AnnotationMotivation || (exports.AnnotationMotivation = {}));
var Behavior;
(function (Behavior) {
    Behavior["AUTO_ADVANCE"] = "auto-advance";
    Behavior["CONTINUOUS"] = "continuous";
    Behavior["FACING_PAGES"] = "facing-pages";
    Behavior["HIDDEN"] = "hidden";
    Behavior["INDIVIDUALS"] = "individuals";
    Behavior["MULTI_PART"] = "multi-part";
    Behavior["NO_NAV"] = "no-nav";
    Behavior["NON_PAGED"] = "non-paged";
    Behavior["PAGED"] = "paged";
    Behavior["REPEAT"] = "repeat";
    Behavior["SEQUENCE"] = "sequence";
    Behavior["THUMBNAIL_NAV"] = "thumbnail-nav";
    Behavior["TOGETHER"] = "together";
    Behavior["UNORDERED"] = "unordered";
})(Behavior = exports.Behavior || (exports.Behavior = {}));
var ExternalResourceType;
(function (ExternalResourceType) {
    ExternalResourceType["CANVAS"] = "canvas";
    ExternalResourceType["CHOICE"] = "choice";
    ExternalResourceType["OA_CHOICE"] = "oa:choice";
    ExternalResourceType["CONTENT_AS_TEXT"] = "contentastext";
    ExternalResourceType["DATASET"] = "dataset";
    ExternalResourceType["DOCUMENT"] = "document";
    ExternalResourceType["IMAGE"] = "image";
    ExternalResourceType["MODEL"] = "model";
    ExternalResourceType["MOVING_IMAGE"] = "movingimage";
    ExternalResourceType["PDF"] = "pdf";
    ExternalResourceType["PHYSICAL_OBJECT"] = "physicalobject";
    ExternalResourceType["SOUND"] = "sound";
    ExternalResourceType["TEXT"] = "text";
    ExternalResourceType["TEXTUALBODY"] = "textualbody";
    ExternalResourceType["VIDEO"] = "video";
})(ExternalResourceType = exports.ExternalResourceType || (exports.ExternalResourceType = {}));
var IIIFResourceType;
(function (IIIFResourceType) {
    IIIFResourceType["ANNOTATION"] = "annotation";
    IIIFResourceType["CANVAS"] = "canvas";
    IIIFResourceType["COLLECTION"] = "collection";
    IIIFResourceType["MANIFEST"] = "manifest";
    IIIFResourceType["RANGE"] = "range";
    IIIFResourceType["SEQUENCE"] = "sequence";
})(IIIFResourceType = exports.IIIFResourceType || (exports.IIIFResourceType = {}));
var MediaType;
(function (MediaType) {
    MediaType["AUDIO_MP4"] = "audio/mp4";
    MediaType["CORTO"] = "application/corto";
    MediaType["DICOM"] = "application/dicom";
    MediaType["DRACO"] = "application/draco";
    MediaType["EPUB"] = "application/epub+zip";
    MediaType["GLB"] = "model/gltf-binary";
    MediaType["GLTF"] = "model/gltf+json";
    MediaType["IIIF_PRESENTATION_2"] = "application/ld+json;profile=\"http://iiif.io/api/presentation/2/context.json\"";
    MediaType["IIIF_PRESENTATION_3"] = "application/ld+json;profile=\"http://iiif.io/api/presentation/3/context.json\"";
    MediaType["JPG"] = "image/jpeg";
    MediaType["M3U8"] = "application/vnd.apple.mpegurl";
    MediaType["MP3"] = "audio/mp3";
    MediaType["MPEG_DASH"] = "application/dash+xml";
    MediaType["OBJ"] = "text/plain";
    MediaType["OPF"] = "application/oebps-package+xml";
    MediaType["PDF"] = "application/pdf";
    MediaType["PLY"] = "application/ply";
    MediaType["THREEJS"] = "application/vnd.threejs+json";
    MediaType["USDZ"] = "model/vnd.usd+zip";
    MediaType["VIDEO_MP4"] = "video/mp4";
    MediaType["WEBM"] = "video/webm";
})(MediaType = exports.MediaType || (exports.MediaType = {}));
var RenderingFormat;
(function (RenderingFormat) {
    RenderingFormat["DOC"] = "application/msword";
    RenderingFormat["DOCX"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    RenderingFormat["PDF"] = "application/pdf";
})(RenderingFormat = exports.RenderingFormat || (exports.RenderingFormat = {}));
var ServiceProfile;
(function (ServiceProfile) {
    // image api
    ServiceProfile["IMAGE_0_COMPLIANCE_LEVEL_0"] = "http://library.stanford.edu/iiif/image-api/compliance.html#level0";
    ServiceProfile["IMAGE_0_COMPLIANCE_LEVEL_1"] = "http://library.stanford.edu/iiif/image-api/compliance.html#level1";
    ServiceProfile["IMAGE_0_COMPLIANCE_LEVEL_2"] = "http://library.stanford.edu/iiif/image-api/compliance.html#level2";
    ServiceProfile["IMAGE_0_CONFORMANCE_LEVEL_0"] = "http://library.stanford.edu/iiif/image-api/conformance.html#level0";
    ServiceProfile["IMAGE_0_CONFORMANCE_LEVEL_1"] = "http://library.stanford.edu/iiif/image-api/conformance.html#level1";
    ServiceProfile["IMAGE_0_CONFORMANCE_LEVEL_2"] = "http://library.stanford.edu/iiif/image-api/conformance.html#level2";
    ServiceProfile["IMAGE_1_COMPLIANCE_LEVEL_0"] = "http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level0";
    ServiceProfile["IMAGE_1_COMPLIANCE_LEVEL_1"] = "http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level1";
    ServiceProfile["IMAGE_1_COMPLIANCE_LEVEL_2"] = "http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level2";
    ServiceProfile["IMAGE_1_CONFORMANCE_LEVEL_0"] = "http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level0";
    ServiceProfile["IMAGE_1_CONFORMANCE_LEVEL_1"] = "http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level1";
    ServiceProfile["IMAGE_1_CONFORMANCE_LEVEL_2"] = "http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level2";
    ServiceProfile["IMAGE_1_LEVEL_0"] = "http://iiif.io/api/image/1/level0.json";
    ServiceProfile["IMAGE_1_PROFILE_LEVEL_0"] = "http://iiif.io/api/image/1/profiles/level0.json";
    ServiceProfile["IMAGE_1_LEVEL_1"] = "http://iiif.io/api/image/1/level1.json";
    ServiceProfile["IMAGE_1_PROFILE_LEVEL_1"] = "http://iiif.io/api/image/1/profiles/level1.json";
    ServiceProfile["IMAGE_1_LEVEL_2"] = "http://iiif.io/api/image/1/level2.json";
    ServiceProfile["IMAGE_1_PROFILE_LEVEL_2"] = "http://iiif.io/api/image/1/profiles/level2.json";
    ServiceProfile["IMAGE_2_LEVEL_0"] = "http://iiif.io/api/image/2/level0.json";
    ServiceProfile["IMAGE_2_PROFILE_LEVEL_0"] = "http://iiif.io/api/image/2/profiles/level0.json";
    ServiceProfile["IMAGE_2_LEVEL_1"] = "http://iiif.io/api/image/2/level1.json";
    ServiceProfile["IMAGE_2_PROFILE_LEVEL_1"] = "http://iiif.io/api/image/2/profiles/level1.json";
    ServiceProfile["IMAGE_2_LEVEL_2"] = "http://iiif.io/api/image/2/level2.json";
    ServiceProfile["IMAGE_2_PROFILE_LEVEL_2"] = "http://iiif.io/api/image/2/profiles/level2.json";
    // auth api
    ServiceProfile["AUTH_0_CLICK_THROUGH"] = "http://iiif.io/api/auth/0/login/clickthrough";
    ServiceProfile["AUTH_0_LOGIN"] = "http://iiif.io/api/auth/0/login";
    ServiceProfile["AUTH_0_LOGOUT"] = "http://iiif.io/api/auth/0/logout";
    ServiceProfile["AUTH_0_RESTRICTED"] = "http://iiif.io/api/auth/0/login/restricted";
    ServiceProfile["AUTH_0_TOKEN"] = "http://iiif.io/api/auth/0/token";
    ServiceProfile["AUTH_1_CLICK_THROUGH"] = "http://iiif.io/api/auth/1/clickthrough";
    ServiceProfile["AUTH_1_EXTERNAL"] = "http://iiif.io/api/auth/1/external";
    ServiceProfile["AUTH_1_KIOSK"] = "http://iiif.io/api/auth/1/kiosk";
    ServiceProfile["AUTH_1_LOGIN"] = "http://iiif.io/api/auth/1/login";
    ServiceProfile["AUTH_1_LOGOUT"] = "http://iiif.io/api/auth/1/logout";
    ServiceProfile["AUTH_1_PROBE"] = "http://iiif.io/api/auth/1/probe";
    ServiceProfile["AUTH_1_TOKEN"] = "http://iiif.io/api/auth/1/token";
    // search api
    ServiceProfile["SEARCH_0"] = "http://iiif.io/api/search/0/search";
    ServiceProfile["SEARCH_0_AUTO_COMPLETE"] = "http://iiif.io/api/search/0/autocomplete";
    ServiceProfile["SEARCH_1"] = "http://iiif.io/api/search/1/search";
    ServiceProfile["SEARCH_1_AUTO_COMPLETE"] = "http://iiif.io/api/search/1/autocomplete";
    // extensions
    ServiceProfile["TRACKING_EXTENSIONS"] = "http://universalviewer.io/tracking-extensions-profile";
    ServiceProfile["UI_EXTENSIONS"] = "http://universalviewer.io/ui-extensions-profile";
    ServiceProfile["PRINT_EXTENSIONS"] = "http://universalviewer.io/print-extensions-profile";
    ServiceProfile["SHARE_EXTENSIONS"] = "http://universalviewer.io/share-extensions-profile";
    // other
    ServiceProfile["OTHER_MANIFESTATIONS"] = "http://iiif.io/api/otherManifestations.json";
    ServiceProfile["IXIF"] = "http://wellcomelibrary.org/ld/ixif/0/alpha.json";
})(ServiceProfile = exports.ServiceProfile || (exports.ServiceProfile = {}));
var ViewingDirection;
(function (ViewingDirection) {
    ViewingDirection["BOTTOM_TO_TOP"] = "bottom-to-top";
    ViewingDirection["LEFT_TO_RIGHT"] = "left-to-right";
    ViewingDirection["RIGHT_TO_LEFT"] = "right-to-left";
    ViewingDirection["TOP_TO_BOTTOM"] = "top-to-bottom";
})(ViewingDirection = exports.ViewingDirection || (exports.ViewingDirection = {}));
var ViewingHint;
(function (ViewingHint) {
    ViewingHint["CONTINUOUS"] = "continuous";
    ViewingHint["INDIVIDUALS"] = "individuals";
    ViewingHint["NON_PAGED"] = "non-paged";
    ViewingHint["PAGED"] = "paged";
    ViewingHint["TOP"] = "top";
})(ViewingHint = exports.ViewingHint || (exports.ViewingHint = {}));
//# sourceMappingURL=index.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTINUE = 100;
exports.SWITCHING_PROTOCOLS = 101;
exports.PROCESSING = 102;
exports.OK = 200;
exports.CREATED = 201;
exports.ACCEPTED = 202;
exports.NON_AUTHORITATIVE_INFORMATION = 203;
exports.NO_CONTENT = 204;
exports.RESET_CONTENT = 205;
exports.PARTIAL_CONTENT = 206;
exports.MULTI_STATUS = 207;
exports.MULTIPLE_CHOICES = 300;
exports.MOVED_PERMANENTLY = 301;
exports.MOVED_TEMPORARILY = 302;
exports.SEE_OTHER = 303;
exports.NOT_MODIFIED = 304;
exports.USE_PROXY = 305;
exports.TEMPORARY_REDIRECT = 307;
exports.BAD_REQUEST = 400;
exports.UNAUTHORIZED = 401;
exports.PAYMENT_REQUIRED = 402;
exports.FORBIDDEN = 403;
exports.NOT_FOUND = 404;
exports.METHOD_NOT_ALLOWED = 405;
exports.NOT_ACCEPTABLE = 406;
exports.PROXY_AUTHENTICATION_REQUIRED = 407;
exports.REQUEST_TIME_OUT = 408;
exports.CONFLICT = 409;
exports.GONE = 410;
exports.LENGTH_REQUIRED = 411;
exports.PRECONDITION_FAILED = 412;
exports.REQUEST_ENTITY_TOO_LARGE = 413;
exports.REQUEST_URI_TOO_LARGE = 414;
exports.UNSUPPORTED_MEDIA_TYPE = 415;
exports.REQUESTED_RANGE_NOT_SATISFIABLE = 416;
exports.EXPECTATION_FAILED = 417;
exports.IM_A_TEAPOT = 418;
exports.UNPROCESSABLE_ENTITY = 422;
exports.LOCKED = 423;
exports.FAILED_DEPENDENCY = 424;
exports.UNORDERED_COLLECTION = 425;
exports.UPGRADE_REQUIRED = 426;
exports.PRECONDITION_REQUIRED = 428;
exports.TOO_MANY_REQUESTS = 429;
exports.REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
exports.INTERNAL_SERVER_ERROR = 500;
exports.NOT_IMPLEMENTED = 501;
exports.BAD_GATEWAY = 502;
exports.SERVICE_UNAVAILABLE = 503;
exports.GATEWAY_TIME_OUT = 504;
exports.HTTP_VERSION_NOT_SUPPORTED = 505;
exports.VARIANT_ALSO_NEGOTIATES = 506;
exports.INSUFFICIENT_STORAGE = 507;
exports.BANDWIDTH_LIMIT_EXCEEDED = 509;
exports.NOT_EXTENDED = 510;
exports.NETWORK_AUTHENTICATION_REQUIRED = 511;
//# sourceMappingURL=index.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var IS_DEV =  false && false;
var isDev = function () { return IS_DEV || (window && window.__DEBUG_AV_COMPONENT__); };
exports.Logger = {
    log: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isDev()) {
            console.log.apply(console, args);
        }
    },
    warn: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isDev()) {
            console.warn.apply(console, args);
        }
    },
    error: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isDev()) {
            console.error.apply(console, args);
        }
    },
    groupCollapsed: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isDev()) {
            console.groupCollapsed.apply(console, args);
        }
    },
    group: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isDev()) {
            console.group.apply(console, args);
        }
    },
    groupEnd: function () {
        if (isDev()) {
            console.groupEnd();
        }
    },
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "JSONLDResource", function() { return /* reexport */ JSONLDResource; });
__webpack_require__.d(__webpack_exports__, "ManifestResource", function() { return /* reexport */ ManifestResource_ManifestResource; });
__webpack_require__.d(__webpack_exports__, "Resource", function() { return /* reexport */ Resource_Resource; });
__webpack_require__.d(__webpack_exports__, "IIIFResource", function() { return /* reexport */ IIIFResource_IIIFResource; });
__webpack_require__.d(__webpack_exports__, "Annotation", function() { return /* reexport */ Annotation_Annotation; });
__webpack_require__.d(__webpack_exports__, "AnnotationBody", function() { return /* reexport */ AnnotationBody_AnnotationBody; });
__webpack_require__.d(__webpack_exports__, "AnnotationList", function() { return /* reexport */ AnnotationList_AnnotationList; });
__webpack_require__.d(__webpack_exports__, "AnnotationPage", function() { return /* reexport */ AnnotationPage; });
__webpack_require__.d(__webpack_exports__, "Canvas", function() { return /* reexport */ Canvas_Canvas; });
__webpack_require__.d(__webpack_exports__, "Collection", function() { return /* reexport */ Collection_Collection; });
__webpack_require__.d(__webpack_exports__, "Duration", function() { return /* reexport */ Duration; });
__webpack_require__.d(__webpack_exports__, "LabelValuePair", function() { return /* reexport */ LabelValuePair_LabelValuePair; });
__webpack_require__.d(__webpack_exports__, "LanguageMap", function() { return /* reexport */ LanguageMap; });
__webpack_require__.d(__webpack_exports__, "LocalizedValue", function() { return /* reexport */ LocalizedValue; });
__webpack_require__.d(__webpack_exports__, "PropertyValue", function() { return /* reexport */ PropertyValue_PropertyValue; });
__webpack_require__.d(__webpack_exports__, "Manifest", function() { return /* reexport */ Manifest_Manifest; });
__webpack_require__.d(__webpack_exports__, "ManifestType", function() { return /* reexport */ ManifestType; });
__webpack_require__.d(__webpack_exports__, "Range", function() { return /* reexport */ Range_Range; });
__webpack_require__.d(__webpack_exports__, "Rendering", function() { return /* reexport */ Rendering; });
__webpack_require__.d(__webpack_exports__, "Sequence", function() { return /* reexport */ Sequence_Sequence; });
__webpack_require__.d(__webpack_exports__, "Deserialiser", function() { return /* reexport */ Serialisation_Deserialiser; });
__webpack_require__.d(__webpack_exports__, "Service", function() { return /* reexport */ Service_Service; });
__webpack_require__.d(__webpack_exports__, "Size", function() { return /* reexport */ Size; });
__webpack_require__.d(__webpack_exports__, "StatusCode", function() { return /* reexport */ StatusCode; });
__webpack_require__.d(__webpack_exports__, "Thumb", function() { return /* reexport */ Thumb; });
__webpack_require__.d(__webpack_exports__, "Thumbnail", function() { return /* reexport */ Thumbnail; });
__webpack_require__.d(__webpack_exports__, "TreeNode", function() { return /* reexport */ TreeNode_TreeNode; });
__webpack_require__.d(__webpack_exports__, "TreeNodeType", function() { return /* reexport */ TreeNodeType; });
__webpack_require__.d(__webpack_exports__, "Utils", function() { return /* reexport */ Utils_Utils; });
__webpack_require__.d(__webpack_exports__, "loadManifest", function() { return /* binding */ loadManifest; });
__webpack_require__.d(__webpack_exports__, "parseManifest", function() { return /* binding */ parseManifest; });

// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/JSONLDResource.js
var JSONLDResource = /** @class */ (function () {
    function JSONLDResource(jsonld) {
        this.__jsonld = jsonld;
        this.context = this.getProperty("context");
        this.id = this.getProperty("id");
    }
    JSONLDResource.prototype.getProperty = function (name) {
        var prop = null;
        if (this.__jsonld) {
            prop = this.__jsonld[name];
            if (!prop) {
                // property may have a prepended '@'
                prop = this.__jsonld["@" + name];
            }
        }
        return prop;
    };
    return JSONLDResource;
}());

//# sourceMappingURL=JSONLDResource.js.map
// EXTERNAL MODULE: ./node_modules/@iiif/vocabulary/dist-commonjs/index.js
var dist_commonjs = __webpack_require__(0);

// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/ManifestResource.js
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var ManifestResource_ManifestResource = /** @class */ (function (_super) {
    __extends(ManifestResource, _super);
    function ManifestResource(jsonld, options) {
        var _this = _super.call(this, jsonld) || this;
        _this.options = options;
        return _this;
    }
    ManifestResource.prototype.getIIIFResourceType = function () {
        return Utils_Utils.normaliseType(this.getProperty("type"));
    };
    ManifestResource.prototype.getLabel = function () {
        var label = this.getProperty("label");
        if (label) {
            return PropertyValue_PropertyValue.parse(label, this.options.locale);
        }
        return new PropertyValue_PropertyValue([], this.options.locale);
    };
    ManifestResource.prototype.getDefaultLabel = function () {
        return this.getLabel().getValue(this.options.locale);
    };
    ManifestResource.prototype.getMetadata = function () {
        var _metadata = this.getProperty("metadata");
        var metadata = [];
        if (!_metadata)
            return metadata;
        for (var i = 0; i < _metadata.length; i++) {
            var item = _metadata[i];
            var metadataItem = new LabelValuePair_LabelValuePair(this.options.locale);
            metadataItem.parse(item);
            metadata.push(metadataItem);
        }
        return metadata;
    };
    ManifestResource.prototype.getRendering = function (format) {
        var renderings = this.getRenderings();
        for (var i = 0; i < renderings.length; i++) {
            var rendering = renderings[i];
            if (rendering.getFormat() === format) {
                return rendering;
            }
        }
        return null;
    };
    ManifestResource.prototype.getRenderings = function () {
        var rendering;
        // if passing a manifesto-parsed object, use the __jsonld.rendering property,
        // otherwise look for a rendering property
        if (this.__jsonld) {
            rendering = this.__jsonld.rendering;
        }
        else {
            rendering = this.rendering;
        }
        var renderings = [];
        if (!rendering)
            return renderings;
        // coerce to array
        if (!Array.isArray(rendering)) {
            rendering = [rendering];
        }
        for (var i = 0; i < rendering.length; i++) {
            var r = rendering[i];
            renderings.push(new Rendering(r, this.options));
        }
        return renderings;
    };
    ManifestResource.prototype.getService = function (profile) {
        return Utils_Utils.getService(this, profile);
    };
    ManifestResource.prototype.getServices = function () {
        return Utils_Utils.getServices(this);
    };
    ManifestResource.prototype.getThumbnail = function () {
        var thumbnail = this.getProperty("thumbnail");
        if (Array.isArray(thumbnail)) {
            thumbnail = thumbnail[0];
        }
        if (thumbnail) {
            return new Thumbnail(thumbnail, this.options);
        }
        return null;
    };
    ManifestResource.prototype.isAnnotation = function () {
        return this.getIIIFResourceType() === dist_commonjs["IIIFResourceType"].ANNOTATION;
    };
    ManifestResource.prototype.isCanvas = function () {
        return this.getIIIFResourceType() === dist_commonjs["IIIFResourceType"].CANVAS;
    };
    ManifestResource.prototype.isCollection = function () {
        return this.getIIIFResourceType() === dist_commonjs["IIIFResourceType"].COLLECTION;
    };
    ManifestResource.prototype.isManifest = function () {
        return this.getIIIFResourceType() === dist_commonjs["IIIFResourceType"].MANIFEST;
    };
    ManifestResource.prototype.isRange = function () {
        return this.getIIIFResourceType() === dist_commonjs["IIIFResourceType"].RANGE;
    };
    ManifestResource.prototype.isSequence = function () {
        return this.getIIIFResourceType() === dist_commonjs["IIIFResourceType"].SEQUENCE;
    };
    return ManifestResource;
}(JSONLDResource));

//# sourceMappingURL=ManifestResource.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Resource.js
var Resource_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Resource_Resource = /** @class */ (function (_super) {
    Resource_extends(Resource, _super);
    function Resource(jsonld, options) {
        return _super.call(this, jsonld, options) || this;
    }
    Resource.prototype.getFormat = function () {
        var format = this.getProperty("format");
        if (format) {
            return format.toLowerCase();
        }
        return null;
    };
    Resource.prototype.getResources = function () {
        var resources = [];
        if (!this.__jsonld.resources)
            return resources;
        for (var i = 0; i < this.__jsonld.resources.length; i++) {
            var a = this.__jsonld.resources[i];
            var annotation = new Annotation_Annotation(a, this.options);
            resources.push(annotation);
        }
        return resources;
    };
    Resource.prototype.getType = function () {
        var type = this.getProperty("type");
        if (type) {
            return Utils_Utils.normaliseType(type);
        }
        return null;
    };
    Resource.prototype.getWidth = function () {
        return this.getProperty("width");
    };
    Resource.prototype.getHeight = function () {
        return this.getProperty("height");
    };
    Resource.prototype.getMaxWidth = function () {
        return this.getProperty("maxWidth");
    };
    Resource.prototype.getMaxHeight = function () {
        var maxHeight = this.getProperty("maxHeight");
        // if a maxHeight hasn't been specified, default to maxWidth.
        // maxWidth in essence becomes maxEdge
        if (!maxHeight) {
            return this.getMaxWidth();
        }
        return null;
    };
    return Resource;
}(ManifestResource_ManifestResource));

//# sourceMappingURL=Resource.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/IIIFResource.js
var IIIFResource_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var IIIFResource_IIIFResource = /** @class */ (function (_super) {
    IIIFResource_extends(IIIFResource, _super);
    function IIIFResource(jsonld, options) {
        var _this = _super.call(this, jsonld, options) || this;
        _this.index = -1;
        _this.isLoaded = false;
        var defaultOptions = {
            defaultLabel: "-",
            locale: "en-GB",
            resource: _this,
            pessimisticAccessControl: false
        };
        _this.options = Object.assign(defaultOptions, options);
        return _this;
    }
    /**
     * @deprecated
     */
    IIIFResource.prototype.getAttribution = function () {
        //console.warn('getAttribution will be deprecated, use getRequiredStatement instead.');
        var attribution = this.getProperty("attribution");
        if (attribution) {
            return PropertyValue_PropertyValue.parse(attribution, this.options.locale);
        }
        return new PropertyValue_PropertyValue([], this.options.locale);
    };
    IIIFResource.prototype.getDescription = function () {
        var description = this.getProperty("description");
        if (description) {
            return PropertyValue_PropertyValue.parse(description, this.options.locale);
        }
        return new PropertyValue_PropertyValue([], this.options.locale);
    };
    IIIFResource.prototype.getHomepage = function () {
        var homepage = this.getProperty("homepage");
        if (!homepage)
            return null;
        if (typeof homepage == "string")
            return homepage;
        if (Array.isArray(homepage) && homepage.length) {
            homepage = homepage[0];
        }
        return homepage["@id"] || homepage.id;
    };
    IIIFResource.prototype.getIIIFResourceType = function () {
        return Utils_Utils.normaliseType(this.getProperty("type"));
    };
    IIIFResource.prototype.getLogo = function () {
        var logo = this.getProperty("logo");
        if (!logo)
            return null;
        if (typeof logo === "string")
            return logo;
        if (Array.isArray(logo) && logo.length) {
            logo = logo[0];
        }
        return logo["@id"] || logo.id;
    };
    IIIFResource.prototype.getLicense = function () {
        return Utils_Utils.getLocalisedValue(this.getProperty("license"), this.options.locale);
    };
    IIIFResource.prototype.getNavDate = function () {
        return new Date(this.getProperty("navDate"));
    };
    IIIFResource.prototype.getRelated = function () {
        return this.getProperty("related");
    };
    IIIFResource.prototype.getSeeAlso = function () {
        return this.getProperty("seeAlso");
    };
    IIIFResource.prototype.getTrackingLabel = function () {
        var service = (this.getService(dist_commonjs["ServiceProfile"].TRACKING_EXTENSIONS));
        if (service) {
            return service.getProperty("trackingLabel");
        }
        return "";
    };
    IIIFResource.prototype.getDefaultTree = function () {
        this.defaultTree = new TreeNode_TreeNode("root");
        this.defaultTree.data = this;
        return this.defaultTree;
    };
    IIIFResource.prototype.getRequiredStatement = function () {
        var requiredStatement = null;
        var _requiredStatement = this.getProperty("requiredStatement");
        if (_requiredStatement) {
            requiredStatement = new LabelValuePair_LabelValuePair(this.options.locale);
            requiredStatement.parse(_requiredStatement);
        }
        else {
            // fall back to attribution (if it exists)
            var attribution = this.getAttribution();
            if (attribution) {
                requiredStatement = new LabelValuePair_LabelValuePair(this.options.locale);
                requiredStatement.value = attribution;
            }
        }
        return requiredStatement;
    };
    IIIFResource.prototype.isCollection = function () {
        if (this.getIIIFResourceType() === dist_commonjs["IIIFResourceType"].COLLECTION) {
            return true;
        }
        return false;
    };
    IIIFResource.prototype.isManifest = function () {
        if (this.getIIIFResourceType() === dist_commonjs["IIIFResourceType"].MANIFEST) {
            return true;
        }
        return false;
    };
    IIIFResource.prototype.load = function () {
        var that = this;
        return new Promise(function (resolve) {
            if (that.isLoaded) {
                resolve(that);
            }
            else {
                var options_1 = that.options;
                options_1.navDate = that.getNavDate();
                var id = that.__jsonld.id;
                if (!id) {
                    id = that.__jsonld["@id"];
                }
                Utils_Utils.loadManifest(id).then(function (data) {
                    that.parentLabel = that.getLabel().getValue(options_1.locale);
                    var parsed = Serialisation_Deserialiser.parse(data, options_1);
                    that = Object.assign(that, parsed);
                    //that.parentCollection = options.resource.parentCollection;
                    that.index = options_1.index;
                    resolve(that);
                });
            }
        });
    };
    return IIIFResource;
}(ManifestResource_ManifestResource));

//# sourceMappingURL=IIIFResource.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Annotation.js
var Annotation_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Annotation_Annotation = /** @class */ (function (_super) {
    Annotation_extends(Annotation, _super);
    function Annotation(jsonld, options) {
        return _super.call(this, jsonld, options) || this;
    }
    Annotation.prototype.getBody = function () {
        var bodies = [];
        var body = this.getProperty("body");
        // todo: make this a generic "property that can be an object or array enumerator" util
        if (body) {
            if (Array.isArray(body)) {
                for (var i = 0; i < body.length; i++) {
                    var b = body[i];
                    if (b.items) {
                        for (var i_1 = 0; i_1 < b.items.length; i_1++) {
                            // todo: don't ignore that it's a choice. maybe add isChoice() to IAnnotationBody?
                            var c = b.items[i_1];
                            bodies.push(new AnnotationBody_AnnotationBody(c, this.options));
                        }
                    }
                    else {
                        bodies.push(new AnnotationBody_AnnotationBody(b, this.options));
                    }
                }
            }
            else if (body.items) {
                for (var i = 0; i < body.items.length; i++) {
                    var b = body.items[i];
                    bodies.push(new AnnotationBody_AnnotationBody(b, this.options));
                }
            }
            else {
                bodies.push(new AnnotationBody_AnnotationBody(body, this.options));
            }
        }
        return bodies;
    };
    Annotation.prototype.getMotivation = function () {
        var motivation = this.getProperty("motivation");
        if (motivation) {
            //const key: string | undefined = Object.keys(AnnotationMotivationEnum).find(k => AnnotationMotivationEnum[k] === motivation);
            return motivation;
        }
        return null;
    };
    // open annotation
    Annotation.prototype.getOn = function () {
        return this.getProperty("on");
    };
    Annotation.prototype.getTarget = function () {
        return this.getProperty("target");
    };
    Annotation.prototype.getResource = function () {
        return new Resource_Resource(this.getProperty("resource"), this.options);
    };
    return Annotation;
}(ManifestResource_ManifestResource));

//# sourceMappingURL=Annotation.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/AnnotationBody.js
var AnnotationBody_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var AnnotationBody_AnnotationBody = /** @class */ (function (_super) {
    AnnotationBody_extends(AnnotationBody, _super);
    function AnnotationBody(jsonld, options) {
        return _super.call(this, jsonld, options) || this;
    }
    AnnotationBody.prototype.getFormat = function () {
        var format = this.getProperty("format");
        if (format) {
            return Utils_Utils.getMediaType(format);
        }
        return null;
    };
    AnnotationBody.prototype.getType = function () {
        var type = this.getProperty("type");
        if (type) {
            return (Utils_Utils.normaliseType(this.getProperty("type")));
        }
        return null;
    };
    AnnotationBody.prototype.getWidth = function () {
        return this.getProperty("width");
    };
    AnnotationBody.prototype.getHeight = function () {
        return this.getProperty("height");
    };
    return AnnotationBody;
}(ManifestResource_ManifestResource));

//# sourceMappingURL=AnnotationBody.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/AnnotationList.js
var AnnotationList_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var AnnotationList_AnnotationList = /** @class */ (function (_super) {
    AnnotationList_extends(AnnotationList, _super);
    function AnnotationList(label, jsonld, options) {
        var _this = _super.call(this, jsonld) || this;
        _this.label = label;
        _this.options = options;
        return _this;
    }
    AnnotationList.prototype.getIIIFResourceType = function () {
        return Utils_Utils.normaliseType(this.getProperty("type"));
    };
    AnnotationList.prototype.getLabel = function () {
        return this.label;
    };
    AnnotationList.prototype.getResources = function () {
        var _this = this;
        var resources = this.getProperty("resources");
        return resources.map(function (resource) { return new Annotation_Annotation(resource, _this.options); });
    };
    AnnotationList.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.isLoaded) {
                resolve(_this);
            }
            else {
                var id = _this.__jsonld.id;
                if (!id) {
                    id = _this.__jsonld["@id"];
                }
                Utils_Utils.loadManifest(id)
                    .then(function (data) {
                    _this.__jsonld = data;
                    _this.context = _this.getProperty("context");
                    _this.id = _this.getProperty("id");
                    _this.isLoaded = true;
                    resolve(_this);
                })
                    .catch(reject);
            }
        });
    };
    return AnnotationList;
}(JSONLDResource));

//# sourceMappingURL=AnnotationList.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/AnnotationPage.js
var AnnotationPage_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var AnnotationPage = /** @class */ (function (_super) {
    AnnotationPage_extends(AnnotationPage, _super);
    function AnnotationPage(jsonld, options) {
        return _super.call(this, jsonld, options) || this;
    }
    AnnotationPage.prototype.getItems = function () {
        return this.getProperty("items");
    };
    return AnnotationPage;
}(ManifestResource_ManifestResource));

//# sourceMappingURL=AnnotationPage.js.map
// EXTERNAL MODULE: ./node_modules/lodash/flatten.js
var flatten = __webpack_require__(7);
var flatten_default = /*#__PURE__*/__webpack_require__.n(flatten);

// EXTERNAL MODULE: ./node_modules/lodash/flattenDeep.js
var flattenDeep = __webpack_require__(21);
var flattenDeep_default = /*#__PURE__*/__webpack_require__.n(flattenDeep);

// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Canvas.js
var Canvas_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var Canvas_Canvas = /** @class */ (function (_super) {
    Canvas_extends(Canvas, _super);
    function Canvas(jsonld, options) {
        return _super.call(this, jsonld, options) || this;
    }
    // http://iiif.io/api/image/2.1/#canonical-uri-syntax
    Canvas.prototype.getCanonicalImageUri = function (w) {
        var id = null;
        var region = "full";
        var rotation = 0;
        var quality = "default";
        var width = w;
        var size;
        // if an info.json has been loaded
        if (this.externalResource &&
            this.externalResource.data &&
            this.externalResource.data["@id"]) {
            id = this.externalResource.data["@id"];
            if (!width) {
                width = this.externalResource.data.width;
            }
            if (this.externalResource.data["@context"]) {
                if (this.externalResource.data["@context"].indexOf("/1.0/context.json") >
                    -1 ||
                    this.externalResource.data["@context"].indexOf("/1.1/context.json") >
                        -1 ||
                    this.externalResource.data["@context"].indexOf("/1/context.json") > -1) {
                    quality = "native";
                }
            }
        }
        else {
            // info.json hasn't been loaded yet
            var images = this.getImages();
            if (images && images.length) {
                var firstImage = images[0];
                var resource = firstImage.getResource();
                var services = resource.getServices();
                if (!width) {
                    width = resource.getWidth();
                }
                if (services.length) {
                    var service = services[0];
                    id = service.id;
                    quality = Utils_Utils.getImageQuality(service.getProfile());
                }
                else if (width === resource.getWidth()) {
                    // if the passed width is the same as the resource width
                    // i.e. not looking for a thumbnail
                    // return the full size image.
                    // used for download options when loading static images.
                    return resource.id;
                }
            }
            // todo: should this be moved to getThumbUri?
            if (!id) {
                var thumbnail = this.getProperty("thumbnail");
                if (thumbnail) {
                    if (typeof thumbnail === "string") {
                        return thumbnail;
                    }
                    else {
                        if (thumbnail["@id"]) {
                            return thumbnail["@id"];
                        }
                        else if (thumbnail.length) {
                            return thumbnail[0].id;
                        }
                    }
                }
            }
        }
        size = width + ",";
        // trim off trailing '/'
        if (id && id.endsWith("/")) {
            id = id.substr(0, id.length - 1);
        }
        var uri = [id, region, size, rotation, quality + ".jpg"].join("/");
        return uri;
    };
    Canvas.prototype.getMaxDimensions = function () {
        var maxDimensions = null;
        var profile;
        if (this.externalResource &&
            this.externalResource.data &&
            this.externalResource.data.profile) {
            profile = this.externalResource.data.profile;
            if (Array.isArray(profile)) {
                profile = profile.filter(function (p) { return p["maxWidth" || false]; })[0];
                if (profile) {
                    maxDimensions = new Size(profile.maxWidth, profile.maxHeight ? profile.maxHeight : profile.maxWidth);
                }
            }
        }
        return maxDimensions;
    };
    // Presentation API 3.0
    Canvas.prototype.getContent = function () {
        var content = [];
        var items = this.__jsonld.items || this.__jsonld.content;
        if (!items)
            return content;
        // should be contained in an AnnotationPage
        var annotationPage = null;
        if (items.length) {
            annotationPage = new AnnotationPage(items[0], this.options);
        }
        if (!annotationPage) {
            return content;
        }
        var annotations = annotationPage.getItems();
        for (var i = 0; i < annotations.length; i++) {
            var a = annotations[i];
            var annotation = new Annotation_Annotation(a, this.options);
            content.push(annotation);
        }
        return content;
    };
    Canvas.prototype.getDuration = function () {
        return this.getProperty("duration");
    };
    Canvas.prototype.getImages = function () {
        var images = [];
        if (!this.__jsonld.images)
            return images;
        for (var i = 0; i < this.__jsonld.images.length; i++) {
            var a = this.__jsonld.images[i];
            var annotation = new Annotation_Annotation(a, this.options);
            images.push(annotation);
        }
        return images;
    };
    Canvas.prototype.getIndex = function () {
        return this.getProperty("index");
    };
    Canvas.prototype.getOtherContent = function () {
        var _this = this;
        var otherContent = Array.isArray(this.getProperty("otherContent"))
            ? this.getProperty("otherContent")
            : [this.getProperty("otherContent")];
        var canonicalComparison = function (typeA, typeB) {
            if (typeof typeA !== "string" || typeof typeB !== "string") {
                return false;
            }
            return typeA.toLowerCase() === typeA.toLowerCase();
        };
        var otherPromises = otherContent
            .filter(function (otherContent) {
            return otherContent &&
                canonicalComparison(otherContent["@type"], "sc:AnnotationList");
        })
            .map(function (annotationList, i) {
            return new AnnotationList_AnnotationList(annotationList["label"] || "Annotation list " + i, annotationList, _this.options);
        })
            .map(function (annotationList) { return annotationList.load(); });
        return Promise.all(otherPromises);
    };
    // Prefer thumbnail service to image service if supplied and if
    // the thumbnail service can provide a satisfactory size +/- x pixels.
    // this is used to get thumb URIs *before* the info.json has been requested
    // and populate thumbnails in a viewer.
    // the publisher may also provide pre-computed fixed-size thumbs for better performance.
    //getThumbUri(width: number): string {
    //
    //    var uri;
    //    var images: IAnnotation[] = this.getImages();
    //
    //    if (images && images.length) {
    //        var firstImage = images[0];
    //        var resource: IResource = firstImage.getResource();
    //        var services: IService[] = resource.getServices();
    //
    //        for (let i = 0; i < services.length; i++) {
    //            var service: IService = services[i];
    //            var id = service.id;
    //
    //            if (!_endsWith(id, '/')) {
    //                id += '/';
    //            }
    //
    //            uri = id + 'full/' + width + ',/0/' + Utils.getImageQuality(service.getProfile()) + '.jpg';
    //        }
    //    }
    //
    //    return uri;
    //}
    //getType(): CanvasType {
    //    return new CanvasType(this.getProperty('@type').toLowerCase());
    //}
    Canvas.prototype.getWidth = function () {
        return this.getProperty("width");
    };
    Canvas.prototype.getHeight = function () {
        return this.getProperty("height");
    };
    Canvas.prototype.getViewingHint = function () {
        return this.getProperty("viewingHint");
    };
    Object.defineProperty(Canvas.prototype, "imageResources", {
        get: function () {
            var _this = this;
            var resources = flattenDeep_default()([
                this.getImages().map(function (i) { return i.getResource(); }),
                this.getContent().map(function (i) { return i.getBody(); })
            ]);
            return flatten_default()(resources.map(function (resource) {
                switch (resource.getProperty("type").toLowerCase()) {
                    case dist_commonjs["ExternalResourceType"].CHOICE:
                    case dist_commonjs["ExternalResourceType"].OA_CHOICE:
                        return new Canvas({
                            images: flatten_default()([
                                resource.getProperty("default"),
                                resource.getProperty("item")
                            ]).map(function (r) { return ({ resource: r }); })
                        }, _this.options)
                            .getImages()
                            .map(function (i) { return i.getResource(); });
                    default:
                        return resource;
                }
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "resourceAnnotations", {
        get: function () {
            return flattenDeep_default()([this.getImages(), this.getContent()]);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a given resource Annotation, based on a contained resource or body
     * id
     */
    Canvas.prototype.resourceAnnotation = function (id) {
        return this.resourceAnnotations.find(function (anno) {
            return anno.getResource().id === id ||
                flatten_default()(new Array(anno.getBody())).some(function (body) { return body.id === id; });
        });
    };
    /**
     * Returns the fragment placement values if a resourceAnnotation is placed on
     * a canvas somewhere besides the full extent
     */
    Canvas.prototype.onFragment = function (id) {
        var resourceAnnotation = this.resourceAnnotation(id);
        if (!resourceAnnotation)
            return undefined;
        // IIIF v2
        var on = resourceAnnotation.getProperty("on");
        // IIIF v3
        var target = resourceAnnotation.getProperty("target");
        var fragmentMatch = (on || target).match(/xywh=(.*)$/);
        if (!fragmentMatch)
            return undefined;
        return fragmentMatch[1].split(",").map(function (str) { return parseInt(str, 10); });
    };
    Object.defineProperty(Canvas.prototype, "iiifImageResources", {
        get: function () {
            return this.imageResources.filter(function (r) { return r && r.getServices()[0] && r.getServices()[0].id; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "imageServiceIds", {
        get: function () {
            return this.iiifImageResources.map(function (r) { return r.getServices()[0].id; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "aspectRatio", {
        get: function () {
            return this.getWidth() / this.getHeight();
        },
        enumerable: true,
        configurable: true
    });
    return Canvas;
}(Resource_Resource));

//# sourceMappingURL=Canvas.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Collection.js
var Collection_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Collection_Collection = /** @class */ (function (_super) {
    Collection_extends(Collection, _super);
    function Collection(jsonld, options) {
        var _this = _super.call(this, jsonld, options) || this;
        _this.items = [];
        _this._collections = null;
        _this._manifests = null;
        jsonld.__collection = _this;
        return _this;
    }
    Collection.prototype.getCollections = function () {
        if (this._collections) {
            return this._collections;
        }
        return (this._collections = (this.items.filter(function (m) { return m.isCollection(); })));
    };
    Collection.prototype.getManifests = function () {
        if (this._manifests) {
            return this._manifests;
        }
        return (this._manifests = (this.items.filter(function (m) { return m.isManifest(); })));
    };
    Collection.prototype.getCollectionByIndex = function (collectionIndex) {
        var collections = this.getCollections();
        var collection;
        for (var i = 0; i < collections.length; i++) {
            var c = collections[i];
            if (c.index === collectionIndex) {
                collection = c;
            }
        }
        if (collection) {
            collection.options.index = collectionIndex;
            // id for collection MUST be dereferenceable
            return collection.load();
        }
        else {
            throw new Error("Collection index not found");
        }
    };
    Collection.prototype.getManifestByIndex = function (manifestIndex) {
        var manifests = this.getManifests();
        var manifest;
        for (var i = 0; i < manifests.length; i++) {
            var m = manifests[i];
            if (m.index === manifestIndex) {
                manifest = m;
            }
        }
        if (manifest) {
            manifest.options.index = manifestIndex;
            return manifest.load();
        }
        else {
            throw new Error("Manifest index not found");
        }
    };
    Collection.prototype.getTotalCollections = function () {
        return this.getCollections().length;
    };
    Collection.prototype.getTotalManifests = function () {
        return this.getManifests().length;
    };
    Collection.prototype.getTotalItems = function () {
        return this.items.length;
    };
    Collection.prototype.getViewingDirection = function () {
        if (this.getProperty("viewingDirection")) {
            return this.getProperty("viewingDirection");
        }
        return dist_commonjs["ViewingDirection"].LEFT_TO_RIGHT;
    };
    /**
     * Note: this only will return the first behavior as per the manifesto convention
     * IIIF v3 supports multiple behaviors
     */
    Collection.prototype.getBehavior = function () {
        var behavior = this.getProperty("behavior");
        if (Array.isArray(behavior)) {
            behavior = behavior[0];
        }
        if (behavior) {
            return behavior;
        }
        return null;
    };
    Collection.prototype.getViewingHint = function () {
        return this.getProperty("viewingHint");
    };
    /**
     * Get a tree of sub collections and manifests, using each child manifest's first 'top' range.
     */
    Collection.prototype.getDefaultTree = function () {
        _super.prototype.getDefaultTree.call(this);
        //console.log("get default tree for ", this.id);
        this.defaultTree.data.type = Utils_Utils.normaliseType(TreeNodeType.COLLECTION);
        this._parseManifests(this);
        this._parseCollections(this);
        Utils_Utils.generateTreeNodeIds(this.defaultTree);
        return this.defaultTree;
    };
    Collection.prototype._parseManifests = function (parentCollection) {
        if (parentCollection.getManifests() &&
            parentCollection.getManifests().length) {
            for (var i = 0; i < parentCollection.getManifests().length; i++) {
                var manifest = parentCollection.getManifests()[i];
                var tree = manifest.getDefaultTree();
                tree.label =
                    manifest.parentLabel ||
                        manifest.getLabel().getValue(this.options.locale) ||
                        "manifest " + (i + 1);
                tree.navDate = manifest.getNavDate();
                tree.data.id = manifest.id;
                tree.data.type = Utils_Utils.normaliseType(TreeNodeType.MANIFEST);
                parentCollection.defaultTree.addNode(tree);
            }
        }
    };
    Collection.prototype._parseCollections = function (parentCollection) {
        //console.log("parse collections for ", parentCollection.id);
        if (parentCollection.getCollections() &&
            parentCollection.getCollections().length) {
            for (var i = 0; i < parentCollection.getCollections().length; i++) {
                var collection = parentCollection.getCollections()[i];
                var tree = collection.getDefaultTree();
                tree.label =
                    collection.parentLabel ||
                        collection.getLabel().getValue(this.options.locale) ||
                        "collection " + (i + 1);
                tree.navDate = collection.getNavDate();
                tree.data.id = collection.id;
                tree.data.type = Utils_Utils.normaliseType(TreeNodeType.COLLECTION);
                parentCollection.defaultTree.addNode(tree);
            }
        }
    };
    return Collection;
}(IIIFResource_IIIFResource));

//# sourceMappingURL=Collection.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Duration.js
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

//# sourceMappingURL=Duration.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/LabelValuePair.js

var LabelValuePair_LabelValuePair = /** @class */ (function () {
    function LabelValuePair(defaultLocale) {
        this.defaultLocale = defaultLocale;
    }
    LabelValuePair.prototype.parse = function (resource) {
        this.resource = resource;
        this.label = PropertyValue_PropertyValue.parse(this.resource.label, this.defaultLocale);
        this.value = PropertyValue_PropertyValue.parse(this.resource.value, this.defaultLocale);
    };
    // shortcuts to get/set values based on user or default locale
    LabelValuePair.prototype.getLabel = function (locale) {
        if (this.label === null) {
            return null;
        }
        if (Array.isArray(locale) && !locale.length) {
            locale = undefined;
        }
        return this.label.getValue(locale || this.defaultLocale);
    };
    LabelValuePair.prototype.setLabel = function (value) {
        if (this.label === null) {
            this.label = new PropertyValue_PropertyValue([]);
        }
        this.label.setValue(value, this.defaultLocale);
    };
    LabelValuePair.prototype.getValue = function (locale, joinWith) {
        if (joinWith === void 0) { joinWith = "<br/>"; }
        if (this.value === null) {
            return null;
        }
        if (Array.isArray(locale) && !locale.length) {
            locale = undefined;
        }
        return this.value.getValue(locale || this.defaultLocale, joinWith);
    };
    LabelValuePair.prototype.getValues = function (locale) {
        if (this.value === null) {
            return [];
        }
        if (Array.isArray(locale) && !locale.length) {
            locale = undefined;
        }
        return this.value.getValues(locale || this.defaultLocale);
    };
    LabelValuePair.prototype.setValue = function (value) {
        if (this.value === null) {
            this.value = new PropertyValue_PropertyValue([]);
        }
        this.value.setValue(value, this.defaultLocale);
    };
    return LabelValuePair;
}());

//# sourceMappingURL=LabelValuePair.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/LanguageMap.js
var LanguageMap_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/** @deprecated Use PropertyValue instead */
var LanguageMap = /** @class */ (function (_super) {
    LanguageMap_extends(LanguageMap, _super);
    function LanguageMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @deprecated Use the `PropertyValue#getValue` instance method instead */
    LanguageMap.getValue = function (languageCollection, locale) {
        return languageCollection.getValue(locale, "<br/>");
    };
    /** @deprecated Use the `PropertyValue#getValues` instance method instead */
    LanguageMap.getValues = function (languageCollection, locale) {
        return languageCollection.getValues(locale);
    };
    return LanguageMap;
}(Array));

//# sourceMappingURL=LanguageMap.js.map
// EXTERNAL MODULE: ./node_modules/@edsilv/http-status-codes/dist-commonjs/index.js
var http_status_codes_dist_commonjs = __webpack_require__(1);

// EXTERNAL MODULE: ./node_modules/isomorphic-unfetch/browser.js
var browser = __webpack_require__(49);

// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Utils.js
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var Utils_Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.getMediaType = function (type) {
        type = type.toLowerCase();
        type = type.split(";")[0];
        return type.trim();
    };
    Utils.getImageQuality = function (profile) {
        if (profile === dist_commonjs["ServiceProfile"].IMAGE_0_COMPLIANCE_LEVEL_1 ||
            profile === dist_commonjs["ServiceProfile"].IMAGE_0_COMPLIANCE_LEVEL_2 ||
            profile === dist_commonjs["ServiceProfile"].IMAGE_1_COMPLIANCE_LEVEL_1 ||
            profile === dist_commonjs["ServiceProfile"].IMAGE_1_COMPLIANCE_LEVEL_2 ||
            profile === dist_commonjs["ServiceProfile"].IMAGE_0_CONFORMANCE_LEVEL_1 ||
            profile === dist_commonjs["ServiceProfile"].IMAGE_0_CONFORMANCE_LEVEL_2 ||
            profile === dist_commonjs["ServiceProfile"].IMAGE_1_CONFORMANCE_LEVEL_1 ||
            profile === dist_commonjs["ServiceProfile"].IMAGE_1_CONFORMANCE_LEVEL_2 ||
            profile === dist_commonjs["ServiceProfile"].IMAGE_1_LEVEL_1 ||
            profile === dist_commonjs["ServiceProfile"].IMAGE_1_PROFILE_LEVEL_1 ||
            profile === dist_commonjs["ServiceProfile"].IMAGE_1_LEVEL_2 ||
            profile === dist_commonjs["ServiceProfile"].IMAGE_1_PROFILE_LEVEL_2) {
            return "native";
        }
        return "default";
    };
    Utils.getInexactLocale = function (locale) {
        if (locale.indexOf("-") !== -1) {
            return locale.substr(0, locale.indexOf("-"));
        }
        return locale;
    };
    Utils.getLocalisedValue = function (resource, locale) {
        // if the resource is not an array of translations, return the string.
        if (!Array.isArray(resource)) {
            return resource;
        }
        // test for exact match
        for (var i = 0; i < resource.length; i++) {
            var value_1 = resource[i];
            var language_1 = value_1["@language"];
            if (locale === language_1) {
                return value_1["@value"];
            }
        }
        // test for inexact match
        var match = locale.substr(0, locale.indexOf("-"));
        for (var i = 0; i < resource.length; i++) {
            var value = resource[i];
            var language = value["@language"];
            if (language === match) {
                return value["@value"];
            }
        }
        return null;
    };
    Utils.generateTreeNodeIds = function (treeNode, index) {
        if (index === void 0) { index = 0; }
        var id;
        if (!treeNode.parentNode) {
            id = "0";
        }
        else {
            id = treeNode.parentNode.id + "-" + index;
        }
        treeNode.id = id;
        for (var i = 0; i < treeNode.nodes.length; i++) {
            var n = treeNode.nodes[i];
            Utils.generateTreeNodeIds(n, i);
        }
    };
    Utils.normaliseType = function (type) {
        type = (type || "").toLowerCase();
        if (type.indexOf(":") !== -1) {
            var split = type.split(":");
            return split[1];
        }
        return type;
    };
    Utils.normaliseUrl = function (url) {
        url = url.substr(url.indexOf("://"));
        if (url.indexOf("#") !== -1) {
            url = url.split("#")[0];
        }
        return url;
    };
    Utils.normalisedUrlsMatch = function (url1, url2) {
        return Utils.normaliseUrl(url1) === Utils.normaliseUrl(url2);
    };
    Utils.isImageProfile = function (profile) {
        if (Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_0_COMPLIANCE_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_0_COMPLIANCE_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_0_COMPLIANCE_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_COMPLIANCE_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_COMPLIANCE_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_0_CONFORMANCE_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_0_CONFORMANCE_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_0_CONFORMANCE_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_CONFORMANCE_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_CONFORMANCE_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_PROFILE_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_PROFILE_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_PROFILE_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_2_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_2_PROFILE_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_2_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_2_PROFILE_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_2_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_2_PROFILE_LEVEL_2)) {
            return true;
        }
        return false;
    };
    Utils.isLevel0ImageProfile = function (profile) {
        if (Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_0_COMPLIANCE_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_COMPLIANCE_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_0_CONFORMANCE_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_CONFORMANCE_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_PROFILE_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_2_LEVEL_0) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_2_PROFILE_LEVEL_0)) {
            return true;
        }
        return false;
    };
    Utils.isLevel1ImageProfile = function (profile) {
        if (Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_0_COMPLIANCE_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_COMPLIANCE_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_0_CONFORMANCE_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_CONFORMANCE_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_PROFILE_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_2_LEVEL_1) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_2_PROFILE_LEVEL_1)) {
            return true;
        }
        return false;
    };
    Utils.isLevel2ImageProfile = function (profile) {
        if (Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_0_COMPLIANCE_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_COMPLIANCE_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_0_CONFORMANCE_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_CONFORMANCE_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_1_PROFILE_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_2_LEVEL_2) ||
            Utils.normalisedUrlsMatch(profile, dist_commonjs["ServiceProfile"].IMAGE_2_PROFILE_LEVEL_2)) {
            return true;
        }
        return false;
    };
    Utils.parseManifest = function (manifest, options) {
        return Serialisation_Deserialiser.parse(manifest, options);
    };
    Utils.checkStatus = function (response) {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error(response.statusText);
            error.response = response;
            return Promise.reject(error);
        }
    };
    Utils.loadManifest = function (url) {
        return new Promise(function (resolve, reject) {
            fetch(url)
                .then(Utils.checkStatus)
                .then(function (r) { return r.json(); })
                .then(function (data) {
                resolve(data);
            })
                .catch(function (err) {
                reject();
            });
        });
    };
    Utils.loadExternalResourcesAuth1 = function (resources, openContentProviderInteraction, openTokenService, getStoredAccessToken, userInteractedWithContentProvider, getContentProviderInteraction, handleMovedTemporarily, showOutOfOptionsMessages) {
        return new Promise(function (resolve, reject) {
            var promises = resources.map(function (resource) {
                return Utils.loadExternalResourceAuth1(resource, openContentProviderInteraction, openTokenService, getStoredAccessToken, userInteractedWithContentProvider, getContentProviderInteraction, handleMovedTemporarily, showOutOfOptionsMessages);
            });
            Promise.all(promises)
                .then(function () {
                resolve(resources);
            })["catch"](function (error) {
                reject(error);
            });
        });
    };
    Utils.loadExternalResourceAuth1 = function (resource, openContentProviderInteraction, openTokenService, getStoredAccessToken, userInteractedWithContentProvider, getContentProviderInteraction, handleMovedTemporarily, showOutOfOptionsMessages) {
        return __awaiter(this, void 0, void 0, function () {
            var storedAccessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getStoredAccessToken(resource)];
                    case 1:
                        storedAccessToken = _a.sent();
                        if (!storedAccessToken) return [3 /*break*/, 6];
                        return [4 /*yield*/, resource.getData(storedAccessToken)];
                    case 2:
                        _a.sent();
                        if (!(resource.status === http_status_codes_dist_commonjs["OK"])) return [3 /*break*/, 3];
                        return [2 /*return*/, resource];
                    case 3: 
                    // the stored token is no good for this resource
                    return [4 /*yield*/, Utils.doAuthChain(resource, openContentProviderInteraction, openTokenService, userInteractedWithContentProvider, getContentProviderInteraction, handleMovedTemporarily, showOutOfOptionsMessages)];
                    case 4:
                        // the stored token is no good for this resource
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (resource.status === http_status_codes_dist_commonjs["OK"] || resource.status === http_status_codes_dist_commonjs["MOVED_TEMPORARILY"]) {
                            return [2 /*return*/, resource];
                        }
                        throw Utils.createAuthorizationFailedError();
                    case 6: return [4 /*yield*/, resource.getData()];
                    case 7:
                        _a.sent();
                        if (!(resource.status === http_status_codes_dist_commonjs["MOVED_TEMPORARILY"] ||
                            resource.status === http_status_codes_dist_commonjs["UNAUTHORIZED"])) return [3 /*break*/, 9];
                        return [4 /*yield*/, Utils.doAuthChain(resource, openContentProviderInteraction, openTokenService, userInteractedWithContentProvider, getContentProviderInteraction, handleMovedTemporarily, showOutOfOptionsMessages)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        if (resource.status === http_status_codes_dist_commonjs["OK"] || resource.status === http_status_codes_dist_commonjs["MOVED_TEMPORARILY"]) {
                            return [2 /*return*/, resource];
                        }
                        throw Utils.createAuthorizationFailedError();
                }
            });
        });
    };
    Utils.doAuthChain = function (resource, openContentProviderInteraction, openTokenService, userInteractedWithContentProvider, getContentProviderInteraction, handleMovedTemporarily, showOutOfOptionsMessages) {
        return __awaiter(this, void 0, void 0, function () {
            var externalService, kioskService, clickThroughService, loginService, serviceToTry, lastAttempted, kioskInteraction, contentProviderInteraction, contentProviderInteraction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // This function enters the flowchart at the < External? > junction
                        // http://iiif.io/api/auth/1.0/#workflow-from-the-browser-client-perspective
                        if (!resource.isAccessControlled()) {
                            return [2 /*return*/, resource]; // no services found
                        }
                        externalService = resource.externalService;
                        if (externalService) {
                            externalService.options = resource.options;
                        }
                        kioskService = resource.kioskService;
                        if (kioskService) {
                            kioskService.options = resource.options;
                        }
                        clickThroughService = resource.clickThroughService;
                        if (clickThroughService) {
                            clickThroughService.options = resource.options;
                        }
                        loginService = resource.loginService;
                        if (loginService) {
                            loginService.options = resource.options;
                        }
                        if (!(!resource.isResponseHandled && resource.status === http_status_codes_dist_commonjs["MOVED_TEMPORARILY"])) return [3 /*break*/, 2];
                        return [4 /*yield*/, handleMovedTemporarily(resource)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, resource];
                    case 2:
                        serviceToTry = null;
                        lastAttempted = null;
                        // repetition of logic is left in these steps for clarity:
                        // Looking for external pattern
                        serviceToTry = externalService;
                        if (!serviceToTry) return [3 /*break*/, 4];
                        lastAttempted = serviceToTry;
                        return [4 /*yield*/, Utils.attemptResourceWithToken(resource, openTokenService, serviceToTry)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, resource];
                    case 4:
                        // Looking for kiosk pattern
                        serviceToTry = kioskService;
                        if (!serviceToTry) return [3 /*break*/, 7];
                        lastAttempted = serviceToTry;
                        kioskInteraction = openContentProviderInteraction(serviceToTry);
                        if (!kioskInteraction) return [3 /*break*/, 7];
                        return [4 /*yield*/, userInteractedWithContentProvider(kioskInteraction)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, Utils.attemptResourceWithToken(resource, openTokenService, serviceToTry)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, resource];
                    case 7:
                        // The code for the next two patterns is identical (other than the profile name).
                        // The difference is in the expected behaviour of
                        //
                        //    await userInteractedWithContentProvider(contentProviderInteraction);
                        //
                        // For clickthrough the opened window should close immediately having established
                        // a session, whereas for login the user might spend some time entering credentials etc.
                        // Looking for clickthrough pattern
                        serviceToTry = clickThroughService;
                        if (!serviceToTry) return [3 /*break*/, 11];
                        lastAttempted = serviceToTry;
                        return [4 /*yield*/, getContentProviderInteraction(resource, serviceToTry)];
                    case 8:
                        contentProviderInteraction = _a.sent();
                        if (!contentProviderInteraction) return [3 /*break*/, 11];
                        // should close immediately
                        return [4 /*yield*/, userInteractedWithContentProvider(contentProviderInteraction)];
                    case 9:
                        // should close immediately
                        _a.sent();
                        return [4 /*yield*/, Utils.attemptResourceWithToken(resource, openTokenService, serviceToTry)];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, resource];
                    case 11:
                        // Looking for login pattern
                        serviceToTry = loginService;
                        if (!serviceToTry) return [3 /*break*/, 15];
                        lastAttempted = serviceToTry;
                        return [4 /*yield*/, getContentProviderInteraction(resource, serviceToTry)];
                    case 12:
                        contentProviderInteraction = _a.sent();
                        if (!contentProviderInteraction) return [3 /*break*/, 15];
                        // we expect the user to spend some time interacting
                        return [4 /*yield*/, userInteractedWithContentProvider(contentProviderInteraction)];
                    case 13:
                        // we expect the user to spend some time interacting
                        _a.sent();
                        return [4 /*yield*/, Utils.attemptResourceWithToken(resource, openTokenService, serviceToTry)];
                    case 14:
                        _a.sent();
                        return [2 /*return*/, resource];
                    case 15:
                        // nothing worked! Use the most recently tried service as the source of
                        // messages to show to the user.
                        if (lastAttempted) {
                            showOutOfOptionsMessages(resource, lastAttempted);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.attemptResourceWithToken = function (resource, openTokenService, authService) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenService, tokenMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenService = authService.getService(dist_commonjs["ServiceProfile"].AUTH_1_TOKEN);
                        if (!tokenService) return [3 /*break*/, 3];
                        return [4 /*yield*/, openTokenService(resource, tokenService)];
                    case 1:
                        tokenMessage = _a.sent();
                        if (!(tokenMessage && tokenMessage.accessToken)) return [3 /*break*/, 3];
                        return [4 /*yield*/, resource.getData(tokenMessage)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, resource];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Utils.loadExternalResourcesAuth09 = function (resources, tokenStorageStrategy, clickThrough, restricted, login, getAccessToken, storeAccessToken, getStoredAccessToken, handleResourceResponse, options) {
        return new Promise(function (resolve, reject) {
            var promises = resources.map(function (resource) {
                return Utils.loadExternalResourceAuth09(resource, tokenStorageStrategy, clickThrough, restricted, login, getAccessToken, storeAccessToken, getStoredAccessToken, handleResourceResponse, options);
            });
            Promise.all(promises)
                .then(function () {
                resolve(resources);
            })["catch"](function (error) {
                reject(error);
            });
        });
    };
    // IIIF auth api pre v1.0
    // Keeping this around for now until the auth 1.0 implementation is stable
    Utils.loadExternalResourceAuth09 = function (resource, tokenStorageStrategy, clickThrough, restricted, login, getAccessToken, storeAccessToken, getStoredAccessToken, handleResourceResponse, options) {
        return new Promise(function (resolve, reject) {
            if (options && options.pessimisticAccessControl) {
                // pessimistic: access control cookies may have been deleted.
                // always request the access token for every access controlled info.json request
                // returned access tokens are not stored, therefore the login window flashes for every request.
                resource
                    .getData()
                    .then(function () {
                    if (resource.isAccessControlled()) {
                        // if the resource has a click through service, use that.
                        if (resource.clickThroughService) {
                            resolve(clickThrough(resource));
                            //} else if(resource.restrictedService) {
                            resolve(restricted(resource));
                        }
                        else {
                            login(resource)
                                .then(function () {
                                getAccessToken(resource, true)
                                    .then(function (token) {
                                    resource
                                        .getData(token)
                                        .then(function () {
                                        resolve(handleResourceResponse(resource));
                                    })["catch"](function (message) {
                                        reject(Utils.createInternalServerError(message));
                                    });
                                })["catch"](function (message) {
                                    reject(Utils.createInternalServerError(message));
                                });
                            })["catch"](function (message) {
                                reject(Utils.createInternalServerError(message));
                            });
                        }
                    }
                    else {
                        // this info.json isn't access controlled, therefore no need to request an access token.
                        resolve(resource);
                    }
                })["catch"](function (message) {
                    reject(Utils.createInternalServerError(message));
                });
            }
            else {
                // optimistic: access control cookies may not have been deleted.
                // store access tokens to avoid login window flashes.
                // if cookies are deleted a page refresh is required.
                // try loading the resource using an access token that matches the info.json domain.
                // if an access token is found, request the resource using it regardless of whether it is access controlled.
                getStoredAccessToken(resource, tokenStorageStrategy)
                    .then(function (storedAccessToken) {
                    if (storedAccessToken) {
                        // try using the stored access token
                        resource
                            .getData(storedAccessToken)
                            .then(function () {
                            // if the info.json loaded using the stored access token
                            if (resource.status === http_status_codes_dist_commonjs["OK"]) {
                                resolve(handleResourceResponse(resource));
                            }
                            else {
                                // otherwise, load the resource data to determine the correct access control services.
                                // if access controlled, do login.
                                Utils.authorize(resource, tokenStorageStrategy, clickThrough, restricted, login, getAccessToken, storeAccessToken, getStoredAccessToken)
                                    .then(function () {
                                    resolve(handleResourceResponse(resource));
                                })["catch"](function (error) {
                                    // if (resource.restrictedService){
                                    //     reject(Utils.createRestrictedError());
                                    // } else {
                                    reject(Utils.createAuthorizationFailedError());
                                    //}
                                });
                            }
                        })["catch"](function (error) {
                            reject(Utils.createAuthorizationFailedError());
                        });
                    }
                    else {
                        Utils.authorize(resource, tokenStorageStrategy, clickThrough, restricted, login, getAccessToken, storeAccessToken, getStoredAccessToken)
                            .then(function () {
                            resolve(handleResourceResponse(resource));
                        })["catch"](function (error) {
                            reject(Utils.createAuthorizationFailedError());
                        });
                    }
                })["catch"](function (error) {
                    reject(Utils.createAuthorizationFailedError());
                });
            }
        });
    };
    Utils.createError = function (name, message) {
        var error = new Error();
        error.message = message;
        error.name = String(name);
        return error;
    };
    Utils.createAuthorizationFailedError = function () {
        return Utils.createError(StatusCode.AUTHORIZATION_FAILED, "Authorization failed");
    };
    Utils.createRestrictedError = function () {
        return Utils.createError(StatusCode.RESTRICTED, "Restricted");
    };
    Utils.createInternalServerError = function (message) {
        return Utils.createError(StatusCode.INTERNAL_SERVER_ERROR, message);
    };
    Utils.authorize = function (resource, tokenStorageStrategy, clickThrough, restricted, login, getAccessToken, storeAccessToken, getStoredAccessToken) {
        return new Promise(function (resolve, reject) {
            resource.getData().then(function () {
                if (resource.isAccessControlled()) {
                    getStoredAccessToken(resource, tokenStorageStrategy)
                        .then(function (storedAccessToken) {
                        if (storedAccessToken) {
                            // try using the stored access token
                            resource
                                .getData(storedAccessToken)
                                .then(function () {
                                if (resource.status === http_status_codes_dist_commonjs["OK"]) {
                                    resolve(resource); // happy path ended
                                }
                                else {
                                    // the stored token is no good for this resource
                                    Utils.showAuthInteraction(resource, tokenStorageStrategy, clickThrough, restricted, login, getAccessToken, storeAccessToken, resolve, reject);
                                }
                            })["catch"](function (message) {
                                reject(Utils.createInternalServerError(message));
                            });
                        }
                        else {
                            // There was no stored token, but the user might have a cookie that will grant a token
                            getAccessToken(resource, false).then(function (accessToken) {
                                if (accessToken) {
                                    storeAccessToken(resource, accessToken, tokenStorageStrategy)
                                        .then(function () {
                                        // try using the fresh access token
                                        resource
                                            .getData(accessToken)
                                            .then(function () {
                                            if (resource.status === http_status_codes_dist_commonjs["OK"]) {
                                                resolve(resource);
                                            }
                                            else {
                                                // User has a token, but it's not good enough
                                                Utils.showAuthInteraction(resource, tokenStorageStrategy, clickThrough, restricted, login, getAccessToken, storeAccessToken, resolve, reject);
                                            }
                                        })["catch"](function (message) {
                                            reject(Utils.createInternalServerError(message));
                                        });
                                    })["catch"](function (message) {
                                        // not able to store access token
                                        reject(Utils.createInternalServerError(message));
                                    });
                                }
                                else {
                                    // The user did not have a cookie that granted a token
                                    Utils.showAuthInteraction(resource, tokenStorageStrategy, clickThrough, restricted, login, getAccessToken, storeAccessToken, resolve, reject);
                                }
                            });
                        }
                    })["catch"](function (message) {
                        reject(Utils.createInternalServerError(message));
                    });
                }
                else {
                    // this info.json isn't access controlled, therefore there's no need to request an access token
                    resolve(resource);
                }
            });
        });
    };
    Utils.showAuthInteraction = function (resource, tokenStorageStrategy, clickThrough, restricted, login, getAccessToken, storeAccessToken, resolve, reject) {
        if (resource.status === http_status_codes_dist_commonjs["MOVED_TEMPORARILY"] && !resource.isResponseHandled) {
            // if the resource was redirected to a degraded version
            // and the response hasn't been handled yet.
            // if the client wishes to trigger a login, set resource.isResponseHandled to true
            // and call loadExternalResources() again passing the resource.
            resolve(resource);
            // } else if (resource.restrictedService) {
            //     resolve(restricted(resource));
            //     // TODO: move to next etc
        }
        else if (resource.clickThroughService && !resource.isResponseHandled) {
            // if the resource has a click through service, use that.
            clickThrough(resource).then(function () {
                getAccessToken(resource, true)
                    .then(function (accessToken) {
                    storeAccessToken(resource, accessToken, tokenStorageStrategy)
                        .then(function () {
                        resource
                            .getData(accessToken)
                            .then(function () {
                            resolve(resource);
                        })["catch"](function (message) {
                            reject(Utils.createInternalServerError(message));
                        });
                    })["catch"](function (message) {
                        reject(Utils.createInternalServerError(message));
                    });
                })["catch"](function (message) {
                    reject(Utils.createInternalServerError(message));
                });
            });
        }
        else {
            // get an access token
            login(resource).then(function () {
                getAccessToken(resource, true)
                    .then(function (accessToken) {
                    storeAccessToken(resource, accessToken, tokenStorageStrategy)
                        .then(function () {
                        resource
                            .getData(accessToken)
                            .then(function () {
                            resolve(resource);
                        })["catch"](function (message) {
                            reject(Utils.createInternalServerError(message));
                        });
                    })["catch"](function (message) {
                        reject(Utils.createInternalServerError(message));
                    });
                })["catch"](function (message) {
                    reject(Utils.createInternalServerError(message));
                });
            });
        }
    };
    Utils.getService = function (resource, profile) {
        var services = this.getServices(resource);
        for (var i = 0; i < services.length; i++) {
            var service = services[i];
            if (service.getProfile() === profile) {
                return service;
            }
        }
        return null;
    };
    Utils.getResourceById = function (parentResource, id) {
        return (Utils.traverseAndFind(parentResource.__jsonld, "@id", id));
    };
    /**
     * Does a depth first traversal of an Object, returning an Object that
     * matches provided k and v arguments
     * @example Utils.traverseAndFind({foo: 'bar'}, 'foo', 'bar')
     */
    Utils.traverseAndFind = function (object, k, v) {
        if (object.hasOwnProperty(k) && object[k] === v) {
            return object;
        }
        for (var i = 0; i < Object.keys(object).length; i++) {
            if (typeof object[Object.keys(object)[i]] === "object") {
                var o = Utils.traverseAndFind(object[Object.keys(object)[i]], k, v);
                if (o != null) {
                    return o;
                }
            }
        }
        return undefined;
    };
    Utils.getServices = function (resource) {
        var service;
        // if passing a manifesto-parsed object, use the __jsonld.service property,
        // otherwise look for a service property (info.json services)
        if (resource.__jsonld) {
            service = resource.__jsonld.service;
        }
        else {
            service = resource.service;
        }
        var services = [];
        if (!service)
            return services;
        // coerce to array
        if (!Array.isArray(service)) {
            service = [service];
        }
        for (var i = 0; i < service.length; i++) {
            var s = service[i];
            if (typeof s === "string") {
                var r = this.getResourceById(resource.options.resource, s);
                if (r) {
                    services.push(new Service_Service(r.__jsonld || r, resource.options));
                }
            }
            else {
                services.push(new Service_Service(s, resource.options));
            }
        }
        return services;
    };
    Utils.getTemporalComponent = function (target) {
        var temporal = /t=([^&]+)/g.exec(target);
        var t = null;
        if (temporal && temporal[1]) {
            t = temporal[1].split(",");
        }
        return t;
    };
    return Utils;
}());

//# sourceMappingURL=Utils.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/PropertyValue.js
var PropertyValue_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

/** Utility class to hold one or more values with their associated (optional) locale */
var LocalizedValue = /** @class */ (function () {
    function LocalizedValue(value, locale, defaultLocale) {
        if (defaultLocale === void 0) { defaultLocale = "none"; }
        if (Array.isArray(value) && value.length === 1) {
            this._value = value[0];
        }
        else {
            this._value = value;
        }
        if (locale === "none" || locale === "@none") {
            locale = undefined;
        }
        this._locale = locale;
        this._defaultLocale = defaultLocale;
    }
    /** Parse a localized value from a IIIF v2 property value
     *
     * @param {string | string[] | object | object[]} rawVal value from IIIF resource
     * @param {string | undefined} defaultLocale deprecated: defaultLocale the default locale to use for this value
     */
    LocalizedValue.parseV2Value = function (rawVal, defaultLocale) {
        if (typeof rawVal === "string") {
            return new LocalizedValue(rawVal, undefined, defaultLocale);
        }
        else if (rawVal["@value"]) {
            return new LocalizedValue(rawVal["@value"], rawVal["@language"], defaultLocale);
        }
        return null;
    };
    Object.defineProperty(LocalizedValue.prototype, "value", {
        /*** @deprecated Use PropertyValue#getValue instead */
        get: function () {
            if (Array.isArray(this._value)) {
                return this._value.join("<br/>");
            }
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocalizedValue.prototype, "locale", {
        /*** @deprecated Don't use, only used for backwards compatibility reasons */
        get: function () {
            if (this._locale === undefined) {
                return this._defaultLocale;
            }
            return this._locale;
        },
        enumerable: true,
        configurable: true
    });
    LocalizedValue.prototype.addValue = function (value) {
        if (!Array.isArray(this._value)) {
            this._value = [this._value];
        }
        if (Array.isArray(value)) {
            this._value = this._value.concat(value);
        }
        else {
            this._value.push(value);
        }
    };
    return LocalizedValue;
}());

/***
 * Holds a collection of values and their (optional) languages and allows
 * language-based value retrieval as per the algorithm described in
 * https://iiif.io/api/presentation/2.1/#language-of-property-values
 */
var PropertyValue_PropertyValue = /** @class */ (function (_super) {
    PropertyValue_extends(PropertyValue, _super);
    function PropertyValue(values, defaultLocale) {
        if (values === void 0) { values = []; }
        var _this = _super.apply(this, values) || this;
        // Needed for ES5 compatibility, see https://stackoverflow.com/a/40967939
        _this.__proto__ = PropertyValue.prototype;
        _this._defaultLocale = defaultLocale;
        return _this;
    }
    PropertyValue.parse = function (rawVal, defaultLocale) {
        if (!rawVal) {
            return new PropertyValue([], defaultLocale);
        }
        if (Array.isArray(rawVal)) {
            // Collection of IIIF v2 property values
            var parsed = rawVal
                .map(function (v) { return LocalizedValue.parseV2Value(v, defaultLocale); })
                .filter(function (v) { return v !== null; });
            var byLocale = parsed.reduce(function (acc, lv) {
                var loc = lv._locale;
                if (!loc) {
                    // Cannot use undefined as an object key
                    loc = "none";
                }
                if (acc[loc]) {
                    acc[loc].addValue(lv._value);
                }
                else {
                    acc[loc] = lv;
                }
                return acc;
            }, {});
            return new PropertyValue(Object.values(byLocale), defaultLocale);
        }
        else if (typeof rawVal === "string") {
            return new PropertyValue([new LocalizedValue(rawVal, undefined, defaultLocale)], defaultLocale);
        }
        else if (rawVal["@language"]) {
            // Single IIIF v2 property value
            var parsed = LocalizedValue.parseV2Value(rawVal);
            return new PropertyValue(parsed !== null ? [parsed] : [], defaultLocale);
        }
        else {
            // IIIF v3 property value
            return new PropertyValue(Object.keys(rawVal).map(function (locale) {
                var val = rawVal[locale];
                if (!Array.isArray(val)) {
                    throw new Error("A IIIF v3 localized property value must have an array as the value for a given language.");
                }
                return new LocalizedValue(val, locale, defaultLocale);
            }), defaultLocale);
        }
    };
    /*** Try to find the available locale that best fit's the user's preferences. */
    PropertyValue.prototype.getSuitableLocale = function (locales) {
        // If any of the values have a language associated with them, the client
        // must display all of the values associated with the language that best
        // matches the language preference.
        // FIXME: This is nasty, we have to spread ourselves in order to be able
        //        to call `.map`. This will no longer be needed once we target >ES5.
        var allLocales = __spreadArrays(this).map(function (lv) { return lv._locale; })
            .filter(function (l) { return l !== undefined; });
        var _loop_1 = function (userLocale) {
            var matchingLocale = allLocales.find(function (l) { return l === userLocale; });
            if (matchingLocale) {
                return { value: matchingLocale };
            }
        };
        // First, look for a precise match
        for (var _i = 0, locales_1 = locales; _i < locales_1.length; _i++) {
            var userLocale = locales_1[_i];
            var state_1 = _loop_1(userLocale);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        var _loop_2 = function (userLocale) {
            var matchingLocale = allLocales.find(function (l) { return Utils_Utils.getInexactLocale(l) === Utils_Utils.getInexactLocale(userLocale); });
            if (matchingLocale) {
                return { value: matchingLocale };
            }
        };
        // Look for an inexact match
        for (var _a = 0, locales_2 = locales; _a < locales_2.length; _a++) {
            var userLocale = locales_2[_a];
            var state_2 = _loop_2(userLocale);
            if (typeof state_2 === "object")
                return state_2.value;
        }
        return undefined;
    };
    /**
     * Set the value(s) for a given locale.
     *
     * If there's an existing locale that matches the given locale, it will be updated.
     *
     * @param locale Locale to set the value for
     * @param value value to set
     */
    PropertyValue.prototype.setValue = function (value, locale) {
        var existing = undefined;
        if (!locale) {
            existing = this.find(function (lv) { return lv._locale === undefined; });
        }
        else {
            var bestLocale_1 = this.getSuitableLocale([locale]);
            if (bestLocale_1) {
                existing = this.find(function (lv) { return lv._locale === bestLocale_1; });
            }
        }
        if (existing) {
            // Mutate existing localized value
            existing._value = value;
        }
        else {
            // Create a new localized value
            this.push(new LocalizedValue(value, locale, this._defaultLocale));
        }
    };
    /**
     * Get a value in the most suitable locale.
     *
     * @param {string | string[] | undefined} locales Desired locale, can be a list of
     * locales sorted by descending priority.
     * @param {string | undefined} joinWith String to join multiple available values by,
     * if undefined only the first available value will be returned
     * @returns the first value in the most suitable locale or null if none could be found
     */
    PropertyValue.prototype.getValue = function (locales, joinWith) {
        var vals = this.getValues(locales);
        if (vals.length === 0) {
            return null;
        }
        if (joinWith) {
            return vals.join(joinWith);
        }
        return vals[0];
    };
    /**
     * Get all values available in the most suitable locale.
     *
     * @param {string | string[]} userLocales Desired locale, can be a list of
     * locales sorted by descending priority.
     * @returns the values for the most suitable locale, empty if none could be found
     */
    PropertyValue.prototype.getValues = function (userLocales) {
        if (!this.length) {
            return [];
        }
        var locales;
        if (!userLocales) {
            locales = [];
        }
        else if (!Array.isArray(userLocales)) {
            locales = [userLocales];
        }
        else {
            locales = userLocales;
        }
        // If none of the values have a language associated with them, the client
        // must display all of the values.
        if (this.length === 1 && this[0]._locale === undefined) {
            var val = this[0]._value;
            return Array.isArray(val) ? val : [val];
        }
        // Try to determine the available locale that best fits the user's preferences
        var matchingLocale = this.getSuitableLocale(locales);
        if (matchingLocale) {
            var val = this.find(function (lv) { return lv._locale === matchingLocale; })._value;
            return Array.isArray(val) ? val : [val];
        }
        // If all of the values have a language associated with them, and none match
        // the language preference, the client must select a language and display
        // all of the values associated with that language.
        var allHaveLang = !this.find(function (lv) { return lv._locale === undefined; });
        if (allHaveLang) {
            var val = this[0]._value;
            return Array.isArray(val) ? val : [val];
        }
        // If some of the values have a language associated with them, but none
        // match the language preference, the client must display all of the values
        // that do not have a language associated with them.
        var lv = this.find(function (lv) { return lv._locale === undefined; });
        if (lv) {
            return Array.isArray(lv._value) ? lv._value : [lv._value];
        }
        return [];
    };
    return PropertyValue;
}(Array));

//# sourceMappingURL=PropertyValue.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Manifest.js
var Manifest_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Manifest_Manifest = /** @class */ (function (_super) {
    Manifest_extends(Manifest, _super);
    function Manifest(jsonld, options) {
        var _this = _super.call(this, jsonld, options) || this;
        _this.index = 0;
        _this._allRanges = null;
        _this.items = [];
        _this._topRanges = [];
        if (_this.__jsonld.structures && _this.__jsonld.structures.length) {
            var topRanges = _this._getTopRanges();
            for (var i = 0; i < topRanges.length; i++) {
                var range = topRanges[i];
                _this._parseRanges(range, String(i));
            }
        }
        return _this;
    }
    /** @deprecated Use getAccompanyingCanvas instead */
    Manifest.prototype.getPosterCanvas = function () {
        var posterCanvas = this.getProperty("posterCanvas");
        if (posterCanvas) {
            posterCanvas = new Canvas_Canvas(posterCanvas, this.options);
        }
        return posterCanvas;
    };
    Manifest.prototype.getAccompanyingCanvas = function () {
        var accompanyingCanvas = this.getProperty("accompanyingCanvas");
        if (accompanyingCanvas) {
            accompanyingCanvas = new Canvas_Canvas(accompanyingCanvas, this.options);
        }
        return accompanyingCanvas;
    };
    Manifest.prototype.getBehavior = function () {
        var behavior = this.getProperty("behavior");
        if (Array.isArray(behavior)) {
            behavior = behavior[0];
        }
        if (behavior) {
            return behavior;
        }
        return null;
    };
    Manifest.prototype.getDefaultTree = function () {
        _super.prototype.getDefaultTree.call(this);
        this.defaultTree.data.type = Utils_Utils.normaliseType(TreeNodeType.MANIFEST);
        if (!this.isLoaded) {
            return this.defaultTree;
        }
        var topRanges = this.getTopRanges();
        // if there are any ranges in the manifest, default to the first 'top' range or generated placeholder
        if (topRanges.length) {
            topRanges[0].getTree(this.defaultTree);
        }
        Utils_Utils.generateTreeNodeIds(this.defaultTree);
        return this.defaultTree;
    };
    Manifest.prototype._getTopRanges = function () {
        var topRanges = [];
        if (this.__jsonld.structures && this.__jsonld.structures.length) {
            for (var i = 0; i < this.__jsonld.structures.length; i++) {
                var json = this.__jsonld.structures[i];
                if (json.viewingHint === dist_commonjs["ViewingHint"].TOP) {
                    topRanges.push(json);
                }
            }
            // if no viewingHint="top" range was found, create a default one
            if (!topRanges.length) {
                var range = {};
                range.ranges = this.__jsonld.structures;
                topRanges.push(range);
            }
        }
        return topRanges;
    };
    Manifest.prototype.getTopRanges = function () {
        return this._topRanges;
    };
    Manifest.prototype._getRangeById = function (id) {
        if (this.__jsonld.structures && this.__jsonld.structures.length) {
            for (var i = 0; i < this.__jsonld.structures.length; i++) {
                var r = this.__jsonld.structures[i];
                if (r["@id"] === id || r.id === id) {
                    return r;
                }
            }
        }
        return null;
    };
    //private _parseRangeCanvas(json: any, range: Range): void {
    // todo: currently this isn't needed
    //var canvas: IJSONLDResource = new JSONLDResource(json);
    //range.items.push(<IManifestResource>canvas);
    //}
    Manifest.prototype._parseRanges = function (r, path, parentRange) {
        var range;
        var id = null;
        if (typeof r === "string") {
            id = r;
            r = this._getRangeById(id);
        }
        if (!r) {
            console.warn("Range:", id, "does not exist");
            return;
        }
        range = new Range_Range(r, this.options);
        range.parentRange = parentRange;
        range.path = path;
        if (!parentRange) {
            this._topRanges.push(range);
        }
        else {
            parentRange.items.push(range);
        }
        var items = r.items || r.members;
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // todo: use an ItemType constant?
                if ((item["@type"] && item["@type"].toLowerCase() === "sc:range") ||
                    (item["type"] && item["type"].toLowerCase() === "range")) {
                    this._parseRanges(item, path + "/" + i, range);
                }
                else if ((item["@type"] && item["@type"].toLowerCase() === "sc:canvas") ||
                    (item["type"] && item["type"].toLowerCase() === "canvas")) {
                    // store the ids on the __jsonld object to be used by Range.getCanvasIds()
                    if (!range.canvases) {
                        range.canvases = [];
                    }
                    var id_1 = item.id || item["@id"];
                    range.canvases.push(id_1);
                }
            }
        }
        else if (r.ranges) {
            for (var i = 0; i < r.ranges.length; i++) {
                this._parseRanges(r.ranges[i], path + "/" + i, range);
            }
        }
    };
    Manifest.prototype.getAllRanges = function () {
        if (this._allRanges != null)
            return this._allRanges;
        this._allRanges = [];
        var topRanges = this.getTopRanges();
        var _loop_1 = function (i) {
            var topRange = topRanges[i];
            if (topRange.id) {
                this_1._allRanges.push(topRange); // it might be a placeholder root range
            }
            var reducer = function (acc, next) {
                acc.add(next);
                var nextRanges = next.getRanges();
                if (nextRanges.length) {
                    return nextRanges.reduce(reducer, acc);
                }
                return acc;
            };
            var subRanges = Array.from(topRange.getRanges().reduce(reducer, new Set()));
            this_1._allRanges = this_1._allRanges.concat(subRanges);
        };
        var this_1 = this;
        for (var i = 0; i < topRanges.length; i++) {
            _loop_1(i);
        }
        return this._allRanges;
    };
    Manifest.prototype.getRangeById = function (id) {
        var ranges = this.getAllRanges();
        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            if (range.id === id) {
                return range;
            }
        }
        return null;
    };
    Manifest.prototype.getRangeByPath = function (path) {
        var ranges = this.getAllRanges();
        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            if (range.path === path) {
                return range;
            }
        }
        return null;
    };
    Manifest.prototype.getSequences = function () {
        if (this.items.length) {
            return this.items;
        }
        // IxIF mediaSequences overrode sequences, so need to be checked first.
        // deprecate this when presentation 3 ships
        var items = this.__jsonld.mediaSequences || this.__jsonld.sequences;
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var s = items[i];
                var sequence = new Sequence_Sequence(s, this.options);
                this.items.push(sequence);
            }
        }
        else if (this.__jsonld.items) {
            var sequence = new Sequence_Sequence(this.__jsonld.items, this.options);
            this.items.push(sequence);
        }
        return this.items;
    };
    Manifest.prototype.getSequenceByIndex = function (sequenceIndex) {
        return this.getSequences()[sequenceIndex];
    };
    Manifest.prototype.getTotalSequences = function () {
        return this.getSequences().length;
    };
    Manifest.prototype.getManifestType = function () {
        var service = (this.getService(dist_commonjs["ServiceProfile"].UI_EXTENSIONS));
        if (service) {
            return service.getProperty("manifestType");
        }
        return ManifestType.EMPTY;
    };
    Manifest.prototype.isMultiSequence = function () {
        return this.getTotalSequences() > 1;
    };
    Manifest.prototype.isPagingEnabled = function () {
        var viewingHint = this.getViewingHint();
        if (viewingHint) {
            return viewingHint === dist_commonjs["ViewingHint"].PAGED;
        }
        var behavior = this.getBehavior();
        if (behavior) {
            return behavior === dist_commonjs["Behavior"].PAGED;
        }
        return false;
    };
    Manifest.prototype.getViewingDirection = function () {
        return this.getProperty("viewingDirection");
    };
    Manifest.prototype.getViewingHint = function () {
        return this.getProperty("viewingHint");
    };
    return Manifest;
}(IIIFResource_IIIFResource));

//# sourceMappingURL=Manifest.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/ManifestType.js
var ManifestType;
(function (ManifestType) {
    ManifestType["EMPTY"] = "";
    ManifestType["MANUSCRIPT"] = "manuscript";
    ManifestType["MONOGRAPH"] = "monograph";
})(ManifestType || (ManifestType = {}));
//# sourceMappingURL=ManifestType.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Range.js
var Range_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Range_Range = /** @class */ (function (_super) {
    Range_extends(Range, _super);
    function Range(jsonld, options) {
        var _this = _super.call(this, jsonld, options) || this;
        _this._ranges = null;
        _this.canvases = null;
        _this.items = [];
        return _this;
    }
    Range.prototype.getCanvasIds = function () {
        if (this.__jsonld.canvases) {
            return this.__jsonld.canvases;
        }
        else if (this.canvases) {
            return this.canvases;
        }
        return [];
    };
    Range.prototype.getDuration = function () {
        // For this implementation, we want to catch SOME of the temporal cases - i.e. when there is a t=1,100
        if (this.canvases && this.canvases.length) {
            var startTimes = [];
            var endTimes = [];
            // When we loop through all of the canvases we store the recorded start and end times.
            // Then we choose the maximum and minimum values from this. This will give us a more accurate duration for the
            // Chosen range. However this is still not perfect and does not cover more complex ranges. These cases are out of
            // scope for this change.
            for (var _i = 0, _a = this.canvases; _i < _a.length; _i++) {
                var canvas = _a[_i];
                if (!canvas)
                    continue;
                var _b = (canvas.match(/(.*)#t=([0-9.]+),?([0-9.]+)?/) || [undefined, canvas]), canvasId = _b[1], start_1 = _b[2], end_1 = _b[3];
                if (canvasId) {
                    startTimes.push(parseFloat(start_1));
                    endTimes.push(parseFloat(end_1));
                }
            }
            if (startTimes.length && endTimes.length) {
                return new Duration(Math.min.apply(Math, startTimes), Math.max.apply(Math, endTimes));
            }
        }
        else {
            // get child ranges and calculate the start and end based on them
            var childRanges = this.getRanges();
            var startTimes = [];
            var endTimes = [];
            // Once again, we use a max/min to get the ranges.
            for (var _c = 0, childRanges_1 = childRanges; _c < childRanges_1.length; _c++) {
                var childRange = childRanges_1[_c];
                var duration = childRange.getDuration();
                if (duration) {
                    startTimes.push(duration.start);
                    endTimes.push(duration.end);
                }
            }
            // And return the minimum as the start, and the maximum as the end.
            if (startTimes.length && endTimes.length) {
                return new Duration(Math.min.apply(Math, startTimes), Math.max.apply(Math, endTimes));
            }
        }
        var start;
        var end;
        // There are 2 paths for this implementation. Either we have a list of canvases, or a list of ranges
        // which may have a list of ranges.
        // This is one of the limitations of this implementation.
        if (this.canvases && this.canvases.length) {
            // When we loop through each of the canvases we are expecting to see a fragment or a link to the whole canvas.
            // For example - if we have http://example.org/canvas#t=1,100 it will extract 1 and 100 as the start and end.
            for (var i = 0; i < this.canvases.length; i++) {
                var canvas = this.canvases[i];
                var temporal = Utils_Utils.getTemporalComponent(canvas);
                if (temporal && temporal.length > 1) {
                    if (i === 0) {
                        // Note: Cannot guarantee ranges are sequential (fixed above)
                        start = Number(temporal[0]);
                    }
                    if (i === this.canvases.length - 1) {
                        end = Number(temporal[1]); // Note: The end of this duration may be targeting a different canvas.
                    }
                }
            }
        }
        else {
            // In this second case, where there are nested ranges, we recursively get the duration
            // from each of the child ranges (a start and end) and then choose the first and last for the bounds of this range.
            var childRanges = this.getRanges();
            for (var i = 0; i < childRanges.length; i++) {
                var childRange = childRanges[i];
                var duration = childRange.getDuration();
                if (duration) {
                    if (i === 0) {
                        start = duration.start;
                    }
                    if (i === childRanges.length - 1) {
                        end = duration.end;
                    }
                }
            }
        }
        if (start !== undefined && end !== undefined) {
            return new Duration(start, end);
        }
        return undefined;
    };
    // getCanvases(): ICanvas[] {
    //     if (this._canvases) {
    //         return this._canvases;
    //     }
    //     return this._canvases = <ICanvas[]>this.items.en().where(m => m.isCanvas()).toArray();
    // }
    Range.prototype.getRanges = function () {
        if (this._ranges) {
            return this._ranges;
        }
        return (this._ranges = this.items.filter(function (m) { return m.isRange(); }));
    };
    Range.prototype.getBehavior = function () {
        var behavior = this.getProperty("behavior");
        if (Array.isArray(behavior)) {
            behavior = behavior[0];
        }
        if (behavior) {
            return behavior;
        }
        return null;
    };
    Range.prototype.getViewingDirection = function () {
        return this.getProperty("viewingDirection");
    };
    Range.prototype.getViewingHint = function () {
        return this.getProperty("viewingHint");
    };
    Range.prototype.getTree = function (treeRoot) {
        treeRoot.data = this;
        this.treeNode = treeRoot;
        var ranges = this.getRanges();
        if (ranges && ranges.length) {
            for (var i = 0; i < ranges.length; i++) {
                var range = ranges[i];
                var node = new TreeNode_TreeNode();
                treeRoot.addNode(node);
                this._parseTreeNode(node, range);
            }
        }
        Utils_Utils.generateTreeNodeIds(treeRoot);
        return treeRoot;
    };
    Range.prototype.spansTime = function (time) {
        var duration = this.getDuration();
        if (duration) {
            if (time >= duration.start && time <= duration.end) {
                return true;
            }
        }
        return false;
    };
    Range.prototype._parseTreeNode = function (node, range) {
        node.label = range.getLabel().getValue(this.options.locale);
        node.data = range;
        node.data.type = Utils_Utils.normaliseType(TreeNodeType.RANGE);
        range.treeNode = node;
        var ranges = range.getRanges();
        if (ranges && ranges.length) {
            for (var i = 0; i < ranges.length; i++) {
                var childRange = ranges[i];
                var behavior = childRange.getBehavior();
                if (behavior === dist_commonjs["Behavior"].NO_NAV) {
                    continue;
                }
                else {
                    var childNode = new TreeNode_TreeNode();
                    node.addNode(childNode);
                    this._parseTreeNode(childNode, childRange);
                }
            }
        }
    };
    return Range;
}(ManifestResource_ManifestResource));

//# sourceMappingURL=Range.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Rendering.js
var Rendering_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Rendering = /** @class */ (function (_super) {
    Rendering_extends(Rendering, _super);
    function Rendering(jsonld, options) {
        return _super.call(this, jsonld, options) || this;
    }
    Rendering.prototype.getFormat = function () {
        return this.getProperty("format");
    };
    return Rendering;
}(ManifestResource_ManifestResource));

//# sourceMappingURL=Rendering.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Sequence.js
var Sequence_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Sequence_Sequence = /** @class */ (function (_super) {
    Sequence_extends(Sequence, _super);
    function Sequence(jsonld, options) {
        var _this = _super.call(this, jsonld, options) || this;
        _this.items = [];
        _this._thumbnails = null;
        return _this;
    }
    Sequence.prototype.getCanvases = function () {
        if (this.items.length) {
            return this.items;
        }
        var items = this.__jsonld.canvases || this.__jsonld.elements;
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var c = items[i];
                var canvas = new Canvas_Canvas(c, this.options);
                canvas.index = i;
                this.items.push(canvas);
            }
        }
        else if (this.__jsonld) {
            for (var i = 0; i < this.__jsonld.length; i++) {
                var c = this.__jsonld[i];
                var canvas = new Canvas_Canvas(c, this.options);
                canvas.index = i;
                this.items.push(canvas);
            }
        }
        return this.items;
    };
    Sequence.prototype.getCanvasById = function (id) {
        for (var i = 0; i < this.getTotalCanvases(); i++) {
            var canvas = this.getCanvasByIndex(i);
            // normalise canvas id
            var canvasId = Utils_Utils.normaliseUrl(canvas.id);
            if (Utils_Utils.normaliseUrl(id) === canvasId) {
                return canvas;
            }
        }
        return null;
    };
    Sequence.prototype.getCanvasByIndex = function (canvasIndex) {
        return this.getCanvases()[canvasIndex];
    };
    Sequence.prototype.getCanvasIndexById = function (id) {
        for (var i = 0; i < this.getTotalCanvases(); i++) {
            var canvas = this.getCanvasByIndex(i);
            if (canvas.id === id) {
                return i;
            }
        }
        return null;
    };
    Sequence.prototype.getCanvasIndexByLabel = function (label, foliated) {
        label = label.trim();
        if (!isNaN(label)) {
            // if the label is numeric
            label = parseInt(label, 10).toString(); // trim any preceding zeros.
            if (foliated)
                label += "r"; // default to recto
        }
        var doublePageRegExp = /(\d*)\D+(\d*)/;
        var match, regExp, regStr, labelPart1, labelPart2;
        for (var i = 0; i < this.getTotalCanvases(); i++) {
            var canvas = this.getCanvasByIndex(i);
            // check if there's a literal match
            if (canvas.getLabel().getValue(this.options.locale) === label) {
                return i;
            }
            // check if there's a match for double-page spreads e.g. 100-101, 100_101, 100 101
            match = doublePageRegExp.exec(label);
            if (!match)
                continue;
            labelPart1 = match[1];
            labelPart2 = match[2];
            if (!labelPart2)
                continue;
            regStr = "^" + labelPart1 + "\\D+" + labelPart2 + "$";
            regExp = new RegExp(regStr);
            if (regExp.test(canvas.getLabel().toString())) {
                return i;
            }
        }
        return -1;
    };
    Sequence.prototype.getLastCanvasLabel = function (alphanumeric) {
        for (var i = this.getTotalCanvases() - 1; i >= 0; i--) {
            var canvas = this.getCanvasByIndex(i);
            var label = (canvas.getLabel().getValue(this.options.locale));
            if (alphanumeric) {
                var regExp = /^[a-zA-Z0-9]*$/;
                if (regExp.test(label)) {
                    return label;
                }
            }
            else if (label) {
                return label;
            }
        }
        return this.options.defaultLabel;
    };
    Sequence.prototype.getLastPageIndex = function () {
        return this.getTotalCanvases() - 1;
    };
    Sequence.prototype.getNextPageIndex = function (canvasIndex, pagingEnabled) {
        var index;
        if (pagingEnabled) {
            var indices = this.getPagedIndices(canvasIndex);
            var viewingDirection = this.getViewingDirection();
            if (viewingDirection &&
                viewingDirection === dist_commonjs["ViewingDirection"].RIGHT_TO_LEFT) {
                index = indices[0] + 1;
            }
            else {
                index = indices[indices.length - 1] + 1;
            }
        }
        else {
            index = canvasIndex + 1;
        }
        if (index > this.getLastPageIndex()) {
            return -1;
        }
        return index;
    };
    Sequence.prototype.getPagedIndices = function (canvasIndex, pagingEnabled) {
        var indices = [];
        if (!pagingEnabled) {
            indices.push(canvasIndex);
        }
        else {
            if (this.isFirstCanvas(canvasIndex) || this.isLastCanvas(canvasIndex)) {
                indices = [canvasIndex];
            }
            else if (canvasIndex % 2) {
                indices = [canvasIndex, canvasIndex + 1];
            }
            else {
                indices = [canvasIndex - 1, canvasIndex];
            }
            var viewingDirection = this.getViewingDirection();
            if (viewingDirection &&
                viewingDirection === dist_commonjs["ViewingDirection"].RIGHT_TO_LEFT) {
                indices = indices.reverse();
            }
        }
        return indices;
    };
    Sequence.prototype.getPrevPageIndex = function (canvasIndex, pagingEnabled) {
        var index;
        if (pagingEnabled) {
            var indices = this.getPagedIndices(canvasIndex);
            var viewingDirection = this.getViewingDirection();
            if (viewingDirection &&
                viewingDirection === dist_commonjs["ViewingDirection"].RIGHT_TO_LEFT) {
                index = indices[indices.length - 1] - 1;
            }
            else {
                index = indices[0] - 1;
            }
        }
        else {
            index = canvasIndex - 1;
        }
        return index;
    };
    Sequence.prototype.getStartCanvasIndex = function () {
        var startCanvas = this.getStartCanvas();
        if (startCanvas) {
            // if there's a startCanvas attribute, loop through the canvases and return the matching index.
            for (var i = 0; i < this.getTotalCanvases(); i++) {
                var canvas = this.getCanvasByIndex(i);
                if (canvas.id === startCanvas)
                    return i;
            }
        }
        // default to first canvas.
        return 0;
    };
    // todo: deprecate
    Sequence.prototype.getThumbs = function (width, height) {
        //console.warn('getThumbs will be deprecated, use getThumbnails instead');
        var thumbs = [];
        var totalCanvases = this.getTotalCanvases();
        for (var i = 0; i < totalCanvases; i++) {
            var canvas = this.getCanvasByIndex(i);
            var thumb = new Thumb(width, canvas);
            thumbs.push(thumb);
        }
        return thumbs;
    };
    Sequence.prototype.getThumbnails = function () {
        if (this._thumbnails != null)
            return this._thumbnails;
        this._thumbnails = [];
        var canvases = this.getCanvases();
        for (var i = 0; i < canvases.length; i++) {
            var thumbnail = canvases[i].getThumbnail();
            if (thumbnail) {
                this._thumbnails.push(thumbnail);
            }
        }
        return this._thumbnails;
    };
    Sequence.prototype.getStartCanvas = function () {
        return this.getProperty("startCanvas");
    };
    Sequence.prototype.getTotalCanvases = function () {
        return this.getCanvases().length;
    };
    Sequence.prototype.getViewingDirection = function () {
        if (this.getProperty("viewingDirection")) {
            return this.getProperty("viewingDirection");
        }
        else if (this.options.resource.getViewingDirection) {
            return this.options.resource.getViewingDirection();
        }
        return null;
    };
    Sequence.prototype.getViewingHint = function () {
        return this.getProperty("viewingHint");
    };
    Sequence.prototype.isCanvasIndexOutOfRange = function (canvasIndex) {
        return canvasIndex > this.getTotalCanvases() - 1;
    };
    Sequence.prototype.isFirstCanvas = function (canvasIndex) {
        return canvasIndex === 0;
    };
    Sequence.prototype.isLastCanvas = function (canvasIndex) {
        return canvasIndex === this.getTotalCanvases() - 1;
    };
    Sequence.prototype.isMultiCanvas = function () {
        return this.getTotalCanvases() > 1;
    };
    Sequence.prototype.isPagingEnabled = function () {
        var viewingHint = this.getViewingHint();
        if (viewingHint) {
            return viewingHint === dist_commonjs["ViewingHint"].PAGED;
        }
        return false;
    };
    // checks if the number of canvases is even - therefore has a front and back cover
    Sequence.prototype.isTotalCanvasesEven = function () {
        return this.getTotalCanvases() % 2 === 0;
    };
    return Sequence;
}(ManifestResource_ManifestResource));

//# sourceMappingURL=Sequence.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Serialisation.js

var Serialisation_Deserialiser = /** @class */ (function () {
    function Deserialiser() {
    }
    Deserialiser.parse = function (manifest, options) {
        if (typeof manifest === "string") {
            manifest = JSON.parse(manifest);
        }
        return this.parseJson(manifest, options);
    };
    Deserialiser.parseJson = function (json, options) {
        var resource;
        // have options been passed for the manifest to inherit?
        if (options) {
            if (options.navDate && !isNaN(options.navDate.getTime())) {
                json.navDate = options.navDate.toString();
            }
        }
        if (json["@type"]) {
            switch (json["@type"]) {
                case "sc:Collection":
                    resource = this.parseCollection(json, options);
                    break;
                case "sc:Manifest":
                    resource = this.parseManifest(json, options);
                    break;
                default:
                    return null;
            }
        }
        else {
            // presentation 3
            switch (json["type"]) {
                case "Collection":
                    resource = this.parseCollection(json, options);
                    break;
                case "Manifest":
                    resource = this.parseManifest(json, options);
                    break;
                default:
                    return null;
            }
        }
        // Top-level resource was loaded from a URI, so flag it to prevent
        // unnecessary reload:
        resource.isLoaded = true;
        return resource;
    };
    Deserialiser.parseCollection = function (json, options) {
        var collection = new Collection_Collection(json, options);
        if (options) {
            collection.index = options.index || 0;
            if (options.resource) {
                collection.parentCollection = options.resource.parentCollection;
            }
        }
        else {
            collection.index = 0;
        }
        this.parseCollections(collection, options);
        this.parseManifests(collection, options);
        this.parseItems(collection, options);
        return collection;
    };
    Deserialiser.parseCollections = function (collection, options) {
        var items;
        if (collection.__jsonld.collections) {
            items = collection.__jsonld.collections;
        }
        else if (collection.__jsonld.items) {
            items = collection.__jsonld.items.filter(function (m) { return m.type.toLowerCase() === "collection"; });
        }
        if (items) {
            for (var i = 0; i < items.length; i++) {
                if (options) {
                    options.index = i;
                }
                var item = this.parseCollection(items[i], options);
                item.index = i;
                item.parentCollection = collection;
                collection.items.push(item);
            }
        }
    };
    Deserialiser.parseManifest = function (json, options) {
        var manifest = new Manifest_Manifest(json, options);
        return manifest;
    };
    Deserialiser.parseManifests = function (collection, options) {
        var items;
        if (collection.__jsonld.manifests) {
            items = collection.__jsonld.manifests;
        }
        else if (collection.__jsonld.items) {
            items = collection.__jsonld.items.filter(function (m) { return m.type.toLowerCase() === "manifest"; });
        }
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = this.parseManifest(items[i], options);
                item.index = i;
                item.parentCollection = collection;
                collection.items.push(item);
            }
        }
    };
    Deserialiser.parseItem = function (json, options) {
        if (json["@type"]) {
            if (json["@type"].toLowerCase() === "sc:manifest") {
                return this.parseManifest(json, options);
            }
            else if (json["@type"].toLowerCase() === "sc:collection") {
                return this.parseCollection(json, options);
            }
        }
        else if (json.type) {
            if (json.type.toLowerCase() === "manifest") {
                return this.parseManifest(json, options);
            }
            else if (json.type.toLowerCase() === "collection") {
                return this.parseCollection(json, options);
            }
        }
        return null;
    };
    Deserialiser.parseItems = function (collection, options) {
        var items = collection.__jsonld.members || collection.__jsonld.items;
        if (items) {
            var _loop_1 = function (i) {
                if (options) {
                    options.index = i;
                }
                var item = this_1.parseItem(items[i], options);
                if (!item)
                    return { value: void 0 };
                // only add to items if not already parsed from backwards-compatible collections/manifests arrays
                if (collection.items.filter(function (m) { return m.id === item.id; })[0]) {
                    return "continue";
                }
                item.index = i;
                item.parentCollection = collection;
                collection.items.push(item);
            };
            var this_1 = this;
            for (var i = 0; i < items.length; i++) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
    };
    return Deserialiser;
}());

//# sourceMappingURL=Serialisation.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Service.js
var Service_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Service_Service = /** @class */ (function (_super) {
    Service_extends(Service, _super);
    function Service(jsonld, options) {
        return _super.call(this, jsonld, options) || this;
    }
    Service.prototype.getProfile = function () {
        var profile = this.getProperty("profile");
        if (!profile) {
            profile = this.getProperty("dcterms:conformsTo");
        }
        if (Array.isArray(profile)) {
            return profile[0];
        }
        return profile;
    };
    Service.prototype.getConfirmLabel = function () {
        return Utils_Utils.getLocalisedValue(this.getProperty("confirmLabel"), this.options.locale);
    };
    Service.prototype.getDescription = function () {
        return Utils_Utils.getLocalisedValue(this.getProperty("description"), this.options.locale);
    };
    Service.prototype.getFailureDescription = function () {
        return Utils_Utils.getLocalisedValue(this.getProperty("failureDescription"), this.options.locale);
    };
    Service.prototype.getFailureHeader = function () {
        return Utils_Utils.getLocalisedValue(this.getProperty("failureHeader"), this.options.locale);
    };
    Service.prototype.getHeader = function () {
        return Utils_Utils.getLocalisedValue(this.getProperty("header"), this.options.locale);
    };
    Service.prototype.getServiceLabel = function () {
        return Utils_Utils.getLocalisedValue(this.getProperty("label"), this.options.locale);
    };
    Service.prototype.getInfoUri = function () {
        var infoUri = this.id;
        if (!infoUri.endsWith("/")) {
            infoUri += "/";
        }
        infoUri += "info.json";
        return infoUri;
    };
    return Service;
}(ManifestResource_ManifestResource));

//# sourceMappingURL=Service.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Size.js
var Size = /** @class */ (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    return Size;
}());

//# sourceMappingURL=Size.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/StatusCode.js
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["AUTHORIZATION_FAILED"] = 1] = "AUTHORIZATION_FAILED";
    StatusCode[StatusCode["FORBIDDEN"] = 2] = "FORBIDDEN";
    StatusCode[StatusCode["INTERNAL_SERVER_ERROR"] = 3] = "INTERNAL_SERVER_ERROR";
    StatusCode[StatusCode["RESTRICTED"] = 4] = "RESTRICTED";
})(StatusCode || (StatusCode = {}));
//# sourceMappingURL=StatusCode.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Thumb.js
// todo: deprecate
// this is used by Sequence.getThumbs
var Thumb = /** @class */ (function () {
    function Thumb(width, canvas) {
        this.data = canvas;
        this.index = canvas.index;
        this.width = width;
        var heightRatio = canvas.getHeight() / canvas.getWidth();
        if (heightRatio) {
            this.height = Math.floor(this.width * heightRatio);
        }
        else {
            this.height = width;
        }
        this.uri = canvas.getCanonicalImageUri(width);
        this.label = canvas.getLabel().getValue(); // todo: pass locale?
    }
    return Thumb;
}());

//# sourceMappingURL=Thumb.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/Thumbnail.js
var Thumbnail_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Thumbnail = /** @class */ (function (_super) {
    Thumbnail_extends(Thumbnail, _super);
    function Thumbnail(jsonld, options) {
        return _super.call(this, jsonld, options) || this;
    }
    return Thumbnail;
}(Resource_Resource));

//# sourceMappingURL=Thumbnail.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/TreeNode.js

var TreeNode_TreeNode = /** @class */ (function () {
    function TreeNode(label, data) {
        this.label = label;
        this.data = data || {};
        this.nodes = [];
    }
    TreeNode.prototype.addNode = function (node) {
        this.nodes.push(node);
        node.parentNode = this;
    };
    TreeNode.prototype.isCollection = function () {
        return this.data.type === Utils_Utils.normaliseType(TreeNodeType.COLLECTION);
    };
    TreeNode.prototype.isManifest = function () {
        return this.data.type === Utils_Utils.normaliseType(TreeNodeType.MANIFEST);
    };
    TreeNode.prototype.isRange = function () {
        return this.data.type === Utils_Utils.normaliseType(TreeNodeType.RANGE);
    };
    return TreeNode;
}());

//# sourceMappingURL=TreeNode.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/TreeNodeType.js
var TreeNodeType;
(function (TreeNodeType) {
    TreeNodeType["COLLECTION"] = "collection";
    TreeNodeType["MANIFEST"] = "manifest";
    TreeNodeType["RANGE"] = "range";
})(TreeNodeType || (TreeNodeType = {}));
//# sourceMappingURL=TreeNodeType.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/internal.js




























//# sourceMappingURL=internal.js.map
// CONCATENATED MODULE: ./node_modules/manifesto.js/dist-esmodule/index.js


var loadManifest = function (url) {
    return Utils_Utils.loadManifest(url);
};
var parseManifest = function (manifest, options) {
    return Utils_Utils.parseManifest(manifest, options);
};
//# sourceMappingURL=index.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var VolumeEvents = /** @class */ (function () {
    function VolumeEvents() {
    }
    VolumeEvents.VOLUME_CHANGED = 'volumechanged';
    return VolumeEvents;
}());
exports.VolumeEvents = VolumeEvents;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MediaFormat = /** @class */ (function () {
    function MediaFormat(source, options) {
        if (options === void 0) { options = {}; }
        this.source = source;
        this.options = options;
    }
    MediaFormat.prototype.attachTo = function (element) {
        element.setAttribute('src', this.source);
    };
    return MediaFormat;
}());
exports.MediaFormat = MediaFormat;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function timelineTime(num) {
    return num;
}
exports.timelineTime = timelineTime;
function canvasTime(num) {
    return num;
}
exports.canvasTime = canvasTime;
function annotationTime(num) {
    return num;
}
exports.annotationTime = annotationTime;
function addTime(a, b) {
    return a + b;
}
exports.addTime = addTime;
function minusTime(a, b) {
    return a - b;
}
exports.minusTime = minusTime;
function multiplyTime(time, factor) {
    return time * factor;
}
exports.multiplyTime = multiplyTime;
function toMs(a) {
    return multiplyTime(a, 1000);
}
exports.toMs = toMs;
function fromMs(a) {
    return (a / 1000);
}
exports.fromMs = fromMs;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(23);

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(40);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CanvasInstanceEvents = /** @class */ (function () {
    function CanvasInstanceEvents() {
    }
    CanvasInstanceEvents.NEXT_RANGE = 'nextrange';
    CanvasInstanceEvents.PAUSECANVAS = 'pause';
    CanvasInstanceEvents.PLAYCANVAS = 'play';
    CanvasInstanceEvents.PREVIOUS_RANGE = 'previousrange';
    return CanvasInstanceEvents;
}());
exports.CanvasInstanceEvents = CanvasInstanceEvents;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseComponent", function() { return BaseComponent; });
var BaseComponent = /** @class */ (function () {
    function BaseComponent(options) {
        this.options = options;
        this.options.data = Object.assign({}, this.data(), options.data);
    }
    BaseComponent.prototype._init = function () {
        this.el = this.options.target;
        if (!this.el) {
            console.warn('element not found');
            return false;
        }
        this.el.innerHTML = '';
        return true;
    };
    BaseComponent.prototype.data = function () {
        return {};
    };
    BaseComponent.prototype.on = function (name, callback, ctx) {
        var e = this._e || (this._e = {});
        (e[name] || (e[name] = [])).push({
            fn: callback,
            ctx: ctx
        });
    };
    BaseComponent.prototype.fire = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var data = [].slice.call(arguments, 1);
        var evtArr = ((this._e || (this._e = {}))[name] || []).slice();
        var i = 0;
        var len = evtArr.length;
        for (i; i < len; i++) {
            evtArr[i].fn.apply(evtArr[i].ctx, data);
        }
    };
    BaseComponent.prototype._resize = function () {
    };
    BaseComponent.prototype.set = function (_data) {
    };
    return BaseComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var manifesto_js_1 = __webpack_require__(3);
var get_timestamp_1 = __webpack_require__(26);
var retarget_temporal_component_1 = __webpack_require__(12);
var VirtualCanvas = /** @class */ (function () {
    function VirtualCanvas() {
        this.canvases = [];
        this.durationMap = {};
        this.totalDuration = 0;
        // generate an id
        this.id = get_timestamp_1.getTimestamp();
    }
    VirtualCanvas.prototype.addCanvas = function (canvas) {
        // canvases need to be deep copied including functions
        this.canvases.push(jQuery.extend(true, {}, canvas));
        var duration = canvas.getDuration() || 0;
        this.totalDuration += duration;
        this.durationMap[canvas.id] = {
            duration: duration,
            runningDuration: this.totalDuration,
        };
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
                    var t = manifesto_js_1.Utils.getTemporalComponent(target);
                    if (!t) {
                        item.__jsonld.target += '#t=0,' + canvas.getDuration();
                    }
                }
            });
            items.forEach(function (item) {
                var target = item.getTarget();
                if (target) {
                    item.__jsonld.target = retarget_temporal_component_1.retargetTemporalComponent(_this.canvases, target);
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
        return Math.floor(duration);
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
exports.VirtualCanvas = VirtualCanvas;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var manifesto_js_1 = __webpack_require__(3);
function retargetTemporalComponent(canvases, target) {
    var t = manifesto_js_1.Utils.getTemporalComponent(target);
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
}
exports.retargetTemporalComponent = retargetTemporalComponent;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var hls_media_types_1 = __webpack_require__(14);
function isHLSFormat(format) {
    return hls_media_types_1.hlsMimeTypes.includes(format.toString());
}
exports.isHLSFormat = isHLSFormat;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.hlsMimeTypes = [
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
    'application/mpegurl',
];


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isMpegDashFormat(format) {
    return format.toString() === 'application/dash+xml';
}
exports.isMpegDashFormat = isMpegDashFormat;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var hls_media_types_1 = __webpack_require__(14);
function canPlayHls() {
    var doc = typeof document === 'object' && document;
    var videoElement = doc && doc.createElement('video');
    var isVideoSupported = Boolean(videoElement && videoElement.canPlayType);
    return (isVideoSupported &&
        hls_media_types_1.hlsMimeTypes.some(function (canItPlay) {
            if (videoElement) {
                return /maybe|probably/i.test(videoElement.canPlayType(canItPlay));
            }
            return false;
        }));
}
exports.canPlayHls = canPlayHls;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isSafari() {
    // https://stackoverflow.com/questions/7944460/detect-safari-browser?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
exports.isSafari = isSafari;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getSpatialComponent(target) {
    var spatial = /xywh=([^&]+)/g.exec(target);
    var xywh = null;
    if (spatial && spatial[1]) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        xywh = spatial[1].split(',');
    }
    return xywh;
}
exports.getSpatialComponent = getSpatialComponent;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Events = /** @class */ (function () {
    function Events() {
    }
    Events.PLAY = 'play';
    Events.PAUSE = 'pause';
    Events.MEDIA_READY = 'mediaready';
    Events.LOG = 'log';
    Events.RANGE_CHANGED = 'rangechanged';
    Events.WAVEFORM_READY = 'waveformready';
    Events.WAVEFORMS_READY = 'waveformsready';
    return Events;
}());
exports.Events = Events;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function compare(a, b) {
    var changed = [];
    Object.keys(a).forEach(function (p) {
        if (!Object.is(b[p], a[p])) {
            changed.push(p);
        }
    });
    return changed;
}
function diffData(a, b) {
    return Array.from(new Set(compare(a, b).concat(compare(b, a))));
}
exports.diffData = diffData;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(23);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Recursively flattens `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flattenDeep([1, [2, [3, [4]], 5]]);
 * // => [1, 2, 3, 4, 5]
 */
function flattenDeep(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, INFINITY) : [];
}

module.exports = flattenDeep;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
var manifesto_js_1 = __webpack_require__(3);
var canvas_instance_events_1 = __webpack_require__(9);
var base_component_1 = __webpack_require__(10);
var volume_events_1 = __webpack_require__(4);
var virtual_canvas_1 = __webpack_require__(11);
var canvas_instance_1 = __webpack_require__(27);
var diff_data_1 = __webpack_require__(20);
var get_first_targeted_canvas_id_1 = __webpack_require__(35);
var av_component_events_1 = __webpack_require__(19);
var logger_1 = __webpack_require__(2);
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
        this._$element = $(this.el);
        if (!success) {
            logger_1.Logger.error('Component failed to initialise');
        }
        return success;
    };
    AVComponent.prototype.getCurrentCanvasInstance = function () {
        var range = this._data.helper.getRangeById(this._data.range.id);
        if (!range) {
            return null;
        }
        // @ts-ignore
        var canvasId = get_first_targeted_canvas_id_1.getFirstTargetedCanvasId(range);
        // @ts-ignore
        return canvasId ? this._data.helper.getCanvasById(canvasId) : null;
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
                currentTime: 'Current Time',
                collapse: 'Collapse',
                duration: 'Duration',
                expand: 'Expand',
                mute: 'Mute',
                next: 'Next',
                pause: 'Pause',
                play: 'Play',
                previous: 'Previous',
                unmute: 'Unmute',
            },
            enableFastForward: true,
            enableFastRewind: true,
        };
    };
    AVComponent.prototype.set = function (data) {
        var _this = this;
        // eslint-disable-next-line no-debugger
        logger_1.Logger.groupCollapsed('AVComponent.set()');
        logger_1.Logger.log('Data', data);
        var oldData = Object.assign({}, this._data);
        this._data = Object.assign(this._data, data);
        var diff = diff_data_1.diffData(oldData, this._data);
        // changing any of these data properties forces a reload.
        if (diff.includes('helper')) {
            // create canvases
            this._reset();
        }
        if (!this._data.helper) {
            logger_1.Logger.warn('must pass a helper object');
            return;
        }
        this.canvasInstances.forEach(function (canvasInstance, index) {
            var toSet = {};
            if (diff.includes('limitToRange') && _this._data.canvasId) {
                toSet.limitToRange = _this._data.limitToRange;
            }
            if (diff.includes('constrainNavigationToRange') && _this._data.canvasId) {
                toSet.constrainNavigationToRange = _this._data.constrainNavigationToRange;
            }
            if (diff.includes('autoSelectRange') && _this._data.canvasId) {
                toSet.autoSelectRange = _this._data.autoSelectRange;
            }
            canvasInstance.set(toSet);
        });
        if ((diff.includes('virtualCanvasEnabled') || diff.includes('canvasId')) && this._data.canvasId) {
            var nextCanvasInstance_1 = this._getCanvasInstanceById(this._data.canvasId);
            if (nextCanvasInstance_1) {
                this.canvasInstances.forEach(function (canvasInstance) {
                    // hide canvases that don't have the same id
                    if (canvasInstance.getCanvasId() !== nextCanvasInstance_1.getCanvasId()) {
                        canvasInstance.set({
                            visible: false,
                        });
                    }
                    else {
                        if (diff.includes('range')) {
                            canvasInstance.set({
                                visible: true,
                                range: _this._data.range ? jQuery.extend(true, {}, _this._data.range) : undefined,
                            });
                        }
                        else {
                            canvasInstance.set({
                                visible: true,
                            });
                        }
                    }
                });
            }
        }
        if (diff.includes('virtualCanvasEnabled')) {
            this.set({
                range: undefined,
            });
            // as you don't know the id of virtual canvases, you can toggle them on
            // but when toggling off, you must call showCanvas to show the next canvas
            if (this._data.virtualCanvasEnabled) {
                this.canvasInstances.forEach(function (canvasInstance) {
                    if (canvasInstance.isVirtual()) {
                        _this.set({
                            canvasId: canvasInstance.getCanvasId(),
                            range: undefined,
                        });
                    }
                });
            }
        }
        if (diff.includes('range') && this._data.range) {
            // @ts-ignore
            var range = this._data.helper.getRangeById(this._data.range.id);
            if (!range) {
                logger_1.Logger.warn('range not found', { id: this._data.range.id });
            }
            else {
                var canvasId = get_first_targeted_canvas_id_1.getFirstTargetedCanvasId(range);
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
                            (this._data.canvasId.includes('://') ? manifesto_js_1.Utils.normaliseUrl(this._data.canvasId) : this._data.canvasId) !==
                                canvasId) {
                            this.set({
                                canvasId: canvasId,
                                range: jQuery.extend(true, {}, range),
                            });
                        }
                        else {
                            canvasInstance.set({
                                range: jQuery.extend(true, {}, range),
                            });
                        }
                    }
                }
            }
        }
        this._render();
        this._resize();
        logger_1.Logger.groupEnd();
    };
    AVComponent.prototype._render = function () {
        // no-op
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
        if (this._data && this._data.helper && this._data.helper.manifest) {
            // if the manifest has an auto-advance behavior, join the canvases into a single "virtual" canvas
            var behavior = this._data.helper.manifest.getBehavior();
            var canvases = this._getCanvases();
            if (behavior && behavior.toString() === 'auto-advance') {
                // @todo - use time-slices to create many virtual canvases with support for sliced canvases with start and end times.
                var virtualCanvas_1 = new virtual_canvas_1.VirtualCanvas();
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
                if (_this._data.content) {
                    if (_this._posterImageExpanded) {
                        var label = _this._data.content.collapse;
                        _this._$posterExpandButton.prop('title', label);
                        _this._$posterExpandButton.find('i').switchClass('expand', 'collapse');
                    }
                    else {
                        var label = _this._data.content.expand;
                        _this._$posterExpandButton.prop('title', label);
                        _this._$posterExpandButton.find('i').switchClass('collapse', 'expand');
                    }
                }
            });
            // this._logMessage('get accompanying canvas');
            // poster canvas
            // @ts-ignore
            var accompanyingCanvas = this._data.helper.getAccompanyingCanvas();
            //this._logMessage(accompanyingCanvas);
            if (!accompanyingCanvas) {
                accompanyingCanvas = this._data.helper.getPosterCanvas();
            }
            if (accompanyingCanvas) {
                this._posterCanvasWidth = accompanyingCanvas.getWidth();
                this._posterCanvasHeight = accompanyingCanvas.getHeight();
                var posterImage = this._data.helper.getPosterImage();
                if (!posterImage) {
                    posterImage = this._data.helper.getAccompanyingCanvasImage();
                }
                if (posterImage) {
                    this._$posterContainer.append(this._$posterImage);
                    var css = this._getPosterImageCss(this._posterImageExpanded);
                    css = Object.assign({}, css, {
                        'background-image': 'url(' + posterImage + ')',
                    });
                    this._$posterImage.css(css);
                }
            }
        }
    };
    AVComponent.prototype.setCurrentTime = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            var canvas;
            return __generator(this, function (_a) {
                canvas = this._getCurrentCanvas();
                if (canvas) {
                    return [2 /*return*/, canvas.setCurrentTime(time)];
                }
                return [2 /*return*/];
            });
        });
    };
    AVComponent.prototype.getCurrentTime = function () {
        var canvas = this._getCurrentCanvas();
        if (canvas) {
            return canvas.getClockTime();
        }
        return 0;
    };
    AVComponent.prototype.isPlaying = function () {
        return this.canvasInstances.reduce(function (isPlaying, next) {
            return isPlaying || next.isPlaying();
        }, false);
    };
    AVComponent.prototype._checkAllMediaReady = function () {
        if (this._readyMedia === this.canvasInstances.length) {
            clearInterval(this._checkAllMediaReadyInterval);
            this.fire(av_component_events_1.Events.MEDIA_READY);
            this.resize();
        }
    };
    AVComponent.prototype._checkAllWaveformsReady = function () {
        if (this._readyWaveforms === this._getCanvasInstancesWithWaveforms().length) {
            clearInterval(this._checkAllWaveformsReadyInterval);
            this.fire(av_component_events_1.Events.WAVEFORMS_READY);
            this.resize();
        }
    };
    AVComponent.prototype._getCanvasInstancesWithWaveforms = function () {
        return this.canvasInstances.filter(function (c) {
            return c.waveforms.length > 0;
        });
    };
    AVComponent.prototype._getCanvases = function () {
        // @todo - figure out when this is used and if it needs time slicing considerations.
        if (this._data.helper) {
            // @ts-ignore
            return this._data.helper.getCanvases();
        }
        return [];
    };
    AVComponent.prototype._initCanvas = function (canvas) {
        // @todo - change these events for time-slicing
        var _this = this;
        var canvasInstance = new canvas_instance_1.CanvasInstance({
            target: document.createElement('div'),
            data: Object.assign({}, { canvas: canvas }, this._data),
        });
        canvasInstance.logMessage = this._logMessage.bind(this);
        canvasInstance.isOnlyCanvasInstance = this._getCanvases().length === 1;
        this._$element.append(canvasInstance.$playerElement);
        canvasInstance.init();
        this.canvasInstances.push(canvasInstance);
        canvasInstance.on('play', function () {
            _this.fire(av_component_events_1.Events.PLAY, canvasInstance);
        }, false);
        canvasInstance.on('pause', function () {
            _this.fire(av_component_events_1.Events.PAUSE, canvasInstance);
        }, false);
        canvasInstance.on(av_component_events_1.Events.MEDIA_READY, function () {
            _this._readyMedia++;
            canvasInstance.loaded();
        }, false);
        canvasInstance.on(av_component_events_1.Events.WAVEFORM_READY, function () {
            _this._readyWaveforms++;
        }, false);
        // canvasInstance.on(Events.RESETCANVAS, () => {
        //     this.playCanvas(canvasInstance.canvas.id);
        // }, false);
        canvasInstance.on(canvas_instance_events_1.CanvasInstanceEvents.PREVIOUS_RANGE, function () {
            _this._prevRange();
            _this.play();
        }, false);
        canvasInstance.on(canvas_instance_events_1.CanvasInstanceEvents.NEXT_RANGE, function () {
            _this._nextRange();
            _this.play();
        }, false);
        canvasInstance.on(av_component_events_1.Events.RANGE_CHANGED, function (rangeId) {
            _this.fire(av_component_events_1.Events.RANGE_CHANGED, rangeId);
        }, false);
        canvasInstance.on(volume_events_1.VolumeEvents.VOLUME_CHANGED, function (volume) {
            _this._setCanvasInstanceVolumes(volume);
            _this.fire(volume_events_1.VolumeEvents.VOLUME_CHANGED, volume);
        }, false);
    };
    AVComponent.prototype.getCurrentRange = function () {
        // @todo - change for time-slicing
        var rangeId = this._data.helper.getCurrentRange().id;
        return (this._getCurrentCanvas().ranges.find(function (range) {
            return range.id === rangeId;
        }) || null);
    };
    AVComponent.prototype._prevRange = function () {
        // @todo - change for time-slicing
        if (!this._data || !this._data.helper) {
            return;
        }
        var currentRange = this.getCurrentRange();
        if (currentRange) {
            var currentTime = this.getCurrentTime();
            var startTime = currentRange.getDuration().start || 0;
            // 5 = 5 seconds before going back to current range.
            if (currentTime - startTime > 5) {
                this.setCurrentTime(startTime);
                return;
            }
        }
        // @ts-ignore
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
        // @todo - change for time-slicing
        if (!this._data || !this._data.helper) {
            return;
        }
        // @ts-ignore
        var nextRange = this._data.helper.getNextRange();
        if (nextRange) {
            this.playRange(nextRange.id);
        }
    };
    AVComponent.prototype._setCanvasInstanceVolumes = function (volume) {
        this.canvasInstances.forEach(function (canvasInstance) {
            canvasInstance.set({
                volume: volume,
            });
        });
    };
    AVComponent.prototype._getNormaliseCanvasId = function (canvasId) {
        return canvasId.includes('://') ? manifesto_js_1.Utils.normaliseUrl(canvasId) : canvasId;
    };
    AVComponent.prototype._getCanvasInstanceById = function (canvasId) {
        // @todo - figure out when this is used and if it needs time slicing considerations.
        canvasId = this._getNormaliseCanvasId(canvasId);
        // if virtual canvas is enabled, check for that first
        if (this._data.virtualCanvasEnabled) {
            for (var i = 0; i < this.canvasInstances.length; i++) {
                var canvasInstance = this.canvasInstances[i];
                var currentCanvasId = canvasInstance.getCanvasId();
                if (currentCanvasId) {
                    currentCanvasId = this._getNormaliseCanvasId(currentCanvasId);
                    if (((canvasInstance.isVirtual() || this.canvasInstances.length === 1) && currentCanvasId === canvasId) ||
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
                    var canvasInstanceId = manifesto_js_1.Utils.normaliseUrl(id);
                    if (canvasInstanceId === canvasId) {
                        return canvasInstance;
                    }
                }
            }
        }
        return undefined;
    };
    AVComponent.prototype._getCurrentCanvas = function () {
        // @todo - use time slices to get current virtual canvas
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
                range: undefined,
            });
        }
    };
    AVComponent.prototype.play = function () {
        var currentCanvas = this._getCurrentCanvas();
        if (currentCanvas) {
            currentCanvas.play();
        }
    };
    AVComponent.prototype.viewRange = function (rangeId) {
        var currentCanvas = this._getCurrentCanvas();
        if (currentCanvas) {
            currentCanvas.viewRange(rangeId);
        }
    };
    AVComponent.prototype.pause = function () {
        var currentCanvas = this._getCurrentCanvas();
        if (currentCanvas) {
            currentCanvas.pause();
        }
    };
    AVComponent.prototype.playRange = function (rangeId, autoChanged) {
        if (autoChanged === void 0) { autoChanged = false; }
        if (!this._data.helper) {
            return;
        }
        // @ts-ignore
        var range = this._data.helper.getRangeById(rangeId);
        if (range) {
            this.set({
                range: jQuery.extend(true, { autoChanged: autoChanged }, range),
            });
        }
    };
    AVComponent.prototype.showCanvas = function (canvasId) {
        // @todo - change for time-slicing, see where it's used and probably not used it.
        // if the passed canvas id is already the current canvas id, but the canvas isn't visible
        // (switching from virtual canvas)
        var currentCanvas = this._getCurrentCanvas();
        if (this._data.virtualCanvasEnabled &&
            currentCanvas &&
            currentCanvas.getCanvasId() === canvasId &&
            !currentCanvas.isVisible()) {
            currentCanvas.set({
                visible: true,
            });
        }
        else {
            this.set({
                canvasId: canvasId,
            });
        }
    };
    AVComponent.prototype._logMessage = function (message) {
        this.fire(av_component_events_1.Events.LOG, message);
    };
    AVComponent.prototype._getPosterImageCss = function (expanded) {
        var currentCanvas = this._getCurrentCanvas();
        if (currentCanvas) {
            var $options = currentCanvas.$playerElement.find('.options-container');
            var containerWidth = currentCanvas.$playerElement.parent().width();
            var containerHeight = currentCanvas.$playerElement.parent().height() - $options.height();
            if (expanded) {
                return {
                    top: 0,
                    left: 0,
                    width: containerWidth,
                    height: containerHeight,
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
                    width = containerWidth * (this._data.posterImageRatio || 1);
                    height = width * ratio;
                }
                else {
                    // either height is greater, or width and height are equal
                    ratio = this._posterCanvasWidth / this._posterCanvasHeight;
                    height = containerHeight * (this._data.posterImageRatio || 1);
                    width = height * ratio;
                }
                return {
                    top: 0,
                    left: containerWidth - width,
                    width: width,
                    height: height,
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
    AVComponent.newRanges = true;
    return AVComponent;
}(base_component_1.BaseComponent));
exports.AVComponent = AVComponent;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(38),
    isFlattenable = __webpack_require__(39);

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(e,n){return n=n||{},new Promise(function(t,r){var s=new XMLHttpRequest,o=[],u=[],i={},a=function(){return{ok:2==(s.status/100|0),statusText:s.statusText,status:s.status,url:s.responseURL,text:function(){return Promise.resolve(s.responseText)},json:function(){return Promise.resolve(s.responseText).then(JSON.parse)},blob:function(){return Promise.resolve(new Blob([s.response]))},clone:a,headers:{keys:function(){return o},entries:function(){return u},get:function(e){return i[e.toLowerCase()]},has:function(e){return e.toLowerCase()in i}}}};for(var l in s.open(n.method||"get",e,!0),s.onload=function(){s.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,function(e,n,t){o.push(n=n.toLowerCase()),u.push([n,t]),i[n]=i[n]?i[n]+","+t:t}),t(a())},s.onerror=r,s.withCredentials="include"==n.credentials,n.headers)s.setRequestHeader(l,n.headers[l]);s.send(n.body||null)})});
//# sourceMappingURL=unfetch.module.js.map


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getTimestamp() {
    return String(new Date().valueOf());
}
exports.getTimestamp = getTimestamp;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
var manifesto_js_1 = __webpack_require__(3);
var base_component_1 = __webpack_require__(10);
var media_element_1 = __webpack_require__(50);
var timeplan_player_1 = __webpack_require__(55);
var volume_events_1 = __webpack_require__(4);
var extract_media_from_annotation_bodies_1 = __webpack_require__(28);
var volume_control_1 = __webpack_require__(29);
var composite_media_element_1 = __webpack_require__(56);
var create_time_plans_from_manifest_1 = __webpack_require__(30);
var get_media_source_from_annotation_body_1 = __webpack_require__(31);
var canvas_instance_events_1 = __webpack_require__(9);
var av_component_1 = __webpack_require__(22);
var virtual_canvas_1 = __webpack_require__(11);
var composite_waveform_1 = __webpack_require__(57);
var av_component_events_1 = __webpack_require__(19);
var is_hls_format_1 = __webpack_require__(13);
var is_mpeg_dash_format_1 = __webpack_require__(15);
var retarget_temporal_component_1 = __webpack_require__(12);
var get_spatial_component_1 = __webpack_require__(18);
var can_play_hls_1 = __webpack_require__(16);
var format_time_1 = __webpack_require__(32);
var is_safari_1 = __webpack_require__(17);
var normalise_number_1 = __webpack_require__(33);
var diff_data_1 = __webpack_require__(20);
var is_virtual_1 = __webpack_require__(34);
var relative_time_1 = __webpack_require__(6);
var logger_1 = __webpack_require__(2);
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
        //private _lastCanvasHeight: number | undefined;
        //private _lastCanvasWidth: number | undefined;
        _this._lowPriorityFrequency = 250;
        _this._mediaSyncMarginSecs = 1;
        _this._rangeSpanPadding = 0.25;
        _this._readyMediaCount = 0;
        _this._stallRequestedBy = []; //todo: type
        _this._wasPlaying = false;
        //private _waveformNeedsRedraw: boolean = true;
        _this.ranges = [];
        _this.waveforms = [];
        _this._buffering = false;
        _this._bufferShown = false;
        _this.isOnlyCanvasInstance = false;
        _this.waveformDeltaX = 0;
        _this.waveformPageX = 0;
        _this.waveFormInit = false;
        _this._scaleY = function (amplitude, height) {
            var range = 256;
            return Math.max(_this._data.waveformBarWidth, (amplitude * height) / range);
        };
        _this._$element = $(_this.options.target);
        _this._data = _this.options.data;
        _this.$playerElement = $('<div class="player player--loading"></div>');
        return _this;
    }
    CanvasInstance.prototype.loaded = function () {
        var _this = this;
        setTimeout(function () {
            _this.$playerElement.removeClass('player--loading');
        }, 500);
    };
    CanvasInstance.prototype.isPlaying = function () {
        return this._isPlaying;
    };
    CanvasInstance.prototype.getClockTime = function () {
        return this._canvasClockTime;
    };
    CanvasInstance.prototype.createTimeStops = function () {
        var _this = this;
        var helper = this._data.helper;
        var virtualCanvas = this._data.canvas;
        if (!helper || !virtualCanvas) {
            return;
        }
        this.ranges = [];
        this._contentAnnotations = [];
        var canvases = virtualCanvas.canvases;
        var mediaElements = [];
        for (var _i = 0, canvases_1 = canvases; _i < canvases_1.length; _i++) {
            var canvas = canvases_1[_i];
            var annotations = canvas.getContent();
            for (var _a = 0, annotations_1 = annotations; _a < annotations_1.length; _a++) {
                var annotation = annotations_1[_a];
                var annotationBody = extract_media_from_annotation_bodies_1.extractMediaFromAnnotationBodies(annotation);
                if (!annotationBody)
                    continue;
                var mediaSource = get_media_source_from_annotation_body_1.getMediaSourceFromAnnotationBody(annotation, annotationBody, {
                    id: canvas.id,
                    duration: canvas.getDuration() || 0,
                    height: canvas.getHeight(),
                    width: canvas.getWidth(),
                });
                var mediaElement = new media_element_1.MediaElement(mediaSource, {
                    adaptiveAuthEnabled: this._data.adaptiveAuthEnabled,
                });
                mediaElement.setSize(this._convertToPercentage(mediaSource.x || 0, canvas.getHeight()), this._convertToPercentage(mediaSource.y || 0, canvas.getWidth()), this._convertToPercentage(mediaSource.width || canvas.getWidth(), canvas.getWidth()), this._convertToPercentage(mediaSource.height || canvas.getHeight(), canvas.getHeight()));
                mediaElements.push(mediaElement);
                var seeAlso = annotation.getProperty('seeAlso');
                if (seeAlso && seeAlso.length) {
                    var dat = seeAlso[0].id;
                    this.waveforms.push(dat);
                }
            }
        }
        var compositeMediaElement = new composite_media_element_1.CompositeMediaElement(mediaElements);
        compositeMediaElement.appendTo(this.$playerElement);
        compositeMediaElement.load().then(function () {
            // this._updateDurationDisplay();
            _this.fire(av_component_events_1.Events.MEDIA_READY);
        });
        // this._renderSyncIndicator(data)
        // @ts-ignore
        var plan = create_time_plans_from_manifest_1.createTimePlansFromManifest(helper.manifest, mediaElements);
        // @ts-ignore
        window.timePlanPlayer = this.timePlanPlayer = new timeplan_player_1.TimePlanPlayer(compositeMediaElement, plan, function (rangeId) {
            _this.setCurrentRangeId(rangeId, { autoChanged: true });
        }, function (time) {
            _this._canvasClockTime = time;
        }, function (isPlaying) {
            if (isPlaying) {
                _this.play(true);
            }
            else {
                _this.pause(true);
            }
        });
    };
    CanvasInstance.prototype.init = function () {
        var _this = this;
        if (!this._data || !this._data.content || !this._data.canvas) {
            logger_1.Logger.warn('unable to initialise, missing canvas or content');
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
        this._$fastForward = $("\n                                <button class=\"btn\" title=\"" + this._data.content.next + "\">\n                                    <i class=\"av-icon av-icon-fast-forward\" aria-hidden=\"true\"></i>" + (this._data.content.fastForward || '') + "\n                                </button>");
        this._$fastRewind = $("\n                                <button class=\"btn\" title=\"" + this._data.content.next + "\">\n                                    <i class=\"av-icon av-icon-fast-rewind\" aria-hidden=\"true\"></i>" + (this._data.content.fastRewind || '') + "\n                                </button>");
        this._$timeDisplay = $('<div class="time-display"><span class="canvas-time"></span> / <span class="canvas-duration"></span></div>');
        this._$canvasTime = this._$timeDisplay.find('.canvas-time');
        this._$canvasDuration = this._$timeDisplay.find('.canvas-duration');
        if (this.isVirtual()) {
            this.$playerElement.addClass('virtual');
        }
        var $volume = $('<div class="volume"></div>');
        this._volume = new volume_control_1.AVVolumeControl({
            target: $volume[0],
            data: Object.assign({}, this._data),
        });
        this._volume.on(volume_events_1.VolumeEvents.VOLUME_CHANGED, function (value) {
            _this.fire(volume_events_1.VolumeEvents.VOLUME_CHANGED, value);
        }, false);
        // @todo make the buttons for FF and FR configurable.
        this._$controlsContainer.append(this._$prevButton, this._data.enableFastRewind ? this._$fastRewind : null, this._$playButton, this._data.enableFastForward ? this._$fastForward : null, this._$nextButton, this._$timeDisplay, $volume);
        this._$canvasTimelineContainer.append(this._$canvasHoverPreview, this._$canvasHoverHighlight, this._$durationHighlight);
        this._$rangeTimelineContainer.append(this._$rangeHoverPreview, this._$rangeHoverHighlight);
        this._$optionsContainer.append(this._$canvasTimelineContainer, this._$rangeTimelineContainer, this._$controlsContainer);
        this.$playerElement.append(this._$canvasContainer, this._$optionsContainer);
        this._$canvasHoverPreview.hide();
        this._$rangeHoverPreview.hide();
        var newRanges = this.isVirtual() && av_component_1.AVComponent.newRanges;
        // Should bootstrap ranges and content.
        if (newRanges) {
            this.createTimeStops();
        }
        if (!newRanges) {
            if (this._data && this._data.helper && this._data.canvas) {
                var ranges_1 = [];
                // if the canvas is virtual, get the ranges for all sub canvases
                if (is_virtual_1.isVirtual(this._data.canvas)) {
                    this._data.canvas.canvases.forEach(function (canvas) {
                        if (_this._data && _this._data.helper) {
                            // @ts-ignore
                            var r = _this._data.helper.getCanvasRanges(canvas);
                            var clonedRanges_1 = [];
                            // shift the range targets forward by the duration of their previous canvases
                            r.forEach(function (range) {
                                var clonedRange = jQuery.extend(true, {}, range);
                                clonedRanges_1.push(clonedRange);
                                if (clonedRange.canvases && clonedRange.canvases.length) {
                                    for (var i = 0; i < clonedRange.canvases.length; i++) {
                                        if (is_virtual_1.isVirtual(_this._data.canvas)) {
                                            clonedRange.canvases[i] = retarget_temporal_component_1.retargetTemporalComponent(_this._data.canvas.canvases, clonedRange.__jsonld.items[i].id);
                                        }
                                    }
                                }
                            });
                            ranges_1.push.apply(ranges_1, clonedRanges_1);
                        }
                    });
                }
                else {
                    // @ts-ignore
                    ranges_1 = ranges_1.concat(this._data.helper.getCanvasRanges(this._data.canvas));
                }
                ranges_1.forEach(function (range) {
                    _this.ranges.push(range);
                });
            }
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
            this._canvasHeight = this._canvasWidth * (this._data.defaultAspectRatio || 1); //this._data.defaultCanvasHeight;
        }
        else {
            this._canvasHeight = canvasHeight;
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var that = this;
        var prevClicks = 0;
        var prevTimeout = 0;
        this._$prevButton.on('touchstart click', function (e) {
            e.preventDefault();
            prevClicks++;
            if (prevClicks === 1) {
                // single click
                _this._previous(false);
                prevTimeout = setTimeout(function () {
                    prevClicks = 0;
                    prevTimeout = 0;
                }, _this._data.doubleClickMS);
            }
            else {
                // double click
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
        this._$fastForward.on('touchstart click', function (e) {
            var end = _this.getRangeTiming().end;
            var goToTime = relative_time_1.addTime(_this.getClockTime(), 20);
            if (goToTime < end) {
                return _this._setCurrentTime(goToTime);
            }
            return _this._setCurrentTime(end);
        });
        this._$fastRewind.on('touchstart click', function (e) {
            var start = _this.getRangeTiming().start;
            var goToTime = relative_time_1.minusTime(_this.getClockTime(), 20);
            if (goToTime >= start) {
                return _this._setCurrentTime(goToTime);
            }
            return _this._setCurrentTime(start);
        });
        if (newRanges) {
            this._$canvasTimelineContainer.slider({
                value: 0,
                step: 0.01,
                orientation: 'horizontal',
                range: 'min',
                min: 0,
                max: this.timePlanPlayer.getDuration(),
                animate: false,
                slide: function (evt, ui) {
                    _this._setCurrentTime(_this.timePlanPlayer.plan.start + ui.value);
                },
            });
        }
        else {
            this._$canvasTimelineContainer.slider({
                value: 0,
                step: 0.01,
                orientation: 'horizontal',
                range: 'min',
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
                },
            });
        }
        this._$canvasTimelineContainer.mouseout(function () {
            that._$canvasHoverHighlight.width(0);
            that._$canvasHoverPreview.hide();
        });
        this._$rangeTimelineContainer.mouseout(function () {
            that._$rangeHoverHighlight.width(0);
            that._$rangeHoverPreview.hide();
        });
        this._$canvasTimelineContainer.on('mousemove', function (e) {
            if (newRanges) {
                _this._updateHoverPreview(e, _this._$canvasTimelineContainer, _this.timePlanPlayer.getDuration());
            }
            else {
                _this._updateHoverPreview(e, _this._$canvasTimelineContainer, _this._getDuration());
            }
        });
        this._$rangeTimelineContainer.on('mousemove', function (e) {
            if (newRanges) {
                _this._updateHoverPreview(e, _this._$canvasTimelineContainer, _this.timePlanPlayer.getDuration());
            }
            else if (_this._data.range) {
                var duration = _this._data.range.getDuration();
                _this._updateHoverPreview(e, _this._$rangeTimelineContainer, duration ? duration.getLength() : 0);
            }
        });
        if (newRanges) {
            return;
        }
        // create annotations
        this._contentAnnotations = [];
        var items = this._data.canvas.getContent(); // (<any>this._data.canvas).__jsonld.content[0].items;
        // always hide timelineItemContainer for now
        this._$timelineItemContainer.hide();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var mediaSource = void 0;
            var bodies = item.getBody();
            if (!bodies.length) {
                logger_1.Logger.warn('item has no body');
                return;
            }
            var body = this._getBody(bodies);
            if (!body) {
                // if no suitable format was found for the current browser, skip this item.
                logger_1.Logger.warn('unable to find suitable format for', item.id);
                continue;
            }
            var type = body.getType();
            var format = body.getFormat();
            if (type && type.toString() === 'textualbody') {
                //mediaSource = (<any>body).value;
            }
            else {
                mediaSource = body.id.split('#')[0];
            }
            var target = item.getTarget();
            if (!target) {
                logger_1.Logger.warn('item has no target');
                return;
            }
            var xywh = get_spatial_component_1.getSpatialComponent(target);
            var t = manifesto_js_1.Utils.getTemporalComponent(target);
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
            var offsetStart = ot[0] ? parseInt(ot[0]) : ot[0], offsetEnd = ot[1] ? parseInt(ot[1]) : ot[1];
            // todo: type this
            var itemData = {
                active: false,
                end: endTime,
                endOffset: offsetEnd,
                format: format,
                height: percentageHeight,
                left: percentageLeft,
                source: mediaSource,
                start: startTime,
                startOffset: offsetStart,
                top: percentageTop,
                type: type,
                width: percentageWidth,
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
    };
    CanvasInstance.prototype._getBody = function (bodies) {
        // if there's an HLS format and HLS is supported in this browser
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            var format = body.getFormat();
            if (format) {
                if (is_hls_format_1.isHLSFormat(format) && can_play_hls_1.canPlayHls()) {
                    return body;
                }
            }
        }
        // if there's a Dash format and the browser isn't Safari
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            var format = body.getFormat();
            if (format) {
                if (is_mpeg_dash_format_1.isMpegDashFormat(format) && !is_safari_1.isSafari()) {
                    return body;
                }
            }
        }
        // otherwise, return the first format that isn't HLS or Dash
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            var format = body.getFormat();
            if (format) {
                if (!is_hls_format_1.isHLSFormat(format) && !is_mpeg_dash_format_1.isMpegDashFormat(format)) {
                    return body;
                }
            }
        }
        // couldn't find a suitable format
        return null;
    };
    CanvasInstance.prototype._getDuration = function () {
        if (this.isVirtual() && av_component_1.AVComponent.newRanges) {
            return this.timePlanPlayer.getDuration();
        }
        if (this._data && this._data.canvas) {
            return Math.floor(this._data.canvas.getDuration());
        }
        return 0;
    };
    CanvasInstance.prototype.data = function () {
        return {
            waveformColor: '#fff',
            waveformBarSpacing: 4,
            waveformBarWidth: 2,
            volume: 1,
        };
    };
    /**
     * @deprecated
     */
    CanvasInstance.prototype.isVirtual = function () {
        return this._data.canvas instanceof virtual_canvas_1.VirtualCanvas;
    };
    CanvasInstance.prototype.isVisible = function () {
        return !!this._data.visible;
    };
    CanvasInstance.prototype.includesVirtualSubCanvas = function (canvasId) {
        if (is_virtual_1.isVirtual(this._data.canvas) && this._data.canvas && this._data.canvas.canvases) {
            for (var i = 0; i < this._data.canvas.canvases.length; i++) {
                var canvas = this._data.canvas.canvases[i];
                if (manifesto_js_1.Utils.normaliseUrl(canvas.id) === canvasId) {
                    return true;
                }
            }
        }
        return false;
    };
    CanvasInstance.prototype.setVisibility = function (visibility) {
        if (this._data.visible === visibility) {
            return;
        }
        this._data.visible = visibility;
        if (visibility) {
            this._rewind();
            this.$playerElement.show();
        }
        else {
            this.$playerElement.hide();
            this.pause();
        }
        this.resize();
    };
    CanvasInstance.prototype.viewRange = function (rangeId) {
        if (this.currentRange !== rangeId) {
            logger_1.Logger.log("Switching range from " + this.currentRange + " to " + rangeId);
            this.setCurrentRangeId(rangeId);
            // Entrypoint for changing a range. Only get's called when change came from external source.
            if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
                this._setCurrentTime(this.timePlanPlayer.setRange(rangeId), true);
            }
            else {
                var range = this._data.helper.getRangeById(rangeId);
                this.set({
                    range: jQuery.extend(true, { autoChanged: true }, range),
                });
                // const { start } = this.getRangeTiming();
                // this._setCurrentTime(start, true);
            }
            this._render();
        }
    };
    CanvasInstance.prototype.setCurrentRangeId = function (range, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.autoChanged, autoChanged = _c === void 0 ? false : _c, _d = _b.limitToRange, limitToRange = _d === void 0 ? false : _d;
        if (!this.currentRange && range && this.limitToRange) {
            // @todo which case was this covering..
            //this.limitToRange = false;
        }
        logger_1.Logger.log('Setting current range id', range);
        // This is the end of the chain for changing a range.
        if (range && this.currentRange !== range) {
            this.currentRange = range;
            this.fire(av_component_events_1.Events.RANGE_CHANGED, range);
        }
        else if (range === null) {
            this.currentRange = undefined;
            this.fire(av_component_events_1.Events.RANGE_CHANGED, null);
        }
        this._render();
    };
    CanvasInstance.prototype.setVolume = function (volume) {
        this._volume.set({ volume: volume });
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            this.timePlanPlayer.setVolume(volume);
        }
    };
    CanvasInstance.prototype.setLimitToRange = function (limitToRange) {
        logger_1.Logger.log(this._data.constrainNavigationToRange);
        if (this.limitToRange !== limitToRange) {
            this.limitToRange = limitToRange;
            this._render();
        }
    };
    CanvasInstance.prototype.set = function (data) {
        var _this = this;
        // Simplification of setting state.
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            if (typeof data.range !== 'undefined')
                this.setCurrentRangeId(data.range.id, {
                    limitToRange: data.limitToRange,
                });
            if (typeof data.rangeId !== 'undefined')
                this.setCurrentRangeId(data.rangeId, {
                    limitToRange: data.limitToRange,
                });
            if (typeof data.volume !== 'undefined')
                this.setVolume(data.volume);
            if (typeof data.limitToRange !== 'undefined')
                this.setLimitToRange(data.limitToRange);
            if (typeof data.visible !== 'undefined')
                this.setVisibility(data.visible);
            return;
        }
        var oldData = Object.assign({}, this._data);
        this._data = Object.assign(this._data, data);
        var diff = diff_data_1.diffData(oldData, this._data);
        if (diff.includes('visible')) {
            if (this._data.canvas) {
                if (this._data.visible) {
                    this._rewind();
                    this.$playerElement.show();
                }
                else {
                    this.$playerElement.hide();
                    this.pause();
                }
                this.resize();
            }
        }
        if (diff.includes('volume')) {
            this._contentAnnotations.forEach(function ($mediaElement) {
                var volume = _this._data.volume !== undefined ? _this._data.volume : 1;
                $($mediaElement.element).prop('volume', volume);
                _this._volume.set({
                    volume: _this._data.volume,
                });
            });
        }
        else {
            if (this.isVisible()) {
                this._render();
            }
        }
        if (diff.includes('range')) {
            if (this._data.helper) {
                if (!this._data.range) {
                    this.fire(av_component_events_1.Events.RANGE_CHANGED, null);
                }
                else {
                    var duration = this._data.range.getDuration();
                    if (duration) {
                        if (typeof duration !== 'undefined') {
                            // Only change the current time if the current time is outside of the current time.
                            if (duration.start >= this._canvasClockTime || duration.end <= this._canvasClockTime) {
                                this._setCurrentTime(duration.start);
                            }
                            if (this._data.autoPlay) {
                                this.play();
                            }
                            this.fire(av_component_events_1.Events.RANGE_CHANGED, this._data.range.id, this._data.range);
                        }
                    }
                }
            }
            if (diff.includes('limitToRange')) {
                this._render();
            }
        }
    };
    CanvasInstance.prototype._hasRangeChanged = function () {
        if (this.isVirtual() && av_component_1.AVComponent.newRanges) {
            return;
        }
        var range = this._getRangeForCurrentTime();
        if (range &&
            !this._data.limitToRange &&
            (!this._data.range || (this._data.range && range.id !== this._data.range.id))) {
            this.set({
                range: jQuery.extend(true, { autoChanged: true }, range),
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
            var rangeBehavior = range.getBehavior();
            if (rangeBehavior && rangeBehavior !== 'no-nav') {
                continue;
            }
            // if the range spans the current time, and is navigable, return it.
            // otherwise, try to find a navigable child range.
            if (this._rangeSpansCurrentTime(range)) {
                if (this._rangeNavigable(range)) {
                    return range;
                }
                var childRanges = range.getRanges();
                // if a child range spans the current time, recurse into it
                for (var j = 0; j < childRanges.length; j++) {
                    var childRange = childRanges[j];
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
        if (behavior && behavior.toString() === 'no-nav') {
            return false;
        }
        return true;
    };
    CanvasInstance.prototype._render = function () {
        if (this.isVirtual() && av_component_1.AVComponent.newRanges && this.isVisible()) {
            logger_1.Logger.groupCollapsed('CanvasInstance._render()');
            logger_1.Logger.log({
                dataRange: this._data.rangeId,
                range: this.currentRange,
                newLimitToRange: this.limitToRange,
                constraintToRange: this._data.constrainNavigationToRange,
                autoSelectRange: this._data.autoSelectRange,
            });
            // 3 ways to render:
            // Limit to range + no id = show everything
            // Limit to range + id = show everything in context
            // No limit to range = show everything
            // No limit -> Limit (+ range) = show just range
            // - Range id + limitToRange
            // - Range id
            // - nothing
            if (this.limitToRange && this.currentRange) {
                logger_1.Logger.log('Selecting plan...', this.currentRange);
                this.timePlanPlayer.selectPlan({ rangeId: this.currentRange });
            }
            else {
                logger_1.Logger.log('Resetting...');
                this.timePlanPlayer.selectPlan({ reset: true });
            }
            var ratio = this._$canvasTimelineContainer.width() / this.timePlanPlayer.getDuration();
            this._$durationHighlight.show();
            var _a = this.timePlanPlayer.getCurrentRange(), start = _a.start, duration = _a.duration;
            this._$canvasTimelineContainer.slider({
                value: this._canvasClockTime - this.timePlanPlayer.plan.start,
                max: this.timePlanPlayer.getDuration(),
            });
            // set the start position and width
            this._$durationHighlight.css({
                left: start * ratio,
                width: duration * ratio,
            });
            logger_1.Logger.groupEnd();
            this._updateCurrentTimeDisplay();
            this._updateDurationDisplay();
            this._drawWaveform();
            return;
        }
        // Hide/show UI elements regardless of visibility.
        if (this._data.limitToRange && this._data.range) {
            this._$canvasTimelineContainer.hide();
            this._$rangeTimelineContainer.show();
        }
        else {
            this._$canvasTimelineContainer.show();
            this._$rangeTimelineContainer.hide();
        }
        if (!this._data.range) {
            this._$durationHighlight.hide();
        }
        // Return early if the current CanvasInstance isn't visible
        if (!this.isVisible()) {
            return;
        }
        if (!this.isOnlyCanvasInstance && !this.isVirtual()) {
            return;
        }
        // Render otherwise.
        if (this._data.range && !(this.isVirtual() && av_component_1.AVComponent.newRanges)) {
            var duration = this._data.range.getDuration();
            if (duration) {
                // get the total length in seconds.
                var totalDuration = this._getDuration();
                // get the length of the timeline container
                var timelineLength = this._$canvasTimelineContainer.width();
                // get the ratio of seconds to length
                var ratio = timelineLength / totalDuration;
                var totalLength = totalDuration * ratio;
                var start = duration.start * ratio;
                var end = duration.end * ratio;
                // if the end is on the next canvas
                if (end > totalLength || end < start) {
                    end = totalLength;
                }
                var width = end - start;
                if (this.isVirtual() || this.isOnlyCanvasInstance) {
                    this._$durationHighlight.show();
                    // set the start position and width
                    this._$durationHighlight.css({
                        left: start,
                        width: width,
                    });
                }
                else {
                    this._$durationHighlight.hide();
                }
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                var that_1 = this;
                // try to destroy existing rangeTimelineContainer
                if (this._$rangeTimelineContainer.data('ui-sortable')) {
                    this._$rangeTimelineContainer.slider('destroy');
                }
                this._$rangeTimelineContainer.slider({
                    value: duration.start,
                    step: 0.01,
                    orientation: 'horizontal',
                    range: 'min',
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
                    },
                });
            }
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
        var offset = $container.offset() || { left: 0 };
        var x = e.pageX - offset.left;
        var $hoverArrow = $container.find('.arrow');
        var $hoverHighlight = $container.find('.hover-highlight');
        var $hoverPreview = $container.find('.hover-preview');
        $hoverHighlight.width(x);
        var fullWidth = $container.width();
        var ratio = x / fullWidth;
        var seconds = Math.min(duration * ratio);
        $hoverPreview.find('.label').text(format_time_1.formatTime(seconds));
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
            arrowLeft = hoverPreviewWidth - (fullWidth - x) - 6;
        }
        $hoverPreview
            .css({
            left: left,
            top: hoverPreviewHeight * -1 + 'px',
        })
            .show();
        $hoverArrow.css({
            left: arrowLeft,
        });
    };
    CanvasInstance.prototype._previous = function (isDouble) {
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            logger_1.Logger.group('prev');
            var newTime = this.timePlanPlayer.previous();
            this._setCurrentTime(newTime);
            logger_1.Logger.log('CanvasInstance.previous()', newTime);
            logger_1.Logger.groupEnd();
            return;
        }
        if (this._data.limitToRange) {
            // if only showing the range, single click rewinds, double click goes to previous range unless navigation is contrained to range
            if (isDouble) {
                if (this._isNavigationConstrainedToRange()) {
                    this._rewind();
                }
                else {
                    this.fire(canvas_instance_events_1.CanvasInstanceEvents.PREVIOUS_RANGE);
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
                        range: undefined,
                    });
                    this._rewind();
                }
                else {
                    this.fire(canvas_instance_events_1.CanvasInstanceEvents.PREVIOUS_RANGE);
                }
            }
            else {
                this._rewind();
            }
        }
    };
    CanvasInstance.prototype._next = function () {
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            logger_1.Logger.groupCollapsed('next');
            var newTime = this.timePlanPlayer.next();
            logger_1.Logger.log('CanvasInstance.previous()', newTime);
            this._setCurrentTime(newTime, false);
            logger_1.Logger.groupEnd();
            return;
        }
        if (this._data.limitToRange) {
            if (this._isNavigationConstrainedToRange()) {
                this._fastforward();
            }
            else {
                this.fire(canvas_instance_events_1.CanvasInstanceEvents.NEXT_RANGE);
            }
        }
        else {
            this.fire(canvas_instance_events_1.CanvasInstanceEvents.NEXT_RANGE);
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
            case 'video':
                $mediaElement = $('<video crossorigin="anonymous" class="anno" />');
                break;
            case 'sound':
            case 'audio':
                $mediaElement = $('<audio crossorigin="anonymous" class="anno" />');
                break;
            // case 'textualbody':
            //     $mediaElement = $('<div class="anno">' + data.source + '</div>');
            //     break;
            // case 'image':
            //     $mediaElement = $('<img class="anno" src="' + data.source + '" />');
            //     break;
            default:
                return;
        }
        var media = $mediaElement[0];
        //
        // var audioCtx = new AudioContext();
        // var source = audioCtx.createMediaElementSource(media);
        // var panNode = audioCtx.createStereoPanner();
        // var val = -1;
        // setInterval(() => {
        //     val = val === -1 ? 1 : -1;
        //     panNode.pan.setValueAtTime(val, audioCtx.currentTime);
        //     if (val === 1) {
        //         media.playbackRate = 2;
        //     } else {
        //         // media.playbackRate = 1;
        //     }
        // }, 1000);
        // source.connect(panNode);
        // panNode.connect(audioCtx.destination);
        if (data.format && data.format.toString() === 'application/dash+xml') {
            // dash
            $mediaElement.attr('data-dashjs-player', '');
            var player = dashjs.MediaPlayer().create();
            player.getDebug().setLogToBrowserConsole(false);
            // player.getDebug().setLogToBrowserConsole(true);
            // player.getDebug().setLogLevel(4);
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
                        },
                    });
                }
                else {
                    hls = new Hls();
                }
                if (this._data.adaptiveAuthEnabled) {
                    // no-op.
                }
                hls.loadSource(data.source);
                hls.attachMedia(media);
                //hls.on(Hls.Events.MANIFEST_PARSED, function () {
                //media.play();
                //});
            }
            else if (media.canPlayType('application/vnd.apple.mpegurl')) {
                // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
                // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
                // This is using the built-in support of the plain video element, without using hls.js.
                media.src = data.source;
                //media.addEventListener('canplay', function () {
                //media.play();
                //});
            }
        }
        else {
            $mediaElement.attr('src', data.source);
        }
        $mediaElement
            .css({
            top: data.top + '%',
            left: data.left + '%',
            width: data.width + '%',
            height: data.height + '%',
        })
            .hide();
        data.element = $mediaElement;
        data.timeout = null;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var that = this;
        data.checkForStall = function () {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var self = this;
            if (this.active) {
                that._checkMediaSynchronization();
                if (this.element.get(0).readyState > 0 && !this.outOfSync) {
                    that._playbackStalled(false, self);
                }
                else {
                    that._playbackStalled(true, self);
                    if (this.timeout) {
                        window.clearTimeout(this.timeout);
                    }
                    this.timeout = window.setTimeout(function () {
                        self.checkForStall();
                    }, 1000);
                }
            }
            else {
                that._playbackStalled(false, self);
            }
        };
        this._contentAnnotations.push(data);
        if (this.$playerElement) {
            this._$canvasContainer.append($mediaElement);
        }
        $mediaElement.on('loadedmetadata', function () {
            _this._readyMediaCount++;
            if (_this._readyMediaCount === _this._contentAnnotations.length) {
                if (_this._data.autoPlay) {
                    _this.play();
                }
                else {
                    _this.pause();
                }
                _this._updateDurationDisplay();
                _this.fire(av_component_events_1.Events.MEDIA_READY);
            }
        });
        $mediaElement.attr('preload', 'metadata');
        // @todo why?
        $mediaElement.get(0).load();
        this._renderSyncIndicator(data);
    };
    CanvasInstance.prototype._getWaveformData = function (url) {
        // must use this for IE11
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'binary',
                responseType: 'arraybuffer',
                processData: false,
            })
                .done(function (data) {
                resolve(WaveformData.create(data));
            })
                .fail(function () {
                reject(new Error('Network Error'));
            });
        });
    };
    CanvasInstance.prototype._renderWaveform = function (forceRender) {
        var _this = this;
        if (forceRender === void 0) { forceRender = false; }
        if (this.waveFormInit && !forceRender) {
            return;
        }
        this.waveFormInit = true;
        if (!this.waveforms.length)
            return;
        var promises = this.waveforms.map(function (url) {
            return _this._getWaveformData(url);
        });
        Promise.all(promises)
            .then(function (waveforms) {
            _this._waveformCanvas = document.createElement('canvas');
            _this._waveformCanvas.classList.add('waveform');
            _this._$canvasContainer.append(_this._waveformCanvas);
            _this.waveformPageX = _this._waveformCanvas.getBoundingClientRect().left;
            var raf = _this._drawWaveform.bind(_this);
            // Mouse in and out we reset the delta
            _this._waveformCanvas.addEventListener('mousein', function () {
                _this.waveformDeltaX = 0;
            });
            _this._$canvasTimelineContainer.on('mouseout', function () {
                _this.waveformDeltaX = 0;
                requestAnimationFrame(raf);
            });
            _this._waveformCanvas.addEventListener('mouseout', function () {
                _this.waveformDeltaX = 0;
                requestAnimationFrame(raf);
            });
            // When mouse moves over waveform, we render
            _this._waveformCanvas.addEventListener('mousemove', function (e) {
                _this.waveformDeltaX = e.clientX - _this.waveformPageX;
                requestAnimationFrame(raf);
            });
            _this._$canvasTimelineContainer.on('mousemove', function (e) {
                _this.waveformDeltaX = e.clientX - _this.waveformPageX;
                requestAnimationFrame(raf);
            });
            // When we click the waveform, it should navigate
            _this._waveformCanvas.addEventListener('click', function () {
                var width = _this._waveformCanvas.getBoundingClientRect().width || 0;
                if (width) {
                    var _a = _this.getRangeTiming(), start = _a.start, duration = _a.duration;
                    _this._setCurrentTime(
                    // Multiply
                    relative_time_1.multiplyTime(
                    // Add start and duration
                    relative_time_1.addTime(start, duration), 
                    // Multiply by percent through
                    _this.waveformDeltaX / width));
                }
            });
            _this._waveformCtx = _this._waveformCanvas.getContext('2d');
            if (_this._waveformCtx) {
                _this._waveformCtx.fillStyle = _this._data.waveformColor || '#fff';
                _this._compositeWaveform = new composite_waveform_1.CompositeWaveform(waveforms);
                _this.fire(av_component_events_1.Events.WAVEFORM_READY);
            }
        })
            .catch(function () {
            logger_1.Logger.warn('Could not load wave forms.');
        });
    };
    CanvasInstance.prototype.getRangeTiming = function () {
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            return {
                start: this.timePlanPlayer.plan.start,
                end: this.timePlanPlayer.plan.end,
                duration: this.timePlanPlayer.plan.duration,
                percent: Math.min((this.timePlanPlayer.getTime() - this.timePlanPlayer.plan.start) / this.timePlanPlayer.plan.duration, 1),
            };
        }
        var durationObj;
        var start = 0;
        var end = relative_time_1.timelineTime(this._compositeWaveform ? this._compositeWaveform.duration : -1);
        var duration = end;
        // This is very similar to
        if (this._data.range) {
            durationObj = this._data.range.getDuration();
        }
        if (!this.isVirtual()) {
            end = this._getDuration();
        }
        if (this._data.limitToRange && durationObj) {
            start = durationObj.start;
            end = durationObj.end;
            duration = relative_time_1.minusTime(end, start);
        }
        if (end === -1 && durationObj) {
            start = durationObj.start;
            end = durationObj.end;
            duration = relative_time_1.minusTime(end, start);
        }
        if (end === -1) {
            logger_1.Logger.warn('Duration not found...', { start: start, end: end, duration: duration, durationObj: durationObj });
        }
        return {
            start: start,
            end: end,
            duration: relative_time_1.minusTime(end, start),
            percent: Math.min((this.getClockTime() - start) / duration, 1),
        };
    };
    CanvasInstance.prototype._drawWaveform = function () {
        this._renderWaveform();
        //if (!this._waveformCtx || !this._waveformNeedsRedraw) return;
        if (!this._waveformCtx || !this.isVisible())
            return;
        var _a = this.getRangeTiming(), start = _a.start, end = _a.end, percent = _a.percent;
        var startpx = start * this._compositeWaveform.pixelsPerSecond;
        var endpx = end * this._compositeWaveform.pixelsPerSecond;
        var canvasWidth = this._waveformCtx.canvas.width;
        var canvasHeight = this._waveformCtx.canvas.height;
        var barSpacing = this._data.waveformBarSpacing;
        var barWidth = this._data.waveformBarWidth;
        var increment = Math.floor(((endpx - startpx) / canvasWidth) * barSpacing);
        var sampleSpacing = canvasWidth / barSpacing;
        this._waveformCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        this._waveformCtx.fillStyle = this._data.waveformColor || '#fff';
        var inc = canvasWidth / (end - start);
        var listOfBuffers = [];
        if (this._contentAnnotations) {
            for (var i = 0; i < this._contentAnnotations.length; i++) {
                var contentAnnotation = this._contentAnnotations[i];
                if (contentAnnotation && contentAnnotation.element) {
                    var element = contentAnnotation.element[0];
                    var annoStart = contentAnnotation.startOffest || 0;
                    var active = contentAnnotation.active;
                    if (active) {
                        for (var j = 0; j < element.buffered.length; j++) {
                            var reverse = element.buffered.length - j - 1;
                            var startX = element.buffered.start(reverse);
                            var endX = element.buffered.end(reverse);
                            listOfBuffers.push([(annoStart + startX - start) * inc, (annoStart + endX - start) * inc]);
                        }
                    }
                }
            }
        }
        var newList = [];
        if (this.isVirtual() && av_component_1.AVComponent.newRanges) {
            var plan = this.timePlanPlayer.plan;
            var compositeCanvas = this._data.canvas;
            for (var _i = 0, _b = plan.stops; _i < _b.length; _i++) {
                var stop_1 = _b[_i];
                var map = compositeCanvas.durationMap[plan.canvases[stop_1.canvasIndex]];
                var canvasEndTime = map.runningDuration;
                var canvasStartTime = canvasEndTime - map.duration;
                // Start percentage.
                // End percentage.
                newList.push({
                    start: (stop_1.start - plan.start) / plan.duration,
                    end: (stop_1.end - plan.start) / plan.duration,
                    duration: stop_1.duration,
                    startTime: canvasStartTime + stop_1.canvasTime.start,
                    endTime: canvasStartTime + stop_1.canvasTime.start + stop_1.canvasTime.end,
                });
            }
        }
        else {
            newList.push({
                start: 0,
                duration: end - start,
                end: end,
                startTime: start,
            });
        }
        var current = 0;
        for (var x = startpx; x < endpx; x += increment) {
            var rangePercentage = normalise_number_1.normalise(x, startpx, endpx);
            var xpos = rangePercentage * canvasWidth;
            if (newList[current].end < rangePercentage) {
                current++;
            }
            var section = newList[current];
            // range percent 0..1
            // section.start = 1.73
            // section.duration = 1806
            // section.startTime = 1382
            // section.endTime = 5003
            //
            // What I need
            // - time in seconds for the current increment
            // startTime + (0) - the first will always be the start time.
            // startTime + ( rangePercentage *  )
            var partPercent = rangePercentage - section.start;
            var toSample = Math.floor((section.startTime + partPercent * section.duration) * this._compositeWaveform.pixelsPerSecond);
            var maxMin = this._getWaveformMaxAndMin(this._compositeWaveform, toSample, sampleSpacing);
            var height = this._scaleY(maxMin.max - maxMin.min, canvasHeight);
            var pastCurrentTime = xpos / canvasWidth < percent;
            var hoverWidth = this.waveformDeltaX / canvasWidth;
            var colour = this._data.waveformColor || '#fff';
            var ypos = (canvasHeight - height) / 2;
            if (pastCurrentTime) {
                if (this.waveformDeltaX === 0) {
                    // ======o_____
                    //   ^ this colour, no hover
                    colour = '#14A4C3';
                }
                else if (xpos / canvasWidth < hoverWidth) {
                    // ======T---o_____
                    //    ^ this colour
                    colour = '#11758e'; // dark
                }
                else {
                    // ======T---o_____
                    //         ^ this colour
                    colour = '#14A4C3'; // normal
                }
            }
            else if (xpos / canvasWidth < hoverWidth) {
                // ======o-------T_____
                //           ^ this colour
                colour = '#86b3c3'; // lighter
            }
            else {
                colour = '#8a9aa1';
                for (var _c = 0, listOfBuffers_1 = listOfBuffers; _c < listOfBuffers_1.length; _c++) {
                    var _d = listOfBuffers_1[_c], a = _d[0], b = _d[1];
                    if (xpos > a && xpos < b) {
                        colour = '#fff';
                        break;
                    }
                }
            }
            this._waveformCtx.fillStyle = colour;
            this._waveformCtx.fillRect(xpos, ypos, barWidth, height | 0);
        }
        return;
    };
    CanvasInstance.prototype._getWaveformMaxAndMin = function (waveform, index, sampleSpacing) {
        var max = -127;
        var min = 128;
        for (var x = index; x < index + sampleSpacing; x++) {
            var wMax = waveform.max(x);
            var wMin = waveform.min(x);
            if (wMax > max) {
                max = wMax;
            }
            if (wMin < min) {
                min = wMin;
            }
        }
        return { max: max, min: min };
    };
    CanvasInstance.prototype.isLimitedToRange = function () {
        return this._data.limitToRange;
    };
    CanvasInstance.prototype.hasCurrentRange = function () {
        return !!this._data.range;
    };
    CanvasInstance.prototype._updateCurrentTimeDisplay = function () {
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            this._$canvasTime.text(format_time_1.formatTime(this._canvasClockTime - this.timePlanPlayer.getStartTime()));
            return;
        }
        var duration;
        if (this._data.range) {
            duration = this._data.range.getDuration();
        }
        if (this._data.limitToRange && duration) {
            var rangeClockTime = this._canvasClockTime - duration.start;
            this._$canvasTime.text(format_time_1.formatTime(rangeClockTime));
        }
        else {
            this._$canvasTime.text(format_time_1.formatTime(this._canvasClockTime));
        }
    };
    CanvasInstance.prototype._updateDurationDisplay = function () {
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            this._$canvasDuration.text(format_time_1.formatTime(this.timePlanPlayer.getDuration()));
            return;
        }
        var duration;
        if (this._data.range) {
            duration = this._data.range.getDuration();
        }
        if (this._data.limitToRange && duration) {
            this._$canvasDuration.text(format_time_1.formatTime(duration.getLength()));
        }
        else {
            this._$canvasDuration.text(format_time_1.formatTime(this._getDuration()));
        }
    };
    CanvasInstance.prototype._renderSyncIndicator = function (mediaElementData) {
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            logger_1.Logger.log('_renderSyncIndicator');
            return;
        }
        var leftPercent = this._convertToPercentage(mediaElementData.start, this._getDuration());
        var widthPercent = this._convertToPercentage(mediaElementData.end - mediaElementData.start, this._getDuration());
        var $timelineItem = $('<div class="timeline-item"></div>');
        $timelineItem.css({
            left: leftPercent + '%',
            width: widthPercent + '%',
        });
        var $lineWrapper = $('<div class="line-wrapper"></div>');
        $timelineItem.appendTo($lineWrapper);
        mediaElementData.timelineElement = $timelineItem;
        if (this.$playerElement) {
            this._$timelineItemContainer.append($lineWrapper);
        }
    };
    CanvasInstance.prototype.setCurrentTime = function (seconds) {
        logger_1.Logger.log('External set current time?');
        return this._setCurrentTime(seconds, false);
    };
    CanvasInstance.prototype.now = function () {
        return relative_time_1.fromMs(Date.now());
    };
    CanvasInstance.prototype.nowMs = function () {
        return Date.now();
    };
    CanvasInstance.prototype._setCurrentTime = function (seconds, setRange) {
        if (setRange === void 0) { setRange = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, start, end;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('setCurrentTime');
                        if (!(av_component_1.AVComponent.newRanges && this.isVirtual())) return [3 /*break*/, 2];
                        this._buffering = true;
                        return [4 /*yield*/, this.timePlanPlayer.setTime(seconds, setRange)];
                    case 1:
                        _b.sent();
                        this._buffering = false;
                        this._canvasClockStartDate = relative_time_1.toMs(relative_time_1.minusTime(this.now(), this._canvasClockTime));
                        this._canvasClockUpdater();
                        this._highPriorityUpdater();
                        this._lowPriorityUpdater();
                        this._synchronizeMedia();
                        return [2 /*return*/];
                    case 2:
                        _a = this.getRangeTiming(), start = _a.start, end = _a.end;
                        if (seconds < start || start > end) {
                            return [2 /*return*/];
                        }
                        this._canvasClockTime = seconds; //secondsAsFloat;
                        this._canvasClockStartDate = relative_time_1.toMs(relative_time_1.minusTime(this.now(), this._canvasClockTime));
                        this.logMessage('SET CURRENT TIME to: ' + this._canvasClockTime + ' seconds.');
                        this._canvasClockUpdater();
                        this._highPriorityUpdater();
                        this._lowPriorityUpdater();
                        this._synchronizeMedia();
                        return [2 /*return*/];
                }
            });
        });
    };
    CanvasInstance.prototype._rewind = function (withoutUpdate) {
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            logger_1.Logger.log('Rewind');
            return;
        }
        this.pause();
        var duration;
        if (this._data.range) {
            duration = this._data.range.getDuration();
        }
        if (this._data.limitToRange && duration) {
            this._setCurrentTime(duration.start);
        }
        else {
            this._setCurrentTime(0);
        }
        if (!this._data.limitToRange) {
            if (this._data && this._data.helper) {
                this.set({
                    range: undefined,
                });
            }
        }
    };
    CanvasInstance.prototype._fastforward = function () {
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            logger_1.Logger.log('Fast forward');
            return;
        }
        var duration;
        if (this._data.range) {
            duration = this._data.range.getDuration();
        }
        if (this._data.limitToRange && duration) {
            this._canvasClockTime = relative_time_1.timelineTime(duration.end);
        }
        else {
            this._canvasClockTime = this._getDuration();
        }
        this.pause();
    };
    // todo: can this be part of the _data state?
    // this._data.play = true?
    CanvasInstance.prototype.play = function (withoutUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var duration, label;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._isPlaying)
                            return [2 /*return*/];
                        if (!(av_component_1.AVComponent.newRanges && this.isVirtual())) return [3 /*break*/, 3];
                        if (!this.timePlanPlayer.hasEnded()) return [3 /*break*/, 2];
                        this._buffering = true;
                        return [4 /*yield*/, this.timePlanPlayer.setTime(this.timePlanPlayer.currentStop.start)];
                    case 1:
                        _a.sent();
                        this._buffering = false;
                        _a.label = 2;
                    case 2:
                        this.timePlanPlayer.play();
                        return [3 /*break*/, 4];
                    case 3:
                        duration = void 0;
                        if (this._data.range) {
                            duration = this._data.range.getDuration();
                        }
                        if (this._data.limitToRange && duration && this._canvasClockTime >= duration.end) {
                            this._canvasClockTime = duration.start;
                        }
                        if (this._canvasClockTime === this._getDuration()) {
                            this._canvasClockTime = 0;
                        }
                        _a.label = 4;
                    case 4:
                        this._canvasClockStartDate = relative_time_1.toMs(relative_time_1.minusTime(this.now(), this._canvasClockTime));
                        if (this._highPriorityInterval) {
                            clearInterval(this._highPriorityInterval);
                        }
                        this._highPriorityInterval = window.setInterval(function () {
                            _this._highPriorityUpdater();
                        }, this._highPriorityFrequency);
                        if (this._lowPriorityInterval) {
                            clearInterval(this._lowPriorityInterval);
                        }
                        this._lowPriorityInterval = window.setInterval(function () {
                            _this._lowPriorityUpdater();
                        }, this._lowPriorityFrequency);
                        if (this._canvasClockInterval) {
                            clearInterval(this._canvasClockInterval);
                        }
                        this._canvasClockInterval = window.setInterval(function () {
                            _this._canvasClockUpdater();
                        }, this._canvasClockFrequency);
                        this._isPlaying = true;
                        if (!withoutUpdate) {
                            this._synchronizeMedia();
                        }
                        label = this._data && this._data.content ? this._data.content.pause : '';
                        this._$playButton.prop('title', label);
                        this._$playButton.find('i').switchClass('play', 'pause');
                        this.fire(canvas_instance_events_1.CanvasInstanceEvents.PLAYCANVAS);
                        this.logMessage('PLAY canvas');
                        return [2 /*return*/];
                }
            });
        });
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
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            this.timePlanPlayer.pause();
        }
        var label = this._data && this._data.content ? this._data.content.play : '';
        this._$playButton.prop('title', label);
        this._$playButton.find('i').switchClass('pause', 'play');
        this.fire(canvas_instance_events_1.CanvasInstanceEvents.PAUSECANVAS);
        this.logMessage('PAUSE canvas');
    };
    CanvasInstance.prototype._isNavigationConstrainedToRange = function () {
        return this._data.constrainNavigationToRange || false;
    };
    CanvasInstance.prototype._canvasClockUpdater = function () {
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            if (this._buffering) {
                return;
            }
            var startDate_1 = relative_time_1.fromMs(this._canvasClockStartDate);
            logger_1.Logger.log('CanvasInstance._canvasClockUpdater()', {
                startDate: startDate_1,
                advanceToTime: relative_time_1.minusTime(this.now(), startDate_1),
            });
            var paused = this.timePlanPlayer.advanceToTime(relative_time_1.minusTime(this.now(), startDate_1)).paused;
            if (paused) {
                this.pause();
            }
            return;
        }
        if (this._buffering) {
            return;
        }
        var startDate = relative_time_1.fromMs(this._canvasClockStartDate);
        this._canvasClockTime = relative_time_1.minusTime(this.now(), startDate);
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
        if (this._bufferShown && !this._buffering) {
            this.$playerElement.removeClass('player--loading');
            this._bufferShown = false;
        }
        if (this._buffering && !this._bufferShown) {
            this.$playerElement.addClass('player--loading');
            this._bufferShown = true;
        }
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            this._$rangeTimelineContainer.slider({
                value: this._canvasClockTime - this.timePlanPlayer.plan.start,
            });
            this._$canvasTimelineContainer.slider({
                value: this._canvasClockTime - this.timePlanPlayer.plan.start,
            });
        }
        else {
            this._$rangeTimelineContainer.slider({
                value: this._canvasClockTime,
            });
            this._$canvasTimelineContainer.slider({
                value: this._canvasClockTime,
            });
        }
        this._updateCurrentTimeDisplay();
        this._updateDurationDisplay();
        this._drawWaveform();
    };
    CanvasInstance.prototype._lowPriorityUpdater = function () {
        this._updateMediaActiveStates();
        if ( /*this._isPlaying && */this._data.autoSelectRange && (this.isVirtual() || this.isOnlyCanvasInstance)) {
            this._hasRangeChanged();
        }
    };
    CanvasInstance.prototype._updateMediaActiveStates = function () {
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            if (this._isPlaying) {
                if (this.timePlanPlayer.isBuffering()) {
                    this._buffering = true;
                    return;
                }
                else if (this._buffering) {
                    this._buffering = false;
                }
                this.timePlanPlayer.advanceToTime(this._canvasClockTime);
            }
            return;
        }
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
                if (contentAnnotation.element[0].currentTime >
                    contentAnnotation.element[0].duration - contentAnnotation.endOffset) {
                    this._pauseMedia(contentAnnotation.element[0]);
                }
            }
            else {
                if (contentAnnotation.active) {
                    contentAnnotation.active = false;
                    contentAnnotation.element.hide();
                    contentAnnotation.timelineElement.removeClass('active');
                    this._pauseMedia(contentAnnotation.element[0]);
                }
            }
        }
    };
    CanvasInstance.prototype._pauseMedia = function (media) {
        media.pause();
    };
    CanvasInstance.prototype._setMediaCurrentTime = function (media, time) {
        if (!isNaN(media.duration)) {
            media.currentTime = time;
        }
    };
    CanvasInstance.prototype._synchronizeMedia = function () {
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            return;
        }
        var contentAnnotation;
        for (var i = 0; i < this._contentAnnotations.length; i++) {
            contentAnnotation = this._contentAnnotations[i];
            this._setMediaCurrentTime(contentAnnotation.element[0], this._canvasClockTime - contentAnnotation.start + contentAnnotation.startOffset);
            if (contentAnnotation.start <= this._canvasClockTime && contentAnnotation.end >= this._canvasClockTime) {
                if (this._isPlaying) {
                    if (contentAnnotation.element[0].paused) {
                        var promise = contentAnnotation.element[0].play();
                        if (promise) {
                            promise.catch(function () {
                                // no-op
                            });
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
            if (contentAnnotation.element[0].currentTime >
                contentAnnotation.element[0].duration - contentAnnotation.endOffset) {
                this._pauseMedia(contentAnnotation.element[0]);
            }
        }
        this.logMessage('SYNC MEDIA at: ' + this._canvasClockTime + ' seconds.');
    };
    CanvasInstance.prototype._checkMediaSynchronization = function () {
        if (av_component_1.AVComponent.newRanges && this.isVirtual()) {
            if (this._isPlaying) {
                if (this.timePlanPlayer.isBuffering()) {
                    this._buffering = true;
                }
                else if (this._buffering) {
                    this._buffering = false;
                }
            }
            return;
        }
        var contentAnnotation;
        for (var i = 0, l = this._contentAnnotations.length; i < l; i++) {
            contentAnnotation = this._contentAnnotations[i];
            if (contentAnnotation.start <= this._canvasClockTime && contentAnnotation.end >= this._canvasClockTime) {
                if (this._isPlaying) {
                    if (contentAnnotation.element[0].readyState < 3) {
                        this._buffering = true;
                    }
                    else if (this._buffering) {
                        this._buffering = false;
                    }
                }
                var correctTime = this._canvasClockTime - contentAnnotation.start + contentAnnotation.startOffset;
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
                this._waveformCanvas.width = canvasWidth;
                this._waveformCanvas.height = canvasHeight;
                this.waveformPageX = this._waveformCanvas.getBoundingClientRect().left;
            }
            this._render();
            this._drawWaveform();
        }
    };
    return CanvasInstance;
}(base_component_1.BaseComponent));
exports.CanvasInstance = CanvasInstance;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var is_hls_format_1 = __webpack_require__(13);
var is_mpeg_dash_format_1 = __webpack_require__(15);
var can_play_hls_1 = __webpack_require__(16);
var is_safari_1 = __webpack_require__(17);
function extractMediaFromAnnotationBodies(annotation) {
    var bodies = annotation.getBody();
    if (!bodies.length) {
        return null;
    }
    // if there's an HLS format and HLS is supported in this browser
    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        var format = body.getFormat();
        if (format) {
            if (is_hls_format_1.isHLSFormat(format) && can_play_hls_1.canPlayHls()) {
                return body;
            }
        }
    }
    // if there's a Dash format and the browser isn't Safari
    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        var format = body.getFormat();
        if (format) {
            if (is_mpeg_dash_format_1.isMpegDashFormat(format) && !is_safari_1.isSafari()) {
                return body;
            }
        }
    }
    // otherwise, return the first format that isn't HLS or Dash
    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        var format = body.getFormat();
        if (format) {
            if (!is_hls_format_1.isHLSFormat(format) && !is_mpeg_dash_format_1.isMpegDashFormat(format)) {
                return body;
            }
        }
    }
    // couldn't find a suitable format
    return null;
}
exports.extractMediaFromAnnotationBodies = extractMediaFromAnnotationBodies;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_component_1 = __webpack_require__(10);
var volume_events_1 = __webpack_require__(4);
var logger_1 = __webpack_require__(2);
var AVVolumeControl = /** @class */ (function (_super) {
    __extends(AVVolumeControl, _super);
    function AVVolumeControl(options) {
        var _this = _super.call(this, options) || this;
        _this._lastVolume = 1;
        _this._data = {
            volume: 1,
        };
        _this._init();
        _this._resize();
        return _this;
    }
    AVVolumeControl.prototype._init = function () {
        var _this = this;
        var success = _super.prototype._init.call(this);
        this._$element = $(this.el);
        if (!success) {
            logger_1.Logger.error('Component failed to initialise');
        }
        this._$volumeMute = $("\n      <button class=\"btn volume-mute\" title=\"" + this.options.data.content.mute + "\">\n          <i class=\"av-icon av-icon-mute on\" aria-hidden=\"true\"></i>" + this.options.data.content.mute + "\n      </button>\n    ");
        this._$volumeSlider = $('<div class="volume-slider"></div>');
        this._$element.append(this._$volumeMute, this._$volumeSlider);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
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
            _this.fire(volume_events_1.VolumeEvents.VOLUME_CHANGED, _this._data.volume);
        });
        this._$volumeSlider.slider({
            value: that._data.volume,
            step: 0.1,
            orientation: 'horizontal',
            range: 'min',
            min: 0,
            max: 1,
            animate: false,
            create: function () {
                // no-op
            },
            slide: function (evt, ui) {
                // start reducer
                that._data.volume = ui.value;
                if (that._data.volume === 0) {
                    that._lastVolume = 0;
                }
                // end reducer
                that.fire(volume_events_1.VolumeEvents.VOLUME_CHANGED, that._data.volume);
            },
            stop: function (evt, ui) {
                // No-op
            },
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
                value: this._data.volume,
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
        // no-op
    };
    return AVVolumeControl;
}(base_component_1.BaseComponent));
exports.AVVolumeControl = AVVolumeControl;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var relative_time_1 = __webpack_require__(6);
function createTimePlansFromManifest(manifest) {
    var parseRange = function (range, rangeStack, startDuration) {
        var _a, _b, _c;
        if (rangeStack === void 0) { rangeStack = []; }
        if (startDuration === void 0) { startDuration = relative_time_1.timelineTime(0); }
        var timePlan = {
            type: 'time-plan',
            canvases: [],
            duration: relative_time_1.timelineTime(0),
            items: [],
            stops: [],
            rangeOrder: [range.id],
            end: relative_time_1.timelineTime(0),
            start: startDuration,
            rangeId: range.id,
            rangeStack: rangeStack,
        };
        var runningDuration = startDuration;
        var rangeRanges = __spreadArrays(range.items, range.getCanvasIds());
        for (var canvasIndex = 0; canvasIndex < rangeRanges.length; canvasIndex++) {
            var ro = rangeRanges[canvasIndex];
            if (typeof ro === 'string') {
                var _d = ro.match(/(.*)#t=([0-9.]+),?([0-9.]+)?/) || [undefined, ro, '0', '0'], canvasId = _d[1], start = _d[2], end = _d[3];
                // Skip invalid ranges.
                if (!canvasId || typeof start === 'undefined' || typeof end === 'undefined')
                    continue;
                var canvas = manifest.getSequenceByIndex(0).getCanvasById(canvasId);
                if (canvas === null) {
                    throw new Error('Canvas not found..');
                }
                timePlan.canvases.push(canvas.id);
                var rStart = relative_time_1.canvasTime(parseFloat(start || '0'));
                var rEnd = relative_time_1.canvasTime(parseFloat(end || '0'));
                var rDuration = relative_time_1.timelineTime(rEnd - rStart);
                runningDuration = relative_time_1.addTime(rDuration, runningDuration);
                var timeStop = {
                    type: 'time-stop',
                    canvasIndex: canvasIndex,
                    start: relative_time_1.minusTime(runningDuration, rDuration),
                    end: runningDuration,
                    duration: rDuration,
                    rangeId: range.id,
                    rawCanvasSelector: ro,
                    canvasTime: {
                        start: rStart,
                        end: rEnd,
                    },
                    rangeStack: rangeStack,
                };
                timePlan.stops.push(timeStop);
                timePlan.items.push(timeStop);
            }
            else {
                var behavior = ro.getBehavior();
                if (!behavior || behavior !== 'no-nav') {
                    var rangeTimePlan = parseRange(ro, __spreadArrays(rangeStack, [ro.id]), runningDuration);
                    runningDuration = relative_time_1.addTime(runningDuration, rangeTimePlan.duration);
                    (_a = timePlan.stops).push.apply(_a, rangeTimePlan.stops.map(function (stop) { return (__assign(__assign({}, stop), { canvasIndex: stop.canvasIndex + timePlan.canvases.length })); }));
                    (_b = timePlan.canvases).push.apply(_b, rangeTimePlan.canvases);
                    timePlan.items.push(rangeTimePlan);
                    (_c = timePlan.rangeOrder).push.apply(_c, rangeTimePlan.rangeOrder);
                }
            }
        }
        timePlan.end = runningDuration;
        timePlan.duration = relative_time_1.timelineTime(timePlan.end - timePlan.start);
        return timePlan;
    };
    var topLevels = manifest.getTopRanges();
    var plans = [];
    if (!topLevels) {
        topLevels = manifest.getAllRanges();
    }
    if (topLevels.length === 1 && !topLevels[0].id) {
        topLevels = topLevels[0].getRanges();
    }
    for (var _i = 0, topLevels_1 = topLevels; _i < topLevels_1.length; _i++) {
        var range = topLevels_1[_i];
        var subRanges = range.getRanges();
        if (subRanges[0] && range.id === range.getRanges()[0].id) {
            range = range.getRanges()[0];
        }
        var rangeTimePlan = parseRange(range, [range.id]);
        plans.push(rangeTimePlan);
    }
    return plans[0]; // @todo only one top level range.
}
exports.createTimePlansFromManifest = createTimePlansFromManifest;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var manifesto_js_1 = __webpack_require__(3);
var get_spatial_component_1 = __webpack_require__(18);
var relative_time_1 = __webpack_require__(6);
function getMediaSourceFromAnnotationBody(annotation, body, canvasDimensions) {
    var type = body.getType();
    var format = body.getFormat() || undefined;
    var mediaSource = body.id.split('#')[0];
    var target = annotation.getTarget();
    if (!target) {
        throw new Error('No target');
    }
    if (!type) {
        throw new Error('Unknown media type');
    }
    var _a = get_spatial_component_1.getSpatialComponent(target) || [
        0,
        0,
        canvasDimensions.width || 0,
        canvasDimensions.height || 0,
    ], x = _a[0], y = _a[1], width = _a[2], height = _a[3];
    var _b = manifesto_js_1.Utils.getTemporalComponent(target) || [0, canvasDimensions.duration], start = _b[0], end = _b[1];
    var _c = body.id.match(/(.*)#t=([0-9.]+),?([0-9.]+)?/) || [
        undefined,
        body.id,
        undefined,
        undefined,
    ], bodyId = _c[1], offsetStart = _c[2], offsetEnd = _c[3];
    return {
        type: type,
        format: format,
        mediaSource: mediaSource,
        canvasId: canvasDimensions.id,
        x: x,
        y: y,
        width: typeof width === 'undefined' ? undefined : parseInt(String(width), 10),
        height: typeof height === 'undefined' ? undefined : parseInt(String(height), 10),
        start: relative_time_1.annotationTime(Number(Number(start).toFixed(2))),
        end: relative_time_1.annotationTime(Number(Number(end).toFixed(2))),
        bodyId: bodyId,
        offsetStart: typeof offsetStart === 'undefined' ? undefined : relative_time_1.canvasTime(parseFloat(offsetStart)),
        offsetEnd: typeof offsetEnd === 'undefined' ? undefined : relative_time_1.canvasTime(parseFloat(offsetEnd)),
    };
}
exports.getMediaSourceFromAnnotationBody = getMediaSourceFromAnnotationBody;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function formatTime(aNumber) {
    var hours, minutes, seconds, hourValue;
    seconds = Math.ceil(aNumber);
    hours = Math.floor(seconds / (60 * 60));
    hours = hours >= 10 ? hours : '0' + hours;
    minutes = Math.floor((seconds % (60 * 60)) / 60);
    minutes = minutes >= 10 ? minutes : '0' + minutes;
    seconds = Math.floor((seconds % (60 * 60)) % 60);
    seconds = seconds >= 10 ? seconds : '0' + seconds;
    if (hours >= 1) {
        hourValue = hours + ':';
    }
    else {
        hourValue = '';
    }
    return hourValue + minutes + ':' + seconds;
}
exports.formatTime = formatTime;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function normalise(num, min, max) {
    return (num - min) / (max - min);
}
exports.normalise = normalise;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var virtual_canvas_1 = __webpack_require__(11);
function isVirtual(canvas) {
    if (!canvas) {
        return false;
    }
    return canvas instanceof virtual_canvas_1.VirtualCanvas;
}
exports.isVirtual = isVirtual;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var manifesto_js_1 = __webpack_require__(3);
function getFirstTargetedCanvasId(range) {
    var canvasId;
    if (range.canvases && range.canvases.length) {
        canvasId = range.canvases[0];
    }
    else {
        var childRanges = range.getRanges();
        if (childRanges.length) {
            return getFirstTargetedCanvasId(childRanges[0]);
        }
    }
    if (canvasId !== undefined) {
        return manifesto_js_1.Utils.normaliseUrl(canvasId);
    }
    return undefined;
}
exports.getFirstTargetedCanvasId = getFirstTargetedCanvasId;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(37);


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(22));
__export(__webpack_require__(27));
__export(__webpack_require__(29));
__export(__webpack_require__(58));
__export(__webpack_require__(19));
__export(__webpack_require__(9));
__export(__webpack_require__(4));


/***/ }),
/* 38 */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(8),
    isArguments = __webpack_require__(43),
    isArray = __webpack_require__(48);

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(41);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(42)))

/***/ }),
/* 42 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(44),
    isObjectLike = __webpack_require__(24);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(45),
    isObjectLike = __webpack_require__(24);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(8),
    getRawTag = __webpack_require__(46),
    objectToString = __webpack_require__(47);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(8);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 47 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = self.fetch || (self.fetch = __webpack_require__(25).default || __webpack_require__(25));


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dash_format_1 = __webpack_require__(51);
var hls_format_1 = __webpack_require__(52);
var mpeg_format_1 = __webpack_require__(53);
var default_format_1 = __webpack_require__(54);
var logger_1 = __webpack_require__(2);
var MediaElement = /** @class */ (function () {
    function MediaElement(source, mediaOptions) {
        if (mediaOptions === void 0) { mediaOptions = {}; }
        this.source = source;
        this.mediaSource = source.mediaSource;
        this.type = source.type.toString().toLowerCase();
        this.format = source.format ? source.format.toString() : undefined;
        this.mediaSyncMarginSecs = mediaOptions.mediaSyncMarginSecs || 1;
        switch (this.type) {
            case 'video':
                this.element = document.createElement('video');
                break;
            case 'sound':
            case 'audio':
                this.element = document.createElement('audio');
                break;
            default:
                return;
        }
        if (this.isDash()) {
            this.instance = new dash_format_1.DashFormat(this.mediaSource, mediaOptions);
        }
        else if (this.isHls()) {
            this.instance = new hls_format_1.HlsFormat(this.mediaSource, mediaOptions);
        }
        else if (this.isMpeg()) {
            this.instance = new mpeg_format_1.MpegFormat(this.mediaSource, mediaOptions);
        }
        else {
            this.instance = new default_format_1.DefaultFormat(this.mediaSource, mediaOptions);
        }
        this.element.classList.add('anno');
        this.element.crossOrigin = 'anonymous';
        this.element.preload = 'metadata';
        this.element.pause();
        this.instance.attachTo(this.element);
        this.element.currentTime = this.source.start;
    }
    MediaElement.prototype.syncClock = function (time) {
        if (time > this.element.duration) {
            logger_1.Logger.error("Clock synced out of bounds (max: " + this.element.duration + ", got: " + time + ")");
            return;
        }
        if (Math.abs(this.element.currentTime - time) > this.mediaSyncMarginSecs) {
            this.element.currentTime = time;
        }
    };
    MediaElement.prototype.getCanvasId = function () {
        return this.source.canvasId;
    };
    MediaElement.prototype.isWithinRange = function (time) {
        return this.source.start <= time && this.source.end >= time;
    };
    MediaElement.prototype.load = function (withAudio) {
        if (withAudio === void 0) { withAudio = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (withAudio) {
                            this.element.load();
                        }
                        return [4 /*yield*/, new Promise(function (resolve) {
                                _this.element.addEventListener('loadedmetadata', function () {
                                    resolve();
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MediaElement.prototype.setSize = function (top, left, width, height) {
        $(this.element).css({
            top: top + "%",
            left: left + "%",
            width: width + "%",
            height: height + "%",
        });
    };
    MediaElement.prototype.isDash = function () {
        return this.format && this.format.toString() === 'application/dash+xml' && typeof dashjs !== 'undefined';
    };
    MediaElement.prototype.isHls = function () {
        return (this.format &&
            this.format.toString() === 'application/vnd.apple.mpegurl' &&
            typeof Hls !== 'undefined' &&
            Hls.isSupported());
    };
    MediaElement.prototype.isMpeg = function () {
        return this.element.canPlayType('application/vnd.apple.mpegurl') !== '';
    };
    MediaElement.prototype.stop = function () {
        this.element.pause();
        this.element.currentTime = this.source.start;
    };
    MediaElement.prototype.play = function (time) {
        logger_1.Logger.log("MediaElement.play(" + time + ")");
        if (typeof time !== 'undefined') {
            this.element.currentTime = time;
        }
        return this.element.play();
    };
    MediaElement.prototype.pause = function () {
        this.element.pause();
    };
    MediaElement.prototype.isBuffering = function () {
        return this.element.readyState < 3;
    };
    return MediaElement;
}());
exports.MediaElement = MediaElement;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_media_format_1 = __webpack_require__(5);
var DashFormat = /** @class */ (function (_super) {
    __extends(DashFormat, _super);
    function DashFormat(source, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, source, options) || this;
        _this.player = dashjs.MediaPlayer().create();
        _this.player.getDebug().setLogToBrowserConsole(false);
        if (options.adaptiveAuthEnabled) {
            _this.player.setXHRWithCredentialsForType('MPD', true); // send cookies
        }
        return _this;
    }
    DashFormat.prototype.attachTo = function (element) {
        this.player.initialize(element, this.source, false);
    };
    DashFormat.prototype.debug = function () {
        this.player.getDebug().setLogToBrowserConsole(true);
        this.player.getDebug().setLogLevel(4);
    };
    return DashFormat;
}(abstract_media_format_1.MediaFormat));
exports.DashFormat = DashFormat;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_media_format_1 = __webpack_require__(5);
var HlsFormat = /** @class */ (function (_super) {
    __extends(HlsFormat, _super);
    function HlsFormat(source, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, source, options) || this;
        if (options.adaptiveAuthEnabled) {
            _this.hls = new Hls({
                xhrSetup: function (xhr) {
                    xhr.withCredentials = true; // send cookies
                },
            });
        }
        else {
            _this.hls = new Hls();
        }
        _this.hls.loadSource(_this.source);
        return _this;
    }
    HlsFormat.prototype.attachTo = function (element) {
        this.hls.attachMedia(element);
    };
    return HlsFormat;
}(abstract_media_format_1.MediaFormat));
exports.HlsFormat = HlsFormat;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_media_format_1 = __webpack_require__(5);
var MpegFormat = /** @class */ (function (_super) {
    __extends(MpegFormat, _super);
    function MpegFormat(source, options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, source, options) || this;
    }
    MpegFormat.prototype.attachTo = function (element) {
        element.src = this.source;
    };
    return MpegFormat;
}(abstract_media_format_1.MediaFormat));
exports.MpegFormat = MpegFormat;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_media_format_1 = __webpack_require__(5);
var DefaultFormat = /** @class */ (function (_super) {
    __extends(DefaultFormat, _super);
    function DefaultFormat(source, options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, source, options) || this;
    }
    return DefaultFormat;
}(abstract_media_format_1.MediaFormat));
exports.DefaultFormat = DefaultFormat;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var relative_time_1 = __webpack_require__(6);
var logger_1 = __webpack_require__(2);
var TimePlanPlayer = /** @class */ (function () {
    function TimePlanPlayer(media, plan, notifyRangeChange, notifyTimeChange, notifyPlaying) {
        var _this = this;
        this.continuous = true;
        this.playing = false;
        this._time = relative_time_1.timelineTime(0);
        this.media = media;
        this.plan = plan;
        this.fullPlan = plan;
        this.currentStop = plan.stops[0];
        var noop = function () {
            // no-op.
        };
        this.notifyRangeChange = notifyRangeChange || noop;
        this.notifyTimeChange = notifyTimeChange || noop;
        this.notifyPlaying = notifyPlaying || noop;
        this.logging = true;
        this.currentRange = this.currentStop.rangeStack[0];
        this.setTime(this.currentStop.start);
        media.onPlay(function (canvasId, time, el) {
            // Playing the right thing...
            if (canvasId === _this.plan.canvases[_this.currentStop.canvasIndex]) {
                if (!_this.playing) {
                    _this.notifyPlaying(true);
                }
            }
            else {
                el.pause();
            }
        });
        media.onPause(function (canvasId) {
            if (canvasId === _this.plan.canvases[_this.currentStop.canvasIndex]) {
                if (_this.playing) {
                    _this.notifyPlaying(false);
                }
            }
        });
    }
    TimePlanPlayer.prototype.selectPlan = function (_a) {
        var _b = _a === void 0 ? {} : _a, reset = _b.reset, rangeId = _b.rangeId;
        if (reset) {
            return this.initialisePlan(this.fullPlan);
        }
        if (rangeId) {
            var foundStack = [];
            for (var _i = 0, _c = this.fullPlan.stops; _i < _c.length; _i++) {
                var plan_1 = _c[_i];
                var idx = plan_1.rangeStack.indexOf(rangeId);
                if (plan_1.rangeStack.indexOf(rangeId) !== -1) {
                    foundStack = plan_1.rangeStack.slice(1, idx + 1);
                }
            }
            var plan = this.fullPlan;
            for (var _d = 0, foundStack_1 = foundStack; _d < foundStack_1.length; _d++) {
                var id = foundStack_1[_d];
                for (var _e = 0, _f = plan.items; _e < _f.length; _e++) {
                    var item = _f[_e];
                    if (item.type === 'time-plan' && item.rangeId === id) {
                        plan = item;
                        break;
                    }
                }
            }
            if (plan) {
                return this.initialisePlan(plan);
            }
        }
    };
    TimePlanPlayer.prototype.initialisePlan = function (plan) {
        this.plan = plan;
    };
    TimePlanPlayer.prototype.getCurrentRange = function () {
        var rangeId = this.currentRange;
        var isRangeWithStop = this.currentRange === this.currentStop.rangeId;
        var stopsToCheck = isRangeWithStop ? this.plan.stops : this.fullPlan.stops;
        var starting = [];
        var ending = [];
        for (var _i = 0, stopsToCheck_1 = stopsToCheck; _i < stopsToCheck_1.length; _i++) {
            var stop_1 = stopsToCheck_1[_i];
            if (!isRangeWithStop) {
                if (stop_1.rangeStack.indexOf(rangeId) !== -1) {
                    starting.push(stop_1.start);
                    ending.push(stop_1.end);
                }
            }
            else if (stop_1.rangeId === rangeId) {
                starting.push(stop_1.start);
                ending.push(stop_1.end);
            }
        }
        var start = Math.min.apply(Math, starting);
        var end = Math.max.apply(Math, ending);
        logger_1.Logger.log('Range', {
            rangeId: rangeId,
            isRangeWithStop: isRangeWithStop,
            stopsToCheck: stopsToCheck,
            start: start - this.plan.start,
            end: end - this.plan.start,
            duration: end - start,
        });
        return {
            start: start - this.plan.start,
            end: end - this.plan.start,
            duration: end - start,
        };
    };
    TimePlanPlayer.prototype.getTime = function () {
        return this._time;
    };
    TimePlanPlayer.prototype.setInternalTime = function (time) {
        this._time = time;
        this.notifyTimeChange(time);
        return this._time;
    };
    TimePlanPlayer.prototype.log = function () {
        var content = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            content[_i] = arguments[_i];
        }
        if (this.logging) {
            logger_1.Logger.log.apply(logger_1.Logger, __spreadArrays(['TimePlanPlayer'], content));
        }
    };
    TimePlanPlayer.prototype.setContinuousPlayback = function (continuous) {
        this.continuous = continuous;
    };
    TimePlanPlayer.prototype.setIsPlaying = function (playing) {
        this.playing = playing;
    };
    TimePlanPlayer.prototype.play = function () {
        this.log('Play', this.getTime());
        this.setIsPlaying(true);
        this.media.play(this.plan.canvases[this.currentStop.canvasIndex]);
        return this.getTime();
    };
    TimePlanPlayer.prototype.currentTimelineTime = function () {
        return this.getTime();
    };
    TimePlanPlayer.prototype.currentMediaTime = function () {
        logger_1.Logger.log("Current media time:\n  - Current start: " + this.currentStop.start + "\n  - Current canvas: " + this.currentStop.canvasTime.start + "\n  - Current time: " + this.getTime() + "\n    ", this);
        var time = relative_time_1.minusTime(this.getTime(), this.currentStop.start);
        return relative_time_1.annotationTime(relative_time_1.addTime(time, relative_time_1.timelineTime(this.currentStop.canvasTime.start)));
    };
    TimePlanPlayer.prototype.pause = function () {
        this.log('Pause', this.getTime());
        this.setIsPlaying(false);
        this.media.pause();
        return this.getTime();
    };
    TimePlanPlayer.prototype.setVolume = function (volume) {
        this.media.setVolume(volume);
    };
    TimePlanPlayer.prototype.findStop = function (time) {
        // // First check current stop.
        // if ((this.currentStop.start - 0.0001) <= time && (this.currentStop.end + 0.0001) > time) {
        //     return this.currentStop;
        // }
        //
        // // Then check next stop.
        // const idx = this.plan.stops.indexOf(this.currentStop);
        // const nextStop = idx !== -1 ? this.plan.stops[idx + 1] : undefined;
        // if (nextStop && nextStop.start <= time && nextStop.end > time) {
        //     return nextStop;
        // }
        // Fallback to checking all stops.
        for (var _i = 0, _a = this.plan.stops; _i < _a.length; _i++) {
            var stop_2 = _a[_i];
            if (stop_2.start - 0.001 <= time && stop_2.end - 0.001 > time) {
                return stop_2;
            }
        }
        if (this.plan.stops[this.plan.stops.length - 1].end === time) {
            return this.plan.stops[this.plan.stops.length - 1];
        }
        return;
    };
    // Time that is set by the user.
    TimePlanPlayer.prototype.setTime = function (time, setRange) {
        if (setRange === void 0) { setRange = true; }
        return __awaiter(this, void 0, void 0, function () {
            var start, stop_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.Logger.groupCollapsed("TimeplanPlayer.setTime(" + time + ", " + (setRange ? 'true' : 'false') + ")");
                        start = this.getTime();
                        if (!(start !== time)) return [3 /*break*/, 2];
                        this.log('set time', { from: this.getTime(), to: time });
                        this.setInternalTime(time);
                        stop_3 = this.findStop(time);
                        if (!(stop_3 && stop_3 !== this.currentStop)) return [3 /*break*/, 2];
                        if (setRange) {
                            this.currentRange = stop_3.rangeId;
                        }
                        return [4 /*yield*/, this.advanceToStop(this.currentStop, stop_3)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        logger_1.Logger.groupEnd();
                        return [2 /*return*/];
                }
            });
        });
    };
    TimePlanPlayer.prototype.next = function () {
        var currentRangeIndex = this.plan.rangeOrder.indexOf(this.currentRange);
        var isLast = currentRangeIndex >= 0 && currentRangeIndex === this.plan.rangeOrder.length - 1;
        var nextRangeIdx = !isLast ? this.plan.rangeOrder.indexOf(this.currentRange) + 1 : undefined;
        var nextRange = typeof nextRangeIdx !== 'undefined' ? this.plan.rangeOrder[nextRangeIdx] : undefined;
        var idx = this.plan.stops.indexOf(this.currentStop);
        var offset = 0;
        var nextStop = undefined;
        var running = true;
        while (running) {
            offset++;
            nextStop = this.plan.stops[idx + offset];
            if (!nextStop) {
                running = false;
                break;
            }
            if (nextStop.rangeId !== this.currentStop.rangeId) {
                running = false;
                break;
            }
        }
        if (this.playing && nextStop) {
            nextRange = nextStop.rangeId;
        }
        if (nextRange && nextStop && nextStop.rangeId !== nextRange) {
            if (this.playing ||
                (this.currentStop.rangeStack.indexOf(nextRange) === -1 && nextStop.rangeStack.indexOf(nextRange) !== -1)) {
                this.currentRange = this.playing ? nextStop.rangeId : nextRange;
                this.setInternalTime(nextStop.start);
                this.advanceToStop(this.currentStop, nextStop, this.playing ? nextStop.rangeId : nextRange);
            }
            else {
                this.currentRange = nextRange;
                this.setInternalTime(this.currentStop.start);
                this.advanceToStop(this.currentStop, this.currentStop, nextRange);
            }
            return this.getTime();
        }
        if (nextStop) {
            this.setInternalTime(nextStop.start);
            this.currentRange = nextStop.rangeId;
            this.advanceToStop(this.currentStop, nextStop, nextStop.rangeId);
        }
        else {
            this.goToEndOfRange(this.currentStop.rangeId);
        }
        return this.getTime();
    };
    TimePlanPlayer.prototype.goToEndOfRange = function (rangeId) {
        var state = undefined;
        for (var i = 0; i < this.plan.stops.length; i++) {
            var stop_4 = this.plan.stops[i];
            if (stop_4.rangeId === rangeId && (!state || (stop_4.canvasIndex >= state.canvasIndex && stop_4.end > state.end))) {
                state = stop_4;
            }
        }
        if (state) {
            this.advanceToStop(this.currentStop, state, rangeId);
            this.setInternalTime(state.end);
        }
    };
    TimePlanPlayer.prototype.goToStartOfRange = function (rangeId) {
        var state = undefined;
        var length = this.plan.stops.length;
        for (var i = length - 1; i >= 0; i--) {
            var stop_5 = this.plan.stops[i];
            if (stop_5.rangeId === rangeId && (!state || (stop_5.canvasIndex <= state.canvasIndex && stop_5.start < state.start))) {
                state = stop_5;
            }
        }
        if (state) {
            if (state !== this.currentStop) {
                this.advanceToStop(this.currentStop, state, rangeId);
            }
            this.setInternalTime(state.start);
        }
    };
    TimePlanPlayer.prototype.previous = function () {
        var currentRangeIndex = this.plan.rangeOrder.indexOf(this.currentRange);
        var isFirst = currentRangeIndex === 0;
        var prevRangeIdx = !isFirst ? this.plan.rangeOrder.indexOf(this.currentRange) - 1 : undefined;
        var prevRange = typeof prevRangeIdx !== 'undefined' ? this.plan.rangeOrder[prevRangeIdx] : undefined;
        var currentStopHead = this.currentStop;
        var idx = this.plan.stops.indexOf(this.currentStop);
        var newIdx = idx;
        var prevStop = this.plan.stops[idx - 1];
        var running = true;
        while (running) {
            var nextPrevStop = this.plan.stops[newIdx - 1];
            if (!nextPrevStop) {
                running = false;
                break;
            }
            if (nextPrevStop.rangeId === this.currentRange) {
                currentStopHead = nextPrevStop;
            }
            if (prevStop.rangeId !== nextPrevStop.rangeId) {
                running = false;
                break;
            }
            if (nextPrevStop) {
                prevStop = nextPrevStop;
                newIdx = newIdx - 1;
            }
        }
        var goBackToStartOfRange = this._time - (currentStopHead.start + 2) > 0;
        var isPreviousRangeDifferent = this.playing && prevStop && prevStop.rangeId !== this.currentStop.rangeId;
        var isDefinitelyFirstRange = idx === 0 || (!prevRange && newIdx === 0);
        var isPreviousRangeNotAParent = prevRange &&
            this.currentStop.rangeStack.indexOf(prevRange) === -1 &&
            // But it is in the previous.
            (prevStop.rangeStack.indexOf(prevRange) !== -1 || prevStop.rangeId === prevRange);
        var isPreviousRangeInStack = prevRange && this.currentStop.rangeStack.indexOf(prevRange) !== -1;
        if (goBackToStartOfRange) {
            if (currentStopHead !== this.currentStop) {
                this.advanceToStop(this.currentStop, currentStopHead, currentStopHead.rangeId);
            }
            this.setInternalTime(currentStopHead.start);
            return this.getTime();
        }
        if (isPreviousRangeDifferent) {
            prevRange = prevStop.rangeId;
        }
        // Case 1, at the start, but parent ranges possible.
        if (isDefinitelyFirstRange) {
            // Set the time to the start.
            this.goToStartOfRange(prevRange ? prevRange : this.currentStop.rangeId);
            // We are on the first item.
            if (prevRange && this.currentStop.rangeId !== prevRange) {
                // But we still want to change the range.
                this.currentRange = prevRange;
                this.advanceToStop(this.currentStop, currentStopHead, prevRange);
            }
            // And return the time.
            return this.getTime();
        }
        // Case 2, in the middle, but previous is a parent.
        if (prevRange && isPreviousRangeNotAParent) {
            // Then we navigate to the previous.
            this.setInternalTime(prevStop.start);
            this.currentRange = prevRange;
            this.advanceToStop(this.currentStop, prevStop, prevRange);
            // And time.
            return this.getTime();
        }
        // If the previous range is in the current ranges stack (i.e. a parent)
        if (prevRange && isPreviousRangeInStack) {
            this.setInternalTime(this.currentStop.start);
            this.currentRange = prevRange;
            this.advanceToStop(this.currentStop, currentStopHead, prevRange);
            // And time.
            return this.getTime();
        }
        return this.getTime();
    };
    TimePlanPlayer.prototype.setRange = function (id) {
        logger_1.Logger.log('setRange', id);
        if (id === this.currentRange) {
            return this.getTime();
        }
        this.currentRange = id;
        if (id === this.currentStop.rangeId) {
            // Or the start of the range?
            return this.getTime();
        }
        for (var _i = 0, _a = this.plan.stops; _i < _a.length; _i++) {
            var stop_6 = _a[_i];
            if (stop_6.rangeId === id) {
                this.setInternalTime(stop_6.start);
                this.advanceToStop(this.currentStop, stop_6, id);
                break;
            }
        }
        for (var _b = 0, _c = this.plan.stops; _b < _c.length; _b++) {
            var stop_7 = _c[_b];
            if (stop_7.rangeStack.indexOf(id) !== -1) {
                this.setInternalTime(stop_7.start);
                this.advanceToStop(this.currentStop, stop_7, id);
                break;
            }
        }
        return this.getTime();
    };
    TimePlanPlayer.prototype.isBuffering = function () {
        return this.media.isBuffering();
    };
    // Time that has ticked over.
    TimePlanPlayer.prototype.advanceToTime = function (time) {
        logger_1.Logger.groupCollapsed("TimeplanPlayer.advanceToTime(" + time + ")");
        // this.log('advanceToTime', this.getTime().toFixed(0), time.toFixed(0));
        var stop = this.findStop(time);
        if (stop && this.currentStop !== stop) {
            logger_1.Logger.log('advanceToTime.a');
            this.advanceToStop(this.currentStop, stop);
            return { buffering: this.isBuffering(), time: time };
        }
        // User has selected top level range.
        if (this.playing && this.currentRange !== this.currentStop.rangeId) {
            this.currentRange = this.currentStop.rangeId;
            this.notifyRangeChange(this.currentStop.rangeId, {
                from: this.currentStop,
                to: this.currentStop,
            });
        }
        if (!stop) {
            logger_1.Logger.log('advanceToTime.b');
            this.pause();
            this.setTime(this.currentStop.end);
            logger_1.Logger.groupEnd();
            return {
                paused: true,
                buffering: this.isBuffering(),
                time: this.currentStop.end,
            };
        }
        else {
            logger_1.Logger.log('advanceToTime.c', {
                time: this.getTime(),
            });
            this.setInternalTime(time);
            this.media.syncClock(this.currentMediaTime());
            logger_1.Logger.groupEnd();
            return { time: time };
        }
    };
    TimePlanPlayer.prototype.hasEnded = function () {
        return this.currentStop.end === this.getTime();
    };
    TimePlanPlayer.prototype.advanceToStop = function (from, to, rangeId) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.Logger.log('TimeplanPlayer.advanceToStop', {
                            from: from,
                            to: to,
                            rangeId: rangeId,
                        });
                        if (from === to) {
                            if (rangeId) {
                                this.notifyRangeChange(rangeId ? rangeId : to.rangeId, {
                                    to: to,
                                    from: from,
                                });
                            }
                            return [2 /*return*/];
                        }
                        this.log('advanceToStop', to.start);
                        this.currentStop = to;
                        promise = this.media.seekToMediaTime(this.currentMediaTime());
                        this.notifyRangeChange(rangeId ? rangeId : to.rangeId, { to: to, from: from });
                        return [4 /*yield*/, promise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TimePlanPlayer.prototype.getStartTime = function () {
        return this.plan.start;
    };
    TimePlanPlayer.prototype.getDuration = function () {
        return this.plan.duration;
    };
    return TimePlanPlayer;
}());
exports.TimePlanPlayer = TimePlanPlayer;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(2);
var CompositeMediaElement = /** @class */ (function () {
    function CompositeMediaElement(mediaElements) {
        var _this = this;
        this.elements = [];
        this.playing = false;
        this.canvasMap = {};
        this._onPlay = [];
        this._onPause = [];
        logger_1.Logger.log('Composite media element', mediaElements);
        // Add all elements.
        this.elements = mediaElements;
        var _loop_1 = function (el) {
            var canvasId = el.getCanvasId();
            this_1.canvasMap[canvasId] = this_1.canvasMap[canvasId] ? this_1.canvasMap[canvasId] : [];
            this_1.canvasMap[canvasId].push(el);
            // Attach events.
            el.element.addEventListener('play', function () {
                _this._onPlay.forEach(function (fn) { return fn(canvasId, el.element.currentTime, el); });
            });
            el.element.addEventListener('pause', function () {
                _this._onPause.forEach(function (fn) { return fn(canvasId, el.element.currentTime, el); });
            });
        };
        var this_1 = this;
        for (var _i = 0, mediaElements_1 = mediaElements; _i < mediaElements_1.length; _i++) {
            var el = mediaElements_1[_i];
            _loop_1(el);
        }
        this.activeElement = mediaElements[0];
    }
    CompositeMediaElement.prototype.syncClock = function (time) {
        logger_1.Logger.group('CompositeMediaElement.syncClock');
        logger_1.Logger.log("syncClock: " + time);
        logger_1.Logger.log({
            fromTime: time,
            toTime: time,
            instance: this,
        });
        if (this.activeElement) {
            this.activeElement.syncClock(time);
        }
        logger_1.Logger.groupEnd();
    };
    CompositeMediaElement.prototype.onPlay = function (func) {
        this._onPlay.push(func);
    };
    CompositeMediaElement.prototype.onPause = function (func) {
        this._onPause.push(func);
    };
    CompositeMediaElement.prototype.findElementInRange = function (canvasId, time) {
        if (!this.canvasMap[canvasId]) {
            return undefined;
        }
        for (var _i = 0, _a = this.canvasMap[canvasId]; _i < _a.length; _i++) {
            var el = _a[_i];
            if (el.isWithinRange(time)) {
                return el;
            }
        }
        return undefined;
    };
    CompositeMediaElement.prototype.appendTo = function ($element) {
        logger_1.Logger.log('Appending...', this.elements.map(function (media) { return media.element; }));
        $element.append(this.elements.map(function (media) { return media.element; }));
    };
    CompositeMediaElement.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(this.elements.map(function (element) { return element.load(); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CompositeMediaElement.prototype.seekToMediaTime = function (realTime) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.activeElement) return [3 /*break*/, 3];
                        if (!this.playing) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.activeElement.play(realTime)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.activeElement.syncClock(realTime);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CompositeMediaElement.prototype.seekTo = function (canvasId, time) {
        return __awaiter(this, void 0, void 0, function () {
            var newElement;
            return __generator(this, function (_a) {
                newElement = this.findElementInRange(canvasId, time);
                logger_1.Logger.log('CompositeMediaElement.seekTo()', {
                    canvasId: newElement ? newElement.source.canvasId : null,
                    newElement: newElement,
                });
                if (this.activeElement && newElement && newElement !== this.activeElement) {
                    // Moving track.
                    // Stop the current track.
                    this.activeElement.stop();
                    // Set new current track.
                    this.activeElement = newElement;
                }
                return [2 /*return*/, this.seekToMediaTime(time)];
            });
        });
    };
    CompositeMediaElement.prototype.play = function (canvasId, time) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.playing = true;
                        if (!(canvasId && typeof time !== 'undefined')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.seekTo(canvasId, time)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (this.activeElement) {
                            return [2 /*return*/, this.activeElement.play(time)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CompositeMediaElement.prototype.pause = function () {
        this.playing = false;
        if (this.activeElement) {
            this.activeElement.pause();
        }
    };
    CompositeMediaElement.prototype.setVolume = function (volume) {
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var el = _a[_i];
            el.element.volume = volume;
        }
    };
    CompositeMediaElement.prototype.isBuffering = function () {
        return this.activeElement ? this.activeElement.isBuffering() : false;
    };
    return CompositeMediaElement;
}());
exports.CompositeMediaElement = CompositeMediaElement;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CompositeWaveform = /** @class */ (function () {
    function CompositeWaveform(waveforms) {
        var _this = this;
        this.length = 0;
        this.duration = 0;
        this.pixelsPerSecond = Number.MAX_VALUE;
        this.secondsPerPixel = Number.MAX_VALUE;
        this.timeIndex = {};
        this.minIndex = {};
        this.maxIndex = {};
        this._waveforms = [];
        waveforms.forEach(function (waveform) {
            _this._waveforms.push({
                start: _this.length,
                end: _this.length + waveform.adapter.length,
                waveform: waveform,
            });
            _this.length += waveform.adapter.length;
            _this.duration += waveform.duration;
            _this.pixelsPerSecond = Math.min(_this.pixelsPerSecond, waveform.pixels_per_second);
            _this.secondsPerPixel = Math.min(_this.secondsPerPixel, waveform.seconds_per_pixel);
        });
    }
    // Note: these could be optimised, assuming access is sequential
    CompositeWaveform.prototype.min = function (index) {
        if (typeof this.minIndex[index] === 'undefined') {
            var waveform = this._find(index);
            this.minIndex[index] = waveform ? waveform.waveform.min_sample(index - waveform.start) : 0;
        }
        return this.minIndex[index];
    };
    CompositeWaveform.prototype.max = function (index) {
        if (typeof this.maxIndex[index] === 'undefined') {
            var waveform = this._find(index);
            this.maxIndex[index] = waveform ? waveform.waveform.max_sample(index - waveform.start) : 0;
        }
        return this.maxIndex[index];
    };
    CompositeWaveform.prototype._find = function (index) {
        if (typeof this.timeIndex[index] === 'undefined') {
            // eslint-disable-next-line no-shadow
            var waveform = this._waveforms.find(function (waveform) {
                return index >= waveform.start && index < waveform.end;
            });
            if (!waveform) {
                return null;
            }
            this.timeIndex[index] = waveform;
        }
        return this.timeIndex[index];
    };
    return CompositeWaveform;
}());
exports.CompositeWaveform = CompositeWaveform;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var can_play_hls_1 = __webpack_require__(16);
var create_time_plans_from_manifest_1 = __webpack_require__(30);
var debounce_1 = __webpack_require__(59);
var diff_data_1 = __webpack_require__(20);
var extract_media_from_annotation_bodies_1 = __webpack_require__(28);
var format_time_1 = __webpack_require__(32);
var get_first_targeted_canvas_id_1 = __webpack_require__(35);
var get_media_source_from_annotation_body_1 = __webpack_require__(31);
var get_spatial_component_1 = __webpack_require__(18);
var get_timestamp_1 = __webpack_require__(26);
var hls_media_types_1 = __webpack_require__(14);
var is_hls_format_1 = __webpack_require__(13);
var is_ie_1 = __webpack_require__(60);
var is_mpeg_dash_format_1 = __webpack_require__(15);
var is_safari_1 = __webpack_require__(17);
var is_virtual_1 = __webpack_require__(34);
var normalise_number_1 = __webpack_require__(33);
var retarget_temporal_component_1 = __webpack_require__(12);
exports.AVComponentUtils = {
    canPlayHls: can_play_hls_1.canPlayHls,
    createTimePlansFromManifest: create_time_plans_from_manifest_1.createTimePlansFromManifest,
    debounce: debounce_1.debounce,
    diffData: diff_data_1.diffData,
    diff: diff_data_1.diffData,
    extractMediaFromAnnotationBodies: extract_media_from_annotation_bodies_1.extractMediaFromAnnotationBodies,
    formatTime: format_time_1.formatTime,
    getFirstTargetedCanvasId: get_first_targeted_canvas_id_1.getFirstTargetedCanvasId,
    getMediaSourceFromAnnotationBody: get_media_source_from_annotation_body_1.getMediaSourceFromAnnotationBody,
    getSpatialComponent: get_spatial_component_1.getSpatialComponent,
    getTimestamp: get_timestamp_1.getTimestamp,
    hlsMimeTypes: hls_media_types_1.hlsMimeTypes,
    hlsMediaTypes: hls_media_types_1.hlsMimeTypes,
    isHLSFormat: is_hls_format_1.isHLSFormat,
    isIE: is_ie_1.isIE,
    isMpegDashFormat: is_mpeg_dash_format_1.isMpegDashFormat,
    isSafari: is_safari_1.isSafari,
    isVirtual: is_virtual_1.isVirtual,
    normalise: normalise_number_1.normalise,
    normalize: normalise_number_1.normalise,
    normalizeNumber: normalise_number_1.normalise,
    normaliseNumber: normalise_number_1.normalise,
    retargetTemporalComponent: retarget_temporal_component_1.retargetTemporalComponent,
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function debounce(fn, debounceDuration) {
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
            // eslint-disable-next-line prefer-rest-params
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
}
exports.debounce = debounce;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isIE() {
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
}
exports.isIE = isIE;


/***/ })
/******/ ]);
});