"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalResource = void 0;
var dist_commonjs_1 = require("@iiif/vocabulary/dist-commonjs");
var HTTPStatusCode = __importStar(require("@edsilv/http-status-codes"));
var manifesto_js_1 = require("manifesto.js");
var ExternalResource = /** @class */ (function () {
    function ExternalResource(canvas, options) {
        this.authHoldingPage = null;
        this.clickThroughService = null;
        this.externalService = null;
        this.isProbed = false;
        this.isResponseHandled = false;
        this.kioskService = null;
        this.loginService = null;
        this.logoutService = null;
        this.probeService = null;
        this.restrictedService = null;
        this.tokenService = null;
        canvas.externalResource = this;
        this.dataUri = this._getDataUri(canvas);
        this.index = canvas.index;
        this.authAPIVersion = options.authApiVersion;
        this._parseAuthServices(canvas);
        // get the height and width of the image resource if available
        this._parseCanvasDimensions(canvas);
    }
    ExternalResource.prototype._getImageServiceDescriptor = function (services) {
        var infoUri = null;
        for (var i = 0; i < services.length; i++) {
            var service = services[i];
            var id = service.id;
            if (!id.endsWith("/")) {
                id += "/";
            }
            if (service.getProfile() && (manifesto_js_1.Utils.isImageProfile(service.getProfile()) || manifesto_js_1.Utils.isImageServiceType(service.getIIIFResourceType()))) {
                infoUri = id + "info.json";
            }
        }
        return infoUri;
    };
    ExternalResource.prototype._getDataUri = function (canvas) {
        var content = canvas.getContent();
        var images = canvas.getImages();
        var infoUri = null;
        console.log("_getDataUri");
        // presentation 3
        if (content && content.length) {
            var annotation = content[0];
            var annotationBody = annotation.getBody();
            if (annotationBody.length) {
                var body = annotationBody[0];
                var services = body.getServices();
                if (services.length) {
                    infoUri = this._getImageServiceDescriptor(services);
                    if (infoUri) {
                        return infoUri;
                    }
                }
                // no image services. return the image id
                return annotationBody[0].id;
            }
            return null;
        }
        else if (images && images.length) {
            // presentation 2
            var firstImage = images[0];
            var resource = firstImage.getResource();
            var services = resource.getServices();
            if (services.length) {
                infoUri = this._getImageServiceDescriptor(services);
                if (infoUri) {
                    return infoUri;
                }
            }
            // no image services. return the image id
            return resource.id;
        }
        else {
            // Legacy IxIF
            var service = canvas.getService(dist_commonjs_1.ServiceProfile.IXIF);
            if (service) {
                // todo: deprecate
                return service.getInfoUri();
            }
            // return the canvas id.
            return canvas.id;
        }
    };
    ExternalResource.prototype._parseAuthServices = function (resource) {
        if (this.authAPIVersion === 0.9) {
            this.clickThroughService = manifesto_js_1.Utils.getService(resource, dist_commonjs_1.ServiceProfile.AUTH_0_CLICK_THROUGH);
            this.loginService = manifesto_js_1.Utils.getService(resource, dist_commonjs_1.ServiceProfile.AUTH_0_LOGIN);
            this.restrictedService = manifesto_js_1.Utils.getService(resource, dist_commonjs_1.ServiceProfile.AUTH_0_RESTRICTED);
            if (this.clickThroughService) {
                this.logoutService = this.clickThroughService.getService(dist_commonjs_1.ServiceProfile.AUTH_0_LOGOUT);
                this.tokenService = this.clickThroughService.getService(dist_commonjs_1.ServiceProfile.AUTH_0_TOKEN);
            }
            else if (this.loginService) {
                this.logoutService = this.loginService.getService(dist_commonjs_1.ServiceProfile.AUTH_0_LOGOUT);
                this.tokenService = this.loginService.getService(dist_commonjs_1.ServiceProfile.AUTH_0_TOKEN);
            }
            else if (this.restrictedService) {
                this.logoutService = this.restrictedService.getService(dist_commonjs_1.ServiceProfile.AUTH_0_LOGOUT);
                this.tokenService = this.restrictedService.getService(dist_commonjs_1.ServiceProfile.AUTH_0_TOKEN);
            }
        }
        else {
            // auth 1
            // if the resource is a canvas, not an info.json, look for auth services on its content.
            if (resource.isCanvas !== undefined && resource.isCanvas()) {
                var content = resource.getContent();
                if (content && content.length) {
                    var body = content[0].getBody();
                    if (body && body.length) {
                        var annotation = body[0];
                        resource = annotation;
                    }
                }
            }
            this.clickThroughService = manifesto_js_1.Utils.getService(resource, dist_commonjs_1.ServiceProfile.AUTH_1_CLICK_THROUGH);
            this.loginService = manifesto_js_1.Utils.getService(resource, dist_commonjs_1.ServiceProfile.AUTH_1_LOGIN);
            this.externalService = manifesto_js_1.Utils.getService(resource, dist_commonjs_1.ServiceProfile.AUTH_1_EXTERNAL);
            this.kioskService = manifesto_js_1.Utils.getService(resource, dist_commonjs_1.ServiceProfile.AUTH_1_KIOSK);
            if (this.clickThroughService) {
                this.logoutService = this.clickThroughService.getService(dist_commonjs_1.ServiceProfile.AUTH_1_LOGOUT);
                this.tokenService = this.clickThroughService.getService(dist_commonjs_1.ServiceProfile.AUTH_1_TOKEN);
                this.probeService = this.clickThroughService.getService(dist_commonjs_1.ServiceProfile.AUTH_1_PROBE);
            }
            else if (this.loginService) {
                this.logoutService = this.loginService.getService(dist_commonjs_1.ServiceProfile.AUTH_1_LOGOUT);
                this.tokenService = this.loginService.getService(dist_commonjs_1.ServiceProfile.AUTH_1_TOKEN);
                this.probeService = manifesto_js_1.Utils.getService(resource, dist_commonjs_1.ServiceProfile.AUTH_1_PROBE);
                // @deprecated - the probe should be on the resource.
                if (!this.probeService) {
                    this.probeService = this.loginService.getService(dist_commonjs_1.ServiceProfile.AUTH_1_PROBE);
                }
            }
            else if (this.externalService) {
                this.logoutService = this.externalService.getService(dist_commonjs_1.ServiceProfile.AUTH_1_LOGOUT);
                this.tokenService = this.externalService.getService(dist_commonjs_1.ServiceProfile.AUTH_1_TOKEN);
                this.probeService = manifesto_js_1.Utils.getService(resource, dist_commonjs_1.ServiceProfile.AUTH_1_PROBE);
                // @deprecated - the probe should be on the resource.
                if (!this.probeService) {
                    this.probeService = this.externalService.getService(dist_commonjs_1.ServiceProfile.AUTH_1_PROBE);
                }
            }
            else if (this.kioskService) {
                this.logoutService = this.kioskService.getService(dist_commonjs_1.ServiceProfile.AUTH_1_LOGOUT);
                this.tokenService = this.kioskService.getService(dist_commonjs_1.ServiceProfile.AUTH_1_TOKEN);
                this.probeService = manifesto_js_1.Utils.getService(resource, dist_commonjs_1.ServiceProfile.AUTH_1_PROBE);
                // @deprecated - the probe should be on the resource.
                if (!this.probeService) {
                    this.probeService = this.kioskService.getService(dist_commonjs_1.ServiceProfile.AUTH_1_PROBE);
                }
            }
        }
    };
    ExternalResource.prototype._parseCanvasDimensions = function (canvas) {
        var images = canvas.getImages();
        if (images && images.length) {
            var firstImage = images[0];
            var resource = firstImage.getResource();
            this.width = resource.getWidth();
            this.height = resource.getHeight();
        }
        else {
            // presentation 3
            images = canvas.getContent();
            if (images.length) {
                var annotation = images[0];
                var body = annotation.getBody();
                if (body.length) {
                    this.width = body[0].getWidth();
                    this.height = body[0].getHeight();
                }
            }
        }
    };
    ExternalResource.prototype._parseDescriptorDimensions = function (descriptor) {
        if (descriptor.width !== undefined) {
            this.width = descriptor.width;
        }
        if (descriptor.height !== undefined) {
            this.height = descriptor.height;
        }
    };
    ExternalResource.prototype.isAccessControlled = function () {
        if (this.clickThroughService ||
            this.loginService ||
            this.externalService ||
            this.kioskService ||
            this.probeService) {
            return true;
        }
        return false;
    };
    ExternalResource.prototype.hasServiceDescriptor = function () {
        if (this.dataUri) {
            return this.dataUri.endsWith("info.json");
        }
        return false;
    };
    ExternalResource.prototype.getData = function (accessToken) {
        console.log("getData", this.dataUri);
        var that = this;
        that.data = {};
        return new Promise(function (resolve, reject) {
            if (!that.dataUri) {
                reject("There is no dataUri to fetch");
                return;
            }
            // if the resource has a probe service, use that to get http status code
            if (that.probeService) {
                that.isProbed = true;
                // leaving this in for reference until the XHR version is fully tested
                // $.ajax(<JQueryAjaxSettings>{
                //     url: that.probeService.id,
                //     type: 'GET',
                //     dataType: 'json',
                //     beforeSend: (xhr) => {
                //         if (accessToken) {
                //             xhr.setRequestHeader("Authorization", "Bearer " + accessToken.accessToken);
                //         }
                //     }
                // }).done((data: any) => {
                //     let contentLocation: string = unescape(data.contentLocation);
                //     if (contentLocation !== that.dataUri) {
                //         that.status = HTTPStatusCode.MOVED_TEMPORARILY;
                //     } else {
                //         that.status = HTTPStatusCode.OK;
                //     }
                //     resolve(that);
                // }).fail((error) => {
                //     that.status = error.status;
                //     that.error = error;
                //     resolve(that);
                // });
                // xhr implementation
                var xhr_1 = new XMLHttpRequest();
                xhr_1.open("GET", that.probeService.id, true);
                xhr_1.withCredentials = true;
                xhr_1.onload = function () {
                    var data = JSON.parse(xhr_1.responseText);
                    var contentLocation = unescape(data.contentLocation);
                    if (contentLocation !== that.dataUri) {
                        that.status = HTTPStatusCode.MOVED_TEMPORARILY;
                    }
                    else {
                        that.status = HTTPStatusCode.OK;
                    }
                    that.data = data;
                    resolve(that);
                };
                xhr_1.onerror = function () {
                    that.status = xhr_1.status;
                    resolve(that);
                };
                xhr_1.send();
            }
            else {
                // check if dataUri ends with info.json
                // if not issue a HEAD request.
                var type = "GET";
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
                    type = "HEAD";
                }
                // leaving this in for reference until the XHR version is fully tested
                // $.ajax(<JQueryAjaxSettings>{
                //     url: that.dataUri,
                //     type: type,
                //     dataType: 'json',
                //     beforeSend: (xhr) => {
                //         if (accessToken) {
                //             xhr.setRequestHeader("Authorization", "Bearer " + accessToken.accessToken);
                //         }
                //     }
                // }).done((data: any) => {
                //     // if it's a resource without an info.json
                //     // todo: if resource doesn't have a @profile
                //     if (!data) {
                //         that.status = HTTPStatusCode.OK;
                //         resolve(that);
                //     } else {
                //         let uri: string = unescape(data['@id']);
                //         that.data = data;
                //         that._parseAuthServices(that.data);
                //         // remove trailing /info.json
                //         if (uri.endsWith('/info.json')){
                //             uri = uri.substr(0, uri.lastIndexOf('/'));
                //         }
                //         let dataUri: string | null = that.dataUri;
                //         if (dataUri && dataUri.endsWith('/info.json')){
                //             dataUri = dataUri.substr(0, dataUri.lastIndexOf('/'));
                //         }
                //         // if the request was redirected to a degraded version and there's a login service to get the full quality version
                //         if (uri !== dataUri && that.loginService) {
                //             that.status = HTTPStatusCode.MOVED_TEMPORARILY;
                //         } else {
                //             that.status = HTTPStatusCode.OK;
                //         }
                //         resolve(that);
                //     }
                // }).fail((error) => {
                //     that.status = error.status;
                //     that.error = error;
                //     if (error.responseJSON){
                //         that._parseAuthServices(error.responseJSON);
                //     }
                //     resolve(that);
                // });
                // xhr implementation
                var xhr_2 = new XMLHttpRequest();
                xhr_2.open(type, that.dataUri, true);
                //xhr.withCredentials = true;
                if (accessToken) {
                    xhr_2.setRequestHeader("Authorization", "Bearer " + accessToken.accessToken);
                }
                xhr_2.onload = function () {
                    // if it's a resource without an info.json
                    // todo: if resource doesn't have a @profile
                    if (!xhr_2.responseText) {
                        that.status = HTTPStatusCode.OK;
                        resolve(that);
                    }
                    else {
                        var data = JSON.parse(xhr_2.responseText);
                        var uri = unescape(data["@id"]);
                        that.data = data;
                        that._parseAuthServices(that.data);
                        that._parseDescriptorDimensions(that.data);
                        // remove trailing /info.json
                        if (uri.endsWith("/info.json")) {
                            uri = uri.substr(0, uri.lastIndexOf("/"));
                        }
                        var dataUri = that.dataUri;
                        if (dataUri && dataUri.endsWith("/info.json")) {
                            dataUri = dataUri.substr(0, dataUri.lastIndexOf("/"));
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
                };
                xhr_2.onerror = function () {
                    that.status = xhr_2.status;
                    if (xhr_2.responseText) {
                        that._parseAuthServices(JSON.parse(xhr_2.responseText));
                    }
                    resolve(that);
                };
                xhr_2.send();
            }
        });
    };
    return ExternalResource;
}());
exports.ExternalResource = ExternalResource;
//# sourceMappingURL=TestExternalResource.js.map