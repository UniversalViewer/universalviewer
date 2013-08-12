/// <reference path="../js/require.d.ts" />

require.config({
    baseUrl: '../',
    paths: {
        'jquery': 'js/jquery-1.10.2.min',
        'plugins': 'js/jquery.plugins',
        'console': 'js/console',
        'pubsub': 'js/pubsub',
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
    'app/modules/SeadragonCenterPanel/js/openseadragon.min',
    'jsviews',
    'app/BootStrapper',
    'app/extensions/seadragon/App',
    'app/extensions/seadragon/Provider'],
    ($, plugins, console, pubsub, osd, jsviews, BootStrapper, seadragon, seadragonProvider) => {

        var extensions = {};

        extensions['seadragon/dzi'] = {
            type: seadragon.App,
            provider: seadragonProvider.Provider,
            configUri: '/app/extensions/seadragon/js/config.js'
        };

        new BootStrapper(extensions);
    });