
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
            var socket, $app, $img, $appFrame, dataUri, sequenceIndex, canvasIndex, isLightbox, dataBaseUri, zoom, config, jsonp, isFullScreen, height, top, left, lastScroll, reload;

            $app = $(element);

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
            dataBaseUri = $app.attr('data-baseuri');
            if (dataBaseUri) dataBaseUri = encodeURIComponent(dataBaseUri);
            dataUri = $app.attr('data-uri');
            dataUri = encodeURIComponent(dataUri);
            sequenceIndex = $app.attr('data-sequenceindex') || $app.attr('data-assetsequenceindex');
            canvasIndex = $app.attr('data-canvasindex') || $app.attr('data-assetindex');
            zoom = $app.attr('data-zoom');
            config = $app.attr('data-config');
            jsonp = $app.attr('data-jsonp');

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

            function toggleFullScreen(obj) {
                isFullScreen = obj.isFullScreen;

                if (obj.overrideFullScreen){
                    jQuery(document).trigger('onToggleFullScreen', [obj.isFullScreen]);
                    return;
                }

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

                    // if lightbox, hide iframe.
                    if (isLightbox) hideLightbox();
                }

                resize();
            }

            function viewSequence(index) {

                $appFrame.prop('src', '');
                $app.empty();

                sequenceIndex = index;
                reload = true;

                createSocket();

                if (isFullScreen){
                    triggerSocket('onToggleFullScreen');
                }
            }

            function showLightbox(){
                $img.hide();
                $appFrame.show();
                triggerSocket('onToggleFullScreen');
            }

            function hideLightbox(){
                $appFrame.hide();
                $img.show();
            }

            function createSocket() {

                var uri = appUri +
                    "?hd=" + isHomeDomain +
                    "&oi=" + isOnlyInstance +
                    "&du=" + dataUri +
                    "&esu=" + absScriptUri +
                    "&ed=" + document.domain +
                    "&d=" + domain +
                    "&lb=" + isLightbox;

                if (sequenceIndex) uri += "&asi=" + sequenceIndex;
                if (canvasIndex) uri += "&ai=" + canvasIndex;
                if (dataBaseUri) uri += "&dbu=" + dataBaseUri;
                if (zoom) uri += "&z=" + zoom;
                if (reload) uri += "&rl=true";
                if (config) uri += "&c=" + config;
                if (jsonp) uri += "&jsonp=" + jsonp;

                socket = new easyXDM.Socket({
                    remote: uri,
                    container: $app.get(0),
                    props: { style: { width: "100%", height: $app.height() + "px" }, scrolling: "no" },
                    onReady: function () {
                        $appFrame = $app.find('iframe');
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

                        switch (message.eventName) {
                            case "onToggleFullScreen":
                                toggleFullScreen(message.eventObject);
                                break;
                            case "onSequenceIndexChanged":
                                viewSequence(message.eventObject);
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
});