define(function() {
    return function(formats: string[]) {
        return {
            async: ['TreeComponent', 'GalleryComponent', 'MetadataComponent', 'openseadragon.min']
            //async: ['TreeComponent', 'iiifgallery.proxy', 'GalleryComponent', 'MetadataComponent', 'openseadragon.min']
        };
    }
});