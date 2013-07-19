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

        extensions['seadragon/dzi'] = {
            type: seadragon.App,
            provider: seadragonProvider.Provider
        };

        new bootStrapper.BootStrapper('js/config.js', extensions);
    });