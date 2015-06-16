require.config({
    paths: {
        'modernizr': 'lib/modernizr',
        'jquery': 'lib/jquery-1.10.2.min',
        'plugins': 'lib/jquery.plugins',
        'underscore': 'lib/underscore-min',
        'pubsub': 'lib/pubsub',
        'jsviews': 'lib/jsviews.min',
        'yepnope': 'lib/yepnope.1.5.4-min',
        'yepnopecss': 'lib/yepnope.css',
        'l10n': 'lib/l10n',
        'sanitize': 'lib/sanitize',
        'length': 'lib/Length.min'
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