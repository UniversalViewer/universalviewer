define(function() {
    return function(format) {
        return {
            sync: ['hls.min'],
            async: ['dash.all.min', 'iiif-tree-component', 'iiif-av-component', 'iiif-metadata-component', 'jquery-ui.min']
        };
    }
});