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
                '@iiif/iiif-av-component/dist/AVComponent.js',
                '@iiif/iiif-metadata-component/dist/MetadataComponent.js',
                '@iiif/iiif-tree-component/dist/TreeComponent.js',
                'jquery-ui-dist/jquery-ui.min.js',
                'jquery-ui-touch-punch/jquery.ui.touch-punch.min.js',
                'jquery-binarytransport/jquery.binarytransport.js',
                'waveform-data/dist/waveform-data.js'
            ],
            dest: config.directories.uvAVExtension + '/lib'
        }
    }
}