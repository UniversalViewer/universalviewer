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
                    '@universalviewer/aleph/dist/collection/assets/aframe-master.min.js',
                    '@universalviewer/aleph/dist/aleph.js',
                    '@universalviewer/aleph/dist/collection/assets/draco_decoder.wasm',
                    '@universalviewer/aleph/dist/collection/assets/draco_decoder_wrapper.js',
                    '@ionic/core/dist/ionic.js'
                ],
                dest: config.directories.uvAlephExtension + '/lib'
            },
            {
                cwd: config.directories.npm,
                expand: true,
                flatten: true,
                src: '@ionic/core/dist/ionic/*',
                dest: config.directories.uvAlephExtension + '/lib/ionic'
            },
            {
                cwd: config.directories.npm,
                expand: true,
                flatten: true,
                src: [
                    '@ionic/core/dist/ionic/svg/md-add-circle.svg', 
                    '@ionic/core/dist/ionic/svg/md-compass.svg', 
                    '@ionic/core/dist/ionic/svg/md-contrast.svg', 
                    '@ionic/core/dist/ionic/svg/md-create.svg', 
                    '@ionic/core/dist/ionic/svg/md-cube.svg', 
                    '@ionic/core/dist/ionic/svg/md-eye.svg',
                    '@ionic/core/dist/ionic/svg/md-options.svg',
                    '@ionic/core/dist/ionic/svg/md-sunny.svg',
                    '@ionic/core/dist/ionic/svg/md-swap.svg'
                ],
                dest: config.directories.uvAlephExtension + '/lib/ionic/svg'
            },
            {
                cwd: config.directories.npm,
                expand: true,
                flatten: true,
                src: '@universalviewer/aleph/dist/aleph/*',
                dest: config.directories.uvAlephExtension + '/lib/aleph'
            }
        ]
    }
}