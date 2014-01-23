/// <reference path="js/jquery.d.ts" />
import utils = require("utils");

class BootStrapper{

    pkg: any;
    extensions: any;
    dataBaseUri: string;
    packageUri: string;
    assetSequenceIndex: number;
    assetSequence: any;

    // this loads the package, determines what kind of extension and provider to use, and instantiates them.
    constructor(extensions: any) {

        this.extensions = extensions;

        var that = this;

        that.dataBaseUri = utils.Utils.getQuerystringParameter('dbu');
        that.packageUri = utils.Utils.getQuerystringParameter('du');

        if (that.dataBaseUri){
            that.packageUri = that.dataBaseUri + that.packageUri;
        }

        jQuery.support.cors = true;

        $.getJSON(that.packageUri, (pkg) => {

            that.pkg = pkg;

            // if on home domain, check hash params. otherwise, use
            // embed data attributes or default to 0.
            var isHomeDomain = utils.Utils.getQuerystringParameter('hd') == "true";
            var isReload = utils.Utils.getQuerystringParameter('rl') == "true";

            if (isHomeDomain && !isReload){
                that.assetSequenceIndex = parseInt(utils.Utils.getHashParameter('asi', parent.document));
            }

            if (!that.assetSequenceIndex){
                that.assetSequenceIndex = parseInt(utils.Utils.getQuerystringParameter('asi')) || 0;
            }

            if (!that.pkg.assetSequences){
                try{
                    parent.$(parent.document).trigger("onNotFound");
                    return;
                } catch (e) {}
            }

            if (!that.pkg.assetSequences[that.assetSequenceIndex].$ref) {
                that.assetSequence = that.pkg.assetSequences[that.assetSequenceIndex];
                that.loadDependencies();
            } else {
                // load missing assetSequence.
                var basePackageUri = that.packageUri.substr(0, that.packageUri.lastIndexOf('/') + 1);
                var assetSequenceUri = basePackageUri + pkg.assetSequences[that.assetSequenceIndex].$ref;

                $.getJSON(assetSequenceUri, (assetSequenceData) => {
                    that.assetSequence = that.pkg.assetSequences[that.assetSequenceIndex] = assetSequenceData;
                    that.loadDependencies();
                });
            }
        });
    }

    loadDependencies(): void {

        var that = this;

        var extension = that.extensions[that.assetSequence.assetType];

        yepnope.injectCss(extension.css, function () {

            $.getJSON(extension.config, (config) => {

                var configExtension = utils.Utils.getQuerystringParameter('c');

                // if data-config has been set on embedding div, load the js
                // and extend the existing config object.
                if (configExtension){

                    // save a reference to the config extension uri.
                    config.uri = configExtension;

                    $.getJSON(configExtension, (ext) => {
                        $.extend(true, config, ext);

                        that.createExtension(extension, config);
                    });

                } else {
                    that.createExtension(extension, config);
                }
            });
        });
    }

    createExtension(extension: any, config: any): void{
        // create provider.
        var provider = new extension.provider(config, this.pkg);

        // create extension.
        new extension.type(provider);
    }
}

export = BootStrapper;