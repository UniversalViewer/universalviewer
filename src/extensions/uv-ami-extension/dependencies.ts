define(function() {
    return function(formats: string[]) {
        return {
            sync: ['ionic.proxy', 'three.min', 'GLTFLoader', 'DRACOLoader', 'OrbitControls', 'ami.min', 'amiviewer.proxy'],
            async: ['MetadataComponent']
        };
    }
});