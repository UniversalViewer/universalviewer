define(function () {
    return function (formats) {
        return {
            async: ['TreeComponent', 'GalleryComponent', 'MetadataComponent', 'openseadragon.min']
            //async: ['TreeComponent', 'iiifgallery.proxy', 'GalleryComponent', 'MetadataComponent', 'openseadragon.min']
        };
    };
});
