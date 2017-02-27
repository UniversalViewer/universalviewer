if (typeof jQuery === "function") {
    define('jquery', [], function() {
        return jQuery;
    });
}

var uvReady = new Event('uvReady');

requirejs([
    'UV'
], (
    UV: any
) => {
    if (!window.UV) {
        window.UV = UV.default;
        window.dispatchEvent(uvReady);
    } 
});
