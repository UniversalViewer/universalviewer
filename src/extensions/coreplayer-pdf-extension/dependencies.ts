
var paths = {
        'pdfobject': './js/pdfobject',
        'pdf': './js/pdf',
        'pdfworker': './js/pdf.worker',
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
