define(function() {
    return function(format) {
        return {
            async: ['!pdfjs-dist/build/pdf.combined', 'iiif-metadata-component']
        };
    }
});
