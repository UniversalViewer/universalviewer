// manifold v1.0.0 https://github.com/UniversalViewer/manifold#readme
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.manifold = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var Manifold;
(function (Manifold) {
    var StringValue = (function () {
        function StringValue(value) {
            this.value = "";
            if (value) {
                this.value = value.toLowerCase();
            }
        }
        StringValue.prototype.toString = function () {
            return this.value;
        };
        return StringValue;
    }());
    Manifold.StringValue = StringValue;
})(Manifold || (Manifold = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Manifold;
(function (Manifold) {
    var TreeSortType = (function (_super) {
        __extends(TreeSortType, _super);
        function TreeSortType() {
            _super.apply(this, arguments);
        }
        // todo: use getters when ES3 target is no longer required.
        TreeSortType.prototype.date = function () {
            return new TreeSortType(TreeSortType.DATE.toString());
        };
        TreeSortType.prototype.none = function () {
            return new TreeSortType(TreeSortType.NONE.toString());
        };
        TreeSortType.DATE = new TreeSortType("date");
        TreeSortType.NONE = new TreeSortType("none");
        return TreeSortType;
    }(Manifold.StringValue));
    Manifold.TreeSortType = TreeSortType;
})(Manifold || (Manifold = {}));

/// <reference path="./StringValue.ts" />
/// <reference path="./TreeSortType.ts" /> 

var Manifold;
(function (Manifold) {
    var Bootstrapper = (function () {
        function Bootstrapper(options) {
            this._options = options;
        }
        Bootstrapper.prototype.bootstrap = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                manifesto.loadManifest(that._options.iiifResourceUri).then(function (json) {
                    var _this = this;
                    var iiifResource = manifesto.create(json);
                    // only set the root IIIFResource on the first load
                    if (!that._options.iiifResource) {
                        that._options.iiifResource = iiifResource;
                    }
                    if (iiifResource.getIIIFResourceType().toString() === manifesto.IIIFResourceType.collection().toString()) {
                        // if it's a collection and has child collections, get the collection by index
                        if (iiifResource.collections && iiifResource.collections.length) {
                            iiifResource.getCollectionByIndex(that._options.collectionIndex).then(function (collection) {
                                if (!collection) {
                                    reject();
                                }
                                // Special case: we're trying to load the first manifest of the
                                // collection, but the collection has no manifests but does have
                                // subcollections. Thus, we should dive in until we find something
                                // we can display!
                                if (collection.getTotalManifests() === 0 && _this.manifestIndex === 0 && collection.getTotalCollections() > 0) {
                                    that._options.collectionIndex = 0;
                                    that._options.iiifResourceUri = collection.id;
                                    that.bootstrap();
                                }
                                collection.getManifestByIndex(that._options.manifestIndex).then(function (manifest) {
                                    that._options.manifest = manifest;
                                    var helper = new Manifold.Helper(that._options);
                                    resolve(helper);
                                });
                            });
                        }
                        else {
                            iiifResource.getManifestByIndex(that._options.manifestIndex).then(function (manifest) {
                                that._options.manifest = manifest;
                                var helper = new Manifold.Helper(that._options);
                                resolve(helper);
                            });
                        }
                    }
                    else {
                        that._options.manifest = iiifResource;
                        var helper = new Manifold.Helper(that._options);
                        resolve(helper);
                    }
                });
            });
        };
        return Bootstrapper;
    }());
    Manifold.Bootstrapper = Bootstrapper;
})(Manifold || (Manifold = {}));

