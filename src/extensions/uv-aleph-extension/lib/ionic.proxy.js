(function() {
    var t = document.createElement('script');
    t.type = 'text/javascript';
    // if in an iframe (embedded) 
    t.src = (window.self !== window.top)? 'lib/ionic.js' : 'uv/lib/ionic.js';
    document.body.appendChild(t);
})();