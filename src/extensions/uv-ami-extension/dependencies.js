define(function () {
    return function (formats) {
        return {
            sync: ['ionic.proxy', 'redux.min', 'three.min', 'STLLoader', 'ami.min', 'amiviewer.proxy'],
            async: ['MetadataComponent']
        };
    };
});
