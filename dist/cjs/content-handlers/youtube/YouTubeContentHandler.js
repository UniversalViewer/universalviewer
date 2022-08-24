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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseContentHandler_1 = __importDefault(require("../../BaseContentHandler"));
var Events_1 = require("../../Events");
var YouTubeEvents_1 = require("./YouTubeEvents");
var YouTubeContentHandler = /** @class */ (function (_super) {
    __extends(YouTubeContentHandler, _super);
    function YouTubeContentHandler(options, adapter, eventListeners) {
        var _this = _super.call(this, options, adapter, eventListeners) || this;
        _this.options = options;
        _this.adapter = adapter;
        // console.log("create YouTubeContentHandler");
        _this._init(_this.options.data);
        return _this;
    }
    YouTubeContentHandler.prototype._getYouTubeVideoId = function (id) {
        if (id.indexOf("v=")) {
            id = id.split("v=")[1];
        }
        return id;
    };
    YouTubeContentHandler.prototype._init = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingScriptTag, scriptTag, firstScriptTag;
            var _this = this;
            return __generator(this, function (_a) {
                if (!window.youTubePlayers) {
                    window.youTubePlayers = [];
                }
                this._id = "YTPlayer-" + new Date().getTime();
                window.youTubePlayers.push({
                    id: this._id,
                    data: data,
                    ref: this,
                });
                this._el.id = this._id;
                existingScriptTag = document.getElementById("youtube-iframe-api");
                if (!existingScriptTag) {
                    scriptTag = document.createElement("script");
                    scriptTag.id = "youtube-iframe-api";
                    scriptTag.src = "//www.youtube.com/iframe_api";
                    firstScriptTag = document.getElementsByTagName("script")[0];
                    firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
                }
                if (window.onYouTubeIframeAPIReady) {
                    window.onYouTubeIframeAPIReady();
                }
                else {
                    window.onYouTubeIframeAPIReady = function () {
                        var _loop_1 = function (player) {
                            player.ref
                                .configure({
                                // default config
                                controls: true,
                            })
                                .then(function (config) {
                                window[player.id] = new YT.Player(player.id, {
                                    height: "100%",
                                    width: "100%",
                                    videoId: _this._getYouTubeVideoId(player.data.youTubeVideoId),
                                    playerVars: {
                                        playsinline: 1,
                                        enablejsapi: 1,
                                        controls: config.controls ? 1 : 0,
                                        showInfo: 0,
                                        rel: 0,
                                        // iv_load_policy: 3,
                                        modestbranding: 1,
                                        // start: 10,
                                        // end: 20,
                                    },
                                    events: {
                                        onReady: function (event) {
                                            var YTPlayer = event.target;
                                            var id = YTPlayer.getIframe().id;
                                            // const duration = YTPlayer.getDuration();
                                            // get the ref to the associated content handler
                                            var handler = window.youTubePlayers.find(function (p) { return p.id === id; });
                                            if (handler) {
                                                handler.ref.config = config;
                                                handler.ref.set(player.data);
                                                handler.ref.fire(Events_1.Events.CREATED);
                                                // handler.ref.fire(Events.LOAD, {
                                                //   duration: duration,
                                                // });
                                            }
                                        },
                                        onStateChange: function (event) {
                                            var YTPlayer = event.target;
                                            var id = YTPlayer.getIframe().id;
                                            var duration = YTPlayer.getDuration();
                                            // get the ref to the associated content handler
                                            var handler = window.youTubePlayers.find(function (p) { return p.id === id; });
                                            if (handler) {
                                                switch (event.data) {
                                                    case -1:
                                                        handler.ref.fire(YouTubeEvents_1.YouTubeEvents.UNSTARTED);
                                                        handler.ref.fire(Events_1.Events.LOAD, {
                                                            player: YTPlayer,
                                                            duration: duration,
                                                        });
                                                        break;
                                                    case 0:
                                                        handler.ref.fire(YouTubeEvents_1.YouTubeEvents.ENDED);
                                                        break;
                                                    case 1:
                                                        handler.ref.fire(YouTubeEvents_1.YouTubeEvents.PLAYING);
                                                        break;
                                                    case 2:
                                                        handler.ref.fire(YouTubeEvents_1.YouTubeEvents.PAUSED);
                                                        break;
                                                    case 3:
                                                        handler.ref.fire(YouTubeEvents_1.YouTubeEvents.BUFFERING);
                                                        break;
                                                    case 5:
                                                        handler.ref.fire(YouTubeEvents_1.YouTubeEvents.CUED);
                                                        break;
                                                }
                                            }
                                            // const currentTime = this._player.getCurrentTime();
                                            // console.log(currentTime);
                                            // currentTimeInput.value = currentTime;
                                        },
                                    },
                                });
                            });
                        };
                        for (var _i = 0, _a = window.youTubePlayers; _i < _a.length; _i++) {
                            var player = _a[_i];
                            _loop_1(player);
                        }
                    };
                }
                return [2 /*return*/];
            });
        });
    };
    // public async configure(config: any): Promise<any> {
    //   config = await super.configure(config);
    //   return config;
    // }
    YouTubeContentHandler.prototype.set = function (data) {
        var player = window[this._id];
        if (data.muted) {
            player.mute();
        }
        else {
            player.unMute();
        }
        if (data.youTubeVideoId) {
            var videoId = this._getYouTubeVideoId(data.youTubeVideoId);
            if (data.autoPlay) {
                if (data.duration) {
                    player.loadVideoById({
                        videoId: videoId,
                        startSeconds: data.duration[0],
                        endSeconds: data.duration[1],
                    });
                }
                else {
                    player.loadVideoById(videoId);
                }
            }
            else {
                if (data.duration) {
                    player.cueVideoById({
                        videoId: videoId,
                        startSeconds: data.duration[0],
                        endSeconds: data.duration[1],
                    });
                }
                else {
                    player.cueVideoById(videoId);
                }
            }
        }
        if (data.currentTime) {
            player.seekTo(data.currentTime, true);
        }
    };
    YouTubeContentHandler.prototype.exitFullScreen = function () { };
    YouTubeContentHandler.prototype.resize = function () {
        var width = this._el.clientWidth + "px";
        var height = this._el.clientHeight + "px";
        this._el.style.width = width;
        this._el.style.height = height;
    };
    YouTubeContentHandler.prototype.dispose = function () {
        var _this = this;
        // console.log("dispose YouTubeContentHandler");
        _super.prototype.dispose.call(this);
        // remove from window.youTubePlayers where hostId === this._id
        window.youTubePlayers = window.youTubePlayers.filter(function (p) { return p.id !== _this._id; });
    };
    return YouTubeContentHandler;
}(BaseContentHandler_1.default));
exports.default = YouTubeContentHandler;
//# sourceMappingURL=YouTubeContentHandler.js.map