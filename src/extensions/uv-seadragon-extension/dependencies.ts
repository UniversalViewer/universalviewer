define(function() {
    return function(formats: string[]) {
        return {
            async: ['TreeComponent', 'iiifgallery.proxy', 'GalleryComponent', 'MetadataComponent', 'openseadragon.min']
        };
    }
});
