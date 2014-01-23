/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseProvider = require("../../modules/coreplayer-shared-module/baseProvider");
import utils = require("../../utils");
import ISeadragonProvider = require("./iSeadragonProvider");

export class Provider extends baseProvider.BaseProvider implements ISeadragonProvider{

    constructor(config: any, pkg: any) {
        super(config, pkg);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
            dziUriTemplate: "{0}{1}",
            thumbsUriTemplate: "{0}{1}",
            timestampUris: true
        }, config.options);
    }

    getDziUri(asset: any, dziBaseUri?: string, dziUriTemplate?: string): string{
        var baseUri = dziBaseUri ? dziBaseUri : this.options.dziBaseUri || this.options.dataBaseUri || "";
        var template = dziUriTemplate? dziUriTemplate : this.options.dziUriTemplate;
        var uri = String.prototype.format(template, baseUri, asset.dziUri);

        return uri;
    }

    getThumbUri(asset: any, thumbsBaseUri?: string, thumbsUriTemplate?: string): string {
        var baseUri = thumbsBaseUri ? thumbsBaseUri : this.options.thumbsBaseUri || this.options.dataBaseUri || "";
        var template = thumbsUriTemplate? thumbsUriTemplate : this.options.thumbsUriTemplate;
        var uri = String.prototype.format(template, baseUri, asset.thumbnailPath);

        if (this.options.timestampUris) uri = this.addTimestamp(uri);

        return uri;
    }

    getEmbedScript(assetIndex: number, zoom: string, width: number, height: number, embedTemplate: string): string{

        var esu = this.options.embedScriptUri || this.embedScriptUri;

        var template = this.options.embedTemplate || embedTemplate;

        var configUri = this.config.uri || '';

        var script = String.prototype.format(template, this.dataUri, this.assetSequenceIndex, assetIndex, zoom, configUri, width, height, esu);

        return script;
    }

    addTimestamp(uri: string): string{
        return uri + "?t=" + utils.Utils.getTimeStamp();
    }
}
