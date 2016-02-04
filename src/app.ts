require.config({
    paths: {
        'browserdetect': 'lib/browserdetect',
        'promise': 'lib/promise.min',
        'ex': 'lib/ex.es3.min',
        'ext': 'lib/extensions',
        'httpstatuscodes': 'lib/http-status-codes',
        'jquery': 'lib/jquery-1.10.2.min',
        'jsviews': 'lib/jsviews.min',
        'keycodes': 'lib/key-codes',
        'l10n': 'lib/l10n',
        'length': 'lib/Length.min',
        'lodash': 'lib/lodash.min',
        'manifesto': 'lib/manifesto',
        'modernizr': 'lib/modernizr',
        'plugins': 'lib/jquery-plugins',
        'pubsub': 'lib/pubsub',
        'sanitize': 'lib/sanitize',
        'utils': 'lib/utils',
        'xdomainrequest': 'lib/jquery.xdomainrequest',
        'yepnope': 'lib/yepnope.1.5.4-min',
        'yepnopecss': 'lib/yepnope.css'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        jsviews: {
            deps: ['jquery']
        },
        plugins: {
            deps: ['jquery']
        },
        pubsub: {
            deps: ['jquery']
        },
        underscore: {
            exports: '_'
        },
        xdomainrequest: {
           deps: ['jquery']
        },
        yepnopecss: {
            deps: ['yepnope']
        }
    }
});

require([
    'Bootstrapper',
    'extensions/uv-mediaelement-extension/Extension',
    'extensions/uv-mediaelement-extension/Provider',
    'extensions/uv-pdf-extension/Extension',
    'extensions/uv-pdf-extension/Provider',
    'extensions/uv-seadragon-extension/Extension',
    'extensions/uv-seadragon-extension/Provider',
    'extensions/uv-virtex-extension/Extension',
    'extensions/uv-virtex-extension/Provider',
    'manifesto',
    'browserdetect',
    'ex',
    'ext',
    'httpstatuscodes',
    'jquery',
    'jsviews',
    'keycodes',
    'l10n',
    'length',
    'lodash',
    'modernizr',
    'plugins',
    'promise',
    'pubsub',
    'sanitize',
    'utils',
    'xdomainrequest',
    'yepnope',
    'yepnopecss',
    ], (
    bootstrapper,
    mediaelementExtension,
    mediaelementProvider,
    pdfExtension,
    pdfProvider,
    seadragonExtension,
    seadragonProvider,
    virtexExtension,
    virtexProvider
    ) => {

        // todo: use a compiler flag (when available)
        window.DEBUG = true; // this line is removed on build.

        var extensions = {};

        extensions[manifesto.CanvasType.canvas().toString()] = {
            type: seadragonExtension,
            provider: seadragonProvider,
            name: 'uv-seadragon-extension'
        };

        extensions[manifesto.ElementType.movingimage().toString()] = {
            type: mediaelementExtension,
            provider: mediaelementProvider,
            name: 'uv-mediaelement-extension'
        };

        extensions[manifesto.ElementType.physicalobject().toString()] = {
            type: virtexExtension,
            provider: virtexProvider,
            name: 'uv-virtex-extension'
        };

        extensions[manifesto.ElementType.sound().toString()] = {
            type: mediaelementExtension,
            provider: mediaelementProvider,
            name: 'uv-mediaelement-extension'
        };

        extensions[manifesto.RenderingFormat.pdf().toString()] = {
            type: pdfExtension,
            provider: pdfProvider,
            name: 'uv-pdf-extension'
        };

        var bs = new bootstrapper(extensions);

        bs.bootStrap();
    });