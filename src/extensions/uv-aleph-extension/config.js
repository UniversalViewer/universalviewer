var c = require('../../../config');
var config = new c();

module.exports = {
    sync: {
        dependencies: [
            {
                // all files that need to be copied from /node_modules to /src/extensions/uv-ami-extension/lib post npm install
                cwd: config.directories.npm,
                expand: true,
                flatten: true,
                src: [
                    'three/examples/js/controls/OrbitControls.js',
                    '@universalviewer/aleph/dist/collection/assets/ami.min.js',
                    '@universalviewer/aleph/dist/collection/assets/aframe-1.0.3.min.js',
                    '@universalviewer/aleph/dist/collection/assets/draco_decoder.wasm',
                    '@universalviewer/aleph/dist/collection/assets/draco_wasm_wrapper.js'
                ],
                dest: config.directories.uvAlephExtension + '/lib'
            },
            {
                cwd: config.directories.npm,
                expand: true,
                flatten: true,
                src: '@universalviewer/aleph/dist/aleph/*',
                dest: config.directories.uvAlephExtension + '/lib'
            }
            // {
            //     cwd: config.directories.npm,
            //     expand: true,
            //     flatten: true,
            //     src: '@ionic/core/dist/ionic/*',
            //     dest: config.directories.uvAlephExtension + '/lib'
            // }
            // {
            //     cwd: config.directories.npm,
            //     expand: true,
            //     flatten: true,
            //     src: '@universalviewer/aleph/dist/aleph/*',
            //     dest: config.directories.uvAlephExtension + '/lib/aleph'
            // }
        ]
    }
}