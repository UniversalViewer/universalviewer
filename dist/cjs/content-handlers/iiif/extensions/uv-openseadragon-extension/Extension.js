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
var XYWHFragment_1 = require("../../modules/uv-shared-module/XYWHFragment");
var ContentLeftPanel_1 = require("../../modules/uv-contentleftpanel-module/ContentLeftPanel");
var CroppedImageDimensions_1 = require("./CroppedImageDimensions");
var DownloadDialogue_1 = __importDefault(require("./DownloadDialogue"));
var Events_1 = require("./Events");
var ExternalContentDialogue_1 = require("../../modules/uv-dialogues-module/ExternalContentDialogue");
var MobileFooter_1 = require("../../modules/uv-osdmobilefooterpanel-module/MobileFooter");
var FooterPanel_1 = require("../../modules/uv-searchfooterpanel-module/FooterPanel");
var HelpDialogue_1 = require("../../modules/uv-dialogues-module/HelpDialogue");
var Mode_1 = require("./Mode");
var MoreInfoDialogue_1 = require("../../modules/uv-dialogues-module/MoreInfoDialogue");
var MoreInfoRightPanel_1 = require("../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel");
var MultiSelectDialogue_1 = require("../../modules/uv-multiselectdialogue-module/MultiSelectDialogue");
var MultiSelectionArgs_1 = require("./MultiSelectionArgs");
var PagingHeaderPanel_1 = require("../../modules/uv-pagingheaderpanel-module/PagingHeaderPanel");
var Point_1 = require("../../modules/uv-shared-module/Point");
var OpenSeadragonCenterPanel_1 = require("../../modules/uv-openseadragoncenterpanel-module/OpenSeadragonCenterPanel");
var SettingsDialogue_1 = require("./SettingsDialogue");
var ShareDialogue_1 = require("./ShareDialogue");
var utils_1 = require("@edsilv/utils");
var dist_commonjs_1 = require("@iiif/vocabulary/dist-commonjs/");
var manifold_1 = require("@iiif/manifold");
var manifesto_js_1 = require("manifesto.js");
require("./theme/theme.less");
var en_GB_json_1 = __importDefault(require("./config/en-GB.json"));
var AnnotationResults_1 = require("../../modules/uv-shared-module/AnnotationResults");
var Events_2 = require("../../../../Events");
var client_1 = require("react-dom/client");
var react_1 = require("react");
var Store_1 = require("./Store");
var Utils_1 = require("../../../../Utils");
var OpenSeadragonExtension = /** @class */ (function (_super) {
    __extends(OpenSeadragonExtension, _super);
    function OpenSeadragonExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.currentRotation = 0;
        _this.isAnnotating = false;
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
    OpenSeadragonExtension.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this.store = (0, Store_1.createStore)();
        this.store.subscribe(function (_state) {
            _this.renderDownloadDialogue();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.METRIC_CHANGE, function () {
            if (!_this.isDesktopMetric()) {
                var settings = {};
                settings.pagingEnabled = false;
                _this.updateSettings(settings);
                _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.UPDATE_SETTINGS);
                //this.shell.$rightPanel.hide();
            }
            else {
                //this.shell.$rightPanel.show();
            }
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function (canvasIndex) {
            _this.previousAnnotationRect = null;
            _this.currentAnnotationRect = null;
            _this.changeCanvas(canvasIndex);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CLEAR_ANNOTATIONS, function () {
            _this.clearAnnotations();
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.ANNOTATIONS_CLEARED);
            _this.fire(IIIFEvents_1.IIIFEvents.CLEAR_ANNOTATIONS);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.DOWN_ARROW, function () {
            if (!_this.useArrowKeysToNavigate()) {
                _this.centerPanel.setFocus();
            }
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.END, function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, _this.helper.getLastPageIndex());
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.FIRST, function () {
            _this.fire(IIIFEvents_1.IIIFEvents.FIRST);
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, _this.helper.getFirstPageIndex());
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.GALLERY_DECREASE_SIZE, function () {
            _this.fire(IIIFEvents_1.IIIFEvents.GALLERY_DECREASE_SIZE);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.GALLERY_INCREASE_SIZE, function () {
            _this.fire(IIIFEvents_1.IIIFEvents.GALLERY_INCREASE_SIZE);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.GALLERY_THUMB_SELECTED, function () {
            _this.fire(IIIFEvents_1.IIIFEvents.GALLERY_THUMB_SELECTED);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.HOME, function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, _this.helper.getFirstPageIndex());
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.IMAGE_SEARCH, function (index) {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.IMAGE_SEARCH, index);
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, index);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.LAST, function () {
            _this.fire(IIIFEvents_1.IIIFEvents.LAST);
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, _this.helper.getLastPageIndex());
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.LEFT_ARROW, function () {
            if (_this.useArrowKeysToNavigate()) {
                _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, _this.getPrevPageIndex());
            }
            else {
                _this.centerPanel.setFocus();
            }
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.LEFTPANEL_COLLAPSE_FULL_START, function () {
            if (_this.isDesktopMetric()) {
                _this.shell.$rightPanel.show();
            }
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.LEFTPANEL_COLLAPSE_FULL_FINISH, function () {
            _this.shell.$centerPanel.show();
            _this.resize();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.LEFTPANEL_EXPAND_FULL_START, function () {
            _this.shell.$centerPanel.hide();
            _this.shell.$rightPanel.hide();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.MINUS, function () {
            _this.centerPanel.setFocus();
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.MODE_CHANGE, function (mode) {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.MODE_CHANGE, mode);
            _this.mode = new Mode_1.Mode(mode);
            var settings = _this.getSettings();
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SETTINGS_CHANGE, settings);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.MULTISELECTION_MADE, function (ids) {
            var args = new MultiSelectionArgs_1.MultiSelectionArgs();
            args.manifestUri = _this.helper.manifestUri;
            args.allCanvases = ids.length === _this.helper.getCanvases().length;
            args.canvases = ids;
            args.format = _this.data.config.options.multiSelectionMimeType;
            args.sequence = _this.helper.getCurrentSequence().id;
            _this.fire(IIIFEvents_1.IIIFEvents.MULTISELECTION_MADE, args);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.NEXT, function () {
            _this.fire(IIIFEvents_1.IIIFEvents.NEXT);
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, _this.getNextPageIndex());
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.NEXT_SEARCH_RESULT, function () {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.NEXT_SEARCH_RESULT);
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE, function () {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE);
            _this.nextSearchResult();
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE, function () {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE);
            _this.prevSearchResult();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_THUMBS_VIEW, function () {
            _this.fire(IIIFEvents_1.IIIFEvents.OPEN_THUMBS_VIEW);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.OPEN_TREE_VIEW, function () {
            _this.fire(IIIFEvents_1.IIIFEvents.OPEN_TREE_VIEW);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.PAGE_DOWN, function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, _this.getNextPageIndex());
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.PAGE_SEARCH, function (value) {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.PAGE_SEARCH, value);
            _this.viewLabel(value);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.PAGE_UP, function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, _this.getPrevPageIndex());
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.PAGING_TOGGLED, function (obj) {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.PAGING_TOGGLED, obj);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.PLUS, function () {
            _this.centerPanel.setFocus();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.PREV, function () {
            _this.fire(IIIFEvents_1.IIIFEvents.PREV);
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, _this.getPrevPageIndex());
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.PREV_SEARCH_RESULT, function () {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.PREV_SEARCH_RESULT);
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.PRINT, function () {
            _this.print();
        });
        this.extensionHost.subscribe(Events_2.Events.RELOAD, function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CLEAR_ANNOTATIONS);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.RIGHT_ARROW, function () {
            if (_this.useArrowKeysToNavigate()) {
                _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, _this.getNextPageIndex());
            }
            else {
                _this.centerPanel.setFocus();
            }
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION, function () {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION);
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_ROTATION, function (degrees) {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_ROTATION, degrees);
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION_FINISH, function (viewer) {
            var xywh = _this.centerPanel.getViewportBounds();
            var canvas = _this.helper.getCurrentCanvas();
            if (_this.centerPanel && xywh && canvas) {
                _this.extensionHost.publish(Events_1.OpenSeadragonExtensionEvents.XYWH_CHANGE, xywh.toString());
                _this.data.target = canvas.id + "#xywh=" + xywh.toString();
                _this.fire(IIIFEvents_1.IIIFEvents.TARGET_CHANGE, _this.data.target);
            }
            _this.fire(Events_1.OpenSeadragonExtensionEvents.CURRENT_VIEW_URI, {
                cropUri: _this.getCroppedImageUri(canvas, _this.getViewer()),
                fullUri: _this.getConfinedImageUri(canvas, canvas.getWidth()),
            });
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION_START, function () {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_ANIMATION_START);
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_OPEN, function () {
            if (!_this.useArrowKeysToNavigate()) {
                _this.centerPanel.setFocus();
            }
            _this.fire(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_OPEN);
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_RESIZE, function () {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_RESIZE);
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_ROTATION, function (rotation) {
            _this.data.rotation = rotation;
            _this.fire(Events_1.OpenSeadragonExtensionEvents.OPENSEADRAGON_ROTATION, _this.data.rotation);
            _this.currentRotation = rotation;
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.SEARCH, function (terms) {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.SEARCH, terms);
            _this.search(terms);
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.SEARCH_PREVIEW_FINISH, function () {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.SEARCH_PREVIEW_FINISH);
        });
        this.extensionHost.subscribe(Events_1.OpenSeadragonExtensionEvents.SEARCH_PREVIEW_START, function () {
            _this.fire(Events_1.OpenSeadragonExtensionEvents.SEARCH_PREVIEW_START);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.ANNOTATIONS, function (obj) {
            _this.fire(IIIFEvents_1.IIIFEvents.ANNOTATIONS, obj);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.ANNOTATION_CANVAS_CHANGE, function (rects) {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, rects[0].canvasIndex);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.ANNOTATIONS_EMPTY, function () {
            _this.fire(IIIFEvents_1.IIIFEvents.ANNOTATIONS_EMPTY);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.THUMB_SELECTED, function (thumb) {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, thumb.index);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.TREE_NODE_SELECTED, function (node) {
            _this.fire(IIIFEvents_1.IIIFEvents.TREE_NODE_SELECTED, node.data.path);
            _this.treeNodeSelected(node);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.UP_ARROW, function () {
            if (!_this.useArrowKeysToNavigate()) {
                _this.centerPanel.setFocus();
            }
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.UPDATE_SETTINGS, function () {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, _this.helper.canvasIndex);
            var settings = _this.getSettings();
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SETTINGS_CHANGE, settings);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.SHOW_DOWNLOAD_DIALOGUE, function (triggerButton) {
            _this.store.getState().openDownloadDialogue(triggerButton[0]);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.HIDE_DOWNLOAD_DIALOGUE, function () {
            _this.store.getState().closeDialogue();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CLOSE_ACTIVE_DIALOGUE, function () {
            _this.store.getState().closeDialogue();
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.ESCAPE, function () {
            _this.store.getState().closeDialogue();
        });
        // this.component.subscribe(Events.VIEW_PAGE, (e: any, index: number) => {
        //     this.fire(Events.VIEW_PAGE, index);
        //     this.component.publish(BaseEvents.CANVAS_INDEX_CHANGE, [index]);
        // });
    };
    OpenSeadragonExtension.prototype.createModules = function () {
        _super.prototype.createModules.call(this);
        if (this.isHeaderPanelEnabled()) {
            this.headerPanel = new PagingHeaderPanel_1.PagingHeaderPanel(this.shell.$headerPanel);
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
        this.centerPanel = new OpenSeadragonCenterPanel_1.OpenSeadragonCenterPanel(this.shell.$centerPanel);
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
        this.$helpDialogue = $('<div class="overlay help" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$helpDialogue);
        this.helpDialogue = new HelpDialogue_1.HelpDialogue(this.$helpDialogue);
        this.$moreInfoDialogue = $('<div class="overlay moreInfo" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$moreInfoDialogue);
        this.moreInfoDialogue = new MoreInfoDialogue_1.MoreInfoDialogue(this.$moreInfoDialogue);
        this.$multiSelectDialogue = $('<div class="overlay multiSelect" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$multiSelectDialogue);
        this.multiSelectDialogue = new MultiSelectDialogue_1.MultiSelectDialogue(this.$multiSelectDialogue);
        this.$shareDialogue = $('<div class="overlay share" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$shareDialogue);
        this.shareDialogue = new ShareDialogue_1.ShareDialogue(this.$shareDialogue);
        this.$downloadDialogue = $("<div></div>");
        this.shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogueRoot = (0, client_1.createRoot)(this.$downloadDialogue[0]);
        this.$settingsDialogue = $('<div class="overlay settings" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$settingsDialogue);
        this.settingsDialogue = new SettingsDialogue_1.SettingsDialogue(this.$settingsDialogue);
        this.$externalContentDialogue = $('<div class="overlay externalContent" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$externalContentDialogue);
        this.externalContentDialogue = new ExternalContentDialogue_1.ExternalContentDialogue(this.$externalContentDialogue);
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
    OpenSeadragonExtension.prototype.render = function () {
        _super.prototype.render.call(this);
        this.checkForTarget();
        this.checkForAnnotations();
        this.checkForSearchParam();
        this.checkForRotationParam();
    };
    OpenSeadragonExtension.prototype.renderDownloadDialogue = function () {
        var _this = this;
        var _a;
        // todo: can this be added to store?
        var paged = this.isPagingSettingEnabled();
        var _b = this.store.getState(), downloadDialogueOpen = _b.downloadDialogueOpen, dialogueTriggerButton = _b.dialogueTriggerButton;
        // todo: can the overlay visibility be added to the store?
        if (downloadDialogueOpen) {
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_OVERLAY);
        }
        else {
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.HIDE_OVERLAY);
        }
        var pagedIndices = this.getPagedIndices();
        var canvases = this.helper
            .getCanvases()
            .filter(function (_canvas, index) {
            return pagedIndices.includes(index);
        });
        var config = (0, Utils_1.merge)(this.data.config.modules.dialogue, this.data.config.modules.downloadDialogue);
        var downloadService = this.helper.manifest.getService(dist_commonjs_1.ServiceProfile.DOWNLOAD_EXTENSIONS);
        var selectionEnabled = config.options.selectionEnabled &&
            (downloadService === null || downloadService === void 0 ? void 0 : downloadService.__jsonld.selectionEnabled);
        this.downloadDialogueRoot.render((0, react_1.createElement)(DownloadDialogue_1.default, {
            canvases: canvases,
            confinedImageSize: config.options.confinedImageSize,
            content: config.content,
            locale: this.getLocale(),
            manifest: this.helper.manifest,
            maxImageWidth: config.options.maxImageWidth,
            mediaDownloadEnabled: this.helper.isUIEnabled("mediaDownload"),
            open: downloadDialogueOpen,
            paged: paged,
            parent: this.shell.$overlays[0],
            resources: this.resources,
            requiredStatement: (_a = this.helper.getRequiredStatement()) === null || _a === void 0 ? void 0 : _a.value,
            termsOfUseEnabled: this.data.config.options.termsOfUseEnabled,
            rotation: this.getViewerRotation(),
            selectionEnabled: selectionEnabled,
            sequence: this.helper.getCurrentSequence(),
            triggerButton: dialogueTriggerButton,
            getCroppedImageDimensions: function (canvas) {
                return _this.getCroppedImageDimensions(canvas, _this.getViewer());
            },
            getConfinedImageDimensions: function (canvas) {
                return _this.getConfinedImageDimensions(canvas, config.options.confinedImageSize);
            },
            getConfinedImageUri: function (canvas) {
                return _this.getConfinedImageUri(canvas, config.options.confinedImageSize);
            },
            onClose: function () {
                _this.store.getState().closeDialogue();
            },
            onDownloadCurrentView: function (canvas) {
                var viewer = _this.getViewer();
                window.open(_this.getCroppedImageUri(canvas, viewer));
            },
            onDownloadSelection: function () {
                _this.store.getState().closeDialogue();
                _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_MULTISELECT_DIALOGUE);
            },
            onShowTermsOfUse: function () {
                _this.store.getState().closeDialogue();
                _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SHOW_TERMS_OF_USE);
            },
        }));
    };
    OpenSeadragonExtension.prototype.checkForTarget = function () {
        if (this.data.target) {
            // Split target into canvas id and selector
            var components = this.data.target.split("#");
            var canvasId = components[0];
            // get canvas index of canvas id and trigger CANVAS_INDEX_CHANGE (if different)
            var index = this.helper.getCanvasIndexById(canvasId);
            if (index !== null && this.helper.canvasIndex !== index) {
                this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, index);
            }
            // trigger SET_TARGET which calls fitToBounds(xywh) in OpenSeadragonCenterPanel
            var selector = components[1];
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SET_TARGET, XYWHFragment_1.XYWHFragment.fromString(selector));
        }
    };
    OpenSeadragonExtension.prototype.checkForAnnotations = function () {
        if (this.data.annotations) {
            // it's useful to group annotations by their target canvas
            var groupedAnnotations = [];
            var annotations = this.data.annotations;
            if (Array.isArray(annotations)) {
                // using the Web Annotation Data Model
                groupedAnnotations = this.groupWebAnnotationsByTarget(this.data.annotations);
            }
            else if (annotations.resources.length) {
                // using Open Annotations
                groupedAnnotations = this.groupOpenAnnotationsByTarget(this.data.annotations);
                // clear annotations as they're from a search
                this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CLEAR_ANNOTATIONS);
            }
            this.annotate(groupedAnnotations);
        }
    };
    OpenSeadragonExtension.prototype.annotate = function (annotations, terms) {
        this.annotations = annotations;
        // sort the annotations by canvasIndex
        this.annotations = annotations.sort(function (a, b) {
            return a.canvasIndex - b.canvasIndex;
        });
        var annotationResults = new AnnotationResults_1.AnnotationResults();
        annotationResults.terms = terms;
        annotationResults.annotations = this.annotations;
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.ANNOTATIONS, annotationResults);
        // reload current index as it may contain annotations.
        //this.component.publish(BaseEvents.CANVAS_INDEX_CHANGE, [this.helper.canvasIndex]);
    };
    OpenSeadragonExtension.prototype.groupWebAnnotationsByTarget = function (annotations) {
        var groupedAnnotations = [];
        var _loop_1 = function (i) {
            var annotation = annotations[i];
            var canvasId = annotation.target.match(/(.*)#/)[1];
            var canvasIndex = this_1.helper.getCanvasIndexById(canvasId);
            var annotationGroup = new manifold_1.AnnotationGroup(canvasId);
            annotationGroup.canvasIndex = canvasIndex;
            var match = groupedAnnotations.filter(function (x) { return x.canvasId === annotationGroup.canvasId; })[0];
            // if there's already an annotation for that target, add a rect to it, otherwise create a new AnnotationGroup
            if (match) {
                match.addRect(annotation);
            }
            else {
                annotationGroup.addRect(annotation);
                groupedAnnotations.push(annotationGroup);
            }
        };
        var this_1 = this;
        for (var i = 0; i < annotations.length; i++) {
            _loop_1(i);
        }
        return groupedAnnotations;
    };
    OpenSeadragonExtension.prototype.groupOpenAnnotationsByTarget = function (annotations) {
        var groupedAnnotations = [];
        var _loop_2 = function (i) {
            var resource = annotations.resources[i];
            var canvasId = resource.on.match(/(.*)#/)[1];
            // console.log(canvasId)
            var canvasIndex = this_2.helper.getCanvasIndexById(canvasId);
            var annotationGroup = new manifold_1.AnnotationGroup(canvasId);
            annotationGroup.canvasIndex = canvasIndex;
            var match = groupedAnnotations.filter(function (x) { return x.canvasId === annotationGroup.canvasId; })[0];
            // if there's already an annotation for that target, add a rect to it, otherwise create a new AnnotationGroup
            if (match) {
                match.addRect(resource);
            }
            else {
                annotationGroup.addRect(resource);
                groupedAnnotations.push(annotationGroup);
            }
        };
        var this_2 = this;
        for (var i = 0; i < annotations.resources.length; i++) {
            _loop_2(i);
        }
        // sort by canvasIndex
        groupedAnnotations.sort(function (a, b) {
            return a.canvasIndex - b.canvasIndex;
        });
        return groupedAnnotations;
    };
    OpenSeadragonExtension.prototype.checkForSearchParam = function () {
        // if a highlight param is set, use it to search.
        var highlight = (this.data).highlight;
        if (highlight) {
            highlight.replace(/\+/g, " ").replace(/"/g, "");
            this.extensionHost.publish(Events_1.OpenSeadragonExtensionEvents.SEARCH, highlight);
        }
    };
    OpenSeadragonExtension.prototype.checkForRotationParam = function () {
        // if a rotation value is passed, set rotation
        var rotation = (this.data).rotation;
        if (rotation) {
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SET_ROTATION, rotation);
        }
    };
    OpenSeadragonExtension.prototype.changeCanvas = function (canvasIndex) {
        // if it's an invalid canvas index.
        if (canvasIndex === -1)
            return;
        var isReload = false;
        if (canvasIndex === this.helper.canvasIndex) {
            isReload = true;
        }
        if (this.helper.isCanvasIndexOutOfRange(canvasIndex)) {
            this.showMessage(this.data.config.content.canvasIndexOutOfRange);
            canvasIndex = 0;
        }
        if (this.isPagingSettingEnabled() && !isReload) {
            var indices = this.getPagedIndices(canvasIndex);
            // if the page is already displayed, only advance canvasIndex.
            if (indices.includes(this.helper.canvasIndex)) {
                this.viewCanvas(canvasIndex);
                return;
            }
        }
        this.viewCanvas(canvasIndex);
    };
    OpenSeadragonExtension.prototype.getViewer = function () {
        return this.centerPanel.viewer;
    };
    OpenSeadragonExtension.prototype.getMode = function () {
        if (this.mode)
            return this.mode;
        switch (this.helper.getManifestType()) {
            case manifesto_js_1.ManifestType.MONOGRAPH:
                return Mode_1.Mode.page;
            case manifesto_js_1.ManifestType.MANUSCRIPT:
                return Mode_1.Mode.page;
            default:
                return Mode_1.Mode.image;
        }
    };
    OpenSeadragonExtension.prototype.getViewportBounds = function () {
        if (!this.centerPanel)
            return null;
        var bounds = this.centerPanel.getViewportBounds();
        if (bounds) {
            return bounds.toString();
        }
        return null;
    };
    OpenSeadragonExtension.prototype.getViewerRotation = function () {
        if (!this.centerPanel)
            return null;
        return this.currentRotation;
    };
    OpenSeadragonExtension.prototype.viewRange = function (path) {
        //this.currentRangePath = path;
        var range = this.helper.getRangeByPath(path);
        if (!range)
            return;
        var canvasId = range.getCanvasIds()[0];
        var index = this.helper.getCanvasIndexById(canvasId);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, index);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.RANGE_CHANGE, range);
    };
    OpenSeadragonExtension.prototype.viewLabel = function (label) {
        if (!label) {
            this.showMessage(this.data.config.modules.genericDialogue.content.emptyValue);
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE_FAILED);
            return;
        }
        var index = this.helper.getCanvasIndexByLabel(label);
        if (index != -1) {
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, index);
        }
        else {
            this.showMessage(this.data.config.modules.genericDialogue.content.pageNotFound);
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE_FAILED);
        }
    };
    OpenSeadragonExtension.prototype.treeNodeSelected = function (node) {
        var data = node.data;
        if (!data.type)
            return;
        switch (data.type) {
            case dist_commonjs_1.IIIFResourceType.MANIFEST:
                this.viewManifest(data);
                break;
            case dist_commonjs_1.IIIFResourceType.COLLECTION:
                // note: this won't get called as the tree component now has branchNodesSelectable = false
                // useful to keep around for reference
                this.viewCollection(data);
                break;
            default:
                this.viewRange(data.path);
                break;
        }
    };
    OpenSeadragonExtension.prototype.clearAnnotations = function () {
        this.annotations = [];
        // reload current index as it may contain results.
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, this.helper.canvasIndex);
    };
    OpenSeadragonExtension.prototype.prevSearchResult = function () {
        var foundResult;
        if (!this.annotations)
            return;
        // get the first result with a canvasIndex less than the current index.
        for (var i = this.annotations.length - 1; i >= 0; i--) {
            var result = this.annotations[i];
            if (result.canvasIndex <= this.getPrevPageIndex()) {
                foundResult = result;
                this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, foundResult.canvasIndex);
                break;
            }
        }
    };
    OpenSeadragonExtension.prototype.nextSearchResult = function () {
        if (!this.annotations)
            return;
        // get the first result with an index greater than the current index.
        for (var i = 0; i < this.annotations.length; i++) {
            var result = this.annotations[i];
            if (result && result.canvasIndex >= this.getNextPageIndex()) {
                this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, result.canvasIndex);
                break;
            }
        }
    };
    OpenSeadragonExtension.prototype.bookmark = function () {
        _super.prototype.bookmark.call(this);
        var canvas = this.helper.getCurrentCanvas();
        var bookmark = new Bookmark_1.Bookmark();
        bookmark.index = this.helper.canvasIndex;
        bookmark.label = manifesto_js_1.LanguageMap.getValue(canvas.getLabel());
        bookmark.path = this.getCroppedImageUri(canvas, this.getViewer());
        bookmark.thumb = canvas.getCanonicalImageUri(this.data.config.options.bookmarkThumbWidth);
        bookmark.title = this.helper.getLabel();
        bookmark.trackingLabel = window.trackingLabel;
        bookmark.type = dist_commonjs_1.ExternalResourceType.IMAGE;
        this.fire(IIIFEvents_1.IIIFEvents.BOOKMARK, bookmark);
    };
    OpenSeadragonExtension.prototype.print = function () {
        // var args: MultiSelectionArgs = new MultiSelectionArgs();
        // args.manifestUri = this.helper.manifestUri;
        // args.allCanvases = true;
        // args.format = this.data.config.options.printMimeType;
        // args.sequence = this.helper.getCurrentSequence().id;
        window.print();
        this.fire(Events_1.OpenSeadragonExtensionEvents.PRINT);
    };
    OpenSeadragonExtension.prototype.getCroppedImageDimensions = function (canvas, viewer) {
        if (!viewer)
            return null;
        if (!viewer.viewport)
            return null;
        var resourceWidth;
        var resourceHeight;
        if (canvas.getWidth()) {
            resourceWidth = canvas.getWidth();
        }
        else {
            resourceWidth = canvas.externalResource.width;
        }
        if (canvas.getHeight()) {
            resourceHeight = canvas.getHeight();
        }
        else {
            resourceHeight = canvas.externalResource.height;
        }
        if (!resourceWidth || !resourceHeight) {
            return null;
        }
        var bounds = viewer.viewport.getBounds(true);
        var dimensions = new CroppedImageDimensions_1.CroppedImageDimensions();
        var width = Math.floor(bounds.width);
        var height = Math.floor(bounds.height);
        var x = Math.floor(bounds.x);
        var y = Math.floor(bounds.y);
        // constrain to image bounds
        if (x + width > resourceWidth) {
            width = resourceWidth - x;
        }
        else if (x < 0) {
            width = width + x;
        }
        if (x < 0) {
            x = 0;
        }
        if (y + height > resourceHeight) {
            height = resourceHeight - y;
        }
        else if (y < 0) {
            height = height + y;
        }
        if (y < 0) {
            y = 0;
        }
        width = Math.min(width, resourceWidth);
        height = Math.min(height, resourceHeight);
        var regionWidth = width;
        var regionHeight = height;
        var maxDimensions = canvas.getMaxDimensions();
        if (maxDimensions) {
            if (width > maxDimensions.width) {
                var newWidth = maxDimensions.width;
                height = Math.round(newWidth * (height / width));
                width = newWidth;
            }
            if (height > maxDimensions.height) {
                var newHeight = maxDimensions.height;
                width = Math.round((width / height) * newHeight);
                height = newHeight;
            }
        }
        dimensions.region = new manifesto_js_1.Size(regionWidth, regionHeight);
        dimensions.regionPos = new Point_1.Point(x, y);
        dimensions.size = new manifesto_js_1.Size(width, height);
        return dimensions;
    };
    // keep this around for reference
    // getOnScreenCroppedImageDimensions(canvas: manifesto.Canvas, viewer: any): CroppedImageDimensions {
    //     if (!viewer) return null;
    //     if (!viewer.viewport) return null;
    //     if (!canvas.getHeight() || !canvas.getWidth()){
    //         return null;
    //     }
    //     var bounds = viewer.viewport.getBounds(true);
    //     var containerSize = viewer.viewport.getContainerSize();
    //     var zoom = viewer.viewport.getZoom(true);
    //     var top = Math.max(0, bounds.y);
    //     var left = Math.max(0, bounds.x);
    //     // change top to be normalised value proportional to height of image, not width (as per OSD).
    //     top = 1 / (canvas.getHeight() / parseInt(String(canvas.getWidth() * top)));
    //     // get on-screen pixel sizes.
    //     var viewportWidthPx = containerSize.x;
    //     var viewportHeightPx = containerSize.y;
    //     var imageWidthPx = parseInt(String(viewportWidthPx * zoom));
    //     var ratio = canvas.getWidth() / imageWidthPx;
    //     var imageHeightPx = parseInt(String(canvas.getHeight() / ratio));
    //     var viewportLeftPx = parseInt(String(left * imageWidthPx));
    //     var viewportTopPx = parseInt(String(top * imageHeightPx));
    //     var rect1Left = 0;
    //     var rect1Right = imageWidthPx;
    //     var rect1Top = 0;
    //     var rect1Bottom = imageHeightPx;
    //     var rect2Left = viewportLeftPx;
    //     var rect2Right = viewportLeftPx + viewportWidthPx;
    //     var rect2Top = viewportTopPx;
    //     var rect2Bottom = viewportTopPx + viewportHeightPx;
    //     var sizeWidth = Math.max(0, Math.min(rect1Right, rect2Right) - Math.max(rect1Left, rect2Left));
    //     var sizeHeight = Math.max(0, Math.min(rect1Bottom, rect2Bottom) - Math.max(rect1Top, rect2Top));
    //     // get original image pixel sizes.
    //     var ratio2 = canvas.getWidth() / imageWidthPx;
    //     var regionWidth = parseInt(String(sizeWidth * ratio2));
    //     var regionHeight = parseInt(String(sizeHeight * ratio2));
    //     var regionTop = parseInt(String(canvas.getHeight() * top));
    //     var regionLeft = parseInt(String(canvas.getWidth() * left));
    //     if (regionTop < 0) regionTop = 0;
    //     if (regionLeft < 0) regionLeft = 0;
    //     var dimensions: CroppedImageDimensions = new CroppedImageDimensions();
    //     dimensions.region = new manifesto.Size(regionWidth, regionHeight);
    //     dimensions.regionPos = new Point(regionLeft, regionTop);
    //     dimensions.size = new manifesto.Size(sizeWidth, sizeHeight);
    //     return dimensions;
    // }
    OpenSeadragonExtension.prototype.getCroppedImageUri = function (canvas, viewer) {
        if (!viewer)
            return null;
        if (!viewer.viewport)
            return null;
        var dimensions = this.getCroppedImageDimensions(canvas, viewer);
        if (!dimensions) {
            return null;
        }
        // construct uri
        // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
        var baseUri = this.getImageBaseUri(canvas);
        var id = this.getImageId(canvas);
        if (!id) {
            return null;
        }
        var region = dimensions.regionPos.x +
            "," +
            dimensions.regionPos.y +
            "," +
            dimensions.region.width +
            "," +
            dimensions.region.height;
        var size = dimensions.size.width + "," + dimensions.size.height;
        var rotation = this.getViewerRotation();
        var quality = "default";
        return baseUri + "/" + id + "/" + region + "/" + size + "/" + rotation + "/" + quality + ".jpg";
    };
    OpenSeadragonExtension.prototype.getConfinedImageDimensions = function (canvas, width) {
        var resourceWidth = canvas.getWidth();
        if (!resourceWidth) {
            resourceWidth = canvas.externalResource.width;
        }
        var resourceHeight = canvas.getHeight();
        if (!resourceHeight) {
            resourceHeight = canvas.externalResource.height;
        }
        var dimensions = new manifesto_js_1.Size(0, 0);
        dimensions.width = width;
        var normWidth = utils_1.Maths.normalise(width, 0, resourceWidth);
        dimensions.height = Math.floor(resourceHeight * normWidth);
        return dimensions;
    };
    OpenSeadragonExtension.prototype.getConfinedImageUri = function (canvas, width) {
        var baseUri = this.getImageBaseUri(canvas);
        // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
        var id = this.getImageId(canvas);
        if (!id) {
            return null;
        }
        var region = "full";
        var dimensions = this.getConfinedImageDimensions(canvas, width);
        var size = dimensions.width + "," + dimensions.height;
        var rotation = this.getViewerRotation();
        var quality = "default";
        return baseUri + "/" + id + "/" + region + "/" + size + "/" + rotation + "/" + quality + ".jpg";
    };
    OpenSeadragonExtension.prototype.getImageId = function (canvas) {
        if (canvas.externalResource) {
            var id = canvas.externalResource.data["@id"];
            if (id) {
                return id.substr(id.lastIndexOf("/") + 1);
            }
        }
        return null;
    };
    OpenSeadragonExtension.prototype.getImageBaseUri = function (canvas) {
        var uri = this.getInfoUri(canvas);
        // First trim off info.json, then trim off ID....
        uri = uri.substr(0, uri.lastIndexOf("/"));
        return uri.substr(0, uri.lastIndexOf("/"));
    };
    OpenSeadragonExtension.prototype.getInfoUri = function (canvas) {
        var infoUri = null;
        var images = canvas.getImages();
        // presentation 2
        if (images && images.length) {
            var firstImage = images[0];
            var resource = firstImage.getResource();
            var services = resource.getServices();
            for (var i = 0; i < services.length; i++) {
                var service = services[i];
                var id = service.id;
                if (!id.endsWith("/")) {
                    id += "/";
                }
                if (manifesto_js_1.Utils.isImageProfile(service.getProfile())) {
                    infoUri = id + "info.json";
                }
            }
        }
        else {
            // presentation 3
            images = canvas.getContent();
            var firstImage = images[0];
            var body = firstImage.getBody();
            if (body.length) {
                var services = body[0].getServices();
                for (var i = 0; i < services.length; i++) {
                    var service = services[i];
                    var id = service.id;
                    if (!id.endsWith("/")) {
                        id += "/";
                    }
                    if (manifesto_js_1.Utils.isImageProfile(service.getProfile())) {
                        infoUri = id + "info.json";
                    }
                }
            }
        }
        if (!infoUri) {
            // todo: use compiler flag (when available)
            infoUri = "lib/imageunavailable.json";
        }
        return infoUri;
    };
    OpenSeadragonExtension.prototype.getEmbedScript = function (template, width, height, zoom, rotation) {
        var config = this.data.config.uri || "";
        var locales = this.getSerializedLocales();
        var appUri = this.getAppUri();
        var iframeSrc = appUri + "#?manifest=" + this.helper.manifestUri + "&c=" + this.helper.collectionIndex + "&m=" + this.helper.manifestIndex + "&cv=" + this.helper.canvasIndex + "&config=" + config + "&locales=" + locales + "&xywh=" + zoom + "&r=" + rotation;
        var script = utils_1.Strings.format(template, iframeSrc, width.toString(), height.toString());
        return script;
    };
    OpenSeadragonExtension.prototype.isSearchEnabled = function () {
        if (!utils_1.Bools.getBool(this.data.config.options.searchWithinEnabled, false)) {
            return false;
        }
        if (!this.helper.getSearchService()) {
            return false;
        }
        return true;
    };
    OpenSeadragonExtension.prototype.isPagingSettingEnabled = function () {
        if (this.helper.isPagingAvailable()) {
            return this.getSettings().pagingEnabled;
        }
        return false;
    };
    OpenSeadragonExtension.prototype.getAutoCompleteService = function () {
        var service = this.helper.getSearchService();
        if (!service)
            return null;
        return (service.getService(dist_commonjs_1.ServiceProfile.SEARCH_0_AUTO_COMPLETE) ||
            service.getService(dist_commonjs_1.ServiceProfile.SEARCH_1_AUTO_COMPLETE));
    };
    OpenSeadragonExtension.prototype.getAutoCompleteUri = function () {
        var service = this.getAutoCompleteService();
        if (!service)
            return null;
        return service.id + "?q={0}";
    };
    OpenSeadragonExtension.prototype.getSearchServiceUri = function () {
        var service = this.helper.getSearchService();
        if (!service)
            return null;
        var uri = service.id;
        uri = uri + "?q={0}";
        return uri;
    };
    OpenSeadragonExtension.prototype.search = function (terms) {
        var _this = this;
        if (this.isAnnotating)
            return;
        this.isAnnotating = true;
        // clear search results
        this.annotations = [];
        var that = this;
        // searching
        var searchUri = this.getSearchServiceUri();
        if (!searchUri)
            return;
        searchUri = utils_1.Strings.format(searchUri, encodeURIComponent(terms));
        this.getSearchResults(searchUri, terms, this.annotations, function (annotations) {
            that.isAnnotating = false;
            if (annotations.length) {
                that.annotate(annotations, terms);
            }
            else {
                that.showMessage(that.data.config.modules.genericDialogue.content.noMatches, function () {
                    _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.ANNOTATIONS_EMPTY);
                });
            }
        });
    };
    OpenSeadragonExtension.prototype.getSearchResults = function (searchUri, terms, searchResults, cb) {
        var _this = this;
        fetch(searchUri)
            .then(function (response) { return response.json(); })
            .then(function (results) {
            if (results.resources && results.resources.length) {
                searchResults = searchResults.concat(_this.groupOpenAnnotationsByTarget(results));
            }
            if (results.next) {
                _this.getSearchResults(results.next, terms, searchResults, cb);
            }
            else {
                cb(searchResults);
            }
        });
    };
    OpenSeadragonExtension.prototype.getAnnotationRects = function () {
        if (this.annotations.length) {
            return this.annotations
                .map(function (x) {
                return x.rects;
            })
                .reduce(function (a, b) {
                return a.concat(b);
            });
        }
        return [];
    };
    OpenSeadragonExtension.prototype.getCurrentAnnotationRectIndex = function () {
        var annotationRects = this.getAnnotationRects();
        if (this.currentAnnotationRect) {
            return annotationRects.indexOf(this.currentAnnotationRect);
        }
        return -1;
    };
    OpenSeadragonExtension.prototype.getTotalAnnotationRects = function () {
        var annotationRects = this.getAnnotationRects();
        return annotationRects.length;
    };
    OpenSeadragonExtension.prototype.isFirstAnnotationRect = function () {
        return this.getCurrentAnnotationRectIndex() === 0;
    };
    OpenSeadragonExtension.prototype.getLastAnnotationRectIndex = function () {
        return this.getTotalAnnotationRects() - 1;
    };
    OpenSeadragonExtension.prototype.getPrevPageIndex = function (canvasIndex) {
        if (canvasIndex === void 0) { canvasIndex = this.helper.canvasIndex; }
        var index;
        if (this.isPagingSettingEnabled()) {
            var indices = this.getPagedIndices(canvasIndex);
            if (this.helper.isRightToLeft()) {
                index = indices[indices.length - 1] - 1;
            }
            else {
                index = indices[0] - 1;
            }
        }
        else {
            index = canvasIndex - 1;
        }
        return index;
    };
    OpenSeadragonExtension.prototype.getNextPageIndex = function (canvasIndex) {
        if (canvasIndex === void 0) { canvasIndex = this.helper.canvasIndex; }
        var index;
        // const canvas: Canvas | null = this.helper.getCanvasByIndex(canvasIndex);
        if (this.isPagingSettingEnabled()) {
            var indices = this.getPagedIndices(canvasIndex);
            if (this.helper.isRightToLeft()) {
                index = indices[0] + 1;
            }
            else {
                index = indices[indices.length - 1] + 1;
            }
        }
        else {
            index = canvasIndex + 1;
        }
        if (index > this.helper.getTotalCanvases() - 1) {
            return -1;
        }
        return index;
    };
    // https://github.com/UniversalViewer/iiif-thumbnails/blob/main/src/App.tsx#L49
    OpenSeadragonExtension.prototype.getPagedIndices = function (canvasIndex) {
        if (canvasIndex === void 0) { canvasIndex = this.helper.canvasIndex; }
        // todo: get these from the store (inc canvasIndex)
        var manifest = this.helper.manifest;
        var sequence = manifest.getSequences()[0];
        var canvases = sequence.getCanvases();
        var paged = (!!this.getSettings().pagingEnabled && this.helper.isPaged());
        var viewingDirection = this.helper.getViewingDirection();
        var indices = [];
        // if it's a continuous manifest, get all resources.
        if (sequence.getViewingHint() === dist_commonjs_1.ViewingHint.CONTINUOUS) {
            // get all canvases to be displayed inline
            indices = canvases.map(function (_canvas, index) {
                return index;
            });
        }
        else {
            if (!paged) {
                // one-up
                // if the current canvas index is for a non-paged canvas, only return that canvas index
                // don't pair it with another in two-up
                indices.push(canvasIndex);
            }
            else {
                // two-up
                if (canvasIndex === 0 ||
                    (canvasIndex === canvases.length && canvases.length % 2 === 0)) {
                    indices = [canvasIndex];
                }
                else if (canvasIndex % 2 === 0) {
                    // the current canvas index is even
                    // therefore it appears on the right
                    // only include prev canvas if it's not non-paged and the current canvas isn't non-paged
                    var currentCanvas = canvases[canvasIndex];
                    var prevCanvas = canvases[canvasIndex - 1];
                    if ((currentCanvas === null || currentCanvas === void 0 ? void 0 : currentCanvas.getViewingHint()) !== dist_commonjs_1.ViewingHint.NON_PAGED &&
                        (prevCanvas === null || prevCanvas === void 0 ? void 0 : prevCanvas.getViewingHint()) !== dist_commonjs_1.ViewingHint.NON_PAGED) {
                        if (prevCanvas) {
                            indices = [canvasIndex - 1, canvasIndex];
                        }
                        else {
                            indices = [canvasIndex];
                        }
                    }
                    else {
                        indices = [canvasIndex];
                    }
                }
                else {
                    // the current canvas index is odd
                    // therefore it appears on the left
                    // only include next canvas if it's not non-paged and the current canvas isn't non-paged
                    var currentCanvas = canvases[canvasIndex];
                    var nextCanvas = canvases[canvasIndex + 1];
                    if ((currentCanvas === null || currentCanvas === void 0 ? void 0 : currentCanvas.getViewingHint()) !== dist_commonjs_1.ViewingHint.NON_PAGED &&
                        (nextCanvas === null || nextCanvas === void 0 ? void 0 : nextCanvas.getViewingHint()) !== dist_commonjs_1.ViewingHint.NON_PAGED) {
                        if (nextCanvas) {
                            indices = [canvasIndex, canvasIndex + 1];
                        }
                        else {
                            indices = [canvasIndex];
                        }
                    }
                    else {
                        indices = [canvasIndex];
                    }
                }
                if (viewingDirection === dist_commonjs_1.ViewingDirection.RIGHT_TO_LEFT) {
                    indices = indices.reverse();
                }
            }
        }
        return indices;
    };
    return OpenSeadragonExtension;
}(BaseExtension_1.BaseExtension));
exports.default = OpenSeadragonExtension;
//# sourceMappingURL=Extension.js.map