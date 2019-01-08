define(function () {
    return function (formats) {
        return {
            sync: ['dat.gui.min', 'three.min', 'ami.min', 'amiviewer.proxy'],
            async: ['MetadataComponent']
        };
    };
});
