var metadata = require('./package');

var Config = (function () {
    function Config() {
        this.header = '// ' + metadata.name + ' v' + metadata.version + ' ' + metadata.homepage + '\n';
        this.dirs = {
            bower: './lib',
            build: './build',
            dist: './dist',
            examples: './examples',
            extensions: './src/extensions',
            lib: './src/lib',
            modules: './src/modules',
            themes: './src/themes',
            typings: './src/typings'
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