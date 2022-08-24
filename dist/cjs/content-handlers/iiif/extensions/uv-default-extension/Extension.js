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
var FileLinkCenterPanel_1 = require("../../modules/uv-filelinkcenterpanel-module/FileLinkCenterPanel");
var FooterPanel_1 = require("../../modules/uv-shared-module/FooterPanel");
var HeaderPanel_1 = require("../../modules/uv-shared-module/HeaderPanel");
var HelpDialogue_1 = require("../../modules/uv-dialogues-module/HelpDialogue");
var MoreInfoRightPanel_1 = require("../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel");
var ResourcesLeftPanel_1 = require("../../modules/uv-resourcesleftpanel-module/ResourcesLeftPanel");
var SettingsDialogue_1 = require("./SettingsDialogue");
var ShareDialogue_1 = require("./ShareDialogue");
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
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function (canvasIndex) {
            _this.viewCanvas(canvasIndex);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.THUMB_SELECTED, function (canvasIndex) {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, canvasIndex);
        });
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
            this.leftPanel = new ResourcesLeftPanel_1.ResourcesLeftPanel(this.shell.$leftPanel);
        }
        this.centerPanel = new FileLinkCenterPanel_1.FileLinkCenterPanel(this.shell.$centerPanel);
        if (this.isRightPanelEnabled()) {
            this.rightPanel = new MoreInfoRightPanel_1.MoreInfoRightPanel(this.shell.$rightPanel);
        }
        if (this.isFooterPanelEnabled()) {
            this.footerPanel = new FooterPanel_1.FooterPanel(this.shell.$footerPanel);
        }
        else {
            this.shell.$footerPanel.hide();
        }
        this.$helpDialogue = $('<div class="overlay help" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$helpDialogue);
        this.helpDialogue = new HelpDialogue_1.HelpDialogue(this.$helpDialogue);
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
    Extension.prototype.render = function () {
        _super.prototype.render.call(this);
    };
    Extension.prototype.isLeftPanelEnabled = function () {
        return (utils_1.Bools.getBool(this.data.config.options.leftPanelEnabled, true) &&
            (this.helper.isMultiCanvas() ||
                this.helper.isMultiSequence() ||
                this.helper.hasResources()));
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