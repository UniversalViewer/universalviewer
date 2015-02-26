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
            imageUriTemplate: "{0}{1}"
        }, config.options);
    }

    getImageUri(canvas: any, imageBaseUri?: string, imageUriTemplate?: string): string{
        var baseUri = imageBaseUri ? imageBaseUri : this.options.imageBaseUri || "";
        var template = imageUriTemplate? imageUriTemplate : this.options.imageUriTemplate;

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

        var uri = String.prototype.format(template, baseUri, iiifUri);

        return uri;
    }

    getEmbedScript(canvasIndex: number, zoom: string, width: number, height: number, rotation: number, embedTemplate: string): string{

        var esu = this.options.embedScriptUri || this.embedScriptUri;

        var template = this.options.embedTemplate || embedTemplate;

        var configUri = this.config.uri || '';

        var script = String.prototype.format(template, this.locale, configUri, this.manifestUri, this.sequenceIndex, canvasIndex, zoom, rotation, width, height, esu);

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
