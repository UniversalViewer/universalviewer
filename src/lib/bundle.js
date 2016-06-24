window.browserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
        // detect IE 11
        if (this.browser == 'Explorer' && this.version == '7' && navigator.userAgent.match(/Trident/i)) {
            this.version = this.searchVersionIE();
        }
    },

    searchString: function (data) {
        for (var i = 0 ; i < data.length ; i++) {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) != -1) {
                return data[i].identity;
            }
        }
    },

    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },

    searchVersionIE: function() {
        var ua = navigator.userAgent.toString().toLowerCase(),
            match = /(trident)(?:.*rv:([\w.]+))?/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ['', null, -1],
            ver;
        try {
            ver = (match[2]).split('.')[0]; // version
        }
        catch (err) {
            ver = 'unknown'; //
        }
        return ver;
    },

    dataBrowser:
        [
            { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
            { string: navigator.userAgent, subString: "MSIE", identity: "Explorer" },
            { string: navigator.userAgent, subString: "Trident", identity: "Explorer" },
            { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
            { string: navigator.userAgent, subString: "Safari", identity: "Safari" },
            { string: navigator.userAgent, subString: "Opera", identity: "Opera" }
        ]

};

window.browserDetect.init();
/*!
 * jQuery-ajaxTransport-XDomainRequest - v1.0.4 - 2015-03-05
 * https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest
 * Copyright (c) 2015 Jason Moon (@JSONMOON)
 * Licensed MIT (/blob/master/LICENSE.txt)
 */
(function(factory) {
    //if (typeof define === 'function' && define.amd) {
    //    // AMD. Register as anonymous module.
    //    define(['jquery'], factory);
    //} else if (typeof exports === 'object') {
    //    // CommonJS
    //    module.exports = factory(require('jquery'));
    //} else {
        // Browser globals.
        factory(jQuery);
    //}
}(function($) {

// Only continue if we're on IE8/IE9 with jQuery 1.5+ (contains the ajaxTransport function)
    if ($.support.cors || !$.ajaxTransport || !window.XDomainRequest) {
        return $;
    }

    var httpRegEx = /^(https?:)?\/\//i;
    var getOrPostRegEx = /^get|post$/i;
    var sameSchemeRegEx = new RegExp('^(\/\/|' + location.protocol + ')', 'i');

// ajaxTransport exists in jQuery 1.5+
    $.ajaxTransport('* text html xml json', function(options, userOptions, jqXHR) {

        // Only continue if the request is: asynchronous, uses GET or POST method, has HTTP or HTTPS protocol, and has the same scheme as the calling page
        if (!options.crossDomain || !options.async || !getOrPostRegEx.test(options.type) || !httpRegEx.test(options.url) || !sameSchemeRegEx.test(options.url)) {
            return;
        }

        var xdr = null;

        return {
            send: function(headers, complete) {
                var postData = '';
                var userType = (userOptions.dataType || '').toLowerCase();

                xdr = new XDomainRequest();
                if (/^\d+$/.test(userOptions.timeout)) {
                    xdr.timeout = userOptions.timeout;
                }

                xdr.ontimeout = function() {
                    complete(500, 'timeout');
                };

                xdr.onload = function() {
                    var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
                    var status = {
                        code: 200,
                        message: 'success'
                    };
                    var responses = {
                        text: xdr.responseText
                    };
                    try {
                        if (userType === 'html' || /text\/html/i.test(xdr.contentType)) {
                            responses.html = xdr.responseText;
                        } else if (userType === 'json' || (userType !== 'text' && /\/json/i.test(xdr.contentType))) {
                            try {
                                responses.json = $.parseJSON(xdr.responseText);
                            } catch(e) {
                                status.code = 500;
                                status.message = 'parseerror';
                                //throw 'Invalid JSON: ' + xdr.responseText;
                            }
                        } else if (userType === 'xml' || (userType !== 'text' && /\/xml/i.test(xdr.contentType))) {
                            var doc = new ActiveXObject('Microsoft.XMLDOM');
                            doc.async = false;
                            try {
                                doc.loadXML(xdr.responseText);
                            } catch(e) {
                                doc = undefined;
                            }
                            if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                status.code = 500;
                                status.message = 'parseerror';
                                throw 'Invalid XML: ' + xdr.responseText;
                            }
                            responses.xml = doc;
                        }
                    } catch(parseMessage) {
                        throw parseMessage;
                    } finally {
                        complete(status.code, status.message, responses, allResponseHeaders);
                    }
                };

                // set an empty handler for 'onprogress' so requests don't get aborted
                xdr.onprogress = function(){};
                xdr.onerror = function() {
                    complete(401, 'error', {
                        text: xdr.responseText
                    });
                };

                if (userOptions.data) {
                    postData = ($.type(userOptions.data) === 'string') ? userOptions.data : $.param(userOptions.data);
                }
                xdr.open(options.type, options.url);
                xdr.send(postData);
            },
            abort: function() {
                if (xdr) {
                    xdr.abort();
                }
            }
        };
    });

    return $;

}));

/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-input-inputtypes-cssclasses-load
 */
/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-input-inputtypes-cssclasses-cors-load
 * (add Non-core detects: cors)
 */
;window.Modernizr=function(a,b,c){function v(a){j.cssText=a}function w(a,b){return v(prefixes.join(a+";")+(b||""))}function x(a,b){return typeof a===b}function y(a,b){return!!~(""+a).indexOf(b)}function z(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:x(f,"function")?f.bind(d||b):f}return!1}function A(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)p[c[d]]=c[d]in k;return p.list&&(p.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),p}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),o[a[d]]=!!e;return o}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.8.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n={},o={},p={},q=[],r=q.slice,s,t={}.hasOwnProperty,u;!x(t,"undefined")&&!x(t.call,"undefined")?u=function(a,b){return t.call(a,b)}:u=function(a,b){return b in a&&x(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=r.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(r.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(r.call(arguments)))};return e});for(var B in n)u(n,B)&&(s=B.toLowerCase(),e[s]=n[B](),q.push((e[s]?"":"no-")+s));return e.input||A(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)u(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},v(""),i=k=null,e._version=d,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+q.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))},Modernizr.addTest("cors",!!(window.XMLHttpRequest&&"withCredentials"in new XMLHttpRequest));
/**
 * Copyright (c) 2010 by Gabriel Birke
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

function Sanitize(){
    var i, e, options;
    options = arguments[0] || {};
    this.config = {};
    this.config.elements = options.elements ? options.elements : [];
    this.config.attributes = options.attributes ? options.attributes : {};
    this.config.attributes[Sanitize.ALL] = this.config.attributes[Sanitize.ALL] ? this.config.attributes[Sanitize.ALL] : [];
    this.config.allow_comments = options.allow_comments ? options.allow_comments : false;
    this.allowed_elements = {};
    this.config.protocols = options.protocols ? options.protocols : {};
    this.config.add_attributes = options.add_attributes ? options.add_attributes  : {};
    this.dom = options.dom ? options.dom : document;
    for(i=0;i<this.config.elements.length;i++) {
        this.allowed_elements[this.config.elements[i]] = true;
    }
    this.config.remove_element_contents = {};
    this.config.remove_all_contents = false;
    if(options.remove_contents) {

        if(options.remove_contents instanceof Array) {
            for(i=0;i<options.remove_contents.length;i++) {
                this.config.remove_element_contents[options.remove_contents[i]] = true;
            }
        }
        else {
            this.config.remove_all_contents = true;
        }
    }
    this.transformers = options.transformers ? options.transformers : [];
}

Sanitize.REGEX_PROTOCOL = /^([A-Za-z0-9\+\-\.\&\;\*\s]*?)(?:\:|&*0*58|&*x0*3a)/i;

// emulate Ruby symbol with string constant
Sanitize.RELATIVE = '__RELATIVE__';
Sanitize.ALL = '__ALL__';

Sanitize.prototype.clean_node = function(container) {
    var fragment = this.dom.createDocumentFragment();
    this.current_element = fragment;
    this.whitelist_nodes = [];



    /**
     * Utility function to check if an element exists in an array
     */
    function _array_index(needle, haystack) {
        var i;
        for(i=0; i < haystack.length; i++) {
            if(haystack[i] == needle)
                return i;
        }
        return -1;
    }

    function _merge_arrays_uniq() {
        var result = [];
        var uniq_hash = {};
        var i,j;
        for(i=0;i<arguments.length;i++) {
            if(!arguments[i] || !arguments[i].length)
                continue;
            for(j=0;j<arguments[i].length;j++) {
                if(uniq_hash[arguments[i][j]])
                    continue;
                uniq_hash[arguments[i][j]] = true;
                result.push(arguments[i][j]);
            }
        }
        return result;
    }

    /**
     * Clean function that checks the different node types and cleans them up accordingly
     * @param elem DOM Node to clean
     */
    function _clean(elem) {
        var clone;
        switch(elem.nodeType) {
            // Element
            case 1:
                _clean_element.call(this, elem);
                break;
            // Text
            case 3:
                clone = elem.cloneNode(false);
                this.current_element.appendChild(clone);
                break;
            // Entity-Reference (normally not used)
            case 5:
                clone = elem.cloneNode(false);
                this.current_element.appendChild(clone);
                break;
            // Comment
            case 8:
                if(this.config.allow_comments) {
                    clone = elem.cloneNode(false);
                    this.current_element.appendChild(clone);
                }
                break;
            default:
                if (console && console.log) console.log("unknown node type", elem.nodeType);
                break;
        }

    }

    function _clean_element(elem) {
        var i, j, clone, parent_element, name, allowed_attributes, attr, attr_name, attr_node, protocols, del, attr_ok;
        var transform = _transform_element.call(this, elem);

        elem = transform.node;
        name = elem.nodeName.toLowerCase();

        // check if element itself is allowed
        parent_element = this.current_element;
        if(this.allowed_elements[name] || transform.whitelist) {
            this.current_element = this.dom.createElement(elem.nodeName);
            parent_element.appendChild(this.current_element);

            // clean attributes
            var attrs = this.config.attributes;
            allowed_attributes = _merge_arrays_uniq(attrs[name], attrs[Sanitize.ALL], transform.attr_whitelist);
            for(i=0;i<allowed_attributes.length;i++) {
                attr_name = allowed_attributes[i];
                attr = elem.attributes[attr_name];
                if(attr) {
                    attr_ok = true;
                    // Check protocol attributes for valid protocol
                    if(this.config.protocols[name] && this.config.protocols[name][attr_name]) {
                        protocols = this.config.protocols[name][attr_name];
                        del = attr.value.toLowerCase().match(Sanitize.REGEX_PROTOCOL);
                        if(del) {
                            attr_ok = (_array_index(del[1], protocols) != -1);
                        }
                        else {
                            attr_ok = (_array_index(Sanitize.RELATIVE, protocols) != -1);
                        }
                    }
                    if(attr_ok) {
                        attr_node = document.createAttribute(attr_name);
                        attr_node.value = attr.value;
                        this.current_element.setAttributeNode(attr_node);
                    }
                }
            }

            // Add attributes
            if(this.config.add_attributes[name]) {
                for(attr_name in this.config.add_attributes[name]) {
                    attr_node = document.createAttribute(attr_name);
                    attr_node.value = this.config.add_attributes[name][attr_name];
                    this.current_element.setAttributeNode(attr_node);
                }
            }
        } // End checking if element is allowed
        // If this node is in the dynamic whitelist array (built at runtime by
        // transformers), let it live with all of its attributes intact.
        else if(_array_index(elem, this.whitelist_nodes) != -1) {
            this.current_element = elem.cloneNode(true);
            // Remove child nodes, they will be sanitiazied and added by other code
            while(this.current_element.childNodes.length > 0) {
                this.current_element.removeChild(this.current_element.firstChild);
            }
            parent_element.appendChild(this.current_element);
        }

        // iterate over child nodes
        if(!this.config.remove_all_contents && !this.config.remove_element_contents[name]) {
            for(i=0;i<elem.childNodes.length;i++) {
                _clean.call(this, elem.childNodes[i]);
            }
        }

        // some versions of IE don't support normalize.
        if(this.current_element.normalize) {
            this.current_element.normalize();
        }
        this.current_element = parent_element;
    } // END clean_element function

    function _transform_element(node) {
        var output = {
            attr_whitelist:[],
            node: node,
            whitelist: false
        };
        var i, j, transform;
        for(i=0;i<this.transformers.length;i++) {
            transform = this.transformers[i]({
                allowed_elements: this.allowed_elements,
                config: this.config,
                node: node,
                node_name: node.nodeName.toLowerCase(),
                whitelist_nodes: this.whitelist_nodes,
                dom: this.dom
            });
            if (transform == null)
                continue;
            else if(typeof transform == 'object') {
                if(transform.whitelist_nodes && transform.whitelist_nodes instanceof Array) {
                    for(j=0;j<transform.whitelist_nodes.length;j++) {
                        if(_array_index(transform.whitelist_nodes[j], this.whitelist_nodes) == -1) {
                            this.whitelist_nodes.push(transform.whitelist_nodes[j]);
                        }
                    }
                }
                output.whitelist = transform.whitelist ? true : false;
                if(transform.attr_whitelist) {
                    output.attr_whitelist = _merge_arrays_uniq(output.attr_whitelist, transform.attr_whitelist);
                }
                output.node = transform.node ? transform.node : output.node;
            }
            else {
                throw new Error("transformer output must be an object or null");
            }
        }
        return output;
    }



    for(i=0;i<container.childNodes.length;i++) {
        _clean.call(this, container.childNodes[i]);
    }

    if(fragment.normalize) {
        fragment.normalize();
    }

    return fragment;

};

if ( typeof define === "function" ) {
    define( "sanitize", [], function () { return Sanitize; } );
}
( function ( window, doc, undef ) {
  // Takes a preloaded css obj (changes in different browsers) and injects it into the head
  yepnope.injectCss = function( href, cb, attrs, timeout, /* Internal use */ err, internal ) {

    // Create stylesheet link
    var link = document.createElement( "link" ),
        onload = function() {
          if ( ! done ) {
            done = 1;
            link.removeAttribute("id");
            setTimeout( cb, 0 );
          }
        },
        id = "yn" + (+new Date()),
        ref, done, i;

    cb = internal ? yepnope.executeStack : ( cb || function(){} );
    timeout = timeout || yepnope.errorTimeout;
    // Add attributes
    link.href = href;
    link.rel  = "stylesheet";
    link.type = "text/css";
    link.id = id;

    // Add our extra attributes to the link element
    for ( i in attrs ) {
      link.setAttribute( i, attrs[ i ] );
    }


    if ( ! err ) {
      ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];
      ref.parentNode.insertBefore( link, ref );
      link.onload = onload;

      function poll() {
        try {
            var sheets = document.styleSheets;
            for(var j=0, k=sheets.length; j<k; j++) {
                if(sheets[j].ownerNode.id == id) {
                    // this throws an exception, I believe, if not full loaded (was originally just "sheets[j].cssRules;")
                    if (sheets[j].cssRules.length)
                        return onload();
                }
            }
            // if we get here, its not in document.styleSheets (we never saw the ID)
            throw new Error;
        } catch(e) {
            // Keep polling
            setTimeout(poll, 20);
        }
      }
      poll();
    }
  }
})( this, this.document );
/*!
 * EventEmitter2
 * https://github.com/hij1nx/EventEmitter2
 *
 * Copyright (c) 2013 hij1nx
 * Licensed under the MIT license.
 */
;!function(undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {

      this._conf = conf;

      conf.delimiter && (this.delimiter = conf.delimiter);
      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this.newListener = conf.newListener);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    }
  }

  function EventEmitter(conf) {
    this._events = {};
    this.newListener = false;
    configure.call(this, conf);
  }
  EventEmitter.EventEmitter2 = EventEmitter; // backwards compatibility for exporting EventEmitter property

  //
  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i) {
    if (!tree) {
      return [];
    }
    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
        typeLength = type.length, currentType = type[i], nextType = type[i+1];
    if (i === typeLength && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return [tree];
      } else {
        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return [tree];
      }
    }

    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (currentType === '*') {
        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
          }
        }
        return listeners;
      } else if(currentType === '**') {
        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
        if(endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
        }

        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            if(branch === '*' || branch === '**') {
              if(tree[branch]._listeners && !endReached) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
              }
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            } else if(branch === nextType) {
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
            } else {
              // No match on this one, shift into the tree but not in the type array.
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            }
          }
        }
        return listeners;
      }

      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
    }

    xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i+1);
    }

    xxTree = tree['**'];
    if(xxTree) {
      if(i < typeLength) {
        if(xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength);
        }

        // Build arrays of matching next branches and others.
        for(branch in xxTree) {
          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
            if(branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i+2);
            } else if(branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i+1);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
            }
          }
        }
      } else if(xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength);
      } else if(xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener) {

    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    for(var i = 0, len = type.length; i+1 < len; i++) {
      if(type[i] === '**' && type[i+1] === '**') {
        return;
      }
    }

    var tree = this.listenerTree;
    var name = type.shift();

    while (name) {

      if (!tree[name]) {
        tree[name] = {};
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else if(typeof tree._listeners === 'function') {
          tree._listeners = [tree._listeners, listener];
        }
        else if (isArray(tree._listeners)) {

          tree._listeners.push(listener);

          if (!tree._listeners.warned) {

            var m = defaultMaxListeners;

            if (typeof this._events.maxListeners !== 'undefined') {
              m = this._events.maxListeners;
            }

            if (m > 0 && tree._listeners.length > m) {

              tree._listeners.warned = true;
              console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            tree._listeners.length);
              if(console.trace){
                console.trace();
              }
            }
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  }

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    this._events || init.call(this);
    this._events.maxListeners = n;
    if (!this._conf) this._conf = {};
    this._conf.maxListeners = n;
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      fn.apply(this, arguments);
    }

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
      if (!this._events.newListener) {
        return false;
      }
    }

    var al = arguments.length;
    var args,l,i,j;
    var handler;

    if (this._all && this._all.length) {
      handler = this._all.slice();
      if (al > 3) {
        args = new Array(al);
        for (j = 1; j < al; j++) args[j] = arguments[j];
      }

      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          handler[i].call(this, type);
          break;
        case 2:
          handler[i].call(this, type, arguments[1]);
          break;
        case 3:
          handler[i].call(this, type, arguments[1], arguments[2]);
          break;
        default:
          handler[i].apply(this, args);
        }
      }
    }

    if (this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    } else {
      handler = this._events[type];
      if (typeof handler === 'function') {
        this.event = type;
        switch (al) {
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        default:
          args = new Array(al - 1);
          for (j = 1; j < al; j++) args[j - 1] = arguments[j];
          handler.apply(this, args);
        }
        return true;
      } else if (handler) {
        // need to make copy of handlers because list can change in the middle
        // of emit call
        handler = handler.slice();
      }
    }

    if (handler && handler.length) {
      if (al > 3) {
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
      }
      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          handler[i].call(this);
          break;
        case 2:
          handler[i].call(this, arguments[1]);
          break;
        case 3:
          handler[i].call(this, arguments[1], arguments[2]);
          break;
        default:
          handler[i].apply(this, args);
        }
      }
      return true;
    } else if (!this._all && type === 'error') {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }

    return !!this._all;
  };

  EventEmitter.prototype.emitAsync = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
        if (!this._events.newListener) { return Promise.resolve([false]); }
    }

    var promises= [];

    var al = arguments.length;
    var args,l,i,j;
    var handler;

    if (this._all) {
      if (al > 3) {
        args = new Array(al);
        for (j = 1; j < al; j++) args[j] = arguments[j];
      }
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          promises.push(this._all[i].call(this, type));
          break;
        case 2:
          promises.push(this._all[i].call(this, type, arguments[1]));
          break;
        case 3:
          promises.push(this._all[i].call(this, type, arguments[1], arguments[2]));
          break;
        default:
          promises.push(this._all[i].apply(this, args));
        }
      }
    }

    if (this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    } else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      switch (al) {
      case 1:
        promises.push(handler.call(this));
        break;
      case 2:
        promises.push(handler.call(this, arguments[1]));
        break;
      case 3:
        promises.push(handler.call(this, arguments[1], arguments[2]));
        break;
      default:
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
        promises.push(handler.apply(this, args));
      }
    } else if (handler && handler.length) {
      if (al > 3) {
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
      }
      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          promises.push(handler[i].call(this));
          break;
        case 2:
          promises.push(handler[i].call(this, arguments[1]));
          break;
        case 3:
          promises.push(handler[i].call(this, arguments[1], arguments[2]));
          break;
        default:
          promises.push(handler[i].apply(this, args));
        }
      }
    } else if (!this._all && type === 'error') {
      if (arguments[1] instanceof Error) {
        return Promise.reject(arguments[1]); // Unhandled 'error' event
      } else {
        return Promise.reject("Uncaught, unspecified 'error' event.");
      }
    }

    return Promise.all(promises);
  };

  EventEmitter.prototype.on = function(type, listener) {

    if (typeof type === 'function') {
      this.onAny(type);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if(this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else if(typeof this._events[type] === 'function') {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
    }
    else if (isArray(this._events[type])) {
      // If we've already got an array, just append.
      this._events[type].push(listener);

      // Check for listener leak
      if (!this._events[type].warned) {

        var m = defaultMaxListeners;

        if (typeof this._events.maxListeners !== 'undefined') {
          m = this._events.maxListeners;
        }

        if (m > 0 && this._events[type].length > m) {

          this._events[type].warned = true;
          console.error('(node) warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.',
                        this._events[type].length);
          if(console.trace){
            console.trace();
          }
        }
      }
    }
    return this;
  };

  EventEmitter.prototype.onAny = function(fn) {

    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    if(!this._all) {
      this._all = [];
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          continue;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1);
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }

        this.emit("removeListener", type, listener);

        return this;
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }

        this.emit("removeListener", type, listener);
      }
    }

    function recursivelyGarbageCollect(root) {
      if (root === undefined) {
        return;
      }
      var keys = Object.keys(root);
      for (var i in keys) {
        var key = keys[i];
        var obj = root[key];
        if ((obj instanceof Function) || (typeof obj !== "object"))
          continue;
        if (Object.keys(obj).length > 0) {
          recursivelyGarbageCollect(root[key]);
        }
        if (Object.keys(obj).length === 0) {
          delete root[key];
        }
      }
    }
    recursivelyGarbageCollect(this.listenerTree);

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          this.emit("removeListenerAny", fn);
          return this;
        }
      }
    } else {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++)
        this.emit("removeListenerAny", fns[i]);
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      !this._events || init.call(this);
      return this;
    }

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }
    }
    else {
      if (!this._events || !this._events[type]) return this;
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if(this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || init.call(this);

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  if (typeof define === 'function' && define.amd) {
     // AMD. Register as an anonymous module.
    define(function() {
      return EventEmitter;
    });
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = EventEmitter;
  }
  else {
    // Browser global.
    window.EventEmitter2 = EventEmitter;
  }
}();

!function(f){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=f();else if("function"==typeof define&&define.amd)define([],f);else{var g;g="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,g.baseComponent=f()}}(function(){return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){var Components;!function(Components){function applyMixins(derivedCtor,baseCtors){baseCtors.forEach(function(baseCtor){Object.getOwnPropertyNames(baseCtor.prototype).forEach(function(name){derivedCtor.prototype[name]=baseCtor.prototype[name]})})}var BaseComponent=function(){function BaseComponent(options){this.options=$.extend(this._getDefaultOptions(),options)}return BaseComponent.prototype._init=function(){return this._$element=$(this.options.element),this._$element.length?(this._$element.empty(),!0):(console.warn("element not found"),!1)},BaseComponent.prototype._getDefaultOptions=function(){return{}},BaseComponent.prototype._emit=function(event){for(var args=[],_i=1;_i<arguments.length;_i++)args[_i-1]=arguments[_i];this.emit(event,args)},BaseComponent.prototype._resize=function(){},BaseComponent.prototype.databind=function(data){},BaseComponent}();Components.BaseComponent=BaseComponent,Components.applyMixins=applyMixins,applyMixins(BaseComponent,[EventEmitter2])}(Components||(Components={})),function(w){w.Components||(w.Components=Components)}(window)},{}]},{},[1])(1)});
(function ($) {
    $.fn.checkboxButton = function (onClick) {
        return this.each(function () {
            var $this = $(this);
            $this.on('click', function (e) {
                var tagName = e.target.tagName;
                var $checkbox;
                if (tagName !== "INPUT") {
                    e.preventDefault();
                    $checkbox = $(this).find(':checkbox');
                    $checkbox.prop('checked', !$checkbox.prop('checked'));
                }
                else {
                    $checkbox = $(this);
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
                    if (t === lastText)
                        break;
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
            }
            else {
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
            }
            else {
                $span.html(text);
            }
            $self.append($span);
        });
    };
    // Truncates to a certain number of letters, while ignoring and preserving HTML
    $.fn.ellipsisHtmlFixed = function (chars, callback) {
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
                    $toggleButton.toggleClass("less", "more");
                }
                else {
                    $self.html(collapsedText + "&hellip; ");
                    $toggleButton.text("more");
                    $toggleButton.toggleClass("more", "less");
                }
                $toggleButton.one('click', function (e) {
                    e.preventDefault();
                    $self.toggle();
                });
                expanded = !expanded;
                $self.append($toggleButton);
                if (callback)
                    callback();
            };
            $self.toggle();
        });
    };
    $.fn.enable = function () {
        return this.each(function () {
            var $this = $(this);
            $this.removeClass('disabled');
            $this.attr('tabindex', $this.data('tabindex'));
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
        $self.find('*:visible[tabindex]').each(function (idx, el) {
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
        $current.mousemove(function (e) {
            jQuery.mlp = { x: e.pageX, y: e.pageY };
        });
        $current.find("iframe").load(documentHandler);
    }
    $(documentHandler);
    $.fn.ismouseover = function (overThis) {
        var result = false;
        this.eq(0).each(function () {
            var $current = $(this).is("iframe") ? $(this).contents().find("body") : $(this);
            var offset = $current.offset();
            result = offset.left <= $.mlp.x && offset.left + $current.outerWidth() > $.mlp.x && offset.top <= $.mlp.y && offset.top + $current.outerHeight() > $.mlp.y;
        });
        return result;
    };
    var on = $.fn.on, timer;
    $.fn.on = function () {
        var args = Array.apply(null, arguments);
        var last = args[args.length - 1];
        if (isNaN(last) || (last === 1 && args.pop()))
            return on.apply(this, args);
        var delay = args.pop();
        var fn = args.pop();
        args.push(function () {
            var self = this, params = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(self, params);
            }, delay);
        });
        return on.apply(this, args);
    };
    $.fn.onEnter = function (callback) {
        return this.each(function () {
            var $this = $(this);
            $this.on('keyup', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    callback();
                }
            });
        });
    };
    $.fn.onPressed = function (callback) {
        return this.each(function () {
            var $this = $(this);
            $this.on('click', function (e) {
                e.preventDefault();
                callback();
            });
            $this.on('keyup', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    callback();
                }
            });
        });
    };
    // Recursively removes the last empty element (img, audio, etc) or word in an element
    $.fn.removeLastWord = function (chars, depth) {
        if ('undefined' === typeof chars)
            chars = 8;
        if ('undefined' === typeof depth)
            depth = 0;
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
    $.fn.toggleClass = function (class1, class2) {
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
    $.fn.toggleExpandText = function (chars, lessText, moreText, callback) {
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
                    $toggleButton.toggleClass("less", "more");
                }
                else {
                    $self.html(collapsedText + "&nbsp;");
                    $toggleButton.text(moreText);
                    $toggleButton.toggleClass("more", "less");
                }
                $toggleButton.one('click', function (e) {
                    e.preventDefault();
                    $self.toggle();
                });
                expanded = !expanded;
                $self.append($toggleButton);
                if (callback)
                    callback();
            };
            $self.toggle();
        });
    };
    // Toggle expansion by number of lines
    $.fn.toggleExpandTextByLines = function (lines, lessText, moreText, callback) {
        return this.each(function () {
            var $self = $(this);
            var expandedText = $self.html();
            // add 'pad' to account for the right margin in the sidebar
            var $buttonPad = $('<span>&hellip; <a href="#" class="toggle more">morepad</a></span>');
            // when height changes, store string, then pick from line counts
            var stringsByLine = [expandedText];
            var lastHeight = $self.height();
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
                    $toggleButton.toggleClass("less", "more");
                }
                else {
                    $self.html(collapsedText + "&hellip; ");
                    $toggleButton.text(moreText);
                    $toggleButton.toggleClass("more", "less");
                }
                $toggleButton.one('click', function (e) {
                    e.preventDefault();
                    $self.toggle();
                });
                expanded = !expanded;
                $self.append($toggleButton);
                if (callback)
                    callback();
            };
            $self.toggle();
        });
    };
    $.fn.toggleText = function (text1, text2) {
        return this.each(function () {
            var $this = $(this);
            if ($this.text() === text1) {
                $(this).text(text2);
            }
            else {
                $(this).text(text1);
            }
        });
    };
    $.fn.updateAttr = function (attrName, oldVal, newVal) {
        return this.each(function () {
            var $this = $(this);
            var attr = $this.attr(attrName);
            if (attr && attr.indexOf(oldVal) === 0) {
                attr = attr.replace(oldVal, newVal);
                $this.attr(attrName, attr);
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

/*! Tiny Pub/Sub - v0.7.0 - 2015-04-21
* https://github.com/cowboy/jquery-tiny-pubsub
* Copyright (c) 2015 "Cowboy" Ben Alman; Licensed MIT */
!function(a){var b=null;a.initPubSub=function(){b=a({})},a.subscribe=function(){b||a.initPubSub(),b.on.apply(b,arguments)},a.unsubscribe=function(){b||a.initPubSub(),b.off.apply(b,arguments)},a.disposePubSub=function(){b=null},a.publish=function(){b||a.initPubSub(),b.trigger.apply(b,arguments)}}(jQuery);
var KeyCodes;
(function (KeyCodes) {
    var KeyDown;
    (function (KeyDown) {
        KeyDown.Backspace = 8;
        KeyDown.Tab = 9;
        KeyDown.Enter = 13;
        KeyDown.Shift = 16;
        KeyDown.Ctrl = 17;
        KeyDown.Alt = 18;
        KeyDown.PauseBreak = 19;
        KeyDown.CapsLock = 20;
        KeyDown.Escape = 27;
        KeyDown.Spacebar = 32;
        KeyDown.PageUp = 33;
        KeyDown.PageDown = 34;
        KeyDown.End = 35;
        KeyDown.Home = 36;
        KeyDown.LeftArrow = 37;
        KeyDown.UpArrow = 38;
        KeyDown.RightArrow = 39;
        KeyDown.DownArrow = 40;
        KeyDown.PrintScrn = 44;
        KeyDown.Insert = 45;
        KeyDown.Delete = 46;
        KeyDown.Zero = 48;
        KeyDown.One = 49;
        KeyDown.Two = 50;
        KeyDown.Three = 51;
        KeyDown.Four = 52;
        KeyDown.Five = 53;
        KeyDown.Six = 54;
        KeyDown.Seven = 55;
        KeyDown.Eight = 56;
        KeyDown.Nine = 57;
        KeyDown.a = 65;
        KeyDown.b = 66;
        KeyDown.c = 67;
        KeyDown.d = 68;
        KeyDown.e = 69;
        KeyDown.f = 70;
        KeyDown.g = 71;
        KeyDown.h = 72;
        KeyDown.i = 73;
        KeyDown.j = 74;
        KeyDown.k = 75;
        KeyDown.l = 76;
        KeyDown.m = 77;
        KeyDown.n = 78;
        KeyDown.o = 79;
        KeyDown.p = 80;
        KeyDown.q = 81;
        KeyDown.r = 82;
        KeyDown.s = 83;
        KeyDown.t = 84;
        KeyDown.u = 85;
        KeyDown.v = 86;
        KeyDown.w = 87;
        KeyDown.x = 88;
        KeyDown.y = 89;
        KeyDown.z = 90;
        KeyDown.LeftWindowKey = 91;
        KeyDown.RightWindowKey = 92;
        KeyDown.SelectKey = 93;
        KeyDown.Numpad0 = 96;
        KeyDown.Numpad1 = 97;
        KeyDown.Numpad2 = 98;
        KeyDown.Numpad3 = 99;
        KeyDown.Numpad4 = 100;
        KeyDown.Numpad5 = 101;
        KeyDown.Numpad6 = 102;
        KeyDown.Numpad7 = 103;
        KeyDown.Numpad8 = 104;
        KeyDown.Numpad9 = 105;
        KeyDown.Multiply = 106;
        KeyDown.NumpadPlus = 107;
        KeyDown.NumpadMinus = 109;
        KeyDown.DecimalPoint = 110;
        KeyDown.Divide = 111;
        KeyDown.F1 = 112;
        KeyDown.F2 = 113;
        KeyDown.F3 = 114;
        KeyDown.F4 = 115;
        KeyDown.F5 = 116;
        KeyDown.F6 = 117;
        KeyDown.F7 = 118;
        KeyDown.F8 = 119;
        KeyDown.F9 = 120;
        KeyDown.F10 = 121;
        KeyDown.F11 = 122;
        KeyDown.F12 = 123;
        KeyDown.NumLock = 144;
        KeyDown.ScrollLock = 145;
        KeyDown.Semicolon = 186;
        KeyDown.Equals = 187;
        KeyDown.Comma = 188;
        KeyDown.LessThan = 188;
        KeyDown.Dash = 189;
        KeyDown.Period = 190;
        KeyDown.GreaterThan = 190;
        KeyDown.ForwardSlash = 191;
        KeyDown.QuestionMark = 191;
        KeyDown.GraveAccent = 192;
        KeyDown.Tilde = 192;
        KeyDown.OpenCurlyBracket = 219;
        KeyDown.OpenSquareBracket = 219;
        KeyDown.BackSlash = 220;
        KeyDown.VerticalPipe = 220;
        KeyDown.CloseCurlyBracket = 221;
        KeyDown.CloseSquareBracket = 221;
        KeyDown.Quote = 222;
        KeyDown.CommandFF = 224;
    })(KeyDown = KeyCodes.KeyDown || (KeyCodes.KeyDown = {}));
})(KeyCodes || (KeyCodes = {}));
var KeyCodes;
(function (KeyCodes) {
    var KeyPress;
    (function (KeyPress) {
        KeyPress.Backspace = 8;
        KeyPress.Enter = 13;
        KeyPress.Spacebar = 32;
        KeyPress.Hash = 35;
        KeyPress.GraveAccent = 39;
        KeyPress.ForwardSlash = 32;
        KeyPress.Asterisk = 42;
        KeyPress.Plus = 43;
        KeyPress.Comma = 44;
        KeyPress.Minus = 45;
        KeyPress.Period = 46;
        KeyPress.ForwardSlash = 47;
        KeyPress.Zero = 48;
        KeyPress.One = 49;
        KeyPress.Two = 50;
        KeyPress.Three = 51;
        KeyPress.Four = 52;
        KeyPress.Five = 53;
        KeyPress.Six = 54;
        KeyPress.Seven = 55;
        KeyPress.Eight = 56;
        KeyPress.Nine = 57;
        KeyPress.Colon = 58;
        KeyPress.Semicolon = 59;
        KeyPress.LessThan = 60;
        KeyPress.Equals = 61;
        KeyPress.GreaterThan = 62;
        KeyPress.QuestionMark = 63;
        KeyPress.At = 64;
        KeyPress.OpenSquareBracket = 91;
        KeyPress.BackSlash = 92;
        KeyPress.CloseSquareBracket = 93;
        KeyPress.a = 97;
        KeyPress.b = 98;
        KeyPress.c = 99;
        KeyPress.d = 100;
        KeyPress.e = 101;
        KeyPress.f = 102;
        KeyPress.g = 103;
        KeyPress.h = 104;
        KeyPress.i = 105;
        KeyPress.j = 106;
        KeyPress.k = 107;
        KeyPress.l = 108;
        KeyPress.m = 109;
        KeyPress.n = 110;
        KeyPress.o = 111;
        KeyPress.p = 112;
        KeyPress.q = 113;
        KeyPress.r = 114;
        KeyPress.s = 115;
        KeyPress.t = 116;
        KeyPress.u = 117;
        KeyPress.v = 118;
        KeyPress.w = 119;
        KeyPress.x = 120;
        KeyPress.y = 121;
        KeyPress.z = 122;
        KeyPress.OpenCurlyBracket = 123;
        KeyPress.VerticalPipe = 124;
        KeyPress.CloseCurlyBracket = 125;
        KeyPress.Tilde = 126;
    })(KeyPress = KeyCodes.KeyPress || (KeyCodes.KeyPress = {}));
})(KeyCodes || (KeyCodes = {}));

var exjs;!function(r){r.version="0.4.0"}(exjs||(exjs={}));var exjs;!function(r){Array.isArray||(Array.isArray=function(r){return"[object Array]"===Object.prototype.toString.call(r)})}(exjs||(exjs={}));var exjs;!function(r){var e=function(){function r(){}return r.prototype.getEnumerator=function(){return{moveNext:function(){return!1},current:void 0}},r.prototype.aggregate=function(r,e){for(var t=r,n=this.getEnumerator();n.moveNext();)t=e(t,n.current);return t},r.prototype.all=function(r){if(r)for(var e=this.getEnumerator(),t=0;e.moveNext();){if(!r(e.current,t))return!1;t++}return!0},r.prototype.any=function(r){for(var e=this.getEnumerator(),t=0;e.moveNext();){if(!r)return!0;if(r(e.current,t))return!0;t++}return!1},r.prototype.append=function(){for(var r=[],e=0;e<arguments.length;e++)r[e-0]=arguments[e];throw new Error("Not implemented")},r.prototype.apply=function(r){throw new Error("Not implemented")},r.prototype.at=function(r){for(var e=this.getEnumerator(),t=0;e.moveNext();){if(t===r)return e.current;t++}},r.prototype.average=function(r){var e=0,t=0;r=r||function(r){if("number"!=typeof r)throw new Error("Object is not a number.");return r};for(var n=this.getEnumerator();n.moveNext();)t+=r(n.current),e++;return 0===e?0:t/e},r.prototype.concat=function(r){throw new Error("Not implemented")},r.prototype.count=function(r){for(var e=0,t=this.getEnumerator();t.moveNext();)(!r||r(t.current))&&e++;return e},r.prototype.difference=function(r,e){return e=e||function(r,e){return r===e},r instanceof Array&&(r=r.en()),{intersection:this.intersect(r,e).toArray().en(),aNotB:this.except(r,e).toArray().en(),bNotA:r.except(this,e).toArray().en()}},r.prototype.distinct=function(r){throw new Error("Not implemented")},r.prototype.except=function(r,e){throw new Error("Not implemented")},r.prototype.first=function(r){for(var e=this.getEnumerator();e.moveNext();)if(!r||r(e.current))return e.current},r.prototype.firstIndex=function(r){for(var e=this.getEnumerator(),t=0;e.moveNext();t++)if(!r||r(e.current))return t;return-1},r.prototype.forEach=function(r){for(var e=this.getEnumerator();e.moveNext();)r(e.current)},r.prototype.groupBy=function(r,e){throw new Error("Not implemented")},r.prototype.intersect=function(r,e){throw new Error("Not implemented")},r.prototype.join=function(r,e,t,n,o){throw new Error("Not implemented")},r.prototype.last=function(r){for(var e,t=this.getEnumerator();t.moveNext();)(!r||r(t.current))&&(e=t.current);return e},r.prototype.lastIndex=function(r){for(var e=-1,t=this.getEnumerator(),n=0;t.moveNext();n++)(!r||r(t.current))&&(e=n);return e},r.prototype.max=function(r){var e=this.getEnumerator();if(!e.moveNext())return 0;r=r||function(r){if("number"!=typeof r)throw new Error("Object is not a number.");return r};for(var t=r(e.current);e.moveNext();)t=Math.max(t,r(e.current));return t},r.prototype.min=function(r){var e=this.getEnumerator();if(!e.moveNext())return 0;r=r||function(r){if("number"!=typeof r)throw new Error("Object is not a number.");return r};for(var t=r(e.current);e.moveNext();)t=Math.min(t,r(e.current));return t},r.prototype.orderBy=function(r,e){throw new Error("Not implemented")},r.prototype.orderByDescending=function(r,e){throw new Error("Not implemented")},r.prototype.prepend=function(){for(var r=[],e=0;e<arguments.length;e++)r[e-0]=arguments[e];throw new Error("Not implemented")},r.prototype.reverse=function(){throw new Error("Not implemented")},r.prototype.select=function(r){throw new Error("Not implemented")},r.prototype.selectMany=function(r){throw new Error("Not implemented")},r.prototype.skip=function(r){throw new Error("Not implemented")},r.prototype.skipWhile=function(r){throw new Error("Not implemented")},r.prototype.standardDeviation=function(r){var e=this.average(r),t=0,n=0;r=r||function(r){if("number"!=typeof r)throw new Error("Object is not a number.");return r};for(var o=this.getEnumerator();o.moveNext();){var u=r(o.current)-e;t+=u*u,n++}return Math.sqrt(t/n)},r.prototype.sum=function(r){var e=0;r=r||function(r){if("number"!=typeof r)throw new Error("Object is not a number.");return r};for(var t=this.getEnumerator();t.moveNext();)e+=r(t.current);return e},r.prototype.take=function(r){throw new Error("Not implemented")},r.prototype.takeWhile=function(r){throw new Error("Not implemented")},r.prototype.traverse=function(r){throw new Error("Not implemented")},r.prototype.traverseUnique=function(r,e){throw new Error("Not implemented")},r.prototype.toArray=function(){for(var r=[],e=this.getEnumerator();e.moveNext();)r.push(e.current);return r},r.prototype.toMap=function(r,e){throw new Error("Not implemented")},r.prototype.toList=function(){throw new Error("Not implemented")},r.prototype.union=function(r,e){throw new Error("Not implemented")},r.prototype.where=function(r){throw new Error("Not implemented")},r.prototype.zip=function(r,e){throw new Error("Not implemented")},r}();r.Enumerable=e}(exjs||(exjs={}));var Symbol,exjs;!function(r){function e(r){var e;return{next:function(){var t={done:!0,value:void 0};return r&&(e=e||r.getEnumerator())?(t.done=!e.moveNext(),t.value=e.current,t):t}}}Symbol&&Symbol.iterator&&(r.Enumerable.prototype[Symbol.iterator]=function(){return e(this)})}(exjs||(exjs={}));var exjs;!function(r){var e=function(){function e(r){this.size=0,this._keys=[],this._values=[];var e;if(r instanceof Array?e=r.en():r&&r.getEnumerator instanceof Function&&(e=r),e)for(var t=e.getEnumerator();t&&t.moveNext();)this.set(t.current[0],t.current[1])}return e.prototype.clear=function(){this._keys.length=0,this._values.length=0,this.size=0},e.prototype["delete"]=function(r){var e=this._keys.indexOf(r);return e>-1?(this._keys.splice(e,1),this._values.splice(e,1),this.size--,!0):!1},e.prototype.entries=function(){var e=this;return r.range(0,this.size).select(function(r){return[e._keys[r],e._values[r]]})},e.prototype.forEach=function(r,e){null==e&&(e=this);for(var t=0,n=this._keys,o=this._values,u=n.length;u>t;t++)r.call(e,o[t],n[t],this)},e.prototype.get=function(r){var e=this._keys.indexOf(r);return this._values[e]},e.prototype.has=function(r){return this._keys.indexOf(r)>-1},e.prototype.keys=function(){return this._keys.en()},e.prototype.set=function(r,e){var t=this._keys.indexOf(r);t>-1?this._values[t]=e:(this._keys.push(r),this._values.push(e),this.size++)},e.prototype.values=function(){return this._values.en()},e}();r.Map3=e,r.Enumerable.prototype.toMap=function(r,t){for(var n=new e,o=this.getEnumerator();o.moveNext();)n.set(r(o.current),t(o.current));return n},r.List&&(r.List.prototype.toMap=r.Enumerable.prototype.toMap)}(exjs||(exjs={})),function(r){r.Map||(r.Map=exjs.Map3)}("undefined"==typeof window?global:window);var exjs;!function(r){function e(e){var t=new r.Enumerable;return t.getEnumerator=function(){var r={current:void 0,moveNext:function(){return e(r)}};return r},t}r.anonymous=e}(exjs||(exjs={}));var exjs;!function(r){function e(r,e){var t,n,o=1,u={current:void 0,moveNext:function(){if(2>o){if(t=t||r.getEnumerator(),t.moveNext())return u.current=t.current,!0;o++}return n=n||e.en().getEnumerator(),n.moveNext()?(u.current=n.current,!0):(u.current=void 0,!1)}};return u}r.Enumerable.prototype.append=function(){for(var t=this,n=[],o=0;o<arguments.length;o++)n[o-0]=arguments[o];var u=new r.Enumerable;return u.getEnumerator=function(){return e(t,n)},u},r.List&&(r.List.prototype.append=r.Enumerable.prototype.append)}(exjs||(exjs={}));var exjs;!function(r){function e(r,e){var t,n=0,o={current:void 0,moveNext:function(){return t||(t=r.getEnumerator()),t.moveNext()?(e(o.current=t.current,n),n++,!0):!1}};return o}r.Enumerable.prototype.apply=function(t){var n=this,o=new r.Enumerable;return o.getEnumerator=function(){return e(n,t)},o},r.List&&(r.List.prototype.apply=r.Enumerable.prototype.apply)}(exjs||(exjs={}));var __extends=this&&this.__extends||function(r,e){function t(){this.constructor=r}for(var n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);r.prototype=null===e?Object.create(e):(t.prototype=e.prototype,new t)},exjs;!function(r){function e(r){var e=r.length,t={moveNext:void 0,current:void 0},n=-1;return t.moveNext=function(){return n++,n>=e?(t.current=void 0,!1):(t.current=r[n],!0)},t}function t(){return this&&Array.isArray(this)?new n(this):new r.Enumerable}var n=function(r){function t(t){r.call(this),this.getEnumerator=function(){return e(t)},this.toArray=function(){return t.slice(0)}}return __extends(t,r),t}(r.Enumerable);try{Object.defineProperty(Array.prototype,"en",{value:t,enumerable:!1,writable:!1,configurable:!1})}catch(o){Array.prototype.en=t}}(exjs||(exjs={}));var exjs;!function(r){function e(r,e){var t,n=!1,o={current:void 0,moveNext:function(){return t||(t=r.getEnumerator()),o.current=void 0,t.moveNext()?(o.current=t.current,!0):n?!1:(n=!0,t=e.getEnumerator(),t.moveNext()?(o.current=t.current,!0):!1)}};return o}r.Enumerable.prototype.concat=function(t){var n=this,o=t instanceof Array?t.en():t,u=new r.Enumerable;return u.getEnumerator=function(){return e(n,o)},u},r.List&&(r.List.prototype.concat=r.Enumerable.prototype.concat)}(exjs||(exjs={}));var exjs;!function(r){function e(r,e){var t,n=[],o={current:void 0,moveNext:function(){if(t||(t=r.getEnumerator()),o.current=void 0,!e){for(;t.moveNext();)if(n.indexOf(t.current)<0)return n.push(o.current=t.current),!0;return!1}for(;t.moveNext();){for(var u=0,i=n.length,c=!1;i>u&&!c;u++)c=!!e(n[u],t.current);if(!c)return n.push(o.current=t.current),!0}return!1}};return o}r.Enumerable.prototype.distinct=function(t){var n=this,o=new r.Enumerable;return o.getEnumerator=function(){return e(n,t)},o},r.List&&(r.List.prototype.distinct=r.Enumerable.prototype.distinct)}(exjs||(exjs={}));var exjs;!function(r){function e(r,e,t){t=t||function(r,e){return r===e};var n,o={current:void 0,moveNext:function(){for(n||(n=r.getEnumerator()),o.current=void 0;n.moveNext();){for(var u=!1,i=e.getEnumerator();i.moveNext()&&!u;)u=t(n.current,i.current);if(!u)return o.current=n.current,!0}return!1}};return o}r.Enumerable.prototype.except=function(t,n){var o=this,u=t instanceof Array?t.en():t,i=new r.Enumerable;return i.getEnumerator=function(){return e(o,u,n)},i},r.List&&(r.List.prototype.except=r.Enumerable.prototype.except)}(exjs||(exjs={})),Function.prototype.fromJson=function(r,e){function t(r,e){if(null==r)return r;if(e instanceof Function)return e(r);if(e instanceof Array){if(e=e[0],!(e instanceof Function&&r instanceof Array))return;for(var t=[],n=0;n<r.length;n++)t.push(e(r[n]));return t}}var n=new this;if(null==r)return n;var o=[];for(var u in e){var i=t(r[u],e[u]);void 0!==i&&(n[u]=i,o.push(u))}for(var u in this.$jsonMappings)if(!(o.indexOf(u)>-1)){var i=t(r[u],this.$jsonMappings[u]);void 0!==i&&(n[u]=i,o.push(u))}for(var u in r)o.indexOf(u)>-1||(n[u]=r[u]);return n};var exjs;!function(r){function e(r,e,n){var o,u=0,i={current:void 0,moveNext:function(){return o||(o=t(r,e,n)),i.current=void 0,u>=o.length?!1:(i.current=o[u],u++,!0)}};return i}function t(r,e,t){t=t||function(r,e){return r===e};for(var o,u=[],i=[],c=r.getEnumerator();c.moveNext();){o=e(c.current);for(var a=-1,p=0,s=i.length;s>p;p++)if(t(o,i[p])){a=p;break}var f;0>a?(i.push(o),u.push(f=new n(o))):f=u[a],f._add(c.current)}return u}var n=function(r){function e(e){var t=this;r.call(this),this.key=e,this._arr=[],this.getEnumerator=function(){return t._arr.en().getEnumerator()}}return __extends(e,r),e.prototype._add=function(r){this._arr.push(r)},e}(r.Enumerable);r.Enumerable.prototype.groupBy=function(t,n){var o=this,u=new r.Enumerable;return u.getEnumerator=function(){return e(o,t,n)},u},r.List&&(r.List.prototype.groupBy=r.Enumerable.prototype.groupBy)}(exjs||(exjs={}));var exjs;!function(r){function e(e,t,n){n=n||function(r,e){return r===e};var o,u={current:void 0,moveNext:function(){for(o||(o=r.en(e).distinct().getEnumerator()),u.current=void 0;o.moveNext();){for(var i=!1,c=t.getEnumerator();c.moveNext()&&!i;)i=n(o.current,c.current);if(i)return u.current=o.current,!0}return!1}};return u}r.Enumerable.prototype.intersect=function(t,n){var o=this,u=t instanceof Array?t.en():t,i=new r.Enumerable;return i.getEnumerator=function(){return e(o,u,n)},i},r.List&&(r.List.prototype.intersect=r.Enumerable.prototype.intersect)}(exjs||(exjs={}));var exjs;!function(r){function e(e,t,n,o,u,i){i=i||function(r,e){return r===e};var c,a,p=0,s={current:void 0,moveNext:function(){if(s.current=void 0,!c){if(c=e.getEnumerator(),!c.moveNext())return!1;a=r.en(t).toArray()}var f;do{for(;p<a.length;p++)if(f=a[p],i(n(c.current),o(f)))return p++,s.current=u(c.current,f),!0;p=0}while(c.moveNext());return!1}};return s}r.Enumerable.prototype.join=function(t,n,o,u,i){var c=this,a=t instanceof Array?t.en():t,p=new r.Enumerable;return p.getEnumerator=function(){return e(c,a,n,o,u,i)},p},r.List&&(r.List.prototype.join=r.Enumerable.prototype.join)}(exjs||(exjs={}));var exjs;!function(r){function e(){this.constructor=t}r.Enumerable.prototype.toList=function(){for(var r=new t,e=this.getEnumerator();e.moveNext();)r.push(e.current);return r};var t=function(r){function e(){r.apply(this,arguments)}return __extends(e,r),e.prototype.toString=function(){throw new Error("Not implemented")},e.prototype.toLocaleString=function(){throw new Error("Not implemented")},e.prototype.pop=function(){throw new Error("Not implemented")},e.prototype.push=function(){for(var r=[],e=0;e<arguments.length;e++)r[e-0]=arguments[e];throw new Error("Not implemented")},e.prototype.shift=function(){throw new Error("Not implemented")},e.prototype.slice=function(r,e){throw new Error("Not implemented")},e.prototype.sort=function(r){throw new Error("Not implemented")},e.prototype.splice=function(){throw new Error("Not implemented")},e.prototype.unshift=function(){for(var r=[],e=0;e<arguments.length;e++)r[e-0]=arguments[e];throw new Error("Not implemented")},e.prototype.indexOf=function(r,e){throw new Error("Not implemented")},e.prototype.lastIndexOf=function(r,e){throw new Error("Not implemented")},e.prototype.every=function(r,e){throw new Error("Not implemented")},e.prototype.some=function(r,e){throw new Error("Not implemented")},e.prototype.forEach=function(r,e){throw new Error("Not implemented")},e.prototype.map=function(r,e){throw new Error("Not implemented")},e.prototype.filter=function(r,e){throw new Error("Not implemented")},e.prototype.reduce=function(r,e){throw new Error("Not implemented")},e.prototype.reduceRight=function(r,e){throw new Error("Not implemented")},e.prototype.remove=function(r){throw new Error("Not implemented")},e.prototype.removeWhere=function(r){throw new Error("Not implemented")},e}(r.Enumerable);r.List=t;for(var n in Array)Array.hasOwnProperty(n)&&(t[n]=Array[n]);e.prototype=Array.prototype,t.prototype=new e;for(var o in r.Enumerable.prototype)"getEnumerator"!==o&&(t.prototype[o]=r.Enumerable.prototype[o]);t.prototype.getEnumerator=function(){var r=this,e=r.length,t={moveNext:void 0,current:void 0},n=-1;return t.moveNext=function(){return n++,n>=e?(t.current=void 0,!1):(t.current=r[n],!0)},t},t.prototype.remove=function(r){return this.removeWhere(function(e){return e===r}).any()},t.prototype.removeWhere=function(r){for(var e,t=[],n=this.length-1;n>=0;n--)e=this[n],r(e,n)===!0&&(this.splice(n,1),t.push(e));return t.en().reverse()}}(exjs||(exjs={}));var exjs;!function(r){function e(r,e,n,o){return new t(r,e,n,o)}var t=function(e){function t(r,t,n,o){e.call(this),this.Source=r,o=o||function(r,e){return r>e?1:e>r?-1:0};var u=n===!0?-1:1;this.Sorter=function(r,e){return u*o(t(r),t(e))}}return __extends(t,e),t.prototype.getEnumerator=function(){var e,t=this.Source,n=this.Sorter,o=0,u={current:void 0,moveNext:function(){return e||(e=r.en(t).toArray(),e.sort(n)),u.current=void 0,o>=e.length?!1:(u.current=e[o],o++,!0)}};return u},t.prototype.thenBy=function(r,e){return new n(this,r,!1,e)},t.prototype.thenByDescending=function(r,e){return new n(this,r,!0,e)},t}(r.Enumerable),n=function(r){function e(e,t,n,o){r.call(this,e,t,n,o);var u=e.Sorter,i=this.Sorter;this.Sorter=function(r,e){return u(r,e)||i(r,e)}}return __extends(e,r),e}(t),o=r.Enumerable.prototype;o.orderBy=function(r,t){return e(this,r,!1,t)},o.orderByDescending=function(r,t){return e(this,r,!0,t)},r.List&&(r.List.prototype.orderBy=r.Enumerable.prototype.orderBy,r.List.prototype.orderByDescending=r.Enumerable.prototype.orderByDescending)}(exjs||(exjs={}));var exjs;!function(r){function e(r,e){var t,n,o=1,u={current:void 0,moveNext:function(){if(2>o){if(t=t||e.en().getEnumerator(),t.moveNext())return u.current=t.current,!0;o++}return n=n||r.getEnumerator(),n.moveNext()?(u.current=n.current,!0):(u.current=void 0,!1)}};return u}r.Enumerable.prototype.prepend=function(){for(var t=this,n=[],o=0;o<arguments.length;o++)n[o-0]=arguments[o];var u=new r.Enumerable;return u.getEnumerator=function(){return e(t,n)},u},r.List&&(r.List.prototype.prepend=r.Enumerable.prototype.prepend)}(exjs||(exjs={}));var exjs;!function(r){function e(r,e,t){var n=r-t,o={current:void 0,moveNext:function(){return n+=t,n>=e?!1:(o.current=n,!0)}};return o}function t(t,n,o){if(t=t||0,n=n||0,t>n)throw new Error("Start cannot be greater than end.");null==o&&(o=1);var u=new r.Enumerable;return u.getEnumerator=function(){return e(t,n,o)},u}r.range=t}(exjs||(exjs={}));var exjs;!function(r){function e(e){var t,n=0,o={current:void 0,moveNext:function(){return t||(t=r.en(e).toArray(),n=t.length),n--,o.current=t[n],n>=0}};return o}r.Enumerable.prototype.reverse=function(){var t=this,n=new r.Enumerable;return n.getEnumerator=function(){return e(t)},n},r.List&&(r.List.prototype.reverse=r.Enumerable.prototype.reverse)}(exjs||(exjs={}));var exjs;!function(r){function e(r,e){if(e=e||0,0===e)return Math.round(r);var t=Math.pow(10,e);return Math.round(r*t)/t}r.round=e}(exjs||(exjs={}));var exjs;!function(r){function e(r,e){var t,n=0,o={current:void 0,moveNext:function(){return t||(t=r.getEnumerator()),t.moveNext()?(o.current=e(t.current,n),n++,!0):!1}};return o}function t(e,t){var n,o,u={current:void 0,moveNext:function(){for(u.current=void 0,n||(n=e.getEnumerator());!o||!o.moveNext();){if(!n.moveNext())return!1;o=r.selectorEnumerator(t(n.current))}return u.current=o.current,!0}};return u}r.Enumerable.prototype.select=function(t){var n=this,o=new r.Enumerable;return o.getEnumerator=function(){return e(n,t)},o},r.Enumerable.prototype.selectMany=function(e){var n=this,o=new r.Enumerable;return o.getEnumerator=function(){return t(n,e)},o},r.List&&(r.List.prototype.select=r.Enumerable.prototype.select,r.List.prototype.selectMany=r.Enumerable.prototype.selectMany)}(exjs||(exjs={}));var exjs;!function(r){function e(r){return Array.isArray(r)?r.en().getEnumerator():null!=r&&"function"==typeof r.getEnumerator?r.getEnumerator():null}r.selectorEnumerator=e}(exjs||(exjs={}));var exjs;!function(r){function e(r,e){var t,n={current:void 0,moveNext:function(){if(!t){t=r.getEnumerator();for(var o=0;e>o;o++)if(!t.moveNext())return!1}return t.moveNext()?(n.current=t.current,!0):(n.current=void 0,!1)}};return n}function t(r,e){var t,n={current:void 0,moveNext:function(){if(!t){t=r.getEnumerator();for(var o=0;t.moveNext();o++)if(!e(n.current=t.current,o))return!0;return n.current=void 0,!1}return t.moveNext()?(n.current=t.current,!0):(n.current=void 0,!1)}};return n}r.Enumerable.prototype.skip=function(t){var n=this,o=new r.Enumerable;return o.getEnumerator=function(){return e(n,t)},o},r.Enumerable.prototype.skipWhile=function(e){var n=this,o=new r.Enumerable;return o.getEnumerator=function(){return t(n,e)},o},r.List&&(r.List.prototype.skip=r.Enumerable.prototype.skip,r.List.prototype.skipWhile=r.Enumerable.prototype.skipWhile)}(exjs||(exjs={}));var exjs;!function(r){function e(r,e){var t,n=0,o={current:void 0,moveNext:function(){return t||(t=r.getEnumerator()),n++,n>e?!1:(o.current=void 0,t.moveNext()?(o.current=t.current,!0):!1)}};return o}function t(r,e){var t,n=0,o={current:void 0,moveNext:function(){return t||(t=r.getEnumerator()),t.moveNext()&&e(t.current,n)?(n++,o.current=t.current,!0):(o.current=void 0,!1)}};return o}r.Enumerable.prototype.take=function(t){var n=this,o=new r.Enumerable;return o.getEnumerator=function(){return e(n,t)},o},r.Enumerable.prototype.takeWhile=function(e){var n=this,o=new r.Enumerable;return o.getEnumerator=function(){return t(n,e)},o},r.List&&(r.List.prototype.take=r.Enumerable.prototype.take,r.List.prototype.takeWhile=r.Enumerable.prototype.takeWhile)}(exjs||(exjs={}));var exjs;!function(r){function e(e,t){var n,o=!1,u=[],i={current:void 0,moveNext:function(){if(o){if(null==n)return!1;u.push(n),n=r.selectorEnumerator(t(i.current))}else n=e.getEnumerator(),o=!0;for(;!(n&&n.moveNext()||u.length<1);)n=u.pop();return i.current=null==n?void 0:n.current,void 0!==i.current}};return i}function t(e,t,n){var o,u=!1,i=[],c={current:void 0,moveNext:function(){if(u){if(null==o)return!1;i.push(o),o=r.selectorEnumerator(t(c.current))}else o=e.getEnumerator(),u=!0;do{for(;!(o&&o.moveNext()||i.length<1);)o=i.pop();c.current=null==o?void 0:o.current}while(n(c.current));return void 0!==c.current}};return c}r.Enumerable.prototype.traverse=function(t){var n=this,o=new r.Enumerable;return o.getEnumerator=function(){return e(n,t)},o},r.Enumerable.prototype.traverseUnique=function(e,n){var o=this,u=[],i=new r.Enumerable;return n?i.getEnumerator=function(){return t(o,e,function(r){return u.some(function(e){return n(r,e)})?!0:(u.push(r),!1)})}:i.getEnumerator=function(){return t(o,e,function(r){return u.indexOf(r)>-1?!0:(u.push(r),!1)})},i},r.List&&(r.List.prototype.traverse=r.Enumerable.prototype.traverse,r.List.prototype.traverseUnique=r.Enumerable.prototype.traverseUnique)}(exjs||(exjs={}));var exjs;!function(r){function e(e,t,n){n=n||function(r,e){return r===e};var o,u,i=[],c={current:void 0,moveNext:function(){if(o||(o=r.en(e).distinct().getEnumerator()),c.current=void 0,!u&&o.moveNext())return i.push(c.current=o.current),!0;for(u=u||r.en(t).distinct().getEnumerator();u.moveNext();){for(var a=0,p=!1,s=i.length;s>a&&!p;a++)p=n(i[a],u.current);if(!p)return c.current=u.current,!0}return!1}};return c}r.Enumerable.prototype.union=function(t,n){var o=this,u=t instanceof Array?t.en():t,i=new r.Enumerable;return i.getEnumerator=function(){return e(o,u,n)},i},r.List&&(r.List.prototype.union=r.Enumerable.prototype.union)}(exjs||(exjs={}));var exjs;!function(r){function e(r,e){var t,n={current:void 0,moveNext:function(){t||(t=r.getEnumerator());for(var o;t.moveNext();)if(e(o=t.current))return n.current=o,!0;return!1}};return n}r.Enumerable.prototype.where=function(t){var n=this,o=new r.Enumerable;return o.getEnumerator=function(){return e(n,t)},o},r.List&&(r.List.prototype.where=r.Enumerable.prototype.where)}(exjs||(exjs={}));var exjs;!function(r){function e(e){var n=new r.Enumerable;return n.getEnumerator=function(){return t(e)},n}function t(r){var e=r.getEnumerator(),t={current:void 0,moveNext:void 0};return t.moveNext=function(){return e.moveNext()?(t.current=e.current,!0):(t.current=void 0,!1)},t}r.en=e}(exjs||(exjs={}));var ex=exjs.en,exjs;!function(r){function e(r,e,t){var n,o,u={current:void 0,moveNext:function(){return n||(n=r.getEnumerator()),o||(o=e.getEnumerator()),u.current=void 0,n.moveNext()&&o.moveNext()?(u.current=t(n.current,o.current),!0):!1}};return u}r.Enumerable.prototype.zip=function(t,n){var o=this,u=t instanceof Array?t.en():t,i=new r.Enumerable;return i.getEnumerator=function(){return e(o,u,n)},i},r.List&&(r.List.prototype.zip=r.Enumerable.prototype.zip)}(exjs||(exjs={}));
//# sourceMappingURL=ex.es3.min.js.map

// extensions v0.1.9 https://github.com/edsilv/extensions
Array.prototype.clone||(Array.prototype.clone=function(){return this.slice(0)}),Array.prototype.contains||(Array.prototype.contains=function(val){return-1!==this.indexOf(val)}),Array.prototype.indexOf||(Array.prototype.indexOf=function(searchElement,fromIndex){var i=fromIndex||0,j=this.length;for(i;j>i;i++)if(this[i]===searchElement)return i;return-1}),Array.prototype.indexOfTest=function(test,fromIndex){var i=fromIndex||0,j=this.length;for(i;j>i;i++)if(test(this[i]))return i;return-1},Array.prototype.insert=function(item,index){this.splice(index,0,item)},Array.prototype.last||(Array.prototype.last=function(){return this[this.length-1]}),Array.prototype.move=function(fromIndex,toIndex){this.splice(toIndex,0,this.splice(fromIndex,1)[0])},Array.prototype.remove=function(item){var index=this.indexOf(item);index>-1&&this.splice(index,1)},Array.prototype.removeAt=function(index){this.splice(index,1)},Math.clamp=function(value,min,max){return Math.min(Math.max(value,min),max)},Math.constrain=function(value,low,high){return Math.clamp(value,low,high)},Math.degreesToRadians=function(degrees){return Math.TAU*(degrees/360)},Math.distanceBetween=function(x1,y1,x2,y2){return Math.sqrt(Math.sq(x2-x1)+Math.sq(y2-y1))},Math.lerp=function(start,stop,amount){return start+(stop-start)*amount},Math.mag=function(a,b,c){return Math.sqrt(a*a+b*b+c*c)},Math.map=function(value,start1,stop1,start2,stop2){return start2+(stop2-start2)*((value-start1)/(stop1-start1))},Math.median=function(values){values.sort(function(a,b){return a-b});var half=Math.floor(values.length/2);return values.length%2?values[half]:(values[half-1]+values[half])/2},Math.normalise=function(num,min,max){return(num-min)/(max-min)},Math.radiansToDegrees=function(radians){return 360*radians/Math.TAU},Math.randomBetween=function(low,high){return high||(high=low,low=0),low>=high?low:low+(high-low)*Math.random()},Math.roundToDecimalPlace=function(num,dec){return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec)},Math.sq=function(n){return n*n},Math.TAU=2*Math.PI,Number.prototype.isInteger||(Number.prototype.isInteger=function(){return this%1===0}),"function"!=typeof Object.create&&(Object.create=function(o,props){function F(){}F.prototype=o;var result=new F;if("object"==typeof props)for(var prop in props)props.hasOwnProperty(prop)&&(result[prop]=props[prop].value);return result}),Object.keys||(Object.keys=function(){var hasOwnProperty=Object.prototype.hasOwnProperty,hasDontEnumBug=!{toString:null}.propertyIsEnumerable("toString"),dontEnums=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],dontEnumsLength=dontEnums.length;return function(obj){if("object"!=typeof obj&&"function"!=typeof obj||null===obj)throw new TypeError("Object.keys called on non-object");var result=[];for(var prop in obj)hasOwnProperty.call(obj,prop)&&result.push(prop);if(hasDontEnumBug)for(var i=0;dontEnumsLength>i;i++)hasOwnProperty.call(obj,dontEnums[i])&&result.push(dontEnums[i]);return result}}()),String.prototype.b64_to_utf8=function(){return decodeURIComponent(escape(window.atob(this)))},String.prototype.contains=function(str){return-1!==this.indexOf(str)},String.prototype.endsWith||(String.prototype.endsWith=function(str){return-1!==this.indexOf(str,this.length-str.length)}),String.format=function(){for(var s=arguments[0],i=0;i<arguments.length-1;i++){var reg=new RegExp("\\{"+i+"\\}","gm");s=s.replace(reg,arguments[i+1])}return s},String.prototype.hashCode=function(){var i,chr,len,hash=0;if(0===this.length)return hash.toString();for(i=0,len=this.length;len>i;i++)chr=this.charCodeAt(i),hash=(hash<<5)-hash+chr,hash|=0;return hash.toString()},String.prototype.isAlphanumeric=function(){return/^[a-zA-Z0-9]*$/.test(this)},String.prototype.ltrim=function(){return this.replace(/^\s+/,"")},String.prototype.rtrim=function(){return this.replace(/\s+$/,"")},String.prototype.startsWith||(String.prototype.startsWith=function(str){return 0==this.indexOf(str)}),String.prototype.toCssClass=function(){return this.replace(/[^a-z0-9]/g,function(s){var c=s.charCodeAt(0);return 32==c?"-":c>=65&&90>=c?"_"+s.toLowerCase():"__"+("000"+c.toString(16)).slice(-4)})},String.prototype.toFileName=function(){return this.replace(/[^a-z0-9]/gi,"_").toLowerCase()},String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s\s*/,"").replace(/\s\s*$/,"")}),String.prototype.utf8_to_b64=function(){return window.btoa(unescape(encodeURIComponent(this)))};
var HTTPStatusCode;
(function (HTTPStatusCode) {
    HTTPStatusCode.CONTINUE = 100;
    HTTPStatusCode.SWITCHING_PROTOCOLS = 101;
    HTTPStatusCode.PROCESSING = 102;
    HTTPStatusCode.OK = 200;
    HTTPStatusCode.CREATED = 201;
    HTTPStatusCode.ACCEPTED = 202;
    HTTPStatusCode.NON_AUTHORITATIVE_INFORMATION = 203;
    HTTPStatusCode.NO_CONTENT = 204;
    HTTPStatusCode.RESET_CONTENT = 205;
    HTTPStatusCode.PARTIAL_CONTENT = 206;
    HTTPStatusCode.MULTI_STATUS = 207;
    HTTPStatusCode.MULTIPLE_CHOICES = 300;
    HTTPStatusCode.MOVED_PERMANENTLY = 301;
    HTTPStatusCode.MOVED_TEMPORARILY = 302;
    HTTPStatusCode.SEE_OTHER = 303;
    HTTPStatusCode.NOT_MODIFIED = 304;
    HTTPStatusCode.USE_PROXY = 305;
    HTTPStatusCode.TEMPORARY_REDIRECT = 307;
    HTTPStatusCode.BAD_REQUEST = 400;
    HTTPStatusCode.UNAUTHORIZED = 401;
    HTTPStatusCode.PAYMENT_REQUIRED = 402;
    HTTPStatusCode.FORBIDDEN = 403;
    HTTPStatusCode.NOT_FOUND = 404;
    HTTPStatusCode.METHOD_NOT_ALLOWED = 405;
    HTTPStatusCode.NOT_ACCEPTABLE = 406;
    HTTPStatusCode.PROXY_AUTHENTICATION_REQUIRED = 407;
    HTTPStatusCode.REQUEST_TIME_OUT = 408;
    HTTPStatusCode.CONFLICT = 409;
    HTTPStatusCode.GONE = 410;
    HTTPStatusCode.LENGTH_REQUIRED = 411;
    HTTPStatusCode.PRECONDITION_FAILED = 412;
    HTTPStatusCode.REQUEST_ENTITY_TOO_LARGE = 413;
    HTTPStatusCode.REQUEST_URI_TOO_LARGE = 414;
    HTTPStatusCode.UNSUPPORTED_MEDIA_TYPE = 415;
    HTTPStatusCode.REQUESTED_RANGE_NOT_SATISFIABLE = 416;
    HTTPStatusCode.EXPECTATION_FAILED = 417;
    HTTPStatusCode.IM_A_TEAPOT = 418;
    HTTPStatusCode.UNPROCESSABLE_ENTITY = 422;
    HTTPStatusCode.LOCKED = 423;
    HTTPStatusCode.FAILED_DEPENDENCY = 424;
    HTTPStatusCode.UNORDERED_COLLECTION = 425;
    HTTPStatusCode.UPGRADE_REQUIRED = 426;
    HTTPStatusCode.PRECONDITION_REQUIRED = 428;
    HTTPStatusCode.TOO_MANY_REQUESTS = 429;
    HTTPStatusCode.REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
    HTTPStatusCode.INTERNAL_SERVER_ERROR = 500;
    HTTPStatusCode.NOT_IMPLEMENTED = 501;
    HTTPStatusCode.BAD_GATEWAY = 502;
    HTTPStatusCode.SERVICE_UNAVAILABLE = 503;
    HTTPStatusCode.GATEWAY_TIME_OUT = 504;
    HTTPStatusCode.HTTP_VERSION_NOT_SUPPORTED = 505;
    HTTPStatusCode.VARIANT_ALSO_NEGOTIATES = 506;
    HTTPStatusCode.INSUFFICIENT_STORAGE = 507;
    HTTPStatusCode.BANDWIDTH_LIMIT_EXCEEDED = 509;
    HTTPStatusCode.NOT_EXTENDED = 510;
    HTTPStatusCode.NETWORK_AUTHENTICATION_REQUIRED = 511;
})(HTTPStatusCode || (HTTPStatusCode = {}));

!function(f){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=f();else if("function"==typeof define&&define.amd)define([],f);else{var g;g="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,g.manifesto=f()}}(function(){var define;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){(function(global){var Manifesto;!function(Manifesto){var StringValue=function(){function StringValue(value){this.value="",value&&(this.value=value.toLowerCase())}return StringValue.prototype.toString=function(){return this.value},StringValue}();Manifesto.StringValue=StringValue}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var AnnotationMotivation=function(_super){function AnnotationMotivation(){_super.apply(this,arguments)}return __extends(AnnotationMotivation,_super),AnnotationMotivation.prototype.bookmarking=function(){return new AnnotationMotivation(AnnotationMotivation.BOOKMARKING.toString())},AnnotationMotivation.prototype.classifying=function(){return new AnnotationMotivation(AnnotationMotivation.CLASSIFYING.toString())},AnnotationMotivation.prototype.commenting=function(){return new AnnotationMotivation(AnnotationMotivation.COMMENTING.toString())},AnnotationMotivation.prototype.describing=function(){return new AnnotationMotivation(AnnotationMotivation.DESCRIBING.toString())},AnnotationMotivation.prototype.editing=function(){return new AnnotationMotivation(AnnotationMotivation.EDITING.toString())},AnnotationMotivation.prototype.highlighting=function(){return new AnnotationMotivation(AnnotationMotivation.HIGHLIGHTING.toString())},AnnotationMotivation.prototype.identifying=function(){return new AnnotationMotivation(AnnotationMotivation.IDENTIFYING.toString())},AnnotationMotivation.prototype.linking=function(){return new AnnotationMotivation(AnnotationMotivation.LINKING.toString())},AnnotationMotivation.prototype.moderating=function(){return new AnnotationMotivation(AnnotationMotivation.MODERATING.toString())},AnnotationMotivation.prototype.painting=function(){return new AnnotationMotivation(AnnotationMotivation.PAINTING.toString())},AnnotationMotivation.prototype.questioning=function(){return new AnnotationMotivation(AnnotationMotivation.QUESTIONING.toString())},AnnotationMotivation.prototype.replying=function(){return new AnnotationMotivation(AnnotationMotivation.REPLYING.toString())},AnnotationMotivation.prototype.tagging=function(){return new AnnotationMotivation(AnnotationMotivation.TAGGING.toString())},AnnotationMotivation.prototype.transcribing=function(){return new AnnotationMotivation(AnnotationMotivation.TRANSCRIBING.toString())},AnnotationMotivation.BOOKMARKING=new AnnotationMotivation("oa:bookmarking"),AnnotationMotivation.CLASSIFYING=new AnnotationMotivation("oa:classifying"),AnnotationMotivation.COMMENTING=new AnnotationMotivation("oa:commenting"),AnnotationMotivation.DESCRIBING=new AnnotationMotivation("oa:describing"),AnnotationMotivation.EDITING=new AnnotationMotivation("oa:editing"),AnnotationMotivation.HIGHLIGHTING=new AnnotationMotivation("oa:highlighting"),AnnotationMotivation.IDENTIFYING=new AnnotationMotivation("oa:identifying"),AnnotationMotivation.LINKING=new AnnotationMotivation("oa:linking"),AnnotationMotivation.MODERATING=new AnnotationMotivation("oa:moderating"),AnnotationMotivation.PAINTING=new AnnotationMotivation("sc:painting"),AnnotationMotivation.QUESTIONING=new AnnotationMotivation("oa:questioning"),AnnotationMotivation.REPLYING=new AnnotationMotivation("oa:replying"),AnnotationMotivation.TAGGING=new AnnotationMotivation("oa:tagging"),AnnotationMotivation.TRANSCRIBING=new AnnotationMotivation("oad:transcribing"),AnnotationMotivation}(Manifesto.StringValue);Manifesto.AnnotationMotivation=AnnotationMotivation}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var ElementType=function(_super){function ElementType(){_super.apply(this,arguments)}return __extends(ElementType,_super),ElementType.prototype.canvas=function(){return new ElementType(ElementType.CANVAS.toString())},ElementType.prototype.document=function(){return new ElementType(ElementType.DOCUMENT.toString())},ElementType.prototype.image=function(){return new ElementType(ElementType.IMAGE.toString())},ElementType.prototype.movingimage=function(){return new ElementType(ElementType.MOVINGIMAGE.toString())},ElementType.prototype.physicalobject=function(){return new ElementType(ElementType.PHYSICALOBJECT.toString())},ElementType.prototype.sound=function(){return new ElementType(ElementType.SOUND.toString())},ElementType.CANVAS=new ElementType("sc:canvas"),ElementType.DOCUMENT=new ElementType("foaf:document"),ElementType.IMAGE=new ElementType("dcTypes:image"),ElementType.MOVINGIMAGE=new ElementType("dctypes:movingimage"),ElementType.PHYSICALOBJECT=new ElementType("dctypes:physicalobject"),ElementType.SOUND=new ElementType("dctypes:sound"),ElementType}(Manifesto.StringValue);Manifesto.ElementType=ElementType}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var IIIFResourceType=function(_super){function IIIFResourceType(){_super.apply(this,arguments)}return __extends(IIIFResourceType,_super),IIIFResourceType.prototype.manifest=function(){return new IIIFResourceType(IIIFResourceType.MANIFEST.toString())},IIIFResourceType.prototype.collection=function(){return new IIIFResourceType(IIIFResourceType.COLLECTION.toString())},IIIFResourceType.MANIFEST=new IIIFResourceType("sc:manifest"),IIIFResourceType.COLLECTION=new IIIFResourceType("sc:collection"),IIIFResourceType}(Manifesto.StringValue);Manifesto.IIIFResourceType=IIIFResourceType}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var ManifestType=function(_super){function ManifestType(){_super.apply(this,arguments)}return __extends(ManifestType,_super),ManifestType.prototype.empty=function(){return new ManifestType(ManifestType.EMPTY.toString())},ManifestType.prototype.manuscript=function(){return new ManifestType(ManifestType.MANUSCRIPT.toString())},ManifestType.prototype.monograph=function(){return new ManifestType(ManifestType.MONOGRAPH.toString())},ManifestType.EMPTY=new ManifestType(""),ManifestType.MANUSCRIPT=new ManifestType("manuscript"),ManifestType.MONOGRAPH=new ManifestType("monograph"),ManifestType}(Manifesto.StringValue);Manifesto.ManifestType=ManifestType}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var RenderingFormat=function(_super){function RenderingFormat(){_super.apply(this,arguments)}return __extends(RenderingFormat,_super),RenderingFormat.prototype.pdf=function(){return new RenderingFormat(RenderingFormat.PDF.toString())},RenderingFormat.prototype.doc=function(){return new RenderingFormat(RenderingFormat.DOC.toString())},RenderingFormat.prototype.docx=function(){return new RenderingFormat(RenderingFormat.DOCX.toString())},RenderingFormat.PDF=new RenderingFormat("application/pdf"),RenderingFormat.DOC=new RenderingFormat("application/msword"),RenderingFormat.DOCX=new RenderingFormat("application/vnd.openxmlformats-officedocument.wordprocessingml.document"),RenderingFormat}(Manifesto.StringValue);Manifesto.RenderingFormat=RenderingFormat}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var ResourceFormat=function(_super){function ResourceFormat(){_super.apply(this,arguments)}return __extends(ResourceFormat,_super),ResourceFormat.prototype.jpgimage=function(){return new ResourceFormat(ResourceFormat.JPGIMAGE.toString())},ResourceFormat.prototype.pdf=function(){return new ResourceFormat(ResourceFormat.PDF.toString())},ResourceFormat.JPGIMAGE=new ResourceFormat("image/jpeg"),ResourceFormat.PDF=new ResourceFormat("application/pdf"),ResourceFormat}(Manifesto.StringValue);Manifesto.ResourceFormat=ResourceFormat}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var ResourceType=function(_super){function ResourceType(){_super.apply(this,arguments)}return __extends(ResourceType,_super),ResourceType.prototype.image=function(){return new ResourceType(ResourceType.IMAGE.toString())},ResourceType.IMAGE=new ResourceType("dctypes:image"),ResourceType}(Manifesto.StringValue);Manifesto.ResourceType=ResourceType}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var ServiceProfile=function(_super){function ServiceProfile(){_super.apply(this,arguments)}return __extends(ServiceProfile,_super),ServiceProfile.prototype.autoComplete=function(){return new ServiceProfile(ServiceProfile.AUTOCOMPLETE.toString())},ServiceProfile.prototype.iiif1ImageLevel1=function(){return new ServiceProfile(ServiceProfile.IIIF1IMAGELEVEL1.toString())},ServiceProfile.prototype.iiif1ImageLevel2=function(){return new ServiceProfile(ServiceProfile.IIIF1IMAGELEVEL2.toString())},ServiceProfile.prototype.iiif2ImageLevel1=function(){return new ServiceProfile(ServiceProfile.IIIF2IMAGELEVEL1.toString())},ServiceProfile.prototype.iiif2ImageLevel2=function(){return new ServiceProfile(ServiceProfile.IIIF2IMAGELEVEL2.toString())},ServiceProfile.prototype.ixif=function(){return new ServiceProfile(ServiceProfile.IXIF.toString())},ServiceProfile.prototype.login=function(){return new ServiceProfile(ServiceProfile.LOGIN.toString())},ServiceProfile.prototype.clickThrough=function(){return new ServiceProfile(ServiceProfile.CLICKTHROUGH.toString())},ServiceProfile.prototype.restricted=function(){return new ServiceProfile(ServiceProfile.RESTRICTED.toString())},ServiceProfile.prototype.logout=function(){return new ServiceProfile(ServiceProfile.LOGOUT.toString())},ServiceProfile.prototype.otherManifestations=function(){return new ServiceProfile(ServiceProfile.OTHERMANIFESTATIONS.toString())},ServiceProfile.prototype.searchWithin=function(){return new ServiceProfile(ServiceProfile.SEARCHWITHIN.toString())},ServiceProfile.prototype.stanfordIIIFImageCompliance1=function(){return new ServiceProfile(ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE1.toString())},ServiceProfile.prototype.stanfordIIIFImageCompliance2=function(){return new ServiceProfile(ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE2.toString())},ServiceProfile.prototype.stanfordIIIFImageConformance1=function(){return new ServiceProfile(ServiceProfile.STANFORDIIIFIMAGECONFORMANCE1.toString())},ServiceProfile.prototype.stanfordIIIFImageConformance2=function(){return new ServiceProfile(ServiceProfile.STANFORDIIIFIMAGECONFORMANCE2.toString())},ServiceProfile.prototype.stanfordIIIF1ImageCompliance1=function(){return new ServiceProfile(ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE1.toString())},ServiceProfile.prototype.stanfordIIIF1ImageCompliance2=function(){return new ServiceProfile(ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE2.toString())},ServiceProfile.prototype.stanfordIIIF1ImageConformance1=function(){return new ServiceProfile(ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE1.toString())},ServiceProfile.prototype.stanfordIIIF1ImageConformance2=function(){return new ServiceProfile(ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE2.toString())},ServiceProfile.prototype.token=function(){return new ServiceProfile(ServiceProfile.TOKEN.toString())},ServiceProfile.prototype.trackingExtensions=function(){return new ServiceProfile(ServiceProfile.TRACKINGEXTENSIONS.toString())},ServiceProfile.prototype.uiExtensions=function(){return new ServiceProfile(ServiceProfile.UIEXTENSIONS.toString())},ServiceProfile.AUTOCOMPLETE=new ServiceProfile("http://iiif.io/api/search/0/autocomplete"),ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE0=new ServiceProfile("http://library.stanford.edu/iiif/image-api/compliance.html#level0"),ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE1=new ServiceProfile("http://library.stanford.edu/iiif/image-api/compliance.html#level1"),ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE2=new ServiceProfile("http://library.stanford.edu/iiif/image-api/compliance.html#level2"),ServiceProfile.STANFORDIIIFIMAGECONFORMANCE0=new ServiceProfile("http://library.stanford.edu/iiif/image-api/conformance.html#level0"),ServiceProfile.STANFORDIIIFIMAGECONFORMANCE1=new ServiceProfile("http://library.stanford.edu/iiif/image-api/conformance.html#level1"),ServiceProfile.STANFORDIIIFIMAGECONFORMANCE2=new ServiceProfile("http://library.stanford.edu/iiif/image-api/conformance.html#level2"),ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE0=new ServiceProfile("http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level0"),ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE1=new ServiceProfile("http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level1"),ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE2=new ServiceProfile("http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level2"),ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE0=new ServiceProfile("http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level0"),ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE1=new ServiceProfile("http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level1"),ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE2=new ServiceProfile("http://library.stanford.edu/iiif/image-api/1.1/conformance.html#level2"),ServiceProfile.IIIF1IMAGELEVEL0=new ServiceProfile("http://iiif.io/api/image/1/level0.json"),ServiceProfile.IIIF1IMAGELEVEL0PROFILE=new ServiceProfile("http://iiif.io/api/image/1/profiles/level0.json"),ServiceProfile.IIIF1IMAGELEVEL1=new ServiceProfile("http://iiif.io/api/image/1/level1.json"),ServiceProfile.IIIF1IMAGELEVEL1PROFILE=new ServiceProfile("http://iiif.io/api/image/1/profiles/level1.json"),ServiceProfile.IIIF1IMAGELEVEL2=new ServiceProfile("http://iiif.io/api/image/1/level2.json"),ServiceProfile.IIIF1IMAGELEVEL2PROFILE=new ServiceProfile("http://iiif.io/api/image/1/profiles/level2.json"),ServiceProfile.IIIF2IMAGELEVEL0=new ServiceProfile("http://iiif.io/api/image/2/level0.json"),ServiceProfile.IIIF2IMAGELEVEL0PROFILE=new ServiceProfile("http://iiif.io/api/image/2/profiles/level0.json"),ServiceProfile.IIIF2IMAGELEVEL1=new ServiceProfile("http://iiif.io/api/image/2/level1.json"),ServiceProfile.IIIF2IMAGELEVEL1PROFILE=new ServiceProfile("http://iiif.io/api/image/2/profiles/level1.json"),ServiceProfile.IIIF2IMAGELEVEL2=new ServiceProfile("http://iiif.io/api/image/2/level2.json"),ServiceProfile.IIIF2IMAGELEVEL2PROFILE=new ServiceProfile("http://iiif.io/api/image/2/profiles/level2.json"),ServiceProfile.IXIF=new ServiceProfile("http://wellcomelibrary.org/ld/ixif/0/alpha.json"),ServiceProfile.LOGIN=new ServiceProfile("http://iiif.io/api/auth/0/login"),ServiceProfile.CLICKTHROUGH=new ServiceProfile("http://iiif.io/api/auth/0/login/clickthrough"),ServiceProfile.RESTRICTED=new ServiceProfile("http://iiif.io/api/auth/0/login/restricted"),ServiceProfile.LOGOUT=new ServiceProfile("http://iiif.io/api/auth/0/logout"),ServiceProfile.OTHERMANIFESTATIONS=new ServiceProfile("http://iiif.io/api/otherManifestations.json"),ServiceProfile.SEARCHWITHIN=new ServiceProfile("http://iiif.io/api/search/0/search"),ServiceProfile.TOKEN=new ServiceProfile("http://iiif.io/api/auth/0/token"),ServiceProfile.TRACKINGEXTENSIONS=new ServiceProfile("http://universalviewer.io/tracking-extensions-profile"),ServiceProfile.UIEXTENSIONS=new ServiceProfile("http://universalviewer.io/ui-extensions-profile"),ServiceProfile}(Manifesto.StringValue);Manifesto.ServiceProfile=ServiceProfile}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var ViewingDirection=function(_super){function ViewingDirection(){_super.apply(this,arguments)}return __extends(ViewingDirection,_super),ViewingDirection.prototype.leftToRight=function(){return new ViewingDirection(ViewingDirection.LEFTTORIGHT.toString())},ViewingDirection.prototype.rightToLeft=function(){return new ViewingDirection(ViewingDirection.RIGHTTOLEFT.toString())},ViewingDirection.prototype.topToBottom=function(){return new ViewingDirection(ViewingDirection.TOPTOBOTTOM.toString())},ViewingDirection.prototype.bottomToTop=function(){return new ViewingDirection(ViewingDirection.BOTTOMTOTOP.toString())},ViewingDirection.LEFTTORIGHT=new ViewingDirection("left-to-right"),ViewingDirection.RIGHTTOLEFT=new ViewingDirection("right-to-left"),ViewingDirection.TOPTOBOTTOM=new ViewingDirection("top-to-bottom"),ViewingDirection.BOTTOMTOTOP=new ViewingDirection("bottom-to-top"),ViewingDirection}(Manifesto.StringValue);Manifesto.ViewingDirection=ViewingDirection}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var ViewingHint=function(_super){function ViewingHint(){_super.apply(this,arguments)}return __extends(ViewingHint,_super),ViewingHint.prototype.continuous=function(){return new ViewingHint(ViewingHint.CONTINUOUS.toString())},ViewingHint.prototype.empty=function(){return new ViewingHint(ViewingHint.EMPTY.toString())},ViewingHint.prototype.individuals=function(){return new ViewingHint(ViewingHint.INDIVIDUALS.toString())},ViewingHint.prototype.nonPaged=function(){return new ViewingHint(ViewingHint.NONPAGED.toString())},ViewingHint.prototype.paged=function(){return new ViewingHint(ViewingHint.PAGED.toString())},ViewingHint.prototype.top=function(){return new ViewingHint(ViewingHint.TOP.toString())},ViewingHint.CONTINUOUS=new ViewingHint("continuous"),ViewingHint.EMPTY=new ViewingHint(""),ViewingHint.INDIVIDUALS=new ViewingHint("individuals"),ViewingHint.NONPAGED=new ViewingHint("non-paged"),ViewingHint.PAGED=new ViewingHint("paged"),ViewingHint.TOP=new ViewingHint("top"),ViewingHint}(Manifesto.StringValue);Manifesto.ViewingHint=ViewingHint}(Manifesto||(Manifesto={}));var Manifesto;!function(Manifesto){var JSONLDResource=function(){function JSONLDResource(jsonld){this.__jsonld=jsonld,this.context=this.getProperty("@context"),this.id=this.getProperty("@id")}return JSONLDResource.prototype.getProperty=function(name){return this.__jsonld[name]},JSONLDResource}();Manifesto.JSONLDResource=JSONLDResource}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var ManifestResource=function(_super){function ManifestResource(jsonld,options){_super.call(this,jsonld),this.options=options}return __extends(ManifestResource,_super),ManifestResource.prototype.getLabel=function(){return Manifesto.Utils.getLocalisedValue(this.getProperty("label"),this.options.locale)},ManifestResource.prototype.getMetadata=function(){var metadata=this.getProperty("metadata");if(!metadata)return[];for(var i=0;i<metadata.length;i++){var item=metadata[i];item.label=Manifesto.Utils.getLocalisedValue(item.label,this.options.locale),item.value=Manifesto.Utils.getLocalisedValue(item.value,this.options.locale)}return metadata},ManifestResource.prototype.getRendering=function(format){var renderings=this.getRenderings();"string"!=typeof format&&(format=format.toString());for(var i=0;i<renderings.length;i++){var rendering=renderings[i];if(rendering.getFormat().toString()===format)return rendering}return null},ManifestResource.prototype.getRenderings=function(){var rendering;rendering=this.__jsonld?this.__jsonld.rendering:this.rendering;var renderings=[];if(!rendering)return renderings;_isArray(rendering)||(rendering=[rendering]);for(var i=0;i<rendering.length;i++){var r=rendering[i];renderings.push(new Manifesto.Rendering(r,this.options))}return renderings},ManifestResource.prototype.getService=function(profile){return Manifesto.Utils.getService(this,profile)},ManifestResource.prototype.getServices=function(){return Manifesto.Utils.getServices(this)},ManifestResource}(Manifesto.JSONLDResource);Manifesto.ManifestResource=ManifestResource}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var Element=function(_super){function Element(jsonld,options){_super.call(this,jsonld,options)}return __extends(Element,_super),Element.prototype.getResources=function(){var resources=[];if(!this.__jsonld.resources)return resources;for(var i=0;i<this.__jsonld.resources.length;i++){var a=this.__jsonld.resources[i],annotation=new Manifesto.Annotation(a,this.options);resources.push(annotation)}return resources},Element.prototype.getType=function(){return new Manifesto.ElementType(this.getProperty("@type"))},Element}(Manifesto.ManifestResource);Manifesto.Element=Element}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)},_endsWith=require("lodash.endswith"),_last=require("lodash.last");!function(Manifesto){var Canvas=function(_super){function Canvas(jsonld,options){_super.call(this,jsonld,options)}return __extends(Canvas,_super),Canvas.prototype.getCanonicalImageUri=function(w){var id,size,region="full",rotation=0,quality="default",width=w;if(this.externalResource&&this.externalResource.data)id=this.externalResource.data["@id"],width||(width=this.externalResource.data.width),(this.externalResource.data["@context"].indexOf("/1.0/context.json")>-1||this.externalResource.data["@context"].indexOf("/1.1/context.json")>-1||this.externalResource.data["@context"].indexOf("/1/context.json")>-1)&&(quality="native");else{var images=this.getImages();if(images&&images.length){var firstImage=images[0],resource=firstImage.getResource(),services=resource.getServices();if(width||(width=resource.getWidth()),services.length){var service=services[0];id=service.id,quality=Manifesto.Utils.getImageQuality(service.getProfile())}}if(!id)return"undefined"==typeof this.__jsonld.thumbnail?null:this.__jsonld.thumbnail}size=width+",";var uri=[id,region,size,rotation,quality+".jpg"].join("/");return uri},Canvas.prototype.getImages=function(){var images=[];if(!this.__jsonld.images)return images;for(var i=0;i<this.__jsonld.images.length;i++){var a=this.__jsonld.images[i],annotation=new Manifesto.Annotation(a,this.options);images.push(annotation)}return images},Canvas.prototype.getIndex=function(){return this.getProperty("index")},Canvas.prototype.getWidth=function(){return this.getProperty("width")},Canvas.prototype.getHeight=function(){return this.getProperty("height")},Canvas}(Manifesto.Element);Manifesto.Canvas=Canvas}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)},_assign=require("lodash.assign");!function(Manifesto){var IIIFResource=function(_super){function IIIFResource(jsonld,options){_super.call(this,jsonld,options),this.index=-1,this.isLoaded=!1;var defaultOptions={defaultLabel:"-",locale:"en-GB",resource:this,pessimisticAccessControl:!1};this.options=_assign(defaultOptions,options)}return __extends(IIIFResource,_super),IIIFResource.prototype.generateTreeNodeIds=function(treeNode,index){void 0===index&&(index=0);var id;id=treeNode.parentNode?treeNode.parentNode.id+"-"+index:"0",treeNode.id=id;for(var i=0;i<treeNode.nodes.length;i++){var n=treeNode.nodes[i];this.generateTreeNodeIds(n,i)}},IIIFResource.prototype.getAttribution=function(){return Manifesto.Utils.getLocalisedValue(this.getProperty("attribution"),this.options.locale)},IIIFResource.prototype.getDescription=function(){return Manifesto.Utils.getLocalisedValue(this.getProperty("description"),this.options.locale)},IIIFResource.prototype.getIIIFResourceType=function(){return new Manifesto.IIIFResourceType(this.getProperty("@type"))},IIIFResource.prototype.getLogo=function(){var logo=this.getProperty("logo");return logo?_isString(logo)?logo:logo["@id"]:null},IIIFResource.prototype.getLicense=function(){return Manifesto.Utils.getLocalisedValue(this.getProperty("license"),this.options.locale)},IIIFResource.prototype.getNavDate=function(){return new Date(this.getProperty("navDate"))},IIIFResource.prototype.getSeeAlso=function(){return Manifesto.Utils.getLocalisedValue(this.getProperty("seeAlso"),this.options.locale)},IIIFResource.prototype.getLabel=function(){return Manifesto.Utils.getLocalisedValue(this.getProperty("label"),this.options.locale)},IIIFResource.prototype.getTree=function(){return this.treeRoot=new Manifesto.TreeNode("root"),this.treeRoot.data=this,this.treeRoot},IIIFResource.prototype.load=function(){var that=this;return new Promise(function(resolve,reject){if(that.isLoaded)resolve(that);else{var options=that.options;options.navDate=that.getNavDate(),Manifesto.Utils.loadResource(that.__jsonld["@id"]).then(function(data){that.parentLabel=that.getLabel();var parsed=Manifesto.Deserialiser.parse(data,options);that=_assign(that,parsed),that.index=options.index,resolve(that)})}})},IIIFResource}(Manifesto.ManifestResource);Manifesto.IIIFResource=IIIFResource}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)},_isArray=require("lodash.isarray"),_map=require("lodash.map");!function(Manifesto){var Manifest=function(_super){function Manifest(jsonld,options){if(_super.call(this,jsonld,options),this.index=0,this._ranges=null,this._sequences=null,this.__jsonld.structures&&this.__jsonld.structures.length){var r=this._getRootRange();this._parseRanges(r,"")}}return __extends(Manifest,_super),Manifest.prototype._getRootRange=function(){var range;if(this.__jsonld.structures&&this.__jsonld.structures.length){for(var i=0;i<this.__jsonld.structures.length;i++){var r=this.__jsonld.structures[i];r.viewingHint===Manifesto.ViewingHint.TOP.toString()&&(range=r)}range||(range={},range.ranges=this.__jsonld.structures)}return range},Manifest.prototype._getRangeById=function(id){if(this.__jsonld.structures&&this.__jsonld.structures.length)for(var i=0;i<this.__jsonld.structures.length;i++){var r=this.__jsonld.structures[i];if(r["@id"]===id)return r}return null},Manifest.prototype._parseRanges=function(r,path,parentRange){var range;if(_isString(r)&&(r=this._getRangeById(r)),range=new Manifesto.Range(r,this.options),parentRange?(range.parentRange=parentRange,parentRange.ranges.push(range)):this.rootRange=range,range.path=path,r.ranges)for(var j=0;j<r.ranges.length;j++)this._parseRanges(r.ranges[j],path+"/"+j,range)},Manifest.prototype.getRanges=function(){return null!=this._ranges?this._ranges:(this._ranges=[],this.rootRange&&(this._ranges=this.rootRange.ranges.en().traverseUnique(function(range){return range.ranges}).toArray()),this._ranges)},Manifest.prototype.getRangeById=function(id){for(var ranges=this.getRanges(),i=0;i<ranges.length;i++){var range=ranges[i];if(range.id===id)return range}return null},Manifest.prototype.getRangeByPath=function(path){for(var ranges=this.getRanges(),i=0;i<ranges.length;i++){var range=ranges[i];if(range.path===path)return range}return null},Manifest.prototype.getSequences=function(){if(null!=this._sequences)return this._sequences;this._sequences=[];var children=this.__jsonld.mediaSequences||this.__jsonld.sequences;if(children)for(var i=0;i<children.length;i++){var s=children[i],sequence=new Manifesto.Sequence(s,this.options);this._sequences.push(sequence)}return this._sequences},Manifest.prototype.getSequenceByIndex=function(sequenceIndex){return this.getSequences()[sequenceIndex]},Manifest.prototype.getTotalSequences=function(){return this.getSequences().length},Manifest.prototype.getTree=function(){if(_super.prototype.getTree.call(this),this.treeRoot.data.type=Manifesto.TreeNodeType.MANIFEST.toString(),!this.isLoaded)return this.treeRoot;if(!this.rootRange)return this.treeRoot;if(this.treeRoot.data=this.rootRange,this.rootRange.treeNode=this.treeRoot,this.rootRange.ranges)for(var i=0;i<this.rootRange.ranges.length;i++){var range=this.rootRange.ranges[i],node=new Manifesto.TreeNode;this.treeRoot.addNode(node),this._parseTreeNode(node,range)}return this.generateTreeNodeIds(this.treeRoot),this.treeRoot},Manifest.prototype._parseTreeNode=function(node,range){if(node.label=range.getLabel(),node.data=range,node.data.type=Manifesto.TreeNodeType.RANGE.toString(),range.treeNode=node,range.ranges)for(var i=0;i<range.ranges.length;i++){var childRange=range.ranges[i],childNode=new Manifesto.TreeNode;node.addNode(childNode),this._parseTreeNode(childNode,childRange)}},Manifest.prototype.getManifestType=function(){var service=this.getService(Manifesto.ServiceProfile.UIEXTENSIONS);return service?new Manifesto.ManifestType(service.getProperty("manifestType")):new Manifesto.ManifestType("")},Manifest.prototype.getTrackingLabel=function(){var service=this.getService(Manifesto.ServiceProfile.TRACKINGEXTENSIONS);return service?service.getProperty("trackingLabel"):""},Manifest.prototype.isMultiSequence=function(){return this.getTotalSequences()>1},Manifest.prototype.getViewingDirection=function(){return this.getProperty("viewingDirection")?new Manifesto.ViewingDirection(this.getProperty("viewingDirection")):Manifesto.ViewingDirection.LEFTTORIGHT},Manifest.prototype.getViewingHint=function(){return this.getProperty("viewingHint")?new Manifesto.ViewingHint(this.getProperty("viewingHint")):Manifesto.ViewingHint.EMPTY},Manifest}(Manifesto.IIIFResource);Manifesto.Manifest=Manifest}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __);
};!function(Manifesto){var Collection=function(_super){function Collection(jsonld,options){_super.call(this,jsonld,options),this.collections=[],this.manifests=[],jsonld.__collection=this}return __extends(Collection,_super),Collection.prototype.getCollectionByIndex=function(collectionIndex){var collection=this.collections[collectionIndex];return collection.options.index=collectionIndex,collection.load()},Collection.prototype.getManifestByIndex=function(manifestIndex){var manifest=this.manifests[manifestIndex];return manifest.options.index=manifestIndex,manifest.load()},Collection.prototype.getTotalCollections=function(){return this.collections.length},Collection.prototype.getTotalManifests=function(){return this.manifests.length},Collection.prototype.getTree=function(){return _super.prototype.getTree.call(this),this.treeRoot.data.type=Manifesto.TreeNodeType.COLLECTION.toString(),this._parseManifests(this),this._parseCollections(this),this.generateTreeNodeIds(this.treeRoot),this.treeRoot},Collection.prototype._parseManifests=function(parentCollection){if(parentCollection.manifests&&parentCollection.manifests.length)for(var i=0;i<parentCollection.manifests.length;i++){var manifest=parentCollection.manifests[i],tree=manifest.getTree();tree.label=manifest.parentLabel||manifest.getLabel()||"manifest "+(i+1),tree.navDate=manifest.getNavDate(),tree.data.id=manifest.id,tree.data.type=Manifesto.TreeNodeType.MANIFEST.toString(),parentCollection.treeRoot.addNode(tree)}},Collection.prototype._parseCollections=function(parentCollection){if(parentCollection.collections&&parentCollection.collections.length)for(var i=0;i<parentCollection.collections.length;i++){var collection=parentCollection.collections[i],tree=collection.getTree();tree.label=collection.parentLabel||collection.getLabel()||"collection "+(i+1),tree.navDate=collection.getNavDate(),tree.data.id=collection.id,tree.data.type=Manifesto.TreeNodeType.COLLECTION.toString(),parentCollection.treeRoot.addNode(tree),this._parseCollections(collection)}},Collection}(Manifesto.IIIFResource);Manifesto.Collection=Collection}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var Range=function(_super){function Range(jsonld,options){_super.call(this,jsonld,options),this.ranges=[]}return __extends(Range,_super),Range.prototype.getCanvasIds=function(){return this.__jsonld.canvases?this.__jsonld.canvases:[]},Range.prototype.getViewingDirection=function(){return this.getProperty("viewingDirection")?new Manifesto.ViewingDirection(this.getProperty("viewingDirection")):null},Range.prototype.getViewingHint=function(){return this.getProperty("viewingHint")?new Manifesto.ViewingHint(this.getProperty("viewingHint")):null},Range}(Manifesto.ManifestResource);Manifesto.Range=Range}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var Rendering=function(_super){function Rendering(jsonld,options){_super.call(this,jsonld,options)}return __extends(Rendering,_super),Rendering.prototype.getFormat=function(){return new Manifesto.RenderingFormat(this.getProperty("format"))},Rendering}(Manifesto.ManifestResource);Manifesto.Rendering=Rendering}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)},_last=require("lodash.last");!function(Manifesto){var Sequence=function(_super){function Sequence(jsonld,options){_super.call(this,jsonld,options),this.canvases=null}return __extends(Sequence,_super),Sequence.prototype.getCanvases=function(){if(null!=this.canvases)return this.canvases;this.canvases=[];var children=this.__jsonld.elements||this.__jsonld.canvases;if(children)for(var i=0;i<children.length;i++){var c=children[i],canvas=new Manifesto.Canvas(c,this.options);canvas.index=i,this.canvases.push(canvas)}return this.canvases},Sequence.prototype.getCanvasById=function(id){for(var i=0;i<this.getTotalCanvases();i++){var canvas=this.getCanvasByIndex(i);if(canvas.id===id)return canvas}return null},Sequence.prototype.getCanvasByIndex=function(canvasIndex){return this.getCanvases()[canvasIndex]},Sequence.prototype.getCanvasIndexById=function(id){for(var i=0;i<this.getTotalCanvases();i++){var canvas=this.getCanvasByIndex(i);if(canvas.id===id)return i}return null},Sequence.prototype.getCanvasIndexByLabel=function(label,foliated){label=label.trim(),isNaN(label)||(label=parseInt(label,10).toString(),foliated&&(label+="r"));for(var match,regExp,regStr,labelPart1,labelPart2,doublePageRegExp=/(\d*)\D+(\d*)/,i=0;i<this.getTotalCanvases();i++){var canvas=this.getCanvasByIndex(i);if(canvas.getLabel()===label)return i;if(match=doublePageRegExp.exec(label),match&&(labelPart1=match[1],labelPart2=match[2],labelPart2&&(regStr="^"+labelPart1+"\\D+"+labelPart2+"$",regExp=new RegExp(regStr),regExp.test(canvas.getLabel()))))return i}return-1},Sequence.prototype.getLastCanvasLabel=function(alphanumeric){for(var i=this.getTotalCanvases()-1;i>=0;i--){var canvas=this.getCanvasByIndex(i),label=canvas.getLabel();if(alphanumeric){var regExp=/^[a-zA-Z0-9]*$/;if(regExp.test(label))return label}else if(label)return label}return this.options.defaultLabel},Sequence.prototype.getLastPageIndex=function(){return this.getTotalCanvases()-1},Sequence.prototype.getNextPageIndex=function(canvasIndex,pagingEnabled){var index;if(pagingEnabled){var indices=this.getPagedIndices(canvasIndex);index=this.getViewingDirection().toString()===Manifesto.ViewingDirection.RIGHTTOLEFT.toString()?indices[0]+1:_last(indices)+1}else index=canvasIndex+1;return index>this.getLastPageIndex()?-1:index},Sequence.prototype.getPagedIndices=function(canvasIndex,pagingEnabled){var indices=[];return pagingEnabled?(indices=this.isFirstCanvas(canvasIndex)||this.isLastCanvas(canvasIndex)?[canvasIndex]:canvasIndex%2?[canvasIndex,canvasIndex+1]:[canvasIndex-1,canvasIndex],this.getViewingDirection().toString()===Manifesto.ViewingDirection.RIGHTTOLEFT.toString()&&(indices=indices.reverse())):indices.push(canvasIndex),indices},Sequence.prototype.getPrevPageIndex=function(canvasIndex,pagingEnabled){var index;if(pagingEnabled){var indices=this.getPagedIndices(canvasIndex);index=this.getViewingDirection().toString()===Manifesto.ViewingDirection.RIGHTTOLEFT.toString()?_last(indices)-1:indices[0]-1}else index=canvasIndex-1;return index},Sequence.prototype.getStartCanvasIndex=function(){var startCanvas=this.getStartCanvas();if(startCanvas)for(var i=0;i<this.getTotalCanvases();i++){var canvas=this.getCanvasByIndex(i);if(canvas.id===startCanvas)return i}return 0},Sequence.prototype.getThumbs=function(width,height){for(var thumbs=[],totalCanvases=this.getTotalCanvases(),i=0;totalCanvases>i;i++){var canvas=this.getCanvasByIndex(i);thumbs.push(new Manifesto.Thumb(width,canvas))}return thumbs},Sequence.prototype.getStartCanvas=function(){return this.getProperty("startCanvas")},Sequence.prototype.getTotalCanvases=function(){return this.getCanvases().length},Sequence.prototype.getViewingDirection=function(){return this.getProperty("viewingDirection")?new Manifesto.ViewingDirection(this.getProperty("viewingDirection")):this.options.resource.getViewingDirection?this.options.resource.getViewingDirection():Manifesto.ViewingDirection.LEFTTORIGHT},Sequence.prototype.getViewingHint=function(){return this.getProperty("viewingHint")?new Manifesto.ViewingHint(this.getProperty("viewingHint")):Manifesto.ViewingHint.EMPTY},Sequence.prototype.isCanvasIndexOutOfRange=function(canvasIndex){return canvasIndex>this.getTotalCanvases()-1},Sequence.prototype.isFirstCanvas=function(canvasIndex){return 0===canvasIndex},Sequence.prototype.isLastCanvas=function(canvasIndex){return canvasIndex===this.getTotalCanvases()-1},Sequence.prototype.isMultiCanvas=function(){return this.getTotalCanvases()>1},Sequence.prototype.isPagingEnabled=function(){return this.getViewingHint().toString()===Manifesto.ViewingHint.PAGED.toString()},Sequence.prototype.isTotalCanvasesEven=function(){return this.getTotalCanvases()%2===0},Sequence}(Manifesto.ManifestResource);Manifesto.Sequence=Sequence}(Manifesto||(Manifesto={}));var Manifesto,_isString=require("lodash.isstring");!function(Manifesto){var Deserialiser=function(){function Deserialiser(){}return Deserialiser.parse=function(manifest,options){return this.parseJson(JSON.parse(manifest),options)},Deserialiser.parseJson=function(json,options){var resource;switch(options&&options.navDate&&!isNaN(options.navDate.getTime())&&(json.navDate=options.navDate.toString()),json["@type"]){case"sc:Collection":resource=this.parseCollection(json,options);break;case"sc:Manifest":resource=this.parseManifest(json,options);break;default:return null}return resource.isLoaded=!0,resource},Deserialiser.parseCollection=function(json,options){var collection=new Manifesto.Collection(json,options);return options?collection.index=options.index||0:collection.index=0,this.parseCollections(collection,options),this.parseManifests(collection,options),collection},Deserialiser.parseCollections=function(collection,options){var children=collection.__jsonld.collections;if(children)for(var i=0;i<children.length;i++){options&&(options.index=i);var child=this.parseCollection(children[i],options);child.index=i,child.parentCollection=collection,collection.collections.push(child)}},Deserialiser.parseManifest=function(json,options){var manifest=new Manifesto.Manifest(json,options);return manifest},Deserialiser.parseManifests=function(collection,options){var children=collection.__jsonld.manifests;if(children)for(var i=0;i<children.length;i++){var child=this.parseManifest(children[i],options);child.index=i,child.parentCollection=collection,collection.manifests.push(child)}},Deserialiser}();Manifesto.Deserialiser=Deserialiser;var Serialiser=function(){function Serialiser(){}return Serialiser.serialise=function(manifest){return""},Serialiser}();Manifesto.Serialiser=Serialiser}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)},_endsWith=require("lodash.endswith"),_isArray=require("lodash.isarray");!function(Manifesto){var Service=function(_super){function Service(jsonld,options){_super.call(this,jsonld,options)}return __extends(Service,_super),Service.prototype.getProfile=function(){var profile=this.getProperty("profile");return profile||(profile=this.getProperty("dcterms:conformsTo")),_isArray(profile)?new Manifesto.ServiceProfile(profile[0]):new Manifesto.ServiceProfile(profile)},Service.prototype.getDescription=function(){return Manifesto.Utils.getLocalisedValue(this.getProperty("description"),this.options.locale)},Service.prototype.getInfoUri=function(){var infoUri=this.id;return _endsWith(infoUri,"/")||(infoUri+="/"),infoUri+="info.json"},Service}(Manifesto.ManifestResource);Manifesto.Service=Service}(Manifesto||(Manifesto={}));var Manifesto;!function(Manifesto){var Thumb=function(){function Thumb(width,canvas){this.data=canvas,this.index=canvas.index,this.width=width;var heightRatio=canvas.getHeight()/canvas.getWidth();heightRatio?this.height=Math.floor(this.width*heightRatio):this.height=width,this.uri=canvas.getCanonicalImageUri(width),this.label=canvas.getLabel()}return Thumb}();Manifesto.Thumb=Thumb}(Manifesto||(Manifesto={}));var Manifesto;!function(Manifesto){var TreeNode=function(){function TreeNode(label,data){this.label=label,this.data=data||{},this.nodes=[]}return TreeNode.prototype.addNode=function(node){this.nodes.push(node),node.parentNode=this},TreeNode.prototype.isCollection=function(){return this.data.type===Manifesto.TreeNodeType.COLLECTION.toString()},TreeNode.prototype.isManifest=function(){return this.data.type===Manifesto.TreeNodeType.MANIFEST.toString()},TreeNode.prototype.isRange=function(){return this.data.type===Manifesto.TreeNodeType.RANGE.toString()},TreeNode}();Manifesto.TreeNode=TreeNode}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var TreeNodeType=function(_super){function TreeNodeType(){_super.apply(this,arguments)}return __extends(TreeNodeType,_super),TreeNodeType.prototype.collection=function(){return new TreeNodeType(TreeNodeType.COLLECTION.toString())},TreeNodeType.prototype.manifest=function(){return new TreeNodeType(TreeNodeType.MANIFEST.toString())},TreeNodeType.prototype.range=function(){return new TreeNodeType(TreeNodeType.RANGE.toString())},TreeNodeType.COLLECTION=new TreeNodeType("sc:collection"),TreeNodeType.MANIFEST=new TreeNodeType("sc:manifest"),TreeNodeType.RANGE=new TreeNodeType("sc:range"),TreeNodeType}(Manifesto.StringValue);Manifesto.TreeNodeType=TreeNodeType}(Manifesto||(Manifesto={}));var Manifesto,http=require("http"),url=require("url");!function(Manifesto){var Utils=function(){function Utils(){}return Utils.getImageQuality=function(profile){var p=profile.toString();return p===Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE1.toString()||p===Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE2.toString()||p===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE1.toString()||p===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE2.toString()||p===Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE1.toString()||p===Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE2.toString()||p===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE1.toString()||p===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE2.toString()||p===Manifesto.ServiceProfile.IIIF1IMAGELEVEL1.toString()||p===Manifesto.ServiceProfile.IIIF1IMAGELEVEL1PROFILE.toString()||p===Manifesto.ServiceProfile.IIIF1IMAGELEVEL2.toString()||p===Manifesto.ServiceProfile.IIIF1IMAGELEVEL2PROFILE.toString()?"native":"default"},Utils.getLocalisedValue=function(resource,locale){if(!_isArray(resource))return resource;for(var i=0;i<resource.length;i++){var value=resource[i],language=value["@language"];if(locale===language)return value["@value"]}for(var match=locale.substr(0,locale.indexOf("-")),i=0;i<resource.length;i++){var value=resource[i],language=value["@language"];if(language===match)return value["@value"]}return null},Utils.loadResource=function(uri){return new Promise(function(resolve,reject){var u=url.parse(uri),request=http.request({host:u.hostname,port:u.port,path:u.path,method:"GET",withCredentials:!1},function(response){var result="";response.on("data",function(chunk){result+=chunk}),response.on("end",function(){resolve(result)})});request.on("error",function(error){reject(error)}),request.end()})},Utils.loadExternalResource=function(resource,tokenStorageStrategy,clickThrough,restricted,login,getAccessToken,storeAccessToken,getStoredAccessToken,handleResourceResponse,options){return new Promise(function(resolve,reject){options&&options.pessimisticAccessControl?resource.getData().then(function(){resource.isAccessControlled()?resource.clickThroughService?resolve(clickThrough(resource)):resource.restrictedService?resolve(restricted(resource)):login(resource).then(function(){getAccessToken(resource,!0).then(function(token){resource.getData(token).then(function(){resolve(handleResourceResponse(resource))})["catch"](function(message){reject(Utils.createInternalServerError(message))})})["catch"](function(message){reject(Utils.createInternalServerError(message))})})["catch"](function(message){reject(Utils.createInternalServerError(message))}):resolve(resource)})["catch"](function(message){reject(Utils.createInternalServerError(message))}):getStoredAccessToken(resource,tokenStorageStrategy).then(function(storedAccessToken){storedAccessToken?resource.getData(storedAccessToken).then(function(){resource.status===HTTPStatusCode.OK?resolve(handleResourceResponse(resource)):Utils.authorize(resource,tokenStorageStrategy,clickThrough,restricted,login,getAccessToken,storeAccessToken,getStoredAccessToken).then(function(){resolve(handleResourceResponse(resource))})["catch"](function(error){reject(resource.restrictedService?Utils.createRestrictedError():Utils.createAuthorizationFailedError())})})["catch"](function(error){reject(Utils.createAuthorizationFailedError())}):Utils.authorize(resource,tokenStorageStrategy,clickThrough,restricted,login,getAccessToken,storeAccessToken,getStoredAccessToken).then(function(){resolve(handleResourceResponse(resource))})["catch"](function(error){reject(Utils.createAuthorizationFailedError())})})["catch"](function(error){reject(Utils.createAuthorizationFailedError())})})},Utils.createError=function(name,message){var error=new Error;return error.message=message,error.name=name,error},Utils.createAuthorizationFailedError=function(){return Utils.createError(manifesto.StatusCodes.AUTHORIZATION_FAILED.toString(),"Authorization failed")},Utils.createRestrictedError=function(){return Utils.createError(manifesto.StatusCodes.RESTRICTED.toString(),"Restricted")},Utils.createInternalServerError=function(message){return Utils.createError(manifesto.StatusCodes.INTERNAL_SERVER_ERROR.toString(),message)},Utils.loadExternalResources=function(resources,tokenStorageStrategy,clickThrough,restricted,login,getAccessToken,storeAccessToken,getStoredAccessToken,handleResourceResponse,options){return new Promise(function(resolve,reject){var promises=_map(resources,function(resource){return Utils.loadExternalResource(resource,tokenStorageStrategy,clickThrough,restricted,login,getAccessToken,storeAccessToken,getStoredAccessToken,handleResourceResponse,options)});Promise.all(promises).then(function(){resolve(resources)})["catch"](function(error){reject(error)})})},Utils.authorize=function(resource,tokenStorageStrategy,clickThrough,restricted,login,getAccessToken,storeAccessToken,getStoredAccessToken){return new Promise(function(resolve,reject){resource.getData().then(function(){resource.isAccessControlled()?getStoredAccessToken(resource,tokenStorageStrategy).then(function(storedAccessToken){storedAccessToken?resource.getData(storedAccessToken).then(function(){resource.status===HTTPStatusCode.OK?resolve(resource):Utils.showAuthInteraction(resource,tokenStorageStrategy,clickThrough,restricted,login,getAccessToken,storeAccessToken,resolve,reject)})["catch"](function(message){reject(Utils.createInternalServerError(message))}):getAccessToken(resource,!1).then(function(accessToken){accessToken?storeAccessToken(resource,accessToken,tokenStorageStrategy).then(function(){resource.getData(accessToken).then(function(){resource.status===HTTPStatusCode.OK?resolve(resource):Utils.showAuthInteraction(resource,tokenStorageStrategy,clickThrough,restricted,login,getAccessToken,storeAccessToken,resolve,reject)})["catch"](function(message){reject(Utils.createInternalServerError(message))})})["catch"](function(message){reject(Utils.createInternalServerError(message))}):Utils.showAuthInteraction(resource,tokenStorageStrategy,clickThrough,restricted,login,getAccessToken,storeAccessToken,resolve,reject)})})["catch"](function(message){reject(Utils.createInternalServerError(message))}):resolve(resource)})})},Utils.showAuthInteraction=function(resource,tokenStorageStrategy,clickThrough,restricted,login,getAccessToken,storeAccessToken,resolve,reject){resource.status!==HTTPStatusCode.MOVED_TEMPORARILY||resource.isResponseHandled?resource.restrictedService?resolve(restricted(resource)):resource.clickThroughService&&!resource.isResponseHandled?clickThrough(resource).then(function(){getAccessToken(resource,!0).then(function(accessToken){storeAccessToken(resource,accessToken,tokenStorageStrategy).then(function(){resource.getData(accessToken).then(function(){resolve(resource)})["catch"](function(message){reject(Utils.createInternalServerError(message))})})["catch"](function(message){reject(Utils.createInternalServerError(message))})})["catch"](function(message){reject(Utils.createInternalServerError(message))})}):login(resource).then(function(){getAccessToken(resource,!0).then(function(accessToken){storeAccessToken(resource,accessToken,tokenStorageStrategy).then(function(){resource.getData(accessToken).then(function(){resolve(resource)})["catch"](function(message){reject(Utils.createInternalServerError(message))})})["catch"](function(message){reject(Utils.createInternalServerError(message))})})["catch"](function(message){reject(Utils.createInternalServerError(message))})}):resolve(resource)},Utils.getService=function(resource,profile){var services=this.getServices(resource);"string"!=typeof profile&&(profile=profile.toString());for(var i=0;i<services.length;i++){var service=services[i];if(service.getProfile().toString()===profile)return service}return null},Utils.getResourceById=function(parentResource,id){return[parentResource.__jsonld].en().traverseUnique(function(x){return Utils.getAllArrays(x)}).first(function(r){return r["@id"]===id})},Utils.getAllArrays=function(obj){var all=[].en();if(!obj)return all;for(var key in obj){var val=obj[key];_isArray(val)&&(all=all.concat(val))}return all},Utils.getServices=function(resource){var service;service=resource.__jsonld?resource.__jsonld.service:resource.service;var services=[];if(!service)return services;_isArray(service)||(service=[service]);for(var i=0;i<service.length;i++){var s=service[i];if(_isString(s)){var r=this.getResourceById(resource.options.resource,s);r&&services.push(new Manifesto.Service(r.__jsonld||r,resource.options))}else services.push(new Manifesto.Service(s,resource.options))}return services},Utils}();Manifesto.Utils=Utils}(Manifesto||(Manifesto={})),global.manifesto=global.Manifesto=module.exports={AnnotationMotivation:new Manifesto.AnnotationMotivation,ElementType:new Manifesto.ElementType,IIIFResourceType:new Manifesto.IIIFResourceType,ManifestType:new Manifesto.ManifestType,RenderingFormat:new Manifesto.RenderingFormat,ResourceFormat:new Manifesto.ResourceFormat,ResourceType:new Manifesto.ResourceType,ServiceProfile:new Manifesto.ServiceProfile,TreeNodeType:new Manifesto.TreeNodeType,ViewingDirection:new Manifesto.ViewingDirection,ViewingHint:new Manifesto.ViewingHint,StatusCodes:{AUTHORIZATION_FAILED:1,FORBIDDEN:2,INTERNAL_SERVER_ERROR:3,RESTRICTED:4},create:function(manifest,options){return Manifesto.Deserialiser.parse(manifest,options)},getService:function(resource,profile){return Manifesto.Utils.getService(resource,profile)},getTreeNode:function(){return new Manifesto.TreeNode},isImageProfile:function(profile){return profile.toString()===Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE0.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE1.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE2.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE0.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE1.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE2.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE0.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE1.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE2.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE0.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE1.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE2.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF1IMAGELEVEL0.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF1IMAGELEVEL0PROFILE.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF1IMAGELEVEL1.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF1IMAGELEVEL1PROFILE.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF1IMAGELEVEL2.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF1IMAGELEVEL2PROFILE.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF2IMAGELEVEL0.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF2IMAGELEVEL0PROFILE.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF2IMAGELEVEL1.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF2IMAGELEVEL1PROFILE.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF2IMAGELEVEL2.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF2IMAGELEVEL2PROFILE.toString()},isLevel0ImageProfile:function(profile){return profile.toString()===Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE0.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE0.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE0.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE0.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF1IMAGELEVEL0.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF1IMAGELEVEL0PROFILE.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF2IMAGELEVEL0.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF2IMAGELEVEL0PROFILE.toString()},isLevel1ImageProfile:function(profile){return profile.toString()===Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE1.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE1.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE1.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE1.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF1IMAGELEVEL1.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF1IMAGELEVEL1PROFILE.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF2IMAGELEVEL1.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF2IMAGELEVEL1PROFILE.toString()},isLevel2ImageProfile:function(profile){return profile.toString()===Manifesto.ServiceProfile.STANFORDIIIFIMAGECOMPLIANCE2.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECOMPLIANCE2.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIFIMAGECONFORMANCE2.toString()||profile.toString()===Manifesto.ServiceProfile.STANFORDIIIF1IMAGECONFORMANCE2.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF1IMAGELEVEL2.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF1IMAGELEVEL2PROFILE.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF2IMAGELEVEL2.toString()||profile.toString()===Manifesto.ServiceProfile.IIIF2IMAGELEVEL2PROFILE.toString()},loadExternalResources:function(resources,tokenStorageStrategy,clickThrough,restricted,login,getAccessToken,storeAccessToken,getStoredAccessToken,handleResourceResponse,options){return Manifesto.Utils.loadExternalResources(resources,tokenStorageStrategy,clickThrough,restricted,login,getAccessToken,storeAccessToken,getStoredAccessToken,handleResourceResponse,options)},loadManifest:function(uri){return Manifesto.Utils.loadResource(uri)}};var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var Annotation=function(_super){function Annotation(jsonld,options){_super.call(this,jsonld,options)}return __extends(Annotation,_super),Annotation.prototype.getMotivation=function(){var motivation=this.getProperty("motivation");return motivation?new Manifesto.AnnotationMotivation(motivation.toLowerCase()):null},Annotation.prototype.getOn=function(){return this.getProperty("on")},Annotation.prototype.getResource=function(){return new Manifesto.Resource(this.getProperty("resource"),this.options)},Annotation}(Manifesto.ManifestResource);Manifesto.Annotation=Annotation}(Manifesto||(Manifesto={}));var Manifesto,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifesto){var Resource=function(_super){function Resource(jsonld,options){_super.call(this,jsonld,options)}return __extends(Resource,_super),Resource.prototype.getFormat=function(){var format=this.getProperty("format");return format?new Manifesto.ResourceFormat(format.toLowerCase()):null},Resource.prototype.getType=function(){var type=this.getProperty("@type");return type?new Manifesto.ResourceType(type.toLowerCase()):null},Resource.prototype.getWidth=function(){return this.getProperty("width")},Resource.prototype.getHeight=function(){return this.getProperty("height")},Resource.prototype.getMaxWidth=function(){return this.getProperty("maxWidth")},Resource.prototype.getMaxHeight=function(){var maxHeight=this.getProperty("maxHeight");return maxHeight?void 0:this.getMaxWidth()},Resource}(Manifesto.ManifestResource);Manifesto.Resource=Resource}(Manifesto||(Manifesto={}))}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{http:26,"lodash.assign":36,"lodash.endswith":46,"lodash.isarray":48,"lodash.isstring":49,"lodash.last":50,"lodash.map":51,url:33}],2:[function(require,module,exports){},{}],3:[function(require,module,exports){(function(global){"use strict";function typedArraySupport(){try{var arr=new Uint8Array(1);return arr.foo=function(){return 42},42===arr.foo()&&"function"==typeof arr.subarray&&0===arr.subarray(1,1).byteLength}catch(e){return!1}}function kMaxLength(){return Buffer.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function createBuffer(that,length){if(kMaxLength()<length)throw new RangeError("Invalid typed array length");return Buffer.TYPED_ARRAY_SUPPORT?(that=new Uint8Array(length),that.__proto__=Buffer.prototype):(null===that&&(that=new Buffer(length)),that.length=length),that}function Buffer(arg,encodingOrOffset,length){if(!(Buffer.TYPED_ARRAY_SUPPORT||this instanceof Buffer))return new Buffer(arg,encodingOrOffset,length);if("number"==typeof arg){if("string"==typeof encodingOrOffset)throw new Error("If encoding is specified then the first argument must be a string");return allocUnsafe(this,arg)}return from(this,arg,encodingOrOffset,length)}function from(that,value,encodingOrOffset,length){if("number"==typeof value)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&value instanceof ArrayBuffer?fromArrayBuffer(that,value,encodingOrOffset,length):"string"==typeof value?fromString(that,value,encodingOrOffset):fromObject(that,value)}function assertSize(size){if("number"!=typeof size)throw new TypeError('"size" argument must be a number')}function alloc(that,size,fill,encoding){return assertSize(size),0>=size?createBuffer(that,size):void 0!==fill?"string"==typeof encoding?createBuffer(that,size).fill(fill,encoding):createBuffer(that,size).fill(fill):createBuffer(that,size)}function allocUnsafe(that,size){if(assertSize(size),that=createBuffer(that,0>size?0:0|checked(size)),!Buffer.TYPED_ARRAY_SUPPORT)for(var i=0;size>i;i++)that[i]=0;return that}function fromString(that,string,encoding){if("string"==typeof encoding&&""!==encoding||(encoding="utf8"),!Buffer.isEncoding(encoding))throw new TypeError('"encoding" must be a valid string encoding');var length=0|byteLength(string,encoding);return that=createBuffer(that,length),that.write(string,encoding),that}function fromArrayLike(that,array){var length=0|checked(array.length);
that=createBuffer(that,length);for(var i=0;length>i;i+=1)that[i]=255&array[i];return that}function fromArrayBuffer(that,array,byteOffset,length){if(array.byteLength,0>byteOffset||array.byteLength<byteOffset)throw new RangeError("'offset' is out of bounds");if(array.byteLength<byteOffset+(length||0))throw new RangeError("'length' is out of bounds");return array=void 0===length?new Uint8Array(array,byteOffset):new Uint8Array(array,byteOffset,length),Buffer.TYPED_ARRAY_SUPPORT?(that=array,that.__proto__=Buffer.prototype):that=fromArrayLike(that,array),that}function fromObject(that,obj){if(Buffer.isBuffer(obj)){var len=0|checked(obj.length);return that=createBuffer(that,len),0===that.length?that:(obj.copy(that,0,0,len),that)}if(obj){if("undefined"!=typeof ArrayBuffer&&obj.buffer instanceof ArrayBuffer||"length"in obj)return"number"!=typeof obj.length||isnan(obj.length)?createBuffer(that,0):fromArrayLike(that,obj);if("Buffer"===obj.type&&isArray(obj.data))return fromArrayLike(that,obj.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function checked(length){if(length>=kMaxLength())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+kMaxLength().toString(16)+" bytes");return 0|length}function SlowBuffer(length){return+length!=length&&(length=0),Buffer.alloc(+length)}function byteLength(string,encoding){if(Buffer.isBuffer(string))return string.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(string)||string instanceof ArrayBuffer))return string.byteLength;"string"!=typeof string&&(string=""+string);var len=string.length;if(0===len)return 0;for(var loweredCase=!1;;)switch(encoding){case"ascii":case"binary":case"raw":case"raws":return len;case"utf8":case"utf-8":case void 0:return utf8ToBytes(string).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*len;case"hex":return len>>>1;case"base64":return base64ToBytes(string).length;default:if(loweredCase)return utf8ToBytes(string).length;encoding=(""+encoding).toLowerCase(),loweredCase=!0}}function slowToString(encoding,start,end){var loweredCase=!1;if((void 0===start||0>start)&&(start=0),start>this.length)return"";if((void 0===end||end>this.length)&&(end=this.length),0>=end)return"";if(end>>>=0,start>>>=0,start>=end)return"";for(encoding||(encoding="utf8");;)switch(encoding){case"hex":return hexSlice(this,start,end);case"utf8":case"utf-8":return utf8Slice(this,start,end);case"ascii":return asciiSlice(this,start,end);case"binary":return binarySlice(this,start,end);case"base64":return base64Slice(this,start,end);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,start,end);default:if(loweredCase)throw new TypeError("Unknown encoding: "+encoding);encoding=(encoding+"").toLowerCase(),loweredCase=!0}}function swap(b,n,m){var i=b[n];b[n]=b[m],b[m]=i}function arrayIndexOf(arr,val,byteOffset,encoding){function read(buf,i){return 1===indexSize?buf[i]:buf.readUInt16BE(i*indexSize)}var indexSize=1,arrLength=arr.length,valLength=val.length;if(void 0!==encoding&&(encoding=String(encoding).toLowerCase(),"ucs2"===encoding||"ucs-2"===encoding||"utf16le"===encoding||"utf-16le"===encoding)){if(arr.length<2||val.length<2)return-1;indexSize=2,arrLength/=2,valLength/=2,byteOffset/=2}for(var foundIndex=-1,i=0;arrLength>byteOffset+i;i++)if(read(arr,byteOffset+i)===read(val,-1===foundIndex?0:i-foundIndex)){if(-1===foundIndex&&(foundIndex=i),i-foundIndex+1===valLength)return(byteOffset+foundIndex)*indexSize}else-1!==foundIndex&&(i-=i-foundIndex),foundIndex=-1;return-1}function hexWrite(buf,string,offset,length){offset=Number(offset)||0;var remaining=buf.length-offset;length?(length=Number(length),length>remaining&&(length=remaining)):length=remaining;var strLen=string.length;if(strLen%2!==0)throw new Error("Invalid hex string");length>strLen/2&&(length=strLen/2);for(var i=0;length>i;i++){var parsed=parseInt(string.substr(2*i,2),16);if(isNaN(parsed))return i;buf[offset+i]=parsed}return i}function utf8Write(buf,string,offset,length){return blitBuffer(utf8ToBytes(string,buf.length-offset),buf,offset,length)}function asciiWrite(buf,string,offset,length){return blitBuffer(asciiToBytes(string),buf,offset,length)}function binaryWrite(buf,string,offset,length){return asciiWrite(buf,string,offset,length)}function base64Write(buf,string,offset,length){return blitBuffer(base64ToBytes(string),buf,offset,length)}function ucs2Write(buf,string,offset,length){return blitBuffer(utf16leToBytes(string,buf.length-offset),buf,offset,length)}function base64Slice(buf,start,end){return 0===start&&end===buf.length?base64.fromByteArray(buf):base64.fromByteArray(buf.slice(start,end))}function utf8Slice(buf,start,end){end=Math.min(buf.length,end);for(var res=[],i=start;end>i;){var firstByte=buf[i],codePoint=null,bytesPerSequence=firstByte>239?4:firstByte>223?3:firstByte>191?2:1;if(end>=i+bytesPerSequence){var secondByte,thirdByte,fourthByte,tempCodePoint;switch(bytesPerSequence){case 1:128>firstByte&&(codePoint=firstByte);break;case 2:secondByte=buf[i+1],128===(192&secondByte)&&(tempCodePoint=(31&firstByte)<<6|63&secondByte,tempCodePoint>127&&(codePoint=tempCodePoint));break;case 3:secondByte=buf[i+1],thirdByte=buf[i+2],128===(192&secondByte)&&128===(192&thirdByte)&&(tempCodePoint=(15&firstByte)<<12|(63&secondByte)<<6|63&thirdByte,tempCodePoint>2047&&(55296>tempCodePoint||tempCodePoint>57343)&&(codePoint=tempCodePoint));break;case 4:secondByte=buf[i+1],thirdByte=buf[i+2],fourthByte=buf[i+3],128===(192&secondByte)&&128===(192&thirdByte)&&128===(192&fourthByte)&&(tempCodePoint=(15&firstByte)<<18|(63&secondByte)<<12|(63&thirdByte)<<6|63&fourthByte,tempCodePoint>65535&&1114112>tempCodePoint&&(codePoint=tempCodePoint))}}null===codePoint?(codePoint=65533,bytesPerSequence=1):codePoint>65535&&(codePoint-=65536,res.push(codePoint>>>10&1023|55296),codePoint=56320|1023&codePoint),res.push(codePoint),i+=bytesPerSequence}return decodeCodePointsArray(res)}function decodeCodePointsArray(codePoints){var len=codePoints.length;if(MAX_ARGUMENTS_LENGTH>=len)return String.fromCharCode.apply(String,codePoints);for(var res="",i=0;len>i;)res+=String.fromCharCode.apply(String,codePoints.slice(i,i+=MAX_ARGUMENTS_LENGTH));return res}function asciiSlice(buf,start,end){var ret="";end=Math.min(buf.length,end);for(var i=start;end>i;i++)ret+=String.fromCharCode(127&buf[i]);return ret}function binarySlice(buf,start,end){var ret="";end=Math.min(buf.length,end);for(var i=start;end>i;i++)ret+=String.fromCharCode(buf[i]);return ret}function hexSlice(buf,start,end){var len=buf.length;(!start||0>start)&&(start=0),(!end||0>end||end>len)&&(end=len);for(var out="",i=start;end>i;i++)out+=toHex(buf[i]);return out}function utf16leSlice(buf,start,end){for(var bytes=buf.slice(start,end),res="",i=0;i<bytes.length;i+=2)res+=String.fromCharCode(bytes[i]+256*bytes[i+1]);return res}function checkOffset(offset,ext,length){if(offset%1!==0||0>offset)throw new RangeError("offset is not uint");if(offset+ext>length)throw new RangeError("Trying to access beyond buffer length")}function checkInt(buf,value,offset,ext,max,min){if(!Buffer.isBuffer(buf))throw new TypeError('"buffer" argument must be a Buffer instance');if(value>max||min>value)throw new RangeError('"value" argument is out of bounds');if(offset+ext>buf.length)throw new RangeError("Index out of range")}function objectWriteUInt16(buf,value,offset,littleEndian){0>value&&(value=65535+value+1);for(var i=0,j=Math.min(buf.length-offset,2);j>i;i++)buf[offset+i]=(value&255<<8*(littleEndian?i:1-i))>>>8*(littleEndian?i:1-i)}function objectWriteUInt32(buf,value,offset,littleEndian){0>value&&(value=4294967295+value+1);for(var i=0,j=Math.min(buf.length-offset,4);j>i;i++)buf[offset+i]=value>>>8*(littleEndian?i:3-i)&255}function checkIEEE754(buf,value,offset,ext,max,min){if(offset+ext>buf.length)throw new RangeError("Index out of range");if(0>offset)throw new RangeError("Index out of range")}function writeFloat(buf,value,offset,littleEndian,noAssert){return noAssert||checkIEEE754(buf,value,offset,4,3.4028234663852886e38,-3.4028234663852886e38),ieee754.write(buf,value,offset,littleEndian,23,4),offset+4}function writeDouble(buf,value,offset,littleEndian,noAssert){return noAssert||checkIEEE754(buf,value,offset,8,1.7976931348623157e308,-1.7976931348623157e308),ieee754.write(buf,value,offset,littleEndian,52,8),offset+8}function base64clean(str){if(str=stringtrim(str).replace(INVALID_BASE64_RE,""),str.length<2)return"";for(;str.length%4!==0;)str+="=";return str}function stringtrim(str){return str.trim?str.trim():str.replace(/^\s+|\s+$/g,"")}function toHex(n){return 16>n?"0"+n.toString(16):n.toString(16)}function utf8ToBytes(string,units){units=units||1/0;for(var codePoint,length=string.length,leadSurrogate=null,bytes=[],i=0;length>i;i++){if(codePoint=string.charCodeAt(i),codePoint>55295&&57344>codePoint){if(!leadSurrogate){if(codePoint>56319){(units-=3)>-1&&bytes.push(239,191,189);continue}if(i+1===length){(units-=3)>-1&&bytes.push(239,191,189);continue}leadSurrogate=codePoint;continue}if(56320>codePoint){(units-=3)>-1&&bytes.push(239,191,189),leadSurrogate=codePoint;continue}codePoint=(leadSurrogate-55296<<10|codePoint-56320)+65536}else leadSurrogate&&(units-=3)>-1&&bytes.push(239,191,189);if(leadSurrogate=null,128>codePoint){if((units-=1)<0)break;bytes.push(codePoint)}else if(2048>codePoint){if((units-=2)<0)break;bytes.push(codePoint>>6|192,63&codePoint|128)}else if(65536>codePoint){if((units-=3)<0)break;bytes.push(codePoint>>12|224,codePoint>>6&63|128,63&codePoint|128)}else{if(!(1114112>codePoint))throw new Error("Invalid code point");if((units-=4)<0)break;bytes.push(codePoint>>18|240,codePoint>>12&63|128,codePoint>>6&63|128,63&codePoint|128)}}return bytes}function asciiToBytes(str){for(var byteArray=[],i=0;i<str.length;i++)byteArray.push(255&str.charCodeAt(i));return byteArray}function utf16leToBytes(str,units){for(var c,hi,lo,byteArray=[],i=0;i<str.length&&!((units-=2)<0);i++)c=str.charCodeAt(i),hi=c>>8,lo=c%256,byteArray.push(lo),byteArray.push(hi);return byteArray}function base64ToBytes(str){return base64.toByteArray(base64clean(str))}function blitBuffer(src,dst,offset,length){for(var i=0;length>i&&!(i+offset>=dst.length||i>=src.length);i++)dst[i+offset]=src[i];return i}function isnan(val){return val!==val}var base64=require("base64-js"),ieee754=require("ieee754"),isArray=require("isarray");exports.Buffer=Buffer,exports.SlowBuffer=SlowBuffer,exports.INSPECT_MAX_BYTES=50,Buffer.TYPED_ARRAY_SUPPORT=void 0!==global.TYPED_ARRAY_SUPPORT?global.TYPED_ARRAY_SUPPORT:typedArraySupport(),exports.kMaxLength=kMaxLength(),Buffer.poolSize=8192,Buffer._augment=function(arr){return arr.__proto__=Buffer.prototype,arr},Buffer.from=function(value,encodingOrOffset,length){return from(null,value,encodingOrOffset,length)},Buffer.TYPED_ARRAY_SUPPORT&&(Buffer.prototype.__proto__=Uint8Array.prototype,Buffer.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&Buffer[Symbol.species]===Buffer&&Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:!0})),Buffer.alloc=function(size,fill,encoding){return alloc(null,size,fill,encoding)},Buffer.allocUnsafe=function(size){return allocUnsafe(null,size)},Buffer.allocUnsafeSlow=function(size){return allocUnsafe(null,size)},Buffer.isBuffer=function(b){return!(null==b||!b._isBuffer)},Buffer.compare=function(a,b){if(!Buffer.isBuffer(a)||!Buffer.isBuffer(b))throw new TypeError("Arguments must be Buffers");if(a===b)return 0;for(var x=a.length,y=b.length,i=0,len=Math.min(x,y);len>i;++i)if(a[i]!==b[i]){x=a[i],y=b[i];break}return y>x?-1:x>y?1:0},Buffer.isEncoding=function(encoding){switch(String(encoding).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},Buffer.concat=function(list,length){if(!isArray(list))throw new TypeError('"list" argument must be an Array of Buffers');if(0===list.length)return Buffer.alloc(0);var i;if(void 0===length)for(length=0,i=0;i<list.length;i++)length+=list[i].length;var buffer=Buffer.allocUnsafe(length),pos=0;for(i=0;i<list.length;i++){var buf=list[i];if(!Buffer.isBuffer(buf))throw new TypeError('"list" argument must be an Array of Buffers');buf.copy(buffer,pos),pos+=buf.length}return buffer},Buffer.byteLength=byteLength,Buffer.prototype._isBuffer=!0,Buffer.prototype.swap16=function(){var len=this.length;if(len%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var i=0;len>i;i+=2)swap(this,i,i+1);return this},Buffer.prototype.swap32=function(){var len=this.length;if(len%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var i=0;len>i;i+=4)swap(this,i,i+3),swap(this,i+1,i+2);return this},Buffer.prototype.toString=function(){var length=0|this.length;return 0===length?"":0===arguments.length?utf8Slice(this,0,length):slowToString.apply(this,arguments)},Buffer.prototype.equals=function(b){if(!Buffer.isBuffer(b))throw new TypeError("Argument must be a Buffer");return this===b?!0:0===Buffer.compare(this,b)},Buffer.prototype.inspect=function(){var str="",max=exports.INSPECT_MAX_BYTES;return this.length>0&&(str=this.toString("hex",0,max).match(/.{2}/g).join(" "),this.length>max&&(str+=" ... ")),"<Buffer "+str+">"},Buffer.prototype.compare=function(target,start,end,thisStart,thisEnd){if(!Buffer.isBuffer(target))throw new TypeError("Argument must be a Buffer");if(void 0===start&&(start=0),void 0===end&&(end=target?target.length:0),void 0===thisStart&&(thisStart=0),void 0===thisEnd&&(thisEnd=this.length),0>start||end>target.length||0>thisStart||thisEnd>this.length)throw new RangeError("out of range index");if(thisStart>=thisEnd&&start>=end)return 0;if(thisStart>=thisEnd)return-1;if(start>=end)return 1;if(start>>>=0,end>>>=0,thisStart>>>=0,thisEnd>>>=0,this===target)return 0;for(var x=thisEnd-thisStart,y=end-start,len=Math.min(x,y),thisCopy=this.slice(thisStart,thisEnd),targetCopy=target.slice(start,end),i=0;len>i;++i)if(thisCopy[i]!==targetCopy[i]){x=thisCopy[i],y=targetCopy[i];break}return y>x?-1:x>y?1:0},Buffer.prototype.indexOf=function(val,byteOffset,encoding){if("string"==typeof byteOffset?(encoding=byteOffset,byteOffset=0):byteOffset>2147483647?byteOffset=2147483647:-2147483648>byteOffset&&(byteOffset=-2147483648),byteOffset>>=0,0===this.length)return-1;if(byteOffset>=this.length)return-1;if(0>byteOffset&&(byteOffset=Math.max(this.length+byteOffset,0)),"string"==typeof val&&(val=Buffer.from(val,encoding)),Buffer.isBuffer(val))return 0===val.length?-1:arrayIndexOf(this,val,byteOffset,encoding);if("number"==typeof val)return Buffer.TYPED_ARRAY_SUPPORT&&"function"===Uint8Array.prototype.indexOf?Uint8Array.prototype.indexOf.call(this,val,byteOffset):arrayIndexOf(this,[val],byteOffset,encoding);throw new TypeError("val must be string, number or Buffer")},Buffer.prototype.includes=function(val,byteOffset,encoding){return-1!==this.indexOf(val,byteOffset,encoding)},Buffer.prototype.write=function(string,offset,length,encoding){if(void 0===offset)encoding="utf8",length=this.length,offset=0;else if(void 0===length&&"string"==typeof offset)encoding=offset,length=this.length,offset=0;else{if(!isFinite(offset))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");offset=0|offset,isFinite(length)?(length=0|length,void 0===encoding&&(encoding="utf8")):(encoding=length,length=void 0)}var remaining=this.length-offset;if((void 0===length||length>remaining)&&(length=remaining),string.length>0&&(0>length||0>offset)||offset>this.length)throw new RangeError("Attempt to write outside buffer bounds");encoding||(encoding="utf8");for(var loweredCase=!1;;)switch(encoding){case"hex":return hexWrite(this,string,offset,length);case"utf8":case"utf-8":return utf8Write(this,string,offset,length);case"ascii":return asciiWrite(this,string,offset,length);case"binary":return binaryWrite(this,string,offset,length);case"base64":return base64Write(this,string,offset,length);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,string,offset,length);default:if(loweredCase)throw new TypeError("Unknown encoding: "+encoding);encoding=(""+encoding).toLowerCase(),loweredCase=!0}},Buffer.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var MAX_ARGUMENTS_LENGTH=4096;Buffer.prototype.slice=function(start,end){var len=this.length;start=~~start,end=void 0===end?len:~~end,0>start?(start+=len,0>start&&(start=0)):start>len&&(start=len),0>end?(end+=len,0>end&&(end=0)):end>len&&(end=len),start>end&&(end=start);var newBuf;if(Buffer.TYPED_ARRAY_SUPPORT)newBuf=this.subarray(start,end),newBuf.__proto__=Buffer.prototype;else{var sliceLen=end-start;newBuf=new Buffer(sliceLen,void 0);for(var i=0;sliceLen>i;i++)newBuf[i]=this[i+start]}return newBuf},Buffer.prototype.readUIntLE=function(offset,byteLength,noAssert){offset=0|offset,byteLength=0|byteLength,noAssert||checkOffset(offset,byteLength,this.length);for(var val=this[offset],mul=1,i=0;++i<byteLength&&(mul*=256);)val+=this[offset+i]*mul;return val},Buffer.prototype.readUIntBE=function(offset,byteLength,noAssert){offset=0|offset,byteLength=0|byteLength,noAssert||checkOffset(offset,byteLength,this.length);for(var val=this[offset+--byteLength],mul=1;byteLength>0&&(mul*=256);)val+=this[offset+--byteLength]*mul;return val},Buffer.prototype.readUInt8=function(offset,noAssert){return noAssert||checkOffset(offset,1,this.length),this[offset]},Buffer.prototype.readUInt16LE=function(offset,noAssert){return noAssert||checkOffset(offset,2,this.length),this[offset]|this[offset+1]<<8},Buffer.prototype.readUInt16BE=function(offset,noAssert){return noAssert||checkOffset(offset,2,this.length),this[offset]<<8|this[offset+1]},Buffer.prototype.readUInt32LE=function(offset,noAssert){return noAssert||checkOffset(offset,4,this.length),(this[offset]|this[offset+1]<<8|this[offset+2]<<16)+16777216*this[offset+3]},Buffer.prototype.readUInt32BE=function(offset,noAssert){return noAssert||checkOffset(offset,4,this.length),16777216*this[offset]+(this[offset+1]<<16|this[offset+2]<<8|this[offset+3])},Buffer.prototype.readIntLE=function(offset,byteLength,noAssert){offset=0|offset,byteLength=0|byteLength,noAssert||checkOffset(offset,byteLength,this.length);for(var val=this[offset],mul=1,i=0;++i<byteLength&&(mul*=256);)val+=this[offset+i]*mul;return mul*=128,val>=mul&&(val-=Math.pow(2,8*byteLength)),val},Buffer.prototype.readIntBE=function(offset,byteLength,noAssert){offset=0|offset,byteLength=0|byteLength,noAssert||checkOffset(offset,byteLength,this.length);for(var i=byteLength,mul=1,val=this[offset+--i];i>0&&(mul*=256);)val+=this[offset+--i]*mul;return mul*=128,val>=mul&&(val-=Math.pow(2,8*byteLength)),val},Buffer.prototype.readInt8=function(offset,noAssert){return noAssert||checkOffset(offset,1,this.length),128&this[offset]?-1*(255-this[offset]+1):this[offset]},Buffer.prototype.readInt16LE=function(offset,noAssert){noAssert||checkOffset(offset,2,this.length);var val=this[offset]|this[offset+1]<<8;return 32768&val?4294901760|val:val},Buffer.prototype.readInt16BE=function(offset,noAssert){noAssert||checkOffset(offset,2,this.length);var val=this[offset+1]|this[offset]<<8;return 32768&val?4294901760|val:val},Buffer.prototype.readInt32LE=function(offset,noAssert){return noAssert||checkOffset(offset,4,this.length),this[offset]|this[offset+1]<<8|this[offset+2]<<16|this[offset+3]<<24},Buffer.prototype.readInt32BE=function(offset,noAssert){return noAssert||checkOffset(offset,4,this.length),this[offset]<<24|this[offset+1]<<16|this[offset+2]<<8|this[offset+3]},Buffer.prototype.readFloatLE=function(offset,noAssert){return noAssert||checkOffset(offset,4,this.length),ieee754.read(this,offset,!0,23,4)},Buffer.prototype.readFloatBE=function(offset,noAssert){return noAssert||checkOffset(offset,4,this.length),ieee754.read(this,offset,!1,23,4)},Buffer.prototype.readDoubleLE=function(offset,noAssert){return noAssert||checkOffset(offset,8,this.length),ieee754.read(this,offset,!0,52,8)},Buffer.prototype.readDoubleBE=function(offset,noAssert){return noAssert||checkOffset(offset,8,this.length),ieee754.read(this,offset,!1,52,8)},Buffer.prototype.writeUIntLE=function(value,offset,byteLength,noAssert){if(value=+value,offset=0|offset,byteLength=0|byteLength,!noAssert){var maxBytes=Math.pow(2,8*byteLength)-1;checkInt(this,value,offset,byteLength,maxBytes,0)}var mul=1,i=0;for(this[offset]=255&value;++i<byteLength&&(mul*=256);)this[offset+i]=value/mul&255;return offset+byteLength},Buffer.prototype.writeUIntBE=function(value,offset,byteLength,noAssert){if(value=+value,offset=0|offset,byteLength=0|byteLength,!noAssert){var maxBytes=Math.pow(2,8*byteLength)-1;checkInt(this,value,offset,byteLength,maxBytes,0)}var i=byteLength-1,mul=1;for(this[offset+i]=255&value;--i>=0&&(mul*=256);)this[offset+i]=value/mul&255;return offset+byteLength},Buffer.prototype.writeUInt8=function(value,offset,noAssert){return value=+value,offset=0|offset,noAssert||checkInt(this,value,offset,1,255,0),Buffer.TYPED_ARRAY_SUPPORT||(value=Math.floor(value)),this[offset]=255&value,offset+1},Buffer.prototype.writeUInt16LE=function(value,offset,noAssert){return value=+value,offset=0|offset,noAssert||checkInt(this,value,offset,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[offset]=255&value,this[offset+1]=value>>>8):objectWriteUInt16(this,value,offset,!0),offset+2},Buffer.prototype.writeUInt16BE=function(value,offset,noAssert){return value=+value,offset=0|offset,noAssert||checkInt(this,value,offset,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[offset]=value>>>8,this[offset+1]=255&value):objectWriteUInt16(this,value,offset,!1),offset+2},Buffer.prototype.writeUInt32LE=function(value,offset,noAssert){return value=+value,offset=0|offset,noAssert||checkInt(this,value,offset,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[offset+3]=value>>>24,this[offset+2]=value>>>16,this[offset+1]=value>>>8,this[offset]=255&value):objectWriteUInt32(this,value,offset,!0),offset+4},Buffer.prototype.writeUInt32BE=function(value,offset,noAssert){return value=+value,offset=0|offset,noAssert||checkInt(this,value,offset,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[offset]=value>>>24,this[offset+1]=value>>>16,this[offset+2]=value>>>8,this[offset+3]=255&value):objectWriteUInt32(this,value,offset,!1),offset+4},Buffer.prototype.writeIntLE=function(value,offset,byteLength,noAssert){if(value=+value,offset=0|offset,!noAssert){var limit=Math.pow(2,8*byteLength-1);checkInt(this,value,offset,byteLength,limit-1,-limit)}var i=0,mul=1,sub=0;for(this[offset]=255&value;++i<byteLength&&(mul*=256);)0>value&&0===sub&&0!==this[offset+i-1]&&(sub=1),this[offset+i]=(value/mul>>0)-sub&255;return offset+byteLength},Buffer.prototype.writeIntBE=function(value,offset,byteLength,noAssert){if(value=+value,offset=0|offset,!noAssert){var limit=Math.pow(2,8*byteLength-1);checkInt(this,value,offset,byteLength,limit-1,-limit)}var i=byteLength-1,mul=1,sub=0;for(this[offset+i]=255&value;--i>=0&&(mul*=256);)0>value&&0===sub&&0!==this[offset+i+1]&&(sub=1),this[offset+i]=(value/mul>>0)-sub&255;return offset+byteLength},Buffer.prototype.writeInt8=function(value,offset,noAssert){return value=+value,offset=0|offset,noAssert||checkInt(this,value,offset,1,127,-128),Buffer.TYPED_ARRAY_SUPPORT||(value=Math.floor(value)),0>value&&(value=255+value+1),this[offset]=255&value,offset+1},Buffer.prototype.writeInt16LE=function(value,offset,noAssert){return value=+value,offset=0|offset,noAssert||checkInt(this,value,offset,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[offset]=255&value,this[offset+1]=value>>>8):objectWriteUInt16(this,value,offset,!0),offset+2},Buffer.prototype.writeInt16BE=function(value,offset,noAssert){return value=+value,offset=0|offset,noAssert||checkInt(this,value,offset,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[offset]=value>>>8,this[offset+1]=255&value):objectWriteUInt16(this,value,offset,!1),offset+2},Buffer.prototype.writeInt32LE=function(value,offset,noAssert){return value=+value,offset=0|offset,noAssert||checkInt(this,value,offset,4,2147483647,-2147483648),Buffer.TYPED_ARRAY_SUPPORT?(this[offset]=255&value,this[offset+1]=value>>>8,this[offset+2]=value>>>16,this[offset+3]=value>>>24):objectWriteUInt32(this,value,offset,!0),offset+4},Buffer.prototype.writeInt32BE=function(value,offset,noAssert){return value=+value,offset=0|offset,noAssert||checkInt(this,value,offset,4,2147483647,-2147483648),0>value&&(value=4294967295+value+1),Buffer.TYPED_ARRAY_SUPPORT?(this[offset]=value>>>24,this[offset+1]=value>>>16,this[offset+2]=value>>>8,this[offset+3]=255&value):objectWriteUInt32(this,value,offset,!1),offset+4},Buffer.prototype.writeFloatLE=function(value,offset,noAssert){return writeFloat(this,value,offset,!0,noAssert)},Buffer.prototype.writeFloatBE=function(value,offset,noAssert){return writeFloat(this,value,offset,!1,noAssert)},Buffer.prototype.writeDoubleLE=function(value,offset,noAssert){return writeDouble(this,value,offset,!0,noAssert)},Buffer.prototype.writeDoubleBE=function(value,offset,noAssert){return writeDouble(this,value,offset,!1,noAssert)},Buffer.prototype.copy=function(target,targetStart,start,end){if(start||(start=0),end||0===end||(end=this.length),targetStart>=target.length&&(targetStart=target.length),targetStart||(targetStart=0),end>0&&start>end&&(end=start),end===start)return 0;if(0===target.length||0===this.length)return 0;if(0>targetStart)throw new RangeError("targetStart out of bounds");if(0>start||start>=this.length)throw new RangeError("sourceStart out of bounds");if(0>end)throw new RangeError("sourceEnd out of bounds");end>this.length&&(end=this.length),target.length-targetStart<end-start&&(end=target.length-targetStart+start);var i,len=end-start;if(this===target&&targetStart>start&&end>targetStart)for(i=len-1;i>=0;i--)target[i+targetStart]=this[i+start];else if(1e3>len||!Buffer.TYPED_ARRAY_SUPPORT)for(i=0;len>i;i++)target[i+targetStart]=this[i+start];else Uint8Array.prototype.set.call(target,this.subarray(start,start+len),targetStart);return len},Buffer.prototype.fill=function(val,start,end,encoding){if("string"==typeof val){if("string"==typeof start?(encoding=start,start=0,end=this.length):"string"==typeof end&&(encoding=end,end=this.length),1===val.length){var code=val.charCodeAt(0);256>code&&(val=code)}if(void 0!==encoding&&"string"!=typeof encoding)throw new TypeError("encoding must be a string");if("string"==typeof encoding&&!Buffer.isEncoding(encoding))throw new TypeError("Unknown encoding: "+encoding)}else"number"==typeof val&&(val=255&val);if(0>start||this.length<start||this.length<end)throw new RangeError("Out of range index");if(start>=end)return this;start>>>=0,end=void 0===end?this.length:end>>>0,val||(val=0);var i;if("number"==typeof val)for(i=start;end>i;i++)this[i]=val;else{var bytes=Buffer.isBuffer(val)?val:utf8ToBytes(new Buffer(val,encoding).toString()),len=bytes.length;for(i=0;end-start>i;i++)this[i+start]=bytes[i%len]}return this};var INVALID_BASE64_RE=/[^+\/0-9A-Za-z-_]/g}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"base64-js":4,ieee754:5,isarray:6}],4:[function(require,module,exports){"use strict";function init(){for(var code="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0,len=code.length;len>i;++i)lookup[i]=code[i],revLookup[code.charCodeAt(i)]=i;revLookup["-".charCodeAt(0)]=62,revLookup["_".charCodeAt(0)]=63}function toByteArray(b64){var i,j,l,tmp,placeHolders,arr,len=b64.length;if(len%4>0)throw new Error("Invalid string. Length must be a multiple of 4");placeHolders="="===b64[len-2]?2:"="===b64[len-1]?1:0,arr=new Arr(3*len/4-placeHolders),l=placeHolders>0?len-4:len;var L=0;for(i=0,j=0;l>i;i+=4,j+=3)tmp=revLookup[b64.charCodeAt(i)]<<18|revLookup[b64.charCodeAt(i+1)]<<12|revLookup[b64.charCodeAt(i+2)]<<6|revLookup[b64.charCodeAt(i+3)],arr[L++]=tmp>>16&255,arr[L++]=tmp>>8&255,arr[L++]=255&tmp;return 2===placeHolders?(tmp=revLookup[b64.charCodeAt(i)]<<2|revLookup[b64.charCodeAt(i+1)]>>4,arr[L++]=255&tmp):1===placeHolders&&(tmp=revLookup[b64.charCodeAt(i)]<<10|revLookup[b64.charCodeAt(i+1)]<<4|revLookup[b64.charCodeAt(i+2)]>>2,arr[L++]=tmp>>8&255,arr[L++]=255&tmp),arr}function tripletToBase64(num){return lookup[num>>18&63]+lookup[num>>12&63]+lookup[num>>6&63]+lookup[63&num]}function encodeChunk(uint8,start,end){for(var tmp,output=[],i=start;end>i;i+=3)tmp=(uint8[i]<<16)+(uint8[i+1]<<8)+uint8[i+2],output.push(tripletToBase64(tmp));return output.join("")}function fromByteArray(uint8){for(var tmp,len=uint8.length,extraBytes=len%3,output="",parts=[],maxChunkLength=16383,i=0,len2=len-extraBytes;len2>i;i+=maxChunkLength)parts.push(encodeChunk(uint8,i,i+maxChunkLength>len2?len2:i+maxChunkLength));return 1===extraBytes?(tmp=uint8[len-1],output+=lookup[tmp>>2],output+=lookup[tmp<<4&63],output+="=="):2===extraBytes&&(tmp=(uint8[len-2]<<8)+uint8[len-1],output+=lookup[tmp>>10],output+=lookup[tmp>>4&63],output+=lookup[tmp<<2&63],output+="="),parts.push(output),parts.join("")}exports.toByteArray=toByteArray,exports.fromByteArray=fromByteArray;var lookup=[],revLookup=[],Arr="undefined"!=typeof Uint8Array?Uint8Array:Array;init()},{}],5:[function(require,module,exports){exports.read=function(buffer,offset,isLE,mLen,nBytes){var e,m,eLen=8*nBytes-mLen-1,eMax=(1<<eLen)-1,eBias=eMax>>1,nBits=-7,i=isLE?nBytes-1:0,d=isLE?-1:1,s=buffer[offset+i];for(i+=d,e=s&(1<<-nBits)-1,s>>=-nBits,nBits+=eLen;nBits>0;e=256*e+buffer[offset+i],i+=d,nBits-=8);for(m=e&(1<<-nBits)-1,e>>=-nBits,nBits+=mLen;nBits>0;m=256*m+buffer[offset+i],i+=d,nBits-=8);if(0===e)e=1-eBias;else{if(e===eMax)return m?NaN:(s?-1:1)*(1/0);m+=Math.pow(2,mLen),e-=eBias}return(s?-1:1)*m*Math.pow(2,e-mLen)},exports.write=function(buffer,value,offset,isLE,mLen,nBytes){var e,m,c,eLen=8*nBytes-mLen-1,eMax=(1<<eLen)-1,eBias=eMax>>1,rt=23===mLen?Math.pow(2,-24)-Math.pow(2,-77):0,i=isLE?0:nBytes-1,d=isLE?1:-1,s=0>value||0===value&&0>1/value?1:0;for(value=Math.abs(value),isNaN(value)||value===1/0?(m=isNaN(value)?1:0,e=eMax):(e=Math.floor(Math.log(value)/Math.LN2),value*(c=Math.pow(2,-e))<1&&(e--,c*=2),value+=e+eBias>=1?rt/c:rt*Math.pow(2,1-eBias),value*c>=2&&(e++,c/=2),e+eBias>=eMax?(m=0,e=eMax):e+eBias>=1?(m=(value*c-1)*Math.pow(2,mLen),e+=eBias):(m=value*Math.pow(2,eBias-1)*Math.pow(2,mLen),e=0));mLen>=8;buffer[offset+i]=255&m,i+=d,m/=256,mLen-=8);for(e=e<<mLen|m,eLen+=mLen;eLen>0;buffer[offset+i]=255&e,i+=d,e/=256,eLen-=8);buffer[offset+i-d]|=128*s}},{}],6:[function(require,module,exports){var toString={}.toString;module.exports=Array.isArray||function(arr){return"[object Array]"==toString.call(arr)}},{}],7:[function(require,module,exports){function EventEmitter(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function isFunction(arg){return"function"==typeof arg}function isNumber(arg){return"number"==typeof arg}function isObject(arg){return"object"==typeof arg&&null!==arg}function isUndefined(arg){return void 0===arg}module.exports=EventEmitter,EventEmitter.EventEmitter=EventEmitter,EventEmitter.prototype._events=void 0,EventEmitter.prototype._maxListeners=void 0,EventEmitter.defaultMaxListeners=10,EventEmitter.prototype.setMaxListeners=function(n){if(!isNumber(n)||0>n||isNaN(n))throw TypeError("n must be a positive number");return this._maxListeners=n,this},EventEmitter.prototype.emit=function(type){var er,handler,len,args,i,listeners;if(this._events||(this._events={}),"error"===type&&(!this._events.error||isObject(this._events.error)&&!this._events.error.length)){if(er=arguments[1],er instanceof Error)throw er;throw TypeError('Uncaught, unspecified "error" event.')}if(handler=this._events[type],isUndefined(handler))return!1;if(isFunction(handler))switch(arguments.length){case 1:handler.call(this);break;case 2:handler.call(this,arguments[1]);break;case 3:handler.call(this,arguments[1],arguments[2]);break;default:args=Array.prototype.slice.call(arguments,1),handler.apply(this,args);
}else if(isObject(handler))for(args=Array.prototype.slice.call(arguments,1),listeners=handler.slice(),len=listeners.length,i=0;len>i;i++)listeners[i].apply(this,args);return!0},EventEmitter.prototype.addListener=function(type,listener){var m;if(!isFunction(listener))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",type,isFunction(listener.listener)?listener.listener:listener),this._events[type]?isObject(this._events[type])?this._events[type].push(listener):this._events[type]=[this._events[type],listener]:this._events[type]=listener,isObject(this._events[type])&&!this._events[type].warned&&(m=isUndefined(this._maxListeners)?EventEmitter.defaultMaxListeners:this._maxListeners,m&&m>0&&this._events[type].length>m&&(this._events[type].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[type].length),"function"==typeof console.trace&&console.trace())),this},EventEmitter.prototype.on=EventEmitter.prototype.addListener,EventEmitter.prototype.once=function(type,listener){function g(){this.removeListener(type,g),fired||(fired=!0,listener.apply(this,arguments))}if(!isFunction(listener))throw TypeError("listener must be a function");var fired=!1;return g.listener=listener,this.on(type,g),this},EventEmitter.prototype.removeListener=function(type,listener){var list,position,length,i;if(!isFunction(listener))throw TypeError("listener must be a function");if(!this._events||!this._events[type])return this;if(list=this._events[type],length=list.length,position=-1,list===listener||isFunction(list.listener)&&list.listener===listener)delete this._events[type],this._events.removeListener&&this.emit("removeListener",type,listener);else if(isObject(list)){for(i=length;i-- >0;)if(list[i]===listener||list[i].listener&&list[i].listener===listener){position=i;break}if(0>position)return this;1===list.length?(list.length=0,delete this._events[type]):list.splice(position,1),this._events.removeListener&&this.emit("removeListener",type,listener)}return this},EventEmitter.prototype.removeAllListeners=function(type){var key,listeners;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[type]&&delete this._events[type],this;if(0===arguments.length){for(key in this._events)"removeListener"!==key&&this.removeAllListeners(key);return this.removeAllListeners("removeListener"),this._events={},this}if(listeners=this._events[type],isFunction(listeners))this.removeListener(type,listeners);else if(listeners)for(;listeners.length;)this.removeListener(type,listeners[listeners.length-1]);return delete this._events[type],this},EventEmitter.prototype.listeners=function(type){var ret;return ret=this._events&&this._events[type]?isFunction(this._events[type])?[this._events[type]]:this._events[type].slice():[]},EventEmitter.prototype.listenerCount=function(type){if(this._events){var evlistener=this._events[type];if(isFunction(evlistener))return 1;if(evlistener)return evlistener.length}return 0},EventEmitter.listenerCount=function(emitter,type){return emitter.listenerCount(type)}},{}],8:[function(require,module,exports){"function"==typeof Object.create?module.exports=function(ctor,superCtor){ctor.super_=superCtor,ctor.prototype=Object.create(superCtor.prototype,{constructor:{value:ctor,enumerable:!1,writable:!0,configurable:!0}})}:module.exports=function(ctor,superCtor){ctor.super_=superCtor;var TempCtor=function(){};TempCtor.prototype=superCtor.prototype,ctor.prototype=new TempCtor,ctor.prototype.constructor=ctor}},{}],9:[function(require,module,exports){module.exports=function(obj){return!(null==obj||!(obj._isBuffer||obj.constructor&&"function"==typeof obj.constructor.isBuffer&&obj.constructor.isBuffer(obj)))}},{}],10:[function(require,module,exports){function cleanUpNextTick(){draining&&currentQueue&&(draining=!1,currentQueue.length?queue=currentQueue.concat(queue):queueIndex=-1,queue.length&&drainQueue())}function drainQueue(){if(!draining){var timeout=setTimeout(cleanUpNextTick);draining=!0;for(var len=queue.length;len;){for(currentQueue=queue,queue=[];++queueIndex<len;)currentQueue&&currentQueue[queueIndex].run();queueIndex=-1,len=queue.length}currentQueue=null,draining=!1,clearTimeout(timeout)}}function Item(fun,array){this.fun=fun,this.array=array}function noop(){}var currentQueue,process=module.exports={},queue=[],draining=!1,queueIndex=-1;process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)args[i-1]=arguments[i];queue.push(new Item(fun,args)),1!==queue.length||draining||setTimeout(drainQueue,0)},Item.prototype.run=function(){this.fun.apply(null,this.array)},process.title="browser",process.browser=!0,process.env={},process.argv=[],process.version="",process.versions={},process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.binding=function(name){throw new Error("process.binding is not supported")},process.cwd=function(){return"/"},process.chdir=function(dir){throw new Error("process.chdir is not supported")},process.umask=function(){return 0}},{}],11:[function(require,module,exports){(function(global){!function(root){function error(type){throw new RangeError(errors[type])}function map(array,fn){for(var length=array.length,result=[];length--;)result[length]=fn(array[length]);return result}function mapDomain(string,fn){var parts=string.split("@"),result="";parts.length>1&&(result=parts[0]+"@",string=parts[1]),string=string.replace(regexSeparators,".");var labels=string.split("."),encoded=map(labels,fn).join(".");return result+encoded}function ucs2decode(string){for(var value,extra,output=[],counter=0,length=string.length;length>counter;)value=string.charCodeAt(counter++),value>=55296&&56319>=value&&length>counter?(extra=string.charCodeAt(counter++),56320==(64512&extra)?output.push(((1023&value)<<10)+(1023&extra)+65536):(output.push(value),counter--)):output.push(value);return output}function ucs2encode(array){return map(array,function(value){var output="";return value>65535&&(value-=65536,output+=stringFromCharCode(value>>>10&1023|55296),value=56320|1023&value),output+=stringFromCharCode(value)}).join("")}function basicToDigit(codePoint){return 10>codePoint-48?codePoint-22:26>codePoint-65?codePoint-65:26>codePoint-97?codePoint-97:base}function digitToBasic(digit,flag){return digit+22+75*(26>digit)-((0!=flag)<<5)}function adapt(delta,numPoints,firstTime){var k=0;for(delta=firstTime?floor(delta/damp):delta>>1,delta+=floor(delta/numPoints);delta>baseMinusTMin*tMax>>1;k+=base)delta=floor(delta/baseMinusTMin);return floor(k+(baseMinusTMin+1)*delta/(delta+skew))}function decode(input){var out,basic,j,index,oldi,w,k,digit,t,baseMinusT,output=[],inputLength=input.length,i=0,n=initialN,bias=initialBias;for(basic=input.lastIndexOf(delimiter),0>basic&&(basic=0),j=0;basic>j;++j)input.charCodeAt(j)>=128&&error("not-basic"),output.push(input.charCodeAt(j));for(index=basic>0?basic+1:0;inputLength>index;){for(oldi=i,w=1,k=base;index>=inputLength&&error("invalid-input"),digit=basicToDigit(input.charCodeAt(index++)),(digit>=base||digit>floor((maxInt-i)/w))&&error("overflow"),i+=digit*w,t=bias>=k?tMin:k>=bias+tMax?tMax:k-bias,!(t>digit);k+=base)baseMinusT=base-t,w>floor(maxInt/baseMinusT)&&error("overflow"),w*=baseMinusT;out=output.length+1,bias=adapt(i-oldi,out,0==oldi),floor(i/out)>maxInt-n&&error("overflow"),n+=floor(i/out),i%=out,output.splice(i++,0,n)}return ucs2encode(output)}function encode(input){var n,delta,handledCPCount,basicLength,bias,j,m,q,k,t,currentValue,inputLength,handledCPCountPlusOne,baseMinusT,qMinusT,output=[];for(input=ucs2decode(input),inputLength=input.length,n=initialN,delta=0,bias=initialBias,j=0;inputLength>j;++j)currentValue=input[j],128>currentValue&&output.push(stringFromCharCode(currentValue));for(handledCPCount=basicLength=output.length,basicLength&&output.push(delimiter);inputLength>handledCPCount;){for(m=maxInt,j=0;inputLength>j;++j)currentValue=input[j],currentValue>=n&&m>currentValue&&(m=currentValue);for(handledCPCountPlusOne=handledCPCount+1,m-n>floor((maxInt-delta)/handledCPCountPlusOne)&&error("overflow"),delta+=(m-n)*handledCPCountPlusOne,n=m,j=0;inputLength>j;++j)if(currentValue=input[j],n>currentValue&&++delta>maxInt&&error("overflow"),currentValue==n){for(q=delta,k=base;t=bias>=k?tMin:k>=bias+tMax?tMax:k-bias,!(t>q);k+=base)qMinusT=q-t,baseMinusT=base-t,output.push(stringFromCharCode(digitToBasic(t+qMinusT%baseMinusT,0))),q=floor(qMinusT/baseMinusT);output.push(stringFromCharCode(digitToBasic(q,0))),bias=adapt(delta,handledCPCountPlusOne,handledCPCount==basicLength),delta=0,++handledCPCount}++delta,++n}return output.join("")}function toUnicode(input){return mapDomain(input,function(string){return regexPunycode.test(string)?decode(string.slice(4).toLowerCase()):string})}function toASCII(input){return mapDomain(input,function(string){return regexNonASCII.test(string)?"xn--"+encode(string):string})}var freeExports="object"==typeof exports&&exports&&!exports.nodeType&&exports,freeModule="object"==typeof module&&module&&!module.nodeType&&module,freeGlobal="object"==typeof global&&global;freeGlobal.global!==freeGlobal&&freeGlobal.window!==freeGlobal&&freeGlobal.self!==freeGlobal||(root=freeGlobal);var punycode,key,maxInt=2147483647,base=36,tMin=1,tMax=26,skew=38,damp=700,initialBias=72,initialN=128,delimiter="-",regexPunycode=/^xn--/,regexNonASCII=/[^\x20-\x7E]/,regexSeparators=/[\x2E\u3002\uFF0E\uFF61]/g,errors={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},baseMinusTMin=base-tMin,floor=Math.floor,stringFromCharCode=String.fromCharCode;if(punycode={version:"1.4.1",ucs2:{decode:ucs2decode,encode:ucs2encode},decode:decode,encode:encode,toASCII:toASCII,toUnicode:toUnicode},"function"==typeof define&&"object"==typeof define.amd&&define.amd)define("punycode",function(){return punycode});else if(freeExports&&freeModule)if(module.exports==freeExports)freeModule.exports=punycode;else for(key in punycode)punycode.hasOwnProperty(key)&&(freeExports[key]=punycode[key]);else root.punycode=punycode}(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],12:[function(require,module,exports){"use strict";function hasOwnProperty(obj,prop){return Object.prototype.hasOwnProperty.call(obj,prop)}module.exports=function(qs,sep,eq,options){sep=sep||"&",eq=eq||"=";var obj={};if("string"!=typeof qs||0===qs.length)return obj;var regexp=/\+/g;qs=qs.split(sep);var maxKeys=1e3;options&&"number"==typeof options.maxKeys&&(maxKeys=options.maxKeys);var len=qs.length;maxKeys>0&&len>maxKeys&&(len=maxKeys);for(var i=0;len>i;++i){var kstr,vstr,k,v,x=qs[i].replace(regexp,"%20"),idx=x.indexOf(eq);idx>=0?(kstr=x.substr(0,idx),vstr=x.substr(idx+1)):(kstr=x,vstr=""),k=decodeURIComponent(kstr),v=decodeURIComponent(vstr),hasOwnProperty(obj,k)?isArray(obj[k])?obj[k].push(v):obj[k]=[obj[k],v]:obj[k]=v}return obj};var isArray=Array.isArray||function(xs){return"[object Array]"===Object.prototype.toString.call(xs)}},{}],13:[function(require,module,exports){"use strict";function map(xs,f){if(xs.map)return xs.map(f);for(var res=[],i=0;i<xs.length;i++)res.push(f(xs[i],i));return res}var stringifyPrimitive=function(v){switch(typeof v){case"string":return v;case"boolean":return v?"true":"false";case"number":return isFinite(v)?v:"";default:return""}};module.exports=function(obj,sep,eq,name){return sep=sep||"&",eq=eq||"=",null===obj&&(obj=void 0),"object"==typeof obj?map(objectKeys(obj),function(k){var ks=encodeURIComponent(stringifyPrimitive(k))+eq;return isArray(obj[k])?map(obj[k],function(v){return ks+encodeURIComponent(stringifyPrimitive(v))}).join(sep):ks+encodeURIComponent(stringifyPrimitive(obj[k]))}).join(sep):name?encodeURIComponent(stringifyPrimitive(name))+eq+encodeURIComponent(stringifyPrimitive(obj)):""};var isArray=Array.isArray||function(xs){return"[object Array]"===Object.prototype.toString.call(xs)},objectKeys=Object.keys||function(obj){var res=[];for(var key in obj)Object.prototype.hasOwnProperty.call(obj,key)&&res.push(key);return res}},{}],14:[function(require,module,exports){"use strict";exports.decode=exports.parse=require("./decode"),exports.encode=exports.stringify=require("./encode")},{"./decode":12,"./encode":13}],15:[function(require,module,exports){"use strict";function Duplex(options){return this instanceof Duplex?(Readable.call(this,options),Writable.call(this,options),options&&options.readable===!1&&(this.readable=!1),options&&options.writable===!1&&(this.writable=!1),this.allowHalfOpen=!0,options&&options.allowHalfOpen===!1&&(this.allowHalfOpen=!1),void this.once("end",onend)):new Duplex(options)}function onend(){this.allowHalfOpen||this._writableState.ended||processNextTick(onEndNT,this)}function onEndNT(self){self.end()}var objectKeys=Object.keys||function(obj){var keys=[];for(var key in obj)keys.push(key);return keys};module.exports=Duplex;var processNextTick=require("process-nextick-args"),util=require("core-util-is");util.inherits=require("inherits");var Readable=require("./_stream_readable"),Writable=require("./_stream_writable");util.inherits(Duplex,Readable);for(var keys=objectKeys(Writable.prototype),v=0;v<keys.length;v++){var method=keys[v];Duplex.prototype[method]||(Duplex.prototype[method]=Writable.prototype[method])}},{"./_stream_readable":17,"./_stream_writable":19,"core-util-is":21,inherits:8,"process-nextick-args":23}],16:[function(require,module,exports){"use strict";function PassThrough(options){return this instanceof PassThrough?void Transform.call(this,options):new PassThrough(options)}module.exports=PassThrough;var Transform=require("./_stream_transform"),util=require("core-util-is");util.inherits=require("inherits"),util.inherits(PassThrough,Transform),PassThrough.prototype._transform=function(chunk,encoding,cb){cb(null,chunk)}},{"./_stream_transform":18,"core-util-is":21,inherits:8}],17:[function(require,module,exports){(function(process){"use strict";function prependListener(emitter,event,fn){return hasPrependListener?emitter.prependListener(event,fn):void(emitter._events&&emitter._events[event]?isArray(emitter._events[event])?emitter._events[event].unshift(fn):emitter._events[event]=[fn,emitter._events[event]]:emitter.on(event,fn))}function ReadableState(options,stream){Duplex=Duplex||require("./_stream_duplex"),options=options||{},this.objectMode=!!options.objectMode,stream instanceof Duplex&&(this.objectMode=this.objectMode||!!options.readableObjectMode);var hwm=options.highWaterMark,defaultHwm=this.objectMode?16:16384;this.highWaterMark=hwm||0===hwm?hwm:defaultHwm,this.highWaterMark=~~this.highWaterMark,this.buffer=[],this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.defaultEncoding=options.defaultEncoding||"utf8",this.ranOut=!1,this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,options.encoding&&(StringDecoder||(StringDecoder=require("string_decoder/").StringDecoder),this.decoder=new StringDecoder(options.encoding),this.encoding=options.encoding)}function Readable(options){return Duplex=Duplex||require("./_stream_duplex"),this instanceof Readable?(this._readableState=new ReadableState(options,this),this.readable=!0,options&&"function"==typeof options.read&&(this._read=options.read),void Stream.call(this)):new Readable(options)}function readableAddChunk(stream,state,chunk,encoding,addToFront){var er=chunkInvalid(state,chunk);if(er)stream.emit("error",er);else if(null===chunk)state.reading=!1,onEofChunk(stream,state);else if(state.objectMode||chunk&&chunk.length>0)if(state.ended&&!addToFront){var e=new Error("stream.push() after EOF");stream.emit("error",e)}else if(state.endEmitted&&addToFront){var _e=new Error("stream.unshift() after end event");stream.emit("error",_e)}else{var skipAdd;!state.decoder||addToFront||encoding||(chunk=state.decoder.write(chunk),skipAdd=!state.objectMode&&0===chunk.length),addToFront||(state.reading=!1),skipAdd||(state.flowing&&0===state.length&&!state.sync?(stream.emit("data",chunk),stream.read(0)):(state.length+=state.objectMode?1:chunk.length,addToFront?state.buffer.unshift(chunk):state.buffer.push(chunk),state.needReadable&&emitReadable(stream))),maybeReadMore(stream,state)}else addToFront||(state.reading=!1);return needMoreData(state)}function needMoreData(state){return!state.ended&&(state.needReadable||state.length<state.highWaterMark||0===state.length)}function computeNewHighWaterMark(n){return n>=MAX_HWM?n=MAX_HWM:(n--,n|=n>>>1,n|=n>>>2,n|=n>>>4,n|=n>>>8,n|=n>>>16,n++),n}function howMuchToRead(n,state){return 0===state.length&&state.ended?0:state.objectMode?0===n?0:1:null===n||isNaN(n)?state.flowing&&state.buffer.length?state.buffer[0].length:state.length:0>=n?0:(n>state.highWaterMark&&(state.highWaterMark=computeNewHighWaterMark(n)),n>state.length?state.ended?state.length:(state.needReadable=!0,0):n)}function chunkInvalid(state,chunk){var er=null;return Buffer.isBuffer(chunk)||"string"==typeof chunk||null===chunk||void 0===chunk||state.objectMode||(er=new TypeError("Invalid non-string/buffer chunk")),er}function onEofChunk(stream,state){if(!state.ended){if(state.decoder){var chunk=state.decoder.end();chunk&&chunk.length&&(state.buffer.push(chunk),state.length+=state.objectMode?1:chunk.length)}state.ended=!0,emitReadable(stream)}}function emitReadable(stream){var state=stream._readableState;state.needReadable=!1,state.emittedReadable||(debug("emitReadable",state.flowing),state.emittedReadable=!0,state.sync?processNextTick(emitReadable_,stream):emitReadable_(stream))}function emitReadable_(stream){debug("emit readable"),stream.emit("readable"),flow(stream)}function maybeReadMore(stream,state){state.readingMore||(state.readingMore=!0,processNextTick(maybeReadMore_,stream,state))}function maybeReadMore_(stream,state){for(var len=state.length;!state.reading&&!state.flowing&&!state.ended&&state.length<state.highWaterMark&&(debug("maybeReadMore read 0"),stream.read(0),len!==state.length);)len=state.length;state.readingMore=!1}function pipeOnDrain(src){return function(){var state=src._readableState;debug("pipeOnDrain",state.awaitDrain),state.awaitDrain&&state.awaitDrain--,0===state.awaitDrain&&EElistenerCount(src,"data")&&(state.flowing=!0,flow(src))}}function nReadingNextTick(self){debug("readable nexttick read 0"),self.read(0)}function resume(stream,state){state.resumeScheduled||(state.resumeScheduled=!0,processNextTick(resume_,stream,state))}function resume_(stream,state){state.reading||(debug("resume read 0"),stream.read(0)),state.resumeScheduled=!1,stream.emit("resume"),flow(stream),state.flowing&&!state.reading&&stream.read(0)}function flow(stream){var state=stream._readableState;if(debug("flow",state.flowing),state.flowing)do var chunk=stream.read();while(null!==chunk&&state.flowing)}function fromList(n,state){var ret,list=state.buffer,length=state.length,stringMode=!!state.decoder,objectMode=!!state.objectMode;if(0===list.length)return null;if(0===length)ret=null;else if(objectMode)ret=list.shift();else if(!n||n>=length)ret=stringMode?list.join(""):1===list.length?list[0]:Buffer.concat(list,length),list.length=0;else if(n<list[0].length){var buf=list[0];ret=buf.slice(0,n),list[0]=buf.slice(n)}else if(n===list[0].length)ret=list.shift();else{ret=stringMode?"":bufferShim.allocUnsafe(n);for(var c=0,i=0,l=list.length;l>i&&n>c;i++){var _buf=list[0],cpy=Math.min(n-c,_buf.length);stringMode?ret+=_buf.slice(0,cpy):_buf.copy(ret,c,0,cpy),cpy<_buf.length?list[0]=_buf.slice(cpy):list.shift(),c+=cpy}}return ret}function endReadable(stream){var state=stream._readableState;if(state.length>0)throw new Error('"endReadable()" called on non-empty stream');state.endEmitted||(state.ended=!0,processNextTick(endReadableNT,state,stream))}function endReadableNT(state,stream){state.endEmitted||0!==state.length||(state.endEmitted=!0,stream.readable=!1,stream.emit("end"))}function forEach(xs,f){for(var i=0,l=xs.length;l>i;i++)f(xs[i],i)}function indexOf(xs,x){for(var i=0,l=xs.length;l>i;i++)if(xs[i]===x)return i;return-1}module.exports=Readable;var processNextTick=require("process-nextick-args"),isArray=require("isarray");Readable.ReadableState=ReadableState;var Stream,EE=require("events").EventEmitter,EElistenerCount=function(emitter,type){return emitter.listeners(type).length};!function(){try{Stream=require("stream")}catch(_){}finally{Stream||(Stream=require("events").EventEmitter)}}();var Buffer=require("buffer").Buffer,bufferShim=require("buffer-shims"),util=require("core-util-is");util.inherits=require("inherits");var debugUtil=require("util"),debug=void 0;debug=debugUtil&&debugUtil.debuglog?debugUtil.debuglog("stream"):function(){};var StringDecoder;util.inherits(Readable,Stream);var Duplex,Duplex,hasPrependListener="function"==typeof EE.prototype.prependListener;Readable.prototype.push=function(chunk,encoding){var state=this._readableState;return state.objectMode||"string"!=typeof chunk||(encoding=encoding||state.defaultEncoding,encoding!==state.encoding&&(chunk=bufferShim.from(chunk,encoding),encoding="")),readableAddChunk(this,state,chunk,encoding,!1)},Readable.prototype.unshift=function(chunk){var state=this._readableState;return readableAddChunk(this,state,chunk,"",!0)},Readable.prototype.isPaused=function(){return this._readableState.flowing===!1},Readable.prototype.setEncoding=function(enc){return StringDecoder||(StringDecoder=require("string_decoder/").StringDecoder),this._readableState.decoder=new StringDecoder(enc),this._readableState.encoding=enc,this};var MAX_HWM=8388608;Readable.prototype.read=function(n){debug("read",n);var state=this._readableState,nOrig=n;if(("number"!=typeof n||n>0)&&(state.emittedReadable=!1),0===n&&state.needReadable&&(state.length>=state.highWaterMark||state.ended))return debug("read: emitReadable",state.length,state.ended),0===state.length&&state.ended?endReadable(this):emitReadable(this),null;if(n=howMuchToRead(n,state),0===n&&state.ended)return 0===state.length&&endReadable(this),null;var doRead=state.needReadable;debug("need readable",doRead),(0===state.length||state.length-n<state.highWaterMark)&&(doRead=!0,debug("length less than watermark",doRead)),(state.ended||state.reading)&&(doRead=!1,debug("reading or ended",doRead)),doRead&&(debug("do read"),state.reading=!0,state.sync=!0,0===state.length&&(state.needReadable=!0),this._read(state.highWaterMark),state.sync=!1),doRead&&!state.reading&&(n=howMuchToRead(nOrig,state));var ret;return ret=n>0?fromList(n,state):null,null===ret&&(state.needReadable=!0,n=0),state.length-=n,0!==state.length||state.ended||(state.needReadable=!0),nOrig!==n&&state.ended&&0===state.length&&endReadable(this),null!==ret&&this.emit("data",ret),ret},Readable.prototype._read=function(n){this.emit("error",new Error("not implemented"))},Readable.prototype.pipe=function(dest,pipeOpts){function onunpipe(readable){debug("onunpipe"),readable===src&&cleanup()}function onend(){debug("onend"),dest.end()}function cleanup(){debug("cleanup"),dest.removeListener("close",onclose),dest.removeListener("finish",onfinish),dest.removeListener("drain",ondrain),dest.removeListener("error",onerror),dest.removeListener("unpipe",onunpipe),src.removeListener("end",onend),src.removeListener("end",cleanup),src.removeListener("data",ondata),cleanedUp=!0,!state.awaitDrain||dest._writableState&&!dest._writableState.needDrain||ondrain()}function ondata(chunk){debug("ondata");var ret=dest.write(chunk);!1===ret&&((1===state.pipesCount&&state.pipes===dest||state.pipesCount>1&&-1!==indexOf(state.pipes,dest))&&!cleanedUp&&(debug("false write response, pause",src._readableState.awaitDrain),src._readableState.awaitDrain++),src.pause())}function onerror(er){debug("onerror",er),unpipe(),dest.removeListener("error",onerror),0===EElistenerCount(dest,"error")&&dest.emit("error",er)}function onclose(){dest.removeListener("finish",onfinish),unpipe()}function onfinish(){debug("onfinish"),dest.removeListener("close",onclose),unpipe()}function unpipe(){debug("unpipe"),src.unpipe(dest)}var src=this,state=this._readableState;switch(state.pipesCount){case 0:state.pipes=dest;break;case 1:state.pipes=[state.pipes,dest];break;default:state.pipes.push(dest)}state.pipesCount+=1,debug("pipe count=%d opts=%j",state.pipesCount,pipeOpts);var doEnd=(!pipeOpts||pipeOpts.end!==!1)&&dest!==process.stdout&&dest!==process.stderr,endFn=doEnd?onend:cleanup;state.endEmitted?processNextTick(endFn):src.once("end",endFn),dest.on("unpipe",onunpipe);var ondrain=pipeOnDrain(src);dest.on("drain",ondrain);var cleanedUp=!1;return src.on("data",ondata),prependListener(dest,"error",onerror),dest.once("close",onclose),dest.once("finish",onfinish),dest.emit("pipe",src),state.flowing||(debug("pipe resume"),src.resume()),dest},Readable.prototype.unpipe=function(dest){var state=this._readableState;if(0===state.pipesCount)return this;if(1===state.pipesCount)return dest&&dest!==state.pipes?this:(dest||(dest=state.pipes),state.pipes=null,state.pipesCount=0,state.flowing=!1,dest&&dest.emit("unpipe",this),this);if(!dest){var dests=state.pipes,len=state.pipesCount;state.pipes=null,state.pipesCount=0,state.flowing=!1;for(var _i=0;len>_i;_i++)dests[_i].emit("unpipe",this);return this}var i=indexOf(state.pipes,dest);return-1===i?this:(state.pipes.splice(i,1),state.pipesCount-=1,1===state.pipesCount&&(state.pipes=state.pipes[0]),dest.emit("unpipe",this),this)},Readable.prototype.on=function(ev,fn){var res=Stream.prototype.on.call(this,ev,fn);if("data"===ev&&!1!==this._readableState.flowing&&this.resume(),"readable"===ev&&!this._readableState.endEmitted){var state=this._readableState;state.readableListening||(state.readableListening=!0,state.emittedReadable=!1,state.needReadable=!0,state.reading?state.length&&emitReadable(this,state):processNextTick(nReadingNextTick,this))}return res},Readable.prototype.addListener=Readable.prototype.on,Readable.prototype.resume=function(){var state=this._readableState;return state.flowing||(debug("resume"),state.flowing=!0,resume(this,state)),this},Readable.prototype.pause=function(){return debug("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(debug("pause"),this._readableState.flowing=!1,this.emit("pause")),this},Readable.prototype.wrap=function(stream){var state=this._readableState,paused=!1,self=this;stream.on("end",function(){if(debug("wrapped end"),state.decoder&&!state.ended){var chunk=state.decoder.end();chunk&&chunk.length&&self.push(chunk)}self.push(null)}),stream.on("data",function(chunk){if(debug("wrapped data"),state.decoder&&(chunk=state.decoder.write(chunk)),(!state.objectMode||null!==chunk&&void 0!==chunk)&&(state.objectMode||chunk&&chunk.length)){var ret=self.push(chunk);ret||(paused=!0,stream.pause())}});for(var i in stream)void 0===this[i]&&"function"==typeof stream[i]&&(this[i]=function(method){return function(){return stream[method].apply(stream,arguments)}}(i));var events=["error","close","destroy","pause","resume"];return forEach(events,function(ev){stream.on(ev,self.emit.bind(self,ev))}),self._read=function(n){debug("wrapped _read",n),paused&&(paused=!1,stream.resume())},self},Readable._fromList=fromList}).call(this,require("_process"))},{"./_stream_duplex":15,_process:10,buffer:3,"buffer-shims":20,"core-util-is":21,events:7,inherits:8,isarray:22,"process-nextick-args":23,"string_decoder/":32,util:2}],18:[function(require,module,exports){"use strict";function TransformState(stream){this.afterTransform=function(er,data){return afterTransform(stream,er,data)},this.needTransform=!1,this.transforming=!1,this.writecb=null,this.writechunk=null,this.writeencoding=null}function afterTransform(stream,er,data){var ts=stream._transformState;ts.transforming=!1;var cb=ts.writecb;if(!cb)return stream.emit("error",new Error("no writecb in Transform class"));ts.writechunk=null,ts.writecb=null,null!==data&&void 0!==data&&stream.push(data),cb(er);var rs=stream._readableState;rs.reading=!1,(rs.needReadable||rs.length<rs.highWaterMark)&&stream._read(rs.highWaterMark)}function Transform(options){if(!(this instanceof Transform))return new Transform(options);Duplex.call(this,options),this._transformState=new TransformState(this);var stream=this;this._readableState.needReadable=!0,this._readableState.sync=!1,options&&("function"==typeof options.transform&&(this._transform=options.transform),"function"==typeof options.flush&&(this._flush=options.flush)),this.once("prefinish",function(){"function"==typeof this._flush?this._flush(function(er){done(stream,er)}):done(stream)})}function done(stream,er){if(er)return stream.emit("error",er);var ws=stream._writableState,ts=stream._transformState;if(ws.length)throw new Error("Calling transform done when ws.length != 0");if(ts.transforming)throw new Error("Calling transform done when still transforming");return stream.push(null)}module.exports=Transform;var Duplex=require("./_stream_duplex"),util=require("core-util-is");util.inherits=require("inherits"),util.inherits(Transform,Duplex),Transform.prototype.push=function(chunk,encoding){return this._transformState.needTransform=!1,Duplex.prototype.push.call(this,chunk,encoding)},Transform.prototype._transform=function(chunk,encoding,cb){throw new Error("Not implemented")},Transform.prototype._write=function(chunk,encoding,cb){var ts=this._transformState;if(ts.writecb=cb,ts.writechunk=chunk,ts.writeencoding=encoding,!ts.transforming){var rs=this._readableState;(ts.needTransform||rs.needReadable||rs.length<rs.highWaterMark)&&this._read(rs.highWaterMark)}},Transform.prototype._read=function(n){var ts=this._transformState;null!==ts.writechunk&&ts.writecb&&!ts.transforming?(ts.transforming=!0,this._transform(ts.writechunk,ts.writeencoding,ts.afterTransform)):ts.needTransform=!0}},{"./_stream_duplex":15,"core-util-is":21,inherits:8}],19:[function(require,module,exports){(function(process){"use strict";function nop(){}function WriteReq(chunk,encoding,cb){this.chunk=chunk,this.encoding=encoding,this.callback=cb,this.next=null}function WritableState(options,stream){Duplex=Duplex||require("./_stream_duplex"),options=options||{},this.objectMode=!!options.objectMode,stream instanceof Duplex&&(this.objectMode=this.objectMode||!!options.writableObjectMode);var hwm=options.highWaterMark,defaultHwm=this.objectMode?16:16384;this.highWaterMark=hwm||0===hwm?hwm:defaultHwm,this.highWaterMark=~~this.highWaterMark,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1;var noDecode=options.decodeStrings===!1;this.decodeStrings=!noDecode,this.defaultEncoding=options.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(er){onwrite(stream,er)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.bufferedRequestCount=0,this.corkedRequestsFree=new CorkedRequest(this)}function Writable(options){return Duplex=Duplex||require("./_stream_duplex"),this instanceof Writable||this instanceof Duplex?(this._writableState=new WritableState(options,this),this.writable=!0,options&&("function"==typeof options.write&&(this._write=options.write),"function"==typeof options.writev&&(this._writev=options.writev)),void Stream.call(this)):new Writable(options)}function writeAfterEnd(stream,cb){var er=new Error("write after end");stream.emit("error",er),processNextTick(cb,er)}function validChunk(stream,state,chunk,cb){var valid=!0,er=!1;return null===chunk?er=new TypeError("May not write null values to stream"):Buffer.isBuffer(chunk)||"string"==typeof chunk||void 0===chunk||state.objectMode||(er=new TypeError("Invalid non-string/buffer chunk")),
er&&(stream.emit("error",er),processNextTick(cb,er),valid=!1),valid}function decodeChunk(state,chunk,encoding){return state.objectMode||state.decodeStrings===!1||"string"!=typeof chunk||(chunk=bufferShim.from(chunk,encoding)),chunk}function writeOrBuffer(stream,state,chunk,encoding,cb){chunk=decodeChunk(state,chunk,encoding),Buffer.isBuffer(chunk)&&(encoding="buffer");var len=state.objectMode?1:chunk.length;state.length+=len;var ret=state.length<state.highWaterMark;if(ret||(state.needDrain=!0),state.writing||state.corked){var last=state.lastBufferedRequest;state.lastBufferedRequest=new WriteReq(chunk,encoding,cb),last?last.next=state.lastBufferedRequest:state.bufferedRequest=state.lastBufferedRequest,state.bufferedRequestCount+=1}else doWrite(stream,state,!1,len,chunk,encoding,cb);return ret}function doWrite(stream,state,writev,len,chunk,encoding,cb){state.writelen=len,state.writecb=cb,state.writing=!0,state.sync=!0,writev?stream._writev(chunk,state.onwrite):stream._write(chunk,encoding,state.onwrite),state.sync=!1}function onwriteError(stream,state,sync,er,cb){--state.pendingcb,sync?processNextTick(cb,er):cb(er),stream._writableState.errorEmitted=!0,stream.emit("error",er)}function onwriteStateUpdate(state){state.writing=!1,state.writecb=null,state.length-=state.writelen,state.writelen=0}function onwrite(stream,er){var state=stream._writableState,sync=state.sync,cb=state.writecb;if(onwriteStateUpdate(state),er)onwriteError(stream,state,sync,er,cb);else{var finished=needFinish(state);finished||state.corked||state.bufferProcessing||!state.bufferedRequest||clearBuffer(stream,state),sync?asyncWrite(afterWrite,stream,state,finished,cb):afterWrite(stream,state,finished,cb)}}function afterWrite(stream,state,finished,cb){finished||onwriteDrain(stream,state),state.pendingcb--,cb(),finishMaybe(stream,state)}function onwriteDrain(stream,state){0===state.length&&state.needDrain&&(state.needDrain=!1,stream.emit("drain"))}function clearBuffer(stream,state){state.bufferProcessing=!0;var entry=state.bufferedRequest;if(stream._writev&&entry&&entry.next){var l=state.bufferedRequestCount,buffer=new Array(l),holder=state.corkedRequestsFree;holder.entry=entry;for(var count=0;entry;)buffer[count]=entry,entry=entry.next,count+=1;doWrite(stream,state,!0,state.length,buffer,"",holder.finish),state.pendingcb++,state.lastBufferedRequest=null,holder.next?(state.corkedRequestsFree=holder.next,holder.next=null):state.corkedRequestsFree=new CorkedRequest(state)}else{for(;entry;){var chunk=entry.chunk,encoding=entry.encoding,cb=entry.callback,len=state.objectMode?1:chunk.length;if(doWrite(stream,state,!1,len,chunk,encoding,cb),entry=entry.next,state.writing)break}null===entry&&(state.lastBufferedRequest=null)}state.bufferedRequestCount=0,state.bufferedRequest=entry,state.bufferProcessing=!1}function needFinish(state){return state.ending&&0===state.length&&null===state.bufferedRequest&&!state.finished&&!state.writing}function prefinish(stream,state){state.prefinished||(state.prefinished=!0,stream.emit("prefinish"))}function finishMaybe(stream,state){var need=needFinish(state);return need&&(0===state.pendingcb?(prefinish(stream,state),state.finished=!0,stream.emit("finish")):prefinish(stream,state)),need}function endWritable(stream,state,cb){state.ending=!0,finishMaybe(stream,state),cb&&(state.finished?processNextTick(cb):stream.once("finish",cb)),state.ended=!0,stream.writable=!1}function CorkedRequest(state){var _this=this;this.next=null,this.entry=null,this.finish=function(err){var entry=_this.entry;for(_this.entry=null;entry;){var cb=entry.callback;state.pendingcb--,cb(err),entry=entry.next}state.corkedRequestsFree?state.corkedRequestsFree.next=_this:state.corkedRequestsFree=_this}}module.exports=Writable;var processNextTick=require("process-nextick-args"),asyncWrite=!process.browser&&["v0.10","v0.9."].indexOf(process.version.slice(0,5))>-1?setImmediate:processNextTick;Writable.WritableState=WritableState;var util=require("core-util-is");util.inherits=require("inherits");var Stream,internalUtil={deprecate:require("util-deprecate")};!function(){try{Stream=require("stream")}catch(_){}finally{Stream||(Stream=require("events").EventEmitter)}}();var Buffer=require("buffer").Buffer,bufferShim=require("buffer-shims");util.inherits(Writable,Stream);var Duplex;WritableState.prototype.getBuffer=function(){for(var current=this.bufferedRequest,out=[];current;)out.push(current),current=current.next;return out},function(){try{Object.defineProperty(WritableState.prototype,"buffer",{get:internalUtil.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")})}catch(_){}}();var Duplex;Writable.prototype.pipe=function(){this.emit("error",new Error("Cannot pipe, not readable"))},Writable.prototype.write=function(chunk,encoding,cb){var state=this._writableState,ret=!1;return"function"==typeof encoding&&(cb=encoding,encoding=null),Buffer.isBuffer(chunk)?encoding="buffer":encoding||(encoding=state.defaultEncoding),"function"!=typeof cb&&(cb=nop),state.ended?writeAfterEnd(this,cb):validChunk(this,state,chunk,cb)&&(state.pendingcb++,ret=writeOrBuffer(this,state,chunk,encoding,cb)),ret},Writable.prototype.cork=function(){var state=this._writableState;state.corked++},Writable.prototype.uncork=function(){var state=this._writableState;state.corked&&(state.corked--,state.writing||state.corked||state.finished||state.bufferProcessing||!state.bufferedRequest||clearBuffer(this,state))},Writable.prototype.setDefaultEncoding=function(encoding){if("string"==typeof encoding&&(encoding=encoding.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((encoding+"").toLowerCase())>-1))throw new TypeError("Unknown encoding: "+encoding);return this._writableState.defaultEncoding=encoding,this},Writable.prototype._write=function(chunk,encoding,cb){cb(new Error("not implemented"))},Writable.prototype._writev=null,Writable.prototype.end=function(chunk,encoding,cb){var state=this._writableState;"function"==typeof chunk?(cb=chunk,chunk=null,encoding=null):"function"==typeof encoding&&(cb=encoding,encoding=null),null!==chunk&&void 0!==chunk&&this.write(chunk,encoding),state.corked&&(state.corked=1,this.uncork()),state.ending||state.finished||endWritable(this,state,cb)}}).call(this,require("_process"))},{"./_stream_duplex":15,_process:10,buffer:3,"buffer-shims":20,"core-util-is":21,events:7,inherits:8,"process-nextick-args":23,"util-deprecate":24}],20:[function(require,module,exports){(function(global){"use strict";var buffer=require("buffer"),Buffer=buffer.Buffer,SlowBuffer=buffer.SlowBuffer,MAX_LEN=buffer.kMaxLength||2147483647;exports.alloc=function(size,fill,encoding){if("function"==typeof Buffer.alloc)return Buffer.alloc(size,fill,encoding);if("number"==typeof encoding)throw new TypeError("encoding must not be number");if("number"!=typeof size)throw new TypeError("size must be a number");if(size>MAX_LEN)throw new RangeError("size is too large");var enc=encoding,_fill=fill;void 0===_fill&&(enc=void 0,_fill=0);var buf=new Buffer(size);if("string"==typeof _fill)for(var fillBuf=new Buffer(_fill,enc),flen=fillBuf.length,i=-1;++i<size;)buf[i]=fillBuf[i%flen];else buf.fill(_fill);return buf},exports.allocUnsafe=function(size){if("function"==typeof Buffer.allocUnsafe)return Buffer.allocUnsafe(size);if("number"!=typeof size)throw new TypeError("size must be a number");if(size>MAX_LEN)throw new RangeError("size is too large");return new Buffer(size)},exports.from=function(value,encodingOrOffset,length){if("function"==typeof Buffer.from&&(!global.Uint8Array||Uint8Array.from!==Buffer.from))return Buffer.from(value,encodingOrOffset,length);if("number"==typeof value)throw new TypeError('"value" argument must not be a number');if("string"==typeof value)return new Buffer(value,encodingOrOffset);if("undefined"!=typeof ArrayBuffer&&value instanceof ArrayBuffer){var offset=encodingOrOffset;if(1===arguments.length)return new Buffer(value);"undefined"==typeof offset&&(offset=0);var len=length;if("undefined"==typeof len&&(len=value.byteLength-offset),offset>=value.byteLength)throw new RangeError("'offset' is out of bounds");if(len>value.byteLength-offset)throw new RangeError("'length' is out of bounds");return new Buffer(value.slice(offset,offset+len))}if(Buffer.isBuffer(value)){var out=new Buffer(value.length);return value.copy(out,0,0,value.length),out}if(value){if(Array.isArray(value)||"undefined"!=typeof ArrayBuffer&&value.buffer instanceof ArrayBuffer||"length"in value)return new Buffer(value);if("Buffer"===value.type&&Array.isArray(value.data))return new Buffer(value.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")},exports.allocUnsafeSlow=function(size){if("function"==typeof Buffer.allocUnsafeSlow)return Buffer.allocUnsafeSlow(size);if("number"!=typeof size)throw new TypeError("size must be a number");if(size>=MAX_LEN)throw new RangeError("size is too large");return new SlowBuffer(size)}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{buffer:3}],21:[function(require,module,exports){(function(Buffer){function isArray(arg){return Array.isArray?Array.isArray(arg):"[object Array]"===objectToString(arg)}function isBoolean(arg){return"boolean"==typeof arg}function isNull(arg){return null===arg}function isNullOrUndefined(arg){return null==arg}function isNumber(arg){return"number"==typeof arg}function isString(arg){return"string"==typeof arg}function isSymbol(arg){return"symbol"==typeof arg}function isUndefined(arg){return void 0===arg}function isRegExp(re){return"[object RegExp]"===objectToString(re)}function isObject(arg){return"object"==typeof arg&&null!==arg}function isDate(d){return"[object Date]"===objectToString(d)}function isError(e){return"[object Error]"===objectToString(e)||e instanceof Error}function isFunction(arg){return"function"==typeof arg}function isPrimitive(arg){return null===arg||"boolean"==typeof arg||"number"==typeof arg||"string"==typeof arg||"symbol"==typeof arg||"undefined"==typeof arg}function objectToString(o){return Object.prototype.toString.call(o)}exports.isArray=isArray,exports.isBoolean=isBoolean,exports.isNull=isNull,exports.isNullOrUndefined=isNullOrUndefined,exports.isNumber=isNumber,exports.isString=isString,exports.isSymbol=isSymbol,exports.isUndefined=isUndefined,exports.isRegExp=isRegExp,exports.isObject=isObject,exports.isDate=isDate,exports.isError=isError,exports.isFunction=isFunction,exports.isPrimitive=isPrimitive,exports.isBuffer=Buffer.isBuffer}).call(this,{isBuffer:require("../../../../insert-module-globals/node_modules/is-buffer/index.js")})},{"../../../../insert-module-globals/node_modules/is-buffer/index.js":9}],22:[function(require,module,exports){arguments[4][6][0].apply(exports,arguments)},{dup:6}],23:[function(require,module,exports){(function(process){"use strict";function nextTick(fn,arg1,arg2,arg3){if("function"!=typeof fn)throw new TypeError('"callback" argument must be a function');var args,i,len=arguments.length;switch(len){case 0:case 1:return process.nextTick(fn);case 2:return process.nextTick(function(){fn.call(null,arg1)});case 3:return process.nextTick(function(){fn.call(null,arg1,arg2)});case 4:return process.nextTick(function(){fn.call(null,arg1,arg2,arg3)});default:for(args=new Array(len-1),i=0;i<args.length;)args[i++]=arguments[i];return process.nextTick(function(){fn.apply(null,args)})}}!process.version||0===process.version.indexOf("v0.")||0===process.version.indexOf("v1.")&&0!==process.version.indexOf("v1.8.")?module.exports=nextTick:module.exports=process.nextTick}).call(this,require("_process"))},{_process:10}],24:[function(require,module,exports){(function(global){function deprecate(fn,msg){function deprecated(){if(!warned){if(config("throwDeprecation"))throw new Error(msg);config("traceDeprecation")?console.trace(msg):console.warn(msg),warned=!0}return fn.apply(this,arguments)}if(config("noDeprecation"))return fn;var warned=!1;return deprecated}function config(name){try{if(!global.localStorage)return!1}catch(_){return!1}var val=global.localStorage[name];return null==val?!1:"true"===String(val).toLowerCase()}module.exports=deprecate}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],25:[function(require,module,exports){(function(process){var Stream=function(){try{return require("stream")}catch(_){}}();exports=module.exports=require("./lib/_stream_readable.js"),exports.Stream=Stream||exports,exports.Readable=exports,exports.Writable=require("./lib/_stream_writable.js"),exports.Duplex=require("./lib/_stream_duplex.js"),exports.Transform=require("./lib/_stream_transform.js"),exports.PassThrough=require("./lib/_stream_passthrough.js"),!process.browser&&"disable"===process.env.READABLE_STREAM&&Stream&&(module.exports=Stream)}).call(this,require("_process"))},{"./lib/_stream_duplex.js":15,"./lib/_stream_passthrough.js":16,"./lib/_stream_readable.js":17,"./lib/_stream_transform.js":18,"./lib/_stream_writable.js":19,_process:10}],26:[function(require,module,exports){(function(global){var ClientRequest=require("./lib/request"),extend=require("xtend"),statusCodes=require("builtin-status-codes"),url=require("url"),http=exports;http.request=function(opts,cb){opts="string"==typeof opts?url.parse(opts):extend(opts);var defaultProtocol=-1===global.location.protocol.search(/^https?:$/)?"http:":"",protocol=opts.protocol||defaultProtocol,host=opts.hostname||opts.host,port=opts.port,path=opts.path||"/";host&&-1!==host.indexOf(":")&&(host="["+host+"]"),opts.url=(host?protocol+"//"+host:"")+(port?":"+port:"")+path,opts.method=(opts.method||"GET").toUpperCase(),opts.headers=opts.headers||{};var req=new ClientRequest(opts);return cb&&req.on("response",cb),req},http.get=function(opts,cb){var req=http.request(opts,cb);return req.end(),req},http.Agent=function(){},http.Agent.defaultMaxSockets=4,http.STATUS_CODES=statusCodes,http.METHODS=["CHECKOUT","CONNECT","COPY","DELETE","GET","HEAD","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PROPFIND","PROPPATCH","PURGE","PUT","REPORT","SEARCH","SUBSCRIBE","TRACE","UNLOCK","UNSUBSCRIBE"]}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./lib/request":28,"builtin-status-codes":30,url:33,xtend:35}],27:[function(require,module,exports){(function(global){function checkTypeSupport(type){try{return xhr.responseType=type,xhr.responseType===type}catch(e){}return!1}function isFunction(value){return"function"==typeof value}exports.fetch=isFunction(global.fetch)&&isFunction(global.ReadableByteStream),exports.blobConstructor=!1;try{new Blob([new ArrayBuffer(1)]),exports.blobConstructor=!0}catch(e){}var xhr=new global.XMLHttpRequest;xhr.open("GET",global.location.host?"/":"https://example.com");var haveArrayBuffer="undefined"!=typeof global.ArrayBuffer,haveSlice=haveArrayBuffer&&isFunction(global.ArrayBuffer.prototype.slice);exports.arraybuffer=haveArrayBuffer&&checkTypeSupport("arraybuffer"),exports.msstream=!exports.fetch&&haveSlice&&checkTypeSupport("ms-stream"),exports.mozchunkedarraybuffer=!exports.fetch&&haveArrayBuffer&&checkTypeSupport("moz-chunked-arraybuffer"),exports.overrideMimeType=isFunction(xhr.overrideMimeType),exports.vbArray=isFunction(global.VBArray),xhr=null}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],28:[function(require,module,exports){(function(process,global,Buffer){function decideMode(preferBinary){return capability.fetch?"fetch":capability.mozchunkedarraybuffer?"moz-chunked-arraybuffer":capability.msstream?"ms-stream":capability.arraybuffer&&preferBinary?"arraybuffer":capability.vbArray&&preferBinary?"text:vbarray":"text"}function statusValid(xhr){try{var status=xhr.status;return null!==status&&0!==status}catch(e){return!1}}var capability=require("./capability"),inherits=require("inherits"),response=require("./response"),stream=require("readable-stream"),toArrayBuffer=require("to-arraybuffer"),IncomingMessage=response.IncomingMessage,rStates=response.readyStates,ClientRequest=module.exports=function(opts){var self=this;stream.Writable.call(self),self._opts=opts,self._body=[],self._headers={},opts.auth&&self.setHeader("Authorization","Basic "+new Buffer(opts.auth).toString("base64")),Object.keys(opts.headers).forEach(function(name){self.setHeader(name,opts.headers[name])});var preferBinary;if("prefer-streaming"===opts.mode)preferBinary=!1;else if("allow-wrong-content-type"===opts.mode)preferBinary=!capability.overrideMimeType;else{if(opts.mode&&"default"!==opts.mode&&"prefer-fast"!==opts.mode)throw new Error("Invalid value for opts.mode");preferBinary=!0}self._mode=decideMode(preferBinary),self.on("finish",function(){self._onFinish()})};inherits(ClientRequest,stream.Writable),ClientRequest.prototype.setHeader=function(name,value){var self=this,lowerName=name.toLowerCase();-1===unsafeHeaders.indexOf(lowerName)&&(self._headers[lowerName]={name:name,value:value})},ClientRequest.prototype.getHeader=function(name){var self=this;return self._headers[name.toLowerCase()].value},ClientRequest.prototype.removeHeader=function(name){var self=this;delete self._headers[name.toLowerCase()]},ClientRequest.prototype._onFinish=function(){var self=this;if(!self._destroyed){var body,opts=self._opts,headersObj=self._headers;if("POST"!==opts.method&&"PUT"!==opts.method&&"PATCH"!==opts.method||(body=capability.blobConstructor?new global.Blob(self._body.map(function(buffer){return toArrayBuffer(buffer)}),{type:(headersObj["content-type"]||{}).value||""}):Buffer.concat(self._body).toString()),"fetch"===self._mode){var headers=Object.keys(headersObj).map(function(name){return[headersObj[name].name,headersObj[name].value]});global.fetch(self._opts.url,{method:self._opts.method,headers:headers,body:body,mode:"cors",credentials:opts.withCredentials?"include":"same-origin"}).then(function(response){self._fetchResponse=response,self._connect()},function(reason){self.emit("error",reason)})}else{var xhr=self._xhr=new global.XMLHttpRequest;try{xhr.open(self._opts.method,self._opts.url,!0)}catch(err){return void process.nextTick(function(){self.emit("error",err)})}"responseType"in xhr&&(xhr.responseType=self._mode.split(":")[0]),"withCredentials"in xhr&&(xhr.withCredentials=!!opts.withCredentials),"text"===self._mode&&"overrideMimeType"in xhr&&xhr.overrideMimeType("text/plain; charset=x-user-defined"),Object.keys(headersObj).forEach(function(name){xhr.setRequestHeader(headersObj[name].name,headersObj[name].value)}),self._response=null,xhr.onreadystatechange=function(){switch(xhr.readyState){case rStates.LOADING:case rStates.DONE:self._onXHRProgress()}},"moz-chunked-arraybuffer"===self._mode&&(xhr.onprogress=function(){self._onXHRProgress()}),xhr.onerror=function(){self._destroyed||self.emit("error",new Error("XHR error"))};try{xhr.send(body)}catch(err){return void process.nextTick(function(){self.emit("error",err)})}}}},ClientRequest.prototype._onXHRProgress=function(){var self=this;statusValid(self._xhr)&&!self._destroyed&&(self._response||self._connect(),self._response._onXHRProgress())},ClientRequest.prototype._connect=function(){var self=this;self._destroyed||(self._response=new IncomingMessage(self._xhr,self._fetchResponse,self._mode),self.emit("response",self._response))},ClientRequest.prototype._write=function(chunk,encoding,cb){var self=this;self._body.push(chunk),cb()},ClientRequest.prototype.abort=ClientRequest.prototype.destroy=function(){var self=this;self._destroyed=!0,self._response&&(self._response._destroyed=!0),self._xhr&&self._xhr.abort()},ClientRequest.prototype.end=function(data,encoding,cb){var self=this;"function"==typeof data&&(cb=data,data=void 0),stream.Writable.prototype.end.call(self,data,encoding,cb)},ClientRequest.prototype.flushHeaders=function(){},ClientRequest.prototype.setTimeout=function(){},ClientRequest.prototype.setNoDelay=function(){},ClientRequest.prototype.setSocketKeepAlive=function(){};var unsafeHeaders=["accept-charset","accept-encoding","access-control-request-headers","access-control-request-method","connection","content-length","cookie","cookie2","date","dnt","expect","host","keep-alive","origin","referer","te","trailer","transfer-encoding","upgrade","user-agent","via"]}).call(this,require("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},require("buffer").Buffer)},{"./capability":27,"./response":29,_process:10,buffer:3,inherits:8,"readable-stream":25,"to-arraybuffer":31}],29:[function(require,module,exports){(function(process,global,Buffer){var capability=require("./capability"),inherits=require("inherits"),stream=require("readable-stream"),rStates=exports.readyStates={UNSENT:0,OPENED:1,HEADERS_RECEIVED:2,LOADING:3,DONE:4},IncomingMessage=exports.IncomingMessage=function(xhr,response,mode){function read(){reader.read().then(function(result){if(!self._destroyed){if(result.done)return void self.push(null);self.push(new Buffer(result.value)),read()}})}var self=this;if(stream.Readable.call(self),self._mode=mode,self.headers={},self.rawHeaders=[],self.trailers={},self.rawTrailers=[],self.on("end",function(){process.nextTick(function(){self.emit("close")})}),"fetch"===mode){self._fetchResponse=response,self.url=response.url,self.statusCode=response.status,self.statusMessage=response.statusText;for(var header,_i,_it=response.headers[Symbol.iterator]();header=(_i=_it.next()).value,!_i.done;)self.headers[header[0].toLowerCase()]=header[1],self.rawHeaders.push(header[0],header[1]);var reader=response.body.getReader();read()}else{self._xhr=xhr,self._pos=0,self.url=xhr.responseURL,self.statusCode=xhr.status,self.statusMessage=xhr.statusText;var headers=xhr.getAllResponseHeaders().split(/\r?\n/);if(headers.forEach(function(header){var matches=header.match(/^([^:]+):\s*(.*)/);if(matches){var key=matches[1].toLowerCase();"set-cookie"===key?(void 0===self.headers[key]&&(self.headers[key]=[]),self.headers[key].push(matches[2])):void 0!==self.headers[key]?self.headers[key]+=", "+matches[2]:self.headers[key]=matches[2],self.rawHeaders.push(matches[1],matches[2])}}),self._charset="x-user-defined",!capability.overrideMimeType){var mimeType=self.rawHeaders["mime-type"];if(mimeType){var charsetMatch=mimeType.match(/;\s*charset=([^;])(;|$)/);charsetMatch&&(self._charset=charsetMatch[1].toLowerCase())}self._charset||(self._charset="utf-8")}}};inherits(IncomingMessage,stream.Readable),IncomingMessage.prototype._read=function(){},IncomingMessage.prototype._onXHRProgress=function(){var self=this,xhr=self._xhr,response=null;switch(self._mode){case"text:vbarray":if(xhr.readyState!==rStates.DONE)break;try{response=new global.VBArray(xhr.responseBody).toArray()}catch(e){}if(null!==response){self.push(new Buffer(response));break}case"text":try{response=xhr.responseText}catch(e){self._mode="text:vbarray";break}if(response.length>self._pos){var newData=response.substr(self._pos);if("x-user-defined"===self._charset){for(var buffer=new Buffer(newData.length),i=0;i<newData.length;i++)buffer[i]=255&newData.charCodeAt(i);self.push(buffer)}else self.push(newData,self._charset);self._pos=response.length}break;case"arraybuffer":if(xhr.readyState!==rStates.DONE)break;response=xhr.response,self.push(new Buffer(new Uint8Array(response)));break;case"moz-chunked-arraybuffer":if(response=xhr.response,xhr.readyState!==rStates.LOADING||!response)break;self.push(new Buffer(new Uint8Array(response)));break;case"ms-stream":if(response=xhr.response,xhr.readyState!==rStates.LOADING)break;var reader=new global.MSStreamReader;reader.onprogress=function(){reader.result.byteLength>self._pos&&(self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos)))),self._pos=reader.result.byteLength)},reader.onload=function(){self.push(null)},reader.readAsArrayBuffer(response)}self._xhr.readyState===rStates.DONE&&"ms-stream"!==self._mode&&self.push(null)}}).call(this,require("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},require("buffer").Buffer)},{"./capability":27,_process:10,buffer:3,inherits:8,"readable-stream":25}],30:[function(require,module,exports){module.exports={100:"Continue",101:"Switching Protocols",102:"Processing",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",208:"Already Reported",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",307:"Temporary Redirect",308:"Permanent Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Payload Too Large",414:"URI Too Long",415:"Unsupported Media Type",416:"Range Not Satisfiable",417:"Expectation Failed",418:"I'm a teapot",421:"Misdirected Request",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",425:"Unordered Collection",426:"Upgrade Required",428:"Precondition Required",429:"Too Many Requests",431:"Request Header Fields Too Large",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",508:"Loop Detected",509:"Bandwidth Limit Exceeded",510:"Not Extended",511:"Network Authentication Required"}},{}],31:[function(require,module,exports){var Buffer=require("buffer").Buffer;module.exports=function(buf){if(buf instanceof Uint8Array){if(0===buf.byteOffset&&buf.byteLength===buf.buffer.byteLength)return buf.buffer;if("function"==typeof buf.buffer.slice)return buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.byteLength)}if(Buffer.isBuffer(buf)){for(var arrayCopy=new Uint8Array(buf.length),len=buf.length,i=0;len>i;i++)arrayCopy[i]=buf[i];return arrayCopy.buffer}throw new Error("Argument must be a Buffer")}},{buffer:3}],32:[function(require,module,exports){function assertEncoding(encoding){if(encoding&&!isBufferEncoding(encoding))throw new Error("Unknown encoding: "+encoding)}function passThroughWrite(buffer){return buffer.toString(this.encoding)}function utf16DetectIncompleteChar(buffer){this.charReceived=buffer.length%2,this.charLength=this.charReceived?2:0}function base64DetectIncompleteChar(buffer){this.charReceived=buffer.length%3,this.charLength=this.charReceived?3:0}var Buffer=require("buffer").Buffer,isBufferEncoding=Buffer.isEncoding||function(encoding){switch(encoding&&encoding.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}},StringDecoder=exports.StringDecoder=function(encoding){switch(this.encoding=(encoding||"utf8").toLowerCase().replace(/[-_]/,""),assertEncoding(encoding),this.encoding){case"utf8":this.surrogateSize=3;break;case"ucs2":case"utf16le":this.surrogateSize=2,this.detectIncompleteChar=utf16DetectIncompleteChar;break;case"base64":this.surrogateSize=3,this.detectIncompleteChar=base64DetectIncompleteChar;break;default:return void(this.write=passThroughWrite)}this.charBuffer=new Buffer(6),this.charReceived=0,this.charLength=0};StringDecoder.prototype.write=function(buffer){for(var charStr="";this.charLength;){var available=buffer.length>=this.charLength-this.charReceived?this.charLength-this.charReceived:buffer.length;if(buffer.copy(this.charBuffer,this.charReceived,0,available),this.charReceived+=available,this.charReceived<this.charLength)return"";buffer=buffer.slice(available,buffer.length),charStr=this.charBuffer.slice(0,this.charLength).toString(this.encoding);var charCode=charStr.charCodeAt(charStr.length-1);if(!(charCode>=55296&&56319>=charCode)){if(this.charReceived=this.charLength=0,0===buffer.length)return charStr;break}this.charLength+=this.surrogateSize,charStr=""}this.detectIncompleteChar(buffer);var end=buffer.length;this.charLength&&(buffer.copy(this.charBuffer,0,buffer.length-this.charReceived,end),end-=this.charReceived),charStr+=buffer.toString(this.encoding,0,end);var end=charStr.length-1,charCode=charStr.charCodeAt(end);if(charCode>=55296&&56319>=charCode){var size=this.surrogateSize;return this.charLength+=size,this.charReceived+=size,this.charBuffer.copy(this.charBuffer,size,0,size),buffer.copy(this.charBuffer,0,0,size),charStr.substring(0,end)}return charStr},StringDecoder.prototype.detectIncompleteChar=function(buffer){for(var i=buffer.length>=3?3:buffer.length;i>0;i--){var c=buffer[buffer.length-i];if(1==i&&c>>5==6){this.charLength=2;break}if(2>=i&&c>>4==14){this.charLength=3;break}if(3>=i&&c>>3==30){this.charLength=4;break}}this.charReceived=i},StringDecoder.prototype.end=function(buffer){var res="";if(buffer&&buffer.length&&(res=this.write(buffer)),this.charReceived){var cr=this.charReceived,buf=this.charBuffer,enc=this.encoding;res+=buf.slice(0,cr).toString(enc)}return res}},{buffer:3}],33:[function(require,module,exports){"use strict";function Url(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}function urlParse(url,parseQueryString,slashesDenoteHost){if(url&&util.isObject(url)&&url instanceof Url)return url;var u=new Url;return u.parse(url,parseQueryString,slashesDenoteHost),u}function urlFormat(obj){return util.isString(obj)&&(obj=urlParse(obj)),obj instanceof Url?obj.format():Url.prototype.format.call(obj)}function urlResolve(source,relative){return urlParse(source,!1,!0).resolve(relative)}function urlResolveObject(source,relative){return source?urlParse(source,!1,!0).resolveObject(relative):relative}var punycode=require("punycode"),util=require("./util");exports.parse=urlParse,exports.resolve=urlResolve,exports.resolveObject=urlResolveObject,exports.format=urlFormat,exports.Url=Url;var protocolPattern=/^([a-z0-9.+-]+:)/i,portPattern=/:[0-9]*$/,simplePathPattern=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,delims=["<",">",'"',"`"," ","\r","\n","	"],unwise=["{","}","|","\\","^","`"].concat(delims),autoEscape=["'"].concat(unwise),nonHostChars=["%","/","?",";","#"].concat(autoEscape),hostEndingChars=["/","?","#"],hostnameMaxLen=255,hostnamePartPattern=/^[+a-z0-9A-Z_-]{0,63}$/,hostnamePartStart=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,unsafeProtocol={javascript:!0,"javascript:":!0},hostlessProtocol={javascript:!0,"javascript:":!0},slashedProtocol={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},querystring=require("querystring");Url.prototype.parse=function(url,parseQueryString,slashesDenoteHost){if(!util.isString(url))throw new TypeError("Parameter 'url' must be a string, not "+typeof url);var queryIndex=url.indexOf("?"),splitter=-1!==queryIndex&&queryIndex<url.indexOf("#")?"?":"#",uSplit=url.split(splitter),slashRegex=/\\/g;uSplit[0]=uSplit[0].replace(slashRegex,"/"),url=uSplit.join(splitter);var rest=url;if(rest=rest.trim(),!slashesDenoteHost&&1===url.split("#").length){var simplePath=simplePathPattern.exec(rest);if(simplePath)return this.path=rest,this.href=rest,this.pathname=simplePath[1],simplePath[2]?(this.search=simplePath[2],parseQueryString?this.query=querystring.parse(this.search.substr(1)):this.query=this.search.substr(1)):parseQueryString&&(this.search="",this.query={}),this}var proto=protocolPattern.exec(rest);if(proto){proto=proto[0];var lowerProto=proto.toLowerCase();this.protocol=lowerProto,rest=rest.substr(proto.length)}if(slashesDenoteHost||proto||rest.match(/^\/\/[^@\/]+@[^@\/]+/)){var slashes="//"===rest.substr(0,2);
!slashes||proto&&hostlessProtocol[proto]||(rest=rest.substr(2),this.slashes=!0)}if(!hostlessProtocol[proto]&&(slashes||proto&&!slashedProtocol[proto])){for(var hostEnd=-1,i=0;i<hostEndingChars.length;i++){var hec=rest.indexOf(hostEndingChars[i]);-1!==hec&&(-1===hostEnd||hostEnd>hec)&&(hostEnd=hec)}var auth,atSign;atSign=-1===hostEnd?rest.lastIndexOf("@"):rest.lastIndexOf("@",hostEnd),-1!==atSign&&(auth=rest.slice(0,atSign),rest=rest.slice(atSign+1),this.auth=decodeURIComponent(auth)),hostEnd=-1;for(var i=0;i<nonHostChars.length;i++){var hec=rest.indexOf(nonHostChars[i]);-1!==hec&&(-1===hostEnd||hostEnd>hec)&&(hostEnd=hec)}-1===hostEnd&&(hostEnd=rest.length),this.host=rest.slice(0,hostEnd),rest=rest.slice(hostEnd),this.parseHost(),this.hostname=this.hostname||"";var ipv6Hostname="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!ipv6Hostname)for(var hostparts=this.hostname.split(/\./),i=0,l=hostparts.length;l>i;i++){var part=hostparts[i];if(part&&!part.match(hostnamePartPattern)){for(var newpart="",j=0,k=part.length;k>j;j++)newpart+=part.charCodeAt(j)>127?"x":part[j];if(!newpart.match(hostnamePartPattern)){var validParts=hostparts.slice(0,i),notHost=hostparts.slice(i+1),bit=part.match(hostnamePartStart);bit&&(validParts.push(bit[1]),notHost.unshift(bit[2])),notHost.length&&(rest="/"+notHost.join(".")+rest),this.hostname=validParts.join(".");break}}}this.hostname.length>hostnameMaxLen?this.hostname="":this.hostname=this.hostname.toLowerCase(),ipv6Hostname||(this.hostname=punycode.toASCII(this.hostname));var p=this.port?":"+this.port:"",h=this.hostname||"";this.host=h+p,this.href+=this.host,ipv6Hostname&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==rest[0]&&(rest="/"+rest))}if(!unsafeProtocol[lowerProto])for(var i=0,l=autoEscape.length;l>i;i++){var ae=autoEscape[i];if(-1!==rest.indexOf(ae)){var esc=encodeURIComponent(ae);esc===ae&&(esc=escape(ae)),rest=rest.split(ae).join(esc)}}var hash=rest.indexOf("#");-1!==hash&&(this.hash=rest.substr(hash),rest=rest.slice(0,hash));var qm=rest.indexOf("?");if(-1!==qm?(this.search=rest.substr(qm),this.query=rest.substr(qm+1),parseQueryString&&(this.query=querystring.parse(this.query)),rest=rest.slice(0,qm)):parseQueryString&&(this.search="",this.query={}),rest&&(this.pathname=rest),slashedProtocol[lowerProto]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){var p=this.pathname||"",s=this.search||"";this.path=p+s}return this.href=this.format(),this},Url.prototype.format=function(){var auth=this.auth||"";auth&&(auth=encodeURIComponent(auth),auth=auth.replace(/%3A/i,":"),auth+="@");var protocol=this.protocol||"",pathname=this.pathname||"",hash=this.hash||"",host=!1,query="";this.host?host=auth+this.host:this.hostname&&(host=auth+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(host+=":"+this.port)),this.query&&util.isObject(this.query)&&Object.keys(this.query).length&&(query=querystring.stringify(this.query));var search=this.search||query&&"?"+query||"";return protocol&&":"!==protocol.substr(-1)&&(protocol+=":"),this.slashes||(!protocol||slashedProtocol[protocol])&&host!==!1?(host="//"+(host||""),pathname&&"/"!==pathname.charAt(0)&&(pathname="/"+pathname)):host||(host=""),hash&&"#"!==hash.charAt(0)&&(hash="#"+hash),search&&"?"!==search.charAt(0)&&(search="?"+search),pathname=pathname.replace(/[?#]/g,function(match){return encodeURIComponent(match)}),search=search.replace("#","%23"),protocol+host+pathname+search+hash},Url.prototype.resolve=function(relative){return this.resolveObject(urlParse(relative,!1,!0)).format()},Url.prototype.resolveObject=function(relative){if(util.isString(relative)){var rel=new Url;rel.parse(relative,!1,!0),relative=rel}for(var result=new Url,tkeys=Object.keys(this),tk=0;tk<tkeys.length;tk++){var tkey=tkeys[tk];result[tkey]=this[tkey]}if(result.hash=relative.hash,""===relative.href)return result.href=result.format(),result;if(relative.slashes&&!relative.protocol){for(var rkeys=Object.keys(relative),rk=0;rk<rkeys.length;rk++){var rkey=rkeys[rk];"protocol"!==rkey&&(result[rkey]=relative[rkey])}return slashedProtocol[result.protocol]&&result.hostname&&!result.pathname&&(result.path=result.pathname="/"),result.href=result.format(),result}if(relative.protocol&&relative.protocol!==result.protocol){if(!slashedProtocol[relative.protocol]){for(var keys=Object.keys(relative),v=0;v<keys.length;v++){var k=keys[v];result[k]=relative[k]}return result.href=result.format(),result}if(result.protocol=relative.protocol,relative.host||hostlessProtocol[relative.protocol])result.pathname=relative.pathname;else{for(var relPath=(relative.pathname||"").split("/");relPath.length&&!(relative.host=relPath.shift()););relative.host||(relative.host=""),relative.hostname||(relative.hostname=""),""!==relPath[0]&&relPath.unshift(""),relPath.length<2&&relPath.unshift(""),result.pathname=relPath.join("/")}if(result.search=relative.search,result.query=relative.query,result.host=relative.host||"",result.auth=relative.auth,result.hostname=relative.hostname||relative.host,result.port=relative.port,result.pathname||result.search){var p=result.pathname||"",s=result.search||"";result.path=p+s}return result.slashes=result.slashes||relative.slashes,result.href=result.format(),result}var isSourceAbs=result.pathname&&"/"===result.pathname.charAt(0),isRelAbs=relative.host||relative.pathname&&"/"===relative.pathname.charAt(0),mustEndAbs=isRelAbs||isSourceAbs||result.host&&relative.pathname,removeAllDots=mustEndAbs,srcPath=result.pathname&&result.pathname.split("/")||[],relPath=relative.pathname&&relative.pathname.split("/")||[],psychotic=result.protocol&&!slashedProtocol[result.protocol];if(psychotic&&(result.hostname="",result.port=null,result.host&&(""===srcPath[0]?srcPath[0]=result.host:srcPath.unshift(result.host)),result.host="",relative.protocol&&(relative.hostname=null,relative.port=null,relative.host&&(""===relPath[0]?relPath[0]=relative.host:relPath.unshift(relative.host)),relative.host=null),mustEndAbs=mustEndAbs&&(""===relPath[0]||""===srcPath[0])),isRelAbs)result.host=relative.host||""===relative.host?relative.host:result.host,result.hostname=relative.hostname||""===relative.hostname?relative.hostname:result.hostname,result.search=relative.search,result.query=relative.query,srcPath=relPath;else if(relPath.length)srcPath||(srcPath=[]),srcPath.pop(),srcPath=srcPath.concat(relPath),result.search=relative.search,result.query=relative.query;else if(!util.isNullOrUndefined(relative.search)){if(psychotic){result.hostname=result.host=srcPath.shift();var authInHost=result.host&&result.host.indexOf("@")>0?result.host.split("@"):!1;authInHost&&(result.auth=authInHost.shift(),result.host=result.hostname=authInHost.shift())}return result.search=relative.search,result.query=relative.query,util.isNull(result.pathname)&&util.isNull(result.search)||(result.path=(result.pathname?result.pathname:"")+(result.search?result.search:"")),result.href=result.format(),result}if(!srcPath.length)return result.pathname=null,result.search?result.path="/"+result.search:result.path=null,result.href=result.format(),result;for(var last=srcPath.slice(-1)[0],hasTrailingSlash=(result.host||relative.host||srcPath.length>1)&&("."===last||".."===last)||""===last,up=0,i=srcPath.length;i>=0;i--)last=srcPath[i],"."===last?srcPath.splice(i,1):".."===last?(srcPath.splice(i,1),up++):up&&(srcPath.splice(i,1),up--);if(!mustEndAbs&&!removeAllDots)for(;up--;up)srcPath.unshift("..");!mustEndAbs||""===srcPath[0]||srcPath[0]&&"/"===srcPath[0].charAt(0)||srcPath.unshift(""),hasTrailingSlash&&"/"!==srcPath.join("/").substr(-1)&&srcPath.push("");var isAbsolute=""===srcPath[0]||srcPath[0]&&"/"===srcPath[0].charAt(0);if(psychotic){result.hostname=result.host=isAbsolute?"":srcPath.length?srcPath.shift():"";var authInHost=result.host&&result.host.indexOf("@")>0?result.host.split("@"):!1;authInHost&&(result.auth=authInHost.shift(),result.host=result.hostname=authInHost.shift())}return mustEndAbs=mustEndAbs||result.host&&srcPath.length,mustEndAbs&&!isAbsolute&&srcPath.unshift(""),srcPath.length?result.pathname=srcPath.join("/"):(result.pathname=null,result.path=null),util.isNull(result.pathname)&&util.isNull(result.search)||(result.path=(result.pathname?result.pathname:"")+(result.search?result.search:"")),result.auth=relative.auth||result.auth,result.slashes=result.slashes||relative.slashes,result.href=result.format(),result},Url.prototype.parseHost=function(){var host=this.host,port=portPattern.exec(host);port&&(port=port[0],":"!==port&&(this.port=port.substr(1)),host=host.substr(0,host.length-port.length)),host&&(this.hostname=host)}},{"./util":34,punycode:11,querystring:14}],34:[function(require,module,exports){"use strict";module.exports={isString:function(arg){return"string"==typeof arg},isObject:function(arg){return"object"==typeof arg&&null!==arg},isNull:function(arg){return null===arg},isNullOrUndefined:function(arg){return null==arg}}},{}],35:[function(require,module,exports){function extend(){for(var target={},i=0;i<arguments.length;i++){var source=arguments[i];for(var key in source)hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target}module.exports=extend;var hasOwnProperty=Object.prototype.hasOwnProperty},{}],36:[function(require,module,exports){function assignWith(object,source,customizer){for(var index=-1,props=keys(source),length=props.length;++index<length;){var key=props[index],value=object[key],result=customizer(value,source[key],key,object,source);(result===result?result===value:value!==value)&&(void 0!==value||key in object)||(object[key]=result)}return object}var baseAssign=require("lodash._baseassign"),createAssigner=require("lodash._createassigner"),keys=require("lodash.keys"),assign=createAssigner(function(object,source,customizer){return customizer?assignWith(object,source,customizer):baseAssign(object,source)});module.exports=assign},{"lodash._baseassign":37,"lodash._createassigner":39,"lodash.keys":43}],37:[function(require,module,exports){function baseAssign(object,source){return null==source?object:baseCopy(source,keys(source),object)}var baseCopy=require("lodash._basecopy"),keys=require("lodash.keys");module.exports=baseAssign},{"lodash._basecopy":38,"lodash.keys":43}],38:[function(require,module,exports){function baseCopy(source,props,object){object||(object={});for(var index=-1,length=props.length;++index<length;){var key=props[index];object[key]=source[key]}return object}module.exports=baseCopy},{}],39:[function(require,module,exports){function createAssigner(assigner){return restParam(function(object,sources){var index=-1,length=null==object?0:sources.length,customizer=length>2?sources[length-2]:void 0,guard=length>2?sources[2]:void 0,thisArg=length>1?sources[length-1]:void 0;for("function"==typeof customizer?(customizer=bindCallback(customizer,thisArg,5),length-=2):(customizer="function"==typeof thisArg?thisArg:void 0,length-=customizer?1:0),guard&&isIterateeCall(sources[0],sources[1],guard)&&(customizer=3>length?void 0:customizer,length=1);++index<length;){var source=sources[index];source&&assigner(object,source,customizer)}return object})}var bindCallback=require("lodash._bindcallback"),isIterateeCall=require("lodash._isiterateecall"),restParam=require("lodash.restparam");module.exports=createAssigner},{"lodash._bindcallback":40,"lodash._isiterateecall":41,"lodash.restparam":42}],40:[function(require,module,exports){function bindCallback(func,thisArg,argCount){if("function"!=typeof func)return identity;if(void 0===thisArg)return func;switch(argCount){case 1:return function(value){return func.call(thisArg,value)};case 3:return function(value,index,collection){return func.call(thisArg,value,index,collection)};case 4:return function(accumulator,value,index,collection){return func.call(thisArg,accumulator,value,index,collection)};case 5:return function(value,other,key,object,source){return func.call(thisArg,value,other,key,object,source)}}return function(){return func.apply(thisArg,arguments)}}function identity(value){return value}module.exports=bindCallback},{}],41:[function(require,module,exports){function baseProperty(key){return function(object){return null==object?void 0:object[key]}}function isArrayLike(value){return null!=value&&isLength(getLength(value))}function isIndex(value,length){return value="number"==typeof value||reIsUint.test(value)?+value:-1,length=null==length?MAX_SAFE_INTEGER:length,value>-1&&value%1==0&&length>value}function isIterateeCall(value,index,object){if(!isObject(object))return!1;var type=typeof index;if("number"==type?isArrayLike(object)&&isIndex(index,object.length):"string"==type&&index in object){var other=object[index];return value===value?value===other:other!==other}return!1}function isLength(value){return"number"==typeof value&&value>-1&&value%1==0&&MAX_SAFE_INTEGER>=value}function isObject(value){var type=typeof value;return!!value&&("object"==type||"function"==type)}var reIsUint=/^\d+$/,MAX_SAFE_INTEGER=9007199254740991,getLength=baseProperty("length");module.exports=isIterateeCall},{}],42:[function(require,module,exports){function restParam(func,start){if("function"!=typeof func)throw new TypeError(FUNC_ERROR_TEXT);return start=nativeMax(void 0===start?func.length-1:+start||0,0),function(){for(var args=arguments,index=-1,length=nativeMax(args.length-start,0),rest=Array(length);++index<length;)rest[index]=args[start+index];switch(start){case 0:return func.call(this,rest);case 1:return func.call(this,args[0],rest);case 2:return func.call(this,args[0],args[1],rest)}var otherArgs=Array(start+1);for(index=-1;++index<start;)otherArgs[index]=args[index];return otherArgs[start]=rest,func.apply(this,otherArgs)}}var FUNC_ERROR_TEXT="Expected a function",nativeMax=Math.max;module.exports=restParam},{}],43:[function(require,module,exports){function baseProperty(key){return function(object){return null==object?void 0:object[key]}}function isArrayLike(value){return null!=value&&isLength(getLength(value))}function isIndex(value,length){return value="number"==typeof value||reIsUint.test(value)?+value:-1,length=null==length?MAX_SAFE_INTEGER:length,value>-1&&value%1==0&&length>value}function isLength(value){return"number"==typeof value&&value>-1&&value%1==0&&MAX_SAFE_INTEGER>=value}function shimKeys(object){for(var props=keysIn(object),propsLength=props.length,length=propsLength&&object.length,allowIndexes=!!length&&isLength(length)&&(isArray(object)||isArguments(object)),index=-1,result=[];++index<propsLength;){var key=props[index];(allowIndexes&&isIndex(key,length)||hasOwnProperty.call(object,key))&&result.push(key)}return result}function isObject(value){var type=typeof value;return!!value&&("object"==type||"function"==type)}function keysIn(object){if(null==object)return[];isObject(object)||(object=Object(object));var length=object.length;length=length&&isLength(length)&&(isArray(object)||isArguments(object))&&length||0;for(var Ctor=object.constructor,index=-1,isProto="function"==typeof Ctor&&Ctor.prototype===object,result=Array(length),skipIndexes=length>0;++index<length;)result[index]=index+"";for(var key in object)skipIndexes&&isIndex(key,length)||"constructor"==key&&(isProto||!hasOwnProperty.call(object,key))||result.push(key);return result}var getNative=require("lodash._getnative"),isArguments=require("lodash.isarguments"),isArray=require("lodash.isarray"),reIsUint=/^\d+$/,objectProto=Object.prototype,hasOwnProperty=objectProto.hasOwnProperty,nativeKeys=getNative(Object,"keys"),MAX_SAFE_INTEGER=9007199254740991,getLength=baseProperty("length"),keys=nativeKeys?function(object){var Ctor=null==object?void 0:object.constructor;return"function"==typeof Ctor&&Ctor.prototype===object||"function"!=typeof object&&isArrayLike(object)?shimKeys(object):isObject(object)?nativeKeys(object):[]}:shimKeys;module.exports=keys},{"lodash._getnative":44,"lodash.isarguments":45,"lodash.isarray":48}],44:[function(require,module,exports){function isObjectLike(value){return!!value&&"object"==typeof value}function getNative(object,key){var value=null==object?void 0:object[key];return isNative(value)?value:void 0}function isFunction(value){return isObject(value)&&objToString.call(value)==funcTag}function isObject(value){var type=typeof value;return!!value&&("object"==type||"function"==type)}function isNative(value){return null==value?!1:isFunction(value)?reIsNative.test(fnToString.call(value)):isObjectLike(value)&&reIsHostCtor.test(value)}var funcTag="[object Function]",reIsHostCtor=/^\[object .+?Constructor\]$/,objectProto=Object.prototype,fnToString=Function.prototype.toString,hasOwnProperty=objectProto.hasOwnProperty,objToString=objectProto.toString,reIsNative=RegExp("^"+fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");module.exports=getNative},{}],45:[function(require,module,exports){function isObjectLike(value){return!!value&&"object"==typeof value}function baseProperty(key){return function(object){return null==object?void 0:object[key]}}function isArrayLike(value){return null!=value&&isLength(getLength(value))}function isLength(value){return"number"==typeof value&&value>-1&&value%1==0&&MAX_SAFE_INTEGER>=value}function isArguments(value){return isObjectLike(value)&&isArrayLike(value)&&hasOwnProperty.call(value,"callee")&&!propertyIsEnumerable.call(value,"callee")}var objectProto=Object.prototype,hasOwnProperty=objectProto.hasOwnProperty,propertyIsEnumerable=objectProto.propertyIsEnumerable,MAX_SAFE_INTEGER=9007199254740991,getLength=baseProperty("length");module.exports=isArguments},{}],46:[function(require,module,exports){function baseClamp(number,lower,upper){return number===number&&(void 0!==upper&&(number=upper>=number?number:upper),void 0!==lower&&(number=number>=lower?number:lower)),number}function isFunction(value){var tag=isObject(value)?objectToString.call(value):"";return tag==funcTag||tag==genTag}function isObject(value){var type=typeof value;return!!value&&("object"==type||"function"==type)}function isObjectLike(value){return!!value&&"object"==typeof value}function isSymbol(value){return"symbol"==typeof value||isObjectLike(value)&&objectToString.call(value)==symbolTag}function toInteger(value){if(!value)return 0===value?value:0;if(value=toNumber(value),value===INFINITY||value===-INFINITY){var sign=0>value?-1:1;return sign*MAX_INTEGER}var remainder=value%1;return value===value?remainder?value-remainder:value:0}function toNumber(value){if(isObject(value)){var other=isFunction(value.valueOf)?value.valueOf():value;value=isObject(other)?other+"":other}if("string"!=typeof value)return 0===value?value:+value;value=value.replace(reTrim,"");var isBinary=reIsBinary.test(value);return isBinary||reIsOctal.test(value)?freeParseInt(value.slice(2),isBinary?2:8):reIsBadHex.test(value)?NAN:+value}function toString(value){if("string"==typeof value)return value;if(null==value)return"";if(isSymbol(value))return Symbol?symbolToString.call(value):"";var result=value+"";return"0"==result&&1/value==-INFINITY?"-0":result}function endsWith(string,target,position){string=toString(string),target="string"==typeof target?target:target+"";var length=string.length;return position=void 0===position?length:baseClamp(toInteger(position),0,length),position-=target.length,position>=0&&string.indexOf(target,position)==position}var root=require("lodash._root"),INFINITY=1/0,MAX_INTEGER=1.7976931348623157e308,NAN=NaN,funcTag="[object Function]",genTag="[object GeneratorFunction]",symbolTag="[object Symbol]",reTrim=/^\s+|\s+$/g,reIsBadHex=/^[-+]0x[0-9a-f]+$/i,reIsBinary=/^0b[01]+$/i,reIsOctal=/^0o[0-7]+$/i,freeParseInt=parseInt,objectProto=Object.prototype,objectToString=objectProto.toString,Symbol=root.Symbol,symbolProto=Symbol?Symbol.prototype:void 0,symbolToString=Symbol?symbolProto.toString:void 0;module.exports=endsWith},{"lodash._root":47}],47:[function(require,module,exports){(function(global){function checkGlobal(value){return value&&value.Object===Object?value:null}var objectTypes={"function":!0,object:!0},freeExports=objectTypes[typeof exports]&&exports&&!exports.nodeType?exports:null,freeModule=objectTypes[typeof module]&&module&&!module.nodeType?module:null,freeGlobal=checkGlobal(freeExports&&freeModule&&"object"==typeof global&&global),freeSelf=checkGlobal(objectTypes[typeof self]&&self),freeWindow=checkGlobal(objectTypes[typeof window]&&window),thisGlobal=checkGlobal(objectTypes[typeof this]&&this),root=freeGlobal||freeWindow!==(thisGlobal&&thisGlobal.window)&&freeWindow||freeSelf||thisGlobal||Function("return this")();module.exports=root}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],48:[function(require,module,exports){function isObjectLike(value){return!!value&&"object"==typeof value}function getNative(object,key){var value=null==object?void 0:object[key];return isNative(value)?value:void 0}function isLength(value){return"number"==typeof value&&value>-1&&value%1==0&&MAX_SAFE_INTEGER>=value}function isFunction(value){return isObject(value)&&objToString.call(value)==funcTag}function isObject(value){var type=typeof value;return!!value&&("object"==type||"function"==type)}function isNative(value){return null==value?!1:isFunction(value)?reIsNative.test(fnToString.call(value)):isObjectLike(value)&&reIsHostCtor.test(value)}var arrayTag="[object Array]",funcTag="[object Function]",reIsHostCtor=/^\[object .+?Constructor\]$/,objectProto=Object.prototype,fnToString=Function.prototype.toString,hasOwnProperty=objectProto.hasOwnProperty,objToString=objectProto.toString,reIsNative=RegExp("^"+fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),nativeIsArray=getNative(Array,"isArray"),MAX_SAFE_INTEGER=9007199254740991,isArray=nativeIsArray||function(value){return isObjectLike(value)&&isLength(value.length)&&objToString.call(value)==arrayTag};module.exports=isArray},{}],49:[function(require,module,exports){function isObjectLike(value){return!!value&&"object"==typeof value}function isString(value){return"string"==typeof value||isObjectLike(value)&&objToString.call(value)==stringTag}var stringTag="[object String]",objectProto=Object.prototype,objToString=objectProto.toString;module.exports=isString},{}],50:[function(require,module,exports){function last(array){var length=array?array.length:0;return length?array[length-1]:void 0}module.exports=last},{}],51:[function(require,module,exports){function baseMap(collection,iteratee){var index=-1,result=isArrayLike(collection)?Array(collection.length):[];return baseEach(collection,function(value,key,collection){result[++index]=iteratee(value,key,collection)}),result}function baseProperty(key){return function(object){return null==object?void 0:object[key]}}function isArrayLike(value){return null!=value&&isLength(getLength(value))}function isLength(value){return"number"==typeof value&&value>-1&&value%1==0&&MAX_SAFE_INTEGER>=value}function map(collection,iteratee,thisArg){var func=isArray(collection)?arrayMap:baseMap;return iteratee=baseCallback(iteratee,thisArg,3),func(collection,iteratee)}var arrayMap=require("lodash._arraymap"),baseCallback=require("lodash._basecallback"),baseEach=require("lodash._baseeach"),isArray=require("lodash.isarray"),MAX_SAFE_INTEGER=9007199254740991,getLength=baseProperty("length");module.exports=map},{"lodash._arraymap":52,"lodash._basecallback":53,"lodash._baseeach":58,"lodash.isarray":48}],52:[function(require,module,exports){function arrayMap(array,iteratee){for(var index=-1,length=array.length,result=Array(length);++index<length;)result[index]=iteratee(array[index],index,array);return result}module.exports=arrayMap},{}],53:[function(require,module,exports){function baseToString(value){return null==value?"":value+""}function baseCallback(func,thisArg,argCount){var type=typeof func;return"function"==type?void 0===thisArg?func:bindCallback(func,thisArg,argCount):null==func?identity:"object"==type?baseMatches(func):void 0===thisArg?property(func):baseMatchesProperty(func,thisArg)}function baseGet(object,path,pathKey){if(null!=object){void 0!==pathKey&&pathKey in toObject(object)&&(path=[pathKey]);for(var index=0,length=path.length;null!=object&&length>index;)object=object[path[index++]];return index&&index==length?object:void 0}}function baseIsMatch(object,matchData,customizer){var index=matchData.length,length=index,noCustomizer=!customizer;if(null==object)return!length;for(object=toObject(object);index--;){var data=matchData[index];if(noCustomizer&&data[2]?data[1]!==object[data[0]]:!(data[0]in object))return!1}for(;++index<length;){data=matchData[index];var key=data[0],objValue=object[key],srcValue=data[1];if(noCustomizer&&data[2]){if(void 0===objValue&&!(key in object))return!1}else{var result=customizer?customizer(objValue,srcValue,key):void 0;if(!(void 0===result?baseIsEqual(srcValue,objValue,customizer,!0):result))return!1}}return!0}function baseMatches(source){var matchData=getMatchData(source);if(1==matchData.length&&matchData[0][2]){var key=matchData[0][0],value=matchData[0][1];return function(object){return null==object?!1:object[key]===value&&(void 0!==value||key in toObject(object))}}return function(object){return baseIsMatch(object,matchData)}}function baseMatchesProperty(path,srcValue){var isArr=isArray(path),isCommon=isKey(path)&&isStrictComparable(srcValue),pathKey=path+"";return path=toPath(path),function(object){if(null==object)return!1;var key=pathKey;if(object=toObject(object),(isArr||!isCommon)&&!(key in object)){if(object=1==path.length?object:baseGet(object,baseSlice(path,0,-1)),null==object)return!1;key=last(path),object=toObject(object)}return object[key]===srcValue?void 0!==srcValue||key in object:baseIsEqual(srcValue,object[key],void 0,!0)}}function baseProperty(key){return function(object){return null==object?void 0:object[key]}}function basePropertyDeep(path){var pathKey=path+"";return path=toPath(path),function(object){return baseGet(object,path,pathKey)}}function baseSlice(array,start,end){var index=-1,length=array.length;start=null==start?0:+start||0,0>start&&(start=-start>length?0:length+start),end=void 0===end||end>length?length:+end||0,0>end&&(end+=length),length=start>end?0:end-start>>>0,start>>>=0;for(var result=Array(length);++index<length;)result[index]=array[index+start];return result}function getMatchData(object){for(var result=pairs(object),length=result.length;length--;)result[length][2]=isStrictComparable(result[length][1]);return result}function isKey(value,object){var type=typeof value;if("string"==type&&reIsPlainProp.test(value)||"number"==type)return!0;if(isArray(value))return!1;var result=!reIsDeepProp.test(value);return result||null!=object&&value in toObject(object)}function isStrictComparable(value){return value===value&&!isObject(value)}function toObject(value){return isObject(value)?value:Object(value)}function toPath(value){if(isArray(value))return value;var result=[];return baseToString(value).replace(rePropName,function(match,number,quote,string){result.push(quote?string.replace(reEscapeChar,"$1"):number||match)}),result}function last(array){var length=array?array.length:0;return length?array[length-1]:void 0}function isObject(value){var type=typeof value;return!!value&&("object"==type||"function"==type)}function identity(value){return value}function property(path){return isKey(path)?baseProperty(path):basePropertyDeep(path)}var baseIsEqual=require("lodash._baseisequal"),bindCallback=require("lodash._bindcallback"),isArray=require("lodash.isarray"),pairs=require("lodash.pairs"),reIsDeepProp=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,reIsPlainProp=/^\w*$/,rePropName=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,reEscapeChar=/\\(\\)?/g;module.exports=baseCallback},{"lodash._baseisequal":54,"lodash._bindcallback":56,"lodash.isarray":48,"lodash.pairs":57}],54:[function(require,module,exports){function isObjectLike(value){return!!value&&"object"==typeof value}function arraySome(array,predicate){for(var index=-1,length=array.length;++index<length;)if(predicate(array[index],index,array))return!0;return!1}function baseIsEqual(value,other,customizer,isLoose,stackA,stackB){return value===other?!0:null==value||null==other||!isObject(value)&&!isObjectLike(other)?value!==value&&other!==other:baseIsEqualDeep(value,other,baseIsEqual,customizer,isLoose,stackA,stackB)}function baseIsEqualDeep(object,other,equalFunc,customizer,isLoose,stackA,stackB){var objIsArr=isArray(object),othIsArr=isArray(other),objTag=arrayTag,othTag=arrayTag;objIsArr||(objTag=objToString.call(object),objTag==argsTag?objTag=objectTag:objTag!=objectTag&&(objIsArr=isTypedArray(object))),othIsArr||(othTag=objToString.call(other),othTag==argsTag?othTag=objectTag:othTag!=objectTag&&(othIsArr=isTypedArray(other)));var objIsObj=objTag==objectTag,othIsObj=othTag==objectTag,isSameTag=objTag==othTag;if(isSameTag&&!objIsArr&&!objIsObj)return equalByTag(object,other,objTag);if(!isLoose){var objIsWrapped=objIsObj&&hasOwnProperty.call(object,"__wrapped__"),othIsWrapped=othIsObj&&hasOwnProperty.call(other,"__wrapped__");if(objIsWrapped||othIsWrapped)return equalFunc(objIsWrapped?object.value():object,othIsWrapped?other.value():other,customizer,isLoose,stackA,stackB)}if(!isSameTag)return!1;stackA||(stackA=[]),stackB||(stackB=[]);for(var length=stackA.length;length--;)if(stackA[length]==object)return stackB[length]==other;stackA.push(object),stackB.push(other);var result=(objIsArr?equalArrays:equalObjects)(object,other,equalFunc,customizer,isLoose,stackA,stackB);return stackA.pop(),stackB.pop(),result}function equalArrays(array,other,equalFunc,customizer,isLoose,stackA,stackB){var index=-1,arrLength=array.length,othLength=other.length;if(arrLength!=othLength&&!(isLoose&&othLength>arrLength))return!1;for(;++index<arrLength;){var arrValue=array[index],othValue=other[index],result=customizer?customizer(isLoose?othValue:arrValue,isLoose?arrValue:othValue,index):void 0;if(void 0!==result){if(result)continue;return!1}if(isLoose){if(!arraySome(other,function(othValue){return arrValue===othValue||equalFunc(arrValue,othValue,customizer,isLoose,stackA,stackB)}))return!1}else if(arrValue!==othValue&&!equalFunc(arrValue,othValue,customizer,isLoose,stackA,stackB))return!1}return!0}function equalByTag(object,other,tag){switch(tag){case boolTag:case dateTag:return+object==+other;case errorTag:return object.name==other.name&&object.message==other.message;case numberTag:return object!=+object?other!=+other:object==+other;case regexpTag:case stringTag:return object==other+""}return!1}function equalObjects(object,other,equalFunc,customizer,isLoose,stackA,stackB){var objProps=keys(object),objLength=objProps.length,othProps=keys(other),othLength=othProps.length;if(objLength!=othLength&&!isLoose)return!1;for(var index=objLength;index--;){var key=objProps[index];if(!(isLoose?key in other:hasOwnProperty.call(other,key)))return!1}for(var skipCtor=isLoose;++index<objLength;){key=objProps[index];var objValue=object[key],othValue=other[key],result=customizer?customizer(isLoose?othValue:objValue,isLoose?objValue:othValue,key):void 0;if(!(void 0===result?equalFunc(objValue,othValue,customizer,isLoose,stackA,stackB):result))return!1;skipCtor||(skipCtor="constructor"==key)}if(!skipCtor){var objCtor=object.constructor,othCtor=other.constructor;if(objCtor!=othCtor&&"constructor"in object&&"constructor"in other&&!("function"==typeof objCtor&&objCtor instanceof objCtor&&"function"==typeof othCtor&&othCtor instanceof othCtor))return!1}return!0}function isObject(value){var type=typeof value;return!!value&&("object"==type||"function"==type)}var isArray=require("lodash.isarray"),isTypedArray=require("lodash.istypedarray"),keys=require("lodash.keys"),argsTag="[object Arguments]",arrayTag="[object Array]",boolTag="[object Boolean]",dateTag="[object Date]",errorTag="[object Error]",numberTag="[object Number]",objectTag="[object Object]",regexpTag="[object RegExp]",stringTag="[object String]",objectProto=Object.prototype,hasOwnProperty=objectProto.hasOwnProperty,objToString=objectProto.toString;
module.exports=baseIsEqual},{"lodash.isarray":48,"lodash.istypedarray":55,"lodash.keys":59}],55:[function(require,module,exports){function isObjectLike(value){return!!value&&"object"==typeof value}function isLength(value){return"number"==typeof value&&value>-1&&value%1==0&&MAX_SAFE_INTEGER>=value}function isTypedArray(value){return isObjectLike(value)&&isLength(value.length)&&!!typedArrayTags[objToString.call(value)]}var argsTag="[object Arguments]",arrayTag="[object Array]",boolTag="[object Boolean]",dateTag="[object Date]",errorTag="[object Error]",funcTag="[object Function]",mapTag="[object Map]",numberTag="[object Number]",objectTag="[object Object]",regexpTag="[object RegExp]",setTag="[object Set]",stringTag="[object String]",weakMapTag="[object WeakMap]",arrayBufferTag="[object ArrayBuffer]",float32Tag="[object Float32Array]",float64Tag="[object Float64Array]",int8Tag="[object Int8Array]",int16Tag="[object Int16Array]",int32Tag="[object Int32Array]",uint8Tag="[object Uint8Array]",uint8ClampedTag="[object Uint8ClampedArray]",uint16Tag="[object Uint16Array]",uint32Tag="[object Uint32Array]",typedArrayTags={};typedArrayTags[float32Tag]=typedArrayTags[float64Tag]=typedArrayTags[int8Tag]=typedArrayTags[int16Tag]=typedArrayTags[int32Tag]=typedArrayTags[uint8Tag]=typedArrayTags[uint8ClampedTag]=typedArrayTags[uint16Tag]=typedArrayTags[uint32Tag]=!0,typedArrayTags[argsTag]=typedArrayTags[arrayTag]=typedArrayTags[arrayBufferTag]=typedArrayTags[boolTag]=typedArrayTags[dateTag]=typedArrayTags[errorTag]=typedArrayTags[funcTag]=typedArrayTags[mapTag]=typedArrayTags[numberTag]=typedArrayTags[objectTag]=typedArrayTags[regexpTag]=typedArrayTags[setTag]=typedArrayTags[stringTag]=typedArrayTags[weakMapTag]=!1;var objectProto=Object.prototype,objToString=objectProto.toString,MAX_SAFE_INTEGER=9007199254740991;module.exports=isTypedArray},{}],56:[function(require,module,exports){arguments[4][40][0].apply(exports,arguments)},{dup:40}],57:[function(require,module,exports){function toObject(value){return isObject(value)?value:Object(value)}function isObject(value){var type=typeof value;return!!value&&("object"==type||"function"==type)}function pairs(object){object=toObject(object);for(var index=-1,props=keys(object),length=props.length,result=Array(length);++index<length;){var key=props[index];result[index]=[key,object[key]]}return result}var keys=require("lodash.keys");module.exports=pairs},{"lodash.keys":59}],58:[function(require,module,exports){function baseForOwn(object,iteratee){return baseFor(object,iteratee,keys)}function baseProperty(key){return function(object){return null==object?void 0:object[key]}}function createBaseEach(eachFunc,fromRight){return function(collection,iteratee){var length=collection?getLength(collection):0;if(!isLength(length))return eachFunc(collection,iteratee);for(var index=fromRight?length:-1,iterable=toObject(collection);(fromRight?index--:++index<length)&&iteratee(iterable[index],index,iterable)!==!1;);return collection}}function createBaseFor(fromRight){return function(object,iteratee,keysFunc){for(var iterable=toObject(object),props=keysFunc(object),length=props.length,index=fromRight?length:-1;fromRight?index--:++index<length;){var key=props[index];if(iteratee(iterable[key],key,iterable)===!1)break}return object}}function isLength(value){return"number"==typeof value&&value>-1&&value%1==0&&MAX_SAFE_INTEGER>=value}function toObject(value){return isObject(value)?value:Object(value)}function isObject(value){var type=typeof value;return!!value&&("object"==type||"function"==type)}var keys=require("lodash.keys"),MAX_SAFE_INTEGER=9007199254740991,baseEach=createBaseEach(baseForOwn),baseFor=createBaseFor(),getLength=baseProperty("length");module.exports=baseEach},{"lodash.keys":59}],59:[function(require,module,exports){arguments[4][43][0].apply(exports,arguments)},{dup:43,"lodash._getnative":60,"lodash.isarguments":61,"lodash.isarray":48}],60:[function(require,module,exports){arguments[4][44][0].apply(exports,arguments)},{dup:44}],61:[function(require,module,exports){arguments[4][45][0].apply(exports,arguments)},{dup:45}]},{},[1])(1)});
!function(f){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=f();else if("function"==typeof define&&define.amd)define([],f);else{var g;g="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,g.manifold=f()}}(function(){return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){(function(global){var Manifold;!function(Manifold){var StringValue=function(){function StringValue(value){this.value="",value&&(this.value=value.toLowerCase())}return StringValue.prototype.toString=function(){return this.value},StringValue}();Manifold.StringValue=StringValue}(Manifold||(Manifold={}));var Manifold,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)};!function(Manifold){var TreeSortType=function(_super){function TreeSortType(){_super.apply(this,arguments)}return __extends(TreeSortType,_super),TreeSortType.prototype.date=function(){return new TreeSortType(TreeSortType.DATE.toString())},TreeSortType.prototype.none=function(){return new TreeSortType(TreeSortType.NONE.toString())},TreeSortType.DATE=new TreeSortType("date"),TreeSortType.NONE=new TreeSortType("none"),TreeSortType}(Manifold.StringValue);Manifold.TreeSortType=TreeSortType}(Manifold||(Manifold={}));var Manifold;!function(Manifold){var Bootstrapper=function(){function Bootstrapper(options){this._options=options}return Bootstrapper.prototype.bootstrap=function(){var that=this;return new Promise(function(resolve,reject){manifesto.loadManifest(that._options.iiifResourceUri).then(function(json){var _this=this,iiifResource=manifesto.create(json);if(that._options.iiifResource||(that._options.iiifResource=iiifResource),iiifResource.getIIIFResourceType().toString()===manifesto.IIIFResourceType.collection().toString())iiifResource.collections&&iiifResource.collections.length?iiifResource.getCollectionByIndex(that._options.collectionIndex).then(function(collection){collection||reject(),0===collection.getTotalManifests()&&0===_this.manifestIndex&&collection.getTotalCollections()>0&&(that._options.collectionIndex=0,that._options.iiifResourceUri=collection.id,that.bootstrap()),collection.getManifestByIndex(that._options.manifestIndex).then(function(manifest){that._options.manifest=manifest;var helper=new Manifold.Helper(that._options);resolve(helper)})}):iiifResource.getManifestByIndex(that._options.manifestIndex).then(function(manifest){that._options.manifest=manifest;var helper=new Manifold.Helper(that._options);resolve(helper)});else{that._options.manifest=iiifResource;var helper=new Manifold.Helper(that._options);resolve(helper)}})})},Bootstrapper}();Manifold.Bootstrapper=Bootstrapper}(Manifold||(Manifold={}));var Manifold;!function(Manifold){var Helper=function(){function Helper(options){this.iiifResource=options.iiifResource,this.iiifResourceUri=options.iiifResourceUri,this.manifest=options.manifest,this.collectionIndex=options.collectionIndex||0,this.manifestIndex=options.manifestIndex||0,this.sequenceIndex=options.sequenceIndex||0,this.canvasIndex=options.canvasIndex||0}return Helper.prototype.getAutoCompleteService=function(){var service=this.getSearchWithinService();return service?service.getService(manifesto.ServiceProfile.autoComplete()):null},Helper.prototype.getAttribution=function(){return this.manifest.getAttribution()},Helper.prototype.getCanvases=function(){return this.getCurrentSequence().getCanvases()},Helper.prototype.getCanvasById=function(id){return this.getCurrentSequence().getCanvasById(id)},Helper.prototype.getCanvasesById=function(ids){for(var canvases=[],i=0;i<ids.length;i++){var id=ids[i];canvases.push(this.getCanvasById(id))}return canvases},Helper.prototype.getCanvasByIndex=function(index){return this.getCurrentSequence().getCanvasByIndex(index)},Helper.prototype.getCanvasIndexById=function(id){return this.getCurrentSequence().getCanvasIndexById(id)},Helper.prototype.getCanvasIndexByLabel=function(label){var foliated=this.getManifestType().toString()===manifesto.ManifestType.manuscript().toString();return this.getCurrentSequence().getCanvasIndexByLabel(label,foliated)},Helper.prototype.getCanvasMetadata=function(canvas){var result=[],metadata=canvas.getMetadata();return metadata&&result.push({label:"metadata",value:metadata,isRootLevel:!0}),result},Helper.prototype.getCanvasRange=function(canvas,path){var ranges=this.getCanvasRanges(canvas);if(path){for(var i=0;i<ranges.length;i++){var range=ranges[i];if(range.path===path)return range}return null}return ranges[0]},Helper.prototype.getCanvasRanges=function(canvas){return canvas.ranges?canvas.ranges:(canvas.ranges=this.manifest.getRanges().en().where(function(range){return range.getCanvasIds().en().any(function(c){return c===canvas.id})}).toArray(),canvas.ranges)},Helper.prototype.getCollectionIndex=function(iiifResource){var index;return iiifResource.parentCollection&&(index=iiifResource.parentCollection.index),index},Helper.prototype.getCurrentCanvas=function(){return this.getCurrentSequence().getCanvasByIndex(this.canvasIndex)},Helper.prototype.getCurrentElement=function(){return this.getCanvasByIndex(this.canvasIndex)},Helper.prototype.getCurrentSequence=function(){return this.getSequenceByIndex(this.sequenceIndex)},Helper.prototype.getElementType=function(element){return element||(element=this.getCurrentCanvas()),element.getType()},Helper.prototype.getFirstPageIndex=function(){return 0},Helper.prototype.getInfoUri=function(canvas){var images=canvas.getImages();if(images&&images.length){for(var infoUri,firstImage=images[0],resource=firstImage.getResource(),services=resource.getServices(),i=0;i<services.length;i++){var service=services[i],id=service.id;id.endsWith("/")||(id+="/"),manifesto.isImageProfile(service.getProfile())&&(infoUri=id+"info.json")}return infoUri}var service=canvas.getService(manifesto.ServiceProfile.ixif());return service?service.getInfoUri():canvas.id},Helper.prototype.getLabel=function(){return this.manifest.getLabel()},Helper.prototype.getLastCanvasLabel=function(alphanumeric){return this.getCurrentSequence().getLastCanvasLabel(alphanumeric)},Helper.prototype.getLastPageIndex=function(){return this.getTotalCanvases()-1},Helper.prototype.getLicense=function(){return this.manifest.getLicense()},Helper.prototype.getLogo=function(){return this.manifest.getLogo()},Helper.prototype.getManifestType=function(){var manifestType=this.manifest.getManifestType();return""===manifestType.toString()&&(manifestType=manifesto.ManifestType.monograph()),manifestType},Helper.prototype.getMetadata=function(licenseFormatter){var result=[],metadata=this.manifest.getMetadata();return metadata&&result.push({label:"metadata",value:metadata,isRootLevel:!0}),this.manifest.getDescription()&&result.push({label:"description",value:this.manifest.getDescription(),isRootLevel:!0}),this.manifest.getAttribution()&&result.push({label:"attribution",value:this.manifest.getAttribution(),isRootLevel:!0}),this.manifest.getLicense()&&result.push({label:"license",value:licenseFormatter?licenseFormatter.format(this.manifest.getLicense()):this.manifest.getLicense(),isRootLevel:!0}),this.manifest.getLogo()&&result.push({label:"logo",value:'<img src="'+this.manifest.getLogo()+'"/>',isRootLevel:!0}),result},Helper.prototype.getMultiSelectState=function(){var m=new Manifold.MultiSelectState;return m.ranges=this.getRanges().clone(),m.canvases=this.getCurrentSequence().getCanvases().clone(),m},Helper.prototype.getRanges=function(){return this.manifest.getRanges()},Helper.prototype.getRangeByPath=function(path){return this.manifest.getRangeByPath(path)},Helper.prototype.getRangeCanvases=function(range){var ids=range.getCanvasIds();return this.getCanvasesById(ids)},Helper.prototype.getResources=function(){var element=this.getCurrentElement();return element.getResources()},Helper.prototype.getSearchWithinService=function(){return this.manifest.getService(manifesto.ServiceProfile.searchWithin())},Helper.prototype.getSeeAlso=function(){return this.manifest.getSeeAlso()},Helper.prototype.getSequenceByIndex=function(index){return this.manifest.getSequenceByIndex(index)},Helper.prototype.getSortedTreeNodesByDate=function(sortedTree,tree){var all=tree.nodes.en().traverseUnique(function(node){return node.nodes}).where(function(n){return n.data.type===manifesto.TreeNodeType.collection().toString()||n.data.type===manifesto.TreeNodeType.manifest().toString()}).toArray(),manifests=tree.nodes.en().traverseUnique(function(n){return n.nodes}).where(function(n){return n.data.type===manifesto.TreeNodeType.manifest().toString()}).toArray();this.createDecadeNodes(sortedTree,all),this.sortDecadeNodes(sortedTree),this.createYearNodes(sortedTree,all),this.sortYearNodes(sortedTree),this.createMonthNodes(sortedTree,manifests),this.sortMonthNodes(sortedTree),this.createDateNodes(sortedTree,manifests),this.pruneDecadeNodes(sortedTree)},Helper.prototype.getStartCanvasIndex=function(){return this.getCurrentSequence().getStartCanvasIndex()},Helper.prototype.getThumbs=function(width,height){return this.getCurrentSequence().getThumbs(width,height)},Helper.prototype.getTotalCanvases=function(){return this.getCurrentSequence().getTotalCanvases()},Helper.prototype.getTrackingLabel=function(){return this.manifest.getTrackingLabel()},Helper.prototype.getTree=function(sortType){var tree=this.iiifResource.getTree(),sortedTree=manifesto.getTreeNode();switch(sortType.toString()){case Manifold.TreeSortType.DATE.toString():if(this.treeHasNavDates(tree)){this.getSortedTreeNodesByDate(sortedTree,tree);break}default:sortedTree=tree}return sortedTree},Helper.prototype.treeHasNavDates=function(tree){var node=tree.nodes.en().traverseUnique(function(node){return node.nodes}).where(function(n){return!isNaN(n.navDate)}).first();return!!node},Helper.prototype.getViewingDirection=function(){var viewingDirection=this.getCurrentSequence().getViewingDirection();return viewingDirection.toString()||(viewingDirection=this.manifest.getViewingDirection()),viewingDirection},Helper.prototype.getViewingHint=function(){var viewingHint=this.getCurrentSequence().getViewingHint();return viewingHint.toString()||(viewingHint=this.manifest.getViewingHint()),viewingHint},Helper.prototype.hasParentCollection=function(){return!!this.manifest.parentCollection},Helper.prototype.hasResources=function(){return this.getResources().length>0},Helper.prototype.isBottomToTop=function(){return this.getViewingDirection().toString()===manifesto.ViewingDirection.bottomToTop().toString()},Helper.prototype.isCanvasIndexOutOfRange=function(index){return this.getCurrentSequence().isCanvasIndexOutOfRange(index)},Helper.prototype.isContinuous=function(){return this.getViewingHint().toString()===manifesto.ViewingHint.continuous().toString()},Helper.prototype.isFirstCanvas=function(index){return this.getCurrentSequence().isFirstCanvas(index)},Helper.prototype.isHorizontallyAligned=function(){return this.isLeftToRight()||this.isRightToLeft()},Helper.prototype.isLastCanvas=function(index){return this.getCurrentSequence().isLastCanvas(index)},Helper.prototype.isLeftToRight=function(){return this.getViewingDirection().toString()===manifesto.ViewingDirection.leftToRight().toString()},Helper.prototype.isMultiCanvas=function(){return this.getCurrentSequence().isMultiCanvas()},Helper.prototype.isMultiSequence=function(){return this.manifest.isMultiSequence()},Helper.prototype.isPaged=function(){return this.getViewingHint().toString()===manifesto.ViewingHint.paged().toString()},Helper.prototype.isPagingAvailable=function(){return this.isPagingEnabled()&&this.getTotalCanvases()>2},Helper.prototype.isPagingEnabled=function(){return this.getCurrentSequence().isPagingEnabled()},Helper.prototype.isRightToLeft=function(){return this.getViewingDirection().toString()===manifesto.ViewingDirection.rightToLeft().toString()},Helper.prototype.isTopToBottom=function(){return this.getViewingDirection().toString()===manifesto.ViewingDirection.topToBottom().toString()},Helper.prototype.isTotalCanvasesEven=function(){return this.getCurrentSequence().isTotalCanvasesEven()},Helper.prototype.isUIEnabled=function(name){var uiExtensions=this.manifest.getService(manifesto.ServiceProfile.uiExtensions());if(uiExtensions){var disableUI=uiExtensions.getProperty("disableUI");if(disableUI&&(disableUI.contains(name)||disableUI.contains(name.toLowerCase())))return!1}return!0},Helper.prototype.isVerticallyAligned=function(){return this.isTopToBottom()||this.isBottomToTop()},Helper.prototype.createDateNodes=function(rootNode,nodes){for(var i=0;i<nodes.length;i++){var node=nodes[i],year=this.getNodeYear(node),month=this.getNodeMonth(node),dateNode=manifesto.getTreeNode();dateNode.id=node.id,dateNode.label=this.getNodeDisplayDate(node),dateNode.data=node.data,dateNode.data.type=manifesto.TreeNodeType.manifest().toString(),dateNode.data.year=year,dateNode.data.month=month;var decadeNode=this.getDecadeNode(rootNode,year);if(decadeNode){var yearNode=this.getYearNode(decadeNode,year);if(yearNode){var monthNode=this.getMonthNode(yearNode,month);monthNode&&monthNode.addNode(dateNode)}}}},Helper.prototype.createDecadeNodes=function(rootNode,nodes){for(var decadeNode,i=0;i<nodes.length;i++){var node=nodes[i],year=this.getNodeYear(node),endYear=(Number(year.toString().substr(2,1)),Number(year.toString().substr(0,3)+"9"));this.getDecadeNode(rootNode,year)||(decadeNode=manifesto.getTreeNode(),decadeNode.label=year+" - "+endYear,decadeNode.navDate=node.navDate,decadeNode.data.startYear=year,decadeNode.data.endYear=endYear,rootNode.addNode(decadeNode))}},Helper.prototype.createMonthNodes=function(rootNode,nodes){for(var monthNode,i=0;i<nodes.length;i++){var node=nodes[i],year=this.getNodeYear(node),month=this.getNodeMonth(node),decadeNode=this.getDecadeNode(rootNode,year),yearNode=this.getYearNode(decadeNode,year);decadeNode&&yearNode&&!this.getMonthNode(yearNode,month)&&(monthNode=manifesto.getTreeNode(),monthNode.label=this.getNodeDisplayMonth(node),monthNode.navDate=node.navDate,monthNode.data.year=year,monthNode.data.month=month,yearNode.addNode(monthNode))}},Helper.prototype.createYearNodes=function(rootNode,nodes){for(var yearNode,i=0;i<nodes.length;i++){var node=nodes[i],year=this.getNodeYear(node),decadeNode=this.getDecadeNode(rootNode,year);decadeNode&&!this.getYearNode(decadeNode,year)&&(yearNode=manifesto.getTreeNode(),yearNode.label=year.toString(),yearNode.navDate=node.navDate,yearNode.data.year=year,decadeNode.addNode(yearNode))}},Helper.prototype.getDecadeNode=function(rootNode,year){for(var i=0;i<rootNode.nodes.length;i++){var n=rootNode.nodes[i];if(year>=n.data.startYear&&year<=n.data.endYear)return n}return null},Helper.prototype.getMonthNode=function(yearNode,month){for(var i=0;i<yearNode.nodes.length;i++){var n=yearNode.nodes[i];if(month===this.getNodeMonth(n))return n}return null},Helper.prototype.getNodeDisplayDate=function(node){return node.navDate.toDateString()},Helper.prototype.getNodeDisplayMonth=function(node){var months=["January","February","March","April","May","June","July","August","September","October","November","December"];return months[node.navDate.getMonth()]},Helper.prototype.getNodeMonth=function(node){return node.navDate.getMonth()},Helper.prototype.getNodeYear=function(node){return node.navDate.getFullYear()},Helper.prototype.getYearNode=function(decadeNode,year){for(var i=0;i<decadeNode.nodes.length;i++){var n=decadeNode.nodes[i];if(year===this.getNodeYear(n))return n}return null},Helper.prototype.pruneDecadeNodes=function(rootNode){for(var pruned=[],i=0;i<rootNode.nodes.length;i++){var n=rootNode.nodes[i];n.nodes.length||pruned.push(n)}for(var j=0;j<pruned.length;j++){var p=pruned[j];rootNode.nodes.remove(p)}},Helper.prototype.sortDecadeNodes=function(rootNode){rootNode.nodes=rootNode.nodes.sort(function(a,b){return a.data.startYear-b.data.startYear})},Helper.prototype.sortMonthNodes=function(rootNode){for(var _this=this,i=0;i<rootNode.nodes.length;i++)for(var decadeNode=rootNode.nodes[i],j=0;j<decadeNode.nodes.length;j++){var monthNode=decadeNode.nodes[j];monthNode.nodes=monthNode.nodes.sort(function(a,b){return _this.getNodeMonth(a)-_this.getNodeMonth(b)})}},Helper.prototype.sortYearNodes=function(rootNode){for(var _this=this,i=0;i<rootNode.nodes.length;i++){var decadeNode=rootNode.nodes[i];decadeNode.nodes=decadeNode.nodes.sort(function(a,b){return _this.getNodeYear(a)-_this.getNodeYear(b)})}},Helper}();Manifold.Helper=Helper}(Manifold||(Manifold={})),global.manifold=global.Manifold=module.exports={TreeSortType:new Manifold.TreeSortType,loadManifest:function(options){var bootstrapper=new Manifold.Bootstrapper(options);return bootstrapper.bootstrap()}};var Manifold;!function(Manifold){var MultiSelectState=function(){function MultiSelectState(){this.isEnabled=!1,this.ranges=[],this.canvases=[]}return MultiSelectState.prototype.allCanvasesSelected=function(){return this.canvases.length>0&&this.getAllSelectedCanvases().length===this.canvases.length},MultiSelectState.prototype.allRangesSelected=function(){return this.ranges.length>0&&this.getAllSelectedRanges().length===this.ranges.length},MultiSelectState.prototype.allSelected=function(){return this.allRangesSelected()&&this.allCanvasesSelected()},MultiSelectState.prototype.getAll=function(){return this.canvases.concat(this.ranges)},MultiSelectState.prototype.getAllSelectedCanvases=function(){return this.canvases.en().where(function(c){return c.multiSelected}).toArray()},MultiSelectState.prototype.getAllSelectedRanges=function(){return this.ranges.en().where(function(r){return r.multiSelected}).toArray()},MultiSelectState.prototype.getCanvasById=function(id){return this.canvases.en().where(function(c){return c.id===id}).first()},MultiSelectState.prototype.getCanvasesByIds=function(ids){for(var canvases=[],i=0;i<ids.length;i++){var id=ids[i];canvases.push(this.getCanvasById(id))}return canvases},MultiSelectState.prototype.getRangeCanvases=function(range){var ids=range.getCanvasIds();return this.getCanvasesByIds(ids)},MultiSelectState.prototype.selectAll=function(selected){this.selectRanges(this.ranges,selected),this.selectCanvases(this.canvases,selected)},MultiSelectState.prototype.selectCanvas=function(canvas,selected){var c=this.canvases.en().where(function(c){return c.id===canvas.id}).first();c.multiSelected=selected},MultiSelectState.prototype.selectAllCanvases=function(selected){this.selectCanvases(this.canvases,selected)},MultiSelectState.prototype.selectCanvases=function(canvases,selected){for(var j=0;j<canvases.length;j++){var canvas=canvases[j];canvas.multiSelected=selected}},MultiSelectState.prototype.selectRange=function(range,selected){var r=this.ranges.en().where(function(r){return r.id===range.id}).first();r.multiSelected=selected;var canvases=this.getRangeCanvases(r);this.selectCanvases(canvases,selected)},MultiSelectState.prototype.selectAllRanges=function(selected){this.selectRanges(this.ranges,selected)},MultiSelectState.prototype.selectRanges=function(ranges,selected){for(var i=0;i<ranges.length;i++){var range=ranges[i];range.multiSelected=selected;var canvases=this.getCanvasesByIds(range.getCanvasIds());this.selectCanvases(canvases,selected)}},MultiSelectState.prototype.setEnabled=function(enabled){this.isEnabled=enabled;for(var items=this.getAll(),i=0;i<items.length;i++){var item=items[i];item.multiSelectEnabled=this.isEnabled,enabled||(item.multiSelected=!1)}},MultiSelectState}();Manifold.MultiSelectState=MultiSelectState}(Manifold||(Manifold={}));var Manifold;!function(Manifold){var UriLabeller=function(){function UriLabeller(labels){this.labels=labels}return UriLabeller.prototype.format=function(url){if(-1!=url.indexOf("<a"))return url;var label=this.labels[url]?this.labels[url]:url;return'<a href="'+url+'">'+label+"</a>"},UriLabeller}();Manifold.UriLabeller=UriLabeller}(Manifold||(Manifold={}))}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)});
(function(t,e,o){"use strict";function r(t,e,r,p){r=r||"width";var n,l,m,c=(e.match(s)||[])[2],f="px"===c?1:d[c+"toPx"],u=/r?em/i;if(f||u.test(c)&&!p)t=f?t:"rem"===c?i:"fontSize"===r?t.parentNode||t:t,f=f||parseFloat(a(t,"fontSize")),m=parseFloat(e)*f;else{n=t.style,l=n[r];try{n[r]=e}catch(x){return 0}m=n[r]?parseFloat(a(t,r)):0,n[r]=l!==o?l:null}return m}function a(t,e){var o,n,i,l,d,c=/^top|bottom/,f=["paddingTop","paddingBottom","borderTop","borderBottom"],u=4;if(o=m?m(t)[e]:(n=t.style["pixel"+e.charAt(0).toUpperCase()+e.slice(1)])?n+"px":"fontSize"===e?r(t,"1em","left",1)+"px":t.currentStyle[e],i=(o.match(s)||[])[2],"%"===i&&p)if(c.test(e)){for(l=(d=t.parentNode||t).offsetHeight;u--;)l-=parseFloat(a(d,f[u]));o=parseFloat(o)/100*l+"px"}else o=r(t,o);else("auto"===o||i&&"px"!==i)&&m?o=0:i&&"px"!==i&&!m&&(o=r(t,o)+"px");return o}var p,n=e.createElement("test"),i=e.documentElement,l=e.defaultView,m=l&&l.getComputedStyle,s=/^(-?[\d+\.\-]+)([a-z]+|%)$/i,d={},c=[1/25.4,1/2.54,1/72,1/6],f=["mm","cm","pt","pc","in","mozmm"],u=6;for(i.appendChild(n),m&&(n.style.marginTop="1%",p="1%"===m(n).marginTop);u--;)d[f[u]+"toPx"]=c[u]?c[u]*d.inToPx:r(n,"1"+f[u]);i.removeChild(n),n=o,t.Length={toPx:r}})(this,this.document);
/*
//@ sourceMappingURL=Length.min.js.map
*/
var Utils;
(function (Utils) {
    var Async = (function () {
        function Async() {
        }
        Async.waitFor = function (test, successCallback, failureCallback, interval, maxTries, numTries) {
            if (!interval)
                interval = 200;
            if (!maxTries)
                maxTries = 100; // try 100 times over 20 seconds
            if (!numTries)
                numTries = 0;
            numTries += 1;
            if (numTries > maxTries) {
                if (failureCallback)
                    failureCallback();
            }
            else if (test()) {
                successCallback();
            }
            else {
                setTimeout(function () {
                    Async.waitFor(test, successCallback, failureCallback, interval, maxTries, numTries);
                }, interval);
            }
        };
        return Async;
    })();
    Utils.Async = Async;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Bools = (function () {
        function Bools() {
        }
        Bools.getBool = function (val, defaultVal) {
            if (val === null || typeof (val) === 'undefined') {
                return defaultVal;
            }
            return val;
        };
        return Bools;
    })();
    Utils.Bools = Bools;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Clipboard = (function () {
        function Clipboard() {
        }
        Clipboard.copy = function (text) {
            var $tempDiv = $("<div style='position:absolute;left:-9999px'>");
            var brRegex = /<br\s*[\/]?>/gi;
            text = text.replace(brRegex, "\n");
            $("body").append($tempDiv);
            $tempDiv.append(text);
            var $tempInput = $("<textarea>");
            $tempDiv.append($tempInput);
            $tempInput.val($tempDiv.text()).select();
            document.execCommand("copy");
            $tempDiv.remove();
        };
        Clipboard.supportsCopy = function () {
            return document.queryCommandSupported && document.queryCommandSupported('copy');
        };
        return Clipboard;
    })();
    Utils.Clipboard = Clipboard;
})(Utils || (Utils = {}));
// Copyright 2013 Basarat Ali Syed. All Rights Reserved.
//
// Licensed under MIT open source license http://opensource.org/licenses/MIT
//
// Orginal javascript code was by Mauricio Santos
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * @namespace Top level namespace for collections, a TypeScript data structure library.
 */
var Utils;
(function (Utils) {
    var Collections;
    (function (Collections) {
        var collections = Collections;
        var _hasOwnProperty = Object.prototype.hasOwnProperty;
        var has = function (obj, prop) {
            return _hasOwnProperty.call(obj, prop);
        };
        /**
         * Default function to compare element order.
         * @function
         */
        function defaultCompare(a, b) {
            if (a < b) {
                return -1;
            }
            else if (a === b) {
                return 0;
            }
            else {
                return 1;
            }
        }
        Collections.defaultCompare = defaultCompare;
        /**
         * Default function to test equality.
         * @function
         */
        function defaultEquals(a, b) {
            return a === b;
        }
        Collections.defaultEquals = defaultEquals;
        /**
         * Default function to convert an object to a string.
         * @function
         */
        function defaultToString(item) {
            if (item === null) {
                return 'COLLECTION_NULL';
            }
            else if (collections.isUndefined(item)) {
                return 'COLLECTION_UNDEFINED';
            }
            else if (collections.isString(item)) {
                return '$s' + item;
            }
            else {
                return '$o' + item.toString();
            }
        }
        Collections.defaultToString = defaultToString;
        /**
         * Joins all the properies of the object using the provided join string
         */
        function makeString(item, join) {
            if (join === void 0) { join = ","; }
            if (item === null) {
                return 'COLLECTION_NULL';
            }
            else if (collections.isUndefined(item)) {
                return 'COLLECTION_UNDEFINED';
            }
            else if (collections.isString(item)) {
                return item.toString();
            }
            else {
                var toret = "{";
                var first = true;
                for (var prop in item) {
                    if (has(item, prop)) {
                        if (first)
                            first = false;
                        else
                            toret = toret + join;
                        toret = toret + prop + ":" + item[prop];
                    }
                }
                return toret + "}";
            }
        }
        Collections.makeString = makeString;
        /**
         * Checks if the given argument is a function.
         * @function
         */
        function isFunction(func) {
            return (typeof func) === 'function';
        }
        Collections.isFunction = isFunction;
        /**
         * Checks if the given argument is undefined.
         * @function
         */
        function isUndefined(obj) {
            return (typeof obj) === 'undefined';
        }
        Collections.isUndefined = isUndefined;
        /**
         * Checks if the given argument is a string.
         * @function
         */
        function isString(obj) {
            return Object.prototype.toString.call(obj) === '[object String]';
        }
        Collections.isString = isString;
        /**
         * Reverses a compare function.
         * @function
         */
        function reverseCompareFunction(compareFunction) {
            if (!collections.isFunction(compareFunction)) {
                return function (a, b) {
                    if (a < b) {
                        return 1;
                    }
                    else if (a === b) {
                        return 0;
                    }
                    else {
                        return -1;
                    }
                };
            }
            else {
                return function (d, v) {
                    return compareFunction(d, v) * -1;
                };
            }
        }
        Collections.reverseCompareFunction = reverseCompareFunction;
        /**
         * Returns an equal function given a compare function.
         * @function
         */
        function compareToEquals(compareFunction) {
            return function (a, b) {
                return compareFunction(a, b) === 0;
            };
        }
        Collections.compareToEquals = compareToEquals;
        /**
         * @namespace Contains various functions for manipulating arrays.
         */
        var arrays;
        (function (arrays) {
            /**
             * Returns the position of the first occurrence of the specified item
             * within the specified array.
             * @param {*} array the array in which to search the element.
             * @param {Object} item the element to search.
             * @param {function(Object,Object):boolean=} equalsFunction optional function used to
             * check equality between 2 elements.
             * @return {number} the position of the first occurrence of the specified element
             * within the specified array, or -1 if not found.
             */
            function indexOf(array, item, equalsFunction) {
                var equals = equalsFunction || collections.defaultEquals;
                var length = array.length;
                for (var i = 0; i < length; i++) {
                    if (equals(array[i], item)) {
                        return i;
                    }
                }
                return -1;
            }
            arrays.indexOf = indexOf;
            /**
             * Returns the position of the last occurrence of the specified element
             * within the specified array.
             * @param {*} array the array in which to search the element.
             * @param {Object} item the element to search.
             * @param {function(Object,Object):boolean=} equalsFunction optional function used to
             * check equality between 2 elements.
             * @return {number} the position of the last occurrence of the specified element
             * within the specified array or -1 if not found.
             */
            function lastIndexOf(array, item, equalsFunction) {
                var equals = equalsFunction || collections.defaultEquals;
                var length = array.length;
                for (var i = length - 1; i >= 0; i--) {
                    if (equals(array[i], item)) {
                        return i;
                    }
                }
                return -1;
            }
            arrays.lastIndexOf = lastIndexOf;
            /**
             * Returns true if the specified array contains the specified element.
             * @param {*} array the array in which to search the element.
             * @param {Object} item the element to search.
             * @param {function(Object,Object):boolean=} equalsFunction optional function to
             * check equality between 2 elements.
             * @return {boolean} true if the specified array contains the specified element.
             */
            function contains(array, item, equalsFunction) {
                return arrays.indexOf(array, item, equalsFunction) >= 0;
            }
            arrays.contains = contains;
            /**
             * Removes the first ocurrence of the specified element from the specified array.
             * @param {*} array the array in which to search element.
             * @param {Object} item the element to search.
             * @param {function(Object,Object):boolean=} equalsFunction optional function to
             * check equality between 2 elements.
             * @return {boolean} true if the array changed after this call.
             */
            function remove(array, item, equalsFunction) {
                var index = arrays.indexOf(array, item, equalsFunction);
                if (index < 0) {
                    return false;
                }
                array.splice(index, 1);
                return true;
            }
            arrays.remove = remove;
            /**
             * Returns the number of elements in the specified array equal
             * to the specified object.
             * @param {Array} array the array in which to determine the frequency of the element.
             * @param {Object} item the element whose frequency is to be determined.
             * @param {function(Object,Object):boolean=} equalsFunction optional function used to
             * check equality between 2 elements.
             * @return {number} the number of elements in the specified array
             * equal to the specified object.
             */
            function frequency(array, item, equalsFunction) {
                var equals = equalsFunction || collections.defaultEquals;
                var length = array.length;
                var freq = 0;
                for (var i = 0; i < length; i++) {
                    if (equals(array[i], item)) {
                        freq++;
                    }
                }
                return freq;
            }
            arrays.frequency = frequency;
            /**
             * Returns true if the two specified arrays are equal to one another.
             * Two arrays are considered equal if both arrays contain the same number
             * of elements, and all corresponding pairs of elements in the two
             * arrays are equal and are in the same order.
             * @param {Array} array1 one array to be tested for equality.
             * @param {Array} array2 the other array to be tested for equality.
             * @param {function(Object,Object):boolean=} equalsFunction optional function used to
             * check equality between elemements in the arrays.
             * @return {boolean} true if the two arrays are equal
             */
            function equals(array1, array2, equalsFunction) {
                var equals = equalsFunction || collections.defaultEquals;
                if (array1.length !== array2.length) {
                    return false;
                }
                var length = array1.length;
                for (var i = 0; i < length; i++) {
                    if (!equals(array1[i], array2[i])) {
                        return false;
                    }
                }
                return true;
            }
            arrays.equals = equals;
            /**
             * Returns shallow a copy of the specified array.
             * @param {*} array the array to copy.
             * @return {Array} a copy of the specified array
             */
            function copy(array) {
                return array.concat();
            }
            arrays.copy = copy;
            /**
             * Swaps the elements at the specified positions in the specified array.
             * @param {Array} array The array in which to swap elements.
             * @param {number} i the index of one element to be swapped.
             * @param {number} j the index of the other element to be swapped.
             * @return {boolean} true if the array is defined and the indexes are valid.
             */
            function swap(array, i, j) {
                if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
                    return false;
                }
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
                return true;
            }
            arrays.swap = swap;
            function toString(array) {
                return '[' + array.toString() + ']';
            }
            arrays.toString = toString;
            /**
             * Executes the provided function once for each element present in this array
             * starting from index 0 to length - 1.
             * @param {Array} array The array in which to iterate.
             * @param {function(Object):*} callback function to execute, it is
             * invoked with one argument: the element value, to break the iteration you can
             * optionally return false.
             */
            function forEach(array, callback) {
                var lenght = array.length;
                for (var i = 0; i < lenght; i++) {
                    if (callback(array[i]) === false) {
                        return;
                    }
                }
            }
            arrays.forEach = forEach;
        })(arrays = Collections.arrays || (Collections.arrays = {}));
        var LinkedList = (function () {
            /**
             * Creates an empty Linked List.
             * @class A linked list is a data structure consisting of a group of nodes
             * which together represent a sequence.
             * @constructor
             */
            function LinkedList() {
                /**
                 * First node in the list
                 * @type {Object}
                 * @private
                 */
                this.firstNode = null;
                /**
                 * Last node in the list
                 * @type {Object}
                 * @private
                 */
                this.lastNode = null;
                /**
                 * Number of elements in the list
                 * @type {number}
                 * @private
                 */
                this.nElements = 0;
            }
            /**
             * Adds an element to this list.
             * @param {Object} item element to be added.
             * @param {number=} index optional index to add the element. If no index is specified
             * the element is added to the end of this list.
             * @return {boolean} true if the element was added or false if the index is invalid
             * or if the element is undefined.
             */
            LinkedList.prototype.add = function (item, index) {
                if (collections.isUndefined(index)) {
                    index = this.nElements;
                }
                if (index < 0 || index > this.nElements || collections.isUndefined(item)) {
                    return false;
                }
                var newNode = this.createNode(item);
                if (this.nElements === 0) {
                    // First node in the list.
                    this.firstNode = newNode;
                    this.lastNode = newNode;
                }
                else if (index === this.nElements) {
                    // Insert at the end.
                    this.lastNode.next = newNode;
                    this.lastNode = newNode;
                }
                else if (index === 0) {
                    // Change first node.
                    newNode.next = this.firstNode;
                    this.firstNode = newNode;
                }
                else {
                    var prev = this.nodeAtIndex(index - 1);
                    newNode.next = prev.next;
                    prev.next = newNode;
                }
                this.nElements++;
                return true;
            };
            /**
             * Returns the first element in this list.
             * @return {*} the first element of the list or undefined if the list is
             * empty.
             */
            LinkedList.prototype.first = function () {
                if (this.firstNode !== null) {
                    return this.firstNode.element;
                }
                return undefined;
            };
            /**
             * Returns the last element in this list.
             * @return {*} the last element in the list or undefined if the list is
             * empty.
             */
            LinkedList.prototype.last = function () {
                if (this.lastNode !== null) {
                    return this.lastNode.element;
                }
                return undefined;
            };
            /**
             * Returns the element at the specified position in this list.
             * @param {number} index desired index.
             * @return {*} the element at the given index or undefined if the index is
             * out of bounds.
             */
            LinkedList.prototype.elementAtIndex = function (index) {
                var node = this.nodeAtIndex(index);
                if (node === null) {
                    return undefined;
                }
                return node.element;
            };
            /**
             * Returns the index in this list of the first occurrence of the
             * specified element, or -1 if the List does not contain this element.
             * <p>If the elements inside this list are
             * not comparable with the === operator a custom equals function should be
             * provided to perform searches, the function must receive two arguments and
             * return true if they are equal, false otherwise. Example:</p>
             *
             * <pre>
             * var petsAreEqualByName = function(pet1, pet2) {
             *  return pet1.name === pet2.name;
             * }
             * </pre>
             * @param {Object} item element to search for.
             * @param {function(Object,Object):boolean=} equalsFunction Optional
             * function used to check if two elements are equal.
             * @return {number} the index in this list of the first occurrence
             * of the specified element, or -1 if this list does not contain the
             * element.
             */
            LinkedList.prototype.indexOf = function (item, equalsFunction) {
                var equalsF = equalsFunction || collections.defaultEquals;
                if (collections.isUndefined(item)) {
                    return -1;
                }
                var currentNode = this.firstNode;
                var index = 0;
                while (currentNode !== null) {
                    if (equalsF(currentNode.element, item)) {
                        return index;
                    }
                    index++;
                    currentNode = currentNode.next;
                }
                return -1;
            };
            /**
             * Returns true if this list contains the specified element.
             * <p>If the elements inside the list are
             * not comparable with the === operator a custom equals function should be
             * provided to perform searches, the function must receive two arguments and
             * return true if they are equal, false otherwise. Example:</p>
             *
             * <pre>
             * var petsAreEqualByName = function(pet1, pet2) {
               *  return pet1.name === pet2.name;
               * }
             * </pre>
             * @param {Object} item element to search for.
             * @param {function(Object,Object):boolean=} equalsFunction Optional
             * function used to check if two elements are equal.
             * @return {boolean} true if this list contains the specified element, false
             * otherwise.
             */
            LinkedList.prototype.contains = function (item, equalsFunction) {
                return (this.indexOf(item, equalsFunction) >= 0);
            };
            /**
             * Removes the first occurrence of the specified element in this list.
             * <p>If the elements inside the list are
             * not comparable with the === operator a custom equals function should be
             * provided to perform searches, the function must receive two arguments and
             * return true if they are equal, false otherwise. Example:</p>
             *
             * <pre>
             * var petsAreEqualByName = function(pet1, pet2) {
             *  return pet1.name === pet2.name;
             * }
             * </pre>
             * @param {Object} item element to be removed from this list, if present.
             * @return {boolean} true if the list contained the specified element.
             */
            LinkedList.prototype.remove = function (item, equalsFunction) {
                var equalsF = equalsFunction || collections.defaultEquals;
                if (this.nElements < 1 || collections.isUndefined(item)) {
                    return false;
                }
                var previous = null;
                var currentNode = this.firstNode;
                while (currentNode !== null) {
                    if (equalsF(currentNode.element, item)) {
                        if (currentNode === this.firstNode) {
                            this.firstNode = this.firstNode.next;
                            if (currentNode === this.lastNode) {
                                this.lastNode = null;
                            }
                        }
                        else if (currentNode === this.lastNode) {
                            this.lastNode = previous;
                            previous.next = currentNode.next;
                            currentNode.next = null;
                        }
                        else {
                            previous.next = currentNode.next;
                            currentNode.next = null;
                        }
                        this.nElements--;
                        return true;
                    }
                    previous = currentNode;
                    currentNode = currentNode.next;
                }
                return false;
            };
            /**
             * Removes all of the elements from this list.
             */
            LinkedList.prototype.clear = function () {
                this.firstNode = null;
                this.lastNode = null;
                this.nElements = 0;
            };
            /**
             * Returns true if this list is equal to the given list.
             * Two lists are equal if they have the same elements in the same order.
             * @param {LinkedList} other the other list.
             * @param {function(Object,Object):boolean=} equalsFunction optional
             * function used to check if two elements are equal. If the elements in the lists
             * are custom objects you should provide a function, otherwise
             * the === operator is used to check equality between elements.
             * @return {boolean} true if this list is equal to the given list.
             */
            LinkedList.prototype.equals = function (other, equalsFunction) {
                var eqF = equalsFunction || collections.defaultEquals;
                if (!(other instanceof collections.LinkedList)) {
                    return false;
                }
                if (this.size() !== other.size()) {
                    return false;
                }
                return this.equalsAux(this.firstNode, other.firstNode, eqF);
            };
            /**
             * @private
             */
            LinkedList.prototype.equalsAux = function (n1, n2, eqF) {
                while (n1 !== null) {
                    if (!eqF(n1.element, n2.element)) {
                        return false;
                    }
                    n1 = n1.next;
                    n2 = n2.next;
                }
                return true;
            };
            /**
             * Removes the element at the specified position in this list.
             * @param {number} index given index.
             * @return {*} removed element or undefined if the index is out of bounds.
             */
            LinkedList.prototype.removeElementAtIndex = function (index) {
                if (index < 0 || index >= this.nElements) {
                    return undefined;
                }
                var element;
                if (this.nElements === 1) {
                    //First node in the list.
                    element = this.firstNode.element;
                    this.firstNode = null;
                    this.lastNode = null;
                }
                else {
                    var previous = this.nodeAtIndex(index - 1);
                    if (previous === null) {
                        element = this.firstNode.element;
                        this.firstNode = this.firstNode.next;
                    }
                    else if (previous.next === this.lastNode) {
                        element = this.lastNode.element;
                        this.lastNode = previous;
                    }
                    if (previous !== null) {
                        element = previous.next.element;
                        previous.next = previous.next.next;
                    }
                }
                this.nElements--;
                return element;
            };
            /**
             * Executes the provided function once for each element present in this list in order.
             * @param {function(Object):*} callback function to execute, it is
             * invoked with one argument: the element value, to break the iteration you can
             * optionally return false.
             */
            LinkedList.prototype.forEach = function (callback) {
                var currentNode = this.firstNode;
                while (currentNode !== null) {
                    if (callback(currentNode.element) === false) {
                        break;
                    }
                    currentNode = currentNode.next;
                }
            };
            /**
             * Reverses the order of the elements in this linked list (makes the last
             * element first, and the first element last).
             */
            LinkedList.prototype.reverse = function () {
                var previous = null;
                var current = this.firstNode;
                var temp = null;
                while (current !== null) {
                    temp = current.next;
                    current.next = previous;
                    previous = current;
                    current = temp;
                }
                temp = this.firstNode;
                this.firstNode = this.lastNode;
                this.lastNode = temp;
            };
            /**
             * Returns an array containing all of the elements in this list in proper
             * sequence.
             * @return {Array.<*>} an array containing all of the elements in this list,
             * in proper sequence.
             */
            LinkedList.prototype.toArray = function () {
                var array = [];
                var currentNode = this.firstNode;
                while (currentNode !== null) {
                    array.push(currentNode.element);
                    currentNode = currentNode.next;
                }
                return array;
            };
            /**
             * Returns the number of elements in this list.
             * @return {number} the number of elements in this list.
             */
            LinkedList.prototype.size = function () {
                return this.nElements;
            };
            /**
             * Returns true if this list contains no elements.
             * @return {boolean} true if this list contains no elements.
             */
            LinkedList.prototype.isEmpty = function () {
                return this.nElements <= 0;
            };
            LinkedList.prototype.toString = function () {
                return collections.arrays.toString(this.toArray());
            };
            /**
             * @private
             */
            LinkedList.prototype.nodeAtIndex = function (index) {
                if (index < 0 || index >= this.nElements) {
                    return null;
                }
                if (index === (this.nElements - 1)) {
                    return this.lastNode;
                }
                var node = this.firstNode;
                for (var i = 0; i < index; i++) {
                    node = node.next;
                }
                return node;
            };
            /**
             * @private
             */
            LinkedList.prototype.createNode = function (item) {
                return {
                    element: item,
                    next: null
                };
            };
            return LinkedList;
        })();
        Collections.LinkedList = LinkedList; // End of linked list 
        var Dictionary = (function () {
            /**
             * Creates an empty dictionary.
             * @class <p>Dictionaries map keys to values; each key can map to at most one value.
             * This implementation accepts any kind of objects as keys.</p>
             *
             * <p>If the keys are custom objects a function which converts keys to unique
             * strings must be provided. Example:</p>
             * <pre>
             * function petToString(pet) {
             *  return pet.name;
             * }
             * </pre>
             * @constructor
             * @param {function(Object):string=} toStrFunction optional function used
             * to convert keys to strings. If the keys aren't strings or if toString()
             * is not appropriate, a custom function which receives a key and returns a
             * unique string must be provided.
             */
            function Dictionary(toStrFunction) {
                this.table = {};
                this.nElements = 0;
                this.toStr = toStrFunction || collections.defaultToString;
            }
            /**
             * Returns the value to which this dictionary maps the specified key.
             * Returns undefined if this dictionary contains no mapping for this key.
             * @param {Object} key key whose associated value is to be returned.
             * @return {*} the value to which this dictionary maps the specified key or
             * undefined if the map contains no mapping for this key.
             */
            Dictionary.prototype.getValue = function (key) {
                var pair = this.table['$' + this.toStr(key)];
                if (collections.isUndefined(pair)) {
                    return undefined;
                }
                return pair.value;
            };
            /**
             * Associates the specified value with the specified key in this dictionary.
             * If the dictionary previously contained a mapping for this key, the old
             * value is replaced by the specified value.
             * @param {Object} key key with which the specified value is to be
             * associated.
             * @param {Object} value value to be associated with the specified key.
             * @return {*} previous value associated with the specified key, or undefined if
             * there was no mapping for the key or if the key/value are undefined.
             */
            Dictionary.prototype.setValue = function (key, value) {
                if (collections.isUndefined(key) || collections.isUndefined(value)) {
                    return undefined;
                }
                var ret;
                var k = '$' + this.toStr(key);
                var previousElement = this.table[k];
                if (collections.isUndefined(previousElement)) {
                    this.nElements++;
                    ret = undefined;
                }
                else {
                    ret = previousElement.value;
                }
                this.table[k] = {
                    key: key,
                    value: value
                };
                return ret;
            };
            /**
             * Removes the mapping for this key from this dictionary if it is present.
             * @param {Object} key key whose mapping is to be removed from the
             * dictionary.
             * @return {*} previous value associated with specified key, or undefined if
             * there was no mapping for key.
             */
            Dictionary.prototype.remove = function (key) {
                var k = '$' + this.toStr(key);
                var previousElement = this.table[k];
                if (!collections.isUndefined(previousElement)) {
                    delete this.table[k];
                    this.nElements--;
                    return previousElement.value;
                }
                return undefined;
            };
            /**
             * Returns an array containing all of the keys in this dictionary.
             * @return {Array} an array containing all of the keys in this dictionary.
             */
            Dictionary.prototype.keys = function () {
                var array = [];
                for (var name in this.table) {
                    if (has(this.table, name)) {
                        var pair = this.table[name];
                        array.push(pair.key);
                    }
                }
                return array;
            };
            /**
             * Returns an array containing all of the values in this dictionary.
             * @return {Array} an array containing all of the values in this dictionary.
             */
            Dictionary.prototype.values = function () {
                var array = [];
                for (var name in this.table) {
                    if (has(this.table, name)) {
                        var pair = this.table[name];
                        array.push(pair.value);
                    }
                }
                return array;
            };
            /**
             * Executes the provided function once for each key-value pair
             * present in this dictionary.
             * @param {function(Object,Object):*} callback function to execute, it is
             * invoked with two arguments: key and value. To break the iteration you can
             * optionally return false.
             */
            Dictionary.prototype.forEach = function (callback) {
                for (var name in this.table) {
                    if (has(this.table, name)) {
                        var pair = this.table[name];
                        var ret = callback(pair.key, pair.value);
                        if (ret === false) {
                            return;
                        }
                    }
                }
            };
            /**
             * Returns true if this dictionary contains a mapping for the specified key.
             * @param {Object} key key whose presence in this dictionary is to be
             * tested.
             * @return {boolean} true if this dictionary contains a mapping for the
             * specified key.
             */
            Dictionary.prototype.containsKey = function (key) {
                return !collections.isUndefined(this.getValue(key));
            };
            /**
             * Removes all mappings from this dictionary.
             * @this {collections.Dictionary}
             */
            Dictionary.prototype.clear = function () {
                this.table = {};
                this.nElements = 0;
            };
            /**
             * Returns the number of keys in this dictionary.
             * @return {number} the number of key-value mappings in this dictionary.
             */
            Dictionary.prototype.size = function () {
                return this.nElements;
            };
            /**
             * Returns true if this dictionary contains no mappings.
             * @return {boolean} true if this dictionary contains no mappings.
             */
            Dictionary.prototype.isEmpty = function () {
                return this.nElements <= 0;
            };
            Dictionary.prototype.toString = function () {
                var toret = "{";
                this.forEach(function (k, v) {
                    toret = toret + "\n\t" + k.toString() + " : " + v.toString();
                });
                return toret + "\n}";
            };
            return Dictionary;
        })();
        Collections.Dictionary = Dictionary; // End of dictionary
        /**
         * This class is used by the LinkedDictionary Internally
         * Has to be a class, not an interface, because it needs to have
         * the 'unlink' function defined.
         */
        var LinkedDictionaryPair = (function () {
            function LinkedDictionaryPair(key, value) {
                this.key = key;
                this.value = value;
            }
            LinkedDictionaryPair.prototype.unlink = function () {
                this.prev.next = this.next;
                this.next.prev = this.prev;
            };
            return LinkedDictionaryPair;
        })();
        var LinkedDictionary = (function (_super) {
            __extends(LinkedDictionary, _super);
            function LinkedDictionary(toStrFunction) {
                _super.call(this, toStrFunction);
                this.head = new LinkedDictionaryPair(null, null);
                this.tail = new LinkedDictionaryPair(null, null);
                this.head.next = this.tail;
                this.tail.prev = this.head;
            }
            /**
             * Inserts the new node to the 'tail' of the list, updating the
             * neighbors, and moving 'this.tail' (the End of List indicator) that
             * to the end.
             */
            LinkedDictionary.prototype.appendToTail = function (entry) {
                var lastNode = this.tail.prev;
                lastNode.next = entry;
                entry.prev = lastNode;
                entry.next = this.tail;
                this.tail.prev = entry;
            };
            /**
             * Retrieves a linked dictionary from the table internally
             */
            LinkedDictionary.prototype.getLinkedDictionaryPair = function (key) {
                if (collections.isUndefined(key)) {
                    return undefined;
                }
                var k = '$' + this.toStr(key);
                var pair = (this.table[k]);
                return pair;
            };
            /**
             * Returns the value to which this dictionary maps the specified key.
             * Returns undefined if this dictionary contains no mapping for this key.
             * @param {Object} key key whose associated value is to be returned.
             * @return {*} the value to which this dictionary maps the specified key or
             * undefined if the map contains no mapping for this key.
             */
            LinkedDictionary.prototype.getValue = function (key) {
                var pair = this.getLinkedDictionaryPair(key);
                if (!collections.isUndefined(pair)) {
                    return pair.value;
                }
                return undefined;
            };
            /**
             * Removes the mapping for this key from this dictionary if it is present.
             * Also, if a value is present for this key, the entry is removed from the
             * insertion ordering.
             * @param {Object} key key whose mapping is to be removed from the
             * dictionary.
             * @return {*} previous value associated with specified key, or undefined if
             * there was no mapping for key.
             */
            LinkedDictionary.prototype.remove = function (key) {
                var pair = this.getLinkedDictionaryPair(key);
                if (!collections.isUndefined(pair)) {
                    _super.prototype.remove.call(this, key); // This will remove it from the table
                    pair.unlink(); // This will unlink it from the chain
                    return pair.value;
                }
                return undefined;
            };
            /**
             * Removes all mappings from this LinkedDictionary.
             * @this {collections.LinkedDictionary}
             */
            LinkedDictionary.prototype.clear = function () {
                _super.prototype.clear.call(this);
                this.head.next = this.tail;
                this.tail.prev = this.head;
            };
            /**
             * Internal function used when updating an existing KeyValue pair.
             * It places the new value indexed by key into the table, but maintains
             * its place in the linked ordering.
             */
            LinkedDictionary.prototype.replace = function (oldPair, newPair) {
                var k = '$' + this.toStr(newPair.key);
                // set the new Pair's links to existingPair's links
                newPair.next = oldPair.next;
                newPair.prev = oldPair.prev;
                // Delete Existing Pair from the table, unlink it from chain.
                // As a result, the nElements gets decremented by this operation
                this.remove(oldPair.key);
                // Link new Pair in place of where oldPair was,
                // by pointing the old pair's neighbors to it.
                newPair.prev.next = newPair;
                newPair.next.prev = newPair;
                this.table[k] = newPair;
                // To make up for the fact that the number of elements was decremented,
                // We need to increase it by one.
                ++this.nElements;
            };
            /**
             * Associates the specified value with the specified key in this dictionary.
             * If the dictionary previously contained a mapping for this key, the old
             * value is replaced by the specified value.
             * Updating of a key that already exists maintains its place in the
             * insertion order into the map.
             * @param {Object} key key with which the specified value is to be
             * associated.
             * @param {Object} value value to be associated with the specified key.
             * @return {*} previous value associated with the specified key, or undefined if
             * there was no mapping for the key or if the key/value are undefined.
             */
            LinkedDictionary.prototype.setValue = function (key, value) {
                if (collections.isUndefined(key) || collections.isUndefined(value)) {
                    return undefined;
                }
                var existingPair = this.getLinkedDictionaryPair(key);
                var newPair = new LinkedDictionaryPair(key, value);
                var k = '$' + this.toStr(key);
                // If there is already an element for that key, we 
                // keep it's place in the LinkedList
                if (!collections.isUndefined(existingPair)) {
                    this.replace(existingPair, newPair);
                    return existingPair.value;
                }
                else {
                    this.appendToTail(newPair);
                    this.table[k] = newPair;
                    ++this.nElements;
                    return undefined;
                }
            };
            /**
             * Returns an array containing all of the keys in this LinkedDictionary, ordered
             * by insertion order.
             * @return {Array} an array containing all of the keys in this LinkedDictionary,
             * ordered by insertion order.
             */
            LinkedDictionary.prototype.keys = function () {
                var array = [];
                this.forEach(function (key, value) {
                    array.push(key);
                });
                return array;
            };
            /**
             * Returns an array containing all of the values in this LinkedDictionary, ordered by
             * insertion order.
             * @return {Array} an array containing all of the values in this LinkedDictionary,
             * ordered by insertion order.
             */
            LinkedDictionary.prototype.values = function () {
                var array = [];
                this.forEach(function (key, value) {
                    array.push(value);
                });
                return array;
            };
            /**
             * Executes the provided function once for each key-value pair
             * present in this LinkedDictionary. It is done in the order of insertion
             * into the LinkedDictionary
             * @param {function(Object,Object):*} callback function to execute, it is
             * invoked with two arguments: key and value. To break the iteration you can
             * optionally return false.
             */
            LinkedDictionary.prototype.forEach = function (callback) {
                var crawlNode = this.head.next;
                while (crawlNode.next != null) {
                    var ret = callback(crawlNode.key, crawlNode.value);
                    if (ret === false) {
                        return;
                    }
                    crawlNode = crawlNode.next;
                }
            };
            return LinkedDictionary;
        })(Dictionary);
        Collections.LinkedDictionary = LinkedDictionary; // End of LinkedDictionary
        // /**
        //  * Returns true if this dictionary is equal to the given dictionary.
        //  * Two dictionaries are equal if they contain the same mappings.
        //  * @param {collections.Dictionary} other the other dictionary.
        //  * @param {function(Object,Object):boolean=} valuesEqualFunction optional
        //  * function used to check if two values are equal.
        //  * @return {boolean} true if this dictionary is equal to the given dictionary.
        //  */
        // collections.Dictionary.prototype.equals = function(other,valuesEqualFunction) {
        // 	var eqF = valuesEqualFunction || collections.defaultEquals;
        // 	if(!(other instanceof collections.Dictionary)){
        // 		return false;
        // 	}
        // 	if(this.size() !== other.size()){
        // 		return false;
        // 	}
        // 	return this.equalsAux(this.firstNode,other.firstNode,eqF);
        // }
        var MultiDictionary = (function () {
            /**
             * Creates an empty multi dictionary.
             * @class <p>A multi dictionary is a special kind of dictionary that holds
             * multiple values against each key. Setting a value into the dictionary will
             * add the value to an array at that key. Getting a key will return an array,
             * holding all the values set to that key.
             * You can configure to allow duplicates in the values.
             * This implementation accepts any kind of objects as keys.</p>
             *
             * <p>If the keys are custom objects a function which converts keys to strings must be
             * provided. Example:</p>
             *
             * <pre>
             * function petToString(pet) {
             *  return pet.name;
             * }
             * </pre>
             * <p>If the values are custom objects a function to check equality between values
             * must be provided. Example:</p>
             *
             * <pre>
             * function petsAreEqualByAge(pet1,pet2) {
             *  return pet1.age===pet2.age;
             * }
             * </pre>
             * @constructor
             * @param {function(Object):string=} toStrFunction optional function
             * to convert keys to strings. If the keys aren't strings or if toString()
             * is not appropriate, a custom function which receives a key and returns a
             * unique string must be provided.
             * @param {function(Object,Object):boolean=} valuesEqualsFunction optional
             * function to check if two values are equal.
             *
             * @param allowDuplicateValues
             */
            function MultiDictionary(toStrFunction, valuesEqualsFunction, allowDuplicateValues) {
                if (allowDuplicateValues === void 0) { allowDuplicateValues = false; }
                this.dict = new Dictionary(toStrFunction);
                this.equalsF = valuesEqualsFunction || collections.defaultEquals;
                this.allowDuplicate = allowDuplicateValues;
            }
            /**
             * Returns an array holding the values to which this dictionary maps
             * the specified key.
             * Returns an empty array if this dictionary contains no mappings for this key.
             * @param {Object} key key whose associated values are to be returned.
             * @return {Array} an array holding the values to which this dictionary maps
             * the specified key.
             */
            MultiDictionary.prototype.getValue = function (key) {
                var values = this.dict.getValue(key);
                if (collections.isUndefined(values)) {
                    return [];
                }
                return collections.arrays.copy(values);
            };
            /**
             * Adds the value to the array associated with the specified key, if
             * it is not already present.
             * @param {Object} key key with which the specified value is to be
             * associated.
             * @param {Object} value the value to add to the array at the key
             * @return {boolean} true if the value was not already associated with that key.
             */
            MultiDictionary.prototype.setValue = function (key, value) {
                if (collections.isUndefined(key) || collections.isUndefined(value)) {
                    return false;
                }
                if (!this.containsKey(key)) {
                    this.dict.setValue(key, [value]);
                    return true;
                }
                var array = this.dict.getValue(key);
                if (!this.allowDuplicate) {
                    if (collections.arrays.contains(array, value, this.equalsF)) {
                        return false;
                    }
                }
                array.push(value);
                return true;
            };
            /**
             * Removes the specified values from the array of values associated with the
             * specified key. If a value isn't given, all values associated with the specified
             * key are removed.
             * @param {Object} key key whose mapping is to be removed from the
             * dictionary.
             * @param {Object=} value optional argument to specify the value to remove
             * from the array associated with the specified key.
             * @return {*} true if the dictionary changed, false if the key doesn't exist or
             * if the specified value isn't associated with the specified key.
             */
            MultiDictionary.prototype.remove = function (key, value) {
                if (collections.isUndefined(value)) {
                    var v = this.dict.remove(key);
                    return !collections.isUndefined(v);
                }
                var array = this.dict.getValue(key);
                if (collections.arrays.remove(array, value, this.equalsF)) {
                    if (array.length === 0) {
                        this.dict.remove(key);
                    }
                    return true;
                }
                return false;
            };
            /**
             * Returns an array containing all of the keys in this dictionary.
             * @return {Array} an array containing all of the keys in this dictionary.
             */
            MultiDictionary.prototype.keys = function () {
                return this.dict.keys();
            };
            /**
             * Returns an array containing all of the values in this dictionary.
             * @return {Array} an array containing all of the values in this dictionary.
             */
            MultiDictionary.prototype.values = function () {
                var values = this.dict.values();
                var array = [];
                for (var i = 0; i < values.length; i++) {
                    var v = values[i];
                    for (var j = 0; j < v.length; j++) {
                        array.push(v[j]);
                    }
                }
                return array;
            };
            /**
             * Returns true if this dictionary at least one value associatted the specified key.
             * @param {Object} key key whose presence in this dictionary is to be
             * tested.
             * @return {boolean} true if this dictionary at least one value associatted
             * the specified key.
             */
            MultiDictionary.prototype.containsKey = function (key) {
                return this.dict.containsKey(key);
            };
            /**
             * Removes all mappings from this dictionary.
             */
            MultiDictionary.prototype.clear = function () {
                this.dict.clear();
            };
            /**
             * Returns the number of keys in this dictionary.
             * @return {number} the number of key-value mappings in this dictionary.
             */
            MultiDictionary.prototype.size = function () {
                return this.dict.size();
            };
            /**
             * Returns true if this dictionary contains no mappings.
             * @return {boolean} true if this dictionary contains no mappings.
             */
            MultiDictionary.prototype.isEmpty = function () {
                return this.dict.isEmpty();
            };
            return MultiDictionary;
        })();
        Collections.MultiDictionary = MultiDictionary; // end of multi dictionary 
        var Heap = (function () {
            /**
             * Creates an empty Heap.
             * @class
             * <p>A heap is a binary tree, where the nodes maintain the heap property:
             * each node is smaller than each of its children and therefore a MinHeap
             * This implementation uses an array to store elements.</p>
             * <p>If the inserted elements are custom objects a compare function must be provided,
             *  at construction time, otherwise the <=, === and >= operators are
             * used to compare elements. Example:</p>
             *
             * <pre>
             * function compare(a, b) {
             *  if (a is less than b by some ordering criterion) {
             *     return -1;
             *  } if (a is greater than b by the ordering criterion) {
             *     return 1;
             *  }
             *  // a must be equal to b
             *  return 0;
             * }
             * </pre>
             *
             * <p>If a Max-Heap is wanted (greater elements on top) you can a provide a
             * reverse compare function to accomplish that behavior. Example:</p>
             *
             * <pre>
             * function reverseCompare(a, b) {
             *  if (a is less than b by some ordering criterion) {
             *     return 1;
             *  } if (a is greater than b by the ordering criterion) {
             *     return -1;
             *  }
             *  // a must be equal to b
             *  return 0;
             * }
             * </pre>
             *
             * @constructor
             * @param {function(Object,Object):number=} compareFunction optional
             * function used to compare two elements. Must return a negative integer,
             * zero, or a positive integer as the first argument is less than, equal to,
             * or greater than the second.
             */
            function Heap(compareFunction) {
                /**
                 * Array used to store the elements od the heap.
                 * @type {Array.<Object>}
                 * @private
                 */
                this.data = [];
                this.compare = compareFunction || collections.defaultCompare;
            }
            /**
             * Returns the index of the left child of the node at the given index.
             * @param {number} nodeIndex The index of the node to get the left child
             * for.
             * @return {number} The index of the left child.
             * @private
             */
            Heap.prototype.leftChildIndex = function (nodeIndex) {
                return (2 * nodeIndex) + 1;
            };
            /**
             * Returns the index of the right child of the node at the given index.
             * @param {number} nodeIndex The index of the node to get the right child
             * for.
             * @return {number} The index of the right child.
             * @private
             */
            Heap.prototype.rightChildIndex = function (nodeIndex) {
                return (2 * nodeIndex) + 2;
            };
            /**
             * Returns the index of the parent of the node at the given index.
             * @param {number} nodeIndex The index of the node to get the parent for.
             * @return {number} The index of the parent.
             * @private
             */
            Heap.prototype.parentIndex = function (nodeIndex) {
                return Math.floor((nodeIndex - 1) / 2);
            };
            /**
             * Returns the index of the smaller child node (if it exists).
             * @param {number} leftChild left child index.
             * @param {number} rightChild right child index.
             * @return {number} the index with the minimum value or -1 if it doesn't
             * exists.
             * @private
             */
            Heap.prototype.minIndex = function (leftChild, rightChild) {
                if (rightChild >= this.data.length) {
                    if (leftChild >= this.data.length) {
                        return -1;
                    }
                    else {
                        return leftChild;
                    }
                }
                else {
                    if (this.compare(this.data[leftChild], this.data[rightChild]) <= 0) {
                        return leftChild;
                    }
                    else {
                        return rightChild;
                    }
                }
            };
            /**
             * Moves the node at the given index up to its proper place in the heap.
             * @param {number} index The index of the node to move up.
             * @private
             */
            Heap.prototype.siftUp = function (index) {
                var parent = this.parentIndex(index);
                while (index > 0 && this.compare(this.data[parent], this.data[index]) > 0) {
                    collections.arrays.swap(this.data, parent, index);
                    index = parent;
                    parent = this.parentIndex(index);
                }
            };
            /**
             * Moves the node at the given index down to its proper place in the heap.
             * @param {number} nodeIndex The index of the node to move down.
             * @private
             */
            Heap.prototype.siftDown = function (nodeIndex) {
                //smaller child index
                var min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
                while (min >= 0 && this.compare(this.data[nodeIndex], this.data[min]) > 0) {
                    collections.arrays.swap(this.data, min, nodeIndex);
                    nodeIndex = min;
                    min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
                }
            };
            /**
             * Retrieves but does not remove the root element of this heap.
             * @return {*} The value at the root of the heap. Returns undefined if the
             * heap is empty.
             */
            Heap.prototype.peek = function () {
                if (this.data.length > 0) {
                    return this.data[0];
                }
                else {
                    return undefined;
                }
            };
            /**
             * Adds the given element into the heap.
             * @param {*} element the element.
             * @return true if the element was added or fals if it is undefined.
             */
            Heap.prototype.add = function (element) {
                if (collections.isUndefined(element)) {
                    return undefined;
                }
                this.data.push(element);
                this.siftUp(this.data.length - 1);
                return true;
            };
            /**
             * Retrieves and removes the root element of this heap.
             * @return {*} The value removed from the root of the heap. Returns
             * undefined if the heap is empty.
             */
            Heap.prototype.removeRoot = function () {
                if (this.data.length > 0) {
                    var obj = this.data[0];
                    this.data[0] = this.data[this.data.length - 1];
                    this.data.splice(this.data.length - 1, 1);
                    if (this.data.length > 0) {
                        this.siftDown(0);
                    }
                    return obj;
                }
                return undefined;
            };
            /**
             * Returns true if this heap contains the specified element.
             * @param {Object} element element to search for.
             * @return {boolean} true if this Heap contains the specified element, false
             * otherwise.
             */
            Heap.prototype.contains = function (element) {
                var equF = collections.compareToEquals(this.compare);
                return collections.arrays.contains(this.data, element, equF);
            };
            /**
             * Returns the number of elements in this heap.
             * @return {number} the number of elements in this heap.
             */
            Heap.prototype.size = function () {
                return this.data.length;
            };
            /**
             * Checks if this heap is empty.
             * @return {boolean} true if and only if this heap contains no items; false
             * otherwise.
             */
            Heap.prototype.isEmpty = function () {
                return this.data.length <= 0;
            };
            /**
             * Removes all of the elements from this heap.
             */
            Heap.prototype.clear = function () {
                this.data.length = 0;
            };
            /**
             * Executes the provided function once for each element present in this heap in
             * no particular order.
             * @param {function(Object):*} callback function to execute, it is
             * invoked with one argument: the element value, to break the iteration you can
             * optionally return false.
             */
            Heap.prototype.forEach = function (callback) {
                collections.arrays.forEach(this.data, callback);
            };
            return Heap;
        })();
        Collections.Heap = Heap;
        var Stack = (function () {
            /**
             * Creates an empty Stack.
             * @class A Stack is a Last-In-First-Out (LIFO) data structure, the last
             * element added to the stack will be the first one to be removed. This
             * implementation uses a linked list as a container.
             * @constructor
             */
            function Stack() {
                this.list = new LinkedList();
            }
            /**
             * Pushes an item onto the top of this stack.
             * @param {Object} elem the element to be pushed onto this stack.
             * @return {boolean} true if the element was pushed or false if it is undefined.
             */
            Stack.prototype.push = function (elem) {
                return this.list.add(elem, 0);
            };
            /**
             * Pushes an item onto the top of this stack.
             * @param {Object} elem the element to be pushed onto this stack.
             * @return {boolean} true if the element was pushed or false if it is undefined.
             */
            Stack.prototype.add = function (elem) {
                return this.list.add(elem, 0);
            };
            /**
             * Removes the object at the top of this stack and returns that object.
             * @return {*} the object at the top of this stack or undefined if the
             * stack is empty.
             */
            Stack.prototype.pop = function () {
                return this.list.removeElementAtIndex(0);
            };
            /**
             * Looks at the object at the top of this stack without removing it from the
             * stack.
             * @return {*} the object at the top of this stack or undefined if the
             * stack is empty.
             */
            Stack.prototype.peek = function () {
                return this.list.first();
            };
            /**
             * Returns the number of elements in this stack.
             * @return {number} the number of elements in this stack.
             */
            Stack.prototype.size = function () {
                return this.list.size();
            };
            /**
             * Returns true if this stack contains the specified element.
             * <p>If the elements inside this stack are
             * not comparable with the === operator, a custom equals function should be
             * provided to perform searches, the function must receive two arguments and
             * return true if they are equal, false otherwise. Example:</p>
             *
             * <pre>
             * var petsAreEqualByName (pet1, pet2) {
             *  return pet1.name === pet2.name;
             * }
             * </pre>
             * @param {Object} elem element to search for.
             * @param {function(Object,Object):boolean=} equalsFunction optional
             * function to check if two elements are equal.
             * @return {boolean} true if this stack contains the specified element,
             * false otherwise.
             */
            Stack.prototype.contains = function (elem, equalsFunction) {
                return this.list.contains(elem, equalsFunction);
            };
            /**
             * Checks if this stack is empty.
             * @return {boolean} true if and only if this stack contains no items; false
             * otherwise.
             */
            Stack.prototype.isEmpty = function () {
                return this.list.isEmpty();
            };
            /**
             * Removes all of the elements from this stack.
             */
            Stack.prototype.clear = function () {
                this.list.clear();
            };
            /**
             * Executes the provided function once for each element present in this stack in
             * LIFO order.
             * @param {function(Object):*} callback function to execute, it is
             * invoked with one argument: the element value, to break the iteration you can
             * optionally return false.
             */
            Stack.prototype.forEach = function (callback) {
                this.list.forEach(callback);
            };
            return Stack;
        })();
        Collections.Stack = Stack; // End of stack 
        var Queue = (function () {
            /**
             * Creates an empty queue.
             * @class A queue is a First-In-First-Out (FIFO) data structure, the first
             * element added to the queue will be the first one to be removed. This
             * implementation uses a linked list as a container.
             * @constructor
             */
            function Queue() {
                this.list = new LinkedList();
            }
            /**
             * Inserts the specified element into the end of this queue.
             * @param {Object} elem the element to insert.
             * @return {boolean} true if the element was inserted, or false if it is undefined.
             */
            Queue.prototype.enqueue = function (elem) {
                return this.list.add(elem);
            };
            /**
             * Inserts the specified element into the end of this queue.
             * @param {Object} elem the element to insert.
             * @return {boolean} true if the element was inserted, or false if it is undefined.
             */
            Queue.prototype.add = function (elem) {
                return this.list.add(elem);
            };
            /**
             * Retrieves and removes the head of this queue.
             * @return {*} the head of this queue, or undefined if this queue is empty.
             */
            Queue.prototype.dequeue = function () {
                if (this.list.size() !== 0) {
                    var el = this.list.first();
                    this.list.removeElementAtIndex(0);
                    return el;
                }
                return undefined;
            };
            /**
             * Retrieves, but does not remove, the head of this queue.
             * @return {*} the head of this queue, or undefined if this queue is empty.
             */
            Queue.prototype.peek = function () {
                if (this.list.size() !== 0) {
                    return this.list.first();
                }
                return undefined;
            };
            /**
             * Returns the number of elements in this queue.
             * @return {number} the number of elements in this queue.
             */
            Queue.prototype.size = function () {
                return this.list.size();
            };
            /**
             * Returns true if this queue contains the specified element.
             * <p>If the elements inside this stack are
             * not comparable with the === operator, a custom equals function should be
             * provided to perform searches, the function must receive two arguments and
             * return true if they are equal, false otherwise. Example:</p>
             *
             * <pre>
             * var petsAreEqualByName (pet1, pet2) {
             *  return pet1.name === pet2.name;
             * }
             * </pre>
             * @param {Object} elem element to search for.
             * @param {function(Object,Object):boolean=} equalsFunction optional
             * function to check if two elements are equal.
             * @return {boolean} true if this queue contains the specified element,
             * false otherwise.
             */
            Queue.prototype.contains = function (elem, equalsFunction) {
                return this.list.contains(elem, equalsFunction);
            };
            /**
             * Checks if this queue is empty.
             * @return {boolean} true if and only if this queue contains no items; false
             * otherwise.
             */
            Queue.prototype.isEmpty = function () {
                return this.list.size() <= 0;
            };
            /**
             * Removes all of the elements from this queue.
             */
            Queue.prototype.clear = function () {
                this.list.clear();
            };
            /**
             * Executes the provided function once for each element present in this queue in
             * FIFO order.
             * @param {function(Object):*} callback function to execute, it is
             * invoked with one argument: the element value, to break the iteration you can
             * optionally return false.
             */
            Queue.prototype.forEach = function (callback) {
                this.list.forEach(callback);
            };
            return Queue;
        })();
        Collections.Queue = Queue; // End of queue
        var PriorityQueue = (function () {
            /**
             * Creates an empty priority queue.
             * @class <p>In a priority queue each element is associated with a "priority",
             * elements are dequeued in highest-priority-first order (the elements with the
             * highest priority are dequeued first). Priority Queues are implemented as heaps.
             * If the inserted elements are custom objects a compare function must be provided,
             * otherwise the <=, === and >= operators are used to compare object priority.</p>
             * <pre>
             * function compare(a, b) {
             *  if (a is less than b by some ordering criterion) {
             *     return -1;
             *  } if (a is greater than b by the ordering criterion) {
             *     return 1;
             *  }
             *  // a must be equal to b
             *  return 0;
             * }
             * </pre>
             * @constructor
             * @param {function(Object,Object):number=} compareFunction optional
             * function used to compare two element priorities. Must return a negative integer,
             * zero, or a positive integer as the first argument is less than, equal to,
             * or greater than the second.
             */
            function PriorityQueue(compareFunction) {
                this.heap = new Heap(collections.reverseCompareFunction(compareFunction));
            }
            /**
             * Inserts the specified element into this priority queue.
             * @param {Object} element the element to insert.
             * @return {boolean} true if the element was inserted, or false if it is undefined.
             */
            PriorityQueue.prototype.enqueue = function (element) {
                return this.heap.add(element);
            };
            /**
             * Inserts the specified element into this priority queue.
             * @param {Object} element the element to insert.
             * @return {boolean} true if the element was inserted, or false if it is undefined.
             */
            PriorityQueue.prototype.add = function (element) {
                return this.heap.add(element);
            };
            /**
             * Retrieves and removes the highest priority element of this queue.
             * @return {*} the the highest priority element of this queue,
             *  or undefined if this queue is empty.
             */
            PriorityQueue.prototype.dequeue = function () {
                if (this.heap.size() !== 0) {
                    var el = this.heap.peek();
                    this.heap.removeRoot();
                    return el;
                }
                return undefined;
            };
            /**
             * Retrieves, but does not remove, the highest priority element of this queue.
             * @return {*} the highest priority element of this queue, or undefined if this queue is empty.
             */
            PriorityQueue.prototype.peek = function () {
                return this.heap.peek();
            };
            /**
             * Returns true if this priority queue contains the specified element.
             * @param {Object} element element to search for.
             * @return {boolean} true if this priority queue contains the specified element,
             * false otherwise.
             */
            PriorityQueue.prototype.contains = function (element) {
                return this.heap.contains(element);
            };
            /**
             * Checks if this priority queue is empty.
             * @return {boolean} true if and only if this priority queue contains no items; false
             * otherwise.
             */
            PriorityQueue.prototype.isEmpty = function () {
                return this.heap.isEmpty();
            };
            /**
             * Returns the number of elements in this priority queue.
             * @return {number} the number of elements in this priority queue.
             */
            PriorityQueue.prototype.size = function () {
                return this.heap.size();
            };
            /**
             * Removes all of the elements from this priority queue.
             */
            PriorityQueue.prototype.clear = function () {
                this.heap.clear();
            };
            /**
             * Executes the provided function once for each element present in this queue in
             * no particular order.
             * @param {function(Object):*} callback function to execute, it is
             * invoked with one argument: the element value, to break the iteration you can
             * optionally return false.
             */
            PriorityQueue.prototype.forEach = function (callback) {
                this.heap.forEach(callback);
            };
            return PriorityQueue;
        })();
        Collections.PriorityQueue = PriorityQueue; // end of priority queue
        var Set = (function () {
            /**
             * Creates an empty set.
             * @class <p>A set is a data structure that contains no duplicate items.</p>
             * <p>If the inserted elements are custom objects a function
             * which converts elements to strings must be provided. Example:</p>
             *
             * <pre>
             * function petToString(pet) {
             *  return pet.name;
             * }
             * </pre>
             *
             * @constructor
             * @param {function(Object):string=} toStringFunction optional function used
             * to convert elements to strings. If the elements aren't strings or if toString()
             * is not appropriate, a custom function which receives a onject and returns a
             * unique string must be provided.
             */
            function Set(toStringFunction) {
                this.dictionary = new Dictionary(toStringFunction);
            }
            /**
             * Returns true if this set contains the specified element.
             * @param {Object} element element to search for.
             * @return {boolean} true if this set contains the specified element,
             * false otherwise.
             */
            Set.prototype.contains = function (element) {
                return this.dictionary.containsKey(element);
            };
            /**
             * Adds the specified element to this set if it is not already present.
             * @param {Object} element the element to insert.
             * @return {boolean} true if this set did not already contain the specified element.
             */
            Set.prototype.add = function (element) {
                if (this.contains(element) || collections.isUndefined(element)) {
                    return false;
                }
                else {
                    this.dictionary.setValue(element, element);
                    return true;
                }
            };
            /**
             * Performs an intersecion between this an another set.
             * Removes all values that are not present this set and the given set.
             * @param {collections.Set} otherSet other set.
             */
            Set.prototype.intersection = function (otherSet) {
                var set = this;
                this.forEach(function (element) {
                    if (!otherSet.contains(element)) {
                        set.remove(element);
                    }
                    return true;
                });
            };
            /**
             * Performs a union between this an another set.
             * Adds all values from the given set to this set.
             * @param {collections.Set} otherSet other set.
             */
            Set.prototype.union = function (otherSet) {
                var set = this;
                otherSet.forEach(function (element) {
                    set.add(element);
                    return true;
                });
            };
            /**
             * Performs a difference between this an another set.
             * Removes from this set all the values that are present in the given set.
             * @param {collections.Set} otherSet other set.
             */
            Set.prototype.difference = function (otherSet) {
                var set = this;
                otherSet.forEach(function (element) {
                    set.remove(element);
                    return true;
                });
            };
            /**
             * Checks whether the given set contains all the elements in this set.
             * @param {collections.Set} otherSet other set.
             * @return {boolean} true if this set is a subset of the given set.
             */
            Set.prototype.isSubsetOf = function (otherSet) {
                if (this.size() > otherSet.size()) {
                    return false;
                }
                var isSub = true;
                this.forEach(function (element) {
                    if (!otherSet.contains(element)) {
                        isSub = false;
                        return false;
                    }
                    return true;
                });
                return isSub;
            };
            /**
             * Removes the specified element from this set if it is present.
             * @return {boolean} true if this set contained the specified element.
             */
            Set.prototype.remove = function (element) {
                if (!this.contains(element)) {
                    return false;
                }
                else {
                    this.dictionary.remove(element);
                    return true;
                }
            };
            /**
             * Executes the provided function once for each element
             * present in this set.
             * @param {function(Object):*} callback function to execute, it is
             * invoked with one arguments: the element. To break the iteration you can
             * optionally return false.
             */
            Set.prototype.forEach = function (callback) {
                this.dictionary.forEach(function (k, v) {
                    return callback(v);
                });
            };
            /**
             * Returns an array containing all of the elements in this set in arbitrary order.
             * @return {Array} an array containing all of the elements in this set.
             */
            Set.prototype.toArray = function () {
                return this.dictionary.values();
            };
            /**
             * Returns true if this set contains no elements.
             * @return {boolean} true if this set contains no elements.
             */
            Set.prototype.isEmpty = function () {
                return this.dictionary.isEmpty();
            };
            /**
             * Returns the number of elements in this set.
             * @return {number} the number of elements in this set.
             */
            Set.prototype.size = function () {
                return this.dictionary.size();
            };
            /**
             * Removes all of the elements from this set.
             */
            Set.prototype.clear = function () {
                this.dictionary.clear();
            };
            /*
             * Provides a string representation for display
             */
            Set.prototype.toString = function () {
                return collections.arrays.toString(this.toArray());
            };
            return Set;
        })();
        Collections.Set = Set; // end of Set
        var Bag = (function () {
            /**
             * Creates an empty bag.
             * @class <p>A bag is a special kind of set in which members are
             * allowed to appear more than once.</p>
             * <p>If the inserted elements are custom objects a function
             * which converts elements to unique strings must be provided. Example:</p>
             *
             * <pre>
             * function petToString(pet) {
             *  return pet.name;
             * }
             * </pre>
             *
             * @constructor
             * @param {function(Object):string=} toStrFunction optional function used
             * to convert elements to strings. If the elements aren't strings or if toString()
             * is not appropriate, a custom function which receives an object and returns a
             * unique string must be provided.
             */
            function Bag(toStrFunction) {
                this.toStrF = toStrFunction || collections.defaultToString;
                this.dictionary = new Dictionary(this.toStrF);
                this.nElements = 0;
            }
            /**
             * Adds nCopies of the specified object to this bag.
             * @param {Object} element element to add.
             * @param {number=} nCopies the number of copies to add, if this argument is
             * undefined 1 copy is added.
             * @return {boolean} true unless element is undefined.
             */
            Bag.prototype.add = function (element, nCopies) {
                if (nCopies === void 0) { nCopies = 1; }
                if (collections.isUndefined(element) || nCopies <= 0) {
                    return false;
                }
                if (!this.contains(element)) {
                    var node = {
                        value: element,
                        copies: nCopies
                    };
                    this.dictionary.setValue(element, node);
                }
                else {
                    this.dictionary.getValue(element).copies += nCopies;
                }
                this.nElements += nCopies;
                return true;
            };
            /**
             * Counts the number of copies of the specified object in this bag.
             * @param {Object} element the object to search for..
             * @return {number} the number of copies of the object, 0 if not found
             */
            Bag.prototype.count = function (element) {
                if (!this.contains(element)) {
                    return 0;
                }
                else {
                    return this.dictionary.getValue(element).copies;
                }
            };
            /**
             * Returns true if this bag contains the specified element.
             * @param {Object} element element to search for.
             * @return {boolean} true if this bag contains the specified element,
             * false otherwise.
             */
            Bag.prototype.contains = function (element) {
                return this.dictionary.containsKey(element);
            };
            /**
             * Removes nCopies of the specified object to this bag.
             * If the number of copies to remove is greater than the actual number
             * of copies in the Bag, all copies are removed.
             * @param {Object} element element to remove.
             * @param {number=} nCopies the number of copies to remove, if this argument is
             * undefined 1 copy is removed.
             * @return {boolean} true if at least 1 element was removed.
             */
            Bag.prototype.remove = function (element, nCopies) {
                if (nCopies === void 0) { nCopies = 1; }
                if (collections.isUndefined(element) || nCopies <= 0) {
                    return false;
                }
                if (!this.contains(element)) {
                    return false;
                }
                else {
                    var node = this.dictionary.getValue(element);
                    if (nCopies > node.copies) {
                        this.nElements -= node.copies;
                    }
                    else {
                        this.nElements -= nCopies;
                    }
                    node.copies -= nCopies;
                    if (node.copies <= 0) {
                        this.dictionary.remove(element);
                    }
                    return true;
                }
            };
            /**
             * Returns an array containing all of the elements in this big in arbitrary order,
             * including multiple copies.
             * @return {Array} an array containing all of the elements in this bag.
             */
            Bag.prototype.toArray = function () {
                var a = [];
                var values = this.dictionary.values();
                var vl = values.length;
                for (var i = 0; i < vl; i++) {
                    var node = values[i];
                    var element = node.value;
                    var copies = node.copies;
                    for (var j = 0; j < copies; j++) {
                        a.push(element);
                    }
                }
                return a;
            };
            /**
             * Returns a set of unique elements in this bag.
             * @return {collections.Set<T>} a set of unique elements in this bag.
             */
            Bag.prototype.toSet = function () {
                var toret = new Set(this.toStrF);
                var elements = this.dictionary.values();
                var l = elements.length;
                for (var i = 0; i < l; i++) {
                    var value = elements[i].value;
                    toret.add(value);
                }
                return toret;
            };
            /**
             * Executes the provided function once for each element
             * present in this bag, including multiple copies.
             * @param {function(Object):*} callback function to execute, it is
             * invoked with one argument: the element. To break the iteration you can
             * optionally return false.
             */
            Bag.prototype.forEach = function (callback) {
                this.dictionary.forEach(function (k, v) {
                    var value = v.value;
                    var copies = v.copies;
                    for (var i = 0; i < copies; i++) {
                        if (callback(value) === false) {
                            return false;
                        }
                    }
                    return true;
                });
            };
            /**
             * Returns the number of elements in this bag.
             * @return {number} the number of elements in this bag.
             */
            Bag.prototype.size = function () {
                return this.nElements;
            };
            /**
             * Returns true if this bag contains no elements.
             * @return {boolean} true if this bag contains no elements.
             */
            Bag.prototype.isEmpty = function () {
                return this.nElements === 0;
            };
            /**
             * Removes all of the elements from this bag.
             */
            Bag.prototype.clear = function () {
                this.nElements = 0;
                this.dictionary.clear();
            };
            return Bag;
        })();
        Collections.Bag = Bag; // End of bag 
        var BSTree = (function () {
            /**
             * Creates an empty binary search tree.
             * @class <p>A binary search tree is a binary tree in which each
             * internal node stores an element such that the elements stored in the
             * left subtree are less than it and the elements
             * stored in the right subtree are greater.</p>
             * <p>Formally, a binary search tree is a node-based binary tree data structure which
             * has the following properties:</p>
             * <ul>
             * <li>The left subtree of a node contains only nodes with elements less
             * than the node's element</li>
             * <li>The right subtree of a node contains only nodes with elements greater
             * than the node's element</li>
             * <li>Both the left and right subtrees must also be binary search trees.</li>
             * </ul>
             * <p>If the inserted elements are custom objects a compare function must
             * be provided at construction time, otherwise the <=, === and >= operators are
             * used to compare elements. Example:</p>
             * <pre>
             * function compare(a, b) {
             *  if (a is less than b by some ordering criterion) {
             *     return -1;
             *  } if (a is greater than b by the ordering criterion) {
             *     return 1;
             *  }
             *  // a must be equal to b
             *  return 0;
             * }
             * </pre>
             * @constructor
             * @param {function(Object,Object):number=} compareFunction optional
             * function used to compare two elements. Must return a negative integer,
             * zero, or a positive integer as the first argument is less than, equal to,
             * or greater than the second.
             */
            function BSTree(compareFunction) {
                this.root = null;
                this.compare = compareFunction || collections.defaultCompare;
                this.nElements = 0;
            }
            /**
             * Adds the specified element to this tree if it is not already present.
             * @param {Object} element the element to insert.
             * @return {boolean} true if this tree did not already contain the specified element.
             */
            BSTree.prototype.add = function (element) {
                if (collections.isUndefined(element)) {
                    return false;
                }
                if (this.insertNode(this.createNode(element)) !== null) {
                    this.nElements++;
                    return true;
                }
                return false;
            };
            /**
             * Removes all of the elements from this tree.
             */
            BSTree.prototype.clear = function () {
                this.root = null;
                this.nElements = 0;
            };
            /**
             * Returns true if this tree contains no elements.
             * @return {boolean} true if this tree contains no elements.
             */
            BSTree.prototype.isEmpty = function () {
                return this.nElements === 0;
            };
            /**
             * Returns the number of elements in this tree.
             * @return {number} the number of elements in this tree.
             */
            BSTree.prototype.size = function () {
                return this.nElements;
            };
            /**
             * Returns true if this tree contains the specified element.
             * @param {Object} element element to search for.
             * @return {boolean} true if this tree contains the specified element,
             * false otherwise.
             */
            BSTree.prototype.contains = function (element) {
                if (collections.isUndefined(element)) {
                    return false;
                }
                return this.searchNode(this.root, element) !== null;
            };
            /**
             * Removes the specified element from this tree if it is present.
             * @return {boolean} true if this tree contained the specified element.
             */
            BSTree.prototype.remove = function (element) {
                var node = this.searchNode(this.root, element);
                if (node === null) {
                    return false;
                }
                this.removeNode(node);
                this.nElements--;
                return true;
            };
            /**
             * Executes the provided function once for each element present in this tree in
             * in-order.
             * @param {function(Object):*} callback function to execute, it is invoked with one
             * argument: the element value, to break the iteration you can optionally return false.
             */
            BSTree.prototype.inorderTraversal = function (callback) {
                this.inorderTraversalAux(this.root, callback, {
                    stop: false
                });
            };
            /**
             * Executes the provided function once for each element present in this tree in pre-order.
             * @param {function(Object):*} callback function to execute, it is invoked with one
             * argument: the element value, to break the iteration you can optionally return false.
             */
            BSTree.prototype.preorderTraversal = function (callback) {
                this.preorderTraversalAux(this.root, callback, {
                    stop: false
                });
            };
            /**
             * Executes the provided function once for each element present in this tree in post-order.
             * @param {function(Object):*} callback function to execute, it is invoked with one
             * argument: the element value, to break the iteration you can optionally return false.
             */
            BSTree.prototype.postorderTraversal = function (callback) {
                this.postorderTraversalAux(this.root, callback, {
                    stop: false
                });
            };
            /**
             * Executes the provided function once for each element present in this tree in
             * level-order.
             * @param {function(Object):*} callback function to execute, it is invoked with one
             * argument: the element value, to break the iteration you can optionally return false.
             */
            BSTree.prototype.levelTraversal = function (callback) {
                this.levelTraversalAux(this.root, callback);
            };
            /**
             * Returns the minimum element of this tree.
             * @return {*} the minimum element of this tree or undefined if this tree is
             * is empty.
             */
            BSTree.prototype.minimum = function () {
                if (this.isEmpty()) {
                    return undefined;
                }
                return this.minimumAux(this.root).element;
            };
            /**
             * Returns the maximum element of this tree.
             * @return {*} the maximum element of this tree or undefined if this tree is
             * is empty.
             */
            BSTree.prototype.maximum = function () {
                if (this.isEmpty()) {
                    return undefined;
                }
                return this.maximumAux(this.root).element;
            };
            /**
             * Executes the provided function once for each element present in this tree in inorder.
             * Equivalent to inorderTraversal.
             * @param {function(Object):*} callback function to execute, it is
             * invoked with one argument: the element value, to break the iteration you can
             * optionally return false.
             */
            BSTree.prototype.forEach = function (callback) {
                this.inorderTraversal(callback);
            };
            /**
             * Returns an array containing all of the elements in this tree in in-order.
             * @return {Array} an array containing all of the elements in this tree in in-order.
             */
            BSTree.prototype.toArray = function () {
                var array = [];
                this.inorderTraversal(function (element) {
                    array.push(element);
                    return true;
                });
                return array;
            };
            /**
             * Returns the height of this tree.
             * @return {number} the height of this tree or -1 if is empty.
             */
            BSTree.prototype.height = function () {
                return this.heightAux(this.root);
            };
            /**
             * @private
             */
            BSTree.prototype.searchNode = function (node, element) {
                var cmp = null;
                while (node !== null && cmp !== 0) {
                    cmp = this.compare(element, node.element);
                    if (cmp < 0) {
                        node = node.leftCh;
                    }
                    else if (cmp > 0) {
                        node = node.rightCh;
                    }
                }
                return node;
            };
            /**
             * @private
             */
            BSTree.prototype.transplant = function (n1, n2) {
                if (n1.parent === null) {
                    this.root = n2;
                }
                else if (n1 === n1.parent.leftCh) {
                    n1.parent.leftCh = n2;
                }
                else {
                    n1.parent.rightCh = n2;
                }
                if (n2 !== null) {
                    n2.parent = n1.parent;
                }
            };
            /**
             * @private
             */
            BSTree.prototype.removeNode = function (node) {
                if (node.leftCh === null) {
                    this.transplant(node, node.rightCh);
                }
                else if (node.rightCh === null) {
                    this.transplant(node, node.leftCh);
                }
                else {
                    var y = this.minimumAux(node.rightCh);
                    if (y.parent !== node) {
                        this.transplant(y, y.rightCh);
                        y.rightCh = node.rightCh;
                        y.rightCh.parent = y;
                    }
                    this.transplant(node, y);
                    y.leftCh = node.leftCh;
                    y.leftCh.parent = y;
                }
            };
            /**
             * @private
             */
            BSTree.prototype.inorderTraversalAux = function (node, callback, signal) {
                if (node === null || signal.stop) {
                    return;
                }
                this.inorderTraversalAux(node.leftCh, callback, signal);
                if (signal.stop) {
                    return;
                }
                signal.stop = callback(node.element) === false;
                if (signal.stop) {
                    return;
                }
                this.inorderTraversalAux(node.rightCh, callback, signal);
            };
            /**
             * @private
             */
            BSTree.prototype.levelTraversalAux = function (node, callback) {
                var queue = new Queue();
                if (node !== null) {
                    queue.enqueue(node);
                }
                while (!queue.isEmpty()) {
                    node = queue.dequeue();
                    if (callback(node.element) === false) {
                        return;
                    }
                    if (node.leftCh !== null) {
                        queue.enqueue(node.leftCh);
                    }
                    if (node.rightCh !== null) {
                        queue.enqueue(node.rightCh);
                    }
                }
            };
            /**
             * @private
             */
            BSTree.prototype.preorderTraversalAux = function (node, callback, signal) {
                if (node === null || signal.stop) {
                    return;
                }
                signal.stop = callback(node.element) === false;
                if (signal.stop) {
                    return;
                }
                this.preorderTraversalAux(node.leftCh, callback, signal);
                if (signal.stop) {
                    return;
                }
                this.preorderTraversalAux(node.rightCh, callback, signal);
            };
            /**
             * @private
             */
            BSTree.prototype.postorderTraversalAux = function (node, callback, signal) {
                if (node === null || signal.stop) {
                    return;
                }
                this.postorderTraversalAux(node.leftCh, callback, signal);
                if (signal.stop) {
                    return;
                }
                this.postorderTraversalAux(node.rightCh, callback, signal);
                if (signal.stop) {
                    return;
                }
                signal.stop = callback(node.element) === false;
            };
            /**
             * @private
             */
            BSTree.prototype.minimumAux = function (node) {
                while (node.leftCh !== null) {
                    node = node.leftCh;
                }
                return node;
            };
            /**
             * @private
             */
            BSTree.prototype.maximumAux = function (node) {
                while (node.rightCh !== null) {
                    node = node.rightCh;
                }
                return node;
            };
            /**
             * @private
             */
            BSTree.prototype.heightAux = function (node) {
                if (node === null) {
                    return -1;
                }
                return Math.max(this.heightAux(node.leftCh), this.heightAux(node.rightCh)) + 1;
            };
            /*
             * @private
             */
            BSTree.prototype.insertNode = function (node) {
                var parent = null;
                var position = this.root;
                var cmp = null;
                while (position !== null) {
                    cmp = this.compare(node.element, position.element);
                    if (cmp === 0) {
                        return null;
                    }
                    else if (cmp < 0) {
                        parent = position;
                        position = position.leftCh;
                    }
                    else {
                        parent = position;
                        position = position.rightCh;
                    }
                }
                node.parent = parent;
                if (parent === null) {
                    // tree is empty
                    this.root = node;
                }
                else if (this.compare(node.element, parent.element) < 0) {
                    parent.leftCh = node;
                }
                else {
                    parent.rightCh = node;
                }
                return node;
            };
            /**
             * @private
             */
            BSTree.prototype.createNode = function (element) {
                return {
                    element: element,
                    leftCh: null,
                    rightCh: null,
                    parent: null
                };
            };
            return BSTree;
        })();
        Collections.BSTree = BSTree; // end of BSTree
    })(Collections = Utils.Collections || (Utils.Collections = {}));
})(Utils || (Utils = {})); // End of module 
var Utils;
(function (Utils) {
    var Colors = (function () {
        function Colors() {
        }
        Colors.float32ColorToARGB = function (float32Color) {
            var a = (float32Color & 0xff000000) >>> 24;
            var r = (float32Color & 0xff0000) >>> 16;
            var g = (float32Color & 0xff00) >>> 8;
            var b = float32Color & 0xff;
            var result = [a, r, g, b];
            return result;
        };
        Colors._componentToHex = function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };
        Colors.rgbToHexString = function (rgb) {
            Colors.coalesce(rgb);
            return "#" + Colors._componentToHex(rgb[0]) + Colors._componentToHex(rgb[1]) + Colors._componentToHex(rgb[2]);
        };
        Colors.argbToHexString = function (argb) {
            return "#" + Colors._componentToHex(argb[0]) + Colors._componentToHex(argb[1]) + Colors._componentToHex(argb[2]) + Colors._componentToHex(argb[3]);
        };
        Colors.coalesce = function (arr) {
            for (var i = 1; i < arr.length; i++) {
                if (typeof (arr[i]) === 'undefined')
                    arr[i] = arr[i - 1];
            }
        };
        return Colors;
    })();
    Utils.Colors = Colors;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Dates = (function () {
        function Dates() {
        }
        Dates.getTimeStamp = function () {
            return new Date().getTime();
        };
        return Dates;
    })();
    Utils.Dates = Dates;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Device = (function () {
        function Device() {
        }
        Device.getPixelRatio = function (ctx) {
            var dpr = window.devicePixelRatio || 1;
            var bsr = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;
            return dpr / bsr;
        };
        Device.isTouch = function () {
            return !!("ontouchstart" in window) || window.navigator.msMaxTouchPoints > 0;
        };
        return Device;
    })();
    Utils.Device = Device;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Documents = (function () {
        function Documents() {
        }
        Documents.isInIFrame = function () {
            // see http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
            try {
                return window.self !== window.top;
            }
            catch (e) {
                return true;
            }
        };
        Documents.supportsFullscreen = function () {
            var doc = document.documentElement;
            var support = doc.requestFullscreen || doc.mozRequestFullScreen ||
                doc.webkitRequestFullScreen || doc.msRequestFullscreen;
            return support != undefined;
        };
        Documents.isHidden = function () {
            var prop = Documents.getHiddenProp();
            if (!prop)
                return false;
            return document[prop];
        };
        Documents.getHiddenProp = function () {
            var prefixes = ['webkit', 'moz', 'ms', 'o'];
            // if 'hidden' is natively supported just return it
            if ('hidden' in document)
                return 'hidden';
            // otherwise loop over all the known prefixes until we find one
            for (var i = 0; i < prefixes.length; i++) {
                if ((prefixes[i] + 'Hidden') in document)
                    return prefixes[i] + 'Hidden';
            }
            // otherwise it's not supported
            return null;
        };
        return Documents;
    })();
    Utils.Documents = Documents;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Events = (function () {
        function Events() {
        }
        Events.debounce = function (fn, debounceDuration) {
            // summary:
            //      Returns a debounced function that will make sure the given
            //      function is not triggered too much.
            // fn: Function
            //      Function to debounce.
            // debounceDuration: Number
            //      OPTIONAL. The amount of time in milliseconds for which we
            //      will debounce the function. (defaults to 100ms)
            debounceDuration = debounceDuration || 100;
            return function () {
                if (!fn.debouncing) {
                    var args = Array.prototype.slice.apply(arguments);
                    fn.lastReturnVal = fn.apply(window, args);
                    fn.debouncing = true;
                }
                clearTimeout(fn.debounceTimeout);
                fn.debounceTimeout = setTimeout(function () {
                    fn.debouncing = false;
                }, debounceDuration);
                return fn.lastReturnVal;
            };
        };
        return Events;
    })();
    Utils.Events = Events;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Files = (function () {
        function Files() {
        }
        Files.simplifyMimeType = function (mime) {
            switch (mime) {
                case 'text/plain':
                    return 'txt';
                case 'image/jpeg':
                    return 'jpg';
                case 'application/msword':
                    return 'doc';
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    return 'docx';
                default:
                    var parts = mime.split('/');
                    return parts[parts.length - 1];
            }
        };
        return Files;
    })();
    Utils.Files = Files;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Keyboard = (function () {
        function Keyboard() {
        }
        Keyboard.getCharCode = function (e) {
            var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
            return charCode;
        };
        return Keyboard;
    })();
    Utils.Keyboard = Keyboard;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Maths;
    (function (Maths) {
        var Vector = (function () {
            function Vector(x, y) {
                this.X = x;
                this.Y = y;
            }
            Vector.prototype.get = function () {
                return new Vector(this.X, this.Y);
            };
            Vector.prototype.set = function (x, y) {
                this.X = x;
                this.Y = y;
            };
            //get X(): number {
            //    return this._X;
            //}
            //
            //set X(value: number) {
            //    this._X = value;
            //    //this.OnPropertyChanged("X");
            //}
            //
            //get Y(): number {
            //    return this._Y;
            //}
            //
            //set Y(value: number) {
            //    this._Y = value;
            //    //this.OnPropertyChanged("Y");
            //}
            Vector.prototype.add = function (v) {
                this.X += v.X;
                this.Y += v.Y;
            };
            Vector.add = function (v1, v2) {
                return new Vector(v1.X + v2.X, v1.Y + v2.Y);
            };
            Vector.prototype.sub = function (v) {
                this.X -= v.X;
                this.Y -= v.Y;
            };
            Vector.sub = function (v1, v2) {
                return new Vector(v1.X - v2.X, v1.Y - v2.Y);
            };
            Vector.prototype.mult = function (n) {
                this.X = this.X * n;
                this.Y = this.Y * n;
            };
            Vector.mult = function (v1, v2) {
                return new Vector(v1.X * v2.X, v1.Y * v2.Y);
            };
            Vector.multN = function (v1, n) {
                return new Vector(v1.X * n, v1.Y * n);
            };
            Vector.prototype.Div = function (n) {
                this.X = this.X / n;
                this.Y = this.Y / n;
            };
            Vector.div = function (v1, v2) {
                return new Vector(v1.X / v2.X, v1.Y / v2.Y);
            };
            Vector.divN = function (v1, n) {
                return new Vector(v1.X / n, v1.Y / n);
            };
            Vector.prototype.mag = function () {
                return Math.sqrt(this.X * this.X + this.Y * this.Y);
            };
            Vector.prototype.magSq = function () {
                return (this.X * this.X + this.Y * this.Y);
            };
            Vector.prototype.normalise = function () {
                var m = this.mag();
                if (m != 0 && m != 1) {
                    this.Div(m);
                }
            };
            Vector.prototype.limit = function (max) {
                if (this.magSq() > max * max) {
                    this.normalise();
                    this.mult(max);
                }
            };
            Vector.prototype.equals = function (v) {
                return (this.X == v.X && this.Y == v.Y);
            };
            Vector.prototype.heading = function () {
                var angle = Math.atan2(-this.Y, this.X);
                return -1 * angle;
            };
            Vector.random2D = function () {
                return Vector.fromAngle((Math.random() * Math.TAU));
            };
            Vector.fromAngle = function (angle) {
                return new Vector(Math.cos(angle), Math.sin(angle));
            };
            return Vector;
        })();
        Maths.Vector = Vector;
    })(Maths = Utils.Maths || (Utils.Maths = {}));
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Measurements;
    (function (Measurements) {
        var Size = (function () {
            function Size(width, height) {
                this.width = width;
                this.height = height;
            }
            return Size;
        })();
        Measurements.Size = Size;
        var Dimensions = (function () {
            function Dimensions() {
            }
            Dimensions.fitRect = function (width1, height1, width2, height2) {
                var ratio1 = height1 / width1;
                var ratio2 = height2 / width2;
                var width, height, scale;
                if (ratio1 < ratio2) {
                    scale = width2 / width1;
                    width = width1 * scale;
                    height = height1 * scale;
                }
                if (ratio2 < ratio1) {
                    scale = height2 / height1;
                    width = width1 * scale;
                    height = height1 * scale;
                }
                return new Size(Math.floor(width), Math.floor(height));
            };
            Dimensions.hitRect = function (x, y, w, h, mx, my) {
                if (mx > x && mx < (x + w) && my > y && my < (y + h)) {
                    return true;
                }
                return false;
            };
            return Dimensions;
        })();
        Measurements.Dimensions = Dimensions;
    })(Measurements = Utils.Measurements || (Utils.Measurements = {}));
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Numbers = (function () {
        function Numbers() {
        }
        Numbers.numericalInput = function (event) {
            // Allow: backspace, delete, tab and escape
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
                // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow: home, end, left, right
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                // let it happen, don't do anything
                return true;
            }
            else {
                // Ensure that it is a number and stop the keypress
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                    return false;
                }
                return true;
            }
        };
        return Numbers;
    })();
    Utils.Numbers = Numbers;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Storage = (function () {
        function Storage() {
        }
        Storage.clear = function (storageType) {
            if (storageType === void 0) { storageType = Utils.StorageType.memory; }
            switch (storageType.value) {
                case Utils.StorageType.memory.value:
                    this._memoryStorage = {};
                    break;
                case Utils.StorageType.session.value:
                    sessionStorage.clear();
                    break;
                case Utils.StorageType.local.value:
                    localStorage.clear();
                    break;
            }
        };
        Storage.clearExpired = function (storageType) {
            if (storageType === void 0) { storageType = Utils.StorageType.memory; }
            var items = this.getItems(storageType);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (this._isExpired(item)) {
                    this.remove(item.key);
                }
            }
        };
        Storage.get = function (key, storageType) {
            if (storageType === void 0) { storageType = Utils.StorageType.memory; }
            var data;
            switch (storageType.value) {
                case Utils.StorageType.memory.value:
                    data = this._memoryStorage[key];
                    break;
                case Utils.StorageType.session.value:
                    data = sessionStorage.getItem(key);
                    break;
                case Utils.StorageType.local.value:
                    data = localStorage.getItem(key);
                    break;
            }
            if (!data)
                return null;
            var item = JSON.parse(data);
            if (this._isExpired(item))
                return null;
            // useful reference
            item.key = key;
            return item;
        };
        Storage._isExpired = function (item) {
            if (new Date().getTime() < item.expiresAt) {
                return false;
            }
            return true;
        };
        Storage.getItems = function (storageType) {
            if (storageType === void 0) { storageType = Utils.StorageType.memory; }
            var items = [];
            switch (storageType.value) {
                case Utils.StorageType.memory.value:
                    var keys = Object.keys(this._memoryStorage);
                    for (var i = 0; i < keys.length; i++) {
                        var item = this.get(keys[i], Utils.StorageType.memory);
                        if (item) {
                            items.push(item);
                        }
                    }
                    break;
                case Utils.StorageType.session.value:
                    for (var i = 0; i < sessionStorage.length; i++) {
                        var key = sessionStorage.key(i);
                        var item = this.get(key, Utils.StorageType.session);
                        if (item) {
                            items.push(item);
                        }
                    }
                    break;
                case Utils.StorageType.local.value:
                    for (var i = 0; i < localStorage.length; i++) {
                        var key = localStorage.key(i);
                        var item = this.get(key, Utils.StorageType.local);
                        if (item) {
                            items.push(item);
                        }
                    }
                    break;
            }
            return items;
        };
        Storage.remove = function (key, storageType) {
            if (storageType === void 0) { storageType = Utils.StorageType.memory; }
            switch (storageType.value) {
                case Utils.StorageType.memory.value:
                    delete this._memoryStorage[key];
                    break;
                case Utils.StorageType.session.value:
                    sessionStorage.removeItem(key);
                    break;
                case Utils.StorageType.local.value:
                    localStorage.removeItem(key);
                    break;
            }
        };
        Storage.set = function (key, value, expirationSecs, storageType) {
            if (storageType === void 0) { storageType = Utils.StorageType.memory; }
            var expirationMS = expirationSecs * 1000;
            var record = new Utils.StorageItem();
            record.value = value;
            record.expiresAt = new Date().getTime() + expirationMS;
            switch (storageType.value) {
                case Utils.StorageType.memory.value:
                    this._memoryStorage[key] = JSON.stringify(record);
                    break;
                case Utils.StorageType.session.value:
                    sessionStorage.setItem(key, JSON.stringify(record));
                    break;
                case Utils.StorageType.local.value:
                    localStorage.setItem(key, JSON.stringify(record));
                    break;
            }
            return record;
        };
        Storage._memoryStorage = {};
        return Storage;
    })();
    Utils.Storage = Storage;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var StorageItem = (function () {
        function StorageItem() {
        }
        return StorageItem;
    })();
    Utils.StorageItem = StorageItem;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var StorageType = (function () {
        function StorageType(value) {
            this.value = value;
        }
        StorageType.prototype.toString = function () {
            return this.value;
        };
        StorageType.memory = new StorageType("memory");
        StorageType.session = new StorageType("session");
        StorageType.local = new StorageType("local");
        return StorageType;
    })();
    Utils.StorageType = StorageType;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Strings = (function () {
        function Strings() {
        }
        Strings.ellipsis = function (text, chars) {
            if (text.length <= chars)
                return text;
            var trimmedText = text.substr(0, chars);
            var lastSpaceIndex = trimmedText.lastIndexOf(" ");
            if (lastSpaceIndex != -1) {
                trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, lastSpaceIndex));
            }
            return trimmedText + "&hellip;";
        };
        Strings.htmlDecode = function (encoded) {
            var div = document.createElement('div');
            div.innerHTML = encoded;
            return div.firstChild.nodeValue;
        };
        return Strings;
    })();
    Utils.Strings = Strings;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Urls = (function () {
        function Urls() {
        }
        Urls.getHashParameter = function (key, doc) {
            if (!doc)
                doc = window.document;
            var regex = new RegExp("#.*[?&]" + key + "=([^&]+)(&|$)");
            var match = regex.exec(doc.location.hash);
            return (match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null);
        };
        Urls.setHashParameter = function (key, value, doc) {
            if (!doc)
                doc = window.document;
            var kvp = this.updateURIKeyValuePair(doc.location.hash.replace('#?', ''), key, value);
            var newHash = "#?" + kvp;
            var url = doc.URL;
            // remove hash value (if present).
            var index = url.indexOf('#');
            if (index != -1) {
                url = url.substr(0, url.indexOf('#'));
            }
            doc.location.replace(url + newHash);
        };
        Urls.getQuerystringParameter = function (key, w) {
            if (!w)
                w = window;
            return this.getQuerystringParameterFromString(key, w.location.search);
        };
        Urls.getQuerystringParameterFromString = function (key, querystring) {
            key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
            var match = regex.exec(querystring);
            return (match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null);
        };
        Urls.setQuerystringParameter = function (key, value, doc) {
            if (!doc)
                doc = window.document;
            var kvp = this.updateURIKeyValuePair(doc.location.hash.replace('#?', ''), key, value);
            // redirects.
            window.location.search = kvp;
        };
        Urls.updateURIKeyValuePair = function (uriSegment, key, value) {
            key = encodeURIComponent(key);
            value = encodeURIComponent(value);
            var kvp = uriSegment.split('&');
            // Array.split() returns an array with a single "" item
            // if the target string is empty. remove if present.
            if (kvp[0] == "")
                kvp.shift();
            var i = kvp.length;
            var x;
            // replace if already present.
            while (i--) {
                x = kvp[i].split('=');
                if (x[0] == key) {
                    x[1] = value;
                    kvp[i] = x.join('=');
                    break;
                }
            }
            // not found, so append.
            if (i < 0) {
                kvp[kvp.length] = [key, value].join('=');
            }
            return kvp.join('&');
        };
        Urls.getUrlParts = function (url) {
            var a = document.createElement('a');
            a.href = url;
            return a;
        };
        Urls.convertToRelativeUrl = function (url) {
            var parts = this.getUrlParts(url);
            var relUri = parts.pathname + parts.searchWithin;
            if (!relUri.startsWith("/")) {
                relUri = "/" + relUri;
            }
            return relUri;
        };
        return Urls;
    })();
    Utils.Urls = Urls;
})(Utils || (Utils = {}));
