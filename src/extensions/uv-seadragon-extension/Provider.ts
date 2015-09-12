import BootStrapper = require("../../Bootstrapper");
import BaseProvider = require("../../modules/uv-shared-module/BaseProvider");
import ISeadragonProvider = require("./ISeadragonProvider");
import SearchResult = require("./SearchResult");
import SearchResultRect = require("./SearchResultRect");
import ExternalResource = require("../../modules/uv-shared-module/ExternalResource");

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

    getCroppedImageUri(canvas: Manifesto.ICanvas, viewer: any): string {

        if (!viewer) return null;
        if (!viewer.viewport) return null;

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

        var cropWidth = Math.max(0, Math.min(rect1Right, rect2Right) - Math.max(rect1Left, rect2Left))
        var cropHeight = Math.max(0, Math.min(rect1Bottom, rect2Bottom) - Math.max(rect1Top, rect2Top));

        // get original image pixel sizes.

        var ratio2 = canvas.getWidth() / imageWidthPx;

        var widthPx = parseInt(String(cropWidth * ratio2));
        var heightPx = parseInt(String(cropHeight * ratio2));

        var topPx = parseInt(String(canvas.getHeight() * top));
        var leftPx = parseInt(String(canvas.getWidth() * left));

        if (topPx < 0) topPx = 0;
        if (leftPx < 0) leftPx = 0;

        // construct uri
        // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg

        var baseUri = this.getImageBaseUri(canvas);
        var id = this.getImageId(canvas);
        var region = leftPx + "," + topPx + "," + widthPx + "," + heightPx;
        var size = cropWidth + ',' + cropHeight;
        var rotation = 0;
        var quality = 'default';
        var uri = String.format(this.config.options.iiifImageUriTemplate, baseUri, id, region, size, rotation, quality);

        return uri;
    }

    getConfinedImageUri(canvas: Manifesto.ICanvas, width: number, height?: number): string {
        var baseUri = this.getImageBaseUri(canvas);

        // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
        var id = this.getImageId(canvas);
        var region = 'full';
        var size;

        if (typeof(height) != "undefined"){
            size = width + ',' + height;
        } else {
            size = width + ",";
        }

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
        var infoUri = canvas.getInfoUri();

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

    getPagedIndices(canvasIndex?: number): number[]{
        if (typeof(canvasIndex) === 'undefined') canvasIndex = this.canvasIndex;

        var indices = [];

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

            if (this.getViewingDirection().toString() === manifesto.ViewingDirection.rightToLeft().toString()){
                indices = indices.reverse();
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

    getAutoCompleteService(): Manifesto.IService {
        return this.manifest.getService(manifesto.ServiceProfile.autoComplete());
    }

    getAutoCompleteUri(): string{
        var service = this.getAutoCompleteService();

        if (!service) return null;

        return service.id + '{0}';
    }

    getSearchWithinService(): Manifesto.IService {
        return this.manifest.getService(manifesto.ServiceProfile.searchWithin());
    }

    getSearchWithinServiceUri(): string {
        var service: Manifesto.IService = this.getSearchWithinService();

        if (!service) return null;

        var uri = service.id;
        uri = uri + "{0}";
        return uri;
    }

    searchWithin(terms: string, cb: (results: any) => void): void {
        var that = this;

        var searchUri = this.getSearchWithinServiceUri();

        searchUri = String.format(searchUri, terms);

        $.getJSON(searchUri, (results: any) => {
            if (results.resources.length) {
                that.parseSearchWithinResults(results);
            }

            cb(results);
        });
    }

    parseSearchWithinResults(results: any): void {
        this.searchResults = [];

        for (var i = 0; i < results.resources.length; i++) {
            var r = results.resources[i];

            var sr = new SearchResult(r);

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
}

export = Provider;