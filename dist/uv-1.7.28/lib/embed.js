// uv-1.7.27

//https://raw.githubusercontent.com/jfriend00/docReady/master/docready.js
(function(funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);

docReady(function() {
    (function (window, document, version, callback) {

        // only run this script once per page.
        if (window.embedScriptIncluded) return;

        window.embedScriptIncluded = true;

        // get the script location.
        var s = document.getElementById('embedUV');

        if (!s){
            var scripts = document.getElementsByTagName('script');
            s = scripts[scripts.length - 1];
        }

        var scriptUri = (/.*src="(.*)"/).exec(s.outerHTML)[1];
        var absScriptUri = s.src;

        var j, d;
        var loaded = false;

        function isPositiveInteger(x) {
            // http://stackoverflow.com/a/1019526/11236
            return /^\d+$/.test(x);
        }

        /**
         * Compare two software version numbers (e.g. 1.7.1)
         * Returns:
         *
         *  0 if they're identical
         *  negative if v1 < v2
         *  positive if v1 > v2
         *  Nan if they in the wrong format
         *
         *  E.g.:
         *
         *  assert(version_number_compare("1.7.1", "1.6.10") > 0);
         *  assert(version_number_compare("1.7.1", "1.7.10") < 0);
         *
         *  "Unit tests": http://jsfiddle.net/ripper234/Xv9WL/28/
         *
         *  Taken from http://stackoverflow.com/a/6832721/11236
         */
        function compareVersionNumbers(v1, v2){
            var v1parts = v1.split('.');
            var v2parts = v2.split('.');

            // First, validate both numbers are true version numbers
            function validateParts(parts) {
                for (var i = 0; i < parts.length; ++i) {
                    if (!isPositiveInteger(parts[i])) {
                        return false;
                    }
                }
                return true;
            }
            if (!validateParts(v1parts) || !validateParts(v2parts)) {
                return NaN;
            }

            for (var i = 0; i < v1parts.length; ++i) {
                if (v2parts.length === i) {
                    return 1;
                }

                if (v1parts[i] === v2parts[i]) {
                    continue;
                }
                if (v1parts[i] > v2parts[i]) {
                    return 1;
                }
                return -1;
            }

            if (v1parts.length != v2parts.length) {
                return -1;
            }

            return 0;
        }

        // only load jQuery if not already included in page.
        if (!(j = window.jQuery) || compareVersionNumbers(version, j.fn.jquery) || callback(j, scriptUri, absScriptUri, loaded)) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "//cdnjs.cloudflare.com/ajax/libs/jquery/" + version + "/jquery.min.js";
            script.onload = script.onreadystatechange = function () {
                if (!loaded && (!(d = this.readyState) || d === "loaded" || d === "complete")) {
                    callback((j = window.jQuery).noConflict(1), scriptUri, absScriptUri, loaded = true);
                    j(script).remove();
                }
            };
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    })(window, document, "1.10.2", function ($, scriptUri, absScriptUri, jqueryLoaded) {

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

        // get the part preceding 'lib/embed.js'
        var baseUri = (/(.*)lib\/embed.js/).exec(scriptUri)[1];
        appUri = baseUri + 'app.html';
        easyXDMUri = 'https://cdnjs.cloudflare.com/ajax/libs/easyXDM/2.4.17.1/easyXDM.min.js';
        json2Uri = 'https://cdnjs.cloudflare.com/ajax/libs/easyXDM/2.4.17.1/json2.min.js';

        var a = document.createElement('a');
        a.href = absScriptUri;
        var domain = a.hostname;
        window.isHomeDomain = document.domain === domain;

        $.when($.getScript(easyXDMUri),
               $.getScript(json2Uri)).done(function () {
                   initPlayers($('.uv').not('[data-no-load*=true]'));
               });

        // find all players on a page and initialise them
        window.initPlayers = function($players){
            var isOnlyInstance = $players.length === 1;

            for (var i = 0; i < $players.length; i++) {
                app($players[i], isHomeDomain, isOnlyInstance);
            }
        }

        function app(element, isHomeDomain, isOnlyInstance) {
            var socket, $app, $img, $appFrame, manifestUri, collectionIndex, manifestIndex, sequenceIndex, canvasIndex, defaultToFullScreen, isLightbox, zoom, rotation, config, jsonp, locale, isFullScreen, dimensions, top, left, lastScroll, reload;

            $app = $(element);

            // Default to fullscreen
            defaultToFullScreen = $app.attr('data-fullscreen') === 'true';

            // Lightbox behaviour
            isLightbox = $app.attr('data-lightbox') === 'true';

            if(isLightbox){
                $img = $app.find('img');
                $img.css('cursor', 'pointer');
                // add overflow:hidden style to container div.
                $app.css('overflow', 'hidden');
            } else {
                // empty the container of any 'no javascript' messages.
                $app.empty();
            }

            // get initial params from the container's 'data-' attributes.
            manifestUri = $app.attr('data-uri') || "";
            manifestUri = encodeURIComponent(manifestUri);
            collectionIndex = $app.attr('data-collectionindex');
            manifestIndex = $app.attr('data-manifestindex');
            sequenceIndex = $app.attr('data-sequenceindex');
            canvasIndex = $app.attr('data-canvasindex');
            zoom = $app.attr('data-zoom');
            rotation = $app.attr('data-rotation');
            config = $app.attr('data-config');
            jsonp = $app.attr('data-jsonp');
            locale = $app.attr('data-locale') || "en-GB"; // todo: this should be defaulted in bootstrapper

            isFullScreen = false;
            var offset = $app.offset();
            top = offset.top;
            left = offset.left;

            $(window).resize(function () {
                resize();
            });

            window.onorientationchange = function () {
                resize();
            };

            // if exiting full screen
            $(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function (e) {
                if (e.type === 'webkitfullscreenchange' && !document.webkitIsFullScreen ||
                e.type === 'mozfullscreenchange' && !document.mozFullScreen ||
                e.type === 'MSFullscreenChange' && document.msFullscreenElement === null) {
                    triggerSocket('uv.onParentExitFullScreen');
                }
            });

            createSocket();

            function resize() {
                if (!$appFrame) return;

                if (isFullScreen) {
                    var offset = getOffset();

                    $appFrame.css({
                        'top': offset.top,
                        'left': offset.left
                    });

                    var viewport = getViewport();

                    $appFrame.width(viewport.width);
                    $appFrame.height(viewport.height);
                } else {
                    $appFrame.width($app.width());
                    $appFrame.height($app.height());
                }
            }

            function redirect(uri) {
                // store current location in cookie.
                createCookie('uvredirect', window.location.href);
                window.location.replace(uri);
            }

            function refresh() {
                window.location.reload();
            }

            function triggerSocket(eventName, eventObject) {
                socket.postMessage(JSON.stringify({ eventName: eventName, eventObject: eventObject }));
            }

            function getDimensions() {
                return {
                    width: $app[0].style.width,
                    height: $app[0].style.height
                }
            }

            function toggleFullScreen(obj) {
                isFullScreen = obj.isFullScreen;

                if (obj.overrideFullScreen){
                    return;
                }

                var elem = $app[0];

                if (isFullScreen) {

                    var requestFullScreen = getRequestFullScreen(elem);

                    // if requestFullScreen is available
                    if (requestFullScreen){
                        dimensions = getDimensions();

                        requestFullScreen.call(elem);
                        $app.css("width", "");
                        $app.css("height", "");
                    } else {
                        // use css

                        // store current scroll position.
                        lastScroll = $(document).scrollTop();

                        $("html").css("overflow", "hidden");
                        window.scrollTo(0, 0);

                        var offset = getOffset();

                        // todo: prevent parent from having overflow:hidden?

                        $appFrame.css({
                            'position': 'absolute',
                            'z-index': 9999,
                            'top': offset.top,
                            'left': offset.left
                        });
                    }

                } else {

                    var exitFullScreen = getExitFullScreen();

                    // if exitFullScreen is available
                    if (exitFullScreen) {
                        exitFullScreen.call(document);
                        $app.width(dimensions.width);
                        $app.height(dimensions.height);
                    } else {
                        // use css

                        $("html").css("overflow", "auto");

                        $appFrame.css({
                            'position': 'static',
                            'z-index': 'auto',
                            'height': $app.height(),
                            'width': '100%',
                            'top': top,
                            'left': left
                        });

                        // return to last scroll position.
                        window.scrollTo(0, lastScroll);

                        // if lightbox, hide iframe.
                        if (isLightbox) hideLightbox();
                    }
                }

                resize();
            }

            function getRequestFullScreen(elem) {

                if (!isHomeDomain) return false;

                if (elem.requestFullscreen) {
                    return elem.requestFullscreen;
                } else if (elem.msRequestFullscreen) {
                    return elem.msRequestFullscreen;
                } else if (elem.mozRequestFullScreen) {
                    return elem.mozRequestFullScreen;
                } else if (elem.webkitRequestFullscreen) {
                    return elem.webkitRequestFullscreen;
                }
                return false;
            }

            function getExitFullScreen() {

                if (!isHomeDomain) return false;

                if (document.exitFullscreen) {
                    return document.exitFullscreen;
                } else if (document.msExitFullscreen) {
                    return document.msExitFullscreen;
                } else if (document.mozCancelFullScreen) {
                    return document.mozCancelFullScreen;
                } else if (document.webkitExitFullscreen) {
                    return document.webkitExitFullscreen;
                }
                return false;
            }

            function getOffset() {

                var offset = {
                    top: 0,
                    left: 0
                };

                // if $app has an offsetParent that isn't the root
                var $offsetParent = $app.offsetParent();

                if (!$offsetParent.is(':root') &&
                    !$offsetParent.is('body')){
                    offset.top = ($app.offset().top * -1) + $app.position().top;
                    offset.left = ($app.offset().left * -1) + $app.position().left;
                }

                return offset;
            }

            function getViewport() {

                var viewPortWidth;
                var viewPortHeight;

                // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
                if (typeof window.innerWidth != 'undefined') {
                    viewPortWidth = window.innerWidth;
                    viewPortHeight = window.innerHeight;
                }
                // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
                else if (typeof document.documentElement != 'undefined'
                    && typeof document.documentElement.clientWidth !=
                    'undefined' && document.documentElement.clientWidth != 0) {
                    viewPortWidth = document.documentElement.clientWidth;
                    viewPortHeight = document.documentElement.clientHeight;
                }
                // older versions of IE
                else {
                    viewPortWidth = document.getElementsByTagName('body')[0].clientWidth;
                    viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
                }
                return {width: viewPortWidth, height: viewPortHeight};
            }

            function showLightbox(){
                $img.hide();
                $appFrame.show();
                triggerSocket('uv.onToggleFullScreen');
            }

            function hideLightbox(){
                $appFrame.hide();
                $img.show();
            }

            function createSocket() {

                var uri = appUri +
                    "?isHomeDomain=" + isHomeDomain +
                    "&isOnlyInstance=" + isOnlyInstance +
                    "&manifestUri=" + manifestUri +
                    "&embedScriptUri=" + absScriptUri +
                    "&embedDomain=" + document.domain +
                    "&domain=" + domain +
                    "&isLightbox=" + isLightbox +
                    "&locale=" + locale;

                if (reload) uri += "&reload=true";
                if (config) uri += "&config=" + config;
                if (jsonp) uri += "&jsonp=" + jsonp;

                // these are values that getParam can either retrieve from the iframe querystring or parent document hash params
                if (collectionIndex) uri += "&c=" + collectionIndex;
                if (manifestIndex) uri += "&m=" + manifestIndex;
                if (sequenceIndex) uri += "&s=" + sequenceIndex;
                if (canvasIndex) uri += "&cv=" + canvasIndex;
                if (zoom) uri += "&z=" + zoom;
                if (rotation) uri += "&r=" + rotation;

                socket = new easyXDM.Socket({
                    remote: uri,
                    container: $app.get(0),
                    props: { style: { width: "100%", height: $app.height() + "px" }, scrolling: "no" },
                    onReady: function () {
                        $appFrame = $app.find('iframe');
                        if (defaultToFullScreen) {
                            toggleFullScreen({
                                isFullScreen: true
                            });
                            triggerSocket('uv.onToggleFullScreen');
                        }
                        if (isLightbox) {
                            $img.on('click', function(e){
                                e.preventDefault();
                                showLightbox();
                            });
                            $appFrame.hide();
                        }
                    },
                    onMessage: function (message, origin) {
                        message = $.parseJSON(message);

                        try{
                            jQuery(document).trigger(message.eventName, [message.eventObject]);
                        } catch(e) {
                            // do nothing
                        }

                        switch (message.eventName) {
                            case "uv.onToggleFullScreen":
                                toggleFullScreen(message.eventObject);
                                break;
                            case "uv.onSequenceIndexChanged":
                                viewSequence(message.eventObject);
                                break;
                            case "uv.onRedirect":
                                redirect(message.eventObject);
                                break;
                            case "uv.onRefresh":
                                refresh();
                                break;
                            case "uv.onTrackEvent":
                                if ("undefined" !== typeof (trackEvent)) {
                                    trackEvent(message.eventObject.category, message.eventObject.action, message.eventObject.label, message.eventObject.value);
                                }
                                break;
                            case "uv.onTrackVariable":
                                if ("undefined" !== typeof (trackVariable)) {
                                    trackVariable(message.eventObject.slot, message.eventObject.name, message.eventObject.value, message.eventObject.scope);
                                }
                                break;
                        }
                    }
                });
            }
        }
    });
});