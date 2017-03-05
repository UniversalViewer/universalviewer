if (typeof jQuery === "function") {
    define('jquery', [], function() {
        return jQuery;
    });
}

// IE CustomEvent Polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {

    if ( typeof window.CustomEvent === "function" ) return false;

    function CustomEvent ( event: any, params: any ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
    return;
})();

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
    'URLDataProvider',
    'UVComponent'
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
    URLDataProvider: any,
    UVComponent: any
) => {
    window.UV = UVComponent.default;
    window.UV.URLDataProvider = URLDataProvider.default;
    window.dispatchEvent(new CustomEvent('uvReady'));
});
