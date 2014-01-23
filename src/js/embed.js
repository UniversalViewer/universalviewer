
(function (window, document, version, callback) {

    // only run this script once per page.
    if (window.embedScriptIncluded) return;

    window.embedScriptIncluded = true;

    // get the script location.
    var s = document.getElementById('embedWellcomePlayer');

    if (!s){
        var scripts = document.getElementsByTagName('script');
        s = scripts[scripts.length - 1];
    }

    var scriptUri = (/.*src="(.*)"/).exec(s.outerHTML)[1];
    var absScriptUri = s.src;

    var j, d;
    var loaded = false;

    // only load jQuery if not already included in page.
    if (!(j = window.jQuery) || version > j.fn.jquery || callback(j, scriptUri, absScriptUri, loaded)) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//ajax.googleapis.com/ajax/libs/jquery/" + version + "/jquery.min.js";
        script.onload = script.onreadystatechange = function () {
            if (!loaded && (!(d = this.readyState) || d === "loaded" || d === "complete")) {
                callback((j = window.jQuery).noConflict(1), scriptUri, absScriptUri, loaded = true);
                j(script).remove();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    }
})(window, document, "1.10.1", function ($, scriptUri, absScriptUri, jqueryLoaded) {

    $.support.cors = true;

    function createCookie(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    // get the part preceding 'js/embed.js'
    var baseUri = (/(.*)js\/embed.js/).exec(scriptUri)[1];
    appUri = baseUri + 'app.html';
    easyXDMUri = baseUri + 'js/easyXDM.min.js';
    json2Uri = baseUri + 'js/json2.min.js';

    var a = document.createElement('a');
    a.href = absScriptUri;
    var domain = a.hostname;

    $.when($.getScript(easyXDMUri),
           $.getScript(json2Uri)).done(function () {
               var apps = $('.wellcomePlayer');

               var isHomeDomain = document.domain === domain;
               var isOnlyInstance = apps.length === 1;

               for (var i = 0; i < apps.length; i++) {
                   app(apps[i], isHomeDomain, isOnlyInstance);
               }
           });

    function app(element, isHomeDomain, isOnlyInstance) {
        var socket, $app, $appFrame, dataUri, assetSequenceIndex, assetIndex, dataBaseUri, zoom, config, isFullScreen, height, top, left, lastScroll, reload;

        $app = $(element);

        // empty the container of any 'no javascript' messages.
        $app.empty();

        // get initial params from the container's 'data-' attributes.
        dataBaseUri = $app.attr('data-baseuri');
        if (dataBaseUri) dataBaseUri = encodeURIComponent(dataBaseUri);
        dataUri = $app.attr('data-uri');
        dataUri = encodeURIComponent(dataUri);
        assetSequenceIndex = $app.attr('data-assetsequenceindex');
        assetIndex = $app.attr('data-assetindex');
        zoom = $app.attr('data-zoom');
        config = $app.attr('data-config');

        isFullScreen = false;
        height = $app.height();
        var position = $app.position();
        top = position.top;
        left = position.left;

        $(window).resize(function () {
            resize();
        });

        window.onorientationchange = function () {
            resize();
        };

        createSocket();

        function resize() {
            if (!$appFrame) return;

            if (isFullScreen) {
                $appFrame.width($(this).width());
                $appFrame.height($(this).height());
            } else {
                $appFrame.width($app.width());
                $appFrame.height($app.height());
            }
        }

        function redirect(uri) {
            // store current location in cookie.
            createCookie('wlredirect', window.location.href);
            window.location.replace(uri);
        }

        function refresh() {
            window.location.reload();
        }

        function triggerSocket(eventName, eventObject) {
            socket.postMessage(JSON.stringify({ eventName: eventName, eventObject: eventObject }));
        }

        function toggleFullScreen(fs) {
            isFullScreen = fs;

            if (isFullScreen) {

                // store current scroll position.
                lastScroll = $(document).scrollTop();

                $("html").css("overflow", "hidden");
                window.scrollTo(0, 0);

                $appFrame.css({
                    'position': 'absolute',
                    'z-index': 9999,
                    'height': $(window).height(),
                    'width': $(window).width(),
                    'top': ($app[0].offsetParent.offsetTop * -1) || 0,
                    'left': ($app[0].offsetParent.offsetLeft * -1) || 0
                });
            } else {
                $("html").css("overflow", "auto");

                $appFrame.css({
                    'position': 'static',
                    'z-index': 'auto',
                    'height': height,
                    'width': '100%',
                    'top': top,
                    'left': left
                });

                // return to last scroll position.
                window.scrollTo(0, lastScroll);
            }

            resize();
        }

        function viewAssetSequence(index) {

            $appFrame.prop('src', '');
            $app.empty();

            assetSequenceIndex = index;
            reload = true;

            createSocket();
        }

        function createSocket() {

            var uri = appUri +
                "?hd=" + isHomeDomain +
                "&oi=" + isOnlyInstance +
                "&du=" + dataUri +
                "&esu=" + absScriptUri +
                "&d=" + domain;

            if (assetSequenceIndex) uri += "&asi=" + assetSequenceIndex;
            if (assetIndex) uri += "&ai=" + assetIndex;
            if (dataBaseUri) uri += "&dbu=" + dataBaseUri;
            if (zoom) uri += "&z=" + zoom;
            if (reload) uri += "&rl=true";
            if (config) uri += "&c=" + config;

            socket = new easyXDM.Socket({
                remote: uri,
                container: $app.get(0),
                props: { style: { width: "100%", height: $app.height() + "px" }, scrolling: "no" },
                onReady: function () {
                    $appFrame = $app.find('iframe');
                },
                onMessage: function (message, origin) {
                    message = $.parseJSON(message);

                    switch (message.eventName) {
                        case "onToggleFullScreen":
                            toggleFullScreen(message.eventObject);
                            break;
                        case "onAssetSequenceIndexChanged":
                            viewAssetSequence(message.eventObject);
                            break;
                        case "onRedirect":
                            redirect(message.eventObject);
                            break;
                        case "onRefresh":
                            refresh();
                            break;
                        case "onTrackEvent":
                            if ("undefined" !== typeof (trackEvent)) {
                                trackEvent(message.eventObject.category, message.eventObject.action, message.eventObject.label, message.eventObject.value);
                            }
                            break;
                        case "onTrackVariable":
                            if ("undefined" !== typeof (trackVariable)) {
                                trackVariable(message.eventObject.slot, message.eventObject.name, message.eventObject.value, message.eventObject.scope);
                            }
                            break;
                        default:
                            try{
                                jQuery(document).trigger(message.eventName, [message.eventObject]);
                            } catch(e) {
                                // do nothing
                            }
                            break;
                    }
                }
            });
        }
    }
});