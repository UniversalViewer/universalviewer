/// <reference path="../js/jquery.d.ts" />
import utils = module("app/Utils");
import bp = module("app/BaseProvider");

export class BootStrapper{
    
    // this loads the package, determines what kind of extension and provider to use, and instantiates them.

    constructor(configUri: string, extensions: any) {

        // get config.
        $.getJSON(configUri, (config) => {

            var packageUri = utils.Utils.getParameterByName('dataUri');

            $.getJSON(packageUri, (pkg) => {

                var hash = utils.Utils.getHashValues('/', parent.document);

                var assetIndex = hash[0] || 0;

                var assetSequence = pkg.assetSequences[assetIndex];

                // create provider.
                var provider = new extensions[assetSequence.assetType].provider(config, pkg);

                // create extension.
                new extensions[assetSequence.assetType].type(provider);
            });
        });
    }

}