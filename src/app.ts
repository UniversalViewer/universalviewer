/// <reference path="js/require.d.ts" />

require.config({
    paths: {
        'jquery': 'js/jquery-1.10.2.min',
        'plugins': 'js/jquery.plugins',
        'console': 'js/console',
        'pubsub': 'js/pubsub',
        'jsviews': 'js/jsviews.min',
        'openseadragon': 'modules/seadragonCenterPanel/js/openseadragon.min'
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
        jsviews: {
            deps: ['jquery'],
            exports: 'jsviews'
        },
        openseadragon: {
            exports: 'openseadragon'
        }
    }
});

require([
    'jquery',
    'plugins',
    'console',
    'pubsub',
    'jsviews',
    'openseadragon',
    'bootstrapper',
    'extensions/seadragon/app',
    'extensions/seadragon/provider'],
    ($, plugins, console, pubsub, jsviews, osd, bootstrapper, seadragon, seadragonProvider) => {

        var extensions = {};

        extensions['seadragon/dzi'] = {
            type: seadragon.App,
            provider: seadragonProvider.Provider,
            configUri: 'seadragon.config.js'
        };

        new bootstrapper(extensions);
    });