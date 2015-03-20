/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import BootStrapper = require("../../bootstrapper");
import baseProvider = require("../../modules/uv-shared-module/baseIIIFProvider");
import utils = require("../../utils");
import ISeadragonProvider = require("./iSeadragonProvider");

export class Provider extends baseProvider.BaseProvider implements ISeadragonProvider{

    constructor(bootstrapper: BootStrapper, config: any, manifest: any) {
        super(bootstrapper, config, manifest);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
            //{baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
            iiifImageUriTemplate: '{0}/{1}/{2}/{3}/{4}/{5}.jpg'
        }, config.options);
    }

    //getCrop(canvas: any, viewer: any, download?: boolean, relativeUri?: boolean): string {
    //
    //    var bounds = viewer.viewport.getBounds(true);
    //    var containerSize = viewer.viewport.getContainerSize();
    //    var zoom = viewer.viewport.getZoom(true);
    //
    //    var top = bounds.y;
    //    var left = bounds.x;
    //    var height = bounds.height;
    //    var width = bounds.width;
    //
    //    // change top and height to be normalised values proportional to height of image, not width (as per seadragon).
    //    //top = 1 / (canvas.height / parseInt(String(canvas.width * top)));
    //    //height = 1 / (canvas.height / parseInt(String(canvas.width * height)));
    //
    //    // get on-screen pixel sizes.
    //
    //    var viewportWidthPx = containerSize.x;
    //    var viewportHeightPx = containerSize.y;
    //
    //    var imageWidthPx = parseInt(String(viewportWidthPx * zoom));
    //    var ratio = canvas.width / imageWidthPx;
    //    var imageHeightPx = parseInt(String(canvas.height / ratio));
    //
    //    var viewportLeftPx = parseInt(String(left * imageWidthPx));
    //    var viewportTopPx = parseInt(String(top * imageHeightPx));
    //
    //    var rect1Left = 0;
    //    var rect1Right = imageWidthPx;
    //    var rect1Top = 0;
    //    var rect1Bottom = imageHeightPx;
    //
    //    var rect2Left = viewportLeftPx;
    //    var rect2Right = viewportLeftPx + viewportWidthPx;
    //    var rect2Top = viewportTopPx;
    //    var rect2Bottom = viewportTopPx + viewportHeightPx;
    //
    //    var cropWidth = Math.max(0, Math.min(rect1Right, rect2Right) - Math.max(rect1Left, rect2Left))
    //    var cropHeight = Math.max(0, Math.min(rect1Bottom, rect2Bottom) - Math.max(rect1Top, rect2Top));
    //
    //    // end get on-screen pixel sizes.
    //
    //    // get original image pixel sizes.
    //
    //    var ratio2 = canvas.width / imageWidthPx;
    //
    //    var widthPx = parseInt(String(cropWidth * ratio2));
    //    var heightPx = parseInt(String(cropHeight * ratio2));
    //
    //    var topPx = parseInt(String(canvas.height * top));
    //    var leftPx = parseInt(String(canvas.width * left));
    //
    //    if (topPx < 0) topPx = 0;
    //    if (leftPx < 0) leftPx = 0;
    //
    //    // end get original image pixel sizes.
    //
    //    var baseUri = this.getImageBaseUri(canvas);
    //
    //    //{baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
    //    var id = this.getImageIdFromUri(canvas);
    //    var region = leftPx + "," + topPx + "," + widthPx + "," + heightPx;
    //    var size = 'full';
    //    var rotation = 0;
    //    var quality = 'default';
    //    var uri = String.prototype.format(this.config.options.iiifImageUriTemplate, baseUri, id, region, size, rotation, quality);
    //
    //    //if (download) {
    //    //    uri += "?download=true";
    //    //}
    //
    //    if (relativeUri) {
    //        // convert to relative uri.
    //        uri = utils.Utils.convertToRelativeUrl(uri);
    //    }
    //
    //    return uri;
    //}

    getCroppedImageUri(canvas: any, viewer: any): string {

        var bounds = viewer.viewport.getBounds(true);
        var containerSize = viewer.viewport.getContainerSize();
        var zoom = viewer.viewport.getZoom(true);

        var top = Math.max(0, bounds.y);
        var left = Math.max(0, bounds.x);

        // change top to be normalised value proportional to height of image, not width (as per OSD).
        top = 1 / (canvas.height / parseInt(String(canvas.width * top)));

        // get on-screen pixel sizes.

        var viewportWidthPx = containerSize.x;
        var viewportHeightPx = containerSize.y;

        var imageWidthPx = parseInt(String(viewportWidthPx * zoom));
        var ratio = canvas.width / imageWidthPx;
        var imageHeightPx = parseInt(String(canvas.height / ratio));

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

        var ratio2 = canvas.width / imageWidthPx;

        var widthPx = parseInt(String(cropWidth * ratio2));
        var heightPx = parseInt(String(cropHeight * ratio2));

        var topPx = parseInt(String(canvas.height * top));
        var leftPx = parseInt(String(canvas.width * left));

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
        var uri = String.prototype.format(this.config.options.iiifImageUriTemplate, baseUri, id, region, size, rotation, quality);

        return uri;
    }

    getConfinedImageUri(canvas: any, width: number, height?: number): string {
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
        var uri = String.prototype.format(this.config.options.iiifImageUriTemplate, baseUri, id, region, size, rotation, quality);
        return uri;
    }

    getImageId(canvas: any): string {
        var id = this.getImageUri(canvas);
        id = id.substr(0, id.lastIndexOf("/"));
        return id.substr(id.lastIndexOf("/") + 1);
    }

    getImageBaseUri(canvas: any): string {
        if (this.config.options.iiifImageBaseUri){
            return this.config.options.iiifImageBaseUri;
        }
        var uri = this.getImageUri(canvas);
        uri = uri.substr(0, uri.lastIndexOf("/"));
        uri = uri.substr(0, uri.lastIndexOf("/"));
        return uri;
    }

    getImageUri(canvas: any): string{

        var iiifUri;

        if (canvas.resources){
            iiifUri = canvas.resources[0].resource.service['@id'];
        } else if (canvas.images && canvas.images[0].resource.service){
            iiifUri = canvas.images[0].resource.service['@id'];
        } else {
            return null;
        }

        if (!iiifUri){
            console.warn('no service endpoint available');
        }else if (iiifUri.endsWith('/')){
            if (!this.corsEnabled()){
                iiifUri += 'info.js';
            } else {
                iiifUri += 'info.json';
            }
        } else {
            if (!this.corsEnabled()) {
                iiifUri += '/info.js';
            } else {
                iiifUri += '/info.json';
            }
        }

        return iiifUri;
    }

    getEmbedScript(canvasIndex: number, zoom: string, width: number, height: number, rotation: number, embedTemplate: string): string{

        var esu = this.options.embedScriptUri || this.embedScriptUri;

        var template = this.options.embedTemplate || embedTemplate;

        var configUri = this.config.uri || '';

        var script = String.prototype.format(template, this.getSerializedLocales(), configUri, this.manifestUri, this.sequenceIndex, canvasIndex, zoom, rotation, width, height, esu);

        return script;
    }

    getTileSources(): any[] {

        if (!this.isPaged()){
            return [{
                tileSource: this.getImageUri(this.getCurrentCanvas())
            }];
        } else {
            if (this.isFirstCanvas() || this.isLastCanvas()){
                return [{
                    tileSource: this.getImageUri(this.getCurrentCanvas())
                }];
            } else {
                var indices = this.getPagedIndices();

                var tileSources: any[] = [];

                _.each(indices, (index) => {
                    tileSources.push({
                        tileSource: this.getImageUri(this.getCanvasByIndex(index))
                    });
                });

                return tileSources;
            }
        }
    }
}
