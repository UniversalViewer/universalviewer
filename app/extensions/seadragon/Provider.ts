/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/extensions.d.ts" />
import baseProvider = require("app/modules/Shared/BaseProvider");

export class Provider extends baseProvider.BaseProvider {

    constructor(config: any, pkg: any) {
        super(config, pkg);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
            dziBaseUri: "http://wellcomelibrary.org",
            dziUriTemplate: "{0}{1}",
            thumbsBaseUri: "http://wellcomelibrary.org",
            thumbsUriTemplate: "{0}{1}"
        }, config.options);
    }

    // base uris and templates can be set in the provider, overridden by the config.js root
    // options object or can be passed in directly from module-specific options.

    getDziUri(asset: any, dziBaseUri?: string, dziUriTemplate?: string){
        var baseUri = dziBaseUri ? dziBaseUri : this.options.dziBaseUri || this.options.assetsBaseUri;
        var template = dziUriTemplate? dziUriTemplate : this.options.dziUriTemplate;
        return String.prototype.format(template, baseUri, asset.dziUri);
    }

    getThumbUri(asset: any, thumbsBaseUri?: string, thumbsUriTemplate?: string): string {
        var baseUri = thumbsBaseUri ? thumbsBaseUri : this.options.thumbsBaseUri || this.options.assetsBaseUri;
        var template = thumbsUriTemplate? thumbsUriTemplate : this.options.thumbsUriTemplate;
        return String.prototype.format(template, baseUri, asset.thumbnailPath);
    }

    getEmbedScript(assetIndex: number, zoom: string, width: number, height: number, embedTemplate: string): string{
        var dataUri = String.prototype.format(this.options.dataUriTemplate, this.options.dataBaseUri, this.pkg.identifier);
        var template = embedTemplate? embedTemplate : this.options.embedTemplate;
        return String.prototype.format(template, this.assetSequenceIndex, dataUri, assetIndex, zoom, width, height, this.embedScriptUri);
    }
}