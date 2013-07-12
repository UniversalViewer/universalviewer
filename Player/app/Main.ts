/// <reference path="../js/jquery.d.ts" />
/// <reference path="../js/extensions.d.ts" />
import utils = module("app/Utils");

export class Main {

    static Run(configUri: string, typeEvaluator: Function, extensions: Object): void {
        // get config.
        $.getJSON(configUri, (config) => {

            var dataUri = utils.Utils.getParameterByName('dataUri');

            // get data.
            $.getJSON(dataUri, (data) => {
                var type = typeEvaluator(data);
                var extension = extensions[type];

                // create provider.
                var provider = new extension.provider();
                provider.setData(data);

                // create extension.
                new extension.type(config, provider);
            });
        });  
    }

}
