
(function (window, document, version, callback) {

    // only run this script once per page.
    if (window.embedScriptIncluded) return;

    window.embedScriptIncluded = true;

    // get the script location.
    var scripts = document.getElementsByTagName('script');
    var scriptUri;

    // loop backwards through the loaded scripts until you reach last one with a src.
    // fixes problem in IE when using an empty script with a comment to prevent wordpress wysiwyg editor script-stripping.
    for (var i = scripts.length - 1; i >= 0; i--) {
        var s = scripts[i];
        if (s.src) {
            scriptUri = s.src;
            break;
        }
    }

    var j, d;
    var loaded = false;

    // only load jQuery if not already included in page.
    if (!(j = window.jQuery) || version > j.fn.jquery || callback(j, scriptUri, loaded)) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//ajax.googleapis.com/ajax/libs/jquery/" + version + "/jquery.min.js";
        script.onload = script.onreadystatechange = function () {
            if (!loaded && (!(d = this.readyState) || d == "loaded" || d == "complete")) {
                callback((j = window.jQuery).noConflict(1), scriptUri, loaded = true);
                j(script).remove();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    }
})(window, document, "1.10.1", function ($, scriptUri, jqueryLoaded) {

    $.support.cors = true;

    var appUri = '{0}app.html';
    var easyXDMUri = '{0}js/easyXDM.min.js';
    var json2Uri = '{0}js/json2.min.js';

    String.format = function () {
        var s = arguments[0];
        for (var i = 0; i < arguments.length - 1; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }

        return s;
    };

    var a = document.createElement('a');
    a.href = scriptUri;
    var domain = a.hostname;

    if (window.embedBaseUri) {
        appUri = String.format(appUri, window.embedBaseUri);
        easyXDMUri = String.format(easyXDMUri, window.embedBaseUri);
        json2Uri = String.format(json2Uri, window.embedBaseUri);
    } else {
        var port = '';
        if (a.port && a.port != 80) port = ':' + a.port;

        appUri = String.format(appUri, 'http://' + domain + port + '/');
        easyXDMUri = String.format(easyXDMUri, '//' + domain + port + '/');
        json2Uri = String.format(json2Uri, '//' + domain + port + '/');
    }

    $.when($.getScript(easyXDMUri),
           $.getScript(json2Uri)).done(function () {
               var apps = $('.app');

               var isHomeDomain = document.domain === domain;
               var isOnlyInstance = apps.length === 1;

               for (var i = 0; i < apps.length; i++) {
                   app(apps[i], isHomeDomain, isOnlyInstance);
               }
           });

    function app(element, isHomeDomain, isOnlyInstance) {
        var socket, $app, $appFrame, dataUri, assetIndex, isFullScreen, height, top, left;

        $app = $(element);

        // empty the container of any 'no javascript' messages.
        $app.empty();

        // get initial params from the container's 'data-' attributes.
        dataUri = $app.attr('data-uri');
        dataUri = encodeURIComponent(dataUri);
        assetIndex = $app.attr('data-assetIndex');

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
                $("html").css("overflow", "hidden");
                window.scrollTo(0, 0);

                $appFrame.css({
                    'position': 'fixed',
                    'z-index': 9999,
                    'height': $(window).height(),
                    'width': $(window).width(),
                    'top': 0,
                    'left': 0
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
            }

            resize();
        }

        function createSocket() {

            var uri = appUri +
                "?isHomeDomain=" + isHomeDomain +
                "&isOnlyInstance=" + isOnlyInstance +
                "&dataUri=" + dataUri +
                "&embedScriptUri=" + scriptUri;

            if (assetIndex) {
                uri += "&assetIndex=" + assetIndex;
            }

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
                        case "onRedirect":
                            redirect(message.eventObject);
                            break;
                        case "onRefresh":
                            refresh();
                            break;
                        case "onTrackEvent":
                            //console.log(message.eventObject.category, message.eventObject.action, message.eventObject.label, message.eventObject.value, message.eventObject.noninteraction);
                            if ("undefined" !== typeof (_trackEvent)) {
                                _trackEvent(message.eventObject.category, message.eventObject.action, message.eventObject.label, message.eventObject.value, message.eventObject.noninteraction);
                            }
                            break;
                        default:
                            $(document).trigger(message.eventName, [message.eventObject]);
                            break;
                    }
                }
            });
        }
    }
});