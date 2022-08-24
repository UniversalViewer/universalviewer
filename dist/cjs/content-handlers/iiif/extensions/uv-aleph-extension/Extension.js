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
var AlephCenterPanel_1 = require("../../modules/uv-alephcenterpanel-module/AlephCenterPanel");
var IIIFEvents_1 = require("../../IIIFEvents");
var BaseExtension_1 = require("../../modules/uv-shared-module/BaseExtension");
var DownloadDialogue_1 = require("./DownloadDialogue");
var FooterPanel_1 = require("../../modules/uv-shared-module/FooterPanel");
var MobileFooter_1 = require("../../modules/uv-avmobilefooterpanel-module/MobileFooter");
var HeaderPanel_1 = require("../../modules/uv-shared-module/HeaderPanel");
var MoreInfoRightPanel_1 = require("../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel");
var SettingsDialogue_1 = require("./SettingsDialogue");
var ShareDialogue_1 = require("./ShareDialogue");
var AlephLeftPanel_1 = require("../../modules/uv-alephleftpanel-module/AlephLeftPanel");
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
        };
        return _this;
    }
    Extension.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function (canvasIndex) {
            _this.viewCanvas(canvasIndex);
        });
    };
    Extension.prototype.createModules = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                _super.prototype.createModules.call(this);
                if (this.isHeaderPanelEnabled()) {
                    this.headerPanel = new HeaderPanel_1.HeaderPanel(this.shell.$headerPanel);
                }
                else {
                    this.shell.$headerPanel.hide();
                }
                if (this.isLeftPanelEnabled()) {
                    this.leftPanel = new AlephLeftPanel_1.AlephLeftPanel(this.shell.$leftPanel);
                }
                else {
                    this.shell.$leftPanel.hide();
                }
                this.centerPanel = new AlephCenterPanel_1.AlephCenterPanel(this.shell.$centerPanel);
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
                return [2 /*return*/];
            });
        });
    };
    Extension.prototype.render = function () {
        _super.prototype.render.call(this);
    };
    Extension.prototype.isLeftPanelEnabled = function () {
        return utils_1.Bools.getBool(this.data.config.options.leftPanelEnabled, true);
    };
    Extension.prototype.getEmbedScript = function (template, width, height) {
        var appUri = this.getAppUri();
        var iframeSrc = appUri + "#?manifest=" + this.helper.manifestUri;
        var script = utils_1.Strings.format(template, iframeSrc, width.toString(), height.toString());
        return script;
    };
    return Extension;
}(BaseExtension_1.BaseExtension));
exports.default = Extension;
//# sourceMappingURL=Extension.js.map