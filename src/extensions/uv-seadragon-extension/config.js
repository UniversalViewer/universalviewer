module.exports = {
    sync: {
        dependencies: {
            // all files that need to be copied from /node_modules to /src/extensions/uv-seadragon-extension/lib post npm install
            cwd: '<%= config.dirs.npm %>',
            expand: true,
            flatten: true,
            src: [
                'iiif-tree-component/dist/iiif-tree-component.js',
                'openseadragon/build/openseadragon/openseadragon.min.js'
            ],
            dest: '<%= config.dirs.uvSeadragonExtension %>/lib'
        },
        typings: {
            // all d.ts files that need to be copied from /node_modules to /src/typings post npm install
            cwd: '<%= config.dirs.npm %>',
            expand: true,
            flatten: true,
            src: [
                'iiif-tree-component/dist/iiif-tree-component.d.ts'
            ],
            dest: '<%= config.dirs.typings %>'
        }
    }
}