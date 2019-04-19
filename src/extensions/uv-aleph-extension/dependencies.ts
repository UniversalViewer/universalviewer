define(function() {
    return function(formats: string[]) {
        return {
            sync: ['ionic.proxy', 'three.min', 'aframe-master.min', 'OrbitControls', 'ami.min', 'aleph.proxy'],
            async: ['MetadataComponent']
        };
    }
});