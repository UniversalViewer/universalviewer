// https://github.com/ionic-team/stencil/issues/365
// *.proxy.js files are ignored when cleaning lib folders

(function() {
    var t = document.createElement("script");
    // if in an iframe (embedded) 
    t.src = (window.self !== window.top)? "lib/uv-ebook-components.js" : "uv/lib/uv-ebook-components.js";
    document.body.appendChild(t);
})();