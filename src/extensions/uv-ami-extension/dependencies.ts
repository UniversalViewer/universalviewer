define(function() {
    return function(formats: string[]) {
        return {
            sync: ['ionic.proxy', 'three.min', 'GLTFLoader', 'DRACOLoader', 'STLLoader', 'ami.min', 'amiviewer.proxy'],
            async: ['MetadataComponent']
        };
    }
});