// @iiif/manifold v1.2.26 https://github.com/iiif-commons/manifold#readme
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.iiifmanifold = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){

var Manifold;
(function (Manifold) {
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
    Manifold.StringValue = StringValue;
})(Manifold || (Manifold = {}));

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
var Manifold;
(function (Manifold) {
    var TreeSortType = /** @class */ (function (_super) {
        __extends(TreeSortType, _super);
        function TreeSortType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // todo: use getters when ES3 target is no longer required.
        TreeSortType.prototype.date = function () {
            return new TreeSortType(TreeSortType.DATE.toString());
        };
        TreeSortType.prototype.none = function () {
            return new TreeSortType(TreeSortType.NONE.toString());
        };
        TreeSortType.DATE = new TreeSortType("date");
        TreeSortType.NONE = new TreeSortType("none");
        return TreeSortType;
    }(Manifold.StringValue));
    Manifold.TreeSortType = TreeSortType;
})(Manifold || (Manifold = {}));

var Manifold;
(function (Manifold) {
    var AnnotationGroup = /** @class */ (function () {
        function AnnotationGroup(resource, canvasIndex) {
            this.rects = [];
            this.canvasIndex = canvasIndex;
            this.addRect(resource);
        }
        AnnotationGroup.prototype.addRect = function (resource) {
            var rect = new Manifold.AnnotationRect(resource);
            rect.canvasIndex = this.canvasIndex;
            rect.index = this.rects.length;
            this.rects.push(rect);
            // sort ascending
            this.rects.sort(function (a, b) {
                return a.index - b.index;
            });
        };
        return AnnotationGroup;
    }());
    Manifold.AnnotationGroup = AnnotationGroup;
})(Manifold || (Manifold = {}));

var Manifold;
(function (Manifold) {
    var AnnotationRect = /** @class */ (function () {
        function AnnotationRect(result) {
            this.isVisible = true;
            var xywh = result.on.match(/.*xywh=(\d*),(\d*),(\d*),(\d*)/);
            this.x = Number(xywh[1]);
            this.y = Number(xywh[2]);
            this.width = Number(xywh[3]);
            this.height = Number(xywh[4]);
            this.chars = result.resource.chars;
        }
        return AnnotationRect;
    }());
    Manifold.AnnotationRect = AnnotationRect;
})(Manifold || (Manifold = {}));

var Manifold;
(function (Manifold) {
    var Bootstrapper = /** @class */ (function () {
        function Bootstrapper(options) {
            this._options = options;
            this._options.locale = this._options.locale || 'en-GB'; // default locale
        }
        Bootstrapper.prototype.bootstrap = function (res, rej) {
            var that = this;
            return new Promise(function (resolve, reject) {
                // if this is a recursive bootstrap we will have existing resolve & reject methods.
                if (res && rej) {
                    resolve = res;
                    reject = rej;
                }
                var msie = that._detectIE();
                if (msie === false) {
                    manifesto.loadManifest(that._options.iiifResourceUri).then(function (json) {
                        that._loaded(that, json, resolve, reject);
                    });
                }
                else {
                    // if not a recent version of IE
                    if (msie > 0) {
                        if (msie === 9) {
                            // CORS not available, use jsonp
                            var settings = {
                                url: that._options.iiifResourceUri,
                                type: 'GET',
                                dataType: 'jsonp',
                                jsonp: 'callback',
                                jsonpCallback: 'manifestCallback'
                            };
                            $.ajax(settings);
                            global.manifestCallback = function (json) {
                                that._loaded(that, JSON.stringify(json), resolve, reject);
                            };
                        }
                        else {
                            $.getJSON(that._options.iiifResourceUri, function (json) {
                                that._loaded(that, JSON.stringify(json), resolve, reject);
                            });
                        }
                    }
                }
            });
        };
        Bootstrapper.prototype._loaded = function (bootstrapper, json, resolve, reject) {
            var iiifResource = manifesto.create(json, {
                locale: bootstrapper._options.locale
            });
            // only set the root IIIFResource on the first load
            if (!bootstrapper._options.iiifResource) {
                bootstrapper._options.iiifResource = iiifResource;
            }
            if (iiifResource.getIIIFResourceType().toString() === manifesto.IIIFResourceType.collection().toString() ||
                iiifResource.getIIIFResourceType().toString().toLowerCase() === 'collection') {
                // if it's a collection and has child collections, get the collection by index
                var collections = iiifResource.getCollections();
                if (collections && collections.length) {
                    iiifResource.getCollectionByIndex(bootstrapper._options.collectionIndex).then(function (collection) {
                        if (!collection) {
                            reject('Collection index not found');
                        }
                        // Special case: we're trying to load the first manifest of the
                        // collection, but the collection has no manifests but does have
                        // subcollections. Thus, we should dive in until we find something
                        // we can display!
                        if (collection.getTotalManifests() === 0 && bootstrapper._options.manifestIndex === 0 && collection.getTotalCollections() > 0) {
                            bootstrapper._options.collectionIndex = 0;
                            bootstrapper._options.iiifResourceUri = collection.id;
                            bootstrapper.bootstrap(resolve, reject);
                        }
                        else {
                            collection.getManifestByIndex(bootstrapper._options.manifestIndex).then(function (manifest) {
                                bootstrapper._options.manifest = manifest;
                                var helper = new Manifold.Helper(bootstrapper._options);
                                resolve(helper);
                            });
                        }
                    });
                }
                else {
                    iiifResource.getManifestByIndex(bootstrapper._options.manifestIndex).then(function (manifest) {
                        bootstrapper._options.manifest = manifest;
                        var helper = new Manifold.Helper(bootstrapper._options);
                        resolve(helper);
                    });
                }
            }
            else {
                bootstrapper._options.manifest = iiifResource;
                var helper = new Manifold.Helper(bootstrapper._options);
                resolve(helper);
            }
        };
        Bootstrapper.prototype._detectIE = function () {
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
        return Bootstrapper;
    }());
    Manifold.Bootstrapper = Bootstrapper;
})(Manifold || (Manifold = {}));

var Manifold;
(function (Manifold) {
    var ExternalResource = /** @class */ (function () {
        function ExternalResource(canvas, options) {
            this.authHoldingPage = null;
            this.clickThroughService = null;
            this.externalService = null;
            this.isResponseHandled = false;
            this.kioskService = null;
            this.loginService = null;
            this.logoutService = null;
            this.restrictedService = null;
            this.tokenService = null;
            canvas.externalResource = this;
            this.dataUri = this._getDataUri(canvas);
            this.index = canvas.index;
            this.authAPIVersion = options.authApiVersion;
            this._parseAuthServices(canvas);
            // get the height and width of the image resource if available
            this._parseDimensions(canvas);
        }
        ExternalResource.prototype._getDataUri = function (canvas) {
            var content = canvas.getContent();
            var images = canvas.getImages();
            if (content && content.length) {
                var annotation = content[0];
                var annotationBody = annotation.getBody();
                if (annotationBody.length) {
                    return annotationBody[0].id;
                }
                return null;
            }
            else if (images && images.length) {
                var infoUri = null;
                var firstImage = images[0];
                var resource = firstImage.getResource();
                var services = resource.getServices();
                if (services.length) {
                    for (var i = 0; i < services.length; i++) {
                        var service = services[i];
                        var id = service.id;
                        if (!id.endsWith('/')) {
                            id += '/';
                        }
                        if (manifesto.Utils.isImageProfile(service.getProfile())) {
                            infoUri = id + 'info.json';
                        }
                    }
                    return infoUri;
                }
                // no image services. return the image id
                return resource.id;
            }
            else {
                // Legacy IxIF
                var service = canvas.getService(manifesto.ServiceProfile.ixif());
                if (service) {
                    return service.getInfoUri();
                }
                // return the canvas id.
                return canvas.id;
            }
        };
        ExternalResource.prototype._parseAuthServices = function (resource) {
            if (this.authAPIVersion === 0.9) {
                this.clickThroughService = manifesto.Utils.getService(resource, manifesto.ServiceProfile.clickThrough().toString());
                this.loginService = manifesto.Utils.getService(resource, manifesto.ServiceProfile.login().toString());
                this.restrictedService = manifesto.Utils.getService(resource, manifesto.ServiceProfile.restricted().toString());
                if (this.clickThroughService) {
                    this.logoutService = this.clickThroughService.getService(manifesto.ServiceProfile.logout().toString());
                    this.tokenService = this.clickThroughService.getService(manifesto.ServiceProfile.token().toString());
                }
                else if (this.loginService) {
                    this.logoutService = this.loginService.getService(manifesto.ServiceProfile.logout().toString());
                    this.tokenService = this.loginService.getService(manifesto.ServiceProfile.token().toString());
                }
                else if (this.restrictedService) {
                    this.logoutService = this.restrictedService.getService(manifesto.ServiceProfile.logout().toString());
                    this.tokenService = this.restrictedService.getService(manifesto.ServiceProfile.token().toString());
                }
            }
            else {
                this.clickThroughService = manifesto.Utils.getService(resource, manifesto.ServiceProfile.auth1Clickthrough().toString());
                this.loginService = manifesto.Utils.getService(resource, manifesto.ServiceProfile.auth1Login().toString());
                this.externalService = manifesto.Utils.getService(resource, manifesto.ServiceProfile.auth1External().toString());
                this.kioskService = manifesto.Utils.getService(resource, manifesto.ServiceProfile.auth1Kiosk().toString());
                if (this.clickThroughService) {
                    this.logoutService = this.clickThroughService.getService(manifesto.ServiceProfile.auth1Logout().toString());
                    this.tokenService = this.clickThroughService.getService(manifesto.ServiceProfile.auth1Token().toString());
                }
                else if (this.loginService) {
                    this.logoutService = this.loginService.getService(manifesto.ServiceProfile.auth1Logout().toString());
                    this.tokenService = this.loginService.getService(manifesto.ServiceProfile.auth1Token().toString());
                }
                else if (this.externalService) {
                    this.logoutService = this.externalService.getService(manifesto.ServiceProfile.auth1Logout().toString());
                    this.tokenService = this.externalService.getService(manifesto.ServiceProfile.auth1Token().toString());
                }
                else if (this.kioskService) {
                    this.logoutService = this.kioskService.getService(manifesto.ServiceProfile.auth1Logout().toString());
                    this.tokenService = this.kioskService.getService(manifesto.ServiceProfile.auth1Token().toString());
                }
            }
        };
        ExternalResource.prototype._parseDimensions = function (canvas) {
            var images = canvas.getImages();
            if (images && images.length) {
                var firstImage = images[0];
                var resource = firstImage.getResource();
                this.width = resource.getWidth();
                this.height = resource.getHeight();
            }
        };
        ExternalResource.prototype.isAccessControlled = function () {
            if (this.clickThroughService || this.loginService || this.externalService || this.kioskService) {
                return true;
            }
            return false;
        };
        ExternalResource.prototype.hasServiceDescriptor = function () {
            if (this.dataUri) {
                return this.dataUri.endsWith('info.json');
            }
            return false;
        };
        ExternalResource.prototype.getData = function (accessToken) {
            var _this = this;
            var that = this;
            that.data = {};
            return new Promise(function (resolve, reject) {
                if (!_this.dataUri) {
                    reject('There is no dataUri to fetch');
                }
                // check if dataUri ends with info.json
                // if not issue a HEAD request.
                var type = 'GET';
                if (!that.hasServiceDescriptor()) {
                    // If access control is unnecessary, short circuit the process.
                    // Note that isAccessControlled check for short-circuiting only
                    // works in the "binary resource" context, since in that case,
                    // we know about access control from the manifest. For image
                    // resources, we need to check info.json for details and can't
                    // short-circuit like this.
                    if (!that.isAccessControlled()) {
                        that.status = HTTPStatusCode.OK;
                        resolve(that);
                        return;
                    }
                    type = 'HEAD';
                }
                $.ajax({
                    url: that.dataUri,
                    type: type,
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        if (accessToken) {
                            xhr.setRequestHeader("Authorization", "Bearer " + accessToken.accessToken);
                        }
                    }
                }).done(function (data) {
                    // if it's a resource without an info.json
                    // todo: if resource doesn't have a @profile
                    if (!data) {
                        that.status = HTTPStatusCode.OK;
                        resolve(that);
                    }
                    else {
                        var uri = unescape(data['@id']);
                        that.data = data;
                        that._parseAuthServices(that.data);
                        // remove trailing /info.json
                        if (uri.endsWith('/info.json')) {
                            uri = uri.substr(0, uri.lastIndexOf('/'));
                        }
                        var dataUri = that.dataUri;
                        if (dataUri && dataUri.endsWith('/info.json')) {
                            dataUri = dataUri.substr(0, dataUri.lastIndexOf('/'));
                        }
                        // if the request was redirected to a degraded version and there's a login service to get the full quality version
                        if (uri !== dataUri && that.loginService) {
                            that.status = HTTPStatusCode.MOVED_TEMPORARILY;
                        }
                        else {
                            that.status = HTTPStatusCode.OK;
                        }
                        resolve(that);
                    }
                }).fail(function (error) {
                    that.status = error.status;
                    that.error = error;
                    if (error.responseJSON) {
                        that._parseAuthServices(error.responseJSON);
                    }
                    resolve(that);
                });
            });
        };
        return ExternalResource;
    }());
    Manifold.ExternalResource = ExternalResource;
})(Manifold || (Manifold = {}));

var Manifold;
(function (Manifold) {
    var Helper = /** @class */ (function () {
        function Helper(options) {
            this.options = options;
            this.iiifResource = this.options.iiifResource;
            this.iiifResourceUri = this.options.iiifResourceUri;
            this.manifest = this.options.manifest;
            this.collectionIndex = this.options.collectionIndex || 0;
            this.manifestIndex = this.options.manifestIndex || 0;
            this.sequenceIndex = this.options.sequenceIndex || 0;
            this.canvasIndex = this.options.canvasIndex || 0;
        }
        // getters //
        Helper.prototype.getAutoCompleteService = function () {
            var service = this.getSearchService();
            if (service) {
                return service.getService(manifesto.ServiceProfile.autoComplete());
            }
            return null;
        };
        Helper.prototype.getAttribution = function () {
            var attribution = this.manifest.getAttribution();
            if (attribution) {
                return Manifesto.TranslationCollection.getValue(attribution, this.options.locale);
            }
            return null;
        };
        Helper.prototype.getCanvases = function () {
            return this.getCurrentSequence().getCanvases();
        };
        Helper.prototype.getCanvasById = function (id) {
            return this.getCurrentSequence().getCanvasById(id);
        };
        Helper.prototype.getCanvasesById = function (ids) {
            var canvases = [];
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var canvas = this.getCanvasById(id);
                if (canvas) {
                    canvases.push(canvas);
                }
            }
            return canvases;
        };
        Helper.prototype.getCanvasByIndex = function (index) {
            return this.getCurrentSequence().getCanvasByIndex(index);
        };
        Helper.prototype.getCanvasIndexById = function (id) {
            return this.getCurrentSequence().getCanvasIndexById(id);
        };
        Helper.prototype.getCanvasIndexByLabel = function (label) {
            var foliated = this.getManifestType().toString() === manifesto.ManifestType.manuscript().toString();
            return this.getCurrentSequence().getCanvasIndexByLabel(label, foliated);
        };
        Helper.prototype.getCanvasRange = function (canvas, path) {
            var ranges = this.getCanvasRanges(canvas);
            if (path) {
                for (var i = 0; i < ranges.length; i++) {
                    var range = ranges[i];
                    if (range.path === path) {
                        return range;
                    }
                }
                return null;
            }
            else {
                return ranges[0]; // else return the first range
            }
        };
        Helper.prototype.getCanvasRanges = function (canvas) {
            if (canvas.ranges) {
                return canvas.ranges; // cache
            }
            else {
                canvas.ranges = this.manifest.getAllRanges().en().where(function (range) { return (range.getCanvasIds().en().any(function (c) { return manifesto.Utils.normaliseUrl(c) === manifesto.Utils.normaliseUrl(canvas.id); })); }).toArray();
            }
            return canvas.ranges;
        };
        Helper.prototype.getCollectionIndex = function (iiifResource) {
            // todo: support nested collections. walk up parents adding to array and return csv string.
            var index = null;
            if (iiifResource.parentCollection) {
                index = iiifResource.parentCollection.index;
            }
            return index;
        };
        Helper.prototype.getCurrentCanvas = function () {
            return this.getCurrentSequence().getCanvasByIndex(this.canvasIndex);
        };
        Helper.prototype.getCurrentSequence = function () {
            return this.getSequenceByIndex(this.sequenceIndex);
        };
        Helper.prototype.getDescription = function () {
            var description = this.manifest.getDescription();
            if (description) {
                return Manifesto.TranslationCollection.getValue(description, this.options.locale);
            }
            return null;
        };
        Helper.prototype.getFirstPageIndex = function () {
            return 0;
        };
        Helper.prototype.getLabel = function () {
            var label = this.manifest.getLabel();
            if (label) {
                return Manifesto.TranslationCollection.getValue(label, this.options.locale);
            }
            return null;
        };
        Helper.prototype.getLastCanvasLabel = function (alphanumeric) {
            return this.getCurrentSequence().getLastCanvasLabel(alphanumeric);
        };
        Helper.prototype.getLastPageIndex = function () {
            return this.getTotalCanvases() - 1;
        };
        Helper.prototype.getLicense = function () {
            return this.manifest.getLicense();
        };
        Helper.prototype.getLogo = function () {
            return this.manifest.getLogo();
        };
        Helper.prototype.getManifestType = function () {
            var manifestType = this.manifest.getManifestType();
            // default to monograph
            if (manifestType.toString() === "") {
                manifestType = manifesto.ManifestType.monograph();
            }
            return manifestType;
        };
        Helper.prototype.getMetadata = function (options) {
            var metadataGroups = [];
            var manifestMetadata = this.manifest.getMetadata();
            var manifestGroup = new Manifold.MetadataGroup(this.manifest);
            if (manifestMetadata && manifestMetadata.length) {
                manifestGroup.addMetadata(manifestMetadata, true);
            }
            if (this.manifest.getDescription().length) {
                var metadataItem = new Manifesto.MetadataItem(this.options.locale);
                metadataItem.label = [new Manifesto.Translation("description", this.options.locale)];
                metadataItem.value = this.manifest.getDescription();
                metadataItem.isRootLevel = true;
                manifestGroup.addItem(metadataItem);
            }
            if (this.manifest.getAttribution().length) {
                var metadataItem = new Manifesto.MetadataItem(this.options.locale);
                metadataItem.label = [new Manifesto.Translation("attribution", this.options.locale)];
                metadataItem.value = this.manifest.getAttribution();
                metadataItem.isRootLevel = true;
                manifestGroup.addItem(metadataItem);
            }
            var license = this.manifest.getLicense();
            if (license) {
                var item = {
                    label: "license",
                    value: (options && options.licenseFormatter) ? options.licenseFormatter.format(license) : license
                };
                var metadataItem = new Manifesto.MetadataItem(this.options.locale);
                metadataItem.parse(item);
                metadataItem.isRootLevel = true;
                manifestGroup.addItem(metadataItem);
            }
            if (this.manifest.getLogo()) {
                var item = {
                    label: "logo",
                    value: '<img src="' + this.manifest.getLogo() + '"/>'
                };
                var metadataItem = new Manifesto.MetadataItem(this.options.locale);
                metadataItem.parse(item);
                metadataItem.isRootLevel = true;
                manifestGroup.addItem(metadataItem);
            }
            metadataGroups.push(manifestGroup);
            if (options) {
                return this._parseMetadataOptions(options, metadataGroups);
            }
            else {
                return metadataGroups;
            }
        };
        Helper.prototype._parseMetadataOptions = function (options, metadataGroups) {
            // get sequence metadata
            var sequence = this.getCurrentSequence();
            var sequenceMetadata = sequence.getMetadata();
            if (sequenceMetadata && sequenceMetadata.length) {
                var sequenceGroup = new Manifold.MetadataGroup(sequence);
                sequenceGroup.addMetadata(sequenceMetadata);
                metadataGroups.push(sequenceGroup);
            }
            // get range metadata
            if (options.range) {
                var rangeGroups = this._getRangeMetadata([], options.range);
                rangeGroups = rangeGroups.reverse();
                metadataGroups = metadataGroups.concat(rangeGroups);
            }
            // get canvas metadata
            if (options.canvases && options.canvases.length) {
                for (var i = 0; i < options.canvases.length; i++) {
                    var canvas = options.canvases[i];
                    var canvasMetadata = canvas.getMetadata();
                    if (canvasMetadata && canvasMetadata.length) {
                        var canvasGroup = new Manifold.MetadataGroup(canvas);
                        canvasGroup.addMetadata(canvas.getMetadata());
                        metadataGroups.push(canvasGroup);
                    }
                    // add image metadata
                    var images = canvas.getImages();
                    for (var j = 0; j < images.length; j++) {
                        var image = images[j];
                        var imageMetadata = image.getMetadata();
                        if (imageMetadata && imageMetadata.length) {
                            var imageGroup = new Manifold.MetadataGroup(image);
                            imageGroup.addMetadata(imageMetadata);
                            metadataGroups.push(imageGroup);
                        }
                    }
                }
            }
            return metadataGroups;
        };
        Helper.prototype._getRangeMetadata = function (metadataGroups, range) {
            var rangeMetadata = range.getMetadata();
            if (rangeMetadata && rangeMetadata.length) {
                var rangeGroup = new Manifold.MetadataGroup(range);
                rangeGroup.addMetadata(rangeMetadata);
                metadataGroups.push(rangeGroup);
            }
            if (range.parentRange) {
                return this._getRangeMetadata(metadataGroups, range.parentRange);
            }
            else {
                return metadataGroups;
            }
        };
        Helper.prototype.getMultiSelectState = function () {
            if (!this._multiSelectState) {
                this._multiSelectState = new Manifold.MultiSelectState();
                this._multiSelectState.ranges = this.getRanges().slice(0);
                this._multiSelectState.canvases = this.getCurrentSequence().getCanvases().slice(0);
            }
            return this._multiSelectState;
        };
        Helper.prototype.getCurrentRange = function () {
            if (this.rangeId) {
                return this.getRangeById(this.rangeId);
            }
            return null;
        };
        Helper.prototype.getPreviousRange = function (range) {
            var currentRange = null;
            if (range) {
                currentRange = range;
            }
            else {
                currentRange = this.getCurrentRange();
            }
            if (currentRange) {
                var flatTree = this.getFlattenedTree();
                for (var i = 0; i < flatTree.length; i++) {
                    var node = flatTree[i];
                    // find current range in flattened tree
                    if (node.data.id === currentRange.id) {
                        // find the first node before it that has canvases
                        while (i > 0) {
                            i--;
                            var prevNode = flatTree[i];
                            return prevNode.data;
                        }
                        break;
                    }
                }
            }
            return null;
        };
        Helper.prototype.getNextRange = function (range) {
            // if a range is passed, use that. otherwise get the current range.
            var currentRange = null;
            if (range) {
                currentRange = range;
            }
            else {
                currentRange = this.getCurrentRange();
            }
            if (currentRange) {
                var flatTree = this.getFlattenedTree();
                for (var i = 0; i < flatTree.length; i++) {
                    var node = flatTree[i];
                    // find current range in flattened tree
                    if (node.data.id === currentRange.id) {
                        // find the first node after it that has canvases
                        while (i < flatTree.length - 1) {
                            i++;
                            var nextNode = flatTree[i];
                            if (nextNode.data.canvases && nextNode.data.canvases.length) {
                                return nextNode.data;
                            }
                        }
                        break;
                    }
                }
            }
            return null;
        };
        Helper.prototype.getFlattenedTree = function () {
            return this._flattenTree(this.getTree(), 'nodes');
        };
        Helper.prototype._flattenTree = function (root, key) {
            var _this = this;
            var flatten = [Object.assign({}, root)];
            delete flatten[0][key];
            if (root[key] && root[key].length > 0) {
                return flatten.concat(root[key]
                    .map(function (child) { return _this._flattenTree(child, key); })
                    .reduce(function (a, b) { return a.concat(b); }, []));
            }
            return flatten;
        };
        Helper.prototype.getRanges = function () {
            return this.manifest.getAllRanges();
        };
        Helper.prototype.getRangeByPath = function (path) {
            return this.manifest.getRangeByPath(path);
        };
        Helper.prototype.getRangeById = function (id) {
            return this.manifest.getRangeById(id);
        };
        Helper.prototype.getRangeCanvases = function (range) {
            var ids = range.getCanvasIds();
            return this.getCanvasesById(ids);
        };
        Helper.prototype.getRelated = function () {
            return this.manifest.getRelated();
        };
        Helper.prototype.getSearchService = function () {
            return this.manifest.getService(manifesto.ServiceProfile.search());
        };
        Helper.prototype.getSeeAlso = function () {
            return this.manifest.getSeeAlso();
        };
        Helper.prototype.getSequenceByIndex = function (index) {
            return this.manifest.getSequenceByIndex(index);
        };
        Helper.prototype.getShareServiceUrl = function () {
            var url = null;
            var shareService = this.manifest.getService(manifesto.ServiceProfile.shareExtensions());
            if (shareService) {
                if (shareService.length) {
                    shareService = shareService[0];
                }
                url = shareService.__jsonld.shareUrl;
            }
            return url;
        };
        Helper.prototype.getSortedTreeNodesByDate = function (sortedTree, tree) {
            var all = tree.nodes.en().traverseUnique(function (node) { return node.nodes; })
                .where(function (n) { return n.data.type === manifesto.TreeNodeType.collection().toString() ||
                n.data.type === manifesto.TreeNodeType.manifest().toString(); }).toArray();
            //var collections: ITreeNode[] = tree.nodes.en().traverseUnique(n => n.nodes)
            //    .where((n) => n.data.type === ITreeNodeType.collection().toString()).toArray();
            var manifests = tree.nodes.en().traverseUnique(function (n) { return n.nodes; })
                .where(function (n) { return n.data.type === manifesto.TreeNodeType.manifest().toString(); }).toArray();
            this.createDecadeNodes(sortedTree, all);
            this.sortDecadeNodes(sortedTree);
            this.createYearNodes(sortedTree, all);
            this.sortYearNodes(sortedTree);
            this.createMonthNodes(sortedTree, manifests);
            this.sortMonthNodes(sortedTree);
            this.createDateNodes(sortedTree, manifests);
            this.pruneDecadeNodes(sortedTree);
        };
        Helper.prototype.getStartCanvasIndex = function () {
            return this.getCurrentSequence().getStartCanvasIndex();
        };
        Helper.prototype.getThumbs = function (width, height) {
            return this.getCurrentSequence().getThumbs(width, height);
        };
        Helper.prototype.getTopRanges = function () {
            return this.manifest.getTopRanges();
        };
        Helper.prototype.getTotalCanvases = function () {
            return this.getCurrentSequence().getTotalCanvases();
        };
        Helper.prototype.getTrackingLabel = function () {
            return this.manifest.getTrackingLabel();
        };
        Helper.prototype._getTopRanges = function () {
            return this.iiifResource.getTopRanges();
        };
        Helper.prototype.getTree = function (topRangeIndex, sortType) {
            // if it's a collection, use IIIFResource.getDefaultTree()
            // otherwise, get the top range by index and use Range.getTree()
            if (topRangeIndex === void 0) { topRangeIndex = 0; }
            if (sortType === void 0) { sortType = Manifold.TreeSortType.NONE; }
            if (!this.iiifResource) {
                return null;
            }
            var tree;
            if (this.iiifResource.isCollection()) {
                tree = this.iiifResource.getDefaultTree();
            }
            else {
                var topRanges = this._getTopRanges();
                var root = new manifesto.TreeNode();
                root.label = 'root';
                root.data = this.iiifResource;
                if (topRanges.length) {
                    var range = topRanges[topRangeIndex];
                    tree = range.getTree(root);
                }
                else {
                    return root;
                }
            }
            var sortedTree = new manifesto.TreeNode();
            switch (sortType.toString()) {
                case Manifold.TreeSortType.DATE.toString():
                    // returns a list of treenodes for each decade.
                    // expanding a decade generates a list of years
                    // expanding a year gives a list of months containing issues
                    // expanding a month gives a list of issues.
                    if (this.treeHasNavDates(tree)) {
                        this.getSortedTreeNodesByDate(sortedTree, tree);
                        break;
                    }
                default:
                    sortedTree = tree;
            }
            return sortedTree;
        };
        Helper.prototype.treeHasNavDates = function (tree) {
            var node = tree.nodes.en().traverseUnique(function (node) { return node.nodes; }).where(function (n) { return !isNaN(n.navDate); }).first();
            return (node) ? true : false;
        };
        Helper.prototype.getViewingDirection = function () {
            var viewingDirection = this.getCurrentSequence().getViewingDirection();
            if (!viewingDirection) {
                viewingDirection = this.manifest.getViewingDirection();
            }
            return viewingDirection;
        };
        Helper.prototype.getViewingHint = function () {
            var viewingHint = this.getCurrentSequence().getViewingHint();
            if (!viewingHint) {
                viewingHint = this.manifest.getViewingHint();
            }
            return viewingHint;
        };
        // inquiries //
        Helper.prototype.hasParentCollection = function () {
            return !!this.manifest.parentCollection;
        };
        Helper.prototype.hasRelatedPage = function () {
            var related = this.getRelated();
            if (!related)
                return false;
            if (related.length) {
                related = related[0];
            }
            return related['format'] === 'text/html';
        };
        Helper.prototype.hasResources = function () {
            var canvas = this.getCurrentCanvas();
            return canvas.getResources().length > 0;
        };
        Helper.prototype.isBottomToTop = function () {
            var viewingDirection = this.getViewingDirection();
            if (viewingDirection) {
                return viewingDirection.toString() === manifesto.ViewingDirection.bottomToTop().toString();
            }
            return false;
        };
        Helper.prototype.isCanvasIndexOutOfRange = function (index) {
            return this.getCurrentSequence().isCanvasIndexOutOfRange(index);
        };
        Helper.prototype.isContinuous = function () {
            var viewingHint = this.getViewingHint();
            if (viewingHint) {
                return viewingHint.toString() === manifesto.ViewingHint.continuous().toString();
            }
            return false;
        };
        Helper.prototype.isFirstCanvas = function (index) {
            if (typeof index !== 'undefined') {
                return this.getCurrentSequence().isFirstCanvas(index);
            }
            return this.getCurrentSequence().isFirstCanvas(this.canvasIndex);
        };
        Helper.prototype.isHorizontallyAligned = function () {
            return this.isLeftToRight() || this.isRightToLeft();
        };
        Helper.prototype.isLastCanvas = function (index) {
            if (typeof index !== 'undefined') {
                return this.getCurrentSequence().isLastCanvas(index);
            }
            return this.getCurrentSequence().isLastCanvas(this.canvasIndex);
        };
        Helper.prototype.isLeftToRight = function () {
            var viewingDirection = this.getViewingDirection();
            if (viewingDirection) {
                return viewingDirection.toString() === manifesto.ViewingDirection.leftToRight().toString();
            }
            return false;
        };
        Helper.prototype.isMultiCanvas = function () {
            return this.getCurrentSequence().isMultiCanvas();
        };
        Helper.prototype.isMultiSequence = function () {
            return this.manifest.isMultiSequence();
        };
        Helper.prototype.isPaged = function () {
            var viewingHint = this.getViewingHint();
            if (viewingHint) {
                return viewingHint.toString() === manifesto.ViewingHint.paged().toString();
            }
            return false;
        };
        Helper.prototype.isPagingAvailable = function () {
            // paged mode is useless unless you have at least 3 pages...
            return this.isPagingEnabled() && this.getTotalCanvases() > 2;
        };
        Helper.prototype.isPagingEnabled = function () {
            return (this.manifest.isPagingEnabled() || this.getCurrentSequence().isPagingEnabled());
        };
        Helper.prototype.isRightToLeft = function () {
            var viewingDirection = this.getViewingDirection();
            if (viewingDirection) {
                return viewingDirection.toString() === manifesto.ViewingDirection.rightToLeft().toString();
            }
            return false;
        };
        Helper.prototype.isTopToBottom = function () {
            var viewingDirection = this.getViewingDirection();
            if (viewingDirection) {
                return viewingDirection.toString() === manifesto.ViewingDirection.topToBottom().toString();
            }
            return false;
        };
        Helper.prototype.isTotalCanvasesEven = function () {
            return this.getCurrentSequence().isTotalCanvasesEven();
        };
        Helper.prototype.isUIEnabled = function (name) {
            var uiExtensions = this.manifest.getService(manifesto.ServiceProfile.uiExtensions());
            if (uiExtensions) {
                var disableUI = uiExtensions.getProperty('disableUI');
                if (disableUI) {
                    if (disableUI.indexOf(name) !== -1 || disableUI.indexOf(name.toLowerCase()) !== -1) {
                        return false;
                    }
                }
            }
            return true;
        };
        Helper.prototype.isVerticallyAligned = function () {
            return this.isTopToBottom() || this.isBottomToTop();
        };
        // dates //     
        Helper.prototype.createDateNodes = function (rootNode, nodes) {
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var year = this.getNodeYear(node);
                var month = this.getNodeMonth(node);
                var dateNode = new manifesto.TreeNode();
                dateNode.id = node.id;
                dateNode.label = this.getNodeDisplayDate(node);
                dateNode.data = node.data;
                dateNode.data.type = manifesto.TreeNodeType.manifest().toString();
                dateNode.data.year = year;
                dateNode.data.month = month;
                var decadeNode = this.getDecadeNode(rootNode, year);
                if (decadeNode) {
                    var yearNode = this.getYearNode(decadeNode, year);
                    if (yearNode) {
                        var monthNode = this.getMonthNode(yearNode, month);
                        if (monthNode) {
                            monthNode.addNode(dateNode);
                        }
                    }
                }
            }
        };
        Helper.prototype.createDecadeNodes = function (rootNode, nodes) {
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var year = this.getNodeYear(node);
                var endYear = Number(year.toString().substr(0, 3) + "9");
                if (!this.getDecadeNode(rootNode, year)) {
                    var decadeNode = new manifesto.TreeNode();
                    decadeNode.label = year + " - " + endYear;
                    decadeNode.navDate = node.navDate;
                    decadeNode.data.startYear = year;
                    decadeNode.data.endYear = endYear;
                    rootNode.addNode(decadeNode);
                }
            }
        };
        Helper.prototype.createMonthNodes = function (rootNode, nodes) {
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var year = this.getNodeYear(node);
                var month = this.getNodeMonth(node);
                var decadeNode = this.getDecadeNode(rootNode, year);
                var yearNode = null;
                if (decadeNode) {
                    yearNode = this.getYearNode(decadeNode, year);
                }
                if (decadeNode && yearNode && !this.getMonthNode(yearNode, month)) {
                    var monthNode = new manifesto.TreeNode();
                    monthNode.label = this.getNodeDisplayMonth(node);
                    monthNode.navDate = node.navDate;
                    monthNode.data.year = year;
                    monthNode.data.month = month;
                    yearNode.addNode(monthNode);
                }
            }
        };
        Helper.prototype.createYearNodes = function (rootNode, nodes) {
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var year = this.getNodeYear(node);
                var decadeNode = this.getDecadeNode(rootNode, year);
                if (decadeNode && !this.getYearNode(decadeNode, year)) {
                    var yearNode = new manifesto.TreeNode();
                    yearNode.label = year.toString();
                    yearNode.navDate = node.navDate;
                    yearNode.data.year = year;
                    decadeNode.addNode(yearNode);
                }
            }
        };
        Helper.prototype.getDecadeNode = function (rootNode, year) {
            for (var i = 0; i < rootNode.nodes.length; i++) {
                var n = rootNode.nodes[i];
                if (year >= n.data.startYear && year <= n.data.endYear)
                    return n;
            }
            return null;
        };
        Helper.prototype.getMonthNode = function (yearNode, month) {
            for (var i = 0; i < yearNode.nodes.length; i++) {
                var n = yearNode.nodes[i];
                if (month === this.getNodeMonth(n))
                    return n;
            }
            return null;
        };
        Helper.prototype.getNodeDisplayDate = function (node) {
            return node.navDate.toDateString();
        };
        Helper.prototype.getNodeDisplayMonth = function (node) {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return months[node.navDate.getMonth()];
        };
        Helper.prototype.getNodeMonth = function (node) {
            return node.navDate.getMonth();
        };
        Helper.prototype.getNodeYear = function (node) {
            return node.navDate.getFullYear();
        };
        Helper.prototype.getYearNode = function (decadeNode, year) {
            for (var i = 0; i < decadeNode.nodes.length; i++) {
                var n = decadeNode.nodes[i];
                if (year === this.getNodeYear(n))
                    return n;
            }
            return null;
        };
        // delete any empty decades
        Helper.prototype.pruneDecadeNodes = function (rootNode) {
            var pruned = [];
            for (var i = 0; i < rootNode.nodes.length; i++) {
                var n = rootNode.nodes[i];
                if (!n.nodes.length) {
                    pruned.push(n);
                }
            }
            for (var j = 0; j < pruned.length; j++) {
                var p = pruned[j];
                var index = rootNode.nodes.indexOf(p);
                if (index > -1) {
                    rootNode.nodes.splice(index, 1);
                }
            }
        };
        Helper.prototype.sortDecadeNodes = function (rootNode) {
            rootNode.nodes = rootNode.nodes.sort(function (a, b) {
                return a.data.startYear - b.data.startYear;
            });
        };
        Helper.prototype.sortMonthNodes = function (rootNode) {
            var _this = this;
            for (var i = 0; i < rootNode.nodes.length; i++) {
                var decadeNode = rootNode.nodes[i];
                for (var j = 0; j < decadeNode.nodes.length; j++) {
                    var monthNode = decadeNode.nodes[j];
                    monthNode.nodes = monthNode.nodes.sort(function (a, b) {
                        return _this.getNodeMonth(a) - _this.getNodeMonth(b);
                    });
                }
            }
        };
        Helper.prototype.sortYearNodes = function (rootNode) {
            var _this = this;
            for (var i = 0; i < rootNode.nodes.length; i++) {
                var decadeNode = rootNode.nodes[i];
                decadeNode.nodes = decadeNode.nodes.sort(function (a, b) {
                    return (_this.getNodeYear(a) - _this.getNodeYear(b));
                });
            }
        };
        return Helper;
    }());
    Manifold.Helper = Helper;
})(Manifold || (Manifold = {}));










