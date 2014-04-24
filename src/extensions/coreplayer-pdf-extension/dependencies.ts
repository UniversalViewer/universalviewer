
var paths = {
        //'pdfobject': './js/pdfobject',
        'viewer': './js/viewer',
        'pdf': './js/pdf',
        //'pdfworker': './js/pdfworker.min',
        'l10n': './js/l10n',
        'compatibility': './js/compatibility',
        'debugger': './js/debugger'
    };

require.config({
    paths: paths,
    shim: {
        viewer: {
            deps: ['pdf', 'compatibility', 'l10n']
        }
    }
});

return paths;

export class Dependencies{}
