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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var IIIFEvents_1 = require("../../IIIFEvents");
var BaseExtension_1 = require("../../modules/uv-shared-module/BaseExtension");
var Bookmark_1 = require("../../modules/uv-shared-module/Bookmark");
var DownloadDialogue_1 = require("./DownloadDialogue");
var FooterPanel_1 = require("../../modules/uv-shared-module/FooterPanel");
var MoreInfoRightPanel_1 = require("../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel");
var PDFCenterPanel_1 = require("../../modules/uv-pdfcenterpanel-module/PDFCenterPanel");
var PDFHeaderPanel_1 = require("../../modules/uv-pdfheaderpanel-module/PDFHeaderPanel");
var ResourcesLeftPanel_1 = require("../../modules/uv-resourcesleftpanel-module/ResourcesLeftPanel");
var SettingsDialogue_1 = require("./SettingsDialogue");
var ShareDialogue_1 = require("./ShareDialogue");
var dist_commonjs_1 = require("@iiif/vocabulary/dist-commonjs/");
var utils_1 = require("@edsilv/utils");
var manifesto_js_1 = require("manifesto.js");
require("./theme/theme.less");
var en_GB_json_1 = __importDefault(require("./config/en-GB.json"));
var Events_1 = require("../../../../Events");
var Extension = /** @class */ (function (_super) {
    __extends(Extension, _super);
    function Extension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultConfig = en_GB_json_1.default;
        _this.locales = {
            "en-GB": en_GB_json_1.default,
            "cy-GB": function () { return Promise.resolve().then(function () { return __importStar(require("./config/cy-GB.json")); }); },
            "fr-FR": function () { return Promise.resolve().then(function () { return __importStar(require("./config/fr-FR.json")); }); },
            "pl-PL": function () { return Promise.resolve().then(function () { return __importStar(require("./config/pl-PL.json")); }); },
            "sv-SE": function () { return Promise.resolve().then(function () { return __importStar(require("./config/sv-SE.json")); }); },
        };
        return _this;
    }
    Extension.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function (canvasIndex) {
            _this.viewCanvas(canvasIndex);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.THUMB_SELECTED, function (thumb) {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, thumb.index);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.LEFTPANEL_EXPAND_FULL_START, function () {
            _this.shell.$centerPanel.hide();
            _this.shell.$rightPanel.hide();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.LEFTPANEL_COLLAPSE_FULL_FINISH, function () {
            _this.shell.$centerPanel.show();
            _this.shell.$rightPanel.show();
            _this.resize();
        });
        this.extensionHost.subscribe(Events_1.Events.EXIT_FULLSCREEN, function () {
            setTimeout(function () {
                _this.resize();
            }, 10); // allow time to exit full screen, then resize
        });
    };
    Extension.prototype.render = function () {
        _super.prototype.render.call(this);
    };
    Extension.prototype.isHeaderPanelEnabled = function () {
        return (_super.prototype.isHeaderPanelEnabled.call(this) &&
            utils_1.Bools.getBool(this.data.config.options.usePdfJs, true));
    };
    Extension.prototype.createModules = function () {
        _super.prototype.createModules.call(this);
        if (this.isHeaderPanelEnabled()) {
            this.headerPanel = new PDFHeaderPanel_1.PDFHeaderPanel(this.shell.$headerPanel);
        }
        else {
            this.shell.$headerPanel.hide();
        }
        if (this.isLeftPanelEnabled()) {
            this.leftPanel = new ResourcesLeftPanel_1.ResourcesLeftPanel(this.shell.$leftPanel);
        }
        this.centerPanel = new PDFCenterPanel_1.PDFCenterPanel(this.shell.$centerPanel);
        if (this.isRightPanelEnabled()) {
            this.rightPanel = new MoreInfoRightPanel_1.MoreInfoRightPanel(this.shell.$rightPanel);
        }
        if (this.isFooterPanelEnabled()) {
            this.footerPanel = new FooterPanel_1.FooterPanel(this.shell.$footerPanel);
        }
        else {
            this.shell.$footerPanel.hide();
        }
        this.$downloadDialogue = $('<div class="overlay download" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue_1.DownloadDialogue(this.$downloadDialogue);
        this.$shareDialogue = $('<div class="overlay share" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$shareDialogue);
        this.shareDialogue = new ShareDialogue_1.ShareDialogue(this.$shareDialogue);
        this.$settingsDialogue = $('<div class="overlay settings" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$settingsDialogue);
        this.settingsDialogue = new SettingsDialogue_1.SettingsDialogue(this.$settingsDialogue);
        if (this.isLeftPanelEnabled()) {
            this.leftPanel.init();
        }
        if (this.isRightPanelEnabled()) {
            this.rightPanel.init();
        }
    };
    Extension.prototype.bookmark = function () {
        _super.prototype.bookmark.call(this);
        var canvas = this.helper.getCurrentCanvas();
        var bookmark = new Bookmark_1.Bookmark();
        bookmark.index = this.helper.canvasIndex;
        bookmark.label = manifesto_js_1.LanguageMap.getValue(canvas.getLabel());
        bookmark.thumb = canvas.getProperty("thumbnail");
        bookmark.title = this.helper.getLabel();
        bookmark.trackingLabel = window.trackingLabel;
        bookmark.type = dist_commonjs_1.ExternalResourceType.DOCUMENT;
        this.fire(IIIFEvents_1.IIIFEvents.BOOKMARK, bookmark);
    };
    Extension.prototype.dependencyLoaded = function (index, dep) {
        if (index === 0) {
            window.PDFObject = dep;
        }
    };
    Extension.prototype.getEmbedScript = function (template, width, height) {
        var appUri = this.getAppUri();
        var iframeSrc = appUri + "#?manifest=" + this.helper.manifestUri + "&c=" + this.helper.collectionIndex + "&m=" + this.helper.manifestIndex + "&cv=" + this.helper.canvasIndex;
        var script = utils_1.Strings.format(template, iframeSrc, width.toString(), height.toString());
        return script;
    };
    return Extension;
}(BaseExtension_1.BaseExtension));
exports.default = Extension;
//# sourceMappingURL=Extension.js.map