/// <reference types="manifesto.js" />
/// <reference types="http-status-codes" />
var Manifold;
(function (Manifold) {
    function loadManifest(options) {
        var bootstrapper = new Manifold.Bootstrapper(options);
        return bootstrapper.bootstrap();
    }
    Manifold.loadManifest = loadManifest;
})(Manifold || (Manifold = {}));
(function (g) {
    if (!g.Manifold) {
        g.Manifold = Manifold;
    }
})(global);

var Manifold;
(function (Manifold) {
    var MetadataGroup = /** @class */ (function () {
        function MetadataGroup(resource, label) {
            this.items = [];
            this.resource = resource;
            this.label = label;
        }
        MetadataGroup.prototype.addItem = function (item) {
            this.items.push(item);
        };
        MetadataGroup.prototype.addMetadata = function (metadata, isRootLevel) {
            if (isRootLevel === void 0) { isRootLevel = false; }
            for (var i = 0; i < metadata.length; i++) {
                var item = metadata[i];
                item.isRootLevel = isRootLevel;
                this.addItem(item);
            }
        };
        return MetadataGroup;
    }());
    Manifold.MetadataGroup = MetadataGroup;
})(Manifold || (Manifold = {}));

var Manifold;
(function (Manifold) {
    var MetadataOptions = /** @class */ (function () {
        function MetadataOptions() {
        }
        return MetadataOptions;
    }());
    Manifold.MetadataOptions = MetadataOptions;
})(Manifold || (Manifold = {}));

