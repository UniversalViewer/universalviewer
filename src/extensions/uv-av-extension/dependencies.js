<<<<<<< HEAD
define(function () {
    // https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/Live_streaming_web_audio_and_video
    // Dash is supported everywhere except safari
    function isSafari() {
        // https://stackoverflow.com/questions/7944460/detect-safari-browser?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        //console.log('isSafari', isSafari);
        return isSafari;
    }
    function isAdaptiveStreamingAvailable() {
        var isAvailable = !!(window.MediaSource || window.WebKitMediaSource);
        //console.log('isAdaptiveStreamingAvailable', isAvailable);
        return isAvailable;
    }
    function isFormatAvailable(formats, format) {
        var isAvailable = formats.includes(format);
        //console.log('isFormatAvailable', format, isAvailable);
        return isAvailable;
    }
    function isHLSAvailable(formats) {
        return isFormatAvailable(formats, 'application/vnd.apple.mpegurl');
    }
    function isMpegDashAvailable(formats) {
        return isFormatAvailable(formats, 'application/dash+xml');
    }
    return function (formats) {
        var alwaysRequired = ['iiif-tree-component', 'iiif-av-component', 'iiif-metadata-component', 'jquery-ui.min', 'jquery.ui.touch-punch.min', 'jquery.binarytransport', 'waveform-data'];
        if (isAdaptiveStreamingAvailable()) {
            if (isMpegDashAvailable(formats) && !isSafari()) {
                //console.log('load mpeg dash');
                return {
                    sync: alwaysRequired.concat(['dash.all.min']) // ['dash.all.min'].concat(alwaysRequired)
                };
            }
            else if (isHLSAvailable(formats)) {
                //console.log('load HLS');
                return {
                    sync: alwaysRequired.concat(['hls.min']) // ['hls.min'].concat(alwaysRequired)
                };
            }
            else {
                //console.log('adaptive streaming not available');
                return {
                    sync: alwaysRequired
                };
            }
        }
        else {
            //console.log('adaptive streaming not available');
            return {
                sync: alwaysRequired
            };
        }
    };
});
//# sourceMappingURL=dependencies.js.map
=======
define(function () {
    function isFormatAvailable(formats, format) {
        var isAvailable = formats.includes(format);
        console.log('isFormatAvailable', format, isAvailable);
        return isAvailable;
    }
    function isHLSFormatAvailable(formats) {
        return isFormatAvailable(formats, 'application/vnd.apple.mpegurl') || isFormatAvailable(formats, 'vnd.apple.mpegurl');
    }
    function isMpegDashFormatAvailable(formats) {
        return isFormatAvailable(formats, 'application/dash+xml');
    }
    function canPlayHls() {
        var doc = typeof document === 'object' && document, videoelem = doc && doc.createElement('video'), isvideosupport = Boolean(videoelem && videoelem.canPlayType), canPlay = [
            'application/vnd.apple.mpegurl',
            'audio/mpegurl',
            'audio/x-mpegurl',
            'application/x-mpegurl',
            'video/x-mpegurl',
            'video/mpegurl',
            'application/mpegurl'
        ];
        return isvideosupport && canPlay.some(function (canItPlay) {
            return /maybe|probably/i.test(videoelem.canPlayType(canItPlay));
        });
    }
    return function (formats) {
        var alwaysRequired = ['iiif-tree-component', 'iiif-av-component', 'iiif-metadata-component', 'jquery-ui.min', 'jquery.ui.touch-punch.min', 'jquery.binarytransport', 'waveform-data'];
        if (isHLSFormatAvailable(formats) && canPlayHls()) {
            console.log('load HLS');
            return {
                sync: alwaysRequired.concat(['hls.min'])
            };
        }
        else if (isMpegDashFormatAvailable(formats)) {
            console.log('load mpeg dash');
            return {
                sync: alwaysRequired.concat(['dash.all.min'])
            };
        }
        else {
            console.log('adaptive streaming not available');
            return {
                sync: alwaysRequired
            };
        }
    };
});
>>>>>>> bl
