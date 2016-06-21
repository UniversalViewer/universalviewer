module.exports = {
    sync: {
        // all files that need to be copied from /node_modules to /src/extensions/uv-seadragon-extension/lib post npm install
        cwd: '<%= config.dirs.npm %>',
        expand: true,
        flatten: true,
        src: [
            'iiif-tree-component/dist/iiif-tree-component.js'
        ],
        dest: '<%= config.dirs.uvSeadragonExtension %>/lib'
    }
}