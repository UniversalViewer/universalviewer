
var paths = {
        'pdfobject': './js/pdfobject',
        'pdf': './js/pdf.min',
        'pdfworker': './js/pdfworker.min',
        'compatibility': './js/compatibility'
    };

require.config({
    paths: paths,
    shim: {
        pdf: {
            deps: ['pdfworker', 'compatibility']
        }
    }
});

return paths;

export class Dependencies{}
