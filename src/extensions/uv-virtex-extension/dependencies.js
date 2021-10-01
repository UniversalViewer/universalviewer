define(function () {
    return function (formats) {
        return {
            sync: ['three.min'],
            async: ['VRControls', 'VREffect', 'stats.min', 'OBJLoader', 'MTLLoader', 'PLYLoader', 'GLTFLoader', 'Detector', 'WebVR', 'virtex', 'IIIFMetadataComponent']
            // sync: ['three.min', 'draco_decoder'],
            // async: ['VRControls', 'VREffect', 'stats.min', 'DRACOLoader', 'GLTFLoader', 'OBJLoader', 'MTLLoader', 'Detector', 'WebVR', 'virtex', 'iiif-metadata-component']
        };
    };
});
//# sourceMappingURL=dependencies.js.map