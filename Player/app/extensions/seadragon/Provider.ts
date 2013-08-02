/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/extensions.d.ts" />
import baseProvider = module("app/BaseProvider");

export class Provider extends baseProvider.BaseProvider {

    constructor(config: any, pkg: any) {
        super(config, pkg);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            dataBaseUri: '/packagecore',
            thumbsUriTemplate: '{0}/thumbs/{1}/{2}/{3}.jpg',
            thumbsLoadRange: 15,
            thumbsImageFadeInDuration: 300,
            leftPanelOpen: true,
            thumbsBaseUri: 'http://wellcomelibrary.org',
            embedTemplate: "<div class=\"wellcomePlayer\" data-assetsequenceindex=\"{0}\" data-uri=\"{1}\" data-assetindex=\"{2}\" data-zoom=\"{3}\" style=\"width:{4}px; height:{5}px; background-color: #000\"></div>\n<script type=\"text/javascript\" id=\"embedWellcomePlayer\" src=\"{6}\"></script><script type=\"text/javascript\">/* wordpress fix */</script>"
        }, config.options);
    }

    getThumbUri(asset): string {
        var baseUri = this.options.thumbsBaseUri ? this.options.thumbsBaseUri : this.options.assetsBaseUri;
        return String.prototype.format(this.options.thumbsUriTemplate, baseUri, this.pkg.identifier, this.assetSequenceIndex, asset.identifier);
    }

    getEmbedScript(assetIndex: number, zoom: string, width: number, height: number): string{
        var dataUri = String.prototype.format(this.options.dataUriTemplate, this.options.dataBaseUri, this.pkg.identifier);
        return String.prototype.format(this.options.embedTemplate, this.assetSequenceIndex, dataUri, assetIndex, zoom, width, height, this.options.embedScriptUri);
    }
}