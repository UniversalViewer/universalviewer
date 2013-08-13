/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/extensions.d.ts" />
import baseProvider = require("app/modules/Shared/BaseProvider");

export class Provider extends baseProvider.BaseProvider {

    constructor(config: any, pkg: any) {
        super(config, pkg);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
            dziUriTemplate: "{0}{1}",
            thumbsUriTemplate: "{0}{1}"
        }, config.options);
    }

    getDziUri(asset: any, dziBaseUri?: string, dziUriTemplate?: string){
        var baseUri = dziBaseUri ? dziBaseUri : this.options.dziBaseUri || this.options.dataBaseUri;
        var template = dziUriTemplate? dziUriTemplate : this.options.dziUriTemplate;
        return String.prototype.format(template, baseUri, asset.dziUri);
    }

    getThumbUri(asset: any, thumbsBaseUri?: string, thumbsUriTemplate?: string): string {
        var baseUri = thumbsBaseUri ? thumbsBaseUri : this.options.thumbsBaseUri || this.options.dataBaseUri;
        var template = thumbsUriTemplate? thumbsUriTemplate : this.options.thumbsUriTemplate;
        return String.prototype.format(template, baseUri, asset.thumbnailPath);
    }

    getEmbedScript(assetIndex: number, zoom: string, width: number, height: number, embedUri: string, embedTemplate: string): string{
        var baseUri = embedUri ? embedUri : this.options.embedUri || this.options.dataBaseUri;
        var template = embedTemplate? embedTemplate : this.options.embedTemplate;
        return String.prototype.format(template, baseUri, this.dataUri, this.assetSequenceIndex, assetIndex, zoom, width, height, this.embedScriptUri);
    }
}
