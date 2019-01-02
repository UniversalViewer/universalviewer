define(function () {
    return function (formats) {
        return {
            async: ['MetadataComponent'],
            sync: ['webcomponents-bundle', 'my-el']
        };
    };
});
