define(function () {
    function isSafari() {
        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        console.log('isSafari', isSafari);
        return isSafari;
    }
    function isAdaptiveStreamingAvailable() {
        var isAvailable = !!(window.MediaSource || window.WebKitMediaSource);
        console.log('isAdaptiveStreamingAvailable', isAvailable);
        return isAvailable;
    }
    function isFormatAvailable(formats, format) {
        var isAvailable = formats.includes(format);
        console.log('isFormatAvailable', format, isAvailable);
        return isAvailable;
    }
    function isHLSAvailable(formats) {
        return isFormatAvailable(formats, 'application/vnd.apple.mpegurl');
    }
    function isMpegDashAvailable(formats) {
        return isFormatAvailable(formats, 'application/dash+xml');
    }
    return function (formats) {
        var alwaysRequired = ['iiif-tree-component', 'iiif-av-component', 'iiif-metadata-component', 'jquery-ui.min'];
        if (isAdaptiveStreamingAvailable()) {
            if (isMpegDashAvailable(formats) && !isSafari()) {
                console.log('load mpeg dash');
                return {
                    async: ['dash.all.min'].concat(alwaysRequired)
                };
            }
            else if (isHLSAvailable(formats)) {
                console.log('load HLS');
                return {
                    sync: ['hls.min'],
                    async: alwaysRequired
                };
            }
            else {
                console.log('adaptive streaming not available');
                return {
                    async: alwaysRequired
                };
            }
        }
        else {
            console.log('adaptive streaming not available');
            return {
                async: alwaysRequired
            };
        }
    };
});
