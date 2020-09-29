define(function() {
    return function(formats: string[]) {
        return {
            sync: ['three.min'],
            async: ['VRControls', 'VREffect', 'stats.min', 'OBJLoader', 'MTLLoader', 'PLYLoader', 'GLTFLoader', 'Detector', 'WebVR', 'virtex', 'MetadataComponent']
        };
    }
});
