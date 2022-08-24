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
var ContentLeftPanel_1 = require("../../modules/uv-contentleftpanel-module/ContentLeftPanel");
var DownloadDialogue_1 = require("./DownloadDialogue");
var FooterPanel_1 = require("../../modules/uv-shared-module/FooterPanel");
var MobileFooter_1 = require("../../modules/uv-modelviewermobilefooterpanel-module/MobileFooter");
var HeaderPanel_1 = require("../../modules/uv-shared-module/HeaderPanel");
var MoreInfoDialogue_1 = require("../../modules/uv-dialogues-module/MoreInfoDialogue");
var MoreInfoRightPanel_1 = require("../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel");
var SettingsDialogue_1 = require("./SettingsDialogue");
var ShareDialogue_1 = require("./ShareDialogue");
var ModelViewerCenterPanel_1 = require("../../modules/uv-modelviewercenterpanel-module/ModelViewerCenterPanel");
var dist_commonjs_1 = require("@iiif/vocabulary/dist-commonjs/");
var utils_1 = require("@edsilv/utils");
var manifesto_js_1 = require("manifesto.js");
var Events_1 = require("./Events");
var Orbit_1 = require("./Orbit");
require("./theme/theme.less");
var en_GB_json_1 = __importDefault(require("./config/en-GB.json"));
var manifold_1 = require("@iiif/manifold");
var AnnotationResults_1 = require("../../modules/uv-shared-module/AnnotationResults");
var ModelViewerExtension = /** @class */ (function (_super) {
    __extends(ModelViewerExtension, _super);
    function ModelViewerExtension() {
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
    ModelViewerExtension.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, function (canvasIndex) {
            _this.viewCanvas(canvasIndex);
        });
        this.extensionHost.subscribe(IIIFEvents_1.IIIFEvents.THUMB_SELECTED, function (canvasIndex) {
            _this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, canvasIndex);
        });
        this.extensionHost.subscribe(Events_1.ModelViewerExtensionEvents.CAMERA_CHANGE, function (orbit) {
            var canvas = _this.helper.getCurrentCanvas();
            if (canvas) {
                _this.data.target = canvas.id + "#" + ("orbit=" + orbit.toString());
                _this.fire(IIIFEvents_1.IIIFEvents.TARGET_CHANGE, _this.data.target);
            }
        });
    };
    ModelViewerExtension.prototype.createModules = function () {
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
        this.centerPanel = new ModelViewerCenterPanel_1.ModelViewerCenterPanel(this.shell.$centerPanel);
        if (this.isRightPanelEnabled()) {
            this.rightPanel = new MoreInfoRightPanel_1.MoreInfoRightPanel(this.shell.$rightPanel);
        }
        if (this.isFooterPanelEnabled()) {
            this.footerPanel = new FooterPanel_1.FooterPanel(this.shell.$footerPanel);
            this.mobileFooterPanel = new MobileFooter_1.FooterPanel(this.shell.$mobileFooterPanel);
        }
        else {
            this.shell.$footerPanel.hide();
        }
        this.$moreInfoDialogue = $('<div class="overlay moreInfo" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$moreInfoDialogue);
        this.moreInfoDialogue = new MoreInfoDialogue_1.MoreInfoDialogue(this.$moreInfoDialogue);
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
        else {
            this.shell.$leftPanel.hide();
        }
        if (this.isRightPanelEnabled()) {
            this.rightPanel.init();
        }
        else {
            this.shell.$rightPanel.hide();
        }
    };
    ModelViewerExtension.prototype.render = function () {
        _super.prototype.render.call(this);
        this.checkForTarget();
        this.checkForAnnotations();
    };
    ModelViewerExtension.prototype.checkForTarget = function () {
        if (this.data.target) {
            // Split target into canvas id and selector
            var components = this.data.target.split("#");
            var canvasId = components[0];
            // get canvas index of canvas id and trigger CANVAS_INDEX_CHANGE (if different)
            var index = this.helper.getCanvasIndexById(canvasId);
            if (index !== null && this.helper.canvasIndex !== index) {
                this.extensionHost.publish(IIIFEvents_1.IIIFEvents.CANVAS_INDEX_CHANGE, index);
            }
            // trigger SET_TARGET which sets the camera-orbit attribute in ModelViewerCenterPanel
            var selector = components[1];
            this.extensionHost.publish(IIIFEvents_1.IIIFEvents.SET_TARGET, Orbit_1.Orbit.fromString(selector));
        }
    };
    ModelViewerExtension.prototype.checkForAnnotations = function () {
        if (this.data.annotations) {
            // it's useful to group annotations by their target canvas
            var groupedAnnotations = [];
            var annotations = this.data.annotations;
            if (Array.isArray(annotations)) {
                // using the Web Annotation Data Model
                groupedAnnotations = this.groupWebAnnotationsByTarget(this.data.annotations);
            }
            this.annotate(groupedAnnotations);
        }
    };
    ModelViewerExtension.prototype.annotate = function (annotations, terms) {
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
    ModelViewerExtension.prototype.groupWebAnnotationsByTarget = function (annotations) {
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
                match.addPoint3D(annotation);
            }
            else {
                annotationGroup.addPoint3D(annotation);
                groupedAnnotations.push(annotationGroup);
            }
        };
        var this_1 = this;
        for (var i = 0; i < annotations.length; i++) {
            _loop_1(i);
        }
        return groupedAnnotations;
    };
    ModelViewerExtension.prototype.isLeftPanelEnabled = function () {
        return false;
        // return (
        //   Bools.getBool(this.data.config.options.leftPanelEnabled, true) &&
        //   (this.helper.isMultiCanvas() || this.helper.isMultiSequence())
        // );
    };
    ModelViewerExtension.prototype.bookmark = function () {
        _super.prototype.bookmark.call(this);
        var canvas = this.helper.getCurrentCanvas();
        var bookmark = new Bookmark_1.Bookmark();
        bookmark.index = this.helper.canvasIndex;
        bookmark.label = manifesto_js_1.LanguageMap.getValue(canvas.getLabel());
        bookmark.thumb = canvas.getProperty("thumbnail");
        bookmark.title = this.helper.getLabel();
        bookmark.trackingLabel = window.trackingLabel;
        bookmark.type = dist_commonjs_1.ExternalResourceType.PHYSICAL_OBJECT;
        this.fire(IIIFEvents_1.IIIFEvents.BOOKMARK, bookmark);
    };
    ModelViewerExtension.prototype.getEmbedScript = function (template, width, height) {
        var appUri = this.getAppUri();
        var iframeSrc = appUri + "#?manifest=" + this.helper.manifestUri + "&c=" + this.helper.collectionIndex + "&m=" + this.helper.manifestIndex + "&cv=" + this.helper.canvasIndex;
        var script = utils_1.Strings.format(template, iframeSrc, width.toString(), height.toString());
        return script;
    };
    return ModelViewerExtension;
}(BaseExtension_1.BaseExtension));
exports.default = ModelViewerExtension;
//# sourceMappingURL=Extension.js.map