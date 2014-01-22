/// <reference path="js/require.d.ts" />

require.config({
    paths: {
        'jquery': 'js/jquery-1.10.2.min',
        'plugins': 'js/jquery.plugins',
        'pubsub': 'js/pubsub',
        'jsviews': 'js/jsviews.min',
        'yepnope': 'js/yepnope.1.5.4-min',
        'yepnopecss': 'js/yepnope.css',
        'openseadragon': 'modules/coreplayer-seadragoncenterpanel-module/js/openseadragon',
        'mediaelement': 'modules/coreplayer-mediaelementcenterpanel-module/js/mediaelement-and-player'
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
        },
        yepnopecss: {
            deps: ['yepnope']
        },
        mediaelement: {
            deps: ['jquery']
        }
    }
});

require([
    'jquery',
    'plugins',
    'pubsub',
    'jsviews',
    'yepnope',
    'yepnopecss',
    'openseadragon',
    'mediaelement',
    'bootstrapper',
    'extensions/coreplayer-seadragon-extension/extension',
    'extensions/coreplayer-seadragon-extension/provider',
    'extensions/coreplayer-mediaelement-extension/extension',
    'extensions/coreplayer-mediaelement-extension/provider',
    'extensions/coreplayer-pdf-extension/extension',
    'extensions/coreplayer-pdf-extension/provider'
    ],
    ($,
    plugins,
    pubsub,
    jsviews,
    yepnope,
    yepnopecss,
    openseadragon,
    mediaelement,
    bootstrapper,
    seadragonExtension,
    seadragonProvider,
    mediaelementExtension,
    mediaelementProvider,
    pdfExtension,
    pdfProvider) => {

        window.DEV = true; // this line is removed on build.

        var extensions = {};

        extensions['seadragon/dzi'] = {
            type: seadragonExtension.Extension,
            provider: seadragonProvider.Provider,
            config: 'extensions/coreplayer-seadragon-extension/config.js',
            css: 'extensions/coreplayer-seadragon-extension/css/styles.css'
        };

        extensions['video/mp4'] = {
            type: mediaelementExtension.Extension,
            provider: mediaelementProvider.Provider,
            config: 'extensions/coreplayer-mediaelement-extension/config.js',
            css: 'extensions/coreplayer-mediaelement-extension/css/styles.css'
        };

        extensions['video/multiple-sources'] = {
            type: mediaelementExtension.Extension,
            provider: mediaelementProvider.Provider,
            config: 'extensions/coreplayer-mediaelement-extension/config.js',
            css: 'extensions/coreplayer-mediaelement-extension/css/styles.css'
        };

        extensions['audio/mp3'] = {
            type: mediaelementExtension.Extension,
            provider: mediaelementProvider.Provider,
            config: 'extensions/coreplayer-mediaelement-extension/config.js',
            css: 'extensions/coreplayer-mediaelement-extension/css/styles.css'
        };

        extensions['application/pdf'] = {
            type: pdfExtension.Extension,
            provider: pdfProvider.Provider,
            config: 'extensions/coreplayer-pdf-extension/config.js',
            css: 'extensions/coreplayer-pdf-extension/css/styles.css'
        };

        new bootstrapper(extensions);
    });