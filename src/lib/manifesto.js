// manifesto v2.2.31 https://github.com/iiif-commons/manifesto
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.manifesto = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){

var Manifesto;
(function (Manifesto) {
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
    Manifesto.StringValue = StringValue;
})(Manifesto || (Manifesto = {}));

var Manifesto;
(function (Manifesto) {
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
    Manifesto.Duration = Duration;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var AnnotationMotivation = /** @class */ (function (_super) {
        __extends(AnnotationMotivation, _super);
        function AnnotationMotivation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // todo: use getters when ES3 target is no longer required.
        AnnotationMotivation.prototype.bookmarking = function () {
            return new AnnotationMotivation(AnnotationMotivation.BOOKMARKING.toString());
        };
        AnnotationMotivation.prototype.classifying = function () {
            return new AnnotationMotivation(AnnotationMotivation.CLASSIFYING.toString());
        };
        AnnotationMotivation.prototype.commenting = function () {
            return new AnnotationMotivation(AnnotationMotivation.COMMENTING.toString());
        };
        AnnotationMotivation.prototype.describing = function () {
            return new AnnotationMotivation(AnnotationMotivation.DESCRIBING.toString());
        };
        AnnotationMotivation.prototype.editing = function () {
            return new AnnotationMotivation(AnnotationMotivation.EDITING.toString());
        };
        AnnotationMotivation.prototype.highlighting = function () {
            return new AnnotationMotivation(AnnotationMotivation.HIGHLIGHTING.toString());
        };
        AnnotationMotivation.prototype.identifying = function () {
            return new AnnotationMotivation(AnnotationMotivation.IDENTIFYING.toString());
        };
        AnnotationMotivation.prototype.linking = function () {
            return new AnnotationMotivation(AnnotationMotivation.LINKING.toString());
        };
        AnnotationMotivation.prototype.moderating = function () {
            return new AnnotationMotivation(AnnotationMotivation.MODERATING.toString());
        };
        AnnotationMotivation.prototype.painting = function () {
            return new AnnotationMotivation(AnnotationMotivation.PAINTING.toString());
        };
        AnnotationMotivation.prototype.questioning = function () {
            return new AnnotationMotivation(AnnotationMotivation.QUESTIONING.toString());
        };
        AnnotationMotivation.prototype.replying = function () {
            return new AnnotationMotivation(AnnotationMotivation.REPLYING.toString());
        };
        AnnotationMotivation.prototype.tagging = function () {
            return new AnnotationMotivation(AnnotationMotivation.TAGGING.toString());
        };
        AnnotationMotivation.prototype.transcribing = function () {
            return new AnnotationMotivation(AnnotationMotivation.TRANSCRIBING.toString());
        };
        AnnotationMotivation.BOOKMARKING = new AnnotationMotivation("oa:bookmarking");
        AnnotationMotivation.CLASSIFYING = new AnnotationMotivation("oa:classifying");
        AnnotationMotivation.COMMENTING = new AnnotationMotivation("oa:commenting");
        AnnotationMotivation.DESCRIBING = new AnnotationMotivation("oa:describing");
        AnnotationMotivation.EDITING = new AnnotationMotivation("oa:editing");
        AnnotationMotivation.HIGHLIGHTING = new AnnotationMotivation("oa:highlighting");
        AnnotationMotivation.IDENTIFYING = new AnnotationMotivation("oa:identifying");
        AnnotationMotivation.LINKING = new AnnotationMotivation("oa:linking");
        AnnotationMotivation.MODERATING = new AnnotationMotivation("oa:moderating");
        AnnotationMotivation.PAINTING = new AnnotationMotivation("sc:painting");
        AnnotationMotivation.QUESTIONING = new AnnotationMotivation("oa:questioning");
        AnnotationMotivation.REPLYING = new AnnotationMotivation("oa:replying");
        AnnotationMotivation.TAGGING = new AnnotationMotivation("oa:tagging");
        AnnotationMotivation.TRANSCRIBING = new AnnotationMotivation("oad:transcribing");
        return AnnotationMotivation;
    }(Manifesto.StringValue));
    Manifesto.AnnotationMotivation = AnnotationMotivation;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var Behavior = /** @class */ (function (_super) {
        __extends(Behavior, _super);
        function Behavior() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // todo: use getters when ES3 target is no longer required.
        Behavior.prototype.autoadvance = function () {
            return new Behavior(Behavior.AUTOADVANCE.toString());
        };
        Behavior.prototype.nonav = function () {
            return new Behavior(Behavior.NONAV.toString());
        };
        Behavior.AUTOADVANCE = new Behavior("auto-advance");
        Behavior.NONAV = new Behavior("no-nav");
        return Behavior;
    }(Manifesto.StringValue));
    Manifesto.Behavior = Behavior;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var IIIFResourceType = /** @class */ (function (_super) {
        __extends(IIIFResourceType, _super);
        function IIIFResourceType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // todo: use getters when ES3 target is no longer required.
        IIIFResourceType.prototype.annotation = function () {
            return new IIIFResourceType(IIIFResourceType.ANNOTATION.toString());
        };
        IIIFResourceType.prototype.canvas = function () {
            return new IIIFResourceType(IIIFResourceType.CANVAS.toString());
        };
        IIIFResourceType.prototype.collection = function () {
            return new IIIFResourceType(IIIFResourceType.COLLECTION.toString());
        };
        IIIFResourceType.prototype.manifest = function () {
            return new IIIFResourceType(IIIFResourceType.MANIFEST.toString());
        };
        IIIFResourceType.prototype.range = function () {
            return new IIIFResourceType(IIIFResourceType.RANGE.toString());
        };
        IIIFResourceType.prototype.sequence = function () {
            return new IIIFResourceType(IIIFResourceType.SEQUENCE.toString());
        };
        IIIFResourceType.ANNOTATION = new IIIFResourceType("annotation");
        IIIFResourceType.CANVAS = new IIIFResourceType("canvas");
        IIIFResourceType.COLLECTION = new IIIFResourceType("collection");
        IIIFResourceType.MANIFEST = new IIIFResourceType("manifest");
        IIIFResourceType.RANGE = new IIIFResourceType("range");
        IIIFResourceType.SEQUENCE = new IIIFResourceType("sequence");
        return IIIFResourceType;
    }(Manifesto.StringValue));
    Manifesto.IIIFResourceType = IIIFResourceType;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var ManifestType = /** @class */ (function (_super) {
        __extends(ManifestType, _super);
        function ManifestType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // todo: use getters when ES3 target is no longer required.
        ManifestType.prototype.empty = function () {
            return new ManifestType(ManifestType.EMPTY.toString());
        };
        ManifestType.prototype.manuscript = function () {
            return new ManifestType(ManifestType.MANUSCRIPT.toString());
        };
        ManifestType.prototype.monograph = function () {
            return new ManifestType(ManifestType.MONOGRAPH.toString());
        };
        ManifestType.EMPTY = new ManifestType("");
        ManifestType.MANUSCRIPT = new ManifestType("manuscript");
        ManifestType.MONOGRAPH = new ManifestType("monograph");
        return ManifestType;
    }(Manifesto.StringValue));
    Manifesto.ManifestType = ManifestType;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var RenderingFormat = /** @class */ (function (_super) {
        __extends(RenderingFormat, _super);
        function RenderingFormat() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // todo: use getters when ES3 target is no longer required.
        RenderingFormat.prototype.pdf = function () {
            return new RenderingFormat(RenderingFormat.PDF.toString());
        };
        RenderingFormat.prototype.doc = function () {
            return new RenderingFormat(RenderingFormat.DOC.toString());
        };
        RenderingFormat.prototype.docx = function () {
            return new RenderingFormat(RenderingFormat.DOCX.toString());
        };
        RenderingFormat.PDF = new RenderingFormat("application/pdf");
        RenderingFormat.DOC = new RenderingFormat("application/msword");
        RenderingFormat.DOCX = new RenderingFormat("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        return RenderingFormat;
    }(Manifesto.StringValue));
    Manifesto.RenderingFormat = RenderingFormat;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var MediaType = /** @class */ (function (_super) {
        __extends(MediaType, _super);
        function MediaType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // todo: use getters when ES3 target is no longer required.
        MediaType.prototype.jpg = function () {
            return new MediaType(MediaType.JPG.toString());
        };
        MediaType.prototype.mp4 = function () {
            return new MediaType(MediaType.MP4.toString());
        };
        MediaType.prototype.pdf = function () {
            return new MediaType(MediaType.PDF.toString());
        };
        MediaType.prototype.threejs = function () {
            return new MediaType(MediaType.THREEJS.toString());
        };
        MediaType.prototype.webm = function () {
            return new MediaType(MediaType.WEBM.toString());
        };
        MediaType.JPG = new MediaType("image/jpeg");
        MediaType.MP4 = new MediaType("video/mp4");
        MediaType.PDF = new MediaType("application/pdf");
        MediaType.THREEJS = new MediaType("application/vnd.threejs+json");
        MediaType.WEBM = new MediaType("video/webm");
        return MediaType;
    }(Manifesto.StringValue));
    Manifesto.MediaType = MediaType;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var ResourceType = /** @class */ (function (_super) {
        __extends(ResourceType, _super);
        function ResourceType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // todo: use getters when ES3 target is no longer required.
        ResourceType.prototype.canvas = function () {
            return new ResourceType(ResourceType.CANVAS.toString());
        };
        ResourceType.prototype.choice = function () {
            return new ResourceType(ResourceType.CHOICE.toString());
        };
        ResourceType.prototype.document = function () {
            return new ResourceType(ResourceType.DOCUMENT.toString());
        };
        ResourceType.prototype.image = function () {
            return new ResourceType(ResourceType.IMAGE.toString());
        };
        ResourceType.prototype.movingimage = function () {
            return new ResourceType(ResourceType.MOVINGIMAGE.toString());
        };
        ResourceType.prototype.physicalobject = function () {
            return new ResourceType(ResourceType.PHYSICALOBJECT.toString());
        };
        ResourceType.prototype.sound = function () {
            return new ResourceType(ResourceType.SOUND.toString());
        };
        ResourceType.prototype.text = function () {
            return new ResourceType(ResourceType.TEXT.toString());
        };
        ResourceType.CANVAS = new ResourceType("canvas");
        ResourceType.CHOICE = new ResourceType("choice");
        ResourceType.DOCUMENT = new ResourceType("document");
        ResourceType.IMAGE = new ResourceType("image");
        ResourceType.MOVINGIMAGE = new ResourceType("movingimage");
        ResourceType.PHYSICALOBJECT = new ResourceType("physicalobject");
        ResourceType.SOUND = new ResourceType("sound");
        ResourceType.TEXT = new ResourceType("textualbody");
        return ResourceType;
    }(Manifesto.StringValue));
    Manifesto.ResourceType = ResourceType;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var ServiceProfile = /** @class */ (function (_super) {
        __extends(ServiceProfile, _super);
        function ServiceProfile() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // todo: use getters when ES3 target is no longer required.
        ServiceProfile.prototype.auth1Clickthrough = function () {
            return new ServiceProfile(ServiceProfile.AUTH1CLICKTHROUGH.toString());
        };
        ServiceProfile.prototype.auth1External = function () {
            return new ServiceProfile(ServiceProfile.AUTH1EXTERNAL.toString());
        };
        ServiceProfile.prototype.auth1Kiosk = function () {
            return new ServiceProfile(ServiceProfile.AUTH1KIOSK.toString());
        };
        ServiceProfile.prototype.auth1Login = function () {
            return new ServiceProfile(ServiceProfile.AUTH1LOGIN.toString());
        };
        ServiceProfile.prototype.auth1Logout = function () {
            return new ServiceProfile(ServiceProfile.AUTH1LOGOUT.toString());
        };
        ServiceProfile.prototype.auth1Token = function () {
            return new ServiceProfile(ServiceProfile.AUTH1TOKEN.toString());
        };
        ServiceProfile.prototype.autoComplete = function () {
            return new ServiceProfile(ServiceProfile.AUTOCOMPLETE.toString());
        };
        ServiceProfile.prototype.iiif1ImageLevel1 = function () {
            return new ServiceProfile(ServiceProfile.IIIF1IMAGELEVEL1.toString());
        };
        ServiceProfile.prototype.iiif1ImageLevel2 = function () {
            return new ServiceProfile(ServiceProfile.IIIF1IMAGELEVEL2.toString());
        };
        ServiceProfile.prototype.iiif2ImageLevel1 = function () {
            return new ServiceProfile(ServiceProfile.IIIF2IMAGELEVEL1.toString());
        };
        ServiceProfile.prototype.iiif2ImageLevel2 = function () {
            return new ServiceProfile(ServiceProfile.IIIF2IMAGELEVEL2.toString());
        };
        ServiceProfile.prototype.ixif = function () {
            return new ServiceProfile(ServiceProfile.IXIF.toString());
        };
        ServiceProfile.prototype.login = function () {
            return new ServiceProfile(ServiceProfile.AUTHLOGIN.toString());
        };
        ServiceProfile.prototype.clickThrough = function () {
            return new ServiceProfile(ServiceProfile.AUTHCLICKTHROUGH.toString());
        };
        ServiceProfile.prototype.restricted = function () {
            return new ServiceProfile(ServiceProfile.AUTHRESTRICTED.toString());
        };
        ServiceProfile.prototype.logout = function () {
            return new ServiceProfile(ServiceProfile.AUTHLOGOUT.toString());
        };
        ServiceProfile.prototype.otherManifestations = function () {
            return new ServiceProfile(ServiceProfile.OTHERMANIFESTATIONS.toString());
        };
        ServiceProfile.prototype.search = function () {
            return new ServiceProfile(ServiceProfile.SEARCH.toString());
        };
        ServiceProfile.prototype.stanfordIIIFImageCompliance1 = function () {
            return new ServiceProfile(ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE1.toString());
        };
        ServiceProfile.prototype.stanfordIIIFImageCompliance2 = function () {
            return new ServiceProfile(ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE2.toString());
        };
        ServiceProfile.prototype.stanfordIIIFImageConformance1 = function () {
            return new ServiceProfile(ServiceProfile.STANFORDIIIFIMAGECONFORMANCE1.toString());
        };
        ServiceProfile.prototype.stanfordIIIFImageConformance2 = function () {
            return new ServiceProfile(ServiceProfile.STANFORDIIIFIMAGECONFORMANCE2.toString());
        };
        ServiceProfile.prototype.stanfordIIIF1ImageCompliance1 = function () {
            return new ServiceProfile(ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE1.toString());
        };
        ServiceProfile.prototype.stanfordIIIF1ImageCompliance2 = function () {
            return new ServiceProfile(ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE2.toString());
        };
        ServiceProfile.prototype.stanfordIIIF1ImageConformance1 = function () {
            return new ServiceProfile(ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE1.toString());
        };
        ServiceProfile.prototype.stanfordIIIF1ImageConformance2 = function () {
            return new ServiceProfile(ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE2.toString());
        };
        ServiceProfile.prototype.token = function () {
            return new ServiceProfile(ServiceProfile.AUTHTOKEN.toString());
        };
        ServiceProfile.prototype.trackingExtensions = function () {
            return new ServiceProfile(ServiceProfile.TRACKINGEXTENSIONS.toString());
        };
        ServiceProfile.prototype.uiExtensions = function () {
            return new ServiceProfile(ServiceProfile.UIEXTENSIONS.toString());
        };
        ServiceProfile.prototype.printExtensions = function () {
            return new ServiceProfile(ServiceProfile.PRINTEXTENSIONS.toString());
        };
        ServiceProfile.prototype.shareExtensions = function () {
            return new ServiceProfile(ServiceProfile.SHAREEXTENSIONS.toString());
        };
        // image api
        ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE0 = new ServiceProfile("http://library.stanford.edu/iiif/image-api/compliance.html#level0");
        ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE1 = new ServiceProfile("http://library.stanford.edu/iiif/image-api/compliance.html#level1");
        ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE2 = new ServiceProfile("http://library.stanford.edu/iiif/image-api/compliance.html#level2");
        ServiceProfile.STANFORDIIIFIMAGECONFORMANCE0 = new ServiceProfile("http://library.stanford.edu/iiif/image-api/conformance.html#level0");
        ServiceProfile.STANFORDIIIFIMAGECONFORMANCE1 = new ServiceProfile("http://library.stanford.edu/iiif/image-api/conformance.html#level1");
        ServiceProfile.STANFORDIIIFIMAGECONFORMANCE2 = new ServiceProfile("http://library.stanford.edu/iiif/image-api/conformance.html#level2");
        ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE0 = new ServiceProfile("http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level0");
        ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE1 = new ServiceProfile("http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level1");
        ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE2 = new ServiceProfile("http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level2");
        ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE0 = new ServiceProfile("http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level0");
        ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE1 = new ServiceProfile("http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level1");
        ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE2 = new ServiceProfile("http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level2");
        ServiceProfile.IIIF1IMAGELEVEL0 = new ServiceProfile("http://iiif.io/api/image/1/level0.json");
        ServiceProfile.IIIF1IMAGELEVEL0PROFILE = new ServiceProfile("http://iiif.io/api/image/1/profiles/level0.json");
        ServiceProfile.IIIF1IMAGELEVEL1 = new ServiceProfile("http://iiif.io/api/image/1/level1.json");
        ServiceProfile.IIIF1IMAGELEVEL1PROFILE = new ServiceProfile("http://iiif.io/api/image/1/profiles/level1.json");
        ServiceProfile.IIIF1IMAGELEVEL2 = new ServiceProfile("http://iiif.io/api/image/1/level2.json");
        ServiceProfile.IIIF1IMAGELEVEL2PROFILE = new ServiceProfile("http://iiif.io/api/image/1/profiles/level2.json");
        ServiceProfile.IIIF2IMAGELEVEL0 = new ServiceProfile("http://iiif.io/api/image/2/level0.json");
        ServiceProfile.IIIF2IMAGELEVEL0PROFILE = new ServiceProfile("http://iiif.io/api/image/2/profiles/level0.json");
        ServiceProfile.IIIF2IMAGELEVEL1 = new ServiceProfile("http://iiif.io/api/image/2/level1.json");
        ServiceProfile.IIIF2IMAGELEVEL1PROFILE = new ServiceProfile("http://iiif.io/api/image/2/profiles/level1.json");
        ServiceProfile.IIIF2IMAGELEVEL2 = new ServiceProfile("http://iiif.io/api/image/2/level2.json");
        ServiceProfile.IIIF2IMAGELEVEL2PROFILE = new ServiceProfile("http://iiif.io/api/image/2/profiles/level2.json");
        // auth api
        ServiceProfile.AUTHCLICKTHROUGH = new ServiceProfile("http://iiif.io/api/auth/0/login/clickthrough");
        ServiceProfile.AUTHLOGIN = new ServiceProfile("http://iiif.io/api/auth/0/login");
        ServiceProfile.AUTHLOGOUT = new ServiceProfile("http://iiif.io/api/auth/0/logout");
        ServiceProfile.AUTHRESTRICTED = new ServiceProfile("http://iiif.io/api/auth/0/login/restricted");
        ServiceProfile.AUTHTOKEN = new ServiceProfile("http://iiif.io/api/auth/0/token");
        ServiceProfile.AUTH1CLICKTHROUGH = new ServiceProfile("http://iiif.io/api/auth/1/clickthrough");
        ServiceProfile.AUTH1EXTERNAL = new ServiceProfile("http://iiif.io/api/auth/1/external");
        ServiceProfile.AUTH1KIOSK = new ServiceProfile("http://iiif.io/api/auth/1/kiosk");
        ServiceProfile.AUTH1LOGIN = new ServiceProfile("http://iiif.io/api/auth/1/login");
        ServiceProfile.AUTH1LOGOUT = new ServiceProfile("http://iiif.io/api/auth/1/logout");
        ServiceProfile.AUTH1TOKEN = new ServiceProfile("http://iiif.io/api/auth/1/token");
        // search api
        ServiceProfile.AUTOCOMPLETE = new ServiceProfile("http://iiif.io/api/search/0/autocomplete");
        ServiceProfile.SEARCH = new ServiceProfile("http://iiif.io/api/search/0/search");
        // extensions
        ServiceProfile.TRACKINGEXTENSIONS = new ServiceProfile("http://universalviewer.io/tracking-extensions-profile");
        ServiceProfile.UIEXTENSIONS = new ServiceProfile("http://universalviewer.io/ui-extensions-profile");
        ServiceProfile.PRINTEXTENSIONS = new ServiceProfile("http://universalviewer.io/print-extensions-profile");
        ServiceProfile.SHAREEXTENSIONS = new ServiceProfile("http://universalviewer.io/share-extensions-profile");
        // other
        ServiceProfile.OTHERMANIFESTATIONS = new ServiceProfile("http://iiif.io/api/otherManifestations.json");
        ServiceProfile.IXIF = new ServiceProfile("http://wellcomelibrary.org/ld/ixif/0/alpha.json");
        return ServiceProfile;
    }(Manifesto.StringValue));
    Manifesto.ServiceProfile = ServiceProfile;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var ViewingDirection = /** @class */ (function (_super) {
        __extends(ViewingDirection, _super);
        function ViewingDirection() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // todo: use getters when ES3 target is no longer required.
        ViewingDirection.prototype.leftToRight = function () {
            return new ViewingDirection(ViewingDirection.LEFTTORIGHT.toString());
        };
        ViewingDirection.prototype.rightToLeft = function () {
            return new ViewingDirection(ViewingDirection.RIGHTTOLEFT.toString());
        };
        ViewingDirection.prototype.topToBottom = function () {
            return new ViewingDirection(ViewingDirection.TOPTOBOTTOM.toString());
        };
        ViewingDirection.prototype.bottomToTop = function () {
            return new ViewingDirection(ViewingDirection.BOTTOMTOTOP.toString());
        };
        ViewingDirection.LEFTTORIGHT = new ViewingDirection("left-to-right");
        ViewingDirection.RIGHTTOLEFT = new ViewingDirection("right-to-left");
        ViewingDirection.TOPTOBOTTOM = new ViewingDirection("top-to-bottom");
        ViewingDirection.BOTTOMTOTOP = new ViewingDirection("bottom-to-top");
        return ViewingDirection;
    }(Manifesto.StringValue));
    Manifesto.ViewingDirection = ViewingDirection;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var ViewingHint = /** @class */ (function (_super) {
        __extends(ViewingHint, _super);
        function ViewingHint() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // todo: use getters when ES3 target is no longer required.
        ViewingHint.prototype.continuous = function () {
            return new ViewingHint(ViewingHint.CONTINUOUS.toString());
        };
        ViewingHint.prototype.empty = function () {
            return new ViewingHint(ViewingHint.EMPTY.toString());
        };
        ViewingHint.prototype.individuals = function () {
            return new ViewingHint(ViewingHint.INDIVIDUALS.toString());
        };
        ViewingHint.prototype.nonPaged = function () {
            return new ViewingHint(ViewingHint.NONPAGED.toString());
        };
        ViewingHint.prototype.paged = function () {
            return new ViewingHint(ViewingHint.PAGED.toString());
        };
        ViewingHint.prototype.top = function () {
            return new ViewingHint(ViewingHint.TOP.toString());
        };
        ViewingHint.CONTINUOUS = new ViewingHint("continuous");
        ViewingHint.EMPTY = new ViewingHint("");
        ViewingHint.INDIVIDUALS = new ViewingHint("individuals");
        ViewingHint.NONPAGED = new ViewingHint("non-paged");
        ViewingHint.PAGED = new ViewingHint("paged");
        ViewingHint.TOP = new ViewingHint("top");
        return ViewingHint;
    }(Manifesto.StringValue));
    Manifesto.ViewingHint = ViewingHint;
})(Manifesto || (Manifesto = {}));

var Manifesto;
(function (Manifesto) {
    var JSONLDResource = /** @class */ (function () {
        function JSONLDResource(jsonld) {
            this.__jsonld = jsonld;
            this.context = this.getProperty('context');
            this.id = this.getProperty('id');
        }
        JSONLDResource.prototype.getProperty = function (name) {
            var prop = null;
            if (this.__jsonld) {
                prop = this.__jsonld[name];
                if (!prop) {
                    // property may have a prepended '@'
                    prop = this.__jsonld['@' + name];
                }
            }
            return prop;
        };
        return JSONLDResource;
    }());
    Manifesto.JSONLDResource = JSONLDResource;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var ManifestResource = /** @class */ (function (_super) {
        __extends(ManifestResource, _super);
        function ManifestResource(jsonld, options) {
            var _this = _super.call(this, jsonld) || this;
            _this.options = options;
            return _this;
        }
        ManifestResource.prototype.getIIIFResourceType = function () {
            return new Manifesto.IIIFResourceType(Manifesto.Utils.normaliseType(this.getProperty('type')));
        };
        ManifestResource.prototype.getLabel = function () {
            return Manifesto.TranslationCollection.parse(this.getProperty('label'), this.options.locale);
        };
        ManifestResource.prototype.getMetadata = function () {
            var _metadata = this.getProperty('metadata');
            var metadata = [];
            if (!_metadata)
                return metadata;
            for (var i = 0; i < _metadata.length; i++) {
                var item = _metadata[i];
                var metadataItem = new Manifesto.MetadataItem(this.options.locale);
                metadataItem.parse(item);
                metadata.push(metadataItem);
            }
            return metadata;
        };
        ManifestResource.prototype.getRendering = function (format) {
            var renderings = this.getRenderings();
            // normalise format to string
            if (typeof (format) !== 'string') {
                format = format.toString();
            }
            for (var i = 0; i < renderings.length; i++) {
                var rendering = renderings[i];
                if (rendering.getFormat().toString() === format) {
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
                renderings.push(new Manifesto.Rendering(r, this.options));
            }
            return renderings;
        };
        ManifestResource.prototype.getService = function (profile) {
            return Manifesto.Utils.getService(this, profile);
        };
        ManifestResource.prototype.getServices = function () {
            return Manifesto.Utils.getServices(this);
        };
        ManifestResource.prototype.getThumbnail = function () {
            var thumbnail = this.getProperty('thumbnail');
            if (Array.isArray(thumbnail)) {
                thumbnail = thumbnail[0];
            }
            if (thumbnail) {
                return new Manifesto.Thumbnail(thumbnail, this.options);
            }
            return null;
        };
        ManifestResource.prototype.isAnnotation = function () {
            return this.getIIIFResourceType().toString() === Manifesto.IIIFResourceType.ANNOTATION.toString();
        };
        ManifestResource.prototype.isCanvas = function () {
            return this.getIIIFResourceType().toString() === Manifesto.IIIFResourceType.CANVAS.toString();
        };
        ManifestResource.prototype.isCollection = function () {
            return this.getIIIFResourceType().toString() === Manifesto.IIIFResourceType.COLLECTION.toString();
        };
        ManifestResource.prototype.isManifest = function () {
            return this.getIIIFResourceType().toString() === Manifesto.IIIFResourceType.MANIFEST.toString();
        };
        ManifestResource.prototype.isRange = function () {
            return this.getIIIFResourceType().toString() === Manifesto.IIIFResourceType.RANGE.toString();
        };
        ManifestResource.prototype.isSequence = function () {
            return this.getIIIFResourceType().toString() === Manifesto.IIIFResourceType.SEQUENCE.toString();
        };
        return ManifestResource;
    }(Manifesto.JSONLDResource));
    Manifesto.ManifestResource = ManifestResource;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var Resource = /** @class */ (function (_super) {
        __extends(Resource, _super);
        function Resource(jsonld, options) {
            return _super.call(this, jsonld, options) || this;
        }
        Resource.prototype.getFormat = function () {
            var format = this.getProperty('format');
            if (format) {
                return new Manifesto.MediaType(format.toLowerCase());
            }
            return null;
        };
        Resource.prototype.getResources = function () {
            var resources = [];
            if (!this.__jsonld.resources)
                return resources;
            for (var i = 0; i < this.__jsonld.resources.length; i++) {
                var a = this.__jsonld.resources[i];
                var annotation = new Manifesto.Annotation(a, this.options);
                resources.push(annotation);
            }
            return resources;
        };
        Resource.prototype.getType = function () {
            var type = this.getProperty('type');
            if (type) {
                return new Manifesto.ResourceType(Manifesto.Utils.normaliseType(type));
            }
            return null;
        };
        Resource.prototype.getWidth = function () {
            return this.getProperty('width');
        };
        Resource.prototype.getHeight = function () {
            return this.getProperty('height');
        };
        Resource.prototype.getMaxWidth = function () {
            return this.getProperty('maxWidth');
        };
        Resource.prototype.getMaxHeight = function () {
            var maxHeight = this.getProperty('maxHeight');
            // if a maxHeight hasn't been specified, default to maxWidth.
            // maxWidth in essence becomes maxEdge
            if (!maxHeight) {
                return this.getMaxWidth();
            }
            return null;
        };
        return Resource;
    }(Manifesto.ManifestResource));
    Manifesto.Resource = Resource;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var Canvas = /** @class */ (function (_super) {
        __extends(Canvas, _super);
        function Canvas(jsonld, options) {
            return _super.call(this, jsonld, options) || this;
        }
        // http://iiif.io/api/image/2.1/#canonical-uri-syntax
        Canvas.prototype.getCanonicalImageUri = function (w) {
            var id = null;
            var region = 'full';
            var rotation = 0;
            var quality = 'default';
            var width = w;
            var size;
            // if an info.json has been loaded
            if (this.externalResource && this.externalResource.data && this.externalResource.data['@id']) {
                id = this.externalResource.data['@id'];
                if (!width) {
                    width = this.externalResource.data.width;
                }
                if (this.externalResource.data['@context']) {
                    if (this.externalResource.data['@context'].indexOf('/1.0/context.json') > -1 ||
                        this.externalResource.data['@context'].indexOf('/1.1/context.json') > -1 ||
                        this.externalResource.data['@context'].indexOf('/1/context.json') > -1) {
                        quality = 'native';
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
                        quality = Manifesto.Utils.getImageQuality(service.getProfile());
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
                    var thumbnail = this.getProperty('thumbnail');
                    if (thumbnail) {
                        if (typeof (thumbnail) === 'string') {
                            return thumbnail;
                        }
                        else {
                            if (thumbnail['@id']) {
                                return thumbnail['@id'];
                            }
                            else if (thumbnail.length) {
                                return thumbnail[0].id;
                            }
                        }
                    }
                }
            }
            size = width + ',';
            // trim off trailing '/'
            if (id && id.endsWith('/')) {
                id = id.substr(0, id.length - 1);
            }
            var uri = [id, region, size, rotation, quality + '.jpg'].join('/');
            return uri;
        };
        Canvas.prototype.getMaxDimensions = function () {
            var maxDimensions = null;
            var profile;
            if (this.externalResource.data && this.externalResource.data.profile) {
                profile = this.externalResource.data.profile;
                if (Array.isArray(profile)) {
                    profile = profile.en().where(function (p) { return p["maxWidth" || "maxwidth"]; }).first();
                    if (profile) {
                        maxDimensions = new Manifesto.Size(profile.maxWidth, profile.maxHeight ? profile.maxHeight : profile.maxWidth);
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
                annotationPage = new Manifesto.AnnotationPage(items[0], this.options);
            }
            if (!annotationPage) {
                return content;
            }
            var annotations = annotationPage.getItems();
            for (var i = 0; i < annotations.length; i++) {
                var a = annotations[i];
                var annotation = new Manifesto.Annotation(a, this.options);
                content.push(annotation);
            }
            return content;
        };
        Canvas.prototype.getDuration = function () {
            return this.getProperty('duration');
        };
        Canvas.prototype.getImages = function () {
            var images = [];
            if (!this.__jsonld.images)
                return images;
            for (var i = 0; i < this.__jsonld.images.length; i++) {
                var a = this.__jsonld.images[i];
                var annotation = new Manifesto.Annotation(a, this.options);
                images.push(annotation);
            }
            return images;
        };
        Canvas.prototype.getIndex = function () {
            return this.getProperty('index');
        };
        Canvas.prototype.getOtherContent = function () {
            var _this = this;
            var otherContent = Array.isArray(this.getProperty('otherContent')) ?
                this.getProperty('otherContent') :
                [this.getProperty('otherContent')];
            var canonicalComparison = function (typeA, typeB) {
                if (typeof typeA !== 'string' || typeof typeB !== 'string') {
                    return false;
                }
                return typeA.toLowerCase() === typeA.toLowerCase();
            };
            var otherPromises = otherContent
                .filter(function (otherContent) { return otherContent && canonicalComparison(otherContent['@type'], 'sc:AnnotationList'); })
                .map(function (annotationList, i) { return ((new Manifesto.AnnotationList(annotationList['label'] || "Annotation list " + i, annotationList, _this.options))); })
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
            return this.getProperty('width');
        };
        Canvas.prototype.getHeight = function () {
            return this.getProperty('height');
        };
        return Canvas;
    }(Manifesto.Resource));
    Manifesto.Canvas = Canvas;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var IIIFResource = /** @class */ (function (_super) {
        __extends(IIIFResource, _super);
        function IIIFResource(jsonld, options) {
            var _this = _super.call(this, jsonld, options) || this;
            _this.index = -1;
            _this.isLoaded = false;
            var defaultOptions = {
                defaultLabel: '-',
                locale: 'en-GB',
                resource: _this,
                pessimisticAccessControl: false
            };
            _this.options = Object.assign(defaultOptions, options);
            return _this;
        }
        IIIFResource.prototype.getAttribution = function () {
            var attribution = this.getProperty('attribution');
            if (attribution) {
                return Manifesto.TranslationCollection.parse(attribution, this.options.locale);
            }
            return [];
        };
        IIIFResource.prototype.getDescription = function () {
            var description = this.getProperty('description');
            if (description) {
                return Manifesto.TranslationCollection.parse(description, this.options.locale);
            }
            return [];
        };
        IIIFResource.prototype.getIIIFResourceType = function () {
            return new Manifesto.IIIFResourceType(Manifesto.Utils.normaliseType(this.getProperty('type')));
        };
        IIIFResource.prototype.getLogo = function () {
            var logo = this.getProperty('logo');
            if (!logo)
                return null;
            if (typeof (logo) === 'string')
                return logo;
            if (Array.isArray(logo) && logo.length) {
                logo = logo[0];
            }
            return logo['@id'] || logo.id;
        };
        IIIFResource.prototype.getLicense = function () {
            return Manifesto.Utils.getLocalisedValue(this.getProperty('license'), this.options.locale);
        };
        IIIFResource.prototype.getNavDate = function () {
            return new Date(this.getProperty('navDate'));
        };
        IIIFResource.prototype.getRelated = function () {
            return this.getProperty('related');
        };
        IIIFResource.prototype.getSeeAlso = function () {
            return this.getProperty('seeAlso');
        };
        IIIFResource.prototype.getLabel = function () {
            var label = this.getProperty('label');
            if (label) {
                return Manifesto.TranslationCollection.parse(label, this.options.locale);
            }
            return [];
        };
        IIIFResource.prototype.getDefaultLabel = function () {
            return Manifesto.TranslationCollection.getValue(this.getLabel());
        };
        IIIFResource.prototype.getDefaultTree = function () {
            this.defaultTree = new Manifesto.TreeNode('root');
            this.defaultTree.data = this;
            return this.defaultTree;
        };
        IIIFResource.prototype.isCollection = function () {
            if (this.getIIIFResourceType().toString() === Manifesto.IIIFResourceType.COLLECTION.toString()) {
                return true;
            }
            return false;
        };
        IIIFResource.prototype.isManifest = function () {
            if (this.getIIIFResourceType().toString() === Manifesto.IIIFResourceType.MANIFEST.toString()) {
                return true;
            }
            return false;
        };
        IIIFResource.prototype.load = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                if (that.isLoaded) {
                    resolve(that);
                }
                else {
                    var options_1 = that.options;
                    options_1.navDate = that.getNavDate();
                    var id = that.__jsonld.id;
                    if (!id) {
                        id = that.__jsonld['@id'];
                    }
                    Manifesto.Utils.loadResource(id).then(function (data) {
                        that.parentLabel = Manifesto.TranslationCollection.getValue(that.getLabel(), options_1.locale);
                        var parsed = Manifesto.Deserialiser.parse(data, options_1);
                        that = Object.assign(that, parsed);
                        that.index = options_1.index;
                        resolve(that);
                    });
                }
            });
        };
        return IIIFResource;
    }(Manifesto.ManifestResource));
    Manifesto.IIIFResource = IIIFResource;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var Manifest = /** @class */ (function (_super) {
        __extends(Manifest, _super);
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
        Manifest.prototype.getPosterCanvas = function () {
            var posterCanvas = this.getProperty('posterCanvas');
            if (posterCanvas) {
                posterCanvas = new Manifesto.Canvas(posterCanvas, this.options);
            }
            return posterCanvas;
        };
        Manifest.prototype.getBehavior = function () {
            var behavior = this.getProperty('behavior');
            if (Array.isArray(behavior)) {
                behavior = behavior[0];
            }
            if (behavior) {
                return new Manifesto.Behavior(behavior);
            }
            return null;
        };
        Manifest.prototype.getDefaultTree = function () {
            _super.prototype.getDefaultTree.call(this);
            this.defaultTree.data.type = Manifesto.Utils.normaliseType(Manifesto.TreeNodeType.MANIFEST.toString());
            if (!this.isLoaded) {
                return this.defaultTree;
            }
            var topRanges = this.getTopRanges();
            // if there are any ranges in the manifest, default to the first 'top' range or generated placeholder
            if (topRanges.length) {
                topRanges[0].getTree(this.defaultTree);
            }
            Manifesto.Utils.generateTreeNodeIds(this.defaultTree);
            return this.defaultTree;
        };
        Manifest.prototype._getTopRanges = function () {
            var topRanges = [];
            if (this.__jsonld.structures && this.__jsonld.structures.length) {
                for (var i = 0; i < this.__jsonld.structures.length; i++) {
                    var json = this.__jsonld.structures[i];
                    if (json.viewingHint === Manifesto.ViewingHint.TOP.toString()) {
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
                    if (r['@id'] === id || r.id === id) {
                        return r;
                    }
                }
            }
            return null;
        };
        //private _parseRangeCanvas(json: any, range: IRange): void {
        // todo: currently this isn't needed
        //var canvas: IJSONLDResource = new JSONLDResource(json);
        //range.items.push(<IManifestResource>canvas);
        //}
        Manifest.prototype._parseRanges = function (r, path, parentRange) {
            var range;
            var id = null;
            if (typeof (r) === 'string') {
                id = r;
                r = this._getRangeById(id);
            }
            if (!r) {
                console.warn("Range:", id, "does not exist");
                return;
            }
            range = new Manifesto.Range(r, this.options);
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
                    if (item['@type'] && item['@type'].toLowerCase() === 'sc:range' || item['type'] && item['type'].toLowerCase() === 'range') {
                        this._parseRanges(item, path + '/' + i, range);
                    }
                    else if (item['@type'] && item['@type'].toLowerCase() === 'sc:canvas' || item['type'] && item['type'].toLowerCase() === 'canvas') {
                        // store the ids on the __jsonld object to be used by Range.getCanvasIds()
                        if (!range.canvases) {
                            range.canvases = [];
                        }
                        var id_1 = item.id || item['@id'];
                        range.canvases.push(id_1);
                    }
                }
            }
            else if (r.ranges) {
                for (var i = 0; i < r.ranges.length; i++) {
                    this._parseRanges(r.ranges[i], path + '/' + i, range);
                }
            }
        };
        Manifest.prototype.getAllRanges = function () {
            if (this._allRanges != null)
                return this._allRanges;
            this._allRanges = [];
            var topRanges = this.getTopRanges();
            for (var i = 0; i < topRanges.length; i++) {
                var topRange = topRanges[i];
                if (topRange.id) {
                    this._allRanges.push(topRange); // it might be a placeholder root range
                }
                var subRanges = topRange.getRanges();
                this._allRanges = this._allRanges.concat(subRanges.en().traverseUnique(function (range) { return range.getRanges(); }).toArray());
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
                    var sequence = new Manifesto.Sequence(s, this.options);
                    this.items.push(sequence);
                }
            }
            else if (this.__jsonld.items) {
                var sequence = new Manifesto.Sequence(this.__jsonld.items, this.options);
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
            var service = this.getService(Manifesto.ServiceProfile.UIEXTENSIONS);
            if (service) {
                return new Manifesto.ManifestType(service.getProperty('manifestType'));
            }
            return new Manifesto.ManifestType('');
        };
        Manifest.prototype.getTrackingLabel = function () {
            var service = this.getService(Manifesto.ServiceProfile.TRACKINGEXTENSIONS);
            if (service) {
                return service.getProperty('trackingLabel');
            }
            return '';
        };
        Manifest.prototype.isMultiSequence = function () {
            return this.getTotalSequences() > 1;
        };
        Manifest.prototype.isPagingEnabled = function () {
            var viewingHint = this.getViewingHint();
            if (viewingHint) {
                return viewingHint.toString() === Manifesto.ViewingHint.PAGED.toString();
            }
            return false;
        };
        Manifest.prototype.getViewingDirection = function () {
            if (this.getProperty('viewingDirection')) {
                return new Manifesto.ViewingDirection(this.getProperty('viewingDirection'));
            }
            return null;
        };
        Manifest.prototype.getViewingHint = function () {
            if (this.getProperty('viewingHint')) {
                return new Manifesto.ViewingHint(this.getProperty('viewingHint'));
            }
            return null;
        };
        return Manifest;
    }(Manifesto.IIIFResource));
    Manifesto.Manifest = Manifest;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var Collection = /** @class */ (function (_super) {
        __extends(Collection, _super);
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
            return this._collections = this.items.en().where(function (m) { return m.isCollection(); }).toArray();
        };
        Collection.prototype.getManifests = function () {
            if (this._manifests) {
                return this._manifests;
            }
            return this._manifests = this.items.en().where(function (m) { return m.isManifest(); }).toArray();
        };
        Collection.prototype.getCollectionByIndex = function (collectionIndex) {
            var collections = this.getCollections();
            if (!collections[collectionIndex]) {
                throw new Error("Collection index is outside range of array");
            }
            var collection = collections[collectionIndex];
            collection.options.index = collectionIndex;
            // id for collection MUST be dereferenceable
            return collection.load();
        };
        Collection.prototype.getManifestByIndex = function (manifestIndex) {
            var manifests = this.getManifests();
            if (!manifests[manifestIndex]) {
                throw new Error("Manifest index is outside range of array");
            }
            var manifest = manifests[manifestIndex];
            manifest.options.index = manifestIndex;
            return manifest.load();
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
            if (this.getProperty('viewingDirection')) {
                return new Manifesto.ViewingDirection(this.getProperty('viewingDirection'));
            }
            return Manifesto.ViewingDirection.LEFTTORIGHT;
        };
        /**
         * Get a tree of sub collections and manifests, using each child manifest's first 'top' range.
         */
        Collection.prototype.getDefaultTree = function () {
            _super.prototype.getDefaultTree.call(this);
            this.defaultTree.data.type = Manifesto.Utils.normaliseType(Manifesto.TreeNodeType.COLLECTION.toString());
            this._parseManifests(this);
            this._parseCollections(this);
            Manifesto.Utils.generateTreeNodeIds(this.defaultTree);
            return this.defaultTree;
        };
        Collection.prototype._parseManifests = function (parentCollection) {
            if (parentCollection.getManifests() && parentCollection.getManifests().length) {
                for (var i = 0; i < parentCollection.getManifests().length; i++) {
                    var manifest = parentCollection.getManifests()[i];
                    var tree = manifest.getDefaultTree();
                    tree.label = manifest.parentLabel || Manifesto.TranslationCollection.getValue(manifest.getLabel(), this.options.locale) || 'manifest ' + (i + 1);
                    tree.navDate = manifest.getNavDate();
                    tree.data.id = manifest.id;
                    tree.data.type = Manifesto.Utils.normaliseType(Manifesto.TreeNodeType.MANIFEST.toString());
                    parentCollection.defaultTree.addNode(tree);
                }
            }
        };
        Collection.prototype._parseCollections = function (parentCollection) {
            if (parentCollection.getCollections() && parentCollection.getCollections().length) {
                for (var i = 0; i < parentCollection.getCollections().length; i++) {
                    var collection = parentCollection.getCollections()[i];
                    var tree = collection.getDefaultTree();
                    tree.label = collection.parentLabel || Manifesto.TranslationCollection.getValue(collection.getLabel(), this.options.locale) || 'collection ' + (i + 1);
                    tree.navDate = collection.getNavDate();
                    tree.data.id = collection.id;
                    tree.data.type = Manifesto.Utils.normaliseType(Manifesto.TreeNodeType.COLLECTION.toString());
                    parentCollection.defaultTree.addNode(tree);
                    this._parseCollections(collection);
                }
            }
        };
        return Collection;
    }(Manifesto.IIIFResource));
    Manifesto.Collection = Collection;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var Range = /** @class */ (function (_super) {
        __extends(Range, _super);
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
            var start;
            var end;
            if (this.canvases && this.canvases.length) {
                for (var i = 0; i < this.canvases.length; i++) {
                    var canvas = this.canvases[i];
                    var temporal = Manifesto.Utils.getTemporalComponent(canvas);
                    if (temporal && temporal.length > 1) {
                        if (i === 0) {
                            start = Number(temporal[0]);
                        }
                        if (i === this.canvases.length - 1) {
                            end = Number(temporal[1]);
                        }
                    }
                }
            }
            else {
                // get child ranges and calculate the start and end based on them
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
                return new Manifesto.Duration(start, end);
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
            return this._ranges = this.items.en().where(function (m) { return m.isRange(); }).toArray();
        };
        Range.prototype.getBehavior = function () {
            var behavior = this.getProperty('behavior');
            if (Array.isArray(behavior)) {
                behavior = behavior[0];
            }
            if (behavior) {
                return new Manifesto.Behavior(behavior);
            }
            return null;
        };
        Range.prototype.getViewingDirection = function () {
            if (this.getProperty('viewingDirection')) {
                return new Manifesto.ViewingDirection(this.getProperty('viewingDirection'));
            }
            return null;
        };
        Range.prototype.getViewingHint = function () {
            if (this.getProperty('viewingHint')) {
                return new Manifesto.ViewingHint(this.getProperty('viewingHint'));
            }
            return null;
        };
        Range.prototype.getTree = function (treeRoot) {
            treeRoot.data = this;
            this.treeNode = treeRoot;
            var ranges = this.getRanges();
            if (ranges && ranges.length) {
                for (var i = 0; i < ranges.length; i++) {
                    var range = ranges[i];
                    var node = new Manifesto.TreeNode();
                    treeRoot.addNode(node);
                    this._parseTreeNode(node, range);
                }
            }
            Manifesto.Utils.generateTreeNodeIds(treeRoot);
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
            node.label = Manifesto.TranslationCollection.getValue(range.getLabel(), this.options.locale);
            node.data = range;
            node.data.type = Manifesto.Utils.normaliseType(Manifesto.TreeNodeType.RANGE.toString());
            range.treeNode = node;
            var ranges = range.getRanges();
            if (ranges && ranges.length) {
                for (var i = 0; i < ranges.length; i++) {
                    var childRange = ranges[i];
                    var behavior = childRange.getBehavior();
                    if (behavior && behavior.toString() === Manifesto.Behavior.NONAV.toString()) {
                        continue;
                    }
                    else {
                        var childNode = new Manifesto.TreeNode();
                        node.addNode(childNode);
                        this._parseTreeNode(childNode, childRange);
                    }
                }
            }
        };
        return Range;
    }(Manifesto.ManifestResource));
    Manifesto.Range = Range;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var Rendering = /** @class */ (function (_super) {
        __extends(Rendering, _super);
        function Rendering(jsonld, options) {
            return _super.call(this, jsonld, options) || this;
        }
        Rendering.prototype.getFormat = function () {
            return new Manifesto.RenderingFormat(this.getProperty('format'));
        };
        return Rendering;
    }(Manifesto.ManifestResource));
    Manifesto.Rendering = Rendering;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var Sequence = /** @class */ (function (_super) {
        __extends(Sequence, _super);
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
                    var canvas = new Manifesto.Canvas(c, this.options);
                    canvas.index = i;
                    this.items.push(canvas);
                }
            }
            else if (this.__jsonld) {
                for (var i = 0; i < this.__jsonld.length; i++) {
                    var c = this.__jsonld[i];
                    var canvas = new Manifesto.Canvas(c, this.options);
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
                var canvasId = Manifesto.Utils.normaliseUrl(canvas.id);
                if (Manifesto.Utils.normaliseUrl(id) === canvasId) {
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
                label = parseInt(label, 10).toString(); // trim any preceding zeros.
                if (foliated)
                    label += 'r'; // default to recto
            }
            var doublePageRegExp = /(\d*)\D+(\d*)/;
            var match, regExp, regStr, labelPart1, labelPart2;
            for (var i = 0; i < this.getTotalCanvases(); i++) {
                var canvas = this.getCanvasByIndex(i);
                // check if there's a literal match
                if (Manifesto.TranslationCollection.getValue(canvas.getLabel(), this.options.locale) === label) {
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
                var label = Manifesto.TranslationCollection.getValue(canvas.getLabel(), this.options.locale);
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
                if (viewingDirection && viewingDirection.toString() === Manifesto.ViewingDirection.RIGHTTOLEFT.toString()) {
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
                if (viewingDirection && viewingDirection.toString() === Manifesto.ViewingDirection.RIGHTTOLEFT.toString()) {
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
                if (viewingDirection && viewingDirection.toString() === Manifesto.ViewingDirection.RIGHTTOLEFT.toString()) {
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
            console.warn('getThumbs will be deprecated, use getThumbnails instead');
            var thumbs = [];
            var totalCanvases = this.getTotalCanvases();
            for (var i = 0; i < totalCanvases; i++) {
                var canvas = this.getCanvasByIndex(i);
                var thumb = new Manifesto.Thumb(width, canvas);
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
            return this.getProperty('startCanvas');
        };
        Sequence.prototype.getTotalCanvases = function () {
            return this.getCanvases().length;
        };
        Sequence.prototype.getViewingDirection = function () {
            if (this.getProperty('viewingDirection')) {
                return new Manifesto.ViewingDirection(this.getProperty('viewingDirection'));
            }
            else if (this.options.resource.getViewingDirection) {
                return this.options.resource.getViewingDirection();
            }
            return null;
        };
        Sequence.prototype.getViewingHint = function () {
            if (this.getProperty('viewingHint')) {
                return new Manifesto.ViewingHint(this.getProperty('viewingHint'));
            }
            return null;
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
                return viewingHint.toString() === Manifesto.ViewingHint.PAGED.toString();
            }
            return false;
        };
        // checks if the number of canvases is even - therefore has a front and back cover
        Sequence.prototype.isTotalCanvasesEven = function () {
            return this.getTotalCanvases() % 2 === 0;
        };
        return Sequence;
    }(Manifesto.ManifestResource));
    Manifesto.Sequence = Sequence;
})(Manifesto || (Manifesto = {}));

var Manifesto;
(function (Manifesto) {
    var Deserialiser = /** @class */ (function () {
        function Deserialiser() {
        }
        Deserialiser.parse = function (manifest, options) {
            if (typeof manifest === 'string') {
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
            if (json['@type']) {
                switch (json['@type']) {
                    case 'sc:Collection':
                        resource = this.parseCollection(json, options);
                        break;
                    case 'sc:Manifest':
                        resource = this.parseManifest(json, options);
                        break;
                    default:
                        return null;
                }
            }
            else {
                // presentation 3
                switch (json['type']) {
                    case 'Collection':
                        resource = this.parseCollection(json, options);
                        break;
                    case 'Manifest':
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
            var collection = new Manifesto.Collection(json, options);
            if (options) {
                collection.index = options.index || 0;
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
                items = collection.__jsonld.items.en().where(function (m) { return m.type.toLowerCase() === 'collection'; }).toArray();
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
            var manifest = new Manifesto.Manifest(json, options);
            return manifest;
        };
        Deserialiser.parseManifests = function (collection, options) {
            var items;
            if (collection.__jsonld.manifests) {
                items = collection.__jsonld.manifests;
            }
            else if (collection.__jsonld.items) {
                items = collection.__jsonld.items.en().where(function (m) { return m.type.toLowerCase() === 'manifest'; }).toArray();
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
            if (json['@type']) {
                if (json['@type'].toLowerCase() === 'sc:manifest') {
                    return this.parseManifest(json, options);
                }
                else if (json['@type'].toLowerCase() === 'sc:collection') {
                    return this.parseCollection(json, options);
                }
            }
            else if (json.type) {
                if (json.type.toLowerCase() === 'manifest') {
                    return this.parseManifest(json, options);
                }
                else if (json.type.toLowerCase() === 'collection') {
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
                    if (collection.items.en().where(function (m) { return m.id === item.id; }).first()) {
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
    Manifesto.Deserialiser = Deserialiser;
    var Serialiser = /** @class */ (function () {
        function Serialiser() {
        }
        Serialiser.serialise = function (manifest) {
            // todo
            return "";
        };
        return Serialiser;
    }());
    Manifesto.Serialiser = Serialiser;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var Service = /** @class */ (function (_super) {
        __extends(Service, _super);
        function Service(jsonld, options) {
            return _super.call(this, jsonld, options) || this;
        }
        Service.prototype.getProfile = function () {
            var profile = this.getProperty('profile');
            if (!profile) {
                profile = this.getProperty('dcterms:conformsTo');
            }
            if (Array.isArray(profile)) {
                return new Manifesto.ServiceProfile(profile[0]);
            }
            return new Manifesto.ServiceProfile(profile);
        };
        Service.prototype.getConfirmLabel = function () {
            return Manifesto.Utils.getLocalisedValue(this.getProperty('confirmLabel'), this.options.locale);
        };
        Service.prototype.getDescription = function () {
            return Manifesto.Utils.getLocalisedValue(this.getProperty('description'), this.options.locale);
        };
        Service.prototype.getFailureDescription = function () {
            return Manifesto.Utils.getLocalisedValue(this.getProperty('failureDescription'), this.options.locale);
        };
        Service.prototype.getFailureHeader = function () {
            return Manifesto.Utils.getLocalisedValue(this.getProperty('failureHeader'), this.options.locale);
        };
        Service.prototype.getHeader = function () {
            return Manifesto.Utils.getLocalisedValue(this.getProperty('header'), this.options.locale);
        };
        Service.prototype.getServiceLabel = function () {
            return Manifesto.Utils.getLocalisedValue(this.getProperty('label'), this.options.locale);
        };
        Service.prototype.getInfoUri = function () {
            var infoUri = this.id;
            if (!infoUri.endsWith('/')) {
                infoUri += '/';
            }
            infoUri += 'info.json';
            return infoUri;
        };
        return Service;
    }(Manifesto.ManifestResource));
    Manifesto.Service = Service;
})(Manifesto || (Manifesto = {}));


var Manifesto;
(function (Manifesto) {
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
            this.label = Manifesto.TranslationCollection.getValue(canvas.getLabel()); // todo: pass locale?
        }
        return Thumb;
    }());
    Manifesto.Thumb = Thumb;
})(Manifesto || (Manifesto = {}));


var Manifesto;
(function (Manifesto) {
    var TreeNode = /** @class */ (function () {
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
            return this.data.type === Manifesto.Utils.normaliseType(Manifesto.TreeNodeType.COLLECTION.toString());
        };
        TreeNode.prototype.isManifest = function () {
            return this.data.type === Manifesto.Utils.normaliseType(Manifesto.TreeNodeType.MANIFEST.toString());
        };
        TreeNode.prototype.isRange = function () {
            return this.data.type === Manifesto.Utils.normaliseType(Manifesto.TreeNodeType.RANGE.toString());
        };
        return TreeNode;
    }());
    Manifesto.TreeNode = TreeNode;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var TreeNodeType = /** @class */ (function (_super) {
        __extends(TreeNodeType, _super);
        function TreeNodeType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // todo: use getters when ES3 target is no longer required.
        TreeNodeType.prototype.collection = function () {
            return new TreeNodeType(TreeNodeType.COLLECTION.toString());
        };
        TreeNodeType.prototype.manifest = function () {
            return new TreeNodeType(TreeNodeType.MANIFEST.toString());
        };
        TreeNodeType.prototype.range = function () {
            return new TreeNodeType(TreeNodeType.RANGE.toString());
        };
        TreeNodeType.COLLECTION = new TreeNodeType("collection");
        TreeNodeType.MANIFEST = new TreeNodeType("manifest");
        TreeNodeType.RANGE = new TreeNodeType("range");
        return TreeNodeType;
    }(Manifesto.StringValue));
    Manifesto.TreeNodeType = TreeNodeType;
})(Manifesto || (Manifesto = {}));

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var http = require('http');
var https = require('https');
var url = require('url');
var Manifesto;
(function (Manifesto) {
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.getMediaType = function (type) {
            type = type.toLowerCase();
            type = type.split(';')[0];
            return type.trim();
        };
        Utils.getImageQuality = function (profile) {
            var p = profile.toString();
            if (p === Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE1.toString() ||
                p === Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE2.toString() ||
                p === Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE1.toString() ||
                p === Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE2.toString() ||
                p === Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE1.toString() ||
                p === Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE2.toString() ||
                p === Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE1.toString() ||
                p === Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE2.toString() ||
                p === Manifesto.ServiceProfile.IIIF1IMAGELEVEL1.toString() ||
                p === Manifesto.ServiceProfile.IIIF1IMAGELEVEL1PROFILE.toString() ||
                p === Manifesto.ServiceProfile.IIIF1IMAGELEVEL2.toString() ||
                p === Manifesto.ServiceProfile.IIIF1IMAGELEVEL2PROFILE.toString()) {
                return 'native';
            }
            return 'default';
        };
        Utils.getInexactLocale = function (locale) {
            if (locale.indexOf('-') !== -1) {
                return locale.substr(0, locale.indexOf('-'));
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
                var language_1 = value_1['@language'];
                if (locale === language_1) {
                    return value_1['@value'];
                }
            }
            // test for inexact match
            var match = locale.substr(0, locale.indexOf('-'));
            for (var i = 0; i < resource.length; i++) {
                var value = resource[i];
                var language = value['@language'];
                if (language === match) {
                    return value['@value'];
                }
            }
            return null;
        };
        Utils.generateTreeNodeIds = function (treeNode, index) {
            if (index === void 0) { index = 0; }
            var id;
            if (!treeNode.parentNode) {
                id = '0';
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
            type = type.toLowerCase();
            if (type.indexOf(':') !== -1) {
                var split = type.split(':');
                return split[1];
            }
            return type;
        };
        Utils.normaliseUrl = function (url) {
            url = url.substr(url.indexOf('://'));
            if (url.indexOf('#') !== -1) {
                url = url.split('#')[0];
            }
            return url;
        };
        Utils.normalisedUrlsMatch = function (url1, url2) {
            return Utils.normaliseUrl(url1) === Utils.normaliseUrl(url2);
        };
        Utils.isImageProfile = function (profile) {
            if (Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE0.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE1.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE2.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE0.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE0.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE0.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE2.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE0.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE1.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE2.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE1.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE2.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF1IMAGELEVEL0.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF1IMAGELEVEL0PROFILE.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF1IMAGELEVEL1.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF1IMAGELEVEL1PROFILE.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF1IMAGELEVEL2.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF1IMAGELEVEL2PROFILE.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF2IMAGELEVEL0.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF2IMAGELEVEL0PROFILE.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF2IMAGELEVEL1.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF2IMAGELEVEL1PROFILE.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF2IMAGELEVEL2.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF2IMAGELEVEL2PROFILE.toString())) {
                return true;
            }
            return false;
        };
        Utils.isLevel0ImageProfile = function (profile) {
            if (Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE0.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE0.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE0.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE0.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF1IMAGELEVEL0.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF1IMAGELEVEL0PROFILE.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF2IMAGELEVEL0.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF2IMAGELEVEL0PROFILE.toString())) {
                return true;
            }
            return false;
        };
        Utils.isLevel1ImageProfile = function (profile) {
            if (Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE1.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE1.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE1.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE1.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF1IMAGELEVEL1.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF1IMAGELEVEL1PROFILE.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF2IMAGELEVEL1.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF2IMAGELEVEL1PROFILE.toString())) {
                return true;
            }
            return false;
        };
        Utils.isLevel2ImageProfile = function (profile) {
            if (Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE2.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE2.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE2.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE2.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF1IMAGELEVEL2.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF1IMAGELEVEL2PROFILE.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF2IMAGELEVEL2.toString()) ||
                Utils.normalisedUrlsMatch(profile.toString(), Manifesto.ServiceProfile.IIIF2IMAGELEVEL2PROFILE.toString())) {
                return true;
            }
            return false;
        };
        Utils.loadResource = function (uri) {
            return new Promise(function (resolve, reject) {
                var u = url.parse(uri);
                var req;
                var opts = {
                    host: u.hostname,
                    port: u.port,
                    path: u.path,
                    method: "GET",
                    withCredentials: false
                };
                switch (u.protocol) {
                    case 'https:':
                        req = https.request(opts, function (response) {
                            var result = "";
                            response.on('data', function (chunk) {
                                result += chunk;
                            });
                            response.on('end', function () {
                                resolve(result);
                            });
                        });
                        req.on('error', function (error) {
                            reject(error);
                        });
                        req.end();
                        break;
                    case 'dat:':
                        var xhr_1 = new XMLHttpRequest();
                        xhr_1.onreadystatechange = function () {
                            if (xhr_1.readyState === 4) {
                                resolve(xhr_1.response);
                            }
                        };
                        xhr_1.open("GET", uri, true);
                        xhr_1.send();
                        break;
                    default:
                        req = http.request(opts, function (response) {
                            var result = "";
                            response.on('data', function (chunk) {
                                result += chunk;
                            });
                            response.on('end', function () {
                                resolve(result);
                            });
                        });
                        req.on('error', function (error) {
                            reject(error);
                        });
                        req.end();
                        break;
                }
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
                            if (!(resource.status === HTTPStatusCode.OK)) return [3 /*break*/, 3];
                            return [2 /*return*/, resource];
                        case 3: 
                        // the stored token is no good for this resource
                        return [4 /*yield*/, Utils.doAuthChain(resource, openContentProviderInteraction, openTokenService, userInteractedWithContentProvider, getContentProviderInteraction, handleMovedTemporarily, showOutOfOptionsMessages)];
                        case 4:
                            // the stored token is no good for this resource
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            if (resource.status === HTTPStatusCode.OK || resource.status === HTTPStatusCode.MOVED_TEMPORARILY) {
                                return [2 /*return*/, resource];
                            }
                            throw Utils.createAuthorizationFailedError();
                        case 6: return [4 /*yield*/, resource.getData()];
                        case 7:
                            _a.sent();
                            if (!(resource.status === HTTPStatusCode.MOVED_TEMPORARILY || resource.status === HTTPStatusCode.UNAUTHORIZED)) return [3 /*break*/, 9];
                            return [4 /*yield*/, Utils.doAuthChain(resource, openContentProviderInteraction, openTokenService, userInteractedWithContentProvider, getContentProviderInteraction, handleMovedTemporarily, showOutOfOptionsMessages)];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9:
                            if (resource.status === HTTPStatusCode.OK || resource.status === HTTPStatusCode.MOVED_TEMPORARILY) {
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
                            if (!(!resource.isResponseHandled && resource.status === HTTPStatusCode.MOVED_TEMPORARILY)) return [3 /*break*/, 2];
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
                            tokenService = authService.getService(Manifesto.ServiceProfile.AUTH1TOKEN.toString());
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
                    resource.getData().then(function () {
                        if (resource.isAccessControlled()) {
                            // if the resource has a click through service, use that.
                            if (resource.clickThroughService) {
                                resolve(clickThrough(resource));
                                //} else if(resource.restrictedService) {
                                resolve(restricted(resource));
                            }
                            else {
                                login(resource).then(function () {
                                    getAccessToken(resource, true).then(function (token) {
                                        resource.getData(token).then(function () {
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
                    getStoredAccessToken(resource, tokenStorageStrategy).then(function (storedAccessToken) {
                        if (storedAccessToken) {
                            // try using the stored access token
                            resource.getData(storedAccessToken).then(function () {
                                // if the info.json loaded using the stored access token
                                if (resource.status === HTTPStatusCode.OK) {
                                    resolve(handleResourceResponse(resource));
                                }
                                else {
                                    // otherwise, load the resource data to determine the correct access control services.
                                    // if access controlled, do login.
                                    Utils.authorize(resource, tokenStorageStrategy, clickThrough, restricted, login, getAccessToken, storeAccessToken, getStoredAccessToken).then(function () {
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
                            Utils.authorize(resource, tokenStorageStrategy, clickThrough, restricted, login, getAccessToken, storeAccessToken, getStoredAccessToken).then(function () {
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
            error.name = name;
            return error;
        };
        Utils.createAuthorizationFailedError = function () {
            return Utils.createError(manifesto.StatusCodes.AUTHORIZATION_FAILED.toString(), "Authorization failed");
        };
        Utils.createRestrictedError = function () {
            return Utils.createError(manifesto.StatusCodes.RESTRICTED.toString(), "Restricted");
        };
        Utils.createInternalServerError = function (message) {
            return Utils.createError(manifesto.StatusCodes.INTERNAL_SERVER_ERROR.toString(), message);
        };
        Utils.authorize = function (resource, tokenStorageStrategy, clickThrough, restricted, login, getAccessToken, storeAccessToken, getStoredAccessToken) {
            return new Promise(function (resolve, reject) {
                resource.getData().then(function () {
                    if (resource.isAccessControlled()) {
                        getStoredAccessToken(resource, tokenStorageStrategy).then(function (storedAccessToken) {
                            if (storedAccessToken) {
                                // try using the stored access token
                                resource.getData(storedAccessToken).then(function () {
                                    if (resource.status === HTTPStatusCode.OK) {
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
                                        storeAccessToken(resource, accessToken, tokenStorageStrategy).then(function () {
                                            // try using the fresh access token
                                            resource.getData(accessToken).then(function () {
                                                if (resource.status === HTTPStatusCode.OK) {
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
            if (resource.status === HTTPStatusCode.MOVED_TEMPORARILY && !resource.isResponseHandled) {
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
                    getAccessToken(resource, true).then(function (accessToken) {
                        storeAccessToken(resource, accessToken, tokenStorageStrategy).then(function () {
                            resource.getData(accessToken).then(function () {
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
                    getAccessToken(resource, true).then(function (accessToken) {
                        storeAccessToken(resource, accessToken, tokenStorageStrategy).then(function () {
                            resource.getData(accessToken).then(function () {
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
        ;
        Utils.getService = function (resource, profile) {
            var services = this.getServices(resource);
            // coerce profile to string
            if (typeof (profile) !== 'string') {
                profile = profile.toString();
            }
            for (var i = 0; i < services.length; i++) {
                var service = services[i];
                if (service.getProfile().toString() === profile) {
                    return service;
                }
            }
            return null;
        };
        Utils.getResourceById = function (parentResource, id) {
            return [parentResource.__jsonld].en().traverseUnique(function (x) { return Utils.getAllArrays(x); })
                .first(function (r) { return r['@id'] === id; });
        };
        Utils.getAllArrays = function (obj) {
            var all = [].en();
            if (!obj)
                return all;
            for (var key in obj) {
                var val = obj[key];
                if (Array.isArray(val)) {
                    all = all.concat(val);
                }
            }
            return all;
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
                if (typeof (s) === 'string') {
                    var r = this.getResourceById(resource.options.resource, s);
                    if (r) {
                        services.push(new Manifesto.Service(r.__jsonld || r, resource.options));
                    }
                }
                else {
                    services.push(new Manifesto.Service(s, resource.options));
                }
            }
            return services;
        };
        Utils.getTemporalComponent = function (target) {
            var temporal = /t=([^&]+)/g.exec(target);
            var t = null;
            if (temporal && temporal[1]) {
                t = temporal[1].split(',');
            }
            return t;
        };
        return Utils;
    }());
    Manifesto.Utils = Utils;
})(Manifesto || (Manifesto = {}));

var Manifesto;
(function (Manifesto) {
    var MetadataItem = /** @class */ (function () {
        function MetadataItem(defaultLocale) {
            this.defaultLocale = defaultLocale;
        }
        MetadataItem.prototype.parse = function (resource) {
            this.resource = resource;
            this.label = Manifesto.TranslationCollection.parse(this.resource.label, this.defaultLocale);
            this.value = Manifesto.TranslationCollection.parse(this.resource.value, this.defaultLocale);
        };
        // shortcuts to get/set values based on default locale
        MetadataItem.prototype.getLabel = function () {
            if (this.label) {
                return Manifesto.TranslationCollection.getValue(this.label, this.defaultLocale);
            }
            return null;
        };
        MetadataItem.prototype.setLabel = function (value) {
            var _this = this;
            if (this.label && this.label.length) {
                var t = this.label.en().where(function (x) { return x.locale === _this.defaultLocale || x.locale === Manifesto.Utils.getInexactLocale(_this.defaultLocale); }).first();
                if (t)
                    t.value = value;
            }
        };
        MetadataItem.prototype.getValue = function () {
            if (this.value) {
                var locale = this.defaultLocale;
                // if the label has a locale, prefer that to the default locale
                if (this.label.length && this.label[0].locale) {
                    locale = this.label[0].locale;
                }
                return Manifesto.TranslationCollection.getValue(this.value, locale);
            }
            return null;
        };
        MetadataItem.prototype.setValue = function (value) {
            var _this = this;
            if (this.value && this.value.length) {
                var t = this.value.en().where(function (x) { return x.locale === _this.defaultLocale || x.locale === Manifesto.Utils.getInexactLocale(_this.defaultLocale); }).first();
                if (t)
                    t.value = value;
            }
        };
        return MetadataItem;
    }());
    Manifesto.MetadataItem = MetadataItem;
})(Manifesto || (Manifesto = {}));

var Manifesto;
(function (Manifesto) {
    var Translation = /** @class */ (function () {
        function Translation(value, locale) {
            if (Array.isArray(value)) {
                if (value.length === 1) {
                    this.value = value[0];
                }
                else {
                    // concatenate all of the values
                    this.value = value.join('<br/>');
                }
            }
            else {
                this.value = value;
            }
            this.locale = locale;
        }
        return Translation;
    }());
    Manifesto.Translation = Translation;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var TranslationCollection = /** @class */ (function (_super) {
        __extends(TranslationCollection, _super);
        function TranslationCollection() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TranslationCollection.parse = function (translation, defaultLocale) {
            var tc = [];
            var t;
            if (!translation) {
                return tc;
            }
            else if (Array.isArray(translation)) {
                for (var i = 0; i < translation.length; i++) {
                    var value = translation[i];
                    if (typeof (value) === 'string') {
                        t = new Manifesto.Translation(value, defaultLocale);
                    }
                    else {
                        t = new Manifesto.Translation(value['@value'], value['@language'] || defaultLocale);
                    }
                    tc.push(t);
                }
            }
            else if (typeof (translation) === 'string') {
                // if it's just a single string value, create one translation in the configured locale
                t = new Manifesto.Translation(translation, defaultLocale);
                tc.push(t);
                return tc;
            }
            else {
                // it's an object
                if (translation['@value']) {
                    // presentation 2
                    t = new Manifesto.Translation(translation['@value'], translation['@language'] || defaultLocale);
                    tc.push(t);
                }
                else {
                    // presentation 3
                    Object.keys(translation).forEach(function (key) {
                        // todo: support multiple values in array
                        if (translation[key].length) {
                            t = new Manifesto.Translation(translation[key], key);
                            tc.push(t);
                        }
                        else {
                            throw new Error('Translation must have a value');
                        }
                    });
                }
            }
            return tc;
        };
        TranslationCollection.getValue = function (translationCollection, locale) {
            if (translationCollection.length) {
                if (locale) {
                    var translation = translationCollection.en().where(function (t) { return t.locale === locale || Manifesto.Utils.getInexactLocale(t.locale) === Manifesto.Utils.getInexactLocale(locale); }).first();
                    if (translation) {
                        return translation.value;
                    }
                }
                // return the first valuel
                return translationCollection[0].value;
            }
            return null;
        };
        return TranslationCollection;
    }(Array));
    Manifesto.TranslationCollection = TranslationCollection;
})(Manifesto || (Manifesto = {}));

var Manifesto;
(function (Manifesto) {
    var Size = /** @class */ (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        return Size;
    }());
    Manifesto.Size = Size;
})(Manifesto || (Manifesto = {}));

global.manifesto = global.Manifesto = module.exports = {
    AnnotationMotivation: new Manifesto.AnnotationMotivation(),
    Behavior: new Manifesto.Behavior(),
    IIIFResourceType: new Manifesto.IIIFResourceType(),
    ManifestType: new Manifesto.ManifestType(),
    MediaType: new Manifesto.MediaType(),
    MetadataItem: Manifesto.MetadataItem,
    RenderingFormat: new Manifesto.RenderingFormat(),
    ResourceType: new Manifesto.ResourceType(),
    ServiceProfile: new Manifesto.ServiceProfile(),
    Size: Manifesto.Size,
    Translation: Manifesto.Translation,
    TranslationCollection: Manifesto.TranslationCollection,
    TreeNode: Manifesto.TreeNode,
    TreeNodeType: new Manifesto.TreeNodeType(),
    Utils: Manifesto.Utils,
    ViewingDirection: new Manifesto.ViewingDirection(),
    ViewingHint: new Manifesto.ViewingHint(),
    StatusCodes: {
        AUTHORIZATION_FAILED: 1,
        FORBIDDEN: 2,
        INTERNAL_SERVER_ERROR: 3,
        RESTRICTED: 4
    },
    create: function (manifest, options) {
        return Manifesto.Deserialiser.parse(manifest, options);
    },
    loadManifest: function (uri) {
        return Manifesto.Utils.loadResource(uri);
    }
};

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
var Manifesto;
(function (Manifesto) {
    var Annotation = /** @class */ (function (_super) {
        __extends(Annotation, _super);
        function Annotation(jsonld, options) {
            return _super.call(this, jsonld, options) || this;
        }
        Annotation.prototype.getBody = function () {
            var bodies = [];
            var body = this.getProperty('body');
            // todo: make this a generic "property that can be an object or array enumerator" util
            if (body) {
                if (Array.isArray(body)) {
                    for (var i = 0; i < body.length; i++) {
                        var b = body[i];
                        if (b.items) {
                            for (var i_1 = 0; i_1 < b.items.length; i_1++) {
                                var c = b.items[i_1];
                                bodies.push(new Manifesto.AnnotationBody(c, this.options));
                            }
                        }
                        else {
                            bodies.push(new Manifesto.AnnotationBody(b, this.options));
                        }
                    }
                }
                else if (body.items) {
                    for (var i = 0; i < body.items.length; i++) {
                        var b = body.items[i];
                        bodies.push(new Manifesto.AnnotationBody(b, this.options));
                    }
                }
                else {
                    bodies.push(new Manifesto.AnnotationBody(body, this.options));
                }
            }
            return bodies;
        };
        Annotation.prototype.getMotivation = function () {
            var motivation = this.getProperty('motivation');
            if (motivation) {
                return new Manifesto.AnnotationMotivation(motivation.toLowerCase());
            }
            return null;
        };
        // open annotation
        Annotation.prototype.getOn = function () {
            return this.getProperty('on');
        };
        Annotation.prototype.getTarget = function () {
            return this.getProperty('target');
        };
        Annotation.prototype.getResource = function () {
            return new Manifesto.Resource(this.getProperty('resource'), this.options);
        };
        return Annotation;
    }(Manifesto.ManifestResource));
    Manifesto.Annotation = Annotation;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var AnnotationBody = /** @class */ (function (_super) {
        __extends(AnnotationBody, _super);
        function AnnotationBody(jsonld, options) {
            return _super.call(this, jsonld, options) || this;
        }
        AnnotationBody.prototype.getFormat = function () {
            var format = this.getProperty('format');
            if (format) {
                return new Manifesto.MediaType(Manifesto.Utils.getMediaType(format));
            }
            return null;
        };
        AnnotationBody.prototype.getType = function () {
            var type = this.getProperty('type');
            if (type) {
                return new Manifesto.ResourceType(Manifesto.Utils.normaliseType(this.getProperty('type')));
            }
            return null;
        };
        return AnnotationBody;
    }(Manifesto.ManifestResource));
    Manifesto.AnnotationBody = AnnotationBody;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var AnnotationList = /** @class */ (function (_super) {
        __extends(AnnotationList, _super);
        function AnnotationList(label, jsonld, options) {
            var _this = _super.call(this, jsonld) || this;
            _this.label = label;
            _this.options = options;
            return _this;
        }
        AnnotationList.prototype.getIIIFResourceType = function () {
            return new Manifesto.IIIFResourceType(Manifesto.Utils.normaliseType(this.getProperty('type')));
        };
        AnnotationList.prototype.getLabel = function () {
            return this.label;
        };
        AnnotationList.prototype.getResources = function () {
            var _this = this;
            var resources = this.getProperty('resources');
            return resources.map(function (resource) { return new Manifesto.Annotation(resource, _this.options); });
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
                        id = _this.__jsonld['@id'];
                    }
                    Manifesto.Utils.loadResource(id).then(function (data) {
                        _this.__jsonld = JSON.parse(data);
                        _this.context = _this.getProperty('context');
                        _this.id = _this.getProperty('id');
                        _this.isLoaded = true;
                        resolve(_this);
                    }).catch(reject);
                }
            });
        };
        return AnnotationList;
    }(Manifesto.JSONLDResource));
    Manifesto.AnnotationList = AnnotationList;
})(Manifesto || (Manifesto = {}));

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
var Manifesto;
(function (Manifesto) {
    var AnnotationPage = /** @class */ (function (_super) {
        __extends(AnnotationPage, _super);
        function AnnotationPage(jsonld, options) {
            return _super.call(this, jsonld, options) || this;
        }
        AnnotationPage.prototype.getItems = function () {
            return this.getProperty('items');
        };
        return AnnotationPage;
    }(Manifesto.ManifestResource));
    Manifesto.AnnotationPage = AnnotationPage;
})(Manifesto || (Manifesto = {}));

























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
var Manifesto;
(function (Manifesto) {
    var Thumbnail = /** @class */ (function (_super) {
        __extends(Thumbnail, _super);
        function Thumbnail(jsonld, options) {
            return _super.call(this, jsonld, options) || this;
        }
        return Thumbnail;
    }(Manifesto.Resource));
    Manifesto.Thumbnail = Thumbnail;
})(Manifesto || (Manifesto = {}));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"http":30,"https":8,"url":36}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":2,"ieee754":9,"isarray":12}],5:[function(require,module,exports){
module.exports = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a teapot",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Unordered Collection",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "451": "Unavailable For Legal Reasons",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "509": "Bandwidth Limit Exceeded",
  "510": "Not Extended",
  "511": "Network Authentication Required"
}

},{}],6:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":11}],7:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],8:[function(require,module,exports){
var http = require('http');

var https = module.exports;

for (var key in http) {
    if (http.hasOwnProperty(key)) https[key] = http[key];
};

https.request = function (params, cb) {
    if (!params) params = {};
    params.scheme = 'https';
    params.protocol = 'https:';
    return http.request.call(this, params, cb);
}

},{"http":30}],9:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],10:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],11:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],12:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],13:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],14:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],16:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],17:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":15,"./encode":16}],18:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

{
  // avoid scope creep, the keys array can then be collected
  var keys = objectKeys(Writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  pna.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  pna.nextTick(cb, err);
};
},{"./_stream_readable":20,"./_stream_writable":22,"core-util-is":6,"inherits":10,"process-nextick-args":26}],19:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":21,"core-util-is":6,"inherits":10}],20:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = require('./internal/streams/BufferList');
var destroyImpl = require('./internal/streams/destroy');
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var readableHwm = options.readableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    pna.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        pna.nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    pna.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;

  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._readableState.highWaterMark;
  }
});

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    pna.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_stream_duplex":18,"./internal/streams/BufferList":23,"./internal/streams/destroy":24,"./internal/streams/stream":25,"_process":13,"core-util-is":6,"events":7,"inherits":10,"isarray":12,"process-nextick-args":26,"safe-buffer":29,"string_decoder/":27,"util":3}],21:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return this.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);

  cb(er);

  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function') {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this2 = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this2.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');

  if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":18,"core-util-is":6,"inherits":10}],22:[function(require,module,exports){
(function (process,global,setImmediate){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

var destroyImpl = require('./internal/streams/destroy');

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var writableHwm = options.writableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  pna.nextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    pna.nextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    pna.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    pna.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      pna.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) pna.nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"./_stream_duplex":18,"./internal/streams/destroy":24,"./internal/streams/stream":25,"_process":13,"core-util-is":6,"inherits":10,"process-nextick-args":26,"safe-buffer":29,"timers":34,"util-deprecate":38}],23:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = require('safe-buffer').Buffer;
var util = require('util');

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

if (util && util.inspect && util.inspect.custom) {
  module.exports.prototype[util.inspect.custom] = function () {
    var obj = util.inspect({ length: this.length });
    return this.constructor.name + ' ' + obj;
  };
}
},{"safe-buffer":29,"util":3}],24:[function(require,module,exports){
'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      pna.nextTick(emitErrorNT, this, err);
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      pna.nextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};
},{"process-nextick-args":26}],25:[function(require,module,exports){
module.exports = require('events').EventEmitter;

},{"events":7}],26:[function(require,module,exports){
(function (process){
'use strict';

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = { nextTick: nextTick };
} else {
  module.exports = process
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}


}).call(this,require('_process'))
},{"_process":13}],27:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"safe-buffer":29}],28:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":18,"./lib/_stream_passthrough.js":19,"./lib/_stream_readable.js":20,"./lib/_stream_transform.js":21,"./lib/_stream_writable.js":22}],29:[function(require,module,exports){
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":4}],30:[function(require,module,exports){
(function (global){
var ClientRequest = require('./lib/request')
var response = require('./lib/response')
var extend = require('xtend')
var statusCodes = require('builtin-status-codes')
var url = require('url')

var http = exports

http.request = function (opts, cb) {
	if (typeof opts === 'string')
		opts = url.parse(opts)
	else
		opts = extend(opts)

	// Normally, the page is loaded from http or https, so not specifying a protocol
	// will result in a (valid) protocol-relative url. However, this won't work if
	// the protocol is something else, like 'file:'
	var defaultProtocol = global.location.protocol.search(/^https?:$/) === -1 ? 'http:' : ''

	var protocol = opts.protocol || defaultProtocol
	var host = opts.hostname || opts.host
	var port = opts.port
	var path = opts.path || '/'

	// Necessary for IPv6 addresses
	if (host && host.indexOf(':') !== -1)
		host = '[' + host + ']'

	// This may be a relative url. The browser should always be able to interpret it correctly.
	opts.url = (host ? (protocol + '//' + host) : '') + (port ? ':' + port : '') + path
	opts.method = (opts.method || 'GET').toUpperCase()
	opts.headers = opts.headers || {}

	// Also valid opts.auth, opts.mode

	var req = new ClientRequest(opts)
	if (cb)
		req.on('response', cb)
	return req
}

http.get = function get (opts, cb) {
	var req = http.request(opts, cb)
	req.end()
	return req
}

http.ClientRequest = ClientRequest
http.IncomingMessage = response.IncomingMessage

http.Agent = function () {}
http.Agent.defaultMaxSockets = 4

http.globalAgent = new http.Agent()

http.STATUS_CODES = statusCodes

http.METHODS = [
	'CHECKOUT',
	'CONNECT',
	'COPY',
	'DELETE',
	'GET',
	'HEAD',
	'LOCK',
	'M-SEARCH',
	'MERGE',
	'MKACTIVITY',
	'MKCOL',
	'MOVE',
	'NOTIFY',
	'OPTIONS',
	'PATCH',
	'POST',
	'PROPFIND',
	'PROPPATCH',
	'PURGE',
	'PUT',
	'REPORT',
	'SEARCH',
	'SUBSCRIBE',
	'TRACE',
	'UNLOCK',
	'UNSUBSCRIBE'
]
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/request":32,"./lib/response":33,"builtin-status-codes":5,"url":36,"xtend":39}],31:[function(require,module,exports){
(function (global){
exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream)

exports.writableStream = isFunction(global.WritableStream)

exports.abortController = isFunction(global.AbortController)

exports.blobConstructor = false
try {
	new Blob([new ArrayBuffer(1)])
	exports.blobConstructor = true
} catch (e) {}

// The xhr request to example.com may violate some restrictive CSP configurations,
// so if we're running in a browser that supports `fetch`, avoid calling getXHR()
// and assume support for certain features below.
var xhr
function getXHR () {
	// Cache the xhr value
	if (xhr !== undefined) return xhr

	if (global.XMLHttpRequest) {
		xhr = new global.XMLHttpRequest()
		// If XDomainRequest is available (ie only, where xhr might not work
		// cross domain), use the page location. Otherwise use example.com
		// Note: this doesn't actually make an http request.
		try {
			xhr.open('GET', global.XDomainRequest ? '/' : 'https://example.com')
		} catch(e) {
			xhr = null
		}
	} else {
		// Service workers don't have XHR
		xhr = null
	}
	return xhr
}

function checkTypeSupport (type) {
	var xhr = getXHR()
	if (!xhr) return false
	try {
		xhr.responseType = type
		return xhr.responseType === type
	} catch (e) {}
	return false
}

// For some strange reason, Safari 7.0 reports typeof global.ArrayBuffer === 'object'.
// Safari 7.1 appears to have fixed this bug.
var haveArrayBuffer = typeof global.ArrayBuffer !== 'undefined'
var haveSlice = haveArrayBuffer && isFunction(global.ArrayBuffer.prototype.slice)

// If fetch is supported, then arraybuffer will be supported too. Skip calling
// checkTypeSupport(), since that calls getXHR().
exports.arraybuffer = exports.fetch || (haveArrayBuffer && checkTypeSupport('arraybuffer'))

// These next two tests unavoidably show warnings in Chrome. Since fetch will always
// be used if it's available, just return false for these to avoid the warnings.
exports.msstream = !exports.fetch && haveSlice && checkTypeSupport('ms-stream')
exports.mozchunkedarraybuffer = !exports.fetch && haveArrayBuffer &&
	checkTypeSupport('moz-chunked-arraybuffer')

// If fetch is supported, then overrideMimeType will be supported too. Skip calling
// getXHR().
exports.overrideMimeType = exports.fetch || (getXHR() ? isFunction(getXHR().overrideMimeType) : false)

exports.vbArray = isFunction(global.VBArray)

function isFunction (value) {
	return typeof value === 'function'
}

xhr = null // Help gc

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],32:[function(require,module,exports){
(function (process,global,Buffer){
var capability = require('./capability')
var inherits = require('inherits')
var response = require('./response')
var stream = require('readable-stream')
var toArrayBuffer = require('to-arraybuffer')

var IncomingMessage = response.IncomingMessage
var rStates = response.readyStates

function decideMode (preferBinary, useFetch) {
	if (capability.fetch && useFetch) {
		return 'fetch'
	} else if (capability.mozchunkedarraybuffer) {
		return 'moz-chunked-arraybuffer'
	} else if (capability.msstream) {
		return 'ms-stream'
	} else if (capability.arraybuffer && preferBinary) {
		return 'arraybuffer'
	} else if (capability.vbArray && preferBinary) {
		return 'text:vbarray'
	} else {
		return 'text'
	}
}

var ClientRequest = module.exports = function (opts) {
	var self = this
	stream.Writable.call(self)

	self._opts = opts
	self._body = []
	self._headers = {}
	if (opts.auth)
		self.setHeader('Authorization', 'Basic ' + new Buffer(opts.auth).toString('base64'))
	Object.keys(opts.headers).forEach(function (name) {
		self.setHeader(name, opts.headers[name])
	})

	var preferBinary
	var useFetch = true
	if (opts.mode === 'disable-fetch' || ('requestTimeout' in opts && !capability.abortController)) {
		// If the use of XHR should be preferred. Not typically needed.
		useFetch = false
		preferBinary = true
	} else if (opts.mode === 'prefer-streaming') {
		// If streaming is a high priority but binary compatibility and
		// the accuracy of the 'content-type' header aren't
		preferBinary = false
	} else if (opts.mode === 'allow-wrong-content-type') {
		// If streaming is more important than preserving the 'content-type' header
		preferBinary = !capability.overrideMimeType
	} else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
		// Use binary if text streaming may corrupt data or the content-type header, or for speed
		preferBinary = true
	} else {
		throw new Error('Invalid value for opts.mode')
	}
	self._mode = decideMode(preferBinary, useFetch)
	self._fetchTimer = null

	self.on('finish', function () {
		self._onFinish()
	})
}

inherits(ClientRequest, stream.Writable)

ClientRequest.prototype.setHeader = function (name, value) {
	var self = this
	var lowerName = name.toLowerCase()
	// This check is not necessary, but it prevents warnings from browsers about setting unsafe
	// headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
	// http-browserify did it, so I will too.
	if (unsafeHeaders.indexOf(lowerName) !== -1)
		return

	self._headers[lowerName] = {
		name: name,
		value: value
	}
}

ClientRequest.prototype.getHeader = function (name) {
	var header = this._headers[name.toLowerCase()]
	if (header)
		return header.value
	return null
}

ClientRequest.prototype.removeHeader = function (name) {
	var self = this
	delete self._headers[name.toLowerCase()]
}

ClientRequest.prototype._onFinish = function () {
	var self = this

	if (self._destroyed)
		return
	var opts = self._opts

	var headersObj = self._headers
	var body = null
	if (opts.method !== 'GET' && opts.method !== 'HEAD') {
		if (capability.arraybuffer) {
			body = toArrayBuffer(Buffer.concat(self._body))
		} else if (capability.blobConstructor) {
			body = new global.Blob(self._body.map(function (buffer) {
				return toArrayBuffer(buffer)
			}), {
				type: (headersObj['content-type'] || {}).value || ''
			})
		} else {
			// get utf8 string
			body = Buffer.concat(self._body).toString()
		}
	}

	// create flattened list of headers
	var headersList = []
	Object.keys(headersObj).forEach(function (keyName) {
		var name = headersObj[keyName].name
		var value = headersObj[keyName].value
		if (Array.isArray(value)) {
			value.forEach(function (v) {
				headersList.push([name, v])
			})
		} else {
			headersList.push([name, value])
		}
	})

	if (self._mode === 'fetch') {
		var signal = null
		var fetchTimer = null
		if (capability.abortController) {
			var controller = new AbortController()
			signal = controller.signal
			self._fetchAbortController = controller

			if ('requestTimeout' in opts && opts.requestTimeout !== 0) {
				self._fetchTimer = global.setTimeout(function () {
					self.emit('requestTimeout')
					if (self._fetchAbortController)
						self._fetchAbortController.abort()
				}, opts.requestTimeout)
			}
		}

		global.fetch(self._opts.url, {
			method: self._opts.method,
			headers: headersList,
			body: body || undefined,
			mode: 'cors',
			credentials: opts.withCredentials ? 'include' : 'same-origin',
			signal: signal
		}).then(function (response) {
			self._fetchResponse = response
			self._connect()
		}, function (reason) {
			global.clearTimeout(self._fetchTimer)
			if (!self._destroyed)
				self.emit('error', reason)
		})
	} else {
		var xhr = self._xhr = new global.XMLHttpRequest()
		try {
			xhr.open(self._opts.method, self._opts.url, true)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}

		// Can't set responseType on really old browsers
		if ('responseType' in xhr)
			xhr.responseType = self._mode.split(':')[0]

		if ('withCredentials' in xhr)
			xhr.withCredentials = !!opts.withCredentials

		if (self._mode === 'text' && 'overrideMimeType' in xhr)
			xhr.overrideMimeType('text/plain; charset=x-user-defined')

		if ('requestTimeout' in opts) {
			xhr.timeout = opts.requestTimeout
			xhr.ontimeout = function () {
				self.emit('requestTimeout')
			}
		}

		headersList.forEach(function (header) {
			xhr.setRequestHeader(header[0], header[1])
		})

		self._response = null
		xhr.onreadystatechange = function () {
			switch (xhr.readyState) {
				case rStates.LOADING:
				case rStates.DONE:
					self._onXHRProgress()
					break
			}
		}
		// Necessary for streaming in Firefox, since xhr.response is ONLY defined
		// in onprogress, not in onreadystatechange with xhr.readyState = 3
		if (self._mode === 'moz-chunked-arraybuffer') {
			xhr.onprogress = function () {
				self._onXHRProgress()
			}
		}

		xhr.onerror = function () {
			if (self._destroyed)
				return
			self.emit('error', new Error('XHR error'))
		}

		try {
			xhr.send(body)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}
	}
}

/**
 * Checks if xhr.status is readable and non-zero, indicating no error.
 * Even though the spec says it should be available in readyState 3,
 * accessing it throws an exception in IE8
 */
function statusValid (xhr) {
	try {
		var status = xhr.status
		return (status !== null && status !== 0)
	} catch (e) {
		return false
	}
}

ClientRequest.prototype._onXHRProgress = function () {
	var self = this

	if (!statusValid(self._xhr) || self._destroyed)
		return

	if (!self._response)
		self._connect()

	self._response._onXHRProgress()
}

ClientRequest.prototype._connect = function () {
	var self = this

	if (self._destroyed)
		return

	self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode, self._fetchTimer)
	self._response.on('error', function(err) {
		self.emit('error', err)
	})

	self.emit('response', self._response)
}

ClientRequest.prototype._write = function (chunk, encoding, cb) {
	var self = this

	self._body.push(chunk)
	cb()
}

ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () {
	var self = this
	self._destroyed = true
	global.clearTimeout(self._fetchTimer)
	if (self._response)
		self._response._destroyed = true
	if (self._xhr)
		self._xhr.abort()
	else if (self._fetchAbortController)
		self._fetchAbortController.abort()
}

ClientRequest.prototype.end = function (data, encoding, cb) {
	var self = this
	if (typeof data === 'function') {
		cb = data
		data = undefined
	}

	stream.Writable.prototype.end.call(self, data, encoding, cb)
}

ClientRequest.prototype.flushHeaders = function () {}
ClientRequest.prototype.setTimeout = function () {}
ClientRequest.prototype.setNoDelay = function () {}
ClientRequest.prototype.setSocketKeepAlive = function () {}

// Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
var unsafeHeaders = [
	'accept-charset',
	'accept-encoding',
	'access-control-request-headers',
	'access-control-request-method',
	'connection',
	'content-length',
	'cookie',
	'cookie2',
	'date',
	'dnt',
	'expect',
	'host',
	'keep-alive',
	'origin',
	'referer',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'via'
]

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"./capability":31,"./response":33,"_process":13,"buffer":4,"inherits":10,"readable-stream":28,"to-arraybuffer":35}],33:[function(require,module,exports){
(function (process,global,Buffer){
var capability = require('./capability')
var inherits = require('inherits')
var stream = require('readable-stream')

var rStates = exports.readyStates = {
	UNSENT: 0,
	OPENED: 1,
	HEADERS_RECEIVED: 2,
	LOADING: 3,
	DONE: 4
}

var IncomingMessage = exports.IncomingMessage = function (xhr, response, mode, fetchTimer) {
	var self = this
	stream.Readable.call(self)

	self._mode = mode
	self.headers = {}
	self.rawHeaders = []
	self.trailers = {}
	self.rawTrailers = []

	// Fake the 'close' event, but only once 'end' fires
	self.on('end', function () {
		// The nextTick is necessary to prevent the 'request' module from causing an infinite loop
		process.nextTick(function () {
			self.emit('close')
		})
	})

	if (mode === 'fetch') {
		self._fetchResponse = response

		self.url = response.url
		self.statusCode = response.status
		self.statusMessage = response.statusText
		
		response.headers.forEach(function (header, key){
			self.headers[key.toLowerCase()] = header
			self.rawHeaders.push(key, header)
		})

		if (capability.writableStream) {
			var writable = new WritableStream({
				write: function (chunk) {
					return new Promise(function (resolve, reject) {
						if (self._destroyed) {
							reject()
						} else if(self.push(new Buffer(chunk))) {
							resolve()
						} else {
							self._resumeFetch = resolve
						}
					})
				},
				close: function () {
					global.clearTimeout(fetchTimer)
					if (!self._destroyed)
						self.push(null)
				},
				abort: function (err) {
					if (!self._destroyed)
						self.emit('error', err)
				}
			})

			try {
				response.body.pipeTo(writable).catch(function (err) {
					global.clearTimeout(fetchTimer)
					if (!self._destroyed)
						self.emit('error', err)
				})
				return
			} catch (e) {} // pipeTo method isn't defined. Can't find a better way to feature test this
		}
		// fallback for when writableStream or pipeTo aren't available
		var reader = response.body.getReader()
		function read () {
			reader.read().then(function (result) {
				if (self._destroyed)
					return
				if (result.done) {
					global.clearTimeout(fetchTimer)
					self.push(null)
					return
				}
				self.push(new Buffer(result.value))
				read()
			}).catch(function (err) {
				global.clearTimeout(fetchTimer)
				if (!self._destroyed)
					self.emit('error', err)
			})
		}
		read()
	} else {
		self._xhr = xhr
		self._pos = 0

		self.url = xhr.responseURL
		self.statusCode = xhr.status
		self.statusMessage = xhr.statusText
		var headers = xhr.getAllResponseHeaders().split(/\r?\n/)
		headers.forEach(function (header) {
			var matches = header.match(/^([^:]+):\s*(.*)/)
			if (matches) {
				var key = matches[1].toLowerCase()
				if (key === 'set-cookie') {
					if (self.headers[key] === undefined) {
						self.headers[key] = []
					}
					self.headers[key].push(matches[2])
				} else if (self.headers[key] !== undefined) {
					self.headers[key] += ', ' + matches[2]
				} else {
					self.headers[key] = matches[2]
				}
				self.rawHeaders.push(matches[1], matches[2])
			}
		})

		self._charset = 'x-user-defined'
		if (!capability.overrideMimeType) {
			var mimeType = self.rawHeaders['mime-type']
			if (mimeType) {
				var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/)
				if (charsetMatch) {
					self._charset = charsetMatch[1].toLowerCase()
				}
			}
			if (!self._charset)
				self._charset = 'utf-8' // best guess
		}
	}
}

inherits(IncomingMessage, stream.Readable)

IncomingMessage.prototype._read = function () {
	var self = this

	var resolve = self._resumeFetch
	if (resolve) {
		self._resumeFetch = null
		resolve()
	}
}

IncomingMessage.prototype._onXHRProgress = function () {
	var self = this

	var xhr = self._xhr

	var response = null
	switch (self._mode) {
		case 'text:vbarray': // For IE9
			if (xhr.readyState !== rStates.DONE)
				break
			try {
				// This fails in IE8
				response = new global.VBArray(xhr.responseBody).toArray()
			} catch (e) {}
			if (response !== null) {
				self.push(new Buffer(response))
				break
			}
			// Falls through in IE8	
		case 'text':
			try { // This will fail when readyState = 3 in IE9. Switch mode and wait for readyState = 4
				response = xhr.responseText
			} catch (e) {
				self._mode = 'text:vbarray'
				break
			}
			if (response.length > self._pos) {
				var newData = response.substr(self._pos)
				if (self._charset === 'x-user-defined') {
					var buffer = new Buffer(newData.length)
					for (var i = 0; i < newData.length; i++)
						buffer[i] = newData.charCodeAt(i) & 0xff

					self.push(buffer)
				} else {
					self.push(newData, self._charset)
				}
				self._pos = response.length
			}
			break
		case 'arraybuffer':
			if (xhr.readyState !== rStates.DONE || !xhr.response)
				break
			response = xhr.response
			self.push(new Buffer(new Uint8Array(response)))
			break
		case 'moz-chunked-arraybuffer': // take whole
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING || !response)
				break
			self.push(new Buffer(new Uint8Array(response)))
			break
		case 'ms-stream':
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING)
				break
			var reader = new global.MSStreamReader()
			reader.onprogress = function () {
				if (reader.result.byteLength > self._pos) {
					self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos))))
					self._pos = reader.result.byteLength
				}
			}
			reader.onload = function () {
				self.push(null)
			}
			// reader.onerror = ??? // TODO: this
			reader.readAsArrayBuffer(response)
			break
	}

	// The ms-stream case handles end separately in reader.onload()
	if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
		self.push(null)
	}
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"./capability":31,"_process":13,"buffer":4,"inherits":10,"readable-stream":28}],34:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":13,"timers":34}],35:[function(require,module,exports){
var Buffer = require('buffer').Buffer

module.exports = function (buf) {
	// If the buffer is backed by a Uint8Array, a faster version will work
	if (buf instanceof Uint8Array) {
		// If the buffer isn't a subarray, return the underlying ArrayBuffer
		if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
			return buf.buffer
		} else if (typeof buf.buffer.slice === 'function') {
			// Otherwise we need to get a proper copy
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
		}
	}

	if (Buffer.isBuffer(buf)) {
		// This is the slow version that will work with any Buffer
		// implementation (even in old browsers)
		var arrayCopy = new Uint8Array(buf.length)
		var len = buf.length
		for (var i = 0; i < len; i++) {
			arrayCopy[i] = buf[i]
		}
		return arrayCopy.buffer
	} else {
		throw new Error('Argument must be a Buffer')
	}
}

},{"buffer":4}],36:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":37,"punycode":14,"querystring":17}],37:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],38:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],39:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[1])(1)
});
