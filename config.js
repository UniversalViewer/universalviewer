var metadata = require('./package');

module.exports = function () {
    this.name = metadata.name;
    this.header = '// ' + this.name + ' v' + metadata.version + ' ' + metadata.homepage + '\n';
    this.examplesPort = 8001;
    this.dependencies = {
        libs: [
            'node_modules/base-component/dist/base-component.js',
            'node_modules/exjs/dist/ex.es3.min.js',
            'node_modules/extensions/dist/extensions.min.js',
            'node_modules/http-status-codes/dist/http-status-codes.min.js',
            'node_modules/jquery-plugins/dist/jquery-plugins.min.js',
            'node_modules/jquery-tiny-pubsub/dist/ba-tiny-pubsub.min.js',
            'node_modules/key-codes/dist/key-codes.min.js',
            'node_modules/manifesto/dist/manifesto.min.js',
            'node_modules/manifold/dist/manifold.min.js',
            'node_modules/utils/dist/utils.min.js'
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
        uvMediaElementExtension: './src/extensions/uv-mediaelement-extension',
        uvPdfExtension: './src/extensions/uv-pdf-extension',
        uvSeadragonExtension: './src/extensions/uv-seadragon-extension',
        uvVirtexExtension: './src/extensions/uv-virtex-extension'
    };
}