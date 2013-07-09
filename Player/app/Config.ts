/// <reference path="../js/require.d.ts" />
/// <reference path="App.ts" />

require.config({
    baseUrl: '../',
    paths: {
        'jquery': 'js/jquery-1.10.2.min',
        'console': 'js/console',
        'pubsub': 'js/pubsub'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        console: {
            exports: "console"
        },
        pubsub: {
            deps: ["jquery"],
            exports: "pubsub"
        },
    }
});

require(['jquery', 'console', 'pubsub', 'app/App', 'app/DataProvider'],
    ($, console, pubsub, app, dp) => {
        new app.App('js/config.js', new dp.DataProvider());
    });