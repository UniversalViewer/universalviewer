module.exports = {
    sync: {
        dependencies: {
            // all files that need to be copied from /node_modules to /src/extensions/uv-pdf-extension/lib post npm install
            cwd: '<%= config.directories.npm %>',
            expand: true,
            flatten: true,
            src: [
                'iiif-metadata-component/dist/iiif-metadata-component.js',
                'pdfobject/pdfobject.js',
                'pdfjs-dist/build/pdf.combined.js'
            ],
            dest: '<%= config.directories.uvPdfExtension %>/lib'
        }
    }
}