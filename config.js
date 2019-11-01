var metadata = require('./package');

module.exports = function () {
    this.name = metadata.name;
    this.header = '// ' + this.name + ' v' + metadata.version + ' ' + metadata.homepage + '\n';
    this.examplesPort = 8002;
    this.dependencies = {
        bundle: [
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
        npmthemes: './node_modules/@universalviewer',
        src: './src',
        themes: './src/themes',
        uv: 'uv',
        uvAVExtension: './src/extensions/uv-av-extension',
        uvDefaultExtension: './src/extensions/uv-default-extension',
        uvMediaElementExtension: './src/extensions/uv-mediaelement-extension',
        uvPdfExtension: './src/extensions/uv-pdf-extension',
        uvOpenSeadragonExtension: './src/extensions/uv-openseadragon-extension',
        uvVirtexExtension: './src/extensions/uv-virtex-extension'
    };
    this.themes = {
        
    }
}