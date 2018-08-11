define(function () {
    function isSafari() {
        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        return isSafari;
    }
    function isAdaptiveStreamingAvailable() {
        var isAvailable = !!(window.MediaSource || window.WebKitMediaSource);
        return isAvailable;
    }
    function isFormatAvailable(formats, format) {
        var isAvailable = formats.includes(format);
        return isAvailable;
    }
    function isHLSAvailable(formats) {
        return isFormatAvailable(formats, 'application/vnd.apple.mpegurl');
    }
    function isMpegDashAvailable(formats) {
        return isFormatAvailable(formats, 'application/dash+xml');
    }
    return function (formats) {
        var alwaysRequired = ['iiif-tree-component', 'iiif-av-component', 'iiif-metadata-component', 'jquery-ui.min', 'jquery.ui.touch-punch.min', 'waveform-data'];
        if (isAdaptiveStreamingAvailable()) {
            if (isMpegDashAvailable(formats) && !isSafari()) {
                return {
                    sync: alwaysRequired.push('dash.all.min')
                };
            }
            else if (isHLSAvailable(formats)) {
                return {
                    sync: alwaysRequired.push('hls.min')
                };
            }
            else {
                return {
                    sync: alwaysRequired
                };
            }
        }
        else {
            return {
                sync: alwaysRequired
            };
        }
    };
});
