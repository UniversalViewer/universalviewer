
(function ($) {

    $.fn.absHeight = function (height) {

        return this.each(function () {

            var $self = $(this);

            console.log('margin-top: ' + $self.css('margin-top'));
            console.log('border-top: ' + $self.css('border-top'));
            console.log('padding-top: ' + $self.css('padding-top'));
        });

    };

    $.fn.watch = function (props, callback, timeout) {
        if (!timeout)
            timeout = 10;
        return this.each(function () {
            var el = $(this),
                func = function () { __check.call(this, el) },
                data = {
                    props: props.split(","),
                    func: callback,
                    vals: []
                };
            $.each(data.props, function (i) { data.vals[i] = el.css(data.props[i]); });
            el.data(data);
            if (typeof (this.onpropertychange) == "object") {
                el.bind("propertychange", callback);
            } else if ($.browser.mozilla) {
                el.bind("DOMAttrModified", callback);
            } else {
                setInterval(func, timeout);
            }
        });

        function __check(el) {
            var data = el.data(),
                changed = false,
                temp = "";
            for (var i = 0; i < data.props.length; i++) {
                temp = el.css(data.props[i]);
                if (data.vals[i] != temp) {
                    data.vals[i] = temp;
                    changed = true;
                    break;
                }
            }
            if (changed && data.func) {
                data.func.call(el, data);
            }
        }
    };

    $.fn.repeatButton = function (pauseMS, repeatMS, initialCallback, repeatCallback) {

        return this.each(function () {

            var $self = $(this);

            var intervalId;
            var timeoutId;

            $self.mousedown(function () {
                initialCallback();
                repeatCallback();
                timeoutId = setTimeout(startFunc, pauseMS);
            }).mouseup(function () {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
            }).mouseout(function () {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
            });

            function startFunc() {
                intervalId = setInterval(repeatCallback, repeatMS);
            }

        });

    };

    $.fn.swapClass = function (removeClass, addClass) {
        return this.each(function () {
            $(this).removeClass(removeClass).addClass(addClass);
        });
    };

    $.idleTimer = function (newTimeout, elem, opts) {

        // defaults that are to be stored as instance props on the elem

        opts = $.extend({
            startImmediately: true, //starts a timeout as soon as the timer is set up
            idle: false,         //indicates if the user is idle
            enabled: true,          //indicates if the idle timer is enabled
            timeout: 30000,         //the amount of time (ms) before the user is considered idle
            events: 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove' // activity is one of these events
        }, opts);


        elem = elem || document;

        /* (intentionally not documented)
        * Toggles the idle state and fires an appropriate event.
        * @return {void}
        */
        var toggleIdleState = function (myelem) {

            // curse you, mozilla setTimeout lateness bug!
            if (typeof myelem === 'number') {
                myelem = undefined;
            }

            var obj = $.data(myelem || elem, 'idleTimerObj');

            //toggle the state
            obj.idle = !obj.idle;

            // reset timeout 
            var elapsed = (+new Date()) - obj.olddate;
            obj.olddate = +new Date();

            // handle Chrome always triggering idle after js alert or comfirm popup
            if (obj.idle && (elapsed < opts.timeout)) {
                obj.idle = false;
                clearTimeout($.idleTimer.tId);
                if (opts.enabled)
                    $.idleTimer.tId = setTimeout(toggleIdleState, opts.timeout);
                return;
            }

            //fire appropriate event

            // create a custom event, but first, store the new state on the element
            // and then append that string to a namespace
            var event = jQuery.Event($.data(elem, 'idleTimer', obj.idle ? "idle" : "active") + '.idleTimer');

            // we do want this to bubble, at least as a temporary fix for jQuery 1.7
            // event.stopPropagation();
            $(elem).trigger(event);
        },

        /**
        * Stops the idle timer. This removes appropriate event handlers
        * and cancels any pending timeouts.
        * @return {void}
        * @method stop
        * @static
        */
        stop = function (elem) {

            var obj = $.data(elem, 'idleTimerObj') || {};

            //set to disabled
            obj.enabled = false;

            //clear any pending timeouts
            clearTimeout(obj.tId);

            //detach the event handlers
            $(elem).off('.idleTimer');
        },


        /* (intentionally not documented)
        * Handles a user event indicating that the user isn't idle.
        * @param {Event} event A DOM2-normalized event object.
        * @return {void}
        */
        handleUserEvent = function () {

            var obj = $.data(this, 'idleTimerObj');

            //clear any existing timeout
            clearTimeout(obj.tId);



            //if the idle timer is enabled
            if (obj.enabled) {


                //if it's idle, that means the user is no longer idle
                if (obj.idle) {
                    toggleIdleState(this);
                }

                //set a new timeout
                obj.tId = setTimeout(toggleIdleState, obj.timeout);

            }
        };


        /**
        * Starts the idle timer. This adds appropriate event handlers
        * and starts the first timeout.
        * @param {int} newTimeout (Optional) A new value for the timeout period in ms.
        * @return {void}
        * @method $.idleTimer
        * @static
        */


        var obj = $.data(elem, 'idleTimerObj') || {};

        obj.olddate = obj.olddate || +new Date();

        //assign a new timeout if necessary
        if (typeof newTimeout === "number") {
            opts.timeout = newTimeout;
        } else if (newTimeout === 'destroy') {
            stop(elem);
            return this;
        } else if (newTimeout === 'getElapsedTime') {
            return (+new Date()) - obj.olddate;
        }

        //assign appropriate event handlers
        $(elem).on($.trim((opts.events + ' ').split(' ').join('.idleTimer ')), handleUserEvent);


        obj.idle = opts.idle;
        obj.enabled = opts.enabled;
        obj.timeout = opts.timeout;


        //set a timeout to toggle state. May wish to omit this in some situations
        if (opts.startImmediately) {
            obj.tId = setTimeout(toggleIdleState, obj.timeout);
        }

        // assume the user is active for the first x seconds.
        $.data(elem, 'idleTimer', "active");

        // store our instance on the object
        $.data(elem, 'idleTimerObj', obj);



    }; // end of $.idleTimer()

    // v0.9 API for defining multiple timers.
    $.fn.idleTimer = function (newTimeout, opts) {
        // Allow omission of opts for backward compatibility
        if (!opts) {
            opts = {};
        }

        if (this[0]) {
            $.idleTimer(newTimeout, this[0], opts);
        }

        return this;
    };

    $.fn.ellipsisFill = function (text) {

        return this.each(function () {

            var $self = $(this);

            $self.empty();

            $self.spanElem = $('<span title="' + text + '"></span>');
            $self.append($self.spanElem);

            $self.css('overflow', 'hidden');
            $self.spanElem.css('white-space', 'nowrap');

            $self.spanElem.html(text);

            // get the width of the span.
            // if it's wider than the container, remove a word until it's not.
            if ($self.spanElem.width() > $self.width()) {
                var lastText;

                while ($self.spanElem.width() > $self.width()) {
                    var t = $self.spanElem.html();

                    t = t.substring(0, t.lastIndexOf(' ')) + '&hellip;';

                    if (t == lastText) break;

                    $self.spanElem.html(t);

                    lastText = t;
                }
            }
        });
    };

    $.fn.ellipsisFixed = function (chars, buttonText) {

        return this.each(function () {

            var $self = $(this);

            var text = $self.text();

            $self.empty();

            var $span = $('<span></span>');

            var $ellipsis = $('<a href="#" title="more" class="ellipsis"></a>');

            if (buttonText) {
                $ellipsis.html(buttonText);
            } else {
                $ellipsis.html('&hellip;');
            }

            $ellipsis.click(function (e) {
                e.preventDefault();

                var $this = $(this);

                $span.html(text);

                $this.remove();
            });

            if (text.length > chars) {
                var trimmedText = text.substr(0, chars);
                trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")));

                $span.html(trimmedText + "&nbsp;");

                $span.append($ellipsis);
            } else {
                $span.html(text);
            }

            $self.append($span);
        });

    };

    $.fn.toggleExpandText = function (chars) {

        return this.each(function () {

            var $self = $(this);

            var expandedText = $self.text();

            if (chars > expandedText.length) return;

            var expanded = false;

            var collapsedText = expandedText.substr(0, chars);
            collapsedText = collapsedText.substr(0, Math.min(collapsedText.length, collapsedText.lastIndexOf(" ")));

            $self.toggle = function() {
                $self.empty();

                var $toggleButton = $('<a href="#" class="toggle"></a>');

                if (expanded) {
                    $self.html(expandedText + "&nbsp;");
                    $toggleButton.text("less");
                } else {
                    $self.html(collapsedText + "&nbsp;");
                    $toggleButton.text("more");
                }

                $toggleButton.one('click', function(e) {
                    e.preventDefault();

                    $self.toggle();
                });

                expanded = !expanded;

                $self.append($toggleButton);
            };

            $self.toggle();
        });

    };

    $.fn.ellipsis = function (chars) {

        return this.each(function () {

            var $self = $(this);

            var text = $self.text();

            if (text.length > chars) {
                var trimmedText = text.substr(0, chars);
                trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")))

                $self.empty().html(trimmedText + "&hellip;");
            }
        });

    };
    
    // useful if stretching to fit a parent element's inner height.
    // borders/margins/padding are included in final height, so no overspill.
    $.fn.actualHeight = function (height) {

        return this.each(function () {

            var $self = $(this);

            $self.height(height);

            height -= $self.outerHeight(true) - $self.height();

            $self.height(height);
        });
    };

    $.fn.actualWidth = function (width) {

        return this.each(function () {

            var $self = $(this);

            $self.width(width);

            width -= $self.outerWidth(true) - $self.width();

            $self.width(width);
        });
    };

})(jQuery);