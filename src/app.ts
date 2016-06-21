require.config({
    paths: {
        'base-component': 'lib/base-component',
        'browserdetect': 'lib/browserdetect',
        'eventemitter2': 'lib/eventemitter2',
        'ex': 'lib/ex.es3.min',
        'ext': 'lib/extensions',
        'httpstatuscodes': 'lib/http-status-codes',
        'keycodes': 'lib/key-codes',
        'length': 'lib/Length.min',
        'manifesto': 'lib/manifesto',
        'manifold': 'lib/manifold',
        'modernizr': 'lib/modernizr',
        'plugins': 'lib/jquery-plugins',
        'pubsub': 'lib/ba-tiny-pubsub.min',
        'sanitize': 'lib/sanitize',
        'utils': 'lib/utils',
        'xdomainrequest': 'lib/jquery.xdomainrequest',
        'yepnopecss': 'lib/yepnope.css'
    }
});

require([
    'Bootstrapper',
    'extensions/uv-mediaelement-extension/Extension',
    'extensions/uv-pdf-extension/Extension',
    'extensions/uv-seadragon-extension/Extension',
    'extensions/uv-virtex-extension/Extension',
    'eventemitter2',
    'base-component',
    'browserdetect',
    'ex',
    'ext',
    'httpstatuscodes',
    'keycodes',
    'length',
    'manifesto',
    'manifold',
    'modernizr',
    'plugins',
    'pubsub',
    'sanitize',
    'xdomainrequest',
    'yepnopecss',
    ], (
    bootstrapper,
    mediaelementExtension,
    pdfExtension,
    seadragonExtension,
    virtexExtension,
    eventemitter2
    ) => {

        // todo: use a compiler flag (when available)
        window.DEBUG = true; // this line is removed on build.

        window.EventEmitter2 = eventemitter2;

        var extensions = {};

        extensions[manifesto.ElementType.canvas().toString()] = {
            type: seadragonExtension,
            name: 'uv-seadragon-extension'
        };

        extensions[manifesto.ElementType.movingimage().toString()] = {
            type: mediaelementExtension,
            name: 'uv-mediaelement-extension'
        };

        extensions[manifesto.ElementType.physicalobject().toString()] = {
            type: virtexExtension,
            name: 'uv-virtex-extension'
        };

        extensions[manifesto.ElementType.sound().toString()] = {
            type: mediaelementExtension,
            name: 'uv-mediaelement-extension'
        };

        extensions[manifesto.RenderingFormat.pdf().toString()] = {
            type: pdfExtension,
            name: 'uv-pdf-extension'
        };

        var bs = new bootstrapper(extensions);

        bs.bootstrap();
    });