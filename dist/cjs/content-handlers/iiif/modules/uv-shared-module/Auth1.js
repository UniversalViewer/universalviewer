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
exports.Auth1 = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var Utils_1 = require("../../../../Utils");
var InformationArgs_1 = require("./InformationArgs");
var InformationType_1 = require("./InformationType");
var manifesto_js_1 = require("manifesto.js");
var utils_1 = require("@edsilv/utils");
var HTTPStatusCode = __importStar(require("@edsilv/http-status-codes"));
var Auth1 = /** @class */ (function () {
    function Auth1() {
    }
    Auth1.loadExternalResources = function (resourcesToLoad, storageStrategy, options) {
        return new Promise(function (resolve) {
            Auth1.storageStrategy = storageStrategy;
            // set all resources to Auth API V1
            resourcesToLoad = resourcesToLoad.map(function (resource) {
                resource.authAPIVersion = 1;
                resource.options = options;
                return resource;
            });
            manifesto_js_1.Utils.loadExternalResourcesAuth1(resourcesToLoad, Auth1.openContentProviderInteraction, Auth1.openTokenService, Auth1.getStoredAccessToken, Auth1.userInteractedWithContentProvider, Auth1.getContentProviderInteraction, Auth1.handleMovedTemporarily, Auth1.showOutOfOptionsMessages)
                .then(function (r) {
                resolve(r);
            })["catch"](function (error) {
                switch (error.name) {
                    case manifesto_js_1.StatusCode.AUTHORIZATION_FAILED.toString():
                        Auth1.publish(IIIFEvents_1.IIIFEvents.LOGIN_FAILED);
                        break;
                    case manifesto_js_1.StatusCode.FORBIDDEN.toString():
                        Auth1.publish(IIIFEvents_1.IIIFEvents.FORBIDDEN);
                        break;
                    case manifesto_js_1.StatusCode.RESTRICTED.toString():
                        // do nothing
                        break;
                    default:
                        Auth1.publish(IIIFEvents_1.IIIFEvents.SHOW_MESSAGE, [error.message || error]);
                }
            });
        });
    };
    Auth1.getCookieServiceUrl = function (service) {
        var cookieServiceUrl = service.id + "?origin=" + Auth1.getOrigin();
        return cookieServiceUrl;
    };
    Auth1.openContentProviderInteraction = function (service) {
        var cookieServiceUrl = Auth1.getCookieServiceUrl(service);
        return window.open(cookieServiceUrl);
    };
    // determine the postMessage-style origin for a URL
    Auth1.getOrigin = function (url) {
        var urlHolder = window.location;
        if (url) {
            urlHolder = document.createElement("a");
            urlHolder.href = url;
        }
        return (urlHolder.protocol +
            "//" +
            urlHolder.hostname +
            (urlHolder.port ? ":" + urlHolder.port : ""));
    };
    Auth1.userInteractedWithContentProvider = function (contentProviderWindow) {
        return new Promise(function (resolve) {
            // What happens here is forever a mystery to a client application.
            // It can but wait.
            var poll = window.setInterval(function () {
                if (contentProviderWindow.closed) {
                    window.clearInterval(poll);
                    resolve(true);
                }
            }, 500);
        });
    };
    Auth1.handleMovedTemporarily = function (resource) {
        return new Promise(function (resolve) {
            Auth1.showDegradedMessage(resource);
            resource.isResponseHandled = true;
            resolve();
        });
    };
    Auth1.showDegradedMessage = function (resource) {
        var informationArgs = new InformationArgs_1.InformationArgs(InformationType_1.InformationType.DEGRADED_RESOURCE, resource);
        Auth1.publish(IIIFEvents_1.IIIFEvents.SHOW_INFORMATION, [informationArgs]);
    };
    Auth1.storeAccessToken = function (resource, token) {
        return new Promise(function (resolve, reject) {
            if (resource.tokenService) {
                utils_1.Storage.set(resource.tokenService.id, token, token.expiresIn, Auth1.storageStrategy);
                resolve();
            }
            else {
                reject("Token service not found");
            }
        });
    };
    Auth1.getStoredAccessToken = function (resource) {
        return new Promise(function (resolve, reject) {
            var foundItems = [];
            var item = null;
            // try to match on the tokenService, if the resource has one:
            if (resource.tokenService) {
                item = utils_1.Storage.get(resource.tokenService.id, Auth1.storageStrategy);
            }
            if (item) {
                foundItems.push(item);
            }
            else {
                // find an access token for the domain
                var domain = utils_1.Urls.getUrlParts(resource.dataUri)
                    .hostname;
                var items = utils_1.Storage.getItems(Auth1.storageStrategy);
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
            var foundToken = null;
            if (foundItems.length) {
                foundToken = foundItems[foundItems.length - 1].value;
            }
            resolve(foundToken);
        });
    };
    Auth1.getContentProviderInteraction = function (resource, service) {
        return new Promise(function (resolve) {
            // if the info bar has already been shown for degraded logins
            if (resource.isResponseHandled && !resource.authHoldingPage) {
                Auth1.showDegradedMessage(resource);
                resolve(null);
            }
            else if (resource.authHoldingPage) {
                // redirect holding page
                resource.authHoldingPage.location.href = Auth1.getCookieServiceUrl(service);
                resolve(resource.authHoldingPage);
            }
            else {
                Auth1.publish(IIIFEvents_1.IIIFEvents.SHOW_AUTH_DIALOGUE, [
                    {
                        service: service,
                        closeCallback: function () {
                            resolve(null);
                        },
                        confirmCallback: function () {
                            var win = Auth1.openContentProviderInteraction(service);
                            resolve(win);
                        },
                        cancelCallback: function () {
                            resolve(null);
                        },
                    },
                ]);
            }
        });
    };
    Auth1.openTokenService = function (resource, tokenService) {
        // use a Promise across a postMessage call. Discuss...
        return new Promise(function (resolve, reject) {
            // if necessary, the client can decide not to trust this origin
            var serviceOrigin = Auth1.getOrigin(tokenService.id);
            var messageId = new Date().getTime();
            Auth1.messages[messageId] = {
                resolve: resolve,
                reject: reject,
                serviceOrigin: serviceOrigin,
                resource: resource,
            };
            window.addEventListener("message", Auth1.receiveToken, false);
            var tokenUrl = tokenService.id +
                "?messageId=" +
                messageId +
                "&origin=" +
                Auth1.getOrigin();
            // load the access token service url in the #commsFrame iframe.
            // when the message event listener (Auth1.receiveToken) receives a message from the iframe
            // it looks in Auth1.messages to find a corresponding message id with the same origin.
            // if found, it stores the returned access token, resolves and deletes the message.
            // resolving the message resolves the openTokenService promise.
            $("#commsFrame").prop("src", tokenUrl);
            // reject any unhandled messages after a configurable timeout
            var postMessageTimeout = 5000;
            setTimeout(function () {
                if (Auth1.messages[messageId]) {
                    Auth1.messages[messageId].reject("Message unhandled after " + postMessageTimeout + "ms, rejecting");
                    delete Auth1.messages[messageId];
                }
            }, postMessageTimeout);
        });
    };
    Auth1.receiveToken = function (event) {
        if (event.data.hasOwnProperty("messageId")) {
            var message_1 = Auth1.messages[event.data.messageId];
            if (message_1 && event.origin == message_1.serviceOrigin) {
                // Any message with a messageId is a success
                Auth1.storeAccessToken(message_1.resource, event.data).then(function () {
                    message_1.resolve(event.data); // resolves openTokenService with the token
                    delete Auth1.messages[event.data.messageId];
                    return;
                });
            }
        }
    };
    Auth1.showOutOfOptionsMessages = function (resource, service) {
        // if the UV is already showing the info bar, no need to show an error message.
        if (resource.status == HTTPStatusCode.MOVED_TEMPORARILY) {
            return;
        }
        var errorMessage = "";
        if (service.getFailureHeader()) {
            errorMessage += "<p>" + service.getFailureHeader() + "</p>";
        }
        if (service.getFailureDescription()) {
            errorMessage += service.getFailureDescription();
        }
        Auth1.publish(IIIFEvents_1.IIIFEvents.SHOW_MESSAGE, [(0, Utils_1.sanitize)(errorMessage)]);
    };
    Auth1.messages = {};
    return Auth1;
}());
exports.Auth1 = Auth1;
//# sourceMappingURL=Auth1.js.map