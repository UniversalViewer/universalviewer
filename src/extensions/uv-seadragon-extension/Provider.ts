import BaseProvider = require("../../modules/uv-shared-module/BaseProvider");
import BootStrapper = require("../../Bootstrapper");
import CroppedImageDimensions = require("./CroppedImageDimensions");
import ExternalResource = require("../../modules/uv-shared-module/ExternalResource");
import ISeadragonProvider = require("./ISeadragonProvider");
import SearchResult = require("./SearchResult");
import SearchResultRect = require("./SearchResultRect");
import Size = Utils.Measurements.Size;
import TreeSortType = require("./TreeSortType");
import Vector = Utils.Maths.Vector;
import ITreeNode = require("../../modules/uv-shared-module/ITreeNode");

class Provider extends BaseProvider implements ISeadragonProvider{

    searchResults: SearchResult[] = [];

    constructor(bootstrapper: BootStrapper) {
        super(bootstrapper);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
            //{baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
            autoCompleteUriTemplate: '{0}{1}',
            iiifImageUriTemplate: '{0}/{1}/{2}/{3}/{4}/{5}.jpg'
        }, bootstrapper.config.options);
    }

    // get the region and final size
    getCroppedImageDimensions(canvas: Manifesto.ICanvas, viewer: any): CroppedImageDimensions {

        if (!viewer) return null;
        if (!viewer.viewport) return null;

        if (!canvas.getHeight() || !canvas.getWidth()){
            return null;
        }

        var bounds = viewer.viewport.getBounds(true);
        var containerSize = viewer.viewport.getContainerSize();
        var zoom = viewer.viewport.getZoom(true);

        var top = Math.max(0, bounds.y);
        var left = Math.max(0, bounds.x);

        // change top to be normalised value proportional to height of image, not width (as per OSD).
        top = 1 / (canvas.getHeight() / parseInt(String(canvas.getWidth() * top)));

        // get on-screen pixel sizes.

        var viewportWidthPx = containerSize.x;
        var viewportHeightPx = containerSize.y;

        var imageWidthPx = parseInt(String(viewportWidthPx * zoom));
        var ratio = canvas.getWidth() / imageWidthPx;
        var imageHeightPx = parseInt(String(canvas.getHeight() / ratio));

        var viewportLeftPx = parseInt(String(left * imageWidthPx));
        var viewportTopPx = parseInt(String(top * imageHeightPx));

        var rect1Left = 0;
        var rect1Right = imageWidthPx;
        var rect1Top = 0;
        var rect1Bottom = imageHeightPx;

        var rect2Left = viewportLeftPx;
        var rect2Right = viewportLeftPx + viewportWidthPx;
        var rect2Top = viewportTopPx;
        var rect2Bottom = viewportTopPx + viewportHeightPx;

        var sizeWidth = Math.max(0, Math.min(rect1Right, rect2Right) - Math.max(rect1Left, rect2Left));
        var sizeHeight = Math.max(0, Math.min(rect1Bottom, rect2Bottom) - Math.max(rect1Top, rect2Top));

        // get original image pixel sizes.

        var ratio2 = canvas.getWidth() / imageWidthPx;

        var regionWidth = parseInt(String(sizeWidth * ratio2));
        var regionHeight = parseInt(String(sizeHeight * ratio2));

        var regionTop = parseInt(String(canvas.getHeight() * top));
        var regionLeft = parseInt(String(canvas.getWidth() * left));

        if (regionTop < 0) regionTop = 0;
        if (regionLeft < 0) regionLeft = 0;

        var dimensions: CroppedImageDimensions = new CroppedImageDimensions();

        dimensions.region = new Size(regionWidth, regionHeight);
        dimensions.regionPos = new Vector(regionLeft, regionTop);
        dimensions.size = new Size(sizeWidth, sizeHeight);

        return dimensions;
    }

    getCroppedImageUri(canvas: Manifesto.ICanvas, viewer: any): string {

        if (!viewer) return null;
        if (!viewer.viewport) return null;

        var dimensions: CroppedImageDimensions = this.getCroppedImageDimensions(canvas, viewer);

        // construct uri
        // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg

        var baseUri = this.getImageBaseUri(canvas);
        var id = this.getImageId(canvas);
        var region = dimensions.regionPos.X + "," + dimensions.regionPos.Y + "," + dimensions.region.width + "," + dimensions.region.height;
        var size = dimensions.size.width + ',' + dimensions.size.height;
        var rotation = 0;
        var quality = 'default';
        return String.format(this.config.options.iiifImageUriTemplate, baseUri, id, region, size, rotation, quality);
    }

    getConfinedImageDimensions(canvas: Manifesto.ICanvas, width: number): Size {
        var dimensions: Size = new Size(0, 0);
        dimensions.width = width;
        var normWidth = Math.normalise(width, 0, canvas.getWidth());
        dimensions.height = Math.floor(canvas.getHeight() * normWidth);
        return dimensions;
    }

    getConfinedImageUri(canvas: Manifesto.ICanvas, width: number): string {
        var baseUri = this.getImageBaseUri(canvas);

        // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
        var id = this.getImageId(canvas);
        var region = 'full';
        var dimensions = this.getConfinedImageDimensions(canvas, width);
        var size: string = dimensions.width + ',' + dimensions.height;
        var rotation = 0;
        var quality = 'default';
        var uri = String.format(this.config.options.iiifImageUriTemplate, baseUri, id, region, size, rotation, quality);
        return uri;
    }

    getImageId(canvas: Manifesto.ICanvas): string {
        var id = this.getInfoUri(canvas);
        // First trim off info.json, then extract ID:
        id = id.substr(0, id.lastIndexOf("/"));
        return id.substr(id.lastIndexOf("/") + 1);
    }

    getImageBaseUri(canvas: Manifesto.ICanvas): string {
        var uri = this.getInfoUri(canvas);
        // First trim off info.json, then trim off ID....
        uri = uri.substr(0, uri.lastIndexOf("/"));
        return uri.substr(0, uri.lastIndexOf("/"));
    }

    getInfoUri(canvas: Manifesto.ICanvas): string{
        var infoUri: string;

        var images: Manifesto.IAnnotation[] = canvas.getImages();

        if (images && images.length) {
            var firstImage = images[0];
            var resource: Manifesto.IResource = firstImage.getResource();
            var services: Manifesto.IService[] = resource.getServices();

            for (var i = 0; i < services.length; i++) {
                var service: Manifesto.IService = services[i];
                var id = service.id;

                if (!_.endsWith(id, '/')) {
                    id += '/';
                }

                if (manifesto.isImageProfile(service.getProfile())){
                    infoUri = id + 'info.json';
                }
            }
        }

        if (!infoUri){
            // todo: use compiler flag (when available)
            infoUri = (window.DEBUG)? '/src/extensions/uv-seadragon-extension/lib/imageunavailable.json' : 'lib/imageunavailable.json';
        }

        return infoUri;
    }

    getEmbedScript(template: string, width: number, height: number, zoom: string, rotation: number): string{

        var configUri = this.config.uri || '';

        var script = String.format(template, this.getSerializedLocales(), configUri, this.manifestUri, this.collectionIndex, this.manifestIndex, this.sequenceIndex, this.canvasIndex, zoom, rotation, width, height, this.embedScriptUri);

        return script;
    }

    getPrevPageIndex(canvasIndex?: number): number {
        if (_.isUndefined(canvasIndex)) canvasIndex = this.canvasIndex;

        var index;

        if (this.isPagingSettingEnabled()){
            var indices = this.getPagedIndices(canvasIndex);

            if (this.isRightToLeft()){
                index = indices.last() - 1;
            } else {
                index = indices[0] - 1;
            }

        } else {
            index = canvasIndex - 1;
        }

        return index;
    }

    getPagedIndices(canvasIndex?: number): number[]{
        if (_.isUndefined(canvasIndex)) canvasIndex = this.canvasIndex;

        var indices = [];

        // if it's a continuous manifest, get all resources.
        if (this.isContinuous()){
            indices = _.map(this.getCanvases(), (c: Manifesto.ICanvas, index: number) => {
                return index;
            });
        } else {
            if (!this.isPagingSettingEnabled()) {
                indices.push(this.canvasIndex);
            } else {
                if (this.isFirstCanvas(canvasIndex) || (this.isLastCanvas(canvasIndex) && this.isTotalCanvasesEven())){
                    indices = [canvasIndex];
                } else if (canvasIndex % 2){
                    indices = [canvasIndex, canvasIndex + 1];
                } else {
                    indices = [canvasIndex - 1, canvasIndex];
                }

                if (this.isRightToLeft()){
                    indices = indices.reverse();
                }
            }
        }

        return indices;
    }

    isSearchWithinEnabled(): boolean {
        if (!Utils.Bools.GetBool(this.config.options.searchWithinEnabled, false)){
            return false;
        }

        if (!this.getSearchWithinService()) {
            return false;
        }

        return true;
    }

    isContinuous(): boolean {
        return this.getViewingHint().toString() === manifesto.ViewingHint.continuous().toString();
    }

    isPaged(): boolean {
        return this.getViewingHint().toString() === manifesto.ViewingHint.paged().toString();
    }

    isBottomToTop(): boolean {
        return this.getViewingDirection().toString() === manifesto.ViewingDirection.bottomToTop().toString()
    }

    isTopToBottom(): boolean {
        return this.getViewingDirection().toString() === manifesto.ViewingDirection.topToBottom().toString();
    }

    isLeftToRight(): boolean {
        return this.getViewingDirection().toString() === manifesto.ViewingDirection.leftToRight().toString();
    }

    isRightToLeft(): boolean {
        return this.getViewingDirection().toString() === manifesto.ViewingDirection.rightToLeft().toString();
    }

    isHorizontallyAligned(): boolean {
        return this.isLeftToRight() || this.isRightToLeft()
    }

    isVerticallyAligned(): boolean {
        return this.isTopToBottom() || this.isBottomToTop()
    }

    isPagingAvailable(): boolean {
        // paged mode is useless unless you have at least 3 pages...
        return this.isPagingEnabled() && this.getTotalCanvases() > 2;
    }

    isPagingEnabled(): boolean{
        return this.getCurrentSequence().isPagingEnabled();
    }

    isPagingSettingEnabled(): boolean {
        if (this.isPagingAvailable()){
            return this.getSettings().pagingEnabled;
        }

        return false;
    }

    getNextPageIndex(canvasIndex?: number): number {
        if (_.isUndefined(canvasIndex)) canvasIndex = this.canvasIndex;

        var index;

        if (this.isPagingSettingEnabled()){
            var indices = this.getPagedIndices(canvasIndex);

            if (this.isRightToLeft()){
                index = indices[0] + 1;
            } else {
                index = indices.last() + 1;
            }

        } else {
            index = canvasIndex + 1;
        }

        if (index > this.getTotalCanvases() - 1) {
            return -1;
        }

        return index;
    }

    getAutoCompleteService(): Manifesto.IService {
        var service: Manifesto.IService = this.getSearchWithinService();
        if (!service) return null;
        return service.getService(manifesto.ServiceProfile.autoComplete());
    }

    getAutoCompleteUri(): string{
        var service = this.getAutoCompleteService();
        if (!service) return null;
        return service.id + '?q={0}';
    }

    getSearchWithinService(): Manifesto.IService {
        return this.manifest.getService(manifesto.ServiceProfile.searchWithin());
    }

    getSearchWithinServiceUri(): string {
        var service: Manifesto.IService = this.getSearchWithinService();

        if (!service) return null;

        var uri = service.id;
        uri = uri + "?q={0}";
        return uri;
    }

    searchWithin(terms: string, cb: (results: any) => void): void {
        var that = this;

        var searchUri = this.getSearchWithinServiceUri();

        searchUri = String.format(searchUri, terms);

        $.getJSON(searchUri, (results: any) => {
            if (results.resources && results.resources.length) {
                that.parseSearchWithinResults(results);
            }

            cb(results);
        });
    }

    parseSearchWithinResults(results: any): void {
        this.searchResults = [];

        for (var i = 0; i < results.resources.length; i++) {
            var r = results.resources[i];

            var sr: SearchResult = new SearchResult(r, this);

            var match = this.getSearchResultByCanvasIndex(sr.canvasIndex);

            if (match){
                match.addRect(r);
            } else {
                this.searchResults.push(sr);
            }
        }
    }

    getSearchResultByCanvasIndex(canvasIndex: number): SearchResult {
        for (var i = 0; i < this.searchResults.length; i++) {
            var r = this.searchResults[i];
            if (r.canvasIndex === canvasIndex){
                return r;
            }
        }
        return null;
    }

    // returns a list of treenodes for each decade.
    // expanding a decade generates a list of years
    // expanding a year gives a list of months containing issues
    // expanding a month gives a list of issues.
    getSortedTree(sortType: TreeSortType): ITreeNode {

        var tree: ITreeNode = <ITreeNode>this.iiifResource.getTree();
        var sortedTree: ITreeNode = <ITreeNode>manifesto.getTreeNode();

        if (sortType === TreeSortType.date){
            this.getSortedTreeNodesByDate(sortedTree, tree);
        } else if (sortType === TreeSortType.none) {
            sortedTree = tree;
        }

        return sortedTree;
    }

    getSortedTreeNodesByDate(sortedTree: ITreeNode, tree: ITreeNode): void{

        var all: ITreeNode[] = <ITreeNode[]>tree.nodes.en().traverseUnique(node => node.nodes)
            .where((n) => n.data.type === manifesto.TreeNodeType.collection().toString() ||
                          n.data.type === manifesto.TreeNodeType.manifest().toString()).toArray();

        //var collections: ITreeNode[] = tree.nodes.en().traverseUnique(n => n.nodes)
        //    .where((n) => n.data.type === ITreeNodeType.collection().toString()).toArray();

        var manifests: ITreeNode[] = <ITreeNode[]>tree.nodes.en().traverseUnique(n => n.nodes)
            .where((n) => n.data.type === manifesto.TreeNodeType.manifest().toString()).toArray();

        this.createDecadeNodes(sortedTree, all);
        this.sortDecadeNodes(sortedTree);
        this.createYearNodes(sortedTree, all);
        this.sortYearNodes(sortedTree);
        this.createMonthNodes(sortedTree, manifests);
        this.sortMonthNodes(sortedTree);
        this.createDateNodes(sortedTree, manifests);

        this.pruneDecadeNodes(sortedTree);
    }

    createDecadeNodes(rootNode: ITreeNode, nodes: ITreeNode[]): void{
        var decadeNode: ITreeNode;

        for (var i = 0; i < nodes.length; i++) {
            var node: ITreeNode = nodes[i];
            var year = this.getNodeYear(node);
            var decade = Number(year.toString().substr(2, 1));
            var endYear = Number(year.toString().substr(0, 3) + "9");

            if(!this.getDecadeNode(rootNode, year)){
                decadeNode = <ITreeNode>manifesto.getTreeNode();
                decadeNode.label = year + " - " + endYear;
                decadeNode.navDate = node.navDate;
                decadeNode.data.startYear = year;
                decadeNode.data.endYear = endYear;
                rootNode.addNode(decadeNode);
            }
        }
    }

    // delete any empty decades
    pruneDecadeNodes(rootNode: ITreeNode): void {
        var pruned: ITreeNode[] = [];

        for (var i = 0; i < rootNode.nodes.length; i++){
            var n: ITreeNode = <ITreeNode>rootNode.nodes[i];
            if (!n.nodes.length){
                pruned.push(n);
            }
        }

        for (var j = 0; j < pruned.length; j++){
            var p: ITreeNode = <ITreeNode>pruned[j];

            rootNode.nodes.remove(p);
        }
    }

    sortDecadeNodes(rootNode: ITreeNode): void {
        rootNode.nodes = rootNode.nodes.sort(function(a, b) {
            return a.data.startYear - b.data.startYear;
        });
    }

    getDecadeNode(rootNode: ITreeNode, year: number): ITreeNode{
        for (var i = 0; i < rootNode.nodes.length; i++){
            var n: ITreeNode = <ITreeNode>rootNode.nodes[i];
            if (year >= n.data.startYear && year <= n.data.endYear) return n;
        }

        return null;
    }

    createYearNodes(rootNode: ITreeNode, nodes: ITreeNode[]): void{
        var yearNode: ITreeNode;

        for (var i = 0; i < nodes.length; i++) {
            var node: ITreeNode = nodes[i];
            var year = this.getNodeYear(node);
            var decadeNode = this.getDecadeNode(rootNode, year);

            if(decadeNode && !this.getYearNode(decadeNode, year)){
                yearNode = <ITreeNode>manifesto.getTreeNode();
                yearNode.label = year.toString();
                yearNode.navDate = node.navDate;
                yearNode.data.year = year;

                decadeNode.addNode(yearNode);
            }
        }
    }

    sortYearNodes(rootNode: ITreeNode): void {
        for (var i = 0; i < rootNode.nodes.length; i++){
            var decadeNode = rootNode.nodes[i];

            decadeNode.nodes = decadeNode.nodes.sort((a: ITreeNode, b: ITreeNode) => {
                return (this.getNodeYear(a) - this.getNodeYear(b));
            });
        }
    }

    getYearNode(decadeNode: ITreeNode, year: Number): ITreeNode{
        for (var i = 0; i < decadeNode.nodes.length; i++){
            var n: ITreeNode = <ITreeNode>decadeNode.nodes[i];
            if (year === this.getNodeYear(n)) return n;
        }

        return null;
    }

    createMonthNodes(rootNode: ITreeNode, nodes: ITreeNode[]): void{
        var monthNode: ITreeNode;

        for (var i = 0; i < nodes.length; i++) {
            var node: ITreeNode = nodes[i];
            var year = this.getNodeYear(node);
            var month = this.getNodeMonth(node);
            var decadeNode = this.getDecadeNode(rootNode, year);
            var yearNode = this.getYearNode(decadeNode, year);

            if (decadeNode && yearNode && !this.getMonthNode(yearNode, month)){
                monthNode = <ITreeNode>manifesto.getTreeNode();
                monthNode.label = this.getNodeDisplayMonth(node);
                monthNode.navDate = node.navDate;
                monthNode.data.year = year;
                monthNode.data.month = month;
                yearNode.addNode(monthNode);
            }
        }
    }

    sortMonthNodes(rootNode: ITreeNode): void {
        for (var i = 0; i < rootNode.nodes.length; i++){
            var decadeNode = rootNode.nodes[i];

            for (var j = 0; j < decadeNode.nodes.length; j++){
                var monthNode = decadeNode.nodes[j];

                monthNode.nodes = monthNode.nodes.sort((a: ITreeNode, b: ITreeNode) => {
                    return this.getNodeMonth(a) - this.getNodeMonth(b);
                });
            }
        }
    }

    getMonthNode(yearNode: ITreeNode, month: Number): ITreeNode{
        for (var i = 0; i < yearNode.nodes.length; i++){
            var n: ITreeNode = <ITreeNode>yearNode.nodes[i];
            if (month === this.getNodeMonth(n)) return n;
        }

        return null;
    }

    createDateNodes(rootNode: ITreeNode, nodes: ITreeNode[]): void{
        for (var i = 0; i < nodes.length; i++) {
            var node: ITreeNode = <ITreeNode>nodes[i];
            var year = this.getNodeYear(node);
            var month = this.getNodeMonth(node);

            var dateNode = manifesto.getTreeNode();
            dateNode.id = node.id;
            dateNode.label = this.getNodeDisplayDate(node);
            dateNode.data = node.data;
            dateNode.data.type = 'manifest';
            dateNode.data.year = year;
            dateNode.data.month = month;

            var decadeNode = this.getDecadeNode(rootNode, year);

            if (decadeNode) {
                var yearNode = this.getYearNode(decadeNode, year);

                if (yearNode){
                    var monthNode = this.getMonthNode(yearNode, month);

                    if (monthNode){
                        monthNode.addNode(dateNode);
                    }
                }
            }
        }
    }

    getNodeYear(node: ITreeNode): number{
        return node.navDate.getFullYear();
    }

    getNodeMonth(node: ITreeNode): number{
        return node.navDate.getMonth();
    }

    getNodeDisplayMonth(node: ITreeNode): string{
        var months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[node.navDate.getMonth()];
    }

    getNodeDisplayDate(node: ITreeNode): string{
        return node.navDate.toDateString();
    }
}

export = Provider;