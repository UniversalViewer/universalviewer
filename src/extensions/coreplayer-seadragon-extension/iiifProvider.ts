/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseProvider = require("../../modules/coreplayer-shared-module/baseIIIFProvider");
import utils = require("../../utils");
import ISeadragonProvider = require("./iSeadragonProvider");

export class Provider extends baseProvider.BaseProvider implements ISeadragonProvider{

    constructor(config: any, manifest: any) {
        super(config, manifest);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
            imageUriTemplate: "{0}{1}"
        }, config.options);
    }

    getImageUri(canvas: any, imageBaseUri?: string, imageUriTemplate?: string): string{
        var baseUri = imageBaseUri ? imageBaseUri : this.options.imageBaseUri || this.options.dataBaseUri || "";
        var template = imageUriTemplate? imageUriTemplate : this.options.imageUriTemplate;

        var iiifUri = canvas.resources[0].resource.service['@id'] + "/info.json";

        var uri = String.prototype.format(template, baseUri, iiifUri);

        return uri;
    }

    getEmbedScript(canvasIndex: number, zoom: string, width: number, height: number, embedTemplate: string): string{

        var esu = this.options.embedScriptUri || this.embedScriptUri;

        var template = this.options.embedTemplate || embedTemplate;

        var configUri = this.config.uri || '';

        var script = String.prototype.format(template, this.dataUri, this.sequenceIndex, canvasIndex, zoom, configUri, width, height, esu);

        return script;
    }
}
