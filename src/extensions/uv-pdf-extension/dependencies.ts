define(function() {
    return function(formats: string[]) {
        return {
            async: ['!pdfjs-dist/build/pdf.combined', 'MetadataComponent']
        };
    }
});
