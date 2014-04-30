/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseProvider = require("../../modules/coreplayer-shared-module/baseIIIFProvider");
import utils = require("../../utils");
import ISeadragonIIIFProvider = require("./iSeadragonIIIFProvider");

export class Provider extends baseProvider.BaseIIIFProvider implements ISeadragonIIIFProvider{

    constructor(config: any, pkg: any) {
        super(config, pkg);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
            iiifUriTemplate: "{0}{1}"
        }, config.options);
    }

    getIIIFUri(canvas: any, iiifBaseUri?: string, iiifUriTemplate?: string): string{
        var baseUri = iiifBaseUri ? iiifBaseUri : this.options.iiifBaseUri || this.options.dataBaseUri || "";
        var template = iiifUriTemplate? iiifUriTemplate : this.options.iiifUriTemplate;

        var iiifUri = canvas.resources[0]['@id'] + "/info.json";

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
