define(function() {
    return function(formats: string[]) {
        return {
            sync: ['aframe-master.min', 'OrbitControls', 'ami.min', 'aleph.proxy'],
            async: ['MetadataComponent']
        };
    }
});