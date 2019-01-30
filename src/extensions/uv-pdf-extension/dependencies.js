define(function () {
    return function (formats) {
        return {
            async: ['!pdfjs-dist/build/pdf.combined', 'MetadataComponent']
        };
    };
});
