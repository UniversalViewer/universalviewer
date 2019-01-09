define(function () {
    return function (formats) {
        return {
            sync: ['three.min', 'ami.min', 'amiviewer.proxy'],
            async: ['MetadataComponent']
        };
    };
});
