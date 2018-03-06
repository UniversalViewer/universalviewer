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

// uv.js
// - things in src/lib that are generic to all extensions
// - bundled data providers
// - UVComponent
requirejs([
    './lib/base64.min.js',
    './lib/browserdetect.js',
    './lib/detectmobilebrowser.js',
    './lib/jquery.xdomainrequest.js',
    './lib/modernizr.js',
    './lib/sanitize.js',
    './lib/ex.es3.min.js',
    './lib/base-component.js',
    './lib/key-codes.js',
    './lib/http-status-codes.js',
    './lib/jquery-plugins.js',
    './lib/ba-tiny-pubsub.js',
    './lib/manifesto.js',
    './lib/manifold.js',
    './lib/utils.js',
    'URLDataProvider',
    'UVComponent'
], (
    base64: any,
    browserdetect: any,
    detectmobilebrowser: any,
    xdomainrequest: any,
    modernizr: any,
    sanitize: any,
    exjs: any,
    basecomponent: any,
    keycodes: any,
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
    window.dispatchEvent(new CustomEvent('uvLoaded'));
});
