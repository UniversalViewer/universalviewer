// demonstrates how to load a stencil component via a proxy script
// https://github.com/ionic-team/stencil/issues/365
// *.proxy.js files are ignored when cleaning lib folders
(function() {
    var t = document.createElement('script');
    t.type = 'text/javascript';
    // if in an iframe (embedded) 
    t.src = (window.self !== window.top)? 'lib/amiviewer.js' : 'uv/lib/amiviewer.js';
    document.body.appendChild(t);
})();