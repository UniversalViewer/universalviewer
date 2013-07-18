/// <reference path="../js/require.d.ts" />

require.config({
    baseUrl: '../',
    paths: {
        'jquery': 'js/jquery-1.10.2.min',
        'plugins': 'js/jquery.plugins',
        'console': 'js/console',
        'pubsub': 'js/pubsub',
        'openseadragon': 'js/openseadragon.min'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        plugins: {
            deps: ['jquery'],
            exports: 'plugins'
        },
        console: {
            exports: 'console'
        },
        pubsub: {
            deps: ['jquery'],
            exports: 'pubsub'
        },
        openseadragon: {
            exports: 'OpenSeadragon'
        }
    }
});

require(['jquery', 'plugins', 'console', 'pubsub', 'openseadragon', 'app/BootStrapper', 'app/seadragon/App', 'app/seadragon/Provider'],
    ($, plugins, console, pubsub, OpenSeadragon, bootStrapper, seadragon, seadragonProvider) => {

        var extensions = {};

        extensions['seadragon'] = {
            type: seadragon.App,
            provider: seadragonProvider.Provider
        };

        // todo: assetType should move to assetsequence - therefore no need for aliases

        // aliases
        extensions['monograph'] = extensions['seadragon'];
        extensions['artwork'] = extensions['seadragon'];
        extensions['archive'] = extensions['seadragon'];
        extensions['boundmanuscript'] = extensions['seadragon'];

        new bootStrapper.BootStrapper('js/config.js', extensions);
    });