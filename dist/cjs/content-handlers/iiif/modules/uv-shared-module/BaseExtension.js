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
exports.BaseExtension = void 0;
var $ = window.$;
var Auth09_1 = require("./Auth09");
var Auth1_1 = require("./Auth1");
var AuthDialogue_1 = require("../uv-dialogues-module/AuthDialogue");
var ClickThroughDialogue_1 = require("../uv-dialogues-module/ClickThroughDialogue");
var LoginDialogue_1 = require("../uv-dialogues-module/LoginDialogue");
var RestrictedDialogue_1 = require("../uv-dialogues-module/RestrictedDialogue");
var Shell_1 = require("./Shell");
var manifold_1 = require("@iiif/manifold");
var dist_commonjs_1 = require("@iiif/vocabulary/dist-commonjs/");
var KeyCodes = __importStar(require("@edsilv/key-codes"));
var utils_1 = require("@edsilv/utils");
var Utils_1 = require("../../../../Utils");
var IIIFEvents_1 = require("../../IIIFEvents");
var Events_1 = require("../../../../Events");
var BaseExtension = /** @class */ (function () {
    function BaseExtension() {
        this.annotations = [];
        this.isCreated = false;
        this.isLoggedIn = false;
        this.metrics = [];
        this.shifted = false;
        this.tabbing = false;
        this.locales = {};
    }
    BaseExtension.prototype.create = function () {
        var _this = this;
        var that = this;
        this.browserDetect = new BrowserDetect();
        this.browserDetect.init();
        Auth09_1.Auth09.publish = this.extensionHost.publish.bind(this.extensionHost);
        Auth1_1.Auth1.publish = this.extensionHost.publish.bind(this.extensionHost);
        this.$element = $(this.extensionHost.options.target);
        this.$element.data("component", this.extensionHost);
        // todo: check this is ok to remove
        // this.fire(IIIFEvents.CREATE, {
        //   data: this.data,
        //   settings: this.getSettings(),
        //   preview: this.getSharePreview(),
        // });
        this._parseMetrics();
        this._initLocales();
        // add/remove classes.
        this.$element.empty();
        this.$element.removeClass();
        this.$element.addClass("uv-iiif-extension-host");
        this.$element.addClass("loading");
        if (this.data.locales) {
            this.$element.addClass(this.data.locales[0].name.toLowerCase());
        }
        if (this.isRightPanelEnabled()) {
            this.$element.addClass("right-panel-enabled");
        }
        if (this.isLeftPanelEnabled()) {
            this.$element.addClass("left-panel-enabled");
        }
        if (this.isFooterPanelEnabled()) {
            this.$element.addClass("footer-panel-enabled");
        }
        this.$element.addClass(this.type.name);
        this.$element.addClass("browser-" + this.browserDetect.browser);
        this.$element.addClass("browser-version-" + this.browserDetect.version);
        this.$element.prop("tabindex", -1);
        if (this.data.embedded) {
            this.$element.addClass("embedded");
        }
        if (this.isMobile()) {
            this.$element.addClass("mobile");
        }
        if (utils_1.Documents.supportsFullscreen()) {
            this.$element.addClass("fullscreen-supported");
        }
        if (this.isFullScreen()) {
            this.$element.addClass("fullscreen");
        }
        this.$element.on("mousemove", function (e) {
            _this.mouseX = e.pageX;
            _this.mouseY = e.pageY;
        });
        // if this is the first load
        if (!this.data.isReload) {
            var visibilityProp = utils_1.Documents.getHiddenProp();
            if (visibilityProp) {
                var event_1 = visibilityProp.replace(/[H|h]idden/, "") + "visibilitychange";
                document.addEventListener(event_1, function () {
                    // resize after a tab has been shown (fixes safari layout issue)
                    if (!utils_1.Documents.isHidden()) {
                        _this.resize();
                    }
                });
            }
            if (utils_1.Bools.getBool(this.data.config.options.dropEnabled, true)) {
                this.$element.on("drop", function (e) {
                    e.preventDefault();
                    var dropUrl = e.originalEvent.dataTransfer.getData("URL");
                    var a = utils_1.Urls.getUrlParts(dropUrl);
                    var manifestUri = utils_1.Urls.getQuerystringParameterFromString("manifest", a.search);
                    if (!manifestUri) {
                        // look for collection param
                        manifestUri = utils_1.Urls.getQuerystringParameterFromString("collection", a.search);
                    }
                    //var canvasUri = Urls.getQuerystringParameterFromString('canvas', url.search);
                    if (manifestUri) {
                        _this.fire(Events_1.Events.DROP, manifestUri);
                        var data = {};
                        data.iiifManifestId = manifestUri;
                        _this.reload(data);
                    }
                });
            }
            this.$element.on("dragover", function (e) {
                // allow drop
                e.preventDefault();
            });
            // keyboard events.
            this.$element.on("keyup keydown", function (e) {
                _this.shifted = e.shiftKey;
                _this.tabbing = e.keyCode === KeyCodes.KeyDown.Tab;
            });
            this.$element.on("keydown", function (e) {
                var event = null;
                var preventDefault = true;
                if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                    if (e.keyCode === KeyCodes.KeyDown.Enter) {
                        event = IIIFEvents_1.IIIFEvents.RETURN;
                        preventDefault = false;
                    }
                    if (e.keyCode === KeyCodes.KeyDown.Escape)
                        event = IIIFEvents_1.IIIFEvents.ESCAPE;
                    if (e.keyCode === KeyCodes.KeyDown.PageUp)
                        event = IIIFEvents_1.IIIFEvents.PAGE_UP;
                    if (e.keyCode === KeyCodes.KeyDown.PageDown)
                        event = IIIFEvents_1.IIIFEvents.PAGE_DOWN;
                    if (e.keyCode === KeyCodes.KeyDown.End)
                        event = IIIFEvents_1.IIIFEvents.END;
                    if (e.keyCode === KeyCodes.KeyDown.Home)
                        event = IIIFEvents_1.IIIFEvents.HOME;
                    if (e.keyCode === KeyCodes.KeyDown.NumpadPlus ||
                        e.keyCode === 171 ||
                        e.keyCode === KeyCodes.KeyDown.Equals) {
                        event = IIIFEvents_1.IIIFEvents.PLUS;
                        preventDefault = false;
                    }
                    if (e.keyCode === KeyCodes.KeyDown.NumpadMinus ||
                        e.keyCode === 173 ||
                        e.keyCode === KeyCodes.KeyDown.Dash) {
                        event = IIIFEvents_1.IIIFEvents.MINUS;
                        preventDefault = false;
                    }
                    if (that.useArrowKeysToNavigate()) {
                        if (e.keyCode === KeyCodes.KeyDown.LeftArrow)
                            event = IIIFEvents_1.IIIFEvents.LEFT_ARROW;
                        if (e.keyCode === KeyCodes.KeyDown.UpArrow)
                            event = IIIFEvents_1.IIIFEvents.UP_ARROW;
                        if (e.keyCode === KeyCodes.KeyDown.RightArrow)
                            event = IIIFEvents_1.IIIFEvents.RIGHT_ARROW;
                        if (e.keyCode === KeyCodes.KeyDown.DownArrow)
                            event = IIIFEvents_1.IIIFEvents.DOWN_ARROW;
                    }
                }
                if (event) {
                    if (preventDefault) {
                        e.preventDefault();
                    }
                    _this.extensionHost.publish(event);
                }
            });
        }
        this.extensionHost.subscribe(Events_1.Events.EXIT_FULLSCREEN, function () {
            if (_this.isOverlayActive()) {
                _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.ESCAPE);
            }
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.ESCAPE);
            _this.extensionHost.publish(Events_1.Events.RESIZE);
        });
        // this.$element.append('<a href="/" id="top"></a>');
        this.$element.append('<iframe id="commsFrame" style="display:none"></iframe>');
        this.extensionHost.subscribeAll(function (event, args) {
            // subscribe to all UV events except those handled below with their own fire() calls
            var exceptions = [
                Events_1.Events.LOAD,
                // IIIFEvents.CREATE,
                Events_1.Events.DROP,
                Events_1.Events.TOGGLE_FULLSCREEN,
                Events_1.Events.EXTERNAL_RESOURCE_OPENED,
                Events_1.Events.RELOAD,
            ];
            if (!exceptions.includes(event)) {
                _this.fire(event, args);
            }
        });
        this.extensionHost.subscribe(Events_1.Events.EXTERNAL_RESOURCE_OPENED, function () {
            _this.fire(Events_1.Events.EXTERNAL_RESOURCE_OPENED);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.LOGIN_FAILED, function () {
            _this.showMessage(_this.data.config.content.authorisationFailedMessage);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.LOGIN, function () {
            _this.isLoggedIn = true;
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.LOGOUT, function () {
            _this.isLoggedIn = false;
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.BOOKMARK, function () {
            _this.bookmark();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function (canvasIndex) {
            _this.data.canvasIndex = canvasIndex;
            _this.lastCanvasIndex = _this.helper.canvasIndex;
            _this.helper.canvasIndex = canvasIndex;
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CLOSE_LEFT_PANEL, function () {
            _this.resize();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CLOSE_RIGHT_PANEL, function () {
            _this.resize();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.COLLECTION_INDEX_CHANGE, function (collectionIndex) {
            _this.data.collectionIndex = collectionIndex;
        });
        this.extensionHost.subscribe(Events_1.Events.CREATED, function () {
            _this.isCreated = true;
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.ESCAPE, function () {
            if (_this.isFullScreen() && !_this.isOverlayActive()) {
                _this.extensionHost.publish(Events_1.Events.TOGGLE_FULLSCREEN);
            }
        });
        this.extensionHost.subscribe(Events_1.Events.LOAD, function () {
            setTimeout(function () {
                _this.extensionHost.publish(Events_1.Events.RESIZE);
                _this.fire(Events_1.Events.LOAD, _this.helper.getCurrentCanvas().id);
                _this.$element.removeClass("loading");
            }, 100); // firefox needs this :-(
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.FEEDBACK, function () {
            _this.feedback();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.FORBIDDEN, function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.OPEN_EXTERNAL_RESOURCE);
        });
        this.extensionHost.subscribe(Events_1.Events.LOAD_FAILED, function () {
            if (!that.lastCanvasIndex == null &&
                that.lastCanvasIndex !== that.helper.canvasIndex) {
                _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, that.lastCanvasIndex);
            }
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.MANIFEST_INDEX_CHANGE, function (manifestIndex) {
            _this.data.manifestIndex = manifestIndex;
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN, function () {
            var openUri = utils_1.Strings.format(_this.data.config.options.openTemplate, _this.helper.manifestUri);
            window.open(openUri);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_LEFT_PANEL, function () {
            if (!_this.$element.hasClass("loading")) {
                _this.resize();
            }
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_RIGHT_PANEL, function () {
            if (!_this.$element.hasClass("loading")) {
                _this.resize();
            }
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.RANGE_CHANGE, function (range) {
            if (range) {
                _this.data.rangeId = range.id;
                _this.helper.rangeId = range.id;
            }
            else {
                _this.data.rangeId = undefined;
                _this.helper.rangeId = undefined;
            }
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.RESOURCE_DEGRADED, function (resource) {
            Auth09_1.Auth09.handleDegraded(resource);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.SHOW_MESSAGE, function (message) {
            _this.showMessage(message);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.SHOW_TERMS_OF_USE, function () {
            var terms = _this.helper.getLicense();
            if (!terms) {
                var requiredStatement = _this.helper.getRequiredStatement();
                if (requiredStatement && requiredStatement.value) {
                    terms = requiredStatement.value;
                }
            }
            if (terms) {
                _this.showMessage(terms);
            }
        });
        this.extensionHost.subscribe(Events_1.Events.TOGGLE_FULLSCREEN, function () {
            var overrideFullScreen = _this.data.config.options
                .overrideFullScreen;
            _this.extensionHost.isFullScreen = !_this.extensionHost.isFullScreen;
            if (!overrideFullScreen) {
                $("#top").focus();
                if (_this.extensionHost.isFullScreen) {
                    _this.$element.addClass("fullscreen");
                }
                else {
                    _this.$element.removeClass("fullscreen");
                }
            }
            _this.fire(Events_1.Events.TOGGLE_FULLSCREEN, {
                isFullScreen: _this.extensionHost.isFullScreen,
                overrideFullScreen: overrideFullScreen,
            });
        });
        // create shell and shared views.
        this.shell = new Shell_1.Shell(this.$element);
        this.createModules();
        this.extensionHost.publish(Events_1.Events.RESIZE); // initial sizing
        setTimeout(function () {
            _this.render();
            _this.extensionHost.publish(Events_1.Events.CREATED);
            _this._setDefaultFocus();
        }, 1);
    };
    BaseExtension.prototype.loadConfig = function (locale) {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = this.locales[locale];
                        if (!config) {
                            throw new Error("Unable to load config");
                        }
                        if (!(typeof config === "object")) return [3 /*break*/, 1];
                        config = JSON.parse(JSON.stringify(config));
                        return [3 /*break*/, 3];
                    case 1:
                        if (!(typeof config === "function")) return [3 /*break*/, 3];
                        return [4 /*yield*/, config()];
                    case 2:
                        config = _a.sent();
                        config = JSON.parse(JSON.stringify(config));
                        _a.label = 3;
                    case 3: return [2 /*return*/, config];
                }
            });
        });
    };
    BaseExtension.prototype.createModules = function () {
        this.$authDialogue = $('<div class="overlay auth" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$authDialogue);
        this.authDialogue = new AuthDialogue_1.AuthDialogue(this.$authDialogue);
        this.$clickThroughDialogue = $('<div class="overlay clickthrough" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$clickThroughDialogue);
        this.clickThroughDialogue = new ClickThroughDialogue_1.ClickThroughDialogue(this.$clickThroughDialogue);
        this.$restrictedDialogue = $('<div class="overlay login" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$restrictedDialogue);
        this.restrictedDialogue = new RestrictedDialogue_1.RestrictedDialogue(this.$restrictedDialogue);
        this.$loginDialogue = $('<div class="overlay login" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$loginDialogue);
        this.loginDialogue = new LoginDialogue_1.LoginDialogue(this.$loginDialogue);
    };
    BaseExtension.prototype._setDefaultFocus = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.data.config.options.allowStealFocus) {
                $("[tabindex=0]").focus();
            }
        }, 1);
    };
    BaseExtension.prototype.width = function () {
        return this.$element.width();
    };
    BaseExtension.prototype.height = function () {
        return this.$element.height();
    };
    BaseExtension.prototype.exitFullScreen = function () {
        this.extensionHost.publish(Events_1.Events.EXIT_FULLSCREEN);
    };
    BaseExtension.prototype.fire = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.data.debug) {
            console.log(name, arguments[1]);
        }
        this.extensionHost.fire(name, arguments[1]);
    };
    BaseExtension.prototype.redirect = function (uri) {
        this.fire(IIIFEvents_1.IIIFEvents.REDIRECT, uri);
    };
    BaseExtension.prototype.refresh = function () {
        this.fire(IIIFEvents_1.IIIFEvents.REFRESH, null);
    };
    BaseExtension.prototype.render = function () {
        if (!this.isCreated ||
            this.data.collectionIndex !== this.helper.collectionIndex) {
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.COLLECTION_INDEX_CHANGE, this.data.collectionIndex);
        }
        if (!this.isCreated ||
            this.data.manifestIndex !== this.helper.manifestIndex) {
            if (this.data.iiifManifestId !== undefined) {
                this.extensionHost.publish(IIIFEvents_1.IIIFEvents.MANIFEST_INDEX_CHANGE, this.data.manifestIndex);
            }
        }
        if (!this.isCreated || this.data.canvasIndex !== this.helper.canvasIndex) {
            if (this.data.canvasIndex === undefined) {
                this.data.canvasIndex = 0;
            }
            if (this.data.canvasId) {
                this.data.canvasIndex = this.helper.canvasIndex;
            }
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, this.data.canvasIndex);
        }
        if (!this.isCreated || this.data.rangeId !== this.helper.rangeId) {
            if (this.data.rangeId) {
                var range = this.helper.getRangeById(this.data.rangeId);
                if (range) {
                    this.extensionHost.publish(IIIFEvents_1.IIIFEvents.RANGE_CHANGE, range);
                }
                else {
                    console.warn("range id not found:", this.data.rangeId);
                }
            }
        }
    };
    BaseExtension.prototype._initLocales = function () {
        var availableLocales = this.data.config.localisation.locales.slice(0);
        var configuredLocales = this.data.locales;
        var finalLocales = [];
        // loop through configuredLocales array (those passed in when initialising the UV component)
        // if availableLocales (those available in each extension's l10n directory) contains a configured locale, add it to finalLocales.
        // if the configured locale has a label, substitute it
        // mark locale as added.
        // if limitLocales is disabled,
        // loop through remaining availableLocales and add to finalLocales.
        if (configuredLocales) {
            configuredLocales.forEach(function (configuredLocale) {
                var match = availableLocales.filter(function (item) {
                    return item.name === configuredLocale.name;
                });
                if (match.length) {
                    var m = match[0];
                    if (configuredLocale.label)
                        m.label = configuredLocale.label;
                    m.added = true;
                    finalLocales.push(m);
                }
            });
            var limitLocales = utils_1.Bools.getBool(this.data.config.options.limitLocales, false);
            if (!limitLocales) {
                availableLocales.forEach(function (availableLocale) {
                    if (!availableLocale.added) {
                        finalLocales.push(availableLocale);
                    }
                    delete availableLocale.added;
                });
            }
            this.data.locales = finalLocales;
        }
        else {
            console.warn("No locales configured");
        }
    };
    BaseExtension.prototype._parseMetrics = function () {
        var metrics = this.data.config.options.metrics;
        if (metrics) {
            for (var i = 0; i < metrics.length; i++) {
                var m = metrics[i];
                this.metrics.push(m);
            }
        }
    };
    BaseExtension.prototype._updateMetric = function () {
        var _this = this;
        setTimeout(function () {
            // loop through all metrics
            // find one that matches the current dimensions
            // when a metric is found that isn't the current metric, set it to be the current metric and publish a METRIC_CHANGE event
            for (var i = _this.metrics.length - 1; i >= 0; i--) {
                var metric = _this.metrics[i];
                var width = window.innerWidth;
                if (width >= metric.minWidth) {
                    if (_this.metric !== metric.type) {
                        _this.metric = metric.type;
                        // remove current metric class
                        for (var j = 0; j < _this.metrics.length; j++) {
                            _this.$element.removeClass(_this.metrics[j].type);
                        }
                        _this.$element.addClass(metric.type);
                        _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.METRIC_CHANGE);
                    }
                    break;
                }
            }
        }, 1);
    };
    BaseExtension.prototype.resize = function () {
        this._updateMetric();
        this.extensionHost.publish(Events_1.Events.RESIZE);
    };
    // re-bootstraps the application with new querystring params
    BaseExtension.prototype.reload = function (data) {
        this.extensionHost.publish(Events_1.Events.RELOAD, data);
    };
    BaseExtension.prototype.isSeeAlsoEnabled = function () {
        return this.data.config.options.seeAlsoEnabled !== false;
    };
    BaseExtension.prototype.getShareUrl = function () {
        // If not embedded on an external domain (this causes CORS errors when fetching parent url)
        if (!this.data.embedded) {
            // Use the current page URL with hash params
            if (utils_1.Documents.isInIFrame()) {
                return parent.document.location.href;
            }
            else {
                return document.location.href;
            }
        }
        else {
            // If there's a `related` property of format `text/html` in the manifest
            if (this.helper.hasRelatedPage()) {
                // Use the `related` property in the URL box
                var related = this.helper.getRelated();
                if (related && related.length) {
                    related = related[0];
                }
                return related["@id"];
            }
        }
        return null;
    };
    BaseExtension.prototype.getIIIFShareUrl = function (shareManifests) {
        if (shareManifests === void 0) { shareManifests = false; }
        var manifestUri;
        if (shareManifests) {
            if (this.helper.manifest) {
                manifestUri = this.helper.manifest.id;
            }
            else {
                manifestUri = this.helper.manifestUri;
            }
        }
        return manifestUri + "?manifest=" + manifestUri;
    };
    // addTimestamp(uri: string): string {
    //   return uri + "?t=" + Dates.getTimeStamp();
    // }
    BaseExtension.prototype.getDomain = function () {
        var parts = utils_1.Urls.getUrlParts(this.helper.manifestUri);
        return parts.host;
    };
    BaseExtension.prototype.getAppUri = function () {
        var appUri = window.location.protocol +
            "//" +
            window.location.hostname +
            (window.location.port ? ":" + window.location.port : "");
        return appUri + "/uv.html";
    };
    BaseExtension.prototype.getSettings = function () {
        if (utils_1.Bools.getBool(this.data.config.options.saveUserSettings, false)) {
            var settings = utils_1.Storage.get("uv.settings", utils_1.StorageType.LOCAL);
            if (settings) {
                return $.extend(this.data.config.options, settings.value);
            }
        }
        return this.data.config.options;
    };
    BaseExtension.prototype.updateSettings = function (settings) {
        if (utils_1.Bools.getBool(this.data.config.options.saveUserSettings, false)) {
            var storedSettings = utils_1.Storage.get("uv.settings", utils_1.StorageType.LOCAL);
            if (storedSettings) {
                settings = $.extend(storedSettings.value, settings);
            }
            // store for ten years
            utils_1.Storage.set("uv.settings", settings, 315360000, utils_1.StorageType.LOCAL);
        }
        this.data.config.options = $.extend(this.data.config.options, settings);
    };
    BaseExtension.prototype.getLocale = function () {
        return this.helper.options.locale;
    };
    BaseExtension.prototype.getSharePreview = function () {
        var title = this.helper.getLabel();
        // todo: use getThumb (when implemented)
        var canvas = this.helper.getCurrentCanvas();
        var thumbnail = canvas.getProperty("thumbnail");
        if (!thumbnail || !(typeof thumbnail === "string")) {
            thumbnail = canvas.getCanonicalImageUri(this.data.config.options.bookmarkThumbWidth);
        }
        return {
            title: title,
            image: thumbnail,
        };
    };
    BaseExtension.prototype.getPagedIndices = function (canvasIndex) {
        if (canvasIndex === void 0) { canvasIndex = this.helper.canvasIndex; }
        return [canvasIndex];
    };
    BaseExtension.prototype.getCurrentCanvases = function () {
        var indices = this.getPagedIndices(this.helper.canvasIndex);
        var canvases = [];
        for (var i = 0; i < indices.length; i++) {
            var index = indices[i];
            var canvas = this.helper.getCanvasByIndex(index);
            if (canvas) {
                canvases.push(canvas);
            }
        }
        return canvases;
    };
    BaseExtension.prototype.getCanvasLabels = function (label) {
        var indices = this.getPagedIndices();
        var labels = "";
        if (indices.length === 1) {
            labels = label;
        }
        else {
            for (var i = 1; i <= indices.length; i++) {
                if (labels.length)
                    labels += ",";
                labels += label + " " + i;
            }
        }
        return labels;
    };
    BaseExtension.prototype.getCurrentCanvasRange = function () {
        //var rangePath: string = this.currentRangePath ? this.currentRangePath : '';
        //var range: manifesto.Range = this.helper.getCanvasRange(this.helper.getCurrentCanvas(), rangePath);
        var range = this.helper.getCanvasRange(this.helper.getCurrentCanvas());
        return range;
    };
    // todo: move to manifold?
    BaseExtension.prototype.getExternalResources = function (resources) {
        var _this = this;
        var indices = this.getPagedIndices();
        var resourcesToLoad = [];
        indices.forEach(function (index) {
            var canvas = _this.helper.getCanvasByIndex(index);
            var r;
            if (!canvas.externalResource) {
                r = new manifold_1.ExternalResource(canvas, {
                    authApiVersion: _this.data.config.options.authAPIVersion,
                });
            }
            else {
                r = canvas.externalResource;
            }
            // reload resources if passed
            if (resources) {
                var found = resources.find(function (f) {
                    return f.dataUri === r.dataUri;
                });
                if (found) {
                    resourcesToLoad.push(found);
                }
                else {
                    resourcesToLoad.push(r);
                }
            }
            else {
                resourcesToLoad.push(r);
            }
        });
        var storageStrategy = this.data.config.options.tokenStorage;
        var authAPIVersion = this.data.config.options.authAPIVersion;
        // if using auth api v1
        if (authAPIVersion === 1) {
            return new Promise(function (resolve) {
                var options = {
                    locale: _this.helper.options.locale,
                };
                Auth1_1.Auth1.loadExternalResources(resourcesToLoad, storageStrategy, options).then(function (r) {
                    _this.resources = r.map(function (resource) {
                        return _this._prepareResourceData(resource);
                    });
                    resolve(_this.resources);
                });
            });
        }
        else {
            return new Promise(function (resolve) {
                Auth09_1.Auth09.loadExternalResources(resourcesToLoad, storageStrategy).then(function (r) {
                    _this.resources = r.map(function (resource) {
                        return _this._prepareResourceData(resource);
                    });
                    resolve(_this.resources);
                });
            });
        }
    };
    // copy useful properties over to the data object to be opened in center panel's openMedia method
    // this is the info.json if there is one, which can be opened natively by openseadragon.
    BaseExtension.prototype._prepareResourceData = function (resource) {
        resource.data.hasServiceDescriptor = resource.hasServiceDescriptor();
        // if the data isn't an info.json, give it the necessary viewing properties
        if (!resource.hasServiceDescriptor()) {
            resource.data.id = resource.dataUri;
            resource.data.width = resource.width;
            resource.data.height = resource.height;
        }
        resource.data.index = resource.index;
        return utils_1.Objects.toPlainObject(resource.data);
    };
    BaseExtension.prototype.getMediaFormats = function (canvas) {
        var annotations = canvas.getContent();
        if (annotations && annotations.length) {
            var annotation = annotations[0];
            return annotation.getBody();
        }
        else {
            // legacy IxIF compatibility
            var body = {
                id: canvas.id,
                type: canvas.getType(),
                getFormat: function () {
                    return "";
                },
            };
            return [body];
        }
    };
    BaseExtension.prototype.viewCanvas = function (canvasIndex) {
        if (this.helper.isCanvasIndexOutOfRange(canvasIndex)) {
            this.showMessage(this.data.config.content.canvasIndexOutOfRange);
            return;
        }
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.OPEN_EXTERNAL_RESOURCE);
    };
    BaseExtension.prototype.showMessage = function (message, acceptCallback, buttonText, allowClose) {
        this.closeActiveDialogue();
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_GENERIC_DIALOGUE, {
            message: message,
            acceptCallback: acceptCallback,
            buttonText: buttonText,
            allowClose: allowClose,
        });
    };
    BaseExtension.prototype.closeActiveDialogue = function () {
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CLOSE_ACTIVE_DIALOGUE);
    };
    BaseExtension.prototype.isOverlayActive = function () {
        return (0, Utils_1.isVisible)(this.shell.$overlays);
    };
    BaseExtension.prototype.isDesktopMetric = function () {
        return this.metric === "lg" || this.metric === "xl";
    };
    BaseExtension.prototype.isMobileMetric = function () {
        return this.metric === "sm" || this.metric === "md";
    };
    // todo: use redux in manifold to get reset state
    BaseExtension.prototype.viewManifest = function (manifest) {
        var data = {};
        data.iiifManifestId = this.helper.manifestUri;
        data.collectionIndex = this.helper.getCollectionIndex(manifest);
        data.manifestIndex = manifest.index;
        data.canvasIndex = 0;
        this.reload(data);
    };
    // todo: use redux in manifold to get reset state
    BaseExtension.prototype.viewCollection = function (collection) {
        var data = {};
        //data.manifestUri = this.helper.manifestUri;
        data.iiifManifestId = collection.parentCollection
            ? collection.parentCollection.id
            : this.helper.manifestUri;
        data.collectionIndex = collection.index;
        data.manifestIndex = 0;
        data.canvasIndex = 0;
        this.reload(data);
    };
    BaseExtension.prototype.isFullScreen = function () {
        return this.extensionHost.isFullScreen;
    };
    BaseExtension.prototype.isHeaderPanelEnabled = function () {
        return utils_1.Bools.getBool(this.data.config.options.headerPanelEnabled, true);
    };
    BaseExtension.prototype.isLeftPanelEnabled = function () {
        if (utils_1.Bools.getBool(this.data.config.options.leftPanelEnabled, true)) {
            if (this.helper.hasParentCollection()) {
                return true;
            }
            else if (this.helper.isMultiCanvas()) {
                var viewingHint = this.helper.getViewingHint();
                if (!viewingHint ||
                    (viewingHint && viewingHint !== dist_commonjs_1.ViewingHint.CONTINUOUS)) {
                    return true;
                }
            }
        }
        return false;
    };
    BaseExtension.prototype.isRightPanelEnabled = function () {
        return utils_1.Bools.getBool(this.data.config.options.rightPanelEnabled, true);
    };
    BaseExtension.prototype.isFooterPanelEnabled = function () {
        return utils_1.Bools.getBool(this.data.config.options.footerPanelEnabled, true);
    };
    // isMobile(): boolean {
    //   return $.browser.mobile;
    //   // let check = false;
    //   // (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    //   // return check;
    // }
    BaseExtension.prototype.isMobile = function () {
        var a = navigator.userAgent || navigator.vendor || window.opera;
        var isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|android|ipad|playbook|silk|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
        //console.log("is mobile", isMobile);
        return isMobile;
    };
    BaseExtension.prototype.useArrowKeysToNavigate = function () {
        return utils_1.Bools.getBool(this.data.config.options.useArrowKeysToNavigate, true);
    };
    BaseExtension.prototype.bookmark = function () {
        // override for each extension
    };
    BaseExtension.prototype.feedback = function () {
        this.fire(IIIFEvents_1.IIIFEvents.FEEDBACK, this.data);
    };
    BaseExtension.prototype.getAlternateLocale = function () {
        var alternateLocale = null;
        if (this.data.locales && this.data.locales.length > 1) {
            alternateLocale = this.data.locales[1];
        }
        return alternateLocale;
    };
    BaseExtension.prototype.getSerializedLocales = function () {
        if (this.data.locales) {
            return this.serializeLocales(this.data.locales);
        }
        return null;
    };
    BaseExtension.prototype.serializeLocales = function (locales) {
        var serializedLocales = "";
        for (var i = 0; i < locales.length; i++) {
            var l = locales[i];
            if (i > 0)
                serializedLocales += ",";
            serializedLocales += l.name;
            if (l.label) {
                serializedLocales += ":" + l.label;
            }
        }
        return serializedLocales;
    };
    BaseExtension.prototype.changeLocale = function (locale) {
        // re-order locales so the passed locale is first
        var data = {};
        if (this.data.locales) {
            data.locales = this.data.locales.slice(0);
            var fromIndex = data.locales.findIndex(function (l) {
                return l.name === locale;
            });
            var toIndex = 0;
            data.locales.splice(toIndex, 0, data.locales.splice(fromIndex, 1)[0]);
            this.reload(data);
        }
    };
    BaseExtension.prototype.dispose = function () {
        var _a;
        (_a = this.store) === null || _a === void 0 ? void 0 : _a.destroy();
    };
    return BaseExtension;
}());
exports.BaseExtension = BaseExtension;
var BrowserDetect = /** @class */ (function () {
    function BrowserDetect() {
        this.dataBrowser = [
            { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
            { string: navigator.userAgent, subString: "MSIE", identity: "Explorer" },
            { string: navigator.userAgent, subString: "Trident", identity: "Explorer" },
            { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
            { string: navigator.userAgent, subString: "Safari", identity: "Safari" },
            { string: navigator.userAgent, subString: "Opera", identity: "Opera" },
        ];
    }
    BrowserDetect.prototype.init = function () {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version =
            this.searchVersion(navigator.userAgent) ||
                this.searchVersion(navigator.appVersion) ||
                "Unknown";
        // detect IE 11
        if (this.browser == "Explorer" &&
            this.version == "7" &&
            navigator.userAgent.match(/Trident/i)) {
            this.version = this.searchVersionIE();
        }
    };
    BrowserDetect.prototype.searchString = function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;
            if (dataString.indexOf(data[i].subString) != -1) {
                return data[i].identity;
            }
        }
    };
    BrowserDetect.prototype.searchVersion = function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1)
            return undefined;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    };
    BrowserDetect.prototype.searchVersionIE = function () {
        var ua = navigator.userAgent.toString().toLowerCase(), match = /(trident)(?:.*rv:([\w.]+))?/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) || ["", null, -1], ver = "unknown";
        if (match !== null && match.length === 3 && match[2]) {
            ver = match[2].split(".")[0]; // version
        }
        return ver;
    };
    return BrowserDetect;
}());
//# sourceMappingURL=BaseExtension.js.map