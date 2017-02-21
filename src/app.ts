if (typeof jQuery === "function") {
    define('jquery', [], function() {
        return jQuery;
    });
}

var uvReady = new Event('uvReady');

require([
    'UV'
], (
    UV
) => {
    if (!window.UV) {
        window.UV = UV.default;
        window.dispatchEvent(uvReady);
    } 
});
