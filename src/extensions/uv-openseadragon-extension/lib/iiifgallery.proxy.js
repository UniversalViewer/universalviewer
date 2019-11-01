// demonstrates how to load a stencil component via a proxy script
// https://github.com/ionic-team/stencil/issues/365
// *.proxy.js files are ignored when cleaning lib folders
// (function() {
//     var t = document.createElement('script');
//     t.type = 'text/javascript';
//     t.src = 'uv/lib/iiifgallery.js';
//     document.body.appendChild(t);
// })();