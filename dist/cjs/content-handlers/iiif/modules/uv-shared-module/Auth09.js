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
exports.Auth09 = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var InformationArgs_1 = require("./InformationArgs");
var InformationType_1 = require("./InformationType");
var LoginWarningMessages_1 = require("./LoginWarningMessages");
var manifesto_js_1 = require("manifesto.js");
var utils_1 = require("@edsilv/utils");
var HTTPStatusCode = __importStar(require("@edsilv/http-status-codes"));
var Events_1 = require("../../../../Events");
var Auth09 = /** @class */ (function () {
    function Auth09() {
    }
    Auth09.loadExternalResources = function (resourcesToLoad, storageStrategy) {
        return new Promise(function (resolve) {
            manifesto_js_1.Utils.loadExternalResourcesAuth09(resourcesToLoad, storageStrategy, Auth09.clickThrough, Auth09.restricted, Auth09.login, Auth09.getAccessToken, Auth09.storeAccessToken, Auth09.getStoredAccessToken, Auth09.handleExternalResourceResponse)
                .then(function (r) {
                resolve(r);
            })["catch"](function (error) {
                switch (error.name) {
                    case manifesto_js_1.StatusCode.AUTHORIZATION_FAILED.toString():
                        Auth09.publish(IIIFEvents_1.IIIFEvents.LOGIN_FAILED);
                        break;
                    case manifesto_js_1.StatusCode.FORBIDDEN.toString():
                        Auth09.publish(IIIFEvents_1.IIIFEvents.FORBIDDEN);
                        break;
                    case manifesto_js_1.StatusCode.RESTRICTED.toString():
                        // do nothing
                        break;
                    default:
                        Auth09.publish(IIIFEvents_1.IIIFEvents.SHOW_MESSAGE, [error.message || error]);
                }
            });
        });
    };
    Auth09.clickThrough = function (resource) {
        return new Promise(function (resolve) {
            Auth09.publish(IIIFEvents_1.IIIFEvents.SHOW_CLICKTHROUGH_DIALOGUE, [
                {
                    resource: resource,
                    acceptCallback: function () {
                        if (resource.clickThroughService) {
                            var win_1 = window.open(resource.clickThroughService.id);
                            var pollTimer_1 = window.setInterval(function () {
                                if (win_1 && win_1.closed) {
                                    window.clearInterval(pollTimer_1);
                                    Auth09.publish(IIIFEvents_1.IIIFEvents.CLICKTHROUGH);
                                    resolve();
                                }
                            }, 500);
                        }
                    },
                },
            ]);
        });
    };
    Auth09.restricted = function (resource) {
        return new Promise(function (resolve, reject) {
            Auth09.publish(IIIFEvents_1.IIIFEvents.SHOW_RESTRICTED_DIALOGUE, [
                {
                    resource: resource,
                    acceptCallback: function () {
                        Auth09.publish(Events_1.Events.LOAD_FAILED);
                        reject(resource);
                    },
                },
            ]);
        });
    };
    Auth09.login = function (resource) {
        return new Promise(function (resolve) {
            var options = {};
            if (resource.status === HTTPStatusCode.FORBIDDEN) {
                options.warningMessage = LoginWarningMessages_1.LoginWarningMessages.FORBIDDEN;
                options.showCancelButton = true;
            }
            Auth09.publish(IIIFEvents_1.IIIFEvents.SHOW_LOGIN_DIALOGUE, [
                {
                    resource: resource,
                    loginCallback: function () {
                        if (resource.loginService) {
                            var win_2 = window.open(resource.loginService.id + "?t=" + new Date().getTime());
                            var pollTimer_2 = window.setInterval(function () {
                                if (win_2 && win_2.closed) {
                                    window.clearInterval(pollTimer_2);
                                    Auth09.publish(IIIFEvents_1.IIIFEvents.LOGIN);
                                    resolve();
                                }
                            }, 500);
                        }
                    },
                    logoutCallback: function () {
                        if (resource.logoutService) {
                            var win_3 = window.open(resource.logoutService.id + "?t=" + new Date().getTime());
                            var pollTimer_3 = window.setInterval(function () {
                                if (win_3 && win_3.closed) {
                                    window.clearInterval(pollTimer_3);
                                    Auth09.publish(IIIFEvents_1.IIIFEvents.LOGOUT);
                                    resolve();
                                }
                            }, 500);
                        }
                    },
                    options: options,
                },
            ]);
        });
    };
    Auth09.getAccessToken = function (resource, rejectOnError) {
        return new Promise(function (resolve, reject) {
            if (resource.tokenService) {
                var serviceUri = resource.tokenService.id;
                // pick an identifier for this message. We might want to keep track of sent messages
                var msgId = serviceUri + "|" + new Date().getTime();
                var receiveAccessToken_1 = function (e) {
                    window.removeEventListener("message", receiveAccessToken_1);
                    var token = e.data;
                    if (token.error) {
                        if (rejectOnError) {
                            reject(token.errorDescription);
                        }
                        else {
                            reject(undefined);
                        }
                    }
                    else {
                        resolve(token);
                    }
                };
                window.addEventListener("message", receiveAccessToken_1, false);
                var tokenUri = serviceUri + "?messageId=" + msgId;
                $("#commsFrame").prop("src", tokenUri);
            }
            else {
                reject("Token service not found");
            }
        });
    };
    Auth09.storeAccessToken = function (resource, token, storageStrategy) {
        return new Promise(function (resolve, reject) {
            if (resource.tokenService) {
                utils_1.Storage.set(resource.tokenService.id, token, token.expiresIn, storageStrategy);
                resolve();
            }
            else {
                reject("Token service not found");
            }
        });
    };
    Auth09.getStoredAccessToken = function (resource, storageStrategy) {
        return new Promise(function (resolve, _reject) {
            var foundItems = [];
            var item = null;
            // try to match on the tokenService, if the resource has one:
            if (resource.tokenService) {
                item = utils_1.Storage.get(resource.tokenService.id, storageStrategy);
            }
            if (item) {
                foundItems.push(item);
            }
            else {
                // find an access token for the domain
                var domain = utils_1.Urls.getUrlParts(resource.dataUri)
                    .hostname;
                var items = utils_1.Storage.getItems(storageStrategy);
                for (var i = 0; i < items.length; i++) {
                    item = items[i];
                    if (item.key.includes(domain)) {
                        foundItems.push(item);
                    }
                }
            }
            // sort by expiresAt, earliest to most recent.
            foundItems = foundItems.sort(function (a, b) {
                return a.expiresAt - b.expiresAt;
            });
            var foundToken;
            if (foundItems.length) {
                foundToken = foundItems[foundItems.length - 1].value;
                resolve(foundToken);
            }
        });
    };
    Auth09.handleExternalResourceResponse = function (resource) {
        return new Promise(function (resolve, reject) {
            resource.isResponseHandled = true;
            if (resource.status === HTTPStatusCode.OK) {
                resolve(resource);
            }
            else if (resource.status === HTTPStatusCode.MOVED_TEMPORARILY) {
                resolve(resource);
                Auth09.publish(IIIFEvents_1.IIIFEvents.RESOURCE_DEGRADED, [resource]);
            }
            else {
                if (resource.error.status === HTTPStatusCode.UNAUTHORIZED ||
                    resource.error.status === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
                    // if the browser doesn't support CORS
                    // if (!Modernizr.cors) {
                    //     const informationArgs: InformationArgs = new InformationArgs(InformationType.AUTH_CORS_ERROR, null);
                    //     Auth09.publish(BaseEvents.SHOW_INFORMATION, [informationArgs]);
                    //     resolve(resource);
                    // } else {
                    // commented above because only supporting IE11 upwards which has CORS
                    reject(resource.error.statusText);
                    //}
                }
                else if (resource.error.status === HTTPStatusCode.FORBIDDEN) {
                    var error = new Error();
                    error.message = "Forbidden";
                    error.name = manifesto_js_1.StatusCode.FORBIDDEN.toString();
                    reject(error);
                }
                else {
                    reject(resource.error.statusText);
                }
            }
        });
    };
    Auth09.handleDegraded = function (resource) {
        var informationArgs = new InformationArgs_1.InformationArgs(InformationType_1.InformationType.DEGRADED_RESOURCE, resource);
        Auth09.publish(IIIFEvents_1.IIIFEvents.SHOW_INFORMATION, [informationArgs]);
    };
    return Auth09;
}());
exports.Auth09 = Auth09;
//# sourceMappingURL=Auth09.js.map