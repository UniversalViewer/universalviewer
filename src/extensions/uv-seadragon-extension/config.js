var c = require('../../../config');
var config = new c();

module.exports = {
    sync: {
        dependencies: [
            {
                // all files that need to be copied from /node_modules to /src/extensions/uv-seadragon-extension/lib post npm install
                cwd: config.directories.npm,
                expand: true,
                flatten: true,
                src: [
                    'iiif-gallery/dist/iiifgallery.js',
                    '@iiif/iiif-gallery-component/dist/GalleryComponent.js',
                    '@iiif/iiif-metadata-component/dist/MetadataComponent.js',
                    '@iiif/iiif-tree-component/dist/TreeComponent.js',
                    'openseadragon/build/openseadragon/openseadragon.min.js'
                ],
                dest: config.directories.uvSeadragonExtension + '/lib'
            },
            {
                cwd: config.directories.npm,
                expand: true,
                flatten: true,
                src: 'iiif-gallery/dist/iiifgallery/*',
                dest: config.directories.uvSeadragonExtension + '/lib/iiifgallery'
            }
        ]
    }
}