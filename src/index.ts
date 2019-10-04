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

// bundled into dist/uv.js
// - things in src/lib that are generic to all extensions
// - bundled data providers
// - UVComponent
requirejs([
    ,
    'URLDataProvider',
    'UVComponent'
], (
    base64: any,
    browserdetect: any,
    detectmobilebrowser: any,
    xdomainrequest: any,
    modernizr: any,
    basecomponent: any,
    jqueryplugins: any,
    sanitize: any,
    URLDataProvider: any,
    UVComponent: any
) => {
    window.UV = UVComponent.default;
    window.UV.URLDataProvider = URLDataProvider.default;
    window.dispatchEvent(new CustomEvent('uvLoaded', {}));
});
