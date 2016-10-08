module.exports = {
    sync: {
        dependencies: {
            // all files that need to be copied from /node_modules to /src/extensions/uv-virtex-extension/lib post npm install
            cwd: '<%= config.directories.npm %>',
            expand: true,
            flatten: true,
            src: [
                'virtex3d/dist/virtex.js',
                'three.js/build/three.min.js',
                'iiif-metadata-component/dist/iiif-metadata-component.js'
            ],
            dest: '<%= config.directories.uvVirtexExtension %>/lib'
        },
        typings: {
            // all d.ts files that need to be copied from /node_modules to /src/typings post npm install
            cwd: '<%= config.directories.npm %>',
            expand: true,
            flatten: true,
            src: [
                'virtex3d/dist/virtex.d.ts',
                'iiif-metadata-component/dist/iiif-metadata-component.d.ts'
            ],
            dest: '<%= config.directories.typings %>'
        }
    }
}