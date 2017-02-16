var metadata = require('./package');

module.exports = function () {
    this.name = metadata.name;
    this.header = '// ' + this.name + ' v' + metadata.version + ' ' + metadata.homepage + '\n';
    this.dependencies = {
        libs: [
            'node_modules/base-component/dist/base-component.bundle.js',
            'node_modules/jquery-plugins/dist/jquery-plugins.js',
            'node_modules/jquery-tiny-pubsub/dist/ba-tiny-pubsub.min.js',
            'node_modules/key-codes/dist/key-codes.js',
            'node_modules/manifold/dist/manifold.bundle.js',
            'node_modules/units/Length.min.js',
            'node_modules/utils/dist/utils.js'
        ]
    };
    this.directories = {
        bower: './lib',
        build: './build',
        dist: './dist',
        examples: './examples',
        extensions: './src/extensions',
        lib: './src/lib',
        modules: './src/modules',
        npm: './node_modules',
        themes: './src/themes',
        uvMediaElementExtension: './src/extensions/uv-mediaelement-extension',
        uvPdfExtension: './src/extensions/uv-pdf-extension',
        uvSeadragonExtension: './src/extensions/uv-seadragon-extension',
        uvVirtexExtension: './src/extensions/uv-virtex-extension'
    };
    this.ts = {
        dev: {
            src: ['./src/**/*.ts', 'typings/**/*.ts'],
            options: {
                target: 'es3',
                module: 'amd',
                sourceMap: true,
                declarations: false,
                noLib: false,
                comments: true
            }
        },
        dist: {
            src: ['./src/**/*.ts', 'typings/**/*.ts'],
            options: {
                target: 'es3',
                module: 'amd',
                sourceMap: false,
                declarations: false,
                noLib: false,
                comments: false
            }
        }
    }
}