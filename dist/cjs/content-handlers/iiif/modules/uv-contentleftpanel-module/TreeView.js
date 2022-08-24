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
exports.TreeView = void 0;
var $ = window.$;
var IIIFEvents_1 = require("../../IIIFEvents");
var BaseView_1 = require("../uv-shared-module/BaseView");
var iiif_tree_component_1 = require("@iiif/iiif-tree-component");
var TreeView = /** @class */ (function (_super) {
    __extends(TreeView, _super);
    function TreeView($element) {
        var _this = _super.call(this, $element, true, true) || this;
        _this.isOpen = false;
        return _this;
    }
    TreeView.prototype.create = function () {
        this.setConfig("contentLeftPanel");
        _super.prototype.create.call(this);
        this.$tree = $('<div class="iiif-tree-component"></div>');
        this.$element.append(this.$tree);
    };
    TreeView.prototype.setup = function () {
        var that = this;
        this.treeComponent = new iiif_tree_component_1.TreeComponent({
            target: this.$tree[0],
            data: this.treeData,
        });
        this.treeComponent.on("treeNodeSelected", function (node) {
            that.extensionHost.publish(IIIFEvents_1.IIIFEvents.TREE_NODE_SELECTED, node);
        }, false);
        this.treeComponent.on("treeNodeMultiSelected", function (node) {
            that.extensionHost.publish(IIIFEvents_1.IIIFEvents.TREE_NODE_MULTISELECTED, node);
        }, false);
    };
    TreeView.prototype.databind = function () {
        this.treeComponent.set(this.treeData);
        this.resize();
    };
    TreeView.prototype.show = function () {
        this.isOpen = true;
        this.$element.show();
    };
    TreeView.prototype.hide = function () {
        this.isOpen = false;
        this.$element.hide();
    };
    TreeView.prototype.selectNode = function (node) {
        if (!this.treeComponent.selectedNode) {
            this.treeComponent.expandParents(node, true);
            var link = this.$tree.find("#tree-link-" + node.id)[0];
            if (link) {
                // link.scrollIntoView({ inline: 'center' });
            }
        }
        this.treeComponent.selectNode(node);
    };
    TreeView.prototype.expandNode = function (node, expanded) {
        this.treeComponent.expandNode(node, expanded);
    };
    TreeView.prototype.getAllNodes = function () {
        return this.treeComponent.getAllNodes();
    };
    TreeView.prototype.deselectCurrentNode = function () {
        this.treeComponent.deselectCurrentNode();
    };
    TreeView.prototype.getNodeById = function (id) {
        return this.treeComponent.getNodeById(id);
    };
    TreeView.prototype.resize = function () {
        _super.prototype.resize.call(this);
    };
    return TreeView;
}(BaseView_1.BaseView));
exports.TreeView = TreeView;
//# sourceMappingURL=TreeView.js.map