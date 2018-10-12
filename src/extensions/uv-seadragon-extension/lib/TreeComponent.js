var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var IIIFComponents;
(function (IIIFComponents) {
    var TreeComponent = /** @class */ (function (_super) {
        __extends(TreeComponent, _super);
        function TreeComponent(options) {
            var _this = _super.call(this, options) || this;
            _this._data = _this.data();
            _this._data = _this.options.data;
            _this._init();
            return _this;
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
                        var node = this.data;
                        that._setNodeExpanded(node, !node.expanded);
                    },
                    toggleMultiSelect: function () {
                        var node = this.data;
                        that._setNodeMultiSelected(node, !!!node.multiSelected);
                        if (node.isRange()) {
                            var multiSelectState = that._getMultiSelectState();
                            if (multiSelectState) {
                                multiSelectState.selectRange(node.data, node.multiSelected);
                            }
                        }
                        that.fire(TreeComponent.Events.TREE_NODE_MULTISELECTED, node);
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
                            var node = self.data;
                            if (node.nodes.length && that._data.branchNodesExpandOnClick) {
                                self.toggleExpanded();
                            }
                            if (node.multiSelectEnabled) {
                                self.toggleMultiSelect();
                            }
                            else {
                                if (!node.nodes.length) {
                                    that.fire(TreeComponent.Events.TREE_NODE_SELECTED, node);
                                    that.selectNode(node);
                                }
                                else if (that._data.branchNodesSelectable) {
                                    that.fire(TreeComponent.Events.TREE_NODE_SELECTED, node);
                                    that.selectNode(node);
                                }
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
        TreeComponent.prototype.set = function (data) {
            var _this = this;
            this._data = Object.assign(this._data, data);
            if (!this._data.helper) {
                return;
            }
            this._rootNode = this._data.helper.getTree(this._data.topRangeIndex, this._data.treeSortType);
            this._allNodes = null; // delete cache
            this._multiSelectableNodes = null; // delete cache
            this._$tree.link($.templates.pageTemplate, this._rootNode);
            var multiSelectState = this._getMultiSelectState();
            if (multiSelectState) {
                var _loop_1 = function (i) {
                    var range = multiSelectState.ranges[i];
                    var node = this_1._getMultiSelectableNodes().en().where(function (n) { return n.data.id === range.id; }).first();
                    if (node) {
                        this_1._setNodeMultiSelectEnabled(node, range.multiSelectEnabled);
                        this_1._setNodeMultiSelected(node, range.multiSelected);
                    }
                };
                var this_1 = this;
                for (var i = 0; i < multiSelectState.ranges.length; i++) {
                    _loop_1(i);
                }
            }
            if (this._data.autoExpand) {
                var allNodes = this._getAllNodes();
                allNodes.forEach(function (node, index) {
                    if (node.nodes.length) {
                        _this._setNodeExpanded(node, true);
                    }
                });
            }
        };
        TreeComponent.prototype._getMultiSelectState = function () {
            if (this._data.helper) {
                return this._data.helper.getMultiSelectState();
            }
            return null;
        };
        TreeComponent.prototype.data = function () {
            return {
                autoExpand: false,
                branchNodesExpandOnClick: true,
                branchNodesSelectable: true,
                helper: null,
                topRangeIndex: 0,
                treeSortType: Manifold.TreeSortType.NONE
            };
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
        // private _multiSelectTreeNode(node: Manifold.ITreeNode, isSelected: boolean): void {
        //     if (!this._nodeIsMultiSelectable(node)) return;
        //     this._setNodeMultiSelected(node, isSelected);
        //     // recursively select/deselect child nodes
        //     for (let i = 0; i < node.nodes.length; i++){
        //         const n: Manifold.ITreeNode = <Manifold.ITreeNode>node.nodes[i];
        //         this._multiSelectTreeNode(n, isSelected);
        //     }
        // }
        // private _updateParentNodes(node: Manifold.ITreeNode): void {
        //     const parentNode: Manifold.ITreeNode = <Manifold.ITreeNode>node.parentNode;
        //     if (!parentNode) return;
        //     // expand parents if selected
        //     if (node.selected) {
        //         this._expandParents(node);
        //     }
        //     // get the number of selected children.
        //     const checkedCount: number = parentNode.nodes.en().where(n => (<Manifold.ITreeNode>n).multiSelected).count();
        //     // if any are checked, check the parent.
        //     this._setNodeMultiSelected(parentNode, checkedCount > 0);
        //     const indeterminate: boolean = checkedCount > 0 && checkedCount < parentNode.nodes.length;
        //     this._setNodeIndeterminate(parentNode, indeterminate);
        //     // cascade up tree
        //     this._updateParentNodes(parentNode);
        // }
        // private _expandParents(node: Manifold.ITreeNode): void{
        //     if (!node.parentNode) return;
        //     this._setNodeExpanded(<Manifold.ITreeNode>node.parentNode, true);
        //     this._expandParents(<Manifold.ITreeNode>node.parentNode);
        // }
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
        //     const $checkbox: JQuery = this._getNodeCheckbox(node);
        //     $checkbox.prop("indeterminate", indeterminate);
        // }
        // private _getNodeCheckbox(node: Manifold.ITreeNode): JQuery {
        //     return $("#tree-checkbox-" + node.id);
        // }
        // private _getNodeSiblings(node: Manifold.ITreeNode): Manifold.ITreeNode[] {
        //     const siblings: Manifold.ITreeNode[] = [];
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
        };
        // walks down the tree using the specified path e.g. [2,2,0]
        TreeComponent.prototype.getNodeByPath = function (parentNode, path) {
            if (path.length === 0)
                return parentNode;
            var index = Number(path.shift());
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
(function (IIIFComponents) {
    var TreeComponent;
    (function (TreeComponent) {
        var Events = /** @class */ (function () {
            function Events() {
            }
            Events.TREE_NODE_MULTISELECTED = 'treeNodeMultiSelected';
            Events.TREE_NODE_SELECTED = 'treeNodeSelected';
            return Events;
        }());
        TreeComponent.Events = Events;
    })(TreeComponent = IIIFComponents.TreeComponent || (IIIFComponents.TreeComponent = {}));
})(IIIFComponents || (IIIFComponents = {}));
(function (g) {
    if (!g.IIIFComponents) {
        g.IIIFComponents = IIIFComponents;
    }
    else {
        g.IIIFComponents.TreeComponent = IIIFComponents.TreeComponent;
    }
})(window);
