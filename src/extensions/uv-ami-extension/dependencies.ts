define(function() {
    return function(formats: string[]) {
        return {
            sync: ['ionic.proxy', 'redux.min', 'three.min', 'STLLoader', 'ami.min', 'amiviewer.proxy'],
            async: ['MetadataComponent']
        };
    }
});