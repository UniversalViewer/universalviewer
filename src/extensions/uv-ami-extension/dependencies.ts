define(function() {
    return function(formats: string[]) {
        return {
            async: ['MetadataComponent'],
            sync: ['amiviewer.proxy']
        };
    }
});