var metadata = require('./package');

var Config = (function () {
    function Config() {
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
            ],
            typings: [
                'node_modules/base-component/dist/base-component.d.ts',
                'node_modules/jquery-plugins/typings/jquery-plugins.d.ts',
                'node_modules/key-codes/dist/key-codes.d.ts',
                'node_modules/manifold/dist/manifold.bundle.d.ts',
                'node_modules/utils/dist/utils.d.ts'
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
            typings: './src/typings',
            uvMediaElementExtension: './src/extensions/uv-mediaelement-extension',
            uvPdfExtension: './src/extensions/uv-pdf-extension',
            uvSeadragonExtension: './src/extensions/uv-seadragon-extension',
            uvVirtexExtension: './src/extensions/uv-virtex-extension'
        };
        this.typescript = {
            dev: {
                src: ['./src/**/*.ts'],
                options: {
                    target: 'es3',
                    module: 'amd',
                    sourceMap: true,
                    declarations: false,
                    nolib: false,
                    comments: true
                }
            },
            dist: {
                src: ['./src/**/*.ts'],
                options: {
                    target: 'es3',
                    module: 'amd',
                    sourceMap: false,
                    declarations: false,
                    nolib: false,
                    comments: false
                }
            }
        };
    }
    return Config;
})();

module.exports = Config;