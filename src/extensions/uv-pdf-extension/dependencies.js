define(function () {
    return function (formats) {
        return {
            sync: ['pdfobject'],
            async: ['!pdfjs-dist/build/pdf.combined', 'MetadataComponent']
        };
    };
});
