
var paths = {
        'pdfobject': './js/pdfobject',
        'pdf': './js/pdf',
        'pdfworker': './js/pdfworker',
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
