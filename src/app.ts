/// <reference path="js/require.d.ts" />

require.config({
    paths: {
        'jquery': 'js/jquery-1.10.2.min',
        'plugins': 'js/jquery.plugins',
        'console': 'js/console',
        'pubsub': 'js/pubsub',
        'openseadragon': 'modules/seadragonCenterPanel/js/openseadragon.min',
        'jsviews': 'js/jsviews.min'
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
            exports: 'openseadragon'
        },
        jsviews: {
            exports: 'jsviews'
        }
    }
});

require([
    'jquery',
    'plugins',
    'console',
    'pubsub',
    'openseadragon',
    'jsviews',
    'bootstrapper',
    'extensions/seadragon/app',
    'extensions/seadragon/provider'],
    ($, plugins, console, pubsub, osd, jsviews, bootstrapper, seadragon, seadragonProvider) => {

        var extensions = {};

        extensions['seadragon/dzi'] = {
            type: seadragon.App,
            provider: seadragonProvider.Provider,
            configUri: 'extensions/seadragon/config.js'
        };

        new bootstrapper(extensions);
    });