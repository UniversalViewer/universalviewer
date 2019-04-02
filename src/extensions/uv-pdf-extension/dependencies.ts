define(function() {
    return function(formats: string[]) {
        return {
            sync: ['pdfobject'],
            async: ['!pdfjs-dist/build/pdf.combined', 'MetadataComponent']
        };
    }
});
