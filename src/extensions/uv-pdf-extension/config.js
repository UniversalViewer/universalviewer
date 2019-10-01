var c = require('../../../config');
var config = new c();

module.exports = {
    sync: {
        dependencies: {
            // all files that need to be copied from /node_modules to /src/extensions/uv-pdf-extension/lib post npm install
            cwd: config.directories.npm,
            expand: true,
            flatten: true,
            src: [
                '@iiif/iiif-metadata-component/dist/MetadataComponent.js',
                'pdfjs-dist/build/pdf.combined.js',
                'pdfobject/pdfobject.js'
            ],
            dest: config.directories.uvPdfExtension + '/lib'
        }
    }
}