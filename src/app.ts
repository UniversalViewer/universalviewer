require.config({
    paths: {
        'browserdetect': 'lib/browserdetect',
        'ex': 'lib/ex.es3.min',
        'ext': 'lib/extensions',
        'httpstatuscodes': 'lib/http-status-codes',
        'keycodes': 'lib/key-codes',
        'length': 'lib/Length.min',
        'manifesto': 'lib/manifesto',
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
    'extensions/uv-mediaelement-extension/Provider',
    'extensions/uv-pdf-extension/Extension',
    'extensions/uv-pdf-extension/Provider',
    'extensions/uv-seadragon-extension/Extension',
    'extensions/uv-seadragon-extension/Provider',
    'extensions/uv-virtex-extension/Extension',
    'extensions/uv-virtex-extension/Provider',
    'browserdetect',
    'ex',
    'ext',
    'httpstatuscodes',
    'keycodes',
    'length',
    'manifesto',
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

        extensions[manifesto.ElementType.canvas().toString()] = {
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