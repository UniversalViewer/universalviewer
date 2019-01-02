define(function() {
    return function(formats: string[]) {
        return {
            async: ['MetadataComponent'],
            sync: ['webcomponents-bundle', 'my-el']
        };
    }
});