/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseProvider = require("../../modules/coreplayer-shared-module/baseProvider");
import utils = require("../../utils");
import IMediaElementProvider = require("./iMediaElementProvider");

export class Provider extends baseProvider.BaseProvider implements IMediaElementProvider{

    constructor(config: any, pkg: any) {
        super(config, pkg);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
            timestampUris: true
        }, config.options);
    }

    getEmbedScript(width: number, height: number, embedUri: string, embedTemplate: string): string{
        var baseUri = embedUri ? embedUri : this.options.embedUri || this.options.dataBaseUri || "";
        var template = embedTemplate? embedTemplate : this.options.embedTemplate;
        var script = String.prototype.format(template, baseUri, this.dataUri, this.assetSequenceIndex, width, height, this.embedScriptUri);

        return script;
    }

    addTimestamp(uri: string): string{
        return uri + "?t=" + utils.Utils.getTimeStamp();
    }
}
