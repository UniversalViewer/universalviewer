// jquery-plugins v0.1.0 https://github.com/edsilv/jquery-plugins
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jqueryPlugins = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// declare var Length: Length;
// interface Length{
//     toPx(elem, value, prop?, force?): number;
// }

/// <reference types="extensions" />
(function ($) {
    $.fn.checkboxButton = function (onClick) {
        return this.each(function () {
            var $this = $(this);
            $this.on('click', function (e) {
                var tagName = e.target.tagName;
                var $checkbox = $(this).find(':checkbox');
                if (tagName !== "INPUT") {
                    e.preventDefault();
                    $checkbox.prop('checked', !$checkbox.prop('checked'));
                }
                var checked = $checkbox.is(':checked');
                onClick.call(this, checked);
            });
        });
    };
    $.fn.disable = function () {
        return this.each(function () {
            var $this = $(this);
            $this.addClass('disabled');
            $this.data('tabindex', $this.attr('tabindex'));
            $this.removeAttr('tabindex');
        });
    };
    $.fn.ellipsis = function (chars) {
        return this.each(function () {
            var $self = $(this);
            var text = $self.text();
            if (text.length > chars) {
                var trimmedText = text.substr(0, chars);
                trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")));
                $self.empty().html(trimmedText + "&hellip;");
            }
        });
    };
    $.fn.ellipsisFill = function (text) {
        var textPassed = true;
        if (!text)
            textPassed = false;
        return this.each(function () {
            var $self = $(this);
            if (!textPassed)
                text = $self.text();
            $self.empty();
            var $spanElem = $('<span title="' + text + '"></span>');
            $self.append($spanElem);
            $self.css('overflow', 'hidden');
            $spanElem.css('white-space', 'nowrap');
            $spanElem.html(text);
            // get the width of the span.
            // if it's wider than the container, remove a word until it's not.
            if ($spanElem.width() > $self.width()) {
                var lastText = null;
                while ($spanElem.width() > $self.width()) {
                    var t = $spanElem.html();
                    t = t.substring(0, t.lastIndexOf(' ')) + '&hellip;';
                    if (t === lastText)
                        break;
                    $spanElem.html(t);
                    lastText = t;
                }
            }
        });
    };
    // Truncates to a certain number of letters, while ignoring and preserving HTML
    $.fn.ellipsisHtmlFixed = function (chars, cb) {
        return this.each(function () {
            var $self = $(this);
            var expandedText = $self.html();
            var $trunc = $('<span></span>');
            $trunc.html($self.html().replace(/\s[\s]*/g, ' ').trim());
            if ($trunc.text().trim().length <= chars) {
                return; // do nothing if we're under the limit!
            }
            while ($trunc.text().trim().length > chars) {
                $trunc.removeLastWord(chars);
            }
            var collapsedText = $trunc.html();
            // Toggle function
            var expanded = false;
            $self.toggle = function () {
                $self.empty();
                var $toggleButton = $('<a href="#" class="toggle"></a>');
                if (expanded) {
                    $self.html(expandedText + " ");
                    $toggleButton.text("less");
                    $toggleButton.switchClass("less", "more");
                }
                else {
                    $self.html(collapsedText + "&hellip; ");
                    $toggleButton.text("more");
                    $toggleButton.switchClass("more", "less");
                }
                $toggleButton.one('click', function (e) {
                    e.preventDefault();
                    $self.toggle();
                });
                expanded = !expanded;
                $self.append($toggleButton);
                if (cb)
                    cb();
            };
            $self.toggle();
        });
    };
    $.fn.enable = function () {
        return this.each(function () {
            var $self = $(this);
            $self.removeClass('disabled');
            $self.attr('tabindex', $self.data('tabindex'));
        });
    };
    $.fn.equaliseHeight = function (reset, average) {
        var maxHeight = -1;
        var minHeight = Number.MAX_VALUE;
        var heights = [];
        // reset all heights to auto first so they can be re-measured.
        if (reset) {
            this.each(function () {
                $(this).height('auto');
            });
        }
        this.each(function () {
            var currentHeight = $(this).height();
            heights.push(currentHeight);
            maxHeight = maxHeight > currentHeight ? maxHeight : currentHeight;
            minHeight = minHeight < currentHeight ? minHeight : currentHeight;
        });
        var finalHeight = maxHeight;
        if (average) {
            finalHeight = Math.median(heights);
        }
        this.each(function () {
            $(this).height(finalHeight);
        });
        return this;
    };
    $.fn.getVisibleElementWithGreatestTabIndex = function () {
        var $self = $(this);
        var maxTabIndex = 0;
        var $elementWithGreatestTabIndex = null;
        $self.find('*:visible[tabindex]').each(function (index, el) {
            var $el = $(el);
            var tabIndex = parseInt($el.attr('tabindex'));
            if (tabIndex > maxTabIndex) {
                maxTabIndex = tabIndex;
                $elementWithGreatestTabIndex = $el;
            }
        });
        return $elementWithGreatestTabIndex;
    };
    $.fn.horizontalMargins = function () {
        var $self = $(this);
        return parseInt($self.css('marginLeft')) + parseInt($self.css('marginRight'));
    };
    $.fn.leftMargin = function () {
        var $self = $(this);
        return parseInt($self.css('marginLeft'));
    };
    $.fn.rightMargin = function () {
        var $self = $(this);
        return parseInt($self.css('marginRight'));
    };
    $.fn.horizontalPadding = function () {
        var $self = $(this);
        return parseInt($self.css('paddingLeft')) + parseInt($self.css('paddingRight'));
    };
    $.fn.leftPadding = function () {
        var $self = $(this);
        return parseInt($self.css('paddingLeft'));
    };
    $.fn.rightPadding = function () {
        var $self = $(this);
        return parseInt($self.css('paddingRight'));
    };
    $.mlp = { x: 0, y: 0 }; // Mouse Last Position
    function documentHandler() {
        var $current = this === document ? $(this) : $(this).contents();
        $current.mousemove(function (e) { jQuery.mlp = { x: e.pageX, y: e.pageY }; });
        $current.find("iframe").load(documentHandler);
    }
    $(documentHandler);
    $.fn.ismouseover = function () {
        var result = false;
        this.eq(0).each(function () {
            var $current = $(this).is("iframe") ? $(this).contents().find("body") : $(this);
            var offset = $current.offset();
            result = offset.left <= $.mlp.x && offset.left + $current.outerWidth() > $.mlp.x &&
                offset.top <= $.mlp.y && offset.top + $current.outerHeight() > $.mlp.y;
        });
        return result;
    };
    var on = $.fn.on;
    var timer;
    $.fn.on = function () {
        var args = Array.apply(null, arguments);
        var last = args[args.length - 1];
        if (isNaN(last) || (last === 1 && args.pop()))
            return on.apply(this, args);
        var delay = args.pop();
        var fn = args.pop();
        args.push(function () {
            var self = this;
            var params = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(self, params);
            }, delay);
        });
        return on.apply(this, args);
    };
    $.fn.onEnter = function (cb) {
        return this.each(function () {
            var $this = $(this);
            $this.on('keyup', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    cb();
                }
            });
        });
    };
    $.fn.onPressed = function (cb) {
        return this.each(function () {
            var $this = $(this);
            $this.on('touchstart click', function (e) {
                e.preventDefault();
                cb(e);
            });
            $this.on('keyup', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    cb(e);
                }
            });
        });
    };
    // Recursively removes the last empty element (img, audio, etc) or word in an element
    $.fn.removeLastWord = function (chars, depth) {
        if (chars === void 0) { chars = 8; }
        if (depth === void 0) { depth = 0; }
        return this.each(function () {
            var $self = $(this);
            if ($self.contents().length > 0) {
                var $lastElement = $self.contents().last();
                if ($lastElement[0].nodeType === 3) {
                    var words = $lastElement.text().trim().split(' ');
                    if (words.length > 1) {
                        words.splice(words.length - 1, 1);
                        $lastElement[0].data = words.join(' '); // textnode.data
                        return;
                    }
                    else if ('undefined' !== typeof chars && words.length === 1 && words[0].length > chars) {
                        $lastElement[0].data = words.join(' ').substring(0, chars);
                        return;
                    }
                }
                $lastElement.removeLastWord(chars, depth + 1); // Element
            }
            else if (depth > 0) {
                // Empty element
                $self.remove();
            }
        });
    };
    $.fn.swapClass = function (removeClass, addClass) {
        return this.each(function () {
            $(this).removeClass(removeClass).addClass(addClass);
        });
    };
    $.fn.targetBlank = function () {
        return this.each(function () {
            $(this).find('a').prop('target', '_blank');
        });
    };
    $.fn.switchClass = function (class1, class2) {
        return this.each(function () {
            var $this = $(this);
            if ($this.hasClass(class1)) {
                $(this).removeClass(class1).addClass(class2);
            }
            else {
                $(this).removeClass(class2).addClass(class1);
            }
        });
    };
    $.fn.toggleExpandText = function (chars, lessText, moreText, cb) {
        return this.each(function () {
            var $self = $(this);
            var expandedText = $self.html();
            if (chars > expandedText.length)
                return;
            var expanded = false;
            var collapsedText = expandedText.substr(0, chars);
            collapsedText = collapsedText.substr(0, Math.min(collapsedText.length, collapsedText.lastIndexOf(" ")));
            $self.toggle = function () {
                $self.empty();
                var $toggleButton = $('<a href="#" class="toggle"></a>');
                if (expanded) {
                    $self.html(expandedText + "&nbsp;");
                    $toggleButton.text(lessText);
                    $toggleButton.switchClass("less", "more");
                }
                else {
                    $self.html(collapsedText + "&nbsp;");
                    $toggleButton.text(moreText);
                    $toggleButton.switchClass("more", "less");
                }
                $toggleButton.one('click', function (e) {
                    e.preventDefault();
                    $self.toggle();
                });
                expanded = !expanded;
                $self.append($toggleButton);
                if (cb)
                    cb();
            };
            $self.toggle();
        });
    };
    // Toggle expansion by number of lines
    $.fn.toggleExpandTextByLines = function (lines, lessText, moreText, cb) {
        return this.each(function () {
            var $self = $(this);
            var expandedText = $self.html();
            // add 'pad' to account for the right margin in the sidebar
            var $buttonPad = $('<span>&hellip; <a href="#" class="toggle more">morepad</a></span>');
            // when height changes, store string, then pick from line counts
            var stringsByLine = [expandedText];
            var lastHeight = $self.height();
            // Until empty
            while ($self.text().length > 0) {
                $self.removeLastWord();
                var html = $self.html();
                $self.append($buttonPad);
                if (lastHeight > $self.height()) {
                    stringsByLine.unshift(html);
                    lastHeight = $self.height();
                }
                $buttonPad.remove();
            }
            if (stringsByLine.length <= lines) {
                $self.html(expandedText);
                return;
            }
            var collapsedText = stringsByLine[lines - 1];
            // Toggle function
            var expanded = false;
            $self.toggle = function () {
                $self.empty();
                var $toggleButton = $('<a href="#" class="toggle"></a>');
                if (expanded) {
                    $self.html(expandedText + " ");
                    $toggleButton.text(lessText);
                    $toggleButton.switchClass("less", "more");
                }
                else {
                    $self.html(collapsedText + "&hellip; ");
                    $toggleButton.text(moreText);
                    $toggleButton.switchClass("more", "less");
                }
                $toggleButton.one('click', function (e) {
                    e.preventDefault();
                    $self.toggle();
                });
                expanded = !expanded;
                $self.append($toggleButton);
                if (cb)
                    cb();
            };
            $self.toggle();
        });
    };
    $.fn.toggleText = function (text1, text2) {
        return this.each(function () {
            var $self = $(this);
            if ($self.text() === text1) {
                $(this).text(text2);
            }
            else {
                $(this).text(text1);
            }
        });
    };
    $.fn.updateAttr = function (attrName, oldVal, newVal) {
        return this.each(function () {
            var $self = $(this);
            var attr = $self.attr(attrName);
            if (attr && attr.indexOf(oldVal) === 0) {
                attr = attr.replace(oldVal, newVal);
                $self.attr(attrName, attr);
            }
        });
    };
    $.fn.verticalMargins = function () {
        var $self = $(this);
        return parseInt($self.css('marginTop')) + parseInt($self.css('marginBottom'));
    };
    $.fn.verticalPadding = function () {
        var $self = $(this);
        return parseInt($self.css('paddingTop')) + parseInt($self.css('paddingBottom'));
    };
})(jQuery);

},{}]},{},[1])(1)
});