var Manifold;
(function (Manifold) {
    var MultiSelectState = /** @class */ (function () {
        function MultiSelectState() {
            this.isEnabled = false;
            this.ranges = [];
            this.canvases = [];
        }
        MultiSelectState.prototype.allCanvasesSelected = function () {
            return this.canvases.length > 0 && this.getAllSelectedCanvases().length === this.canvases.length;
        };
        MultiSelectState.prototype.allRangesSelected = function () {
            return this.ranges.length > 0 && this.getAllSelectedRanges().length === this.ranges.length;
        };
        MultiSelectState.prototype.allSelected = function () {
            return this.allRangesSelected() && this.allCanvasesSelected();
        };
        MultiSelectState.prototype.getAll = function () {
            return this.canvases.concat(this.ranges);
        };
        MultiSelectState.prototype.getAllSelectedCanvases = function () {
            return this.canvases.en().where(function (c) { return c.multiSelected; }).toArray();
        };
        MultiSelectState.prototype.getAllSelectedRanges = function () {
            return this.ranges.en().where(function (r) { return r.multiSelected; }).toArray();
        };
        MultiSelectState.prototype.getCanvasById = function (id) {
            return this.canvases.en().where(function (c) { return c.id === id; }).first();
        };
        MultiSelectState.prototype.getCanvasesByIds = function (ids) {
            var canvases = [];
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                canvases.push(this.getCanvasById(id));
            }
            return canvases;
        };
        MultiSelectState.prototype.getRangeCanvases = function (range) {
            var ids = range.getCanvasIds();
            return this.getCanvasesByIds(ids);
        };
        MultiSelectState.prototype.selectAll = function (selected) {
            this.selectRanges(this.ranges, selected);
            this.selectCanvases(this.canvases, selected);
        };
        MultiSelectState.prototype.selectCanvas = function (canvas, selected) {
            var c = this.canvases.en().where(function (c) { return c.id === canvas.id; }).first();
            c.multiSelected = selected;
        };
        MultiSelectState.prototype.selectAllCanvases = function (selected) {
            this.selectCanvases(this.canvases, selected);
        };
        MultiSelectState.prototype.selectCanvases = function (canvases, selected) {
            for (var j = 0; j < canvases.length; j++) {
                var canvas = canvases[j];
                canvas.multiSelected = selected;
            }
        };
        MultiSelectState.prototype.selectRange = function (range, selected) {
            var r = this.ranges.en().where(function (r) { return r.id === range.id; }).first();
            r.multiSelected = selected;
            var canvases = this.getRangeCanvases(r);
            this.selectCanvases(canvases, selected);
        };
        MultiSelectState.prototype.selectAllRanges = function (selected) {
            this.selectRanges(this.ranges, selected);
        };
        MultiSelectState.prototype.selectRanges = function (ranges, selected) {
            for (var i = 0; i < ranges.length; i++) {
                var range = ranges[i];
                range.multiSelected = selected;
                var canvases = this.getCanvasesByIds(range.getCanvasIds());
                this.selectCanvases(canvases, selected);
            }
        };
        MultiSelectState.prototype.setEnabled = function (enabled) {
            this.isEnabled = enabled;
            var items = this.getAll();
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                item.multiSelectEnabled = this.isEnabled;
                if (!enabled) {
                    item.multiSelected = false;
                }
            }
        };
        return MultiSelectState;
    }());
    Manifold.MultiSelectState = MultiSelectState;
})(Manifold || (Manifold = {}));

var Manifold;
(function (Manifold) {
    var Translation = /** @class */ (function () {
        function Translation(value, locale) {
            this.value = value;
            this.locale = locale;
        }
        return Translation;
    }());
    Manifold.Translation = Translation;
})(Manifold || (Manifold = {}));

var Manifold;
(function (Manifold) {
    // This class formats URIs into HTML <a> links, applying labels when available
    var UriLabeller = /** @class */ (function () {
        function UriLabeller(labels) {
            this.labels = labels;
        }
        UriLabeller.prototype.format = function (url) {
            // if already a link, do nothing.
            if (url.indexOf('<a') != -1)
                return url;
            var label = (this.labels[url]) ? this.labels[url] : url;
            return '<a href="' + url + '">' + label + '</a>';
        };
        return UriLabeller;
    }());
    Manifold.UriLabeller = UriLabeller;
})(Manifold || (Manifold = {}));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
