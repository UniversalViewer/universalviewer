/*jslint browser: true, rhino :true, debug: true, white : false,
 laxbreak: true, bitwise: true, eqeqeq: true, nomen: false,
 onevar: false, plusplus: false, regexp: false, undef: true
 */

/*global window, XDomainRequest, ActiveXObject */


/*
 CORS-capable XHR for IE
 see https://github.com/Malvolio/ie.xhr for all details
 Michael S Lorton - 2011
 */
var IEXMLHttpRequest = window.XDomainRequest && function() {
        var xdr = new XDomainRequest();
        if (!xdr) {
            return null;
        }


        var request;

        var changeState = function(state) {
            if (state !== request.readyState) {
                request.readyState = state;
                if (request.onreadystatechange) {
                    request.onreadystatechange();
                }
            }
        };

        xdr.onerror = function() {
            request.status = 500;
            request.statusText = 'ERROR';
            changeState(4);
        };
        xdr.ontimeout = function() {
            request.status = 408;
            request.statusText = 'TIMEOUT';
            changeState(4);
        };
        xdr.onprogress = function() {
            changeState(3);
        };
        xdr.onload = function() {
            request.status = 200;
            request.statusText = 'OK';
            request.responseText = xdr.responseText;
            request.responseXML = new ActiveXObject("Microsoft.XMLDOM");
            request.responseXML.async="false";
            request.responseXML.loadXML(xdr.responseText);
            changeState(4);
        };


        request = {
            open : function(method, url, async, user, password) {
                xdr.open(method, url);
                changeState(1);
            },
            setRequestHeader : function() {
                // can I do this?
            },
            send : function(data) {
                xdr.send(data);
                changeState(2);
            },
            abort : function() {
                xdr.abort();
            },
            status : '',
            statusText : '',
            getResponseHeader : function() {
            },
            getAllResponseHeaders : function() {
            },
            responseText : '',
            responseXML : '',
            readyState  : 0,
            onreadystatechange : null
        };
        return request;
    };
