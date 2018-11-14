define(function () {
    function isFormatAvailable(formats, format) {
        var isAvailable = formats.includes(format);
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
        var alwaysRequired = ['TreeComponent', 'AVComponent', 'MetadataComponent', 'jquery-ui.min', 'jquery.ui.touch-punch.min', 'jquery.binarytransport', 'waveform-data'];
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
