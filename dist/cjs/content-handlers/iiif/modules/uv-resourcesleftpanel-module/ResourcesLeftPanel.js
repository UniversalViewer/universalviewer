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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesLeftPanel = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var LeftPanel_1 = require("../uv-shared-module/LeftPanel");
var ThumbsView_1 = require("./ThumbsView");
var dist_commonjs_1 = require("@iiif/vocabulary/dist-commonjs/");
var utils_1 = require("@edsilv/utils");
var manifesto_js_1 = require("manifesto.js");
var ResourcesLeftPanel = /** @class */ (function (_super) {
    __extends(ResourcesLeftPanel, _super);
    function ResourcesLeftPanel($element) {
        return _super.call(this, $element) || this;
    }
    ResourcesLeftPanel.prototype.create = function () {
        this.setConfig("resourcesLeftPanel");
        _super.prototype.create.call(this);
        this.setTitle(this.content.title);
        /*
             TODO: make tabs work
            this.$tabs = $('<div class="tabs"></div>');
            this.$main.append(this.$tabs);
    
            this.$thumbsButton = $('<a class="thumbs tab">' + this.content.thumbnails + '</a>');
            this.$thumbsButton.prop('title', this.content.thumbnails);
            this.$tabs.append(this.$thumbsButton);
    
            this.$resourcesButton = $('<a class="resources tab">' + this.content.resources+ '</a>');
            this.$resourcesButton.prop('title', this.content.resources);
            this.$tabs.append(this.$resourcesButton);
             */
        this.$tabsContent = $('<div class="tabsContent"></div>');
        this.$main.append(this.$tabsContent);
        this.$views = $('<div class="views"></div>');
        this.$tabsContent.append(this.$views);
        this.$thumbsView = $('<div class="thumbsView"></div>');
        this.$views.append(this.$thumbsView);
        this.$resourcesView = $('<div class="resourcesView"></div>');
        this.$resources = $("<ul></ul>");
        this.$resourcesView.append(this.$resources);
        this.$views.append(this.$resourcesView);
        this.thumbsView = new ThumbsView_1.ThumbsView(this.$thumbsView);
        this.dataBind();
    };
    ResourcesLeftPanel.prototype.dataBind = function () {
        this.dataBindThumbsView();
        var annotations = this.extension.helper
            .getCurrentCanvas()
            .getResources();
        if (annotations.length === 0) {
            this.$resourcesView.hide();
        }
        for (var i = 0; i < annotations.length; i++) {
            var annotation = annotations[i];
            var resource = annotation.getResource();
            if (resource) {
                var label = manifesto_js_1.LanguageMap.getValue(resource.getLabel());
                if (label) {
                    var mime = utils_1.Files.simplifyMimeType(resource.getFormat().toString());
                    var $listItem = $('<li><a href="' +
                        resource.id +
                        '" target="_blank">' +
                        label +
                        " (" +
                        mime +
                        ")" +
                        "</li>");
                    this.$resources.append($listItem);
                }
            }
        }
    };
    ResourcesLeftPanel.prototype.dataBindThumbsView = function () {
        if (!this.thumbsView)
            return;
        var width;
        var height;
        var viewingDirection = this.extension.helper.getViewingDirection();
        if (viewingDirection &&
            (viewingDirection === dist_commonjs_1.ViewingDirection.LEFT_TO_RIGHT ||
                viewingDirection === dist_commonjs_1.ViewingDirection.RIGHT_TO_LEFT)) {
            width = this.config.options.twoColThumbWidth;
            height = this.config.options.twoColThumbHeight;
        }
        else {
            width = this.config.options.oneColThumbWidth;
            height = this.config.options.oneColThumbHeight;
        }
        if (typeof width === "undefined") {
            width = 100;
        }
        if (typeof height === "undefined") {
            height = 100;
        }
        this.thumbsView.thumbs = this.extension.helper.getThumbs(width, height);
        // hide thumb selector for single-part manifests
        if (this.thumbsView.thumbs.length < 2) {
            this.$thumbsView.hide();
        }
        this.thumbsView.databind();
    };
    ResourcesLeftPanel.prototype.expandFullStart = function () {
        _super.prototype.expandFullStart.call(this);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LEFTPANEL_EXPAND_FULL_START);
    };
    ResourcesLeftPanel.prototype.expandFullFinish = function () {
        _super.prototype.expandFullFinish.call(this);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LEFTPANEL_EXPAND_FULL_FINISH);
    };
    ResourcesLeftPanel.prototype.collapseFullStart = function () {
        _super.prototype.collapseFullStart.call(this);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LEFTPANEL_COLLAPSE_FULL_START);
    };
    ResourcesLeftPanel.prototype.collapseFullFinish = function () {
        _super.prototype.collapseFullFinish.call(this);
        this.extensionHost.publish(IIIFEvents_1.IIIFEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
    };
    ResourcesLeftPanel.prototype.resize = function () {
        _super.prototype.resize.call(this);
        this.$views.height(this.$main.height());
        this.$resources.height(this.$main.height());
    };
    return ResourcesLeftPanel;
}(LeftPanel_1.LeftPanel));
exports.ResourcesLeftPanel = ResourcesLeftPanel;
//# sourceMappingURL=ResourcesLeftPanel.js.map