define(function () {
    return function (formats) {
        return {
            sync: ['ionic.proxy', 'three.min', 'GLTFLoader', 'DRACOLoader', 'STLLoader', 'ami.min', 'amiviewer.proxy'],
            async: ['MetadataComponent']
        };
    };
});
