define(function () {
    return function (formats) {
        return {
            sync: ['aframe-master.min', 'OrbitControls', 'ami.min', 'aleph.proxy'],
            async: ['MetadataComponent']
        };
    };
});
