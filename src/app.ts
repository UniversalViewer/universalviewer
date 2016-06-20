require.config({
    paths: {
        'browserdetect': 'lib/browserdetect',
        'keycodes': 'lib/key-codes',
        'length': 'lib/Length.min',
        'manifold': 'lib/manifold.bundle',
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
    'browserdetect',
    'keycodes',
    'length',
    'manifold',
    'modernizr',
    'plugins',
    'pubsub',
    'sanitize',
    'utils',
    'xdomainrequest',
    'yepnopecss',
    ], (
    bootstrapper,
    mediaelementExtension,
    pdfExtension,
    seadragonExtension,
    virtexExtension
    ) => {

        // todo: use a compiler flag (when available)
        window.DEBUG = true; // this line is removed on build.

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

        bs.bootStrap();
    });