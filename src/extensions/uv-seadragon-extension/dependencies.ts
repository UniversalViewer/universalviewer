define(function() {
    return function(formats: string[]) {
        return {
            async: ['TreeComponent', 'GalleryComponent', 'IIIFMetadataComponent', 'openseadragon.min']
            //async: ['TreeComponent', 'iiifgallery.proxy', 'GalleryComponent', 'MetadataComponent', 'openseadragon.min']
        };
    }
});
