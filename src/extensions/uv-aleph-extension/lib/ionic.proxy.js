(function() {
    var t = document.createElement("script");
    t.type = "module";
    // if in an iframe (embedded) 
    t.src = (window.self !== window.top)? "lib/ionic/ionic.esm.js" : "uv/lib/ionic/ionic.esm.js";
    document.body.appendChild(t);

    var t = document.createElement("script");
    // if in an iframe (embedded) 
    t.src = (window.self !== window.top)? "lib/ionic/ionic.js" : "uv/lib/ionic/ionic.js";
    document.body.appendChild(t);
})();