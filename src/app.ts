/// <reference path="js/require.d.ts" />

require.config({
    paths: {
        'modernizr': 'js/modernizr',
        'jquery': 'js/jquery-1.10.2.min',
        'plugins': 'js/jquery.plugins',
        'underscore': 'js/underscore-min',
        'pubsub': 'js/pubsub',
        'jsviews': 'js/jsviews.min',
        'yepnope': 'js/yepnope.1.5.4-min',
        'yepnopecss': 'js/yepnope.css',
        'l10n': 'js/l10n',
        'sanitize': 'js/sanitize',
        'length': 'js/Length.min'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        plugins: {
            deps: ['jquery']
        },
        underscore: {
            exports: '_'
        },
        pubsub: {
            deps: ['jquery']
        },
        jsviews: {
            deps: ['jquery']
        },
        yepnopecss: {
            deps: ['yepnope']
        }
    }
});

require([
        'modernizr',
        'jquery',
        'plugins',
        'underscore',
        'pubsub',
        'jsviews',
        'yepnope',
        'yepnopecss',
        'bootstrapper',
        'l10n',
        'sanitize',
        'extensions/uv-seadragon-extension/extension',
        'extensions/uv-seadragon-extension/provider',
        'extensions/uv-mediaelement-extension/extension',
        'extensions/uv-mediaelement-extension/provider',
        'extensions/uv-pdf-extension/extension',
        'extensions/uv-pdf-extension/provider',
        'length'
    ], (modernizr,
        $,
        plugins,
        _,
        pubsub,
        jsviews,
        yepnope,
        yepnopecss,
        bootstrapper,
        l10n,
        sanitize,
        seadragonExtension,
        seadragonProvider,
        mediaelementExtension,
        mediaelementProvider,
        pdfExtension,
        pdfProvider,
        Length) => {

        // todo: use a compiler flag (when available)
        window.DEBUG = true; // this line is removed on build.

        var extensions = {};

        extensions['seadragon/iiif'] = {
            type: seadragonExtension.Extension,
            provider: seadragonProvider.Provider,
            name: 'uv-seadragon-extension'
        };

        extensions['video/iiif'] = {
            type: mediaelementExtension.Extension,
            provider: mediaelementProvider.Provider,
            name: 'uv-mediaelement-extension'
        };

        extensions['audio/iiif'] = {
            type: mediaelementExtension.Extension,
            provider: mediaelementProvider.Provider,
            name: 'uv-mediaelement-extension'
        };

        extensions['pdf/iiif'] = {
            type: pdfExtension.Extension,
            provider: pdfProvider.Provider,
            name: 'uv-pdf-extension'
        };

        var bs = new bootstrapper(extensions);

        bs.bootStrap();
    });