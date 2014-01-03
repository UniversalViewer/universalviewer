/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseProvider = require("../../modules/coreplayer-shared-module/baseProvider");
import utils = require("../../utils");

export class Provider extends baseProvider.BaseProvider{

    constructor(config: any, pkg: any) {
        super(config, pkg);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
            mediaBaseUri: "http://wellcomelibrary.org",
            mediaUriTemplate: "{0}{1}"
        }, config.options);
    }

    getPDFUri(): string{
        var baseUri = this.options.mediaBaseUri || "";
        var template = this.options.mediaUriTemplate;
        var uri = String.prototype.format(template, baseUri, this.assetSequence.assets[0].fileUri);

        return uri;
    }
}
