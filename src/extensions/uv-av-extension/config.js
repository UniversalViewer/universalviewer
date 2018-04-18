var c = require('../../../config');
var config = new c();

module.exports = {
    sync: {
        dependencies: {
            // all files that need to be copied from /node_modules to /src/extensions/uv-av-extension/lib post npm install
            cwd: config.directories.npm,
            expand: true,
            flatten: true,
            src: [
                'dashjs/dist/dash.all.min.js',
                'hls.js/dist/hls.min.js',
                'iiif-av-component/dist/iiif-av-component.js',
                'iiif-metadata-component/dist/iiif-metadata-component.js',
                'iiif-tree-component/dist/iiif-tree-component.js',
                'jquery-ui-dist/jquery-ui.min.js'
            ],
            dest: config.directories.uvAVExtension + '/lib'
        }
    }
}