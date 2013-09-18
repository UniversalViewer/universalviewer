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
    'extensions/seadragon/app',
    'extensions/seadragon/provider'],
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
            configUri: 'extensions/seadragon/config.js'
        };

        new bootstrapper(extensions);
    });