// demonstrates how to load a stencil component via a proxy script
// https://github.com/ionic-team/stencil/issues/365
// *.proxy.js files are ignored when cleaning lib folders
// <script type="module" src="http://localhost:8002/examples/uv/lib/aleph/aleph.esm.js"></script>
// <script nomodule="" src="http://localhost:8002/examples/uv/lib/aleph/aleph.js"></script>
(function() {
    var t = document.createElement("script");
    t.type = "module";
    // if in an iframe (embedded) 
    t.src = (window.self !== window.top)? "lib/aleph/aleph.esm.js" : "uv/lib/aleph/aleph.esm.js";
    document.body.appendChild(t);

    var t = document.createElement("script");
    // if in an iframe (embedded) 
    t.src = (window.self !== window.top)? "lib/aleph/aleph.js" : "uv/lib/aleph/aleph.js";
    document.body.appendChild(t);
})();