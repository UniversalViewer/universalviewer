if (typeof jQuery === "function") {
    // @ts-ignore
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

// @ts-ignore
define('@iiif/manifold', ['require', '../lib/manifold.js', 'manifold'], (require, m) => {
    const manifold = require('manifold');
    // @ts-ignore
    window.Manifold = manifold;
    return manifold;
})
// @ts-ignore
define('manifesto.js', ['require', './lib/manifesto.js', 'manifesto'], (require, m) => {
    const manifesto = require('manifesto');
    // @ts-ignore
    window.Manifesto = manifesto;
    // @ts-ignore
    window.manifesto = manifesto;
    return manifesto;
})
// @ts-ignore
define('@iiif/vocabulary', ['require', '../lib/vocabulary.js', 'vocabulary'], (require, m) => {
    return require('vocabulary');
})

// @ts-ignore
define('@iiif/iiif-metadata-component', ['require', '../lib/IIIFMetadataComponent.js', 'IIIFMetadataComponent'], (require, m) => {
    return require('IIIFMetadataComponent');
})

// @ts-ignore
define('@iiif/iiif-gallery-component', ['require', '../lib/GalleryComponent.js'], (require, m) => {
    return m;
})

// bundled into dist/uv.js
// - things in src/lib that are generic to all extensions
// - bundled data providers
// - UVComponent
// @ts-ignore
requirejs([
    './lib/base64.min.js',
    './lib/browserdetect.js',
    './lib/detectmobilebrowser.js',
    './lib/jquery.xdomainrequest.js',
    './lib/modernizr.js',
    './lib/ex.es3.min.js',
    './lib/BaseComponent.js',
    './lib/KeyCodes.js',
    './lib/HTTPStatusCode.js',
    './lib/jquery-plugins.js',
    './lib/ba-tiny-pubsub.js',
    'manifesto.js',
    '@iiif/manifold',
    './lib/Utils.js',
    './lib/xss.min.js',
    './lib/fetch.umd.js',
    'URLDataProvider',
    'UVComponent',
    // Extra dependencies.
    '@iiif/iiif-metadata-component',
    '@iiif/iiif-gallery-component',
    '@iiif/vocabulary',
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
    fetch: any,
    URLDataProvider: any,
    UVComponent: any
) => {
    window.UV = UVComponent.default;
    window.UV.URLDataProvider = URLDataProvider.default;
    window.dispatchEvent(new CustomEvent('uvLoaded', {}));
});
