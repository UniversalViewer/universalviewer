define(function() {
    return function(formats: string[]) {
        return {
            sync: ['ionic.proxy', 'three.min', 'aframe-master', 'OrbitControls', 'ami.min', 'aleph.proxy'],
            //sync: ['ionic.proxy', 'aleph.proxy'],
            async: ['MetadataComponent']
        };
    }
});