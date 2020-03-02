var c = require('../../../config');
var config = new c();

module.exports = {
    sync: {
        dependencies: [
            {
                // all files that need to be copied from /node_modules to /src/extensions/uv-ebook-extension/lib post npm install
                cwd: config.directories.npm,
                expand: true,
                flatten: true,
                src: [
                    '@iiif/iiif-metadata-component/dist/MetadataComponent.js',
                    '@iiif/iiif-tree-component/dist/TreeComponent.js'
                ],
                dest: config.directories.uvEbookExtension + '/lib'
            },
            {
                cwd: config.directories.npm,
                expand: true,
                flatten: true,
                src: '@universalviewer/uv-ebook-components/dist/uv-ebook-components/*',
                dest: config.directories.uvEbookExtension + '/lib'
            }
        ]
    }
}