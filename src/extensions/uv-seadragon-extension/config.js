var c = require('../../../config');
var config = new c();

module.exports = {
    sync: {
        dependencies: {
            // all files that need to be copied from /node_modules to /src/extensions/uv-seadragon-extension/lib post npm install
            cwd: config.directories.npm,
            expand: true,
            flatten: true,
            src: [
                'iiif-gallery-component/dist/iiif-gallery-component.js',
                'iiif-metadata-component/dist/iiif-metadata-component.js',
                'iiif-tree-component/dist/iiif-tree-component.js',
                'openseadragon/build/openseadragon/openseadragon.min.js'
            ],
            dest: config.directories.uvSeadragonExtension + '/lib'
        }
    }
}