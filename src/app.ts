/// <reference path="js/require.d.ts" />

require.config({
    paths: {
        'jquery': 'js/jquery-1.10.2.min',
        'plugins': 'js/jquery.plugins',
        'console': 'js/console',
        'pubsub': 'js/pubsub',
        'jsviews': 'js/jsviews.min',
        'openseadragon': 'modules/coreplayer-seadragoncenterpanel-module/js/openseadragon.min'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        plugins: {
            deps: ['jquery']
        },
        pubsub: {
            deps: ['jquery']
        },
        jsviews: {
            deps: ['jquery']
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
    //'extensions/coreplayer-seadragon-extension/app',
    'extensions/wellcomeplayer-seadragon-extension/app',
    //'extensions/coreplayer-seadragon-extension/provider'
    'extensions/wellcomeplayer-seadragon-extension/provider'
    ],
    ($, 
    plugins, 
    console, 
    pubsub, 
    jsviews, 
    openseadragon, 
    bootstrapper, 
    seadragon, 
    seadragonProvider) => {

        var extensions = {};

        extensions['seadragon/dzi'] = {
            type: seadragon.App,
            provider: seadragonProvider.Provider,
            //configUri: 'extensions/coreplayer-seadragon-extension/config.js'
            configUri: 'extensions/wellcomeplayer-seadragon-extension/config.js'
        };

        new bootstrapper(extensions);
    });