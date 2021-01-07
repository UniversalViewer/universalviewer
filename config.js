var metadata = require('./package');

module.exports = function () {
    this.name = metadata.name;
    this.header = '// ' + this.name + ' v' + metadata.version + ' ' + metadata.homepage + '\n';
    this.dependencies = {
        // goes in assets/js/
        bundle: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/jsviews/jsviews.min.js'
        ]
    };
    this.directories = {
        bower: './lib',
        build: './.build',
        dist: './dist',
        distumd: './uv-dist-umd',
        www: './www',
        extensions: './src/extensions',
        lib: './src/lib',
        modules: './src/modules',
        npm: './node_modules',
        npmthemes: './node_modules/@universalviewer',
        src: './src',
        themes: './src/themes',
        uv: 'uv'
    };
    this.themes = {

    }
}
