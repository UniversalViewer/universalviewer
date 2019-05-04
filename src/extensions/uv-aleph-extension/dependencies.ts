define(function() {
    return function(formats: string[]) {
        return {
            sync: ['ionic.proxy', 'aframe-master.min', 'OrbitControls', 'ami.min', 'aleph.proxy'],
            async: ['MetadataComponent']
        };
    }
});