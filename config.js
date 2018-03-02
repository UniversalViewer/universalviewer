var metadata = require('./package');

module.exports = function () {
    this.name = metadata.name;
    this.header = '// ' + this.name + ' v' + metadata.version + ' ' + metadata.homepage + '\n';
    this.examplesPort = 8002;
    this.dependencies = {
        bundle: [
            'node_modules/base-component/dist/base-component.js',
            'node_modules/exjs/dist/ex.es3.min.js',
            'node_modules/http-status-codes/dist/http-status-codes.js',
            'node_modules/jquery-plugins/dist/jquery-plugins.js',
            'node_modules/jquery-tiny-pubsub/dist/ba-tiny-pubsub.js',
            'node_modules/key-codes/dist/key-codes.js',
            'node_modules/manifesto.js/dist/client/manifesto.js',
            'node_modules/@iiif/manifold/dist/manifold.js',
            'node_modules/pdfjs-dist/build/pdf.combined.js',
            'node_modules/utils/dist/utils.js'
        ],
        offline: [ // when offline, make these libs available as they can't be loaded from a cdn
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/jsviews/jsviews.min.js',
            'node_modules/core-js/client/shim.min.js'
        ]
    };
    this.directories = {
        bower: './lib',
        build: './.build',
        dist: './dist',
        examples: './examples',
        extensions: './src/extensions',
        lib: './src/lib',
        modules: './src/modules',
        npm: './node_modules',
        src: './src',
        themes: './src/themes',
        uv: 'uv',
        uvAVExtension: './src/extensions/uv-av-extension',
        uvDefaultExtension: './src/extensions/uv-default-extension',
        uvMediaElementExtension: './src/extensions/uv-mediaelement-extension',
        uvPdfExtension: './src/extensions/uv-pdf-extension',
        uvSeadragonExtension: './src/extensions/uv-seadragon-extension',
        uvVirtexExtension: './src/extensions/uv-virtex-extension'
    };
    this.themes = {
        
    }
}