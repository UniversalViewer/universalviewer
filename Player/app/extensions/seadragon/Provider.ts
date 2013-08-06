/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/extensions.d.ts" />
import baseProvider = module("app/modules/Shared/BaseProvider");

export class Provider extends baseProvider.BaseProvider {

    constructor(config: any, pkg: any) {
        super(config, pkg);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
            thumbsBaseUri: "http://wellcomelibrary.org"
        }, config.options);
    }

    getThumbUri(thumbsUriTemplate: string, asset: any): string {
        var baseUri = this.options.thumbsBaseUri ? this.options.thumbsBaseUri : this.assetsBaseUri;
        return String.prototype.format(thumbsUriTemplate, baseUri, this.pkg.identifier, this.assetSequenceIndex, asset.identifier);
    }

    getEmbedScript(embedTemplate: string, assetIndex: number, zoom: string, width: number, height: number): string{
        var dataUri = String.prototype.format(this.options.dataUriTemplate, this.options.dataBaseUri, this.pkg.identifier);
        return String.prototype.format(embedTemplate, this.assetSequenceIndex, dataUri, assetIndex, zoom, width, height, this.embedScriptUri);
    }
}