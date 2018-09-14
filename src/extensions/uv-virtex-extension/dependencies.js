define(function () {
    return function (formats) {
        return {
            sync: ['three.min'],
            async: ['VRControls', 'VREffect', 'stats.min', 'OBJLoader', 'MTLLoader', 'PLYLoader', 'GLTFLoader', 'Detector', 'WebVR', 'virtex', 'iiif-metadata-component']
        };
    };
});
