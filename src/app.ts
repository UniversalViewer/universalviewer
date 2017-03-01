if (typeof jQuery === "function") {
    define('jquery', [], function() {
        return jQuery;
    });
}

requirejs([
    './lib/base64.min.js',
    './lib/browserdetect.js',
    './lib/detectmobilebrowser.js',
    './lib/jquery.xdomainrequest.js',
    './lib/modernizr.js',
    './lib/sanitize.js',
    './lib/yepnope.css.js',
    './lib/ex.es3.min.js',
    './lib/base-component.js',
    './lib/key-codes.min.js',
    './lib/extensions.min.js',
    './lib/http-status-codes.min.js',
    './lib/jquery-plugins.min.js',
    './lib/ba-tiny-pubsub.min.js',
    './lib/manifesto.min.js',
    './lib/manifold.min.js',
    './lib/utils.min.js',
    'UV'
], (
    base64: any,
    browserdetect: any,
    detectmobilebrowser: any,
    xdomainrequest: any,
    modernizr: any,
    sanitize: any,
    yepnope: any,
    exjs: any,
    basecomponent: any,
    keycodes: any,
    extensions: any,
    httpstatuscodes: any,
    jqueryplugins: any,
    pubsub: any,
    manifesto: any,
    manifold: any,
    utils: any,
    UV: any
) => {
    window.UV = UV.default;
    var uvReady = new Event('uvReady');
    window.dispatchEvent(uvReady);
});
