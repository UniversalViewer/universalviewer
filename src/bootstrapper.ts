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

            if (!that.pkg.assetSequences[that.assetSequenceIndex].$ref) {
                that.assetSequence = that.pkg.assetSequences[that.assetSequenceIndex];
                that.createExtension();
            } else {
                // load missing assetSequence.
                var basePackageUri = that.packageUri.substr(0, that.packageUri.lastIndexOf('/') + 1);
                var assetSequenceUri = basePackageUri + pkg.assetSequences[that.assetSequenceIndex].$ref;

                $.getJSON(assetSequenceUri, (assetSequenceData) => {
                    that.assetSequence = that.pkg.assetSequences[that.assetSequenceIndex] = assetSequenceData;
                    that.createExtension();
                });
            }
        });
    }

    createExtension(): void {

        var that = this;

        $.getJSON(that.extensions[that.assetSequence.assetType].configUri, (config) => {
            // create provider.
            var provider = new that.extensions[that.assetSequence.assetType].provider(config, that.pkg);

            // create extension.
            new that.extensions[that.assetSequence.assetType].type(provider);
        });

    }
}

export = BootStrapper;