/// <reference path="../js/require.d.ts" />
/// <reference path="Main.ts" />

require.config({
    baseUrl: '../',
    paths: {
        'jquery': 'js/jquery-1.10.2.min',
        'plugins': 'js/jquery.plugins',
        'console': 'js/console',
        'pubsub': 'js/pubsub'
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
    }
});

require(['jquery', 'plugins', 'console', 'pubsub', 'app/BaseProvider', 'app/seadragon/App', 'app/seadragon/Provider'],
    ($, plugins, console, pubsub, baseProvider, seadragon, seadragonProvider) => {

        var extensions = {};

        extensions['monograph'] = {
            type: seadragon.App,
            provider: seadragonProvider.Provider
        };

        new baseProvider.BaseProvider('js/config.js', extensions);
    });