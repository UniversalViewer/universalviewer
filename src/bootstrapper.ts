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

        that.dataBaseUri = utils.Utils.getParameterByName('dataBaseUri');
        that.packageUri = utils.Utils.getParameterByName('dataUri');

        if (that.dataBaseUri){
            that.packageUri = that.dataBaseUri + that.packageUri;
        }

        $.getJSON(that.packageUri, (pkg) => {

            that.pkg = pkg;

            // get params from querystring, these override hash ones if present.
            var index = utils.Utils.getParameterByName('assetSequenceIndex');

            if (index) {
                that.assetSequenceIndex = parseInt(index);
            } else {
                var hash = utils.Utils.getHashValues('/', parent.document);
                that.assetSequenceIndex = hash[0] || 0;
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