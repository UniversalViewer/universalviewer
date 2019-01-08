define(function() {
    return function(formats: string[]) {
        return {
            sync: ['three.min', 'ami.min', 'amiviewer.proxy'],
            async: ['MetadataComponent']
        };
    }
});