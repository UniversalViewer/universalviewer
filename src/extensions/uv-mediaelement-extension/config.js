var c = require('../../../config');
var config = new c();

module.exports = {
    sync: {
        dependencies: {
            // all files that need to be copied from /node_modules to /src/extensions/uv-mediaelement-extension/lib post npm install
            cwd: config.directories.npm,
            expand: true,
            flatten: true,
            src: [
                'iiif-metadata-component/dist/iiif-metadata-component.js',
                'mediaelement/build/mediaelement-and-player.js'
            ],
            dest: config.directories.uvMediaElementExtension + '/lib'
        }
    }
}