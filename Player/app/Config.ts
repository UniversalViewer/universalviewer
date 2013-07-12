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

require(['jquery', 'plugins', 'console', 'pubsub', 'app/Main', 'app/seadragon/App', 'app/seadragon/DataProvider'],
    ($, plugins, console, pubsub, main, seadragon, seadragondp) => {
        
        var typeEvaluator = function (data) {
            return data.assetSequences[0].rootSection.sectionType.toLowerCase();
        }

        var extensions = {};

        extensions['monograph'] = {
            type: seadragon.App,
            provider: seadragondp.DataProvider
        };

        main.Main.Run('js/config.js', typeEvaluator, extensions);
    });