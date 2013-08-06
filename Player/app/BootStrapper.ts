/// <reference path="../js/jquery.d.ts" />
import utils = require("app/Utils");

class BootStrapper{
    
    pkg: any;
    extensions: any;
    packageUri: string;
    assetIndex: number;
    assetSequence: any;

    // this loads the package, determines what kind of extension and provider to use, and instantiates them.
    constructor(extensions: any) {

        this.extensions = extensions;

        var that = this;

        that.packageUri = utils.Utils.getParameterByName('dataUri');

        $.getJSON(that.packageUri, (pkg) => {

            that.pkg = pkg;

            var hash = utils.Utils.getHashValues('/', parent.document);

            that.assetIndex = hash[0] || 0;

            if (!that.pkg.assetSequences[that.assetIndex].$ref) {
                that.assetSequence = that.pkg.assetSequences[that.assetIndex];
                that.createExtension();
            } else {
                // load missing assetSequence.
                var basePackageUri = that.packageUri.substr(0, that.packageUri.lastIndexOf('/') + 1);
                var assetSequenceUri = basePackageUri + pkg.assetSequences[that.assetIndex].$ref;

                $.getJSON(assetSequenceUri, (assetSequenceData) => {
                    that.assetSequence = that.pkg.assetSequences[that.assetIndex] = assetSequenceData;
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

export = BootStrapper