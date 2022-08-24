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
var AVCenterPanel_1 = require("../../modules/uv-avcenterpanel-module/AVCenterPanel");
var IIIFEvents_1 = require("../../IIIFEvents");
var BaseExtension_1 = require("../../modules/uv-shared-module/BaseExtension");
var ContentLeftPanel_1 = require("../../modules/uv-contentleftpanel-module/ContentLeftPanel");
var DownloadDialogue_1 = require("./DownloadDialogue");
var FooterPanel_1 = require("../../modules/uv-shared-module/FooterPanel");
var MobileFooter_1 = require("../../modules/uv-avmobilefooterpanel-module/MobileFooter");
var HeaderPanel_1 = require("../../modules/uv-shared-module/HeaderPanel");
var MoreInfoRightPanel_1 = require("../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel");
var SettingsDialogue_1 = require("./SettingsDialogue");
var ShareDialogue_1 = require("./ShareDialogue");
var dist_commonjs_1 = require("@iiif/vocabulary/dist-commonjs/");
var utils_1 = require("@edsilv/utils");
require("./theme/theme.less");
var en_GB_json_1 = __importDefault(require("./config/en-GB.json"));
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
        //requirejs.config({shim: {'uv/lib/hls.min': { deps: ['require'], exports: "Hls"}}});
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function (canvasIndex) {
            if (canvasIndex !== _this.lastAvCanvasIndex) {
                _this.viewCanvas(canvasIndex);
            }
            _this.lastAvCanvasIndex = canvasIndex;
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.TREE_NODE_SELECTED, function (node) {
            _this.fire(IIIFEvents_1.IIIFEvents.TREE_NODE_SELECTED, node.data.path);
            _this.treeNodeSelected(node);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.THUMB_SELECTED, function (thumb) {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, thumb.index);
        });
    };
    Extension.prototype.dependencyLoaded = function (index, dep) {
        if (index === this.getDependencyIndex("waveform-data")) {
            window.WaveformData = dep;
        }
        else if (index === this.getDependencyIndex("hls")) {
            window.Hls = dep; // https://github.com/mrdoob/three.js/issues/9602
        }
    };
    Extension.prototype.createModules = function () {
        _super.prototype.createModules.call(this);
        if (this.isHeaderPanelEnabled()) {
            this.headerPanel = new HeaderPanel_1.HeaderPanel(this.shell.$headerPanel);
        }
        else {
            this.shell.$headerPanel.hide();
        }
        if (this.isLeftPanelEnabled()) {
            this.leftPanel = new ContentLeftPanel_1.ContentLeftPanel(this.shell.$leftPanel);
        }
        else {
            this.shell.$leftPanel.hide();
        }
        this.centerPanel = new AVCenterPanel_1.AVCenterPanel(this.shell.$centerPanel);
        if (this.isRightPanelEnabled()) {
            this.rightPanel = new MoreInfoRightPanel_1.MoreInfoRightPanel(this.shell.$rightPanel);
        }
        else {
            this.shell.$rightPanel.hide();
        }
        if (this.isFooterPanelEnabled()) {
            this.footerPanel = new FooterPanel_1.FooterPanel(this.shell.$footerPanel);
            this.mobileFooterPanel = new MobileFooter_1.FooterPanel(this.shell.$mobileFooterPanel);
        }
        else {
            this.shell.$footerPanel.hide();
        }
        this.$shareDialogue = $('<div class="overlay share" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$shareDialogue);
        this.shareDialogue = new ShareDialogue_1.ShareDialogue(this.$shareDialogue);
        this.$downloadDialogue = $('<div class="overlay download" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue_1.DownloadDialogue(this.$downloadDialogue);
        this.$settingsDialogue = $('<div class="overlay settings" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$settingsDialogue);
        this.settingsDialogue = new SettingsDialogue_1.SettingsDialogue(this.$settingsDialogue);
        if (this.isHeaderPanelEnabled()) {
            this.headerPanel.init();
        }
        if (this.isLeftPanelEnabled()) {
            this.leftPanel.init();
        }
        if (this.isRightPanelEnabled()) {
            this.rightPanel.init();
        }
        if (this.isFooterPanelEnabled()) {
            this.footerPanel.init();
        }
    };
    Extension.prototype.isLeftPanelEnabled = function () {
        return utils_1.Bools.getBool(this.data.config.options.leftPanelEnabled, true);
    };
    Extension.prototype.render = function () {
        _super.prototype.render.call(this);
    };
    Extension.prototype.getEmbedScript = function (template, width, height) {
        var appUri = this.getAppUri();
        var iframeSrc = appUri + "#?manifest=" + this.helper.manifestUri + "&c=" + this.helper.collectionIndex + "&m=" + this.helper.manifestIndex + "&cv=" + this.helper.canvasIndex + "&rid=" + this.helper.rangeId;
        var script = utils_1.Strings.format(template, iframeSrc, width.toString(), height.toString());
        return script;
    };
    Extension.prototype.treeNodeSelected = function (node) {
        var data = node.data;
        if (!data.type)
            return;
        switch (data.type) {
            case dist_commonjs_1.IIIFResourceType.MANIFEST:
                // do nothing
                break;
            case dist_commonjs_1.IIIFResourceType.COLLECTION:
                // do nothing
                break;
            default:
                this.viewRange(data.path);
                break;
        }
    };
    Extension.prototype.viewRange = function (path) {
        var range = this.helper.getRangeByPath(path);
        if (!range)
            return;
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.RANGE_CHANGE, range);
        // don't update the canvas index, only when thumbs are clicked
        // if (range.canvases && range.canvases.length) {
        //     const canvasId: string = range.canvases[0];
        //     const canvas: manifesto.Canvas | null = this.helper.getCanvasById(canvasId);
        //     if (canvas) {
        //         const canvasIndex: number = canvas.index;
        //         if (canvasIndex !== this.helper.canvasIndex) {
        //             this.component.publish(BaseEvents.CANVAS_INDEX_CHANGE, [canvasIndex]);
        //         }
        //     }
        // }
    };
    return Extension;
}(BaseExtension_1.BaseExtension));
exports.default = Extension;
//# sourceMappingURL=Extension.js.map