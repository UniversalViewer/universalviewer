/*
/// <reference path="../js/jquery.d.ts" />
/// <reference path="../js/extensions.d.ts" />
import utils = module("app/Utils");
import baseProvider = module("app/BaseProvider");

export class Main {

    static run(configUri: string, extensions: Object): void {
        // get config.
        $.getJSON(configUri, (config) => {

            var dataUri = utils.Utils.getParameterByName('dataUri');

            // get data.
            $.getJSON(dataUri, (data) => {
                
                // create base provider.
                var bp = new baseProvider.BaseProvider(config, extensions);
                bp.create(data);

                // create provider.
                var provider = new extension.provider();
                provider.setData(assetSequence);

                // create extension.
                new extension.type(config, provider);

            });
        });
    }
}
*/