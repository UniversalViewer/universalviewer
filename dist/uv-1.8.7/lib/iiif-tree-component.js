// iiif-tree-component v1.0.1 https://github.com/viewdir/iiif-tree-component#readme
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.iiifTreeComponent = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){






var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IIIFComponents;
(function (IIIFComponents) {
    var TreeComponent = (function (_super) {
        __extends(TreeComponent, _super);
        function TreeComponent(options) {
            _super.call(this, options);
            this._init();
        }
        TreeComponent.prototype._init = function () {
            var success = _super.prototype._init.call(this);
            if (!success) {
                console.error("TreeComponent failed to initialise");
            }
            var that = this;
            this._$tree = $('<ul class="tree"></ul>');
            this._$element.append(this._$tree);
            $.templates({
                pageTemplate: '{^{for nodes}}\
                                {^{tree/}}\
                            {{/for}}',
                treeTemplate: '<li>\
                                {^{if nodes && nodes.length}}\
                                    <div class="toggle" data-link="class{merge:expanded toggle=\'expanded\'}"></div>\
                                {{else}}\
                                <div class="spacer"></div>\
                                {{/if}}\
                                {^{if multiSelectEnabled}}\
                                    <input id="tree-checkbox-{{>id}}" type="checkbox" data-link="checked{:multiSelected ? \'checked\' : \'\'}" class="multiSelect" />\
                                {{/if}}\
                                {^{if selected}}\
                                    <a id="tree-link-{{>id}}" href="#" title="{{>label}}" class="selected">{{>label}}</a>\
                                {{else}}\
                                    <a id="tree-link-{{>id}}" href="#" title="{{>label}}">{{>label}}</a>\
                                {{/if}}\
                            </li>\
                            {^{if expanded}}\
                                <li>\
                                    <ul>\
                                        {^{for nodes}}\
                                            {^{tree/}}\
                                        {{/for}}\
                                    </ul>\
                                </li>\
                            {{/if}}'
            });
            $.views.tags({
                tree: {
                    toggleExpanded: function () {
                        that._setNodeExpanded(this.data, !this.data.expanded);
                    },
                    toggleMultiSelect: function () {
                        that._setNodeMultiSelected(this.data, !!!this.data.multiSelected);
                        that._emit(TreeComponent.Events.TREE_NODE_MULTISELECTED, this.data);
                    },
                    init: function (tagCtx, linkCtx, ctx) {
                        this.data = tagCtx.view.data;
                        //this.data.text = this.data.label;
                    },
                    onAfterLink: function () {
                        var self = this;
                        self.contents('li').first()
                            .on('click', '.toggle', function () {
                            self.toggleExpanded();
                        }).on('click', 'a', function (e) {
                            e.preventDefault();
                            if (self.data.nodes.length)
                                self.toggleExpanded();
                            if (self.data.multiSelectEnabled) {
                                self.toggleMultiSelect();
                            }
                            else {
                                that._emit(TreeComponent.Events.TREE_NODE_SELECTED, self.data);
                            }
                        }).on('click', 'input.multiSelect', function (e) {
                            self.toggleMultiSelect();
                        });
                    },
                    template: $.templates.treeTemplate
                }
            });
            return success;
        };
        TreeComponent.prototype.databind = function (rootNode) {
            this._rootNode = rootNode;
            this._allNodes = null; // delete cache
            this._multiSelectableNodes = null; // delete cache
            this._$tree.link($.templates.pageTemplate, this._rootNode);
        };
        TreeComponent.prototype._getDefaultOptions = function () {
            return {};
        };
        TreeComponent.prototype.updateMultiSelectState = function (state) {
            this._multiSelectState = state;
            for (var i = 0; i < this._multiSelectState.ranges.length; i++) {
                var range = this._multiSelectState.ranges[i];
                var node = this._getMultiSelectableNodes().en().where(function (n) { return n.data.id === range.id; }).first();
                if (node) {
                    this._setNodeMultiSelectEnabled(node, range.multiSelectEnabled);
                    this._setNodeMultiSelected(node, range.multiSelected);
                }
            }
        };
        TreeComponent.prototype.allNodesSelected = function () {
            var applicableNodes = this._getMultiSelectableNodes();
            var multiSelectedNodes = this.getMultiSelectedNodes();
            return applicableNodes.length === multiSelectedNodes.length;
        };
        TreeComponent.prototype._getMultiSelectableNodes = function () {
            var _this = this;
            // if cached
            if (this._multiSelectableNodes) {
                return this._multiSelectableNodes;
            }
            return this._multiSelectableNodes = this._getAllNodes().en().where(function (n) { return _this._nodeIsMultiSelectable(n); }).toArray();
        };
        TreeComponent.prototype._nodeIsMultiSelectable = function (node) {
            return (node.isManifest() && node.nodes.length > 0 || node.isRange());
        };
        TreeComponent.prototype._getAllNodes = function () {
            // if cached
            if (this._allNodes) {
                return this._allNodes;
            }
            return this._allNodes = this._rootNode.nodes.en().traverseUnique(function (node) { return node.nodes; }).toArray();
        };
        TreeComponent.prototype.getMultiSelectedNodes = function () {
            var _this = this;
            return this._getAllNodes().en().where(function (n) { return _this._nodeIsMultiSelectable(n) && n.multiSelected; }).toArray();
        };
        TreeComponent.prototype.getNodeById = function (id) {
            return this._getAllNodes().en().where(function (n) { return n.id === id; }).first();
        };
        TreeComponent.prototype._multiSelectTreeNode = function (node, isSelected) {
            if (!this._nodeIsMultiSelectable(node))
                return;
            this._setNodeMultiSelected(node, isSelected);
            // recursively select/deselect child nodes
            for (var i = 0; i < node.nodes.length; i++) {
                var n = node.nodes[i];
                this._multiSelectTreeNode(n, isSelected);
            }
        };
        // private _updateParentNodes(node: Manifold.ITreeNode): void {
        //     var parentNode: Manifold.ITreeNode = <Manifold.ITreeNode>node.parentNode;
        //     if (!parentNode) return;
        //     // expand parents if selected
        //     if (node.selected) {
        //         this._expandParents(node);
        //     }
        //     // get the number of selected children.
        //     var checkedCount: number = parentNode.nodes.en().where(n => (<Manifold.ITreeNode>n).multiSelected).count();
        //     // if any are checked, check the parent.
        //     this._setNodeMultiSelected(parentNode, checkedCount > 0);
        //     var indeterminate: boolean = checkedCount > 0 && checkedCount < parentNode.nodes.length;
        //     this._setNodeIndeterminate(parentNode, indeterminate);
        //     // cascade up tree
        //     this._updateParentNodes(parentNode);
        // }
        TreeComponent.prototype._expandParents = function (node) {
            if (!node.parentNode)
                return;
            this._setNodeExpanded(node.parentNode, true);
            this._expandParents(node.parentNode);
        };
        TreeComponent.prototype._setNodeSelected = function (node, selected) {
            $.observable(node).setProperty("selected", selected);
        };
        TreeComponent.prototype._setNodeExpanded = function (node, expanded) {
            $.observable(node).setProperty("expanded", expanded);
        };
        TreeComponent.prototype._setNodeMultiSelected = function (node, selected) {
            $.observable(node).setProperty("multiSelected", selected);
            // if (!selected){
            //     this._setNodeIndeterminate(node, false);
            // }
        };
        TreeComponent.prototype._setNodeMultiSelectEnabled = function (node, enabled) {
            $.observable(node).setProperty("multiSelectEnabled", enabled);
        };
        // private _setNodeIndeterminate(node: Manifold.ITreeNode, indeterminate: boolean): void {
        //     var $checkbox: JQuery = this._getNodeCheckbox(node);
        //     $checkbox.prop("indeterminate", indeterminate);
        // }
        // private _getNodeCheckbox(node: Manifold.ITreeNode): JQuery {
        //     return $("#tree-checkbox-" + node.id);
        // }
        // private _getNodeSiblings(node: Manifold.ITreeNode): Manifold.ITreeNode[] {
        //     var siblings: Manifold.ITreeNode[] = [];
        //     if (node.parentNode){
        //         siblings = <Manifold.ITreeNode[]>node.parentNode.nodes.en().where(n => n !== node).toArray();
        //     }
        //     return siblings;
        // }
        TreeComponent.prototype.selectPath = function (path) {
            if (!this._rootNode)
                return;
            var pathArr = path.split("/");
            if (pathArr.length >= 1)
                pathArr.shift();
            var node = this.getNodeByPath(this._rootNode, pathArr);
            this.selectNode(node);
        };
        TreeComponent.prototype.deselectCurrentNode = function () {
            if (this._selectedNode)
                this._setNodeSelected(this._selectedNode, false);
        };
        TreeComponent.prototype.selectNode = function (node) {
            if (!this._rootNode)
                return;
            this.deselectCurrentNode();
            this._selectedNode = node;
            this._setNodeSelected(this._selectedNode, true);
            // todo: rather than manipulating the tree directly, allow manifests to be multi-selectable in manifold
            //this._updateParentNodes(this._selectedNode);
        };
        // walks down the tree using the specified path e.g. [2,2,0]
        TreeComponent.prototype.getNodeByPath = function (parentNode, path) {
            if (path.length === 0)
                return parentNode;
            var index = path.shift();
            var node = parentNode.nodes[index];
            return this.getNodeByPath(node, path);
        };
        TreeComponent.prototype.show = function () {
            this._$element.show();
        };
        TreeComponent.prototype.hide = function () {
            this._$element.hide();
        };
        TreeComponent.prototype._resize = function () {
        };
        return TreeComponent;
    }(_Components.BaseComponent));
    IIIFComponents.TreeComponent = TreeComponent;
})(IIIFComponents || (IIIFComponents = {}));
var IIIFComponents;
(function (IIIFComponents) {
    var TreeComponent;
    (function (TreeComponent) {
        var Events = (function () {
            function Events() {
            }
            Events.TREE_NODE_MULTISELECTED = 'treeNodeMultiSelected';
            Events.TREE_NODE_SELECTED = 'treeNodeSelected';
            return Events;
        }());
        TreeComponent.Events = Events;
    })(TreeComponent = IIIFComponents.TreeComponent || (IIIFComponents.TreeComponent = {}));
})(IIIFComponents || (IIIFComponents = {}));
(function (w) {
    if (!w.IIIFComponents) {
        w.IIIFComponents = IIIFComponents;
    }
    else {
        w.IIIFComponents.TreeComponent = IIIFComponents.TreeComponent;
    }
})(window);

},{}]},{},[1])(1)
});