/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/extensions.d.ts" />
import baseProvider = module("app/BaseProvider");

export class Provider extends baseProvider.BaseProvider {

    constructor(config: any, pkg: any) {
        super(config, pkg);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            thumbsUriTemplate: '{0}/thumbs/{1}/{2}/{3}.jpg',
            thumbsLoadRange: 15,
            thumbsImageFadeInDuration: 300
        }, config.options);
    }

    getThumbUri(asset): string {
        return String.prototype.format(this.options.thumbsUriTemplate, this.options.mediaUri, this.pkg.identifier, this.assetSequenceIndex, asset.identifier);
    }
}