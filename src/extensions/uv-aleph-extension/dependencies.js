define(function () {
    return function (formats) {
        return {
            sync: ['ionic.proxy', 'aframe-master.min', 'OrbitControls', 'ami.min', 'aleph.proxy'],
            async: ['MetadataComponent']
        };
    };
});
