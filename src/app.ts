// if (typeof jQuery === "function") {
//     define('jquery', [], function() {
//         return jQuery;
//     });
// }

// require([
//     'Bootstrapper',
//     'extensions/uv-mediaelement-extension/Extension',
//     'extensions/uv-pdf-extension/Extension',
//     'extensions/uv-seadragon-extension/Extension',
//     'extensions/uv-virtex-extension/Extension'
// ], (
//     bootstrapper,
//     mediaelementExtension,
//     pdfExtension,
//     seadragonExtension,
//     virtexExtension
// ) => {

//     // todo: use a compiler flag (when available)
//     window.DEBUG = true; // this line is removed on build.

//     var extensions = {};

//     extensions[manifesto.ElementType.canvas().toString()] = {
//         type: seadragonExtension,
//         name: 'uv-seadragon-extension'
//     };

//     extensions[manifesto.ElementType.movingimage().toString()] = {
//         type: mediaelementExtension,
//         name: 'uv-mediaelement-extension'
//     };

//     extensions[manifesto.ElementType.physicalobject().toString()] = {
//         type: virtexExtension,
//         name: 'uv-virtex-extension'
//     };

//     extensions[manifesto.ElementType.sound().toString()] = {
//         type: mediaelementExtension,
//         name: 'uv-mediaelement-extension'
//     };

//     extensions[manifesto.RenderingFormat.pdf().toString()] = {
//         type: pdfExtension,
//         name: 'uv-pdf-extension'
//     };

//     var bs = new bootstrapper.default(extensions);

//     bs.bootstrap();
// });

if (typeof jQuery === "function") {
    define('jquery', [], function() {
        return jQuery;
    });
}

var uvReady = new Event('uvReady');

require([
    'UV'
], (
    UV
) => {
    if (!window.UV) {
        window.UV = UV.default;
        window.dispatchEvent(uvReady);
    } 
});