var Manifold;
(function (Manifold) {
    var Helper = (function () {
        function Helper(options) {
            this.iiifResource = options.iiifResource;
            this.iiifResourceUri = options.iiifResourceUri;
            this.manifest = options.manifest;
            this.collectionIndex = options.collectionIndex || 0;
            this.manifestIndex = options.manifestIndex || 0;
            this.sequenceIndex = options.sequenceIndex || 0;
            this.canvasIndex = options.canvasIndex || 0;
        }
        // getters //
        Helper.prototype.getAutoCompleteService = function () {
            var service = this.getSearchWithinService();
            if (!service)
                return null;
            return service.getService(manifesto.ServiceProfile.autoComplete());
        };
        Helper.prototype.getAttribution = function () {
            return this.manifest.getAttribution();
        };
        Helper.prototype.getCanvases = function () {
            return this.getCurrentSequence().getCanvases();
        };
        Helper.prototype.getCanvasById = function (id) {
            return this.getCurrentSequence().getCanvasById(id);
        };
        Helper.prototype.getCanvasesById = function (ids) {
            var canvases = [];
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                canvases.push(this.getCanvasById(id));
            }
            return canvases;
        };
        Helper.prototype.getCanvasByIndex = function (index) {
            return this.getCurrentSequence().getCanvasByIndex(index);
        };
        Helper.prototype.getCanvasIndexById = function (id) {
            return this.getCurrentSequence().getCanvasIndexById(id);
        };
        Helper.prototype.getCanvasIndexByLabel = function (label) {
            var foliated = this.getManifestType().toString() === manifesto.ManifestType.manuscript().toString();
            return this.getCurrentSequence().getCanvasIndexByLabel(label, foliated);
        };
        Helper.prototype.getCanvasMetadata = function (canvas) {
            var result = [];
            var metadata = canvas.getMetadata();
            if (metadata) {
                result.push({
                    label: "metadata",
                    value: metadata,
                    isRootLevel: true
                });
            }
            return result;
        };
        Helper.prototype.getCanvasRange = function (canvas, path) {
            var ranges = this.getCanvasRanges(canvas);
            if (path) {
                for (var i = 0; i < ranges.length; i++) {
                    var range = ranges[i];
                    if (range.path === path) {
                        return range;
                    }
                }
                return null;
            }
            else {
                return ranges[0]; // else return the first range
            }
        };
        Helper.prototype.getCanvasRanges = function (canvas) {
            if (canvas.ranges) {
                return canvas.ranges; // cache
            }
            else {
                canvas.ranges = this.manifest.getRanges().en().where(function (range) { return (range.getCanvasIds().en().any(function (c) { return c === canvas.id; })); }).toArray();
            }
            return canvas.ranges;
        };
        Helper.prototype.getCollectionIndex = function (iiifResource) {
            // todo: support nested collections. walk up parents adding to array and return csv string.
            var index;
            if (iiifResource.parentCollection) {
                index = iiifResource.parentCollection.index;
            }
            return index;
        };
        Helper.prototype.getCurrentCanvas = function () {
            return this.getCurrentSequence().getCanvasByIndex(this.canvasIndex);
        };
        Helper.prototype.getCurrentElement = function () {
            return this.getCanvasByIndex(this.canvasIndex);
        };
        Helper.prototype.getCurrentSequence = function () {
            return this.getSequenceByIndex(this.sequenceIndex);
        };
        Helper.prototype.getElementType = function (element) {
            if (!element) {
                element = this.getCurrentCanvas();
            }
            return element.getType();
        };
        Helper.prototype.getFirstPageIndex = function () {
            return 0;
        };
        Helper.prototype.getInfoUri = function (canvas) {
            // default to IxIF
            var service = canvas.getService(manifesto.ServiceProfile.ixif());
            if (service) {
                return service.getInfoUri();
            }
            // return the canvas id.
            return canvas.id;
        };
        Helper.prototype.getLabel = function () {
            return this.manifest.getLabel();
        };
        Helper.prototype.getLastCanvasLabel = function (alphanumeric) {
            return this.getCurrentSequence().getLastCanvasLabel(alphanumeric);
        };
        Helper.prototype.getLastPageIndex = function () {
            return this.getTotalCanvases() - 1;
        };
        Helper.prototype.getLicense = function () {
            return this.manifest.getLicense();
        };
        Helper.prototype.getLogo = function () {
            return this.manifest.getLogo();
        };
        Helper.prototype.getManifestType = function () {
            var manifestType = this.manifest.getManifestType();
            // default to monograph
            if (manifestType.toString() === "") {
                manifestType = manifesto.ManifestType.monograph();
            }
            return manifestType;
        };
        Helper.prototype.getMetadata = function (licenseFormatter) {
            var result = [];
            var metadata = this.manifest.getMetadata();
            if (metadata) {
                result.push({
                    label: "metadata",
                    value: metadata,
                    isRootLevel: true
                });
            }
            if (this.manifest.getDescription()) {
                result.push({
                    label: "description",
                    value: this.manifest.getDescription(),
                    isRootLevel: true
                });
            }
            if (this.manifest.getAttribution()) {
                result.push({
                    label: "attribution",
                    value: this.manifest.getAttribution(),
                    isRootLevel: true
                });
            }
            if (this.manifest.getLicense()) {
                result.push({
                    label: "license",
                    value: licenseFormatter ? licenseFormatter.format(this.manifest.getLicense()) : this.manifest.getLicense(),
                    isRootLevel: true
                });
            }
            if (this.manifest.getLogo()) {
                result.push({
                    label: "logo",
                    value: '<img src="' + this.manifest.getLogo() + '"/>',
                    isRootLevel: true
                });
            }
            return result;
        };
        Helper.prototype.getMultiSelectState = function () {
            var m = new Manifold.MultiSelectState();
            m.ranges = this.getRanges().clone();
            m.canvases = this.getCurrentSequence().getCanvases().clone();
            return m;
        };
        Helper.prototype.getPagedIndices = function (canvasIndex) {
            if (typeof (canvasIndex) === 'undefined')
                canvasIndex = this.canvasIndex;
            return [canvasIndex];
        };
        Helper.prototype.getRanges = function () {
            return this.manifest.getRanges();
        };
        Helper.prototype.getRangeByPath = function (path) {
            return this.manifest.getRangeByPath(path);
        };
        Helper.prototype.getRangeCanvases = function (range) {
            var ids = range.getCanvasIds();
            return this.getCanvasesById(ids);
        };
        Helper.prototype.getResources = function () {
            var element = this.getCurrentElement();
            return element.getResources();
        };
        Helper.prototype.getSearchWithinService = function () {
            return this.manifest.getService(manifesto.ServiceProfile.searchWithin());
        };
        Helper.prototype.getSeeAlso = function () {
            return this.manifest.getSeeAlso();
        };
        Helper.prototype.getSequenceByIndex = function (index) {
            return this.manifest.getSequenceByIndex(index);
        };
        Helper.prototype.getSortedTreeNodesByDate = function (sortedTree, tree) {
            var all = tree.nodes.en().traverseUnique(function (node) { return node.nodes; })
                .where(function (n) { return n.data.type === manifesto.TreeNodeType.collection().toString() ||
                n.data.type === manifesto.TreeNodeType.manifest().toString(); }).toArray();
            //var collections: ITreeNode[] = tree.nodes.en().traverseUnique(n => n.nodes)
            //    .where((n) => n.data.type === ITreeNodeType.collection().toString()).toArray();
            var manifests = tree.nodes.en().traverseUnique(function (n) { return n.nodes; })
                .where(function (n) { return n.data.type === manifesto.TreeNodeType.manifest().toString(); }).toArray();
            this.createDecadeNodes(sortedTree, all);
            this.sortDecadeNodes(sortedTree);
            this.createYearNodes(sortedTree, all);
            this.sortYearNodes(sortedTree);
            this.createMonthNodes(sortedTree, manifests);
            this.sortMonthNodes(sortedTree);
            this.createDateNodes(sortedTree, manifests);
            this.pruneDecadeNodes(sortedTree);
        };
        Helper.prototype.getStartCanvasIndex = function () {
            return this.getCurrentSequence().getStartCanvasIndex();
        };
        Helper.prototype.getThumbs = function (width, height) {
            return this.getCurrentSequence().getThumbs(width, height);
        };
        Helper.prototype.getTotalCanvases = function () {
            return this.getCurrentSequence().getTotalCanvases();
        };
        Helper.prototype.getTrackingLabel = function () {
            return this.manifest.getTrackingLabel();
        };
        Helper.prototype.getTree = function (sortType) {
            var tree = this.iiifResource.getTree();
            var sortedTree = manifesto.getTreeNode();
            switch (sortType.toString()) {
                case Manifold.TreeSortType.DATE.toString():
                    // returns a list of treenodes for each decade.
                    // expanding a decade generates a list of years
                    // expanding a year gives a list of months containing issues
                    // expanding a month gives a list of issues.
                    if (this._treeHasNavDates(tree)) {
                        this.getSortedTreeNodesByDate(sortedTree, tree);
                        break;
                    }
                default:
                    sortedTree = tree;
            }
            return sortedTree;
        };
        Helper.prototype._treeHasNavDates = function (tree) {
            var node = tree.nodes.en().traverseUnique(function (node) { return node.nodes; }).where(function (n) { return !isNaN(n.navDate); }).first();
            return (node) ? true : false;
        };
        Helper.prototype.getViewingDirection = function () {
            var viewingDirection = this.getCurrentSequence().getViewingDirection();
            if (!viewingDirection.toString()) {
                viewingDirection = this.manifest.getViewingDirection();
            }
            return viewingDirection;
        };
        Helper.prototype.getViewingHint = function () {
            var viewingHint = this.getCurrentSequence().getViewingHint();
            if (!viewingHint.toString()) {
                viewingHint = this.manifest.getViewingHint();
            }
            return viewingHint;
        };
        // inquiries //
        Helper.prototype.hasParentCollection = function () {
            return !!this.manifest.parentCollection;
        };
        Helper.prototype.hasResources = function () {
            return this.getResources().length > 0;
        };
        Helper.prototype.isBottomToTop = function () {
            return this.getViewingDirection().toString() === manifesto.ViewingDirection.bottomToTop().toString();
        };
        Helper.prototype.isCanvasIndexOutOfRange = function (index) {
            return this.getCurrentSequence().isCanvasIndexOutOfRange(index);
        };
        Helper.prototype.isContinuous = function () {
            return this.getViewingHint().toString() === manifesto.ViewingHint.continuous().toString();
        };
        Helper.prototype.isFirstCanvas = function (index) {
            return this.getCurrentSequence().isFirstCanvas(index);
        };
        Helper.prototype.isHorizontallyAligned = function () {
            return this.isLeftToRight() || this.isRightToLeft();
        };
        Helper.prototype.isLastCanvas = function (index) {
            return this.getCurrentSequence().isLastCanvas(index);
        };
        Helper.prototype.isLeftToRight = function () {
            return this.getViewingDirection().toString() === manifesto.ViewingDirection.leftToRight().toString();
        };
        Helper.prototype.isMultiCanvas = function () {
            return this.getCurrentSequence().isMultiCanvas();
        };
        Helper.prototype.isMultiSequence = function () {
            return this.manifest.isMultiSequence();
        };
        Helper.prototype.isPaged = function () {
            return this.getViewingHint().toString() === manifesto.ViewingHint.paged().toString();
        };
        Helper.prototype.isPagingAvailable = function () {
            // paged mode is useless unless you have at least 3 pages...
            return this.isPagingEnabled() && this.getTotalCanvases() > 2;
        };
        Helper.prototype.isPagingEnabled = function () {
            return this.getCurrentSequence().isPagingEnabled();
        };
        Helper.prototype.isRightToLeft = function () {
            return this.getViewingDirection().toString() === manifesto.ViewingDirection.rightToLeft().toString();
        };
        Helper.prototype.isTopToBottom = function () {
            return this.getViewingDirection().toString() === manifesto.ViewingDirection.topToBottom().toString();
        };
        Helper.prototype.isTotalCanvasesEven = function () {
            return this.getCurrentSequence().isTotalCanvasesEven();
        };
        Helper.prototype.isUIEnabled = function (name) {
            var uiExtensions = this.manifest.getService(manifesto.ServiceProfile.uiExtensions());
            if (uiExtensions) {
                var disableUI = uiExtensions.getProperty('disableUI');
                if (disableUI) {
                    if (disableUI.contains(name) || disableUI.contains(name.toLowerCase())) {
                        return false;
                    }
                }
            }
            return true;
        };
        Helper.prototype.isVerticallyAligned = function () {
            return this.isTopToBottom() || this.isBottomToTop();
        };
        // dates //     
        Helper.prototype.createDateNodes = function (rootNode, nodes) {
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var year = this.getNodeYear(node);
                var month = this.getNodeMonth(node);
                var dateNode = manifesto.getTreeNode();
                dateNode.id = node.id;
                dateNode.label = this.getNodeDisplayDate(node);
                dateNode.data = node.data;
                dateNode.data.type = manifesto.TreeNodeType.manifest().toString();
                dateNode.data.year = year;
                dateNode.data.month = month;
                var decadeNode = this.getDecadeNode(rootNode, year);
                if (decadeNode) {
                    var yearNode = this.getYearNode(decadeNode, year);
                    if (yearNode) {
                        var monthNode = this.getMonthNode(yearNode, month);
                        if (monthNode) {
                            monthNode.addNode(dateNode);
                        }
                    }
                }
            }
        };
        Helper.prototype.createDecadeNodes = function (rootNode, nodes) {
            var decadeNode;
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var year = this.getNodeYear(node);
                var decade = Number(year.toString().substr(2, 1));
                var endYear = Number(year.toString().substr(0, 3) + "9");
                if (!this.getDecadeNode(rootNode, year)) {
                    decadeNode = manifesto.getTreeNode();
                    decadeNode.label = year + " - " + endYear;
                    decadeNode.navDate = node.navDate;
                    decadeNode.data.startYear = year;
                    decadeNode.data.endYear = endYear;
                    rootNode.addNode(decadeNode);
                }
            }
        };
        Helper.prototype.createMonthNodes = function (rootNode, nodes) {
            var monthNode;
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var year = this.getNodeYear(node);
                var month = this.getNodeMonth(node);
                var decadeNode = this.getDecadeNode(rootNode, year);
                var yearNode = this.getYearNode(decadeNode, year);
                if (decadeNode && yearNode && !this.getMonthNode(yearNode, month)) {
                    monthNode = manifesto.getTreeNode();
                    monthNode.label = this.getNodeDisplayMonth(node);
                    monthNode.navDate = node.navDate;
                    monthNode.data.year = year;
                    monthNode.data.month = month;
                    yearNode.addNode(monthNode);
                }
            }
        };
        Helper.prototype.createYearNodes = function (rootNode, nodes) {
            var yearNode;
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var year = this.getNodeYear(node);
                var decadeNode = this.getDecadeNode(rootNode, year);
                if (decadeNode && !this.getYearNode(decadeNode, year)) {
                    yearNode = manifesto.getTreeNode();
                    yearNode.label = year.toString();
                    yearNode.navDate = node.navDate;
                    yearNode.data.year = year;
                    decadeNode.addNode(yearNode);
                }
            }
        };
        Helper.prototype.getDecadeNode = function (rootNode, year) {
            for (var i = 0; i < rootNode.nodes.length; i++) {
                var n = rootNode.nodes[i];
                if (year >= n.data.startYear && year <= n.data.endYear)
                    return n;
            }
            return null;
        };
        Helper.prototype.getMonthNode = function (yearNode, month) {
            for (var i = 0; i < yearNode.nodes.length; i++) {
                var n = yearNode.nodes[i];
                if (month === this.getNodeMonth(n))
                    return n;
            }
            return null;
        };
        Helper.prototype.getNodeDisplayDate = function (node) {
            return node.navDate.toDateString();
        };
        Helper.prototype.getNodeDisplayMonth = function (node) {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return months[node.navDate.getMonth()];
        };
        Helper.prototype.getNodeMonth = function (node) {
            return node.navDate.getMonth();
        };
        Helper.prototype.getNodeYear = function (node) {
            return node.navDate.getFullYear();
        };
        Helper.prototype.getYearNode = function (decadeNode, year) {
            for (var i = 0; i < decadeNode.nodes.length; i++) {
                var n = decadeNode.nodes[i];
                if (year === this.getNodeYear(n))
                    return n;
            }
            return null;
        };
        // delete any empty decades
        Helper.prototype.pruneDecadeNodes = function (rootNode) {
            var pruned = [];
            for (var i = 0; i < rootNode.nodes.length; i++) {
                var n = rootNode.nodes[i];
                if (!n.nodes.length) {
                    pruned.push(n);
                }
            }
            for (var j = 0; j < pruned.length; j++) {
                var p = pruned[j];
                rootNode.nodes.remove(p);
            }
        };
        Helper.prototype.sortDecadeNodes = function (rootNode) {
            rootNode.nodes = rootNode.nodes.sort(function (a, b) {
                return a.data.startYear - b.data.startYear;
            });
        };
        Helper.prototype.sortMonthNodes = function (rootNode) {
            var _this = this;
            for (var i = 0; i < rootNode.nodes.length; i++) {
                var decadeNode = rootNode.nodes[i];
                for (var j = 0; j < decadeNode.nodes.length; j++) {
                    var monthNode = decadeNode.nodes[j];
                    monthNode.nodes = monthNode.nodes.sort(function (a, b) {
                        return _this.getNodeMonth(a) - _this.getNodeMonth(b);
                    });
                }
            }
        };
        Helper.prototype.sortYearNodes = function (rootNode) {
            var _this = this;
            for (var i = 0; i < rootNode.nodes.length; i++) {
                var decadeNode = rootNode.nodes[i];
                decadeNode.nodes = decadeNode.nodes.sort(function (a, b) {
                    return (_this.getNodeYear(a) - _this.getNodeYear(b));
                });
            }
        };
        return Helper;
    }());
    Manifold.Helper = Helper;
})(Manifold || (Manifold = {}));



















