define(function() {

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

    function isFormatAvailable(formats: string[], format: string) {
        var isAvailable = formats.includes(format);
        //console.log('isFormatAvailable', format, isAvailable);
        return isAvailable;
    }

    function isHLSAvailable(formats: string[]) {
        return isFormatAvailable(formats, 'application/vnd.apple.mpegurl');
    }

    function isMpegDashAvailable(formats: string[]) {
        return isFormatAvailable(formats, 'application/dash+xml');
    }

    return function(formats: string[]) {

        var alwaysRequired = ['iiif-tree-component', 'iiif-av-component', 'iiif-metadata-component', 'jquery-ui.min', 'jquery.ui.touch-punch.min', 'waveform-data'];

        if (isAdaptiveStreamingAvailable()) {

            if (isMpegDashAvailable(formats) && !isSafari()) {
                //console.log('load mpeg dash');
                return {
                    sync: alwaysRequired.push('dash.all.min') // ['dash.all.min'].concat(alwaysRequired)
                };
            } else if (isHLSAvailable(formats)) {
                //console.log('load HLS');
                return {
                    sync: alwaysRequired.push('hls.min') // ['hls.min'].concat(alwaysRequired)
                };
            } else {
                //console.log('adaptive streaming not available');
                return {
                    sync: alwaysRequired
                };
            }

        } else {
            //console.log('adaptive streaming not available');
            return {
                sync: alwaysRequired
            };
        }        
    }
});