global.manifold = global.Manifold = module.exports = {
    TreeSortType: new Manifold.TreeSortType(),
    loadManifest: function (options) {
        var bootstrapper = new Manifold.Bootstrapper(options);
        return bootstrapper.bootstrap();
    }
};

var Manifold;
(function (Manifold) {
    var MultiSelectState = (function () {
        function MultiSelectState() {
            this.enabled = false;
            this.ranges = [];
            this.canvases = [];
        }
        MultiSelectState.prototype.allCanvasesSelected = function () {
            return this.canvases.length > 0 && this.getAllSelectedCanvases().length === this.canvases.length;
        };
        MultiSelectState.prototype.allRangesSelected = function () {
            return this.ranges.length > 0 && this.getAllSelectedRanges().length === this.ranges.length;
        };
        MultiSelectState.prototype.allSelected = function () {
            return this.allRangesSelected() && this.allCanvasesSelected();
        };
        MultiSelectState.prototype.getAll = function () {
            return this.canvases.concat(this.ranges);
        };
        MultiSelectState.prototype.getAllSelectedCanvases = function () {
            return this.canvases.en().where(function (c) { return c.multiSelected; }).toArray();
        };
        MultiSelectState.prototype.getAllSelectedRanges = function () {
            return this.ranges.en().where(function (r) { return r.multiSelected; }).toArray();
        };
        MultiSelectState.prototype.getCanvasById = function (id) {
            return this.canvases.en().where(function (c) { return c.id === id; }).first();
        };
        MultiSelectState.prototype.getCanvasesByIds = function (ids) {
            var canvases = [];
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                canvases.push(this.getCanvasById(id));
            }
            return canvases;
        };
        MultiSelectState.prototype.getRangeCanvases = function (range) {
            var ids = range.getCanvasIds();
            return this.getCanvasesByIds(ids);
        };
        MultiSelectState.prototype.selectAll = function (selected) {
            this.selectRanges(this.ranges, selected);
            this.selectCanvases(this.canvases, selected);
        };
        MultiSelectState.prototype.selectCanvas = function (canvas, selected) {
            var c = this.canvases.en().where(function (c) { return c.id === canvas.id; }).first();
            c.multiSelected = selected;
        };
        MultiSelectState.prototype.selectAllCanvases = function (selected) {
            this.selectCanvases(this.canvases, selected);
        };
        MultiSelectState.prototype.selectCanvases = function (canvases, selected) {
            for (var j = 0; j < canvases.length; j++) {
                var canvas = canvases[j];
                canvas.multiSelected = selected;
            }
        };
        MultiSelectState.prototype.selectRange = function (range, selected) {
            var r = this.ranges.en().where(function (r) { return r.id === range.id; }).first();
            r.multiSelected = selected;
            var canvases = this.getRangeCanvases(r);
            this.selectCanvases(canvases, selected);
        };
        MultiSelectState.prototype.selectAllRanges = function (selected) {
            this.selectRanges(this.ranges, selected);
        };
        MultiSelectState.prototype.selectRanges = function (ranges, selected) {
            for (var i = 0; i < ranges.length; i++) {
                var range = ranges[i];
                range.multiSelected = selected;
                var canvases = this.getCanvasesByIds(range.getCanvasIds());
                this.selectCanvases(canvases, selected);
            }
        };
        MultiSelectState.prototype.setEnabled = function (enabled) {
            this.enabled = enabled;
            var items = this.getAll();
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                item.multiSelectEnabled = this.enabled;
                if (!enabled) {
                    item.multiSelected = false;
                }
            }
        };
        return MultiSelectState;
    }());
    Manifold.MultiSelectState = MultiSelectState;
})(Manifold || (Manifold = {}));

var Manifold;
(function (Manifold) {
    // This class formats URIs into HTML <a> links, applying labels when available
    var UriLabeller = (function () {
        function UriLabeller(labels) {
            this.labels = labels;
        }
        UriLabeller.prototype.format = function (url) {
            // if already a link, do nothing.
            if (url.indexOf('<a') != -1)
                return url;
            var label = this.labels[url] ? this.labels[url] : url;
            return '<a href="' + url + '">' + label + '</a>';
        };
        return UriLabeller;
    }());
    Manifold.UriLabeller = UriLabeller;
})(Manifold || (Manifold = {}